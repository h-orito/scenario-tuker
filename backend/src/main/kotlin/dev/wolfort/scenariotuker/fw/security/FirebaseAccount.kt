package dev.wolfort.scenariotuker.fw.security

/**
 * Firebase のトークンを検証できたアカウント（ユーザー登録済みかどうかは問わない）
 */
sealed interface FirebaseAccount {
    val uid: String
}
