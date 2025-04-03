'use client';

import { useState, useEffect } from 'react';
import PlayerForm from '@/components/PlayerForm';
import PlayerList from '@/components/PlayerList';
import TransactionList from '@/components/TransactionList';
import SettlementButton from '@/components/SettlementButton';
import { Player, Transaction } from '@/types';
import { calculateTransactions, getTotalBuyIn } from '@/utils/calculateTransactions';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSettled, setIsSettled] = useState(false);
  const [defaultBuyIn, setDefaultBuyIn] = useState<number>(1000); // 預設籌碼值

  // 從本地存儲載入遊戲狀態
  useEffect(() => {
    const savedPlayers = localStorage.getItem('pokerPlayers');
    const savedTransactions = localStorage.getItem('pokerTransactions');
    const savedIsSettled = localStorage.getItem('pokerIsSettled');
    const savedDefaultBuyIn = localStorage.getItem('pokerDefaultBuyIn');

    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedIsSettled) {
      setIsSettled(JSON.parse(savedIsSettled));
    }
    if (savedDefaultBuyIn) {
      setDefaultBuyIn(JSON.parse(savedDefaultBuyIn));
    }
  }, []);

  // 保存到本地存儲
  useEffect(() => {
    localStorage.setItem('pokerPlayers', JSON.stringify(players));
    localStorage.setItem('pokerTransactions', JSON.stringify(transactions));
    localStorage.setItem('pokerIsSettled', JSON.stringify(isSettled));
    localStorage.setItem('pokerDefaultBuyIn', JSON.stringify(defaultBuyIn));
  }, [players, transactions, isSettled, defaultBuyIn]);

  // 添加玩家
  const handleAddPlayer = (newPlayer: Player) => {
    if (isSettled) {
      alert('遊戲已結算，請開始新遊戲');
      return;
    }
    
    // 檢查是否使用了非預設籌碼值
    const buyInAmount = newPlayer.buyIns[0];
    if (buyInAmount !== defaultBuyIn) {
      setDefaultBuyIn(buyInAmount);
    }
    
    setPlayers([...players, newPlayer]);
  };

  // 添加額外買入
  const handleAddBuyIn = (playerId: string, amount: number) => {
    if (isSettled) {
      alert('遊戲已結算，請開始新遊戲');
      return;
    }
    
    // 如果額外買入金額與預設值不同，則更新預設值
    if (amount !== defaultBuyIn) {
      setDefaultBuyIn(amount);
    }
    
    setPlayers(
      players.map((player) =>
        player.id === playerId
          ? { ...player, buyIns: [...player.buyIns, amount] }
          : player
      )
    );
  };

  // 更新玩家結算金額
  const handleUpdateCashOut = (id: string, cashOut: number) => {
    if (isSettled) {
      alert('遊戲已結算，請開始新遊戲');
      return;
    }
    setPlayers(
      players.map((player) =>
        player.id === id ? { ...player, cashOut } : player
      )
    );
  };

  // 結算遊戲並計算交易
  const handleSettle = () => {
    const allCashedOut = players.every((player) => player.cashOut !== null);
    if (!allCashedOut) {
      alert('所有玩家必須輸入結算金額');
      return;
    }
    
    const calculatedTransactions = calculateTransactions(players);
    setTransactions(calculatedTransactions);
    setIsSettled(true);
  };

  // 開始新遊戲
  const handleNewGame = () => {
    setPlayers([]);
    setTransactions([]);
    setIsSettled(false);
    // 不重置預設買入值，讓它在新遊戲中繼續使用
  };

  // 檢查是否可以結算
  const canSettle = players.length >= 2 && players.every(p => p.cashOut !== null) && !isSettled;
  
  // 計算總買入和總結算額
  const totalBuyIn = players.reduce((sum, player) => sum + getTotalBuyIn(player), 0);
  const totalCashOut = players.reduce((sum, player) => sum + (player.cashOut || 0), 0);
  
  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">撲克現金遊戲記賬</h1>
        
        {isSettled ? (
          <div className="mb-6 text-center">
            <button
              onClick={handleNewGame}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              開始新遊戲
            </button>
          </div>
        ) : (
          <PlayerForm 
            onAddPlayer={handleAddPlayer} 
            onAddBuyIn={handleAddBuyIn}
            players={players}
            defaultBuyIn={defaultBuyIn}
          />
        )}
        
        {players.length > 0 && (
          <>
            <div className="mb-6 bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">預設籌碼值: <span className="font-semibold">${defaultBuyIn.toFixed(2)}</span></p>
                <p className="text-sm text-gray-600">總買入: <span className="font-semibold">${totalBuyIn.toFixed(2)}</span></p>
                <p className="text-sm text-gray-600">總結算: <span className="font-semibold">${totalCashOut.toFixed(2)}</span></p>
              </div>
              {Math.abs(totalBuyIn - totalCashOut) > 0.01 && (
                <p className="text-sm text-yellow-600 font-medium">警告: 總買入和總結算金額不一致!</p>
              )}
            </div>
            
            <PlayerList 
              players={players} 
              onUpdateCashOut={handleUpdateCashOut} 
            />
            
            {!isSettled && (
              <SettlementButton 
                onSettle={handleSettle} 
                disabled={!canSettle} 
              />
            )}
            
            {transactions.length > 0 && (
              <TransactionList 
                transactions={transactions} 
                players={players} 
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
