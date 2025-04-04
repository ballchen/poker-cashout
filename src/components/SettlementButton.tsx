'use client';

interface SettlementButtonProps {
  onSettle: () => void;
  disabled: boolean;
}

export default function SettlementButton({ onSettle, disabled }: SettlementButtonProps) {
  return (
    <button
      onClick={onSettle}
      disabled={disabled}
      className={`w-full py-3 px-4 rounded-md font-medium text-white mb-6 transition-all ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-105 focus:outline-none focus:ring-2 animate-pulse'
      }`}
      style={{ 
        background: disabled ? 'var(--card-border)' : 'var(--secondary)',
        boxShadow: disabled ? 'none' : '0 4px 12px var(--shadow)',
        animation: disabled ? 'none' : 'pulse 2s infinite'
      }}
    >
      計算結算交易
    </button>
  );
} 