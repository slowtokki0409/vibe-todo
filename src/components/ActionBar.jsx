import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, FileText, FileJson } from 'lucide-react';

export const ActionBar = ({ onExportCSV, onExportJSON, onImportJSON }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      // 같은 파일을 다시 선택할 수 있도록 초기화
      e.target.value = '';
    }
  };

  return (
    <motion.div
      className="flex gap-2 pb-4 border-b border-white/10 flex-wrap justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* CSV Export */}
      <motion.button
        onClick={onExportCSV}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="CSV로 내보내기"
      >
        <FileText size={16} />
        CSV
      </motion.button>

      {/* JSON Export */}
      <motion.button
        onClick={onExportJSON}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="JSON으로 내보내기"
      >
        <FileJson size={16} />
        JSON
      </motion.button>

      {/* JSON Import */}
      <motion.button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="JSON 파일 임포트"
      >
        <Upload size={16} />
        임포트
      </motion.button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  );
};

export default ActionBar;
