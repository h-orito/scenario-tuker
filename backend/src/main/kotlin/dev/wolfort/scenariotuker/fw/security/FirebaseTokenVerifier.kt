package dev.wolfort.scenariotuker.fw.security

import com.google.firebase.auth.FirebaseAuth
import org.springframework.stereotype.Component

@Component
class FirebaseTokenVerifier {

    // トークンを検証して uid を返す（改竄・有効期限切れなら例外）
    fun verify(token: String): String = FirebaseAuth.getInstance().verifyIdToken(token).uid
}
