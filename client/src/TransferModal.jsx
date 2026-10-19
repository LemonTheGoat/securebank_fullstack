import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function TransferModal({ isOpen, onClose, currentBalance }) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);

    if (!destination.trim()) {
      setError('Please enter a destination account number.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Transfer amount must be greater than 0.');
      return;
    }
    if (numAmount > Number(currentBalance)) {
      setError('Insufficient funds for this transfer.');
      return;
    }

    // Next step: Dispatch your Redux transfer action here
    console.log('Valid transfer ready for Redux:', { destination, amount: numAmount, description });
    
    // Reset form and close
    setDestination('');
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-800 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Transfer Funds</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Destination Input */}
            <div>
              <label htmlFor="destination" className="mb-1.5 block text-xs font-medium text-slate-300">
                Destination Account
              </label>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. PH-1234-5678-90"
                className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300">
                <span>Amount</span>
                <span className="text-slate-500">Available: ₱{Number(currentBalance).toLocaleString()}</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₱</span>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 py-2 pl-8 pr-3 font-mono text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Description (Optional) */}
            <div>
              <label htmlFor="description" className="mb-1.5 block text-xs font-medium text-slate-300">
                Description <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this for?"
                className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Confirm Transfer
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}