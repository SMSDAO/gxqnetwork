import React from 'react';
import { useGXQ } from '../../context/GXQContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGXQ();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-[#00A8FF]/40 text-[#F5F7FA]';
        let Icon = Info;
        let iconColor = 'text-[#00A8FF]';

        if (toast.type === 'success') {
          borderClass = 'border-[#00A8FF]/60 shadow-[0_0_20px_rgba(0,168,255,0.25)]';
          Icon = CheckCircle2;
          iconColor = 'text-[#00A8FF]';
        } else if (toast.type === 'warn') {
          borderClass = 'border-[#FFD400]/60 shadow-[0_0_20px_rgba(255,212,0,0.25)]';
          Icon = AlertTriangle;
          iconColor = 'text-[#FFD400]';
        } else if (toast.type === 'error') {
          borderClass = 'border-[#FF304F]/70 shadow-[0_0_20px_rgba(255,48,79,0.3)]';
          Icon = AlertCircle;
          iconColor = 'text-[#FF304F]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl glass-lvl-3 border ${borderClass} backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-right-5`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm tracking-wide text-[#F5F7FA]">{toast.title}</div>
              <div className="text-xs text-[#9AA6B2] mt-0.5 break-words">{toast.description}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#66717D] hover:text-[#F5F7FA] transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
