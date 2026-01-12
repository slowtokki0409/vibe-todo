import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-300';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-purple-500/50 text-white',
    secondary: 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
