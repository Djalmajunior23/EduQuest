import { api } from '../lib/api';


import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'INFO' | 'ALERT' | 'REMINDER' | 'ACHIEVEMENT' | 'ADMIN' | 'PEDAGOGICAL' | 'WELCOME';
  read: boolean;
  actionUrl?: string;
  senderId?: string;
  createdAt: any;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    if (!user || !profile || !profile.tenantId) return;

    const { data, error } = await api
      .from('notificacoes')
      .select('*')
      .eq('tenant_id', profile.tenantId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setNotifications(data.map(d => ({
        id: d.id,
        userId: d.user_id,
        title: d.title,
        body: d.body,
        type: d.type,
        read: d.read,
        actionUrl: d.action_url,
        senderId: d.sender_id,
        createdAt: d.created_at
      })));
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    if (!profile || !profile.tenantId) return;

    fetchNotifications();

    const channel = api
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notificacoes',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      api.removeChannel(channel);
    };
  }, [user, profile]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await api
        .from('notificacoes')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      fetchNotifications();
    } catch (e) {
      console.error("Error marking notification as read:", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await api
        .from('notificacoes')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);
      
      if (error) throw error;
      fetchNotifications();
    } catch (e) {
      console.error("Error marking all notifications as read:", e);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
