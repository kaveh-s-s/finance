import React, { useState, useEffect } from 'react';
import ExpenseChart from '../components/ExpenseChart';
import { AlertCircle } from 'lucide-react';

interface ExpenseData {
  YearMonth: string;
  Flag1: string;
  sum_out_times: number;
}

function AnalyzePage() {
  const [selectedPerson, setSelectedPerson] = useState<'Kaveh' | 'Negar' | 'both'>('both');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set initial dates
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    sixMonthsAgo.setDate(1); // Start from first day of the month

    setToDate(today.toISOString().split('T')[0]);
    setFromDate(sixMonthsAgo.toISOString().split('T')[0]);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = `https://xybju2l096.execute-api.us-west-2.amazonaws.com/prod/data?user_id=0001&date_start=${fromDate}&date_end=${toDate}&user_name=${selectedPerson}`;
      console.log('Fetching data from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      // Parse the string response into JSON if it's a string
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (!Array.isArray(parsedData)) {
        throw new Error('Invalid data format received from API');
      }
      
      setExpenses(parsedData);
    } catch (error) {
      console.error('Error loading data:', error);
      let errorMessage = 'Failed to load expense data. ';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage += 'Unable to connect to the API. Please check your internet connection and try again.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'An unexpected error occurred. Please try again later.';
      }
      
      setError(errorMessage);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Person
              </label>
              <select
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value as 'Kaveh' | 'Negar' | 'both')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="both">Both</option>
                <option value="Kaveh">Kaveh</option>
                <option value="Negar">Negar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={isLoading}
            className={`mt-6 w-full py-2 px-4 rounded-md transition-colors ${
              isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : 'Visualize'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!error && expenses.length > 0 && (
          <ExpenseChart data={expenses} person={selectedPerson} />
        )}

        {!error && !isLoading && expenses.length === 0 && (
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-md">
            <p className="text-gray-700">No expense data available for the selected criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default AnalyzePage;