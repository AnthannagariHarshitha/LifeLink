import { useEffect, useState } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, DollarSign, CreditCard, Trash2, PieChart } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Transaction {
  id: string;
  transaction_date: string;
  amount: number;
  category: string;
  description: string;
  transaction_type: string;
}

interface Budget {
  id: string;
  category: string;
  monthly_limit: number;
  spent_amount: number;
  month: string;
}

export const FinancePage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    amount: 0,
    category: 'food',
    description: '',
    transaction_type: 'expense',
    transaction_date: new Date().toISOString().split('T')[0],
  });
  const [budgetForm, setBudgetForm] = useState({
    category: 'food',
    monthly_limit: 500,
  });

  const categories = [
    'food',
    'transport',
    'books',
    'housing',
    'entertainment',
    'health',
    'utilities',
    'other',
  ];

  useEffect(() => {
    loadTransactions();
    loadBudgets();
  }, [user]);

  const loadTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .order('transaction_date', { ascending: false })
      .limit(20);
    setTransactions(data || []);
  };

  const loadBudgets = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user?.id)
      .eq('month', currentMonth);
    setBudgets(data || []);
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('transactions').insert({
      ...transactionForm,
      user_id: user?.id,
    });

    if (!error) {
      setShowAddTransaction(false);
      setTransactionForm({
        amount: 0,
        category: 'food',
        description: '',
        transaction_type: 'expense',
        transaction_date: new Date().toISOString().split('T')[0],
      });
      loadTransactions();
      updateBudgetSpending();
    }
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { error } = await supabase.from('budgets').insert({
      ...budgetForm,
      user_id: user?.id,
      month: currentMonth,
      spent_amount: 0,
    });

    if (!error) {
      setShowAddBudget(false);
      setBudgetForm({ category: 'food', monthly_limit: 500 });
      loadBudgets();
    }
  };

  const updateBudgetSpending = async () => {
    loadBudgets();
  };

  const deleteTransaction = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id);
    loadTransactions();
  };

  const deleteBudget = async (id: string) => {
    await supabase.from('budgets').delete().eq('id', id);
    loadBudgets();
  };

  const totalIncome = transactions
    .filter((t) => t.transaction_type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'from-orange-500 to-red-500',
      transport: 'from-blue-500 to-cyan-500',
      books: 'from-violet-500 to-purple-500',
      housing: 'from-emerald-500 to-teal-500',
      entertainment: 'from-pink-500 to-rose-500',
      health: 'from-red-500 to-pink-500',
      utilities: 'from-yellow-500 to-orange-500',
      other: 'from-slate-500 to-slate-600',
    };
    return colors[category] || colors.other;
  };

  return (
    <DashboardLayout currentModule="finance">
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Financial Management</h1>
            <p className="text-lg text-slate-600">Track your expenses and manage your budget</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddBudget(!showAddBudget)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Budget
            </button>
            <button
              onClick={() => setShowAddTransaction(!showAddTransaction)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">${totalIncome.toFixed(2)}</p>
            <p className="text-sm text-slate-600">Total Income</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">${totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-slate-600">Total Expenses</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${balance >= 0 ? 'from-emerald-500 to-teal-500' : 'from-red-500 to-orange-500'} rounded-xl flex items-center justify-center`}>
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className={`text-2xl font-bold mb-1 ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ${Math.abs(balance).toFixed(2)}
            </p>
            <p className="text-sm text-slate-600">Balance</p>
          </div>
        </div>

        {showAddTransaction && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add Transaction</h3>
            <form onSubmit={handleAddTransaction} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm({ ...transactionForm, amount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="50.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type
                  </label>
                  <select
                    value={transactionForm.transaction_type}
                    onChange={(e) => setTransactionForm({ ...transactionForm, transaction_type: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={transactionForm.transaction_date}
                    onChange={(e) => setTransactionForm({ ...transactionForm, transaction_date: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Lunch at campus cafeteria"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showAddBudget && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add Budget</h3>
            <form onSubmit={handleAddBudget} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Limit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={budgetForm.monthly_limit}
                    onChange={(e) => setBudgetForm({ ...budgetForm, monthly_limit: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="500.00"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Add Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBudget(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {budgets.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Monthly Budgets</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const spent = transactions
                  .filter((t) => t.category === budget.category && t.transaction_type === 'expense')
                  .reduce((sum, t) => sum + Number(t.amount), 0);
                const percentage = (spent / budget.monthly_limit) * 100;
                return (
                  <div
                    key={budget.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(budget.category)} rounded-xl flex items-center justify-center`}>
                        <PieChart className="w-6 h-6 text-white" />
                      </div>
                      <button
                        onClick={() => deleteBudget(budget.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 capitalize">{budget.category}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Spent</span>
                        <span className="font-semibold text-slate-900">
                          ${spent.toFixed(2)} / ${budget.monthly_limit.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : `bg-gradient-to-r ${getCategoryColor(budget.category)}`
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{percentage.toFixed(0)}% used</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
              <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No transactions yet</h3>
              <p className="text-slate-600 mb-6">Start tracking your finances by adding your first transaction</p>
              <button
                onClick={() => setShowAddTransaction(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Transaction
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Amount</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {transaction.description || 'No description'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`text-sm font-semibold ${
                              transaction.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.transaction_type === 'income' ? '+' : '-'}$
                            {Number(transaction.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
