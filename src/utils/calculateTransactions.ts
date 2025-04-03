import { Player, Transaction } from '@/types';

// 計算玩家的總買入金額
export function getTotalBuyIn(player: Player): number {
  return player.buyIns.reduce((sum, amount) => sum + amount, 0);
}

export function calculateTransactions(players: Player[]): Transaction[] {
  // 確保所有玩家都已經結算
  const allSettled = players.every(player => player.cashOut !== null);
  if (!allSettled || players.length === 0) {
    return [];
  }

  // 計算每個玩家的淨盈虧
  const balances: { id: string; balance: number }[] = players.map(player => ({
    id: player.id,
    balance: (player.cashOut || 0) - getTotalBuyIn(player)
  }));

  // 將玩家分成贏家和輸家
  const winners = balances.filter(player => player.balance > 0).sort((a, b) => b.balance - a.balance);
  const losers = balances.filter(player => player.balance < 0).sort((a, b) => a.balance - b.balance);

  // 總贏額應該等於總虧額
  const totalWin = winners.reduce((sum, winner) => sum + winner.balance, 0);
  const totalLoss = Math.abs(losers.reduce((sum, loser) => sum + loser.balance, 0));

  // 如果總和不一致，可能是因為浮點數誤差，做小的調整
  if (Math.abs(totalWin - totalLoss) > 0.01) {
    console.warn('结算金额不平衡，可能有錯誤');
    return [];
  }

  const transactions: Transaction[] = [];

  // 計算交易
  while (winners.length > 0 && losers.length > 0) {
    const winner = winners[0];
    const loser = losers[0];

    // 確定交易金額 (較小的金額絕對值)
    const amount = Math.min(winner.balance, Math.abs(loser.balance));
    
    // 將交易添加到列表中 (從輸家到贏家)
    transactions.push({
      from: loser.id,
      to: winner.id,
      amount: Math.round(amount * 100) / 100 // 四捨五入到兩位小數
    });

    // 更新餘額
    winner.balance -= amount;
    loser.balance += amount;

    // 如果餘額為零或接近零，則從列表中移除玩家
    if (Math.abs(winner.balance) < 0.01) {
      winners.shift();
    }
    if (Math.abs(loser.balance) < 0.01) {
      losers.shift();
    }
  }

  return transactions;
} 