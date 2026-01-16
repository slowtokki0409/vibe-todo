import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';
import { requestNotificationPermission } from '../utils/notifications';

export const NotificationBanner = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or granted permission
    const wasDismissed = localStorage.getItem('notification-banner-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Show banner if notification permission is not granted
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => setShow(true), 2000); // Show after 2 seconds
    }
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShow(false);
      localStorage.setItem('notification-banner-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('notification-banner-dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-purple-500/50 rounded-2xl shadow-2xl p-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <motion.div
                  className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Bell className="w-6 h-6 text-purple-400" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">
                  알림 받기
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  마감일 알림을 받으려면 브라우저 알림 권한을 허용해주세요.
                  1시간 전, 오늘, 내일 마감되는 작업을 알려드립니다.
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleEnable}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check className="w-4 h-4" />
                    허용하기
                  </motion.button>

                  <motion.button
                    onClick={handleDismiss}
                    className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    나중에
                  </motion.button>
                </div>
              </div>

              {/* Close button */}
              <motion.button
                onClick={handleDismiss}
                className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBanner;
