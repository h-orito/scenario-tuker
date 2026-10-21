package dev.wolfort.scenariotuker.domain.model.participate

import dev.wolfort.scenariotuker.domain.model.user.User

data class Participate(
    val id: Int,
    val scenarioId: Int,
    val gameSystemId: Int?,
    val userId: Int,
    val ruleBookIds: List<Int>,
    val roleNames: List<String>,
    val dispOrder: Int,
    val impression: ParticipateImpression?,
    val term: ParticipateTerm? = null,
    val playerNum: Int? = null,
    val gameMaster: String? = null,
    val playerNames: String? = null,
    val requiredHours: Int? = null,
    val memo: String? = null
) {
    // 感想の本文を伏せる（公開範囲・ネタバレ有無は残す）。本文は閲覧可否を確かめる API で別途取得させる
    fun withoutImpressionContent(): Participate = copy(impression = impression?.copy(content = ""))

    fun canViewImpression(
        owner: User,
        myself: User?,
    ): Boolean =
        impression?.canView(owner, myself) ?: false
}
