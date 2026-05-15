package dev.wolfort.scenariotuker

import org.mockito.kotlin.whenever
import dev.wolfort.scenariotuker.fw.config.FirebaseConfig
import dev.wolfort.scenariotuker.fw.interceptor.ScenarioTukerUserInfoUtil
import dev.wolfort.scenariotuker.fw.security.ScenarioTukerUser
import org.dbflute.hook.AccessContext
import org.junit.jupiter.api.BeforeEach
import org.springframework.test.context.bean.override.mockito.MockitoBean
import java.time.LocalDateTime

open class ScenarioTukerTest {

    @MockitoBean
    lateinit var firebaseConfig: FirebaseConfig

    @BeforeEach
    fun setUp() {
        // firebase関連はmockにする
        whenever(firebaseConfig.init()).then { }
        whenever(firebaseConfig.firebaseDatabase()).thenReturn(null)
        // set access context
        setAccessContext()
    }

    private fun setAccessContext() {
        if (AccessContext.isExistAccessContextOnThread()) {
            // 既に設定されていたら何もしないで次へ
            // (二度呼び出しされたときのために念のため)
            return
        }
        // [アクセス日時]
        val accessLocalDateTime = LocalDateTime.now()

        // [アクセスユーザ]
        val userInfo: ScenarioTukerUser? = ScenarioTukerUserInfoUtil.getUserInfo()
        val accessUser = userInfo?.username ?: "not login user"

        val context = AccessContext()
        context.accessLocalDateTime = accessLocalDateTime
        context.accessUser = accessUser
        AccessContext.setAccessContextOnThread(context)
    }
}