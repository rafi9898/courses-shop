"use client";

import { CheckCircle2, X } from "lucide-react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type NotificationContextValue = {
  showNotification: (message: string, type?: Notification["type"]) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: Notification["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none items-end">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "pointer-events-auto flex items-center gap-4 min-w-[320px] max-w-[400px] rounded-2xl border bg-white/95 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl animate-in slide-in-from-right-8 fade-in duration-500",
              notification.type === "success" && "border-primary/10",
              notification.type === "error" && "border-red-100",
              notification.type === "info" && "border-blue-100"
            )}
          >
            <div className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm",
              notification.type === "success" && "bg-primary-soft text-primary",
              notification.type === "error" && "bg-red-50 text-red-600",
              notification.type === "info" && "bg-blue-50 text-blue-600"
            )}>
              {notification.type === "success" && <CheckCircle2 className="h-6 w-6" />}
            </div>
            <div className="flex-1 overflow-hidden pr-2">
              <p className="truncate text-sm font-black tracking-tight text-slate-900">{notification.message}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Powiadomienie</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="group -mr-1 shrink-0 rounded-xl p-2 transition hover:bg-slate-100"
              aria-label="Zamknij"
            >
              <X className="h-4 w-4 text-slate-300 group-hover:text-slate-600" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
