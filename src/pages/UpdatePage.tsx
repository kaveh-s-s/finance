import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { parseCreditData } from '../utils/dataUtils';
import { getAccountData, appendAccountData } from '../utils/storageUtils';
import { CreditEntry, AccountType } from '../types';

const ACCOUNTS = ['Kaveh Credit', 'Kaveh Debit', 'Kaveh Sparkasse', 'Negar Credit'] as const;

const CATEGORIES = [
  'personal_expenses',
  'household_exp',
  'grocery',
  'health',
  'restaurant',
  'leasure',
  'transportation',
  'rent',
  'others',
  'gift',
  'loan'
];

const KNOWN_CATEGORIES: Record<string, string> = {
  'ARIA': 'grocery',
  'BRANDON & JOANNY': 'grocery',
  'BC LIQUOR': 'grocery',
  'URBAN FARE': 'grocery',
  'SAFEWAY': 'grocery',
  'IGA': 'grocery',
  'NESTERS MARKET': 'grocery',
  'Google CLOUD': 'personal_expenses',
  'GITHUB': 'personal_expenses',
  'HOME DEPOT': 'household_exp',
  'OPENAI': 'personal_expenses',
  'CANADIAN TIRE': 'household_exp',
  'PAYBRIGHT': 'personal_expenses',
  'LION & SUN': 'grocery',
  'MARKETPLACE IGA': 'grocery',
  'SAVE ON FOODS': 'grocery',
  'SUNGIVEN FOODS': 'grocery',
  'SHOPPER': 'household_exp',
  'DOLLARAMA': 'household_exp',
  'LONDON DRUGS': 'household_exp',
  'LYFT': 'transportation',
  'COMPASS': 'transportation',
  'EvoCarShare Burnaby, BC': 'transportation',
  'UBER CANADA/UBERTRIP TORONTO, ON': 'transportation'
};

function UpdatePage() {
  const [selectedAccount, setSelectedAccount] = useState<AccountType>(ACCOUNTS[0]);
  const [data, setData] = useState<CreditEntry[]>([]);
  const [existingData, setExistingData] = useState<CreditEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingEntry, setEditingEntry] = useState<CreditEntry | null>(null);
  const [newEntries, setNewEntries] = useState<CreditEntry[]>([]);

  useEffect(() => {
    const data = getAccountData(selectedAccount);
    setExistingData(data);
  }, [selectedAccount]);

  const handleFileUpload = async (file: File) => {
    try {
      const parsedData = await parseCreditData(file);
      
      // Get the latest date from existing data
      const latestExistingDate = existingData.length > 0 
        ? new Date(Math.max(...existingData.map(entry => new Date(entry.Date).getTime())))
        : new Date(0);

      // Filter new entries
      const newData = parsedData.filter(entry => new Date(entry.Date) > latestExistingDate);

      // Auto-categorize based on known categories
      const categorizedData = newData.map(entry => {
        let category = '';
        
        for (const [phrase, cat] of Object.entries(KNOWN_CATEGORIES)) {
          if ((entry.Description || '').includes(phrase)) {
            category = cat;
            break;
          }
        }
        
        return {
          ...entry,
          Flag1: category || 'others',
          Flag2: '',
          Kaveh: 0.5,
          Negar: 0.5,
          Card: selectedAccount
        };
      });

      setNewEntries(categorizedData);
      if (categorizedData.length > 0) {
        setEditingEntry(categorizedData[0]);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error parsing file:', error);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleSave = () => {
    if (!editingEntry || !newEntries.length) return;
    
    const updatedEntries = [...newEntries];
    updatedEntries[currentIndex] = editingEntry;
    setNewEntries(updatedEntries);
    
    if (currentIndex < newEntries.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setEditingEntry(updatedEntries[currentIndex + 1]);
    }
  };

  const handleConfirm = () => {
    const updatedData = appendAccountData(selectedAccount, newEntries);
    setExistingData(updatedData);
    setNewEntries([]);
    setEditingEntry(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Update Account Data</h2>
          
          {/* Account Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Account
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value as AccountType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ACCOUNTS.map((account) => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-update"
            />
            <label
              htmlFor="file-upload-update"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <Upload size={48} className="text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drop your CSV file here or click to upload
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a CSV file to update {selectedAccount} data
                </p>
              </div>
            </label>
          </div>

          {/* New Entries Editor */}
          {editingEntry && newEntries.length > 0 && (
            <div className="mt-8 border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Edit Entry {currentIndex + 1} of {newEntries.length}
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save & Next
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Confirm All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editingEntry.Date}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingEntry.Description || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={editingEntry.Out || editingEntry.In || 0}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category (Flag1)
                  </label>
                  <select
                    value={editingEntry.Flag1}
                    onChange={(e) => setEditingEntry({ ...editingEntry, Flag1: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Flag2)
                  </label>
                  <input
                    type="text"
                    value={editingEntry.Flag2 || ''}
                    onChange={(e) => setEditingEntry({ ...editingEntry, Flag2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kaveh Share
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editingEntry.Kaveh}
                    onChange={(e) => setEditingEntry({ ...editingEntry, Kaveh: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Negar Share
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editingEntry.Negar}
                    onChange={(e) => setEditingEntry({ ...editingEntry, Negar: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Existing Data Preview */}
          {existingData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Existing Data (Last 5 Entries)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {existingData.slice(-5).map((entry, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.Date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.Description || ''}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.Out || entry.In}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.Flag1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdatePage;