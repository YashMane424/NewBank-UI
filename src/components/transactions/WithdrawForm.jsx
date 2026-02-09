import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Paper,
} from '@mui/material';

import { MdTrendingUp, MdArrowBack, MdAttachMoney, MdDescription } from 'react-icons/md';
import { FaWallet } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { withdraw } from '../../redux/slices/transactionSlice';
import { fetchAccounts } from '../../redux/slices/accountSlice';
import { formatCurrency } from '../../utils/formatters';

const withdrawForm =() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { account } = useSelector((state) => state.account);
    const { loading } = useSelector((state) => state.transaction);

    const [formData, setFormData] = useState({
        accountNumber: '',
        amount: '',
        description: '', 
    });

    useEffect(() => {
        dispatch(fetchAccounts());
    }, [dispatch]);

    useEffect(() => {
        if(account?.length > 0 && !formData.accountNumber) {
            setFormData((prev) => ({
                ...prev,
                accountNumber: account[0].accountNumber,
            }));
        }
    }, [account, formData.accountNumber]);

    const handleChange = (e) =>({
        ...formData,
        [e.target.name]: e.target.value,
    });

    const handleSubmit = async (e) => {
        e.preventDefaul();
        if (!formData.accountNumber || !formData.amount) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (parseFloat(formData.amount) > 100000) {
            toast.error('Maximum withdrawal amount is $100,000');
            return;
        }

        if (parseFloat(formData.amount) < 1) {
            toast.error('Minimum withdrawal amount is $1');
            return;
        }

        const WithdrawData = {
            accountNumber: formData.accountNumber,
            amount: parseFloat(formData.amount),
            description: formData.description || 'Withdraw',
        };

        try{
            await dispatch(withdraw(WithdrawData)).unwrap();
            toast.success('Withdraw submission Successful!');
            await dispatch(fetchAccounts()); 
            navigate('/dashboard');
        } catch(error){
            toast.error(error || 'Withdraw Failed');
        };

        const selectedAccount = account.find(
            (acc) => acc.acountNumber === formData.accountNumber
        );

        return (
            <div></div>
        );
    }
};

export default withdrawForm;