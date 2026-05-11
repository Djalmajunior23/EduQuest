import React, { useState, useEffect } from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const fetchCounts = async () => {
        try {
            const resp = await fetch('/api/notifications');
            const data = await resp.json();
            const unread = data.filter((n: any) => !n.lida).length;
            setUnreadCount(unread);
        } catch (error) {
            // Silently fail or log
        }
    };

    useEffect(() => {
        fetchCounts();
        const interval = setInterval(fetchCounts, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <button 
            onClick={() => navigate('/notifications')}
            className="p-3 bg-white border border-slate-100 rounded-2xl relative group hover:border-indigo-100 transition-all shadow-sm"
        >
            <Bell className={cn(
                "w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors",
                unreadCount > 0 && "animate-tada"
            )} />
            
            <AnimatePresence>
                {unreadCount > 0 && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    >
                        {unreadCount > 9 ? '+9' : unreadCount}
                    </motion.div>
                )}
            </AnimatePresence>

            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1">
                   <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                </div>
            )}
        </button>
    );
}
