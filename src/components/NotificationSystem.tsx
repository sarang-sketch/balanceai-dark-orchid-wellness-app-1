"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MessageSquare, Bell, X, Check, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: "sms" | "call" | "reminder" | "alert";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "call",
      title: "Morning Wake-up Call",
      message: "Time to start your day! Your 7:00 AM wake-up call is ready.",
      timestamp: new Date(),
      read: false,
      action: {
        label: "Answer Call",
        onClick: () => handleAnswerCall("1")
      }
    },
    {
      id: "2",
      type: "sms",
      title: "Daily Reminder",
      message: "Don't forget to log your breakfast and track your morning meditation! 🧘",
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: "3",
      type: "reminder",
      title: "Hydration Check",
      message: "You've had 3 glasses of water today. 5 more to reach your goal! 💧",
      timestamp: new Date(Date.now() - 7200000),
      read: true
    }
  ]);

  const [showPanel, setShowPanel] = useState(false);
  const [incomingCall, setIncomingCall] = useState<Notification | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleAnswerCall = (notificationId: string) => {
    const callNotification = notifications.find(n => n.id === notificationId);
    if (callNotification) {
      setIncomingCall(callNotification);
    }
  };

  const handleAcceptCall = () => {
    if (incomingCall) {
      // Mark notification as read
      setNotifications(notifications.map(n => 
        n.id === incomingCall.id ? { ...n, read: true } : n
      ));
      
      // Simulate call connection
      setTimeout(() => {
        alert("Call connected! This would integrate with your phone system for real wake-up calls.");
        setIncomingCall(null);
      }, 1000);
    }
  };

  const handleDeclineCall = () => {
    if (incomingCall) {
      setNotifications(notifications.map(n => 
        n.id === incomingCall.id ? { ...n, read: true } : n
      ));
      setIncomingCall(null);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "call":
        return <Phone className="w-5 h-5" />;
      case "sms":
        return <MessageSquare className="w-5 h-5" />;
      case "reminder":
        return <Clock className="w-5 h-5" />;
      case "alert":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "call":
        return "text-green-500";
      case "sms":
        return "text-blue-500";
      case "reminder":
        return "text-[var(--orchid-neon)]";
      case "alert":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowPanel(!showPanel)}
          className="border-[var(--orchid-neon)]/50 hover:bg-[var(--orchid-neon)]/20 relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* Notification Panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 max-h-[500px] overflow-hidden glass rounded-2xl border border-[var(--orchid-neon)]/20 shadow-2xl z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--orchid-neon)]/20 flex items-center justify-between">
                <h3 className="font-bold text-lg">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-[var(--orchid-neon)] hover:bg-[var(--orchid-neon)]/20"
                    >
                      Mark all read
                    </Button>
                  )}
                  <button
                    onClick={() => setShowPanel(false)}
                    className="hover:bg-[var(--orchid-neon)]/20 rounded-full p-1 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--orchid-neon)]/10">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-[var(--orchid-neon)]/5 transition-colors ${
                          !notification.read ? "bg-[var(--orchid-neon)]/10" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 ${getIconColor(notification.type)}`}>
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[var(--orchid-neon)] rounded-full flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {notification.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              <div className="flex items-center gap-2">
                                {notification.action && (
                                  <Button
                                    size="sm"
                                    onClick={notification.action.onClick}
                                    className="text-xs bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90"
                                  >
                                    {notification.action.label}
                                  </Button>
                                )}
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-[var(--orchid-neon)] hover:underline"
                                  >
                                    Mark read
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-xs text-gray-500 hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Incoming Call Modal */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass rounded-3xl p-8 max-w-md w-full text-center neon-border"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Animated Phone Icon */}
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--dark-orchid)] to-[var(--orchid-neon)] flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 20px rgba(218, 112, 214, 0.5)",
                    "0 0 40px rgba(218, 112, 214, 0.8)",
                    "0 0 20px rgba(218, 112, 214, 0.5)"
                  ]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Phone className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-2 neon-text">{incomingCall.title}</h2>
              <p className="text-gray-400 mb-8">{incomingCall.message}</p>

              <div className="flex gap-4">
                <Button
                  onClick={handleDeclineCall}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-500/20"
                  size="lg"
                >
                  <X className="w-5 h-5 mr-2" />
                  Decline
                </Button>
                <Button
                  onClick={handleAcceptCall}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90"
                  size="lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Answer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}