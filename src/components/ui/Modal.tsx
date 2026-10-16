import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#030507]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className={`relative w-full ${maxWidth} z-10 my-8`}>
        <GlassCard level={4} glow="blue" className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-tech text-[#F5F7FA] tracking-wide">
                {title}
              </h3>
              {subtitle && <p className="text-xs sm:text-sm text-[#9AA6B2] mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#9AA6B2] hover:text-[#F5F7FA] hover:bg-white/5 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>{children}</div>
        </GlassCard>
      </div>
    </div>
  );
};
