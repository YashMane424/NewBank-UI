import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (accountNumber, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/accounts/transactions/${accountNumber}`);
      return response.data.content || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const deposit = createAsyncThunk(
  'transactions/deposit',
  async (depositData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/transactions/deposit', depositData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Deposit failed');
    }
  }
);

export const withdraw = createAsyncThunk(
  'transactions/withdraw',
  async (withdrawData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/transactions/withdraw', withdrawData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Withdrawal failed');
    }
  }
);

export const transfer = createAsyncThunk(
  'transactions/transfer',
  async (transferData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/transactions/transfer', transferData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Transfer failed');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Deposit
      .addCase(deposit.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      // Withdraw
      .addCase(withdraw.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      // Transfer
      .addCase(transfer.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;