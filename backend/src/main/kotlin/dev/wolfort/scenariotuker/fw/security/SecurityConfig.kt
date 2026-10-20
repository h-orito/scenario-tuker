package dev.wolfort.scenariotuker.fw.security

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authorization.AuthorizationDecision
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.security.web.access.intercept.AuthorizationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@ConfigurationProperties(prefix = "security")
class SecurityConfig {

    // CORSを許可するドメイン
    lateinit var corsClientUrls: List<String>

    @Bean
    @Throws(Exception::class)
    fun filterChain(http: HttpSecurity, loginFilter: LoginFilter): SecurityFilterChain {
        http
            // 認可の判定より前にログインユーザーを解決する
            .addFilterBefore(loginFilter, AuthorizationFilter::class.java)
            .authorizeHttpRequests {
                it
                    .requestMatchers(HttpMethod.GET, "/**").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // ユーザー登録はまだ登録していないアカウントも呼ぶ
                    .requestMatchers(HttpMethod.POST, "/users")
                    .access { authentication, _ ->
                        AuthorizationDecision(authentication.get()?.principal is FirebaseAccount)
                    }
                    // 登録・更新・削除・統合はログイン必須
                    .anyRequest()
                    .access { authentication, _ ->
                        AuthorizationDecision(authentication.get()?.principal is ScenarioTukerUser)
                    }
            }.exceptionHandling {
                it
                    .authenticationEntryPoint(authenticationEntryPoint())
                    .accessDeniedHandler(accessDeniedHandler())
            }.csrf {
                it.disable()
            }.cors {
                it.configurationSource(getCorsConfigurationSource())
            }
        return http.build()
    }

    // LoginFilter はセキュリティのフィルタチェーンに組み込むので、サーブレットフィルタとしては登録しない
    @Bean
    fun loginFilterRegistration(loginFilter: LoginFilter): FilterRegistrationBean<LoginFilter> {
        return FilterRegistrationBean(loginFilter).apply { isEnabled = false }
    }

    private fun authenticationEntryPoint(): AuthenticationEntryPoint {
        return AuthenticationEntryPoint()
    }

    private fun accessDeniedHandler(): AccessDeniedHandler {
        return AccessDeniedHandler()
    }

    /**
     * see https://rennnosukesann.hatenablog.com/entry/2019/09/18/235731
     */
    private fun getCorsConfigurationSource(): CorsConfigurationSource {
        val corsConfiguration = CorsConfiguration()

        // CORSを許可するURLの登録(Access-Control-Allow-Origin)
        this.corsClientUrls.forEach { corsConfiguration.addAllowedOrigin(it) }

        // 許可するHeaderの登録(Access-Control-Allow-Headers)
        corsConfiguration.addAllowedHeader(CorsConfiguration.ALL)

        // 許可するMethodの登録(Access-Control-AllowMethods)
        corsConfiguration.addAllowedMethod(CorsConfiguration.ALL)

        // 認証情報送信許可の登録(Access-Control-Allow-Credentials)
        corsConfiguration.allowCredentials = true

        val corsSource = UrlBasedCorsConfigurationSource()

        // どのパスに上記ルールを適用するか
        corsSource.registerCorsConfiguration("/**", corsConfiguration)

        return corsSource
    }
}