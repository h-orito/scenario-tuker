package dev.wolfort.scenariotuker.domain.model.participate

import dev.wolfort.scenariotuker.domain.model.paging.PagingQuery

interface ParticipateRepository {

    fun findAll(): Participates

    fun findById(id: Int): Participate?

    fun findAllByScenarioId(scenarioId: Int, paging: PagingQuery? = null): Participates

    fun findAllByGameSystemId(gameSystemId: Int): Participates

    fun findAllByRuleBookId(ruleBookId: Int, paging: PagingQuery? = null): Participates

    fun findAllByUserId(userId: Int): Participates

    fun register(participate: Participate): Participate

    fun update(participate: Participate): Participate

    fun delete(id: Int)

    fun updateRuleBookId(sourceRuleBookId: Int, destRuleBookId: Int)

    fun updateScenarioId(sourceScenarioId: Int, destScenarioId: Int)

    fun updateGameSystemId(sourceGameSystemId: Int, destGameSystemId: Int)
}