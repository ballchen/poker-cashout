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
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">玩家列表</h2>
      {players.length === 0 ? (
        <p className="text-gray-500">尚未添加玩家</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">玩家</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">買入</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">結算</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">盈虧</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player) => {
                const totalBuyIn = getTotalBuyIn(player.buyIns);
                const profit = player.cashOut !== null ? player.cashOut - totalBuyIn : null;
                const isEditing = editingIds[player.id];
                const showDetails = showBuyInDetails[player.id];
                
                return (
                  <React.Fragment key={player.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">{player.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span>${totalBuyIn.toFixed(2)}</span>
                          {player.buyIns.length > 1 && (
                            <button
                              onClick={() => toggleBuyInDetails(player.id)}
                              className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
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
                              className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
                            >
                              編輯
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              placeholder="輸入結算金額"
                              className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                              >
                                保存
                              </button>
                            ) : (
                              <button
                                onClick={() => confirmCashOut(player.id)}
                                className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                              >
                                確認
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {profit !== null ? (
                          <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                    {showDetails && (
                      <tr key={`details-${player.id}`}>
                        <td colSpan={4} className="px-6 py-2 bg-gray-50">
                          <div className="text-sm text-gray-700">
                            <h4 className="font-medium mb-1">買入詳情：</h4>
                            <ul className="pl-5 list-disc">
                              {player.buyIns.map((amount, index) => (
                                <li key={`${player.id}-buyin-${index}`}>
                                  第{index + 1}次: ${amount.toFixed(2)}
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