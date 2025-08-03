import React from 'react';
import { LineChart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LineChart size={28} className="text-white animate-pulse" />
          <h1 className="text-xl md:text-2xl font-bold">Expense Visualizer</h1>
        </div>
        <div className="text-sm md:text-base opacity-80">
          Visualize your expenses by category
        </div>
      </div>
    </header>
  );
};

export default Header;