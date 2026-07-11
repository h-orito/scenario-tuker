package dev.wolfort.scenariotuker.api.response.participate

import dev.wolfort.scenariotuker.domain.model.author.Authors
import dev.wolfort.scenariotuker.domain.model.gamesystem.GameSystems
import dev.wolfort.scenariotuker.domain.model.participate.Participates
import dev.wolfort.scenariotuker.domain.model.rulebook.RuleBooks
import dev.wolfort.scenariotuker.domain.model.scenario.Scenarios
import dev.wolfort.scenariotuker.domain.model.user.Users

data class ParticipatesResponse(
    val list: List<ParticipateResponse>,
    val allRecordCount: Int = 0,
    val allPageCount: Int = 0,
    val existPrePage: Boolean = false,
    val existNextPage: Boolean = false,
    val currentPageNum: Int = 0
) {

    constructor(
        participates: Participates,
        scenarios: Scenarios,
        gameSystems: GameSystems,
        ruleBooks: RuleBooks,
        authors: Authors,
        users: Users
    ) : this(
        list = participates.list.map { participate ->
            val scenario = scenarios.list.first { it.id == participate.scenarioId }
            val user = users.list.first { it.id == participate.userId }
            val gameSystem = gameSystems.list.find { it.id == participate.gameSystemId }
            val ruleBookList = ruleBooks.list.filter { participate.ruleBookIds.contains(it.id) }
            val authorList = authors.list.filter { scenario.authorIds.contains(it.id) }
            ParticipateResponse(participate, scenario, gameSystems.list, ruleBookList, authorList, user)
        },
        allRecordCount = participates.allRecordCount,
        allPageCount = participates.allPageCount,
        existPrePage = participates.existPrePage,
        existNextPage = participates.existNextPage,
        currentPageNum = participates.currentPageNum
    )

    companion object {
        fun ofEmpty() = ParticipatesResponse(emptyList())
    }
}
