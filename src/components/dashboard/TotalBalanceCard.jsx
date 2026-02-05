import { Card, CardContent, Typography, Box } from '@mui/material';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { formatCurrency } from '../../utils/formatters';
import { useSelector } from 'react-redux'; 

const TotalBalanceCard = () => {
  const accounts = useSelector((state) => state.accounts?.accounts || []);
  const totalBalance = (accounts || []).reduce((sum, acc) => sum + parseFloat(acc?.balance), 0);

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-hover">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between">
          <Box>
            <Typography variant="body2" className="opacity-90 mb-2">
              Total Balance
            </Typography>
            <Typography variant="h3" className="font-heading font-bold">
              {formatCurrency(totalBalance)}
            </Typography>
            <Typography variant="body2" className="opacity-90 mt-2">
              {accounts.length} Account{accounts.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <MdAccountBalanceWallet className="text-7xl opacity-20" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalBalanceCard;