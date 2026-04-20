import React, { useState } from 'react';
import { Bell, CheckCircle, Info, Trophy, AlertTriangle, MessageSquare, ShieldAlert, BookOpen } from 'lucide-react';
import { useNotifications, AppNotification } from '../lib/NotificationContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const TypeIcon = ({ type }: { type: AppNotification['type'] }) => {
  switch(type) {
    case 'ACHIEVEMENT': return <Trophy className="w-4 h-4 text-amber-500" />;
    case 'ALERT': return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'ADMIN': return <ShieldAlert className="w-4 h-4 text-indigo-500" />;
    case 'PEDAGOGICAL': return <BookOpen className="w-4 h-4 text-purple-500" />;
    case 'REMINDER': return <Bell className="w-4 h-4 text-blue-500" />;
    case 'WELCOME': return <MessageSquare className="w-4 h-4 text-emerald-500" />;
    default: return <Info className="w-4 h-4 text-slate-500" />;
  }
};

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (n: AppNotification) => {
     if (!n.read) markAsRead(n.id);
     setIsOpen(false);
     if (n.actionUrl) {
        navigate(n.actionUrl);
     }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl hover:bg-slate-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black pointer-events-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
               initial={{ opacity: 0, y: 10, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 10, scale: 0.95 }}
               className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[80vh]"
            >
               <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-900">Notificações</h3>
                  {unreadCount > 0 && (
                     <button onClick={() => markAllAsRead()} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition">
                        Marcar Lidas
                     </button>
                  )}
               </div>

               <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
                  {notifications.length === 0 ? (
                     <div className="p-8 text-center text-slate-400">
                        <CheckCircle className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest">Tudo limpo por aqui.</p>
                     </div>
                  ) : (
                     notifications.map(n => (
                        <div 
                           key={n.id}
                           onClick={() => handleNotificationClick(n)}
                           className={cn(
                              "p-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors flex gap-4",
                              !n.read ? "bg-indigo-50/50" : ""
                           )}
                        >
                           <div className="mt-1">
                              <TypeIcon type={n.type} />
                           </div>
                           <div className="flex-1">
                              <p className={cn("text-xs uppercase tracking-tight", !n.read ? "font-black text-slate-900" : "font-bold text-slate-600")}>
                                 {n.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 leading-snug">{n.body}</p>
                           </div>
                           {!n.read && (
                              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1" />
                           )}
                        </div>
                     ))
                  )}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
