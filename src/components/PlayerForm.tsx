'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';

interface PlayerFormProps {
  onAddPlayer: (player: Player) => void;
  onAddBuyIn: (playerId: string, amount: number) => void;
  players: Player[];
  defaultBuyIn: number;
}

export default function PlayerForm({ onAddPlayer, onAddBuyIn, players, defaultBuyIn }: PlayerFormProps) {
  const [name, setName] = useState('');
  const [buyIn, setBuyIn] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [additionalBuyIn, setAdditionalBuyIn] = useState('');

  // 當預設籌碼值變更時更新輸入框
  useEffect(() => {
    if (buyIn === '' || buyIn === '0') {
      setBuyIn(defaultBuyIn.toString());
    }
    if (additionalBuyIn === '' || additionalBuyIn === '0') {
      setAdditionalBuyIn(defaultBuyIn.toString());
    }
  }, [defaultBuyIn]);

  const handleNewPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !buyIn) return;
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      buyIns: [parseFloat(buyIn)],
      cashOut: null
    };
    
    onAddPlayer(newPlayer);
    setName('');
    setBuyIn(defaultBuyIn.toString()); // 重置為預設值
  };

  const handleAdditionalBuyIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlayerId || !additionalBuyIn) return;
    
    onAddBuyIn(selectedPlayerId, parseFloat(additionalBuyIn));
    setSelectedPlayerId('');
    setAdditionalBuyIn(defaultBuyIn.toString()); // 重置為預設值
  };

  return (
    <div className="rounded-lg p-6 mb-6 card-hover transition-all" 
         style={{ 
           background: 'var(--card-bg)',
           boxShadow: '0 4px 12px var(--shadow)',
           border: '1px solid var(--card-border)'
         }}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* 新玩家表單 */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-accent)' }}>添加新玩家</h2>
          <form onSubmit={handleNewPlayerSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-lighter)' }}>
                玩家名稱
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md transition-all focus:outline-none focus:ring-2"
                style={{ 
                  border: '1px solid var(--card-border)',
                  backgroundColor: 'var(--background-alt)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
                placeholder="輸入玩家名稱"
                required
              />
            </div>
            <div>
              <label htmlFor="buyIn" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-lighter)' }}>
                買入金額 (預設: ${defaultBuyIn})
              </label>
              <input
                type="number"
                id="buyIn"
                value={buyIn || defaultBuyIn}
                onChange={(e) => setBuyIn(e.target.value)}
                className="w-full px-3 py-2 rounded-md transition-all focus:outline-none focus:ring-2"
                style={{ 
                  border: '1px solid var(--card-border)',
                  backgroundColor: 'var(--background-alt)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
                placeholder={`預設: ${defaultBuyIn}`}
                min="0"
                step="0.01"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md transition-all hover:scale-105 focus:outline-none focus:ring-2"
              style={{ 
                background: 'var(--primary)',
                color: 'white',
                boxShadow: '0 2px 4px var(--shadow)'
              }}
            >
              添加玩家
            </button>
          </form>
        </div>

        {/* 額外買入表單 */}
        {players.length > 0 && (
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-accent)' }}>添加額外買入</h2>
            <form onSubmit={handleAdditionalBuyIn} className="space-y-4">
              <div>
                <label htmlFor="player" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-lighter)' }}>
                  選擇玩家
                </label>
                <select
                  id="player"
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-md transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'var(--background-alt)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  required
                >
                  <option value="">選擇玩家</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="additionalBuyIn" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-lighter)' }}>
                  額外買入金額 (預設: ${defaultBuyIn})
                </label>
                <input
                  type="number"
                  id="additionalBuyIn"
                  value={additionalBuyIn || defaultBuyIn}
                  onChange={(e) => setAdditionalBuyIn(e.target.value)}
                  className="w-full px-3 py-2 rounded-md transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'var(--background-alt)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  placeholder={`預設: ${defaultBuyIn}`}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md transition-all hover:scale-105 focus:outline-none focus:ring-2"
                style={{ 
                  background: 'var(--secondary)',
                  color: 'white',
                  boxShadow: '0 2px 4px var(--shadow)'
                }}
              >
                添加買入
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 