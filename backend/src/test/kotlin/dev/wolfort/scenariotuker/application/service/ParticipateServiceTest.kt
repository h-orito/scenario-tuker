package dev.wolfort.scenariotuker.application.service

import dev.wolfort.scenariotuker.domain.model.participate.Participate
import dev.wolfort.scenariotuker.domain.model.participate.ParticipateRepository
import dev.wolfort.scenariotuker.domain.model.scenario.ScenarioRepository
import dev.wolfort.scenariotuker.domain.model.user.UserRepository
import dev.wolfort.scenariotuker.fw.exception.SystemException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify

internal class ParticipateServiceTest {

    private val ownerId = 1
    private val otherUserId = 2

    private fun participate(userId: Int) = Participate(
        id = 10,
        scenarioId = 100,
        gameSystemId = null,
        userId = userId,
        ruleBookIds = emptyList(),
        roleNames = emptyList(),
        dispOrder = 0,
        impression = null
    )

    private fun service(participateRepository: ParticipateRepository) = ParticipateService(
        participateRepository = participateRepository,
        scenarioRepository = mock<ScenarioRepository> { on { findById(any()) } doReturn mock() },
        userRepository = mock<UserRepository> { on { findById(any()) } doReturn mock() }
    )

    @Test
    fun `他人の参加記録は更新できない`() {
        val repository = mock<ParticipateRepository> {
            on { findById(10) } doReturn participate(ownerId)
        }

        assertThrows<SystemException> {
            service(repository).update(participate(otherUserId))
        }
        verify(repository, never()).update(any())
    }

    @Test
    fun `自分の参加記録は更新できる`() {
        val updated = participate(ownerId)
        val repository = mock<ParticipateRepository> {
            on { findById(10) } doReturn updated
            on { update(any()) } doReturn updated
        }

        assertEquals(updated, service(repository).update(participate(ownerId)))
        verify(repository).update(updated)
    }
}
