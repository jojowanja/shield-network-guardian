
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  actionPath?: string;
  actionRequired?: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New device connected',
      description: 'iPhone 13 Pro has connected to your network',
      type: 'info',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      actionPath: '/devices'
    },
    {
      id: '2',
      title: 'Security Alert',
      description: 'Unusual login attempt detected',
      type: 'warning',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: false,
      actionPath: '/security',
      actionRequired: true
    },
    {
      id: '3',
      title: 'Network Status',
      description: 'Smart Connect optimized your network',
      type: 'success',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false,
      actionPath: '/analytics'
    }
  ]);

  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionPath) {
      navigate(notification.actionPath);
    }
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
    removeNotification,
    addNotification
  };
};
