package dev.wolfort.scenariotuker.fw.security

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import dev.wolfort.scenariotuker.api.UserController
import dev.wolfort.scenariotuker.application.service.AuthorService
import dev.wolfort.scenariotuker.application.service.GameSystemService
import dev.wolfort.scenariotuker.application.service.ParticipateService
import dev.wolfort.scenariotuker.application.service.RuleBookService
import dev.wolfort.scenariotuker.application.service.ScenarioService
import dev.wolfort.scenariotuker.application.service.UserService
import org.mockito.kotlin.any
import org.mockito.kotlin.argThat
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.SpringBootConfiguration
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.head
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController

@WebMvcTest(properties = ["security.corsClientUrls=http://localhost:3000"])
class SecurityConfigTest {

    // DB や Firebase を起動しないよう、セキュリティ設定とダミーのコントローラーだけで組み立てる
    @SpringBootConfiguration
    @EnableConfigurationProperties
    @Import(SecurityConfig::class, LoginFilter::class, DummyController::class, UserController::class)
    class TestConfig

    @RestController
    class DummyController {
        @GetMapping("/scenarios/1")
        fun get() = "ok"

        @PostMapping("/scenarios")
        fun post(@AuthenticationPrincipal user: ScenarioTukerUser?) = user?.uid ?: "anonymous"

        @PutMapping("/scenarios")
        fun put() = "ok"

        @DeleteMapping("/scenarios/1")
        fun delete() = "ok"

        @PutMapping("/scenarios/1/integrate")
        fun integrate() = "ok"
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var userDetailService: ScenarioTukerUserDetailService

    // UserController の依存
    @MockitoBean
    private lateinit var userService: UserService
    @MockitoBean
    private lateinit var participateService: ParticipateService
    @MockitoBean
    private lateinit var scenarioService: ScenarioService
    @MockitoBean
    private lateinit var gameSystemService: GameSystemService
    @MockitoBean
    private lateinit var ruleBookService: RuleBookService
    @MockitoBean
    private lateinit var authorService: AuthorService

    @MockitoBean
    private lateinit var firebaseTokenVerifier: FirebaseTokenVerifier

    @BeforeEach
    fun setUp() {
        whenever(firebaseTokenVerifier.verify(any())).thenAnswer {
            when (it.getArgument<String>(0)) {
                "registered" -> "registered-uid"
                "unregistered" -> "unregistered-uid"
                else -> throw IllegalArgumentException("invalid token")
            }
        }
        whenever(userDetailService.loadUserByUsername("registered-uid"))
            .thenReturn(ScenarioTukerUser("registered-uid", Authority.User))
        whenever(userDetailService.loadUserByUsername("unregistered-uid"))
            .thenThrow(UsernameNotFoundException("not found"))
    }

    private val writeRequests: List<() -> MockHttpServletRequestBuilder> = listOf(
        { post("/scenarios") },
        { put("/scenarios") },
        { delete("/scenarios/1") },
        { put("/scenarios/1/integrate") }
    )

    @Test
    fun `未ログインでも閲覧できる`() {
        mockMvc.perform(get("/scenarios/1")).andExpect(status().isOk)
        mockMvc.perform(head("/scenarios/1")).andExpect(status().isOk)
    }

    @Test
    fun `未ログインでは登録・更新・削除・統合できない`() {
        writeRequests.forEach {
            mockMvc.perform(it()).andExpect(status().isForbidden)
        }
    }

    @Test
    fun `ユーザー登録していないアカウントでは登録・更新・削除・統合できない`() {
        writeRequests.forEach {
            mockMvc.perform(it().header("Authorization", "Bearer unregistered")).andExpect(status().isForbidden)
        }
    }

    @Test
    fun `ログインしていれば登録・更新・削除・統合できる`() {
        writeRequests.forEach {
            mockMvc.perform(it().header("Authorization", "Bearer registered")).andExpect(status().isOk)
        }
    }

    @Test
    fun `ログインユーザーをコントローラーで受け取れる`() {
        mockMvc.perform(post("/scenarios").header("Authorization", "Bearer registered"))
            .andExpect(status().isOk)
            .andExpect(content().string("registered-uid"))
    }

    @Test
    fun `不正なトークンは 401 になる`() {
        mockMvc.perform(post("/scenarios").header("Authorization", "Bearer invalid"))
            .andExpect(status().isUnauthorized)
    }

    private fun registerRequest(authorization: String?) = post("/users")
        .contentType(MediaType.APPLICATION_JSON)
        // 他人の uid を指定しても、トークンの uid で登録される
        .content("""{"uid": "victim-uid", "name": "なまえ"}""")
        .apply { authorization?.let { header("Authorization", it) } }

    @Test
    fun `ユーザー登録は未登録のアカウントでもでき、トークンの uid で登録される`() {
        mockMvc.perform(registerRequest("Bearer unregistered")).andExpect(status().isOk)
        verify(userService).register(argThat { uid == "unregistered-uid" })
    }

    @Test
    fun `登録済みのアカウントのユーザー登録もトークンの uid で行われる`() {
        mockMvc.perform(registerRequest("Bearer registered")).andExpect(status().isOk)
        verify(userService).register(argThat { uid == "registered-uid" })
    }

    @Test
    fun `未ログインではユーザー登録できない`() {
        mockMvc.perform(registerRequest(null)).andExpect(status().isForbidden)
        verify(userService, never()).register(any())
    }
}
