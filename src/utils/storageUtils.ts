import { CreditEntry } from '../types';

const STORAGE_KEYS = {
  KAVEH_CREDIT: 'kaveh_credit_data',
  KAVEH_DEBIT: 'kaveh_debit_data',
  KAVEH_SPARKASSE: 'kaveh_sparkasse_data',
  NEGAR_CREDIT: 'negar_credit_data',
};

export const saveAccountData = (accountType: string, data: CreditEntry[]) => {
  const key = Object.entries(STORAGE_KEYS).find(([_, value]) => 
    value.toLowerCase().includes(accountType.toLowerCase().replace(' ', '_'))
  )?.[1];

  if (!key) {
    throw new Error('Invalid account type');
  }

  localStorage.setItem(key, JSON.stringify(data));
};

export const getAccountData = (accountType: string): CreditEntry[] => {
  const key = Object.entries(STORAGE_KEYS).find(([_, value]) => 
    value.toLowerCase().includes(accountType.toLowerCase().replace(' ', '_'))
  )?.[1];

  if (!key) {
    return [];
  }

  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const appendAccountData = (accountType: string, newData: CreditEntry[]) => {
  const existingData = getAccountData(accountType);
  const combinedData = [...existingData, ...newData];
  saveAccountData(accountType, combinedData);
  return combinedData;
};