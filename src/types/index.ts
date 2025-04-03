export interface Player {
  id: string;
  name: string;
  buyIns: number[];
  cashOut: number | null;
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export interface GameSummary {
  players: Player[];
  transactions: Transaction[];
} 