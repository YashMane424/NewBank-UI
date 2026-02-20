import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


import LoginForm from './components/auth/loginForm';
import RegisterForm from './components/auth/registerform';


import Dashboard from './components/dashboard/Dashboard';


 import DepositForm from './components/transactions/DepositForm';
 import WithdrawForm from './components/transactions/WithdrawForm';
 import TransferForm from './components/transactions/TransferForm';


//import CreateAccountForm from './components/accounts/CreateAccountForm';


import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterForm />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          { <>
          <Route path="deposit" element={<DepositForm />} />
          <Route path="withdraw" element={<WithdrawForm />} />
          <Route path="transfer" element={<TransferForm />} /></>
          /*<Route path="create-account" element={<CreateAccountForm />} /> */
          } 
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;