import Papa from 'papaparse';
import { ExpenseItem, ParsedCSVData, CreditEntry } from '../types';
import { resetColorIndex } from './colorUtils';

export const parseCSVFile = (file: File): Promise<ParsedCSVData> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          resolve({
            data: [],
            error: true,
            message: results.errors[0].message
          });
          return;
        }
        
        try {
          const parsedData = validateAndTransformData(results.data);
          resetColorIndex();
          resolve({
            data: parsedData,
            error: false
          });
        } catch (error: any) {
          resolve({
            data: [],
            error: true,
            message: error.message
          });
        }
      },
      error: (error) => {
        resolve({
          data: [],
          error: true,
          message: error.message
        });
      }
    });
  });
};

export const parseCreditData = (file: File): Promise<CreditEntry[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }

        try {
          const parsedData = results.data as CreditEntry[];
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const validateAndTransformData = (data: any[]): ExpenseItem[] => {
  if (data.length === 0) {
    throw new Error('The CSV file appears to be empty');
  }
  
  const firstRow = data[0];
  if (!('Negar_share' in firstRow) || !('Flag1' in firstRow)) {
    throw new Error('CSV must include "Negar_share" and "Flag1" columns');
  }
  
  return data.map(row => {
    const amount = parseFloat(row.Negar_share?.toString().replace(/[^0-9.-]+/g, '') || '0');
    
    if (isNaN(amount)) {
      throw new Error('Invalid amount format in Negar_share column');
    }
    
    return {
      date: new Date().toISOString(), // Using current date as it's not needed for pie chart
      amount,
      category: row.Flag1?.toString() || 'Uncategorized',
      description: ''
    };
  });
};