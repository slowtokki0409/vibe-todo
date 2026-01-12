import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { enhanceTask } from '../services/perplexity';

export const TodoInput = ({ onAdd }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showMagic, setShowMagic] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input, priority, category, dueDate || null);
      setInput('');
      setPriority('medium');
      setCategory('personal');
      setDueDate('');
      setShowMagic(false);
      setShowAdvanced(false);
    }
  };

  const handleEnhance = async (e) => {
    e.preventDefault();
    if (!input.trim() || isEnhancing) return;

    setIsEnhancing(true);
    try {
      const enhanced = await enhanceTask(input);
      setInput(enhanced);
    } catch (error) {
      console.error("Enhancement failed", error);
      alert("AI 구체화 실패: " + error.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const quickDateOptions = [
    { label: '오늘', days: 0 },
    { label: '내일', days: 1 },
    { label: '1주일', days: 7 },
  ];

  const handleQuickDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setDueDate(date.toISOString().split('T')[0]);
  };

  const priorityColors = {
    high: 'bg-red-500/20 border-red-500/50 text-red-400',
    medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    low: 'bg-green-500/20 border-green-500/50 text-green-400',
  };

  const categoryColors = {
    work: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    personal: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    study: 'bg-pink-500/20 border-pink-500/50 text-pink-400',
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Main Input */}
      <div className="relative">
        {/* Animated Border Underline */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          initial={{ width: 0 }}
          animate={{ width: isFocused || showAdvanced ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Glow Effect on Focus */}
        {(isFocused || showAdvanced) && (
          <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg -z-10 blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Input Field */}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value.length > 3) setShowMagic(true);
            else if (e.target.value.length === 0) setShowMagic(false);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="새로운 할 일을 입력하세요..."
          className="w-full bg-transparent border-b border-white/20 py-4 px-1 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium text-lg tracking-tight pr-32"
        />

        {/* Action Buttons Container */}
        <div className="absolute right-0 bottom-4 flex items-center space-x-2">
          {/* Advanced Options Toggle */}
          <motion.button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`transition-colors duration-200 ${showAdvanced ? 'text-blue-400' : 'text-gray-500 hover:text-gray-400'}`}
            title="고급 옵션"
          >
            <ChevronDown size={20} />
          </motion.button>

          {/* Magic Button */}
          <AnimatePresence>
            {showMagic && (
              <motion.button
                type="button"
                onClick={handleEnhance}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className={`text-yellow-400 hover:text-yellow-300 transition-colors duration-200 ${isEnhancing ? 'animate-pulse' : ''}`}
                title="AI로 작업 구체화하기"
              >
                {isEnhancing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            {input.trim() ? <Send size={20} /> : <Plus size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Advanced Options */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 pt-2 border-t border-white/10"
          >
            {/* Priority Selection */}
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-2 block">우선순위</label>
              <div className="flex gap-2">
                {['high', 'medium', 'low'].map((p) => (
                  <motion.button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${
                      priority === p
                        ? priorityColors[p]
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {p === 'high' ? '높음' : p === 'medium' ? '중간' : '낮음'}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-2 block">카테고리</label>
              <div className="flex gap-2">
                {['work', 'personal', 'study'].map((c) => (
                  <motion.button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${
                      category === c
                        ? categoryColors[c]
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {c === 'work' ? '업무' : c === 'personal' ? '개인' : '학습'}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Due Date Selection */}
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-2 block">마감일</label>
              <div className="flex gap-2 mb-2">
                {quickDateOptions.map((option) => (
                  <motion.button
                    key={option.label}
                    type="button"
                    onClick={() => handleQuickDate(option.days)}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${
                      'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Message */}
      <motion.p
        className="text-xs text-gray-500 font-medium"
        animate={{ opacity: isFocused || showAdvanced ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      >
        {showAdvanced ? '✨ 고급 모드' : '엔터를 눌러 추가'}
      </motion.p>
    </form>
  );
};

export default TodoInput;
