import { api } from '../../../lib/api';


import React, { useEffect, useState } from 'react';interface Simulation {
  id: string;
  title: string;
  passingScore: number;
}

export default function SimulationManager() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);

  useEffect(() => {
    const fetchSimulations = async () => {
      const { data, error } = await api
        .from('simulations')
        .select('*');
      
      if (error) {
        console.error('Error fetching simulations:', error);
      } else {
        setSimulations((data || []).map(doc => ({ 
          id: doc.id, 
          title: doc.title, 
          passingScore: doc.passing_score 
        } as Simulation)));
      }
    };
    fetchSimulations();
  }, []);

  return (
    <div className="p-6" id="simulation-manager-container">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Simulados</h1>
      <div className="space-y-4">
        {simulations.map(sim => (
          <div key={sim.id} className="p-4 border rounded" id={`sim-${sim.id}`}>
            <h2 className="font-semibold">{sim.title}</h2>
            <p>Nota de Custo: {sim.passingScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
