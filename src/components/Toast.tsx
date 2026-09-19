import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error';

export interface ToastEventDetail {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

let toastIdCount = 0;

export const ToastProvider: React.FC = () => {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  useEffect(() => {
    const handleShowToast = (e: CustomEvent<ToastEventDetail>) => {
      const { message, type = 'success', duration = 4000 } = e.detail;
      const id = ++toastIdCount;
      setToasts(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    };

    window.addEventListener('show-toast' as any, handleShowToast);
    return () => window.removeEventListener('show-toast' as any, handleShowToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-5 fade-in duration-300 ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
            toast.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200' :
            'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-600" />}
          
          <span className="text-sm font-semibold">{toast.message}</span>
          
          <button 
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const showToast = (message: string, type: ToastType = 'success', duration = 4000) => {
  window.dispatchEvent(new CustomEvent<ToastEventDetail>('show-toast', {
    detail: { message, type, duration }
  }));
};
