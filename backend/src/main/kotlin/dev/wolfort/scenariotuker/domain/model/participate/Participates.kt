package dev.wolfort.scenariotuker.domain.model.participate

data class Participates(
    val list: List<Participate>,
    val allRecordCount: Int = 0,
    val allPageCount: Int = 0,
    val existPrePage: Boolean = false,
    val existNextPage: Boolean = false,
    val currentPageNum: Int = 0
)
