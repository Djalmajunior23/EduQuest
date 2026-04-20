import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PlusCircle, Zap, Rocket } from 'lucide-react';

export default function MissionManager() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newMission, setNewMission] = useState({ titulo: '', type: 'DIARIA', xp: 100 });

  const addDefaultMissions = async () => {
    if (!profile?.tenantId) return;
    setLoading(true);
    const missions = [
      { titulo: 'Primeiros Passos no CLI', type: 'DIARIA', xp: 100, tenantId: profile.tenantId },
      { titulo: 'Desafio de Lógica de Redes', type: 'SEMANAL', xp: 500, tenantId: profile.tenantId },
      { titulo: 'Mestre da Documentação', type: 'ESPECIAL', xp: 1000, tenantId: profile.tenantId },
    ];
    try {
      const colRef = collection(db, 'missoes');
      for (const mission of missions) {
        await addDoc(colRef, { ...mission, createdAt: serverTimestamp() });
      }
      alert('Missões padrão adicionadas!');
    } catch (e) {
      console.error(e);
      alert('Erro ao adicionar missões');
    }
    setLoading(false);
  };

  const createCustomMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenantId) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'missoes'), {
        ...newMission,
        tenantId: profile.tenantId,
        createdAt: serverTimestamp()
      });
      alert('Missão criada!');
      setNewMission({ titulo: '', type: 'DIARIA', xp: 100 });
    } catch (e) {
      console.error(e);
      alert('Erro ao criar missão');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciador de Missões</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold mb-4">Adicionar Nova Missão</h2>
        <form onSubmit={createCustomMission} className="space-y-4">
          <input 
            placeholder="Título" 
            className="w-full p-2 border rounded"
            value={newMission.titulo}
            onChange={(e) => setNewMission({...newMission, titulo: e.target.value})}
          />
          <select 
            value={newMission.type}
            onChange={(e) => setNewMission({...newMission, type: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="DIARIA">Diária</option>
            <option value="SEMANAL">Semanal</option>
            <option value="ESPECIAL">Especial</option>
          </select>
          <input 
            type="number"
            value={newMission.xp}
            onChange={(e) => setNewMission({...newMission, xp: Number(e.target.value)})}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Criar Missão</button>
        </form>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={addDefaultMissions}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          {loading ? 'Adicionando...' : <Rocket className="w-5 h-5"/>} Adicionar Missões Padrão
        </button>
      </div>
    </div>
  );
}
