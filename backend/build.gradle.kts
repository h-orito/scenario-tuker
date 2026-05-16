import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.5.14"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("jvm") version "2.1.20"
    kotlin("plugin.spring") version "2.1.20"
    id("com.google.cloud.tools.jib") version "3.4.4"
}

group = "dev.wolfort"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_21

apply(plugin = "kotlin")
apply(plugin = "io.spring.dependency-management")

repositories {
    mavenCentral()
}

sourceSets {
    getByName("main").java.srcDirs("src/main/kotlin")
    getByName("test").java.srcDirs("src/test")
    getByName("main").resources.srcDirs("src/main/resources")
    getByName("test").resources.srcDirs("src/test/resources")
}

dependencies {
    // kotlin
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    // spring
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-aop")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    // dbflute (uses HikariCP from spring-boot-starter-data-jpa)
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.dbflute:dbflute-runtime:1.3.1")
    // mysql
    implementation("com.mysql:mysql-connector-j:9.7.0")
    // firebase
    implementation("com.google.firebase:firebase-admin:9.9.0")
    // twitter
    implementation("io.github.redouane59.twitter:twittered:2.23")
    // dotenv (loads .env into Spring property sources for local dev only;
    // production uses real env vars from the k8s manifest)
    developmentOnly("me.paulschwarz:springboot3-dotenv:5.1.0")
    // mockito
    testImplementation("org.mockito.kotlin:mockito-kotlin:6.3.0")
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        freeCompilerArgs.add("-Xjsr305=strict")
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
    }
}

tasks.withType<Copy> {
    duplicatesStrategy = DuplicatesStrategy.INCLUDE
}

tasks.withType<Test> {
    useJUnitPlatform()
}

jib {
    from {
        image = "eclipse-temurin:21-jre"
        platforms {
            platform {
                architecture = "arm64"
                os = "linux"
            }
        }
    }
    to {
        image = "ghcr.io/h-orito/scenario-tuker"
    }
    container {
        jvmFlags = listOf(
            "-server",
            "-Djava.awt.headless=true",
            "-Dspring.profiles.active=production"
        )
        creationTime = "USE_CURRENT_TIMESTAMP"
    }
}
