'use client';

import React, { useState } from 'react';
import { Player } from '@/types';

interface PlayerListProps {
  players: Player[];
  onUpdateCashOut: (id: string, cashOut: number) => void;
}

export default function PlayerList({ players, onUpdateCashOut }: PlayerListProps) {
  // 追踪哪些玩家正在編輯結算金額
  const [editingIds, setEditingIds] = useState<{[key: string]: boolean}>({});
  // 暫存輸入值 (用於所有輸入，無論是新輸入還是編輯)
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});
  // 控制買入詳情顯示
  const [showBuyInDetails, setShowBuyInDetails] = useState<{[key: string]: boolean}>({});

  // 開始編輯某玩家的結算金額
  const startEditing = (player: Player) => {
    setEditingIds({...editingIds, [player.id]: true});
    setInputValues({
      ...inputValues, 
      [player.id]: player.cashOut !== null ? player.cashOut.toString() : ''
    });
  };

  // 保存編輯結果
  const saveEditing = (id: string) => {
    const value = parseFloat(inputValues[id]);
    if (!isNaN(value) && value >= 0) {
      onUpdateCashOut(id, value);
      setEditingIds({...editingIds, [id]: false});
    }
  };

  // 確認新輸入的結算金額
  const confirmCashOut = (id: string) => {
    const value = parseFloat(inputValues[id] || '0');
    if (!isNaN(value) && value >= 0) {
      onUpdateCashOut(id, value);
    }
  };

  // 處理輸入值變化
  const handleInputChange = (id: string, value: string) => {
    setInputValues({...inputValues, [id]: value});
  };

  // 切換買入詳情顯示
  const toggleBuyInDetails = (id: string) => {
    setShowBuyInDetails({
      ...showBuyInDetails,
      [id]: !showBuyInDetails[id]
    });
  };

  // 計算總買入金額
  const getTotalBuyIn = (buyIns: number[]) => {
    return buyIns.reduce((sum, amount) => sum + amount, 0);
  };

  return (
    <div className="rounded-lg p-6 mb-6 card-hover transition-all" 
         style={{ 
           background: 'var(--card-bg)',
           boxShadow: '0 4px 12px var(--shadow)',
           border: '1px solid var(--card-border)'
         }}>
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-accent)' }}>玩家列表</h2>
      {players.length === 0 ? (
        <p style={{ color: 'var(--text-lighter)' }}>尚未添加玩家</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: 'var(--text-accent)' }}>玩家</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: 'var(--text-accent)' }}>買入</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: 'var(--text-accent)' }}>結算</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: 'var(--text-accent)' }}>盈虧</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => {
                const totalBuyIn = getTotalBuyIn(player.buyIns);
                const profit = player.cashOut !== null ? player.cashOut - totalBuyIn : null;
                const isEditing = editingIds[player.id];
                const showDetails = showBuyInDetails[player.id];
                
                return (
                  <React.Fragment key={player.id}>
                    <tr className="transition-all hover:bg-opacity-50" 
                        style={{ 
                          borderBottom: '1px solid var(--card-border)',
                          animationDelay: `${index * 0.05}s`,
                          animation: 'fadeIn 0.5s ease-out forwards'
                        }}>
                      <td className="px-6 py-4 whitespace-nowrap">{player.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span>${totalBuyIn.toFixed(2)}</span>
                          {player.buyIns.length > 1 && (
                            <button
                              onClick={() => toggleBuyInDetails(player.id)}
                              className="ml-2 text-xs py-1 px-2 rounded transition-all"
                              style={{ 
                                background: showDetails ? 'var(--primary)' : 'var(--secondary)',
                                color: 'white',
                                opacity: 0.9
                              }}
                            >
                              {showDetails ? '隱藏詳情' : `${player.buyIns.length}次`}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {player.cashOut !== null && !isEditing ? (
                          <div className="flex items-center space-x-2">
                            <span>${player.cashOut.toFixed(2)}</span>
                            <button
                              onClick={() => startEditing(player)}
                              className="ml-2 text-xs py-1 px-2 rounded transition-all"
                              style={{ 
                                background: 'var(--primary-light)',
                                color: 'white',
                                opacity: 0.8
                              }}
                            >
                              編輯
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              placeholder="輸入結算金額"
                              className="w-32 px-2 py-1 rounded-md transition-all focus:outline-none focus:ring-2"
                              style={{ 
                                border: '1px solid var(--card-border)',
                                backgroundColor: 'var(--background-alt)',
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                              }}
                              min="0"
                              step="0.01"
                              value={inputValues[player.id] || ''}
                              onChange={(e) => handleInputChange(player.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  if (isEditing) {
                                    saveEditing(player.id);
                                  } else {
                                    confirmCashOut(player.id);
                                  }
                                }
                              }}
                            />
                            {isEditing ? (
                              <button
                                onClick={() => saveEditing(player.id)}
                                className="text-xs py-1 px-2 rounded transition-all hover:scale-105"
                                style={{ 
                                  background: 'var(--secondary)',
                                  color: 'white'
                                }}
                              >
                                保存
                              </button>
                            ) : (
                              <button
                                onClick={() => confirmCashOut(player.id)}
                                className="text-xs py-1 px-2 rounded transition-all hover:scale-105"
                                style={{ 
                                  background: 'var(--primary)',
                                  color: 'white'
                                }}
                              >
                                確認
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {profit !== null ? (
                          <span style={{ color: profit >= 0 ? '#4CAF50' : '#E53935', fontWeight: 'bold' }}>
                            {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                    {showDetails && (
                      <tr key={`details-${player.id}`} className="animate-fadeIn">
                        <td colSpan={4} className="px-6 py-2 text-sm" style={{ background: 'rgba(166, 77, 121, 0.1)' }}>
                          <div>
                            <h4 className="font-medium mb-1" style={{ color: 'var(--text-accent)' }}>買入詳情：</h4>
                            <ul className="pl-5 list-disc">
                              {player.buyIns.map((amount, index) => (
                                <li key={`${player.id}-buyin-${index}`} className="animate-slideIn" style={{ animationDelay: `${index * 0.1}s` }}>
                                  第{index + 1}次: <span style={{ color: 'var(--text-lighter)', fontWeight: 'bold' }}>${amount.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 