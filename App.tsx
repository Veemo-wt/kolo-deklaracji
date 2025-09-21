import React, { useState, useEffect } from "react";
import Wheel from "./Wheel";

interface Task { id: number; checked: boolean; }
interface Set { id: number; tasks: Task[]; }

export default function App() {
  const [sets, setSets] = useState<Set[]>([]);
  const [newSetId, setNewSetId] = useState("");
  const [newSetCount, setNewSetCount] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [wheelItems, setWheelItems] = useState<string[]>([]);

  const addSet = () => {
    const id = parseInt(newSetId);
    const count = parseInt(newSetCount);
    if (!isNaN(id) && !isNaN(count) && count > 0) {
      const tasks = Array.from({ length: count }, (_, i) => ({
        id: i + 1, checked: true,
      }));
      setSets(prev => [...prev, { id, tasks }]);
      setNewSetId(""); setNewSetCount("");
    }
  };

  const toggleTask = (setId: number, taskId: number) => {
    setSets(prev => prev.map(s => s.id === setId ? {
      ...s,
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, checked: !t.checked } : t)
    } : s));
  };

  useEffect(() => {
    const all: string[] = [];
    sets.forEach(s => s.tasks.forEach(t => { if (t.checked) all.push(`Z${s.id}: ${t.id}`); }));
    setWheelItems(all);
  }, [sets]);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Koło fortuny</h1>

      <div className="flex gap-2 mb-4">
        <input type="number" placeholder="Numer zestawu" value={newSetId}
               onChange={e => setNewSetId(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Liczba zadań" value={newSetCount}
               onChange={e => setNewSetCount(e.target.value)} className="border p-2 rounded" />
        <button onClick={addSet} className="bg-green-600 text-white px-4 py-2 rounded">Dodaj zestaw</button>
      </div>

      {sets.map(s => (
        <div key={s.id} className="mb-4 p-3 border rounded bg-white">
          <h2 className="font-semibold">Zestaw {s.id}</h2>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {s.tasks.map(t => (
              <label key={t.id} className="flex items-center space-x-2">
                <input type="checkbox" checked={t.checked} onChange={() => toggleTask(s.id, t.id)} />
                <span>Zadanie {t.id}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <Wheel items={wheelItems} onResult={r => setResult(`Wylosowano: ${r}`)} />

      {result && (
        <div className="mt-4 p-4 border rounded bg-yellow-100 text-lg font-bold">
          {result}
        </div>
      )}
    </div>
  );
}
