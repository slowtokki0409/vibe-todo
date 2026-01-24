// Verified by AntiGravity Swarm
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, FileText, FileJson, Clipboard } from 'lucide-react';
import PasteImportModal from './PasteImportModal';

export const ActionBar = ({ onExportCSV, onExportJSON, onExportMD, onImportFile, onImportText }) => {
  const fileInputRef = useRef(null);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      // 같은 파일을 다시 선택할 수 있도록 초기화
      e.target.value = '';
    }
  };

  const handleTextImport = (text) => {
    onImportText(text);
  };

  return (
    <>
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

        {/* Markdown Export */}
        <motion.button
          onClick={onExportMD}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 transition-colors text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Markdown으로 내보내기"
        >
          <FileText size={16} />
          MD
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

        {/* File Import */}
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="파일 임포트 (JSON, TXT, MD)"
        >
          <Upload size={16} />
          파일
        </motion.button>

        {/* Paste Import */}
        <motion.button
          onClick={() => setIsPasteModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-500/20 border border-pink-500/50 text-pink-400 hover:bg-pink-500/30 transition-colors text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="텍스트 붙여넣기"
        >
          <Clipboard size={16} />
          붙여넣기
        </motion.button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.txt,.md"
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>

      {/* Paste Import Modal */}
      <PasteImportModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onImport={handleTextImport}
      />
    </>
  );
};

export default ActionBar;
