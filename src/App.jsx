import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, DollarSign, Send, TrendingUp, TrendingDown, CreditCard, User, LogOut, RefreshCw } from 'lucide-react';

// API Base URL - Uses Vite proxy in dev, absolute URL in production
const API_BASE_URL = import.meta.env.MODE === 'development' ? '/api' : 'http://localhost:8080/api';

// Banking Application Component
export default function BankingApp() {
  const [currentView, setCurrentView] = useState('login');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [backendReady, setBackendReady] = useState(false);

  // Check if backend is ready on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'OPTIONS',
          headers: { 'Content-Type': 'application/json' }
        });
        setBackendReady(true);
      } catch (err) {
        // Backend not ready yet, will retry
        console.warn('Backend not ready yet, will retry...');
        setTimeout(checkBackendHealth, 2000);
      }
    };
    
    checkBackendHealth();
  }, []);

  // Login Component
  const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error('Invalid credentials');

        const data = await response.json();
        setToken(data.token);
        setUser({ username: data.username, email: data.email, fullName: data.fullName });
        setCurrentView('dashboard');
        setSuccess('Login successful!');
      } catch (err) {
        if (err.message.includes('fetch')) {
          setError('Cannot connect to server. Make sure backend is running on http://localhost:8080');
        } else {
          setError(err.message || 'Login failed');
        }
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Banking App</h1>
            <p className="text-gray-600 mt-2">Welcome back! Please login to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView('register')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Don't have an account? Register
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Register Component
  const RegisterForm = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      fullname: ''
    });

    const handleRegister = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Registration failed');

        const data = await response.json();
        setToken(data.token);
        setUser({ username: data.username, email: data.email, fullName: data.fullName });
        setCurrentView('dashboard');
        setSuccess('Registration successful!');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView('login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    useEffect(() => {
      fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/accounts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch accounts');
        const data = await response.json();
        setAccounts(data);
        if (data.length > 0) setSelectedAccount(data[0]);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchTransactions = async (accountNumber) => {
      try {
        const response = await fetch(`${API_BASE_URL}/transactions/account/${accountNumber}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data.content || []);
      } catch (err) {
        setError(err.message);
      }
    };

    useEffect(() => {
      if (selectedAccount) {
        fetchTransactions(selectedAccount.accountNumber);
      }
    }, [selectedAccount]);

    const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Banking App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">{user?.fullName}</p>
              </div>
              <button
                onClick={() => {
                  setToken(null);
                  setUser(null);
                  setCurrentView('login');
                }}
                className="p-2 text-gray-600 hover:text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Total Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-8">
            <p className="text-blue-100 mb-2">Total Balance</p>
            <h2 className="text-4xl font-bold">${totalBalance.toFixed(2)}</h2>
            <p className="text-blue-100 mt-2">{accounts.length} Account{accounts.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => setCurrentView('createAccount')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-800">New Account</p>
            </button>
            <button
              onClick={() => setCurrentView('deposit')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-800">Deposit</p>
            </button>
            <button
              onClick={() => setCurrentView('withdraw')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-800">Withdraw</p>
            </button>
            <button
              onClick={() => setCurrentView('transfer')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <Send className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-800">Transfer</p>
            </button>
          </div>

          {/* Accounts List */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Accounts</h3>
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.accountId}
                  onClick={() => setSelectedAccount(account)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedAccount?.accountId === account.accountId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{account.accountType}</p>
                      <p className="text-sm text-gray-600">{account.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">${parseFloat(account.balance).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{account.currency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          {selectedAccount && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
                <button
                  onClick={() => fetchTransactions(selectedAccount.accountNumber)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No transactions yet</p>
                ) : (
                  transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 border-b">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.type === 'DEPOSIT' ? 'bg-green-100' :
                          transaction.type === 'WITHDRAWAL' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {transaction.type === 'DEPOSIT' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                           transaction.type === 'WITHDRAWAL' ? <TrendingDown className="w-5 h-5 text-red-600" /> :
                           <Send className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{transaction.type}</p>
                          <p className="text-sm text-gray-600">{transaction.description || 'No description'}</p>
                          <p className="text-xs text-gray-500">{new Date(transaction.transactionDate).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'DEPOSIT' ? 'text-green-600' :
                          transaction.type === 'WITHDRAWAL' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">{transaction.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Create Account Component
  const CreateAccount = () => {
    const [formData, setFormData] = useState({
      accountType: 'SAVINGS',
      initialDeposit: '',
      currency: 'USD'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/accounts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to create account');

        setSuccess('Account created successfully!');
        setCurrentView('dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <TransactionForm
        title="Create New Account"
        onSubmit={handleSubmit}
        onBack={() => setCurrentView('dashboard')}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
          <select
            value={formData.accountType}
            onChange={(e) => setFormData({...formData, accountType: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="SAVINGS">Savings</option>
            <option value="CHECKING">Checking</option>
            <option value="CURRENT">Current</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Initial Deposit</label>
          <input
            type="number"
            step="0.01"
            value={formData.initialDeposit}
            onChange={(e) => setFormData({...formData, initialDeposit: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </TransactionForm>
    );
  };

  // Deposit Component
  const DepositForm = () => {
    const [formData, setFormData] = useState({
      accountNumber: selectedAccount?.accountNumber || '',
      amount: '',
      description: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/transactions/deposit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Deposit failed');

        setSuccess('Deposit successful!');
        setCurrentView('dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <TransactionForm
        title="Deposit Money"
        onSubmit={handleSubmit}
        onBack={() => setCurrentView('dashboard')}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
          <select
            value={formData.accountNumber}
            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            {accounts.map((account) => (
              <option key={account.accountId} value={account.accountNumber}>
                {account.accountType} - {account.accountNumber} (${parseFloat(account.balance).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., Salary deposit"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {loading ? 'Processing...' : 'Deposit'}
        </button>
      </TransactionForm>
    );
  };

  // Withdraw Component
  const WithdrawForm = () => {
    const [formData, setFormData] = useState({
      accountNumber: selectedAccount?.accountNumber || '',
      amount: '',
      description: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/transactions/withdraw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Withdrawal failed');

        setSuccess('Withdrawal successful!');
        setCurrentView('dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <TransactionForm
        title="Withdraw Money"
        onSubmit={handleSubmit}
        onBack={() => setCurrentView('dashboard')}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
          <select
            value={formData.accountNumber}
            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            {accounts.map((account) => (
              <option key={account.accountId} value={account.accountNumber}>
                {account.accountType} - {account.accountNumber} (${parseFloat(account.balance).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., ATM withdrawal"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          {loading ? 'Processing...' : 'Withdraw'}
        </button>
      </TransactionForm>
    );
  };

  // Transfer Component
  const TransferForm = () => {
    const [formData, setFormData] = useState({
      fromAccountNumber: selectedAccount?.accountNumber || '',
      toAccountNumber: '',
      amount: '',
      description: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/transactions/transfer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Transfer failed');

        setSuccess('Transfer successful!');
        setCurrentView('dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <TransactionForm
        title="Transfer Money"
        onSubmit={handleSubmit}
        onBack={() => setCurrentView('dashboard')}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
          <select
            value={formData.fromAccountNumber}
            onChange={(e) => setFormData({...formData, fromAccountNumber: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            {accounts.map((account) => (
              <option key={account.accountId} value={account.accountNumber}>
                {account.accountType} - {account.accountNumber} (${parseFloat(account.balance).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To Account Number</label>
          <input
            type="text"
            value={formData.toAccountNumber}
            onChange={(e) => setFormData({...formData, toAccountNumber: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter destination account number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., Payment for services"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {loading ? 'Processing...' : 'Transfer'}
        </button>
      </TransactionForm>
    );
  };

  // Reusable Transaction Form Wrapper
  const TransactionForm = ({ title, children, onSubmit, onBack }) => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {children}
          </form>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div>
      {currentView === 'login' && <LoginForm />}
      {currentView === 'register' && <RegisterForm />}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'createAccount' && <CreateAccount />}
      {currentView === 'deposit' && <DepositForm />}
      {currentView === 'withdraw' && <WithdrawForm />}
      {currentView === 'transfer' && <TransferForm />}
    </div>
  );
}