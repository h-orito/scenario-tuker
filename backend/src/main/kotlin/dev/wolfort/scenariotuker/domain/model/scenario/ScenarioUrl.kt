package dev.wolfort.scenariotuker.domain.model.scenario

import dev.wolfort.scenariotuker.fw.exception.SystemException
import java.net.URI
import java.net.URISyntaxException

data class ScenarioUrl(
    val value: String
) {
    private val availableDomains = listOf(
        "booth.pm",
        "talto.cc",
        "www.pixiv.net",
        "character-sheets.appspot.com",
        "twitter.com",
        "x.com",
        "www.dlsite.com",
        "seesaawiki.jp",
        "www.drivethrurpg.com",
        "drivethrurpg.com"
    )

    fun assert() {
        // 未入力（フロントエンドは空文字を送る）は許可する
        if (value.isEmpty()) return
        if (!isAvailable()) {
            throw SystemException("許可されていないURLです。 url: $value")
        }
    }

    /**
     * http / https で、ホストが許可ドメインと一致する（またはそのサブドメインである）か
     */
    fun isAvailable(): Boolean {
        val uri = try {
            URI(value)
        } catch (e: URISyntaxException) {
            return false
        }
        val scheme = uri.scheme?.lowercase() ?: return false
        if (scheme != "http" && scheme != "https") return false
        if (uri.rawUserInfo != null) return false
        val host = uri.host?.lowercase() ?: return false
        return availableDomains.any { host == it || host.endsWith(".$it") }
    }
}
