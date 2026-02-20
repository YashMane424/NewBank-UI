import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Box } from '@mui/material';
import { fetchAccounts } from '../../redux/slices/accountSlice';
import { fetchTransactions } from '../../redux/slices/transactionSlice';
import TotalBalanceCard from './TotalBalanceCard';
import QuickActions from './QuickActions';
import AccountCard from './AccountCard';
import TransactionList from './TransactionList';
import LoadingSpinner from '../common/LoadingSpinner';


const Dashboard = () => {
  const dispatch = useDispatch();
  const { accounts, selectedAccount, loading } = useSelector((state) => ({
    accounts: state.account?.accounts || [],
    selectedAccount: state.account?.selectedAccount,
    loading: state.account?.loading || false,
}));

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    if (selectedAccount) {
      dispatch(fetchTransactions(selectedAccount.accountNumber));
    }
  }, [selectedAccount, dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="xl" className="py-8">
      <Grid container spacing={3}>
        {/* Total Balance */}
        <Grid item xs={12}>
          <TotalBalanceCard accounts={accounts} />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <QuickActions />
        </Grid>

        {/* Account Cards */}
        <Grid item xs={12} md={6}>
          <Box className="space-y-4">
            {(accounts || []).map((account) => (
              <AccountCard key={account.accountId} account={account} />
            ))}
          </Box>
        </Grid>

        {/* Transaction List */}
        <Grid item xs={12} md={6}>
          <TransactionList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;