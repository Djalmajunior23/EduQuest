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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200"
      >
        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 italic uppercase leading-none tracking-tighter">Importação <span className="text-indigo-600">Lote</span></h2>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">EduJarvis Data Core</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          {!result && (
            <>
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] flex items-start gap-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <FileDown className="w-16 h-16 text-indigo-600" />
                </div>
                <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200 relative z-10">
                   <FileDown className="w-6 h-6 text-white shrink-0" />
                </div>
                <div className="flex-1 relative z-10">
                  <p className="text-xs font-black text-indigo-900 uppercase tracking-tight mb-2">Protocolo de Importação</p>
                  <p className="text-[10px] font-bold text-indigo-700/70 uppercase leading-relaxed max-w-sm">
                    Utilize o template oficial para garantir a integridade dos dados durante a sincronização.
                  </p>
                  <button 
                    onClick={downloadTemplate}
                    className="mt-4 px-6 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                  >
                    Baixar Template CSV
                  </button>
                </div>
              </div>

              <div 
                className={`border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center transition-all group relative ${
                  file ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
                }`}
              >
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="csv-upload" 
                />
                <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-white shadow-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10" />
                  </div>
                  <span className="text-base font-black text-slate-900 uppercase tracking-tighter mb-1">
                    {file ? file.name : 'Vincular Arquivo Dataset'}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                     Arraste ou clique para selecionar (.csv)
                  </span>
                </label>
              </div>

              <div className="pt-4 space-y-4">
                 <button
                   disabled={!file || loading}
                   onClick={handleImport}
                   className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                 >
                   {loading ? (
                     <>
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Processando Heurísticas...
                     </>
                   ) : (
                     <>
                       <CheckCircle2 className="w-5 h-5" />
                       Executar Sincronização
                     </>
                   )}
                 </button>
                 <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest leading-none">
                    O processamento em lote requer validação de esquema EduJarvis v2.0
                 </p>
              </div>
            </>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center shadow-inner">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total</p>
                  <p className="text-4xl font-black text-slate-900 italic uppercase tabular-nums">{result.total}</p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-center shadow-inner">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Sucesso</p>
                  <p className="text-4xl font-black text-emerald-700 italic uppercase tabular-nums">{result.success}</p>
                </div>
                <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 text-center shadow-inner">
                  <p className="text-[9px] font-black text-rose-600 uppercase tracking-[0.2em] mb-2">Falhas</p>
                  <p className="text-4xl font-black text-rose-700 italic uppercase tabular-nums">{result.failed}</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] max-h-60 overflow-y-auto space-y-4">
                  <div className="flex items-center gap-2 text-rose-600">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Inconsistências Detectadas:</p>
                  </div>
                  <div className="space-y-2">
                    {result.errors.map((error, idx) => (
                      <div key={idx} className="flex gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1 shrink-0" />
                         <p className="text-xs font-bold text-rose-700/80 leading-relaxed">{error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all shadow-xl"
              >
                Concluir Operação
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
