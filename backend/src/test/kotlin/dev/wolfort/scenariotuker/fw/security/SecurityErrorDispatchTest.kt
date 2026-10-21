package dev.wolfort.scenariotuker.fw.security

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.whenever
import org.springframework.boot.autoconfigure.ImportAutoConfiguration
import org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration
import org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration
import org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.http.HttpStatus
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

/**
 * エラー時の /error への転送 (ERROR ディスパッチ) は MockMvc では起きないため、実際に Tomcat を起動して確認する
 */
@SpringBootTest(
    classes = [SecurityErrorDispatchTest.TestConfig::class],
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    // 本番と同じ context-path にする
    properties = ["security.corsClientUrls=http://localhost:3000", "server.servlet.context-path=/stuker-api"]
)
class SecurityErrorDispatchTest {

    // DB や Firebase を起動しないよう、Web とセキュリティに必要な自動設定だけ読み込む
    @Configuration
    @EnableConfigurationProperties
    @ImportAutoConfiguration(
        ServletWebServerFactoryAutoConfiguration::class,
        DispatcherServletAutoConfiguration::class,
        WebMvcAutoConfiguration::class,
        ErrorMvcAutoConfiguration::class,
        HttpMessageConvertersAutoConfiguration::class,
        JacksonAutoConfiguration::class,
        SecurityAutoConfiguration::class,
        SecurityFilterAutoConfiguration::class
    )
    @Import(SecurityConfig::class, LoginFilter::class, DummyController::class)
    class TestConfig

    @RestController
    class DummyController {
        @PostMapping("/scenarios/bad-request")
        fun badRequest(): String = throw ResponseStatusException(HttpStatus.BAD_REQUEST)

        @PostMapping("/scenarios/error")
        fun error(): String = throw IllegalStateException("error")
    }

    @LocalServerPort
    private var port: Int = 0

    @MockitoBean
    private lateinit var userDetailService: ScenarioTukerUserDetailService

    @MockitoBean
    private lateinit var firebaseTokenVerifier: FirebaseTokenVerifier

    @BeforeEach
    fun setUp() {
        whenever(firebaseTokenVerifier.verify(any())).thenAnswer {
            when (it.getArgument<String>(0)) {
                "registered" -> "registered-uid"
                else -> throw IllegalArgumentException("invalid token")
            }
        }
        whenever(userDetailService.loadUserByUsername("registered-uid"))
            .thenReturn(ScenarioTukerUser("registered-uid", Authority.User))
        whenever(userDetailService.loadUserByUsername("unregistered-uid"))
            .thenThrow(UsernameNotFoundException("not found"))
    }

    private fun post(path: String, token: String?): Int {
        val request = HttpRequest.newBuilder(URI("http://localhost:$port/stuker-api$path"))
            .POST(HttpRequest.BodyPublishers.noBody())
            .apply { token?.let { header("Authorization", "Bearer $it") } }
            .build()
        return HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.discarding()).statusCode()
    }

    @Test
    fun `ログインユーザーの書き込みが 400 になったときは 400 のまま返る`() {
        assertEquals(400, post("/scenarios/bad-request", "registered"))
    }

    @Test
    fun `ログインユーザーの書き込みでサーバーエラーになったときは 500 のまま返る`() {
        assertEquals(500, post("/scenarios/error", "registered"))
    }

    @Test
    fun `未ログインの書き込みは 403 で返る`() {
        assertEquals(403, post("/scenarios/error", null))
    }

    @Test
    fun `不正なトークンは 401 で返る`() {
        assertEquals(401, post("/scenarios/error", "invalid"))
    }
}
