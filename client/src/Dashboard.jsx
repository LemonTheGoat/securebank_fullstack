import TransferModal from './TransferModal';
import History from './History';
import Cards from './Cards';
import Loans from './Loans';
import Admin from './Admin';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  ChevronDown,
  ChevronsUpDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Formatting helpers                                                        */
/* -------------------------------------------------------------------------- */

const phpFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});
const signedPhpFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  signDisplay: 'exceptZero',
});
const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});
const timeFormatter = new Intl.DateTimeFormat('en-PH', {
  hour: 'numeric',
  minute: '2-digit',
});
const longDateFormatter = new Intl.DateTimeFormat('en-PH', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const formatPHP = (value) => phpFormatter.format(Number(value));
const formatSignedPHP = (value) => signedPhpFormatter.format(Number(value));
const toTitleCase = (value) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

/* -------------------------------------------------------------------------- */
/*  Static UI config                                                          */
/* -------------------------------------------------------------------------- */

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'history', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'loans', label: 'Loan Details', icon: FileText },
];

const FOOTER_ITEMS = [
  { id: 'help', label: 'Help', icon: LifeBuoy },
  { id: 'admin', label: 'Admin Console', icon: Settings },
];

const TABS = [
  { id: 'all', label: 'Recent Transactions' },
  { id: 'transfer', label: 'Recent Transfers' },
];

const TYPE_META = {
  deposit: { label: 'Deposit', icon: ArrowDownLeft },
  transfer: { label: 'Transfer', icon: ArrowUpRight },
  loan_repayment: { label: 'Loan Repayment', icon: Banknote },
};

const STATUS_STYLES = {
  active: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
  completed: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  failed: 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
};
const DEFAULT_STATUS_STYLE = 'bg-slate-700/50 text-slate-300 ring-slate-600/50';

const CARD = 'rounded-2xl border border-slate-700/60 bg-slate-800';
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';
const PRIMARY_BUTTON = `rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200 ${FOCUS_RING}`;
const TH =
  'bg-slate-900/60 px-4 py-2.5 text-xs font-medium text-slate-400 first:rounded-l-lg last:rounded-r-lg';

