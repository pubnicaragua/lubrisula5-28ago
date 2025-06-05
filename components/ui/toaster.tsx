"use client"

import { useToast } from "@/hooks/use-toast"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 right-0 z-[100] flex flex-col gap-2 p-4 max-h-screen overflow-hidden">
      {toasts
        .filter((toast) => toast.visible)
        .map((toast) => (
          <Toast key={toast.id} variant={toast.variant}>
            <div className="grid gap-1">
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        ))}
    </div>
  )
}
