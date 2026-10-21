package dev.wolfort.scenariotuker.application.coordinator

import dev.wolfort.scenariotuker.application.service.ParticipateService
import dev.wolfort.scenariotuker.application.service.UserService
import dev.wolfort.scenariotuker.domain.model.participate.DisclosureRange
import dev.wolfort.scenariotuker.domain.model.participate.Participate
import dev.wolfort.scenariotuker.domain.model.participate.ParticipateImpression
import dev.wolfort.scenariotuker.domain.model.user.User
import dev.wolfort.scenariotuker.fw.security.Authority
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock

internal class ParticipateCoordinatorTest {

    private val owner = user(1)
    private val other = user(2)

    private fun user(id: Int) = User(
        id = id,
        uid = "uid-$id",
        authority = Authority.User,
        name = "user$id",
        twitter = null,
        introduction = null
    )

    private fun participate(range: DisclosureRange) = Participate(
        id = 10,
        scenarioId = 100,
        gameSystemId = null,
        userId = owner.id,
        ruleBookIds = emptyList(),
        roleNames = emptyList(),
        dispOrder = 0,
        impression = ParticipateImpression(hasSpoiler = true, disclosureRange = range, content = "感想の本文")
    )

    private fun coordinator(participate: Participate?) = ParticipateCoordinator(
        participateService = mock<ParticipateService> { on { findById(10) } doReturn participate },
        userService = mock()
    )

    @ParameterizedTest
    @EnumSource(DisclosureRange::class)
    fun `持ち主以外には感想の本文を返さない`(range: DisclosureRange) {
        val coordinator = coordinator(participate(range))

        listOf(null, other).forEach { viewer ->
            val result = coordinator.findByIdForViewer(10, viewer)!!
            assertEquals("", result.impression!!.content)
            // 公開範囲やネタバレの有無は画面の表示に使うので残す
            assertEquals(range, result.impression!!.disclosureRange)
            assertEquals(true, result.impression!!.hasSpoiler)
        }
    }

    @Test
    fun `持ち主には感想の本文を返す`() {
        val result = coordinator(participate(DisclosureRange.OnlyMe)).findByIdForViewer(10, owner)!!
        assertEquals("感想の本文", result.impression!!.content)
    }

    @Test
    fun `存在しない通過記録は null`() {
        assertNull(coordinator(null).findByIdForViewer(10, owner))
    }
}
