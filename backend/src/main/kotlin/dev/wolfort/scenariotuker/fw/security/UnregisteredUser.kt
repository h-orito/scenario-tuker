package dev.wolfort.scenariotuker.fw.security

/**
 * Firebase のトークンは検証できたが、まだユーザー登録していないアカウント
 */
data class UnregisteredUser(
    val uid: String
)
