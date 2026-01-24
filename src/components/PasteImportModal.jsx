// Verified by AntiGravity Swarm
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardPaste, Upload } from 'lucide-react';

const PasteImportModal = ({ isOpen, onClose, onImport }) => {
    const [text, setText] = useState('');

    // Reset text when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setText('');
        }
    }, [isOpen]);

    const handleImport = (e) => {
        e?.preventDefault(); // 안전장치
        if (text.trim()) {
            try {
                onImport(text);
                setText('');
                onClose();
            } catch (error) {
                console.error("Import Error:", error);
                alert("가져오기 오류: " + error.message);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <ClipboardPaste className="w-5 h-5 text-purple-400" />
                                    텍스트로 가져오기
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-4 space-y-4">
                                <p className="text-sm text-gray-400">
                                    텍스트나 마크다운 내용을 붙여넣으세요. 각 줄이 하나의 할 일로 변환됩니다.
                                </p>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="- 우유 사기&#13;&#10;- 운동하기&#13;&#10;3. 책 읽기"
                                    className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none font-mono text-sm leading-relaxed"
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-2 p-4 border-t border-white/10 bg-white/5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    onClick={handleImport}
                                    disabled={!text.trim()}
                                    className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    가져오기
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PasteImportModal;
