import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export interface AppNotification {
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
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    // Listens to 1:1 Notifications. (Broadcast filtering will be left for Phase 2/App integration).
    const q = query(
      collection(db, 'notificacoes_gamificacao'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notificacoes_gamificacao', id), { read: true });
    } catch (e) {
      console.error("Error marking notification as read:", e);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const notif of unread) {
       await markAsRead(notif.id);
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
