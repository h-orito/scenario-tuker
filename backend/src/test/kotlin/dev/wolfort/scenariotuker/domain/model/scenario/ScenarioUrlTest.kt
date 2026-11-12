package dev.wolfort.scenariotuker.domain.model.scenario

import dev.wolfort.scenariotuker.fw.exception.SystemException
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

internal class ScenarioUrlTest {

    @Test
    fun `許可ドメインのURLは許可される`() {
        listOf(
            "https://booth.pm/ja/items/123",
            "https://example-shop.booth.pm/items/123",
            "https://booth.pm",
            "http://talto.cc/projects/abc",
            "https://www.pixiv.net/artworks/1?x=1#y",
            "https://X.COM/user/status/1",
            "https://drivethrurpg.com/product/1",
            "https://www.dlsite.com/home/work/=/product_id/RJ000.html",
            "https://booth.pm/ja/items/シナリオ"
        ).forEach {
            assertTrue(ScenarioUrl(it).isAvailable(), it)
            assertDoesNotThrow { ScenarioUrl(it).assert() }
        }
    }

    @Test
    fun `許可ドメイン以外のURLは拒否される`() {
        listOf(
            "https://evilbooth.pm/items/1",
            "https://evilx.com/",
            "https://booth.pm.example.com/",
            "https://example.com/https://booth.pm/",
            "javascript:alert(1)//https://booth.pm/",
            "ftp://booth.pm/file",
            "https://booth.pm@example.com/",
            "https://user:pass@booth.pm/",
            "//booth.pm/items/1",
            "booth.pm/items/1",
            "https://booth.pm/a b",
            "https://pixiv.net/artworks/1"
        ).forEach {
            assertFalse(ScenarioUrl(it).isAvailable(), it)
            assertThrows<SystemException>(it) { ScenarioUrl(it).assert() }
        }
    }

    @Test
    fun `未入力は許可される`() {
        assertDoesNotThrow { ScenarioUrl("").assert() }
    }
}
