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
      className={`w-full py-3 px-4 rounded-md font-medium text-white mb-6 ${
        disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
      }`}
    >
      計算結算交易
    </button>
  );
} 