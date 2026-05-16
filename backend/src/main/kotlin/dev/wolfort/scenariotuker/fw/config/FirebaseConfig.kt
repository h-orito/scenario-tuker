package dev.wolfort.scenariotuker.fw.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import java.io.FileInputStream
import jakarta.annotation.PostConstruct


@Configuration
class FirebaseConfig {

    @Value("\${firebase.adminsdk.secretkey.path}")
    private val firebaseAdminsdkSecretkeyPath: String? = null

    @Value("\${firebase.database.url}")
    private val firebaseDatabaseUrl: String? = null

    @PostConstruct
    fun init() {
        /**
         * https://firebase.google.com/docs/server/setup
         *
         * Create service account , download json
         */
        if (FirebaseApp.getApps().isNotEmpty()) {
            return
        }
        if (firebaseAdminsdkSecretkeyPath.isNullOrBlank()) return
        if (firebaseDatabaseUrl.isNullOrBlank()) return
        val serviceAccount = FileInputStream(firebaseAdminsdkSecretkeyPath)
        val options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setDatabaseUrl(firebaseDatabaseUrl)
            .build()
        FirebaseApp.initializeApp(options)
    }
}
