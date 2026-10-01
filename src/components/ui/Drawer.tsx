import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  position?: 'right' | 'left' | 'bottom';
  maxWidth?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positionStyles = {
    right: 'inset-y-0 right-0 h-full w-full sm:' + maxWidth + ' translate-x-0',
    left: 'inset-y-0 left-0 h-full w-full sm:' + maxWidth + ' translate-x-0',
    bottom: 'inset-x-0 bottom-0 max-h-[90vh] w-full rounded-t-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2119]/45 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute flex ${position === 'bottom' ? 'items-end' : 'justify-end'} inset-0`}>
          <div
            className={`pointer-events-auto bg-white shadow-2xl flex flex-col ${positionStyles[position]} animate-fade-in-up border-l border-stone-200/60`}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between bg-ivory-light/80">
              <div>
                {title && <h3 className="font-serif text-lg sm:text-xl font-medium text-charcoal-dark">{title}</h3>}
                {subtitle && <p className="text-[11px] text-stone-500 font-light mt-0.5">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-charcoal-dark hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
