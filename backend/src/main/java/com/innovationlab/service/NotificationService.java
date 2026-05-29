package com.innovationlab.service;

import com.innovationlab.model.entity.Notification;
import com.innovationlab.repository.NotificationRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepo;

    public NotificationService(NotificationRepository notificationRepo) {
        this.notificationRepo = notificationRepo;
    }

    public Notification createNotification(String userId, String type, String message, String link) {
        Notification notif = new Notification(
            UUID.randomUUID().toString(), userId, type, message, link
        );
        return notificationRepo.save(notif);
    }

    public List<Notification> getNotifications(String userId, int page, int limit) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(
            userId, PageRequest.of(page, limit)
        );
    }

    public long getUnreadCount(String userId) {
        return notificationRepo.countByUserIdAndReadFalse(userId);
    }

    public void markRead(String notificationId, String userId) {
        notificationRepo.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setRead(true);
                notificationRepo.save(n);
            }
        });
    }

    public void markAllRead(String userId) {
        notificationRepo.markAllReadByUserId(userId);
    }
}
