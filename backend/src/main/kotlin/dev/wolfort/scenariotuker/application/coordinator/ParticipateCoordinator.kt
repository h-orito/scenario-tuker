package dev.wolfort.scenariotuker.application.coordinator

import dev.wolfort.scenariotuker.application.service.ParticipateService
import dev.wolfort.scenariotuker.application.service.UserService
import dev.wolfort.scenariotuker.domain.model.participate.Participate
import dev.wolfort.scenariotuker.domain.model.participate.ParticipateImpression
import dev.wolfort.scenariotuker.domain.model.user.User
import org.springframework.stereotype.Service

@Service
class ParticipateCoordinator(
    private val participateService: ParticipateService,
    private val userService: UserService,
) {
    // 感想の本文は持ち主以外には返さない（閲覧可否を確かめる getImpressionIfAllowed で別途取得させる）
    fun findByIdForViewer(participateId: Int, myself: User?): Participate? {
        val participate = participateService.findById(participateId) ?: return null
        if (participate.userId == myself?.id) return participate
        return participate.copy(impression = participate.impression?.copy(content = ""))
    }

    fun getImpressionIfAllowed(participateId: Int, myself: User?): ParticipateImpression? {
        val participate = participateService.findById(participateId) ?: return null
        participate.impression ?: return null
        val user = userService.findById(participate.userId)!!
        return if (participate.canViewImpression(user, myself)) participate.impression
        else null
    }
}