/* -------------------------------------------------------------------------- */
/*  Small presentational components                                           */
/* -------------------------------------------------------------------------- */

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <ShieldCheck className="h-5 w-5 text-emerald-500" />
      <span className="text-sm font-bold tracking-tight text-white">SecureBank</span>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE
      }`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {toTitleCase(status)}
    </span>
  );
}

function BigAmount({ value }) {
  const parts = phpFormatter.formatToParts(Number(value));
  const symbol = parts.find((part) => part.type === 'currency')?.value ?? '';
  const rest = parts
    .filter((part) => part.type !== 'currency')
    .map((part) => part.value)
    .join('');

  return (
    <p className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl">
      <span className="mr-1 text-xl font-medium text-slate-400 sm:text-2xl">
        {symbol}
      </span>
      {rest}
    </p>
  );
}

function NavLink({ label, icon: Icon, active = false, onNavigate }) {
  return (
    <a
      href="#"
      aria-current={active ? 'page' : undefined}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.();
      }}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${
        active
          ? 'bg-slate-800 text-white'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
      }`}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-emerald-500"
        />
      )}
      <Icon
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 transition-colors ${
          active ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-300'
        }`}
      />
      {label}
    </a>
  );
}

function SidebarContent({ onClose, currentView, setCurrentView }) {
  const { user } = useSelector((state) => state.account);
  const fullName = `${user.first_name} ${user.last_name}`;
  const initials = `${user.first_name[0]}${user.last_name[0]}`;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Brand />
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`Account menu for ${fullName}`}
            className={`flex items-center gap-1 rounded-lg p-1 transition-colors hover:bg-slate-800 ${FOCUS_RING}`}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/15 text-[11px] font-semibold text-emerald-500 ring-1 ring-emerald-500/30">
              {initials}
            </span>
            <ChevronsUpDown aria-hidden="true" className="h-3.5 w-3.5 text-slate-500" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className={`rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white ${FOCUS_RING}`}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <label className="relative mt-5 block">
        <span className="sr-only">Search</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-lg border border-slate-800 bg-slate-800/60 py-2 pl-9 pr-8 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <kbd
          aria-hidden="true"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-slate-700/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-400"
        >
          /
        </kbd>
      </label>

      <nav aria-label="Primary" className="mt-5">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <NavLink 
                {...item} 
                active={item.id === currentView}
                onNavigate={() => { 
                  onClose?.(); 
                  setCurrentView(item.id); 
                }} 
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-6">
        <ul className="space-y-1">
          {FOOTER_ITEMS.map((item) => (
            <li key={item.label}>
              <NavLink 
                {...item} 
                active={item.id === currentView}
                onNavigate={() => { 
                  onClose?.(); 
                  setCurrentView(item.id); 
                }} 
              />
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2.5">
          <p className="truncate text-sm font-medium text-white">{fullName}</p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ tx }) {
  const meta = TYPE_META[tx.type] ?? {
    label: toTitleCase(tx.type),
    icon: ArrowLeftRight,
  };
  const Icon = meta.icon;
  const date = new Date(tx.created_at);
  const isCredit = Number(tx.amount) > 0;
  const cell = 'border-b border-slate-700/50 px-4 py-3.5';

  return (
    <tr className="transition-colors last:[&>td]:border-b-0 hover:bg-slate-700/20">
      <td className={cell}>
        <div className="flex items-center gap-3">
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
              isCredit
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-slate-700/60 text-slate-300'
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">{tx.description}</p>
            <p className="font-mono text-xs text-slate-400">#{tx.id}</p>
          </div>
        </div>
      </td>
      <td className={`${cell} whitespace-nowrap`}>
        <span className="inline-flex items-center rounded-md bg-slate-700/50 px-2 py-1 text-xs font-medium text-slate-300">
          {meta.label}
        </span>
      </td>
      <td className={`${cell} whitespace-nowrap font-mono text-xs`}>
        <time dateTime={tx.created_at}>
          <span className="text-slate-100">{dateFormatter.format(date)}</span>
          <span className="text-slate-400">, {timeFormatter.format(date)}</span>
        </time>
      </td>
      <td className={`${cell} whitespace-nowrap`}>
        <StatusBadge status={tx.status} />
      </td>
      <td
        className={`${cell} whitespace-nowrap pr-6 text-right font-mono text-sm font-semibold tabular-nums ${
          isCredit ? 'text-emerald-500' : 'text-slate-100'
        }`}
      >
        {formatSignedPHP(tx.amount)}
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashboard                                                                 */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  const { user, account, loan, transactions } = useSelector((state) => state.account);
  
  const fullName = `${user.first_name} ${user.last_name}`;
  const originalLoan = Number(loan.loan_amount);
  const remainingLoan = Number(loan.remaining_balance);
  const paidDownPct =
    originalLoan > 0
      ? Math.min(100, Math.max(0, (1 - remainingLoan / originalLoan) * 100))
      : 0;
  const recentTransactions = [...transactions].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  const [navOpen, setNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const visibleTransactions = recentTransactions.filter(
    (tx) =>
      (activeTab === 'all' || tx.type === activeTab) &&
      tx.description.toLowerCase().includes(needle),
  );

  return (
    <div className="flex min-h-screen bg-slate-900 font-sans text-slate-100 antialiased">
      
      {/* INSTANT ANIMATION STYLES */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-slide {
          animation: fadeSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 border-r border-slate-800 p-4 lg:block xl:w-60">
        <SidebarContent currentView={currentView} setCurrentView={setCurrentView} />
      </aside>

      {/* Mobile / tablet navigation drawer */}
      {navOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-40 flex lg:hidden"
        >
          <aside className="h-full w-64 max-w-[80%] border-r border-slate-800 bg-slate-900 p-4">
            <SidebarContent onClose={() => setNavOpen(false)} currentView={currentView} setCurrentView={setCurrentView} />
          </aside>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
            className="flex-1 bg-slate-950/70"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 lg:hidden">
          <Brand />
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
            aria-expanded={navOpen}
            className={`rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${FOCUS_RING}`}
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
          
          {/* THE MAGIC KEY PROP: Remounts content instantly on change */}
          <div key={currentView} className="animate-fade-slide flex flex-1 flex-col gap-4">
            
            {/* DEFAULT DASHBOARD VIEW */}
            {currentView === 'dashboard' && (
              <>
                {/* Page header */}
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-lg font-semibold text-white">
                      Hey, {user.first_name}
                    </h1>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {longDateFormatter.format(new Date())}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${FOCUS_RING}`}
                    >
                      This month
                      <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className={PRIMARY_BUTTON} onClick={() => setModalOpen(true)}>
                      Move money
                    </button>
                  </div>
                </header>

                {/* Balance + Loan Summary */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <section
                    aria-labelledby="balance-heading"
                    className={`${CARD} flex flex-col p-5 xl:col-span-2`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 id="balance-heading" className="text-sm font-medium text-slate-300">
                        Balance
                      </h2>
                    <button type="button" className={PRIMARY_BUTTON} onClick={() => setModalOpen(true)}>
                      Move money
                    </button>
                    </div>
                    <div className="mt-3">
                      <BigAmount value={account.balance} />
                    </div>

                    <div className="mt-auto pt-8">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-700/60 pt-4 xl:grid-cols-4">
                        <div className="min-w-0">
                          <dt className="text-xs text-slate-400">Account holder</dt>
                          <dd className="mt-1 truncate text-sm font-medium text-white">
                            {fullName}
                          </dd>
                        </div>
                        <div className="min-w-0">
                          <dt className="text-xs text-slate-400">Account number</dt>
                          <dd className="mt-1 break-words font-mono text-sm font-medium text-white">
                            {account.account_number}
                          </dd>
                        </div>
                        <div className="min-w-0">
                          <dt className="text-xs text-slate-400">Account type</dt>
                          <dd className="mt-1 text-sm font-medium text-white">
                            {toTitleCase(account.account_type)}
                          </dd>
                        </div>
                        <div className="min-w-0">
                          <dt className="text-xs text-slate-400">Status</dt>
                          <dd className="mt-1">
                            <StatusBadge status={account.status} />
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </section>

                  <section
                    aria-labelledby="loan-heading"
                    className={`${CARD} flex flex-col p-5`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h2 id="loan-heading" className="text-sm font-medium text-slate-300">
                        Loan Summary
                      </h2>
                      <StatusBadge status={loan.status} />
                    </div>

                    <div className="mt-3">
                      <p className="mb-1 text-xs text-slate-400">Remaining balance</p>
                      <BigAmount value={loan.remaining_balance} />
                    </div>

                    <div className="mt-5">
                      <div
                        role="progressbar"
                        aria-label="Loan paid down"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(paidDownPct)}
                        className="h-1.5 overflow-hidden rounded-full bg-slate-700"
                      >
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${paidDownPct}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        <span className="font-mono text-emerald-500">
                          {paidDownPct.toFixed(1)}%
                        </span>{' '}
                        paid down
                      </p>
                    </div>

                    <dl className="mt-auto divide-y divide-slate-700/50 pt-5 text-sm">
                      <div className="flex items-center justify-between gap-4 py-2">
                        <dt className="text-slate-400">Original amount</dt>
                        <dd className="font-mono font-medium text-white">
                          {formatPHP(loan.loan_amount)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-2">
                        <dt className="text-slate-400">Interest rate</dt>
                        <dd className="font-mono font-medium text-white">
                          {loan.interest_rate}%
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-2">
                        <dt className="text-slate-400">Term</dt>
                        <dd className="font-mono font-medium text-white">
                          {loan.term_months} months
                        </dd>
                      </div>
                    </dl>
                  </section>
                </div>

                {/* Recent Transactions */}
                <section
                  aria-labelledby="transactions-heading"
                  className={`${CARD} flex flex-1 flex-col p-5`}
                >
                  <h2 id="transactions-heading" className="sr-only">
                    Transactions
                  </h2>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div role="tablist" aria-label="Transaction views" className="flex gap-5">
                      {TABS.map((tab) => {
                        const selected = tab.id === activeTab;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            id={`tab-${tab.id}`}
                            aria-selected={selected}
                            aria-controls="transactions-panel"
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative rounded-sm pb-2.5 text-sm font-medium transition-colors ${FOCUS_RING} ${
                              selected ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {tab.label}
                            {selected && (
                              <span
                                aria-hidden="true"
                                className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-emerald-500"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <label className="relative block sm:w-64">
                      <span className="sr-only">Search transactions</span>
                      <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search transactions"
                        className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </label>
                  </div>

                  <div
                    id="transactions-panel"
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTab}`}
                    className="mt-4 overflow-x-auto"
                  >
                    <table className="w-full min-w-[760px] border-separate border-spacing-0">
                      <caption className="sr-only">
                        Recent transactions for account {account.account_number}
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col" className={`${TH} text-left`}>Description</th>
                          <th scope="col" className={`${TH} text-left`}>Type</th>
                          <th scope="col" className={`${TH} text-left`}>Date &amp; time</th>
                          <th scope="col" className={`${TH} text-left`}>Status</th>
                          <th scope="col" className={`${TH} text-right pr-6`}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleTransactions.length > 0 ? (
                          visibleTransactions.map((tx) => (
                            <TransactionRow key={tx.id} tx={tx} />
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-10 text-center text-sm text-slate-400"
                            >
                              No transactions match your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {/* DYNAMIC SUB-VIEWS */}
            {currentView === 'history' && <History />}
            {currentView === 'cards' && <Cards />}
            {currentView === 'loans' && <Loans />}
            {currentView === 'admin' && <Admin />}

          </div>
        </main>
      </div>
      <TransferModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        currentBalance={account.balance} 
      />
    </div>
  );
}