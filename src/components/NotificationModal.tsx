import React from 'react';
import { NotificationItem } from '../types';
import {
  X,
  Bell,
  CheckCircle2,
  Briefcase,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

interface NotificationModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (tab: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'application':
        return <Briefcase className="w-4 h-4 text-sky-600" />;
      case 'opportunity':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'assessment':
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Notification Center
              </h3>
              <p className="text-xs text-slate-500">
                Live alerts, application milestones, and verification updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-2.5 bg-slate-100/60 border-b border-slate-200/60 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">
            {notifications.filter(n => !n.read).length} Unread Notifications
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-4 transition-colors hover:bg-slate-50 flex items-start gap-3.5 ${
                  !n.read ? 'bg-indigo-50/40' : 'bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${!n.read ? 'bg-indigo-100 shadow-2xs' : 'bg-slate-100'}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {n.link && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate(n.link!);
                        }}
                        className="text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        View Details →
                      </button>
                    )}
                    {!n.read && (
                      <button
                        onClick={() => onMarkAsRead(n.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No notifications yet.
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
