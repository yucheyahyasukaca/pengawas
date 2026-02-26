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
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} className="gap-3">
            <div className="flex items-start gap-3 flex-1">
              <ToastIcon variant={variant ?? undefined} />
              <div className="flex-1 space-y-1.5">
                {title && <ToastTitle className="text-sm font-bold leading-tight">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm font-medium leading-relaxed">
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

