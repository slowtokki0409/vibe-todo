import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';

export const TodoFilter = ({ filters, onFilterChange }) => {
  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      category: 'all',
      priority: 'all',
      status: 'all',
      sortBy: 'priority',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 py-4 border-b border-white/10"
    >
      {/* Search Bar */}
      <div className="relative group text-left">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors z-10 pointer-events-none" />
        <input
          type="text"
          placeholder="할 일 검색..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full text-left py-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 text-white text-base placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-black/30 transition-all font-medium shadow-inner"
          style={{ paddingLeft: '3.8rem', paddingRight: '1rem' }}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Status Filter */}
        <div className="flex gap-2">
          {['all', 'active', 'completed'].map((status) => (
            <motion.button
              key={status}
              onClick={() => onFilterChange({ ...filters, status })}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filters.status === status
                  ? 'bg-purple-500/30 border border-purple-500/50 text-purple-200 shadow-custom'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status === 'all' ? '모두' : status === 'active' ? '진행중' : '완료'}
            </motion.button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          {['all', 'work', 'personal', 'study'].map((cat) => (
            <motion.button
              key={cat}
              onClick={() => onFilterChange({ ...filters, category: cat })}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filters.category === cat
                  ? 'bg-blue-500/30 border border-blue-500/50 text-blue-200 shadow-custom'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat === 'all' ? '전체' : cat === 'work' ? '업무' : cat === 'personal' ? '개인' : '학습'}
            </motion.button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map((pri) => (
            <motion.button
              key={pri}
              onClick={() => onFilterChange({ ...filters, priority: pri })}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filters.priority === pri
                  ? 'bg-red-500/30 border border-red-500/50 text-red-200 shadow-custom'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {pri === 'all' ? '우선순위' : pri === 'high' ? '높음' : pri === 'medium' ? '중간' : '낮음'}
            </motion.button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-gray-300 focus:outline-none focus:border-purple-500/50 hover:bg-white/10 transition-colors"
        >
          <option value="priority">우선순위순</option>
          <option value="dueDate">마감일순</option>
          <option value="created">생성순</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <motion.button
            onClick={handleClearFilters}
            className="ml-auto px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={14} />
            필터 초기화
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default TodoFilter;
