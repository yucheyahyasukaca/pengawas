"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} className="gap-3">
            <div className="flex items-start gap-3 flex-1">
              <ToastIcon variant={variant} />
              <div className="flex-1 space-y-1">
                {title && <ToastTitle className="text-sm font-semibold leading-tight">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm leading-relaxed opacity-90">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

