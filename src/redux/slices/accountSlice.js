import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const fetchDashboard = createAsyncThunk(
    "account/fetchDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/accounts/dashboard");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load dashboard");
        }
    }
);

export const fetchAccounts = createAsyncThunk(
    "account/fetchAccounts",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance?.get("/accounts");
            return response?.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch accounts");
        }   
    }
);

export const createAccount = createAsyncThunk(
    "account/createAccount",
    async (accountData, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post("/accounts/create", accountData);
            return response?.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create account");
        }
    }
);

const accountSlice = createSlice({
    name: "account",
    initialState: {
        accounts: [],
        selectedAccount: null,
        recentTransactions: [],
        loading: false,
        error: null,
    },
    reducers: {
        selectAccount: (state, action) => {       ///////to store which account is currently selected.
            state.selectedAccount = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateAccountBalance: (state, action) => {
            const { accountNumber, newBalance } = action.payload;
            const account = state.accounts.find(
                (acc) => acc.accountNumber === accountNumber
            );
            if (account) {
                account.balance = newBalance;
            }

            if (state.selectedAccount?.accountNumber === accountNumber) {
                state.selectedAccount.balance = newBalance;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => {    
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts.push(action.payload);    ////As this is a new account, we push it to the existing accounts array
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload.accounts;
                state.recentTransactions = action.payload.recentTransactions;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }

});

export const {selectAccount, clearError, updateAccountBalance} = accountSlice.actions;
export default accountSlice.reducer;