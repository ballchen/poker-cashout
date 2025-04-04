'use client';

import { Transaction, Player } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  players: Player[];
}

export default function TransactionList({ transactions, players }: TransactionListProps) {
  // 獲取玩家名稱的函數
  const getPlayerName = (id: string) => {
    const player = players.find(p => p.id === id);
    return player ? player.name : 'Unknown';
  };

  return (
    <div className="rounded-lg p-6 card-hover transition-all" 
         style={{ 
           background: 'var(--card-bg)',
           boxShadow: '0 4px 12px var(--shadow)',
           border: '1px solid var(--card-border)'
         }}>
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-accent)' }}>結算交易</h2>
      {transactions.length === 0 ? (
        <p style={{ color: 'var(--text-lighter)' }}>尚無交易記錄</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg flex items-center justify-between transition-all hover:scale-102 animate-slideIn"
              style={{ 
                border: '1px solid var(--card-border)',
                background: index % 2 === 0 ? 'rgba(166, 77, 121, 0.05)' : 'transparent',
                animationDelay: `${index * 0.1}s`,
                boxShadow: '0 2px 4px var(--shadow)'
              }}
            >
              <div className="flex items-center">
                <span className="font-medium" style={{ color: 'var(--text-accent)' }}>{getPlayerName(transaction.from)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" 
                     className="h-5 w-5 mx-2" 
                     viewBox="0 0 20 20" 
                     fill="currentColor"
                     style={{ color: 'var(--text-lighter)' }}>
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium" style={{ color: 'var(--text-accent)' }}>{getPlayerName(transaction.to)}</span>
              </div>
              <span className="font-semibold px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: 'var(--primary-light)', 
                      color: 'white' 
                    }}>
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 