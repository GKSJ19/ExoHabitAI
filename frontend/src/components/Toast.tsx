'use client';

import { useEffect } from 'react';
import { XCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-slate-300" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <AlertCircle className="w-5 h-5 text-slate-300" />,
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl max-w-md">
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="flex-1 text-slate-200 text-sm">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="sr-only">Close</span>
          ×
        </button>
      </div>
    </div>
  );
}