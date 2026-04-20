import React, { useState } from 'react';
import { Upload, X, FileDown, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { importService, ImportResult } from '../../services/importService';
import { motion, AnimatePresence } from 'motion/react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const content = await file.text();
      const res = await importService.importStudents(content);
      setResult(res);
      if (res.success > 0) {
        onSuccess();
      }
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/student_import_template.csv';
    link.download = 'template_importacao_alunos.csv';
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-900 italic uppercase">Importação em Lote</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Alunos e Usuários</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {!result && (
            <>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-4">
                <FileDown className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-xs font-black text-blue-900 uppercase tracking-tight">Utilize nosso template oficial</p>
                  <p className="text-[10px] font-bold text-blue-700/70 uppercase leading-relaxed mt-1">
                    Baixe o modelo CSV para garantir que os campos estejam no formato correto.
                  </p>
                  <button 
                    onClick={downloadTemplate}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <FileDown className="w-3 h-3" />
                    Download Template
                  </button>
                </div>
              </div>

              <div 
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${
                  file ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="csv-upload" 
                />
                <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4 text-blue-600">
                    <Upload className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {file ? file.name : 'Clique para selecionar o CSV'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Apenas arquivos .csv</span>
                </label>
              </div>

              <button
                disabled={!file || loading}
                onClick={handleImport}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Iniciar Importação
                  </>
                )}
              </button>
            </>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{result.total}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-center">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Sucesso</p>
                  <p className="text-2xl font-black text-green-700 mt-1">{result.success}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Falhas</p>
                  <p className="text-2xl font-black text-red-700 mt-1">{result.failed}</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl max-h-40 overflow-y-auto">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <AlertCircle className="w-3 h-3" />
                    Erros Identificados:
                  </p>
                  {result.errors.map((error, idx) => (
                    <p key={idx} className="text-[10px] font-bold text-red-700 leading-tight mb-1">• {error}</p>
                  ))}
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all"
              >
                Concluído
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
