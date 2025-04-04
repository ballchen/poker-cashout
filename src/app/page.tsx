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
  // 添加動畫狀態
  const [showContent, setShowContent] = useState(false);

  // 頁面加載時的動畫效果
  useEffect(() => {
    setShowContent(true);
  }, []);

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
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--background)' }}>
      <div className={`max-w-3xl mx-auto ${showContent ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--primary)' }}>撲克現金遊戲記賬</h1>
        
        {isSettled ? (
          <div className="mb-6 text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={handleNewGame}
              className="py-2 px-6 rounded-md transition-all hover:scale-105 focus:outline-none focus:ring-2"
              style={{ 
                background: 'var(--primary)',
                color: 'white',
                boxShadow: '0 4px 6px var(--shadow)'
              }}
            >
              開始新遊戲
            </button>
          </div>
        ) : (
          <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <PlayerForm 
              onAddPlayer={handleAddPlayer} 
              onAddBuyIn={handleAddBuyIn}
              players={players}
              defaultBuyIn={defaultBuyIn}
            />
          </div>
        )}
        
        {players.length > 0 && (
          <>
            <div className="mb-6 rounded-lg p-4 card-hover animate-slideUp transition-all" 
                 style={{ 
                   background: 'var(--card-bg)',
                   border: '1px solid var(--card-border)',
                   boxShadow: '0 4px 12px var(--shadow)',
                   animationDelay: '0.3s'
                 }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm mb-1">
                    <span style={{ color: 'var(--primary-light)' }}>預設籌碼值: </span>
                    <span className="font-semibold">${defaultBuyIn.toFixed(2)}</span>
                  </p>
                  <p className="text-sm mb-1">
                    <span style={{ color: 'var(--primary-light)' }}>總買入: </span>
                    <span className="font-semibold">${totalBuyIn.toFixed(2)}</span>
                  </p>
                  <p className="text-sm">
                    <span style={{ color: 'var(--primary-light)' }}>總結算: </span>
                    <span className="font-semibold">${totalCashOut.toFixed(2)}</span>
                  </p>
                </div>
                {Math.abs(totalBuyIn - totalCashOut) > 0.01 && (
                  <p className="text-sm font-medium animate-pulse px-3 py-1 rounded-full" style={{ 
                    background: 'rgba(224, 174, 208, 0.3)',
                    color: 'var(--primary)',
                    border: '1px solid var(--secondary)'
                  }}>
                    警告: 金額不一致!
                  </p>
                )}
              </div>
            </div>
            
            <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <PlayerList 
                players={players} 
                onUpdateCashOut={handleUpdateCashOut} 
              />
            </div>
            
            {!isSettled && (
              <div className="animate-slideUp" style={{ animationDelay: '0.5s' }}>
                <SettlementButton 
                  onSettle={handleSettle} 
                  disabled={!canSettle} 
                />
              </div>
            )}
            
            {transactions.length > 0 && (
              <div className="animate-slideIn" style={{ animationDelay: '0.6s' }}>
                <TransactionList 
                  transactions={transactions} 
                  players={players} 
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
