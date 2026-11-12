package dev.wolfort.scenariotuker.application.service

import dev.wolfort.scenariotuker.domain.model.author.AuthorRepository
import dev.wolfort.scenariotuker.domain.model.gamesystem.GameSystemRepository
import dev.wolfort.scenariotuker.domain.model.participate.ParticipateRepository
import dev.wolfort.scenariotuker.domain.model.scenario.Scenario
import dev.wolfort.scenariotuker.domain.model.scenario.ScenarioRepository
import dev.wolfort.scenariotuker.domain.model.scenario.ScenarioType
import dev.wolfort.scenariotuker.domain.model.scenario.ScenarioUrl
import dev.wolfort.scenariotuker.domain.model.user.UserRepository
import dev.wolfort.scenariotuker.fw.exception.SystemException
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify

internal class ScenarioServiceTest {

    private fun scenario(url: String?) = Scenario(
        id = 1,
        name = "シナリオ",
        dictionaryNames = emptyList(),
        type = ScenarioType.MurderMystery,
        url = url?.let { ScenarioUrl(it) },
        gameSystemIds = emptyList(),
        authorIds = emptyList()
    )

    private fun service(scenarioRepository: ScenarioRepository) = ScenarioService(
        scenarioRepository = scenarioRepository,
        gameSystemRepository = mock<GameSystemRepository>(),
        authorRepository = mock<AuthorRepository>(),
        participateRepository = mock<ParticipateRepository>(),
        userRepository = mock<UserRepository>()
    )

    @Test
    fun `許可されていないURLのシナリオは登録できない`() {
        val repository = mock<ScenarioRepository>()
        assertThrows<SystemException> {
            service(repository).register(scenario("https://example.com/"))
        }
        verify(repository, never()).register(any())
    }

    @Test
    fun `許可されていないURLのシナリオは更新できない`() {
        val repository = mock<ScenarioRepository>()
        assertThrows<SystemException> {
            service(repository).update(scenario("https://evilbooth.pm/"))
        }
        verify(repository, never()).update(any())
    }
}
