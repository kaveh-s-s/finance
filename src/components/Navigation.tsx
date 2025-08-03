import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LineChart, RefreshCw, Ban as Bank } from 'lucide-react';
import classNames from 'classnames';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/analyze', name: 'Analyze', icon: LineChart },
    { path: '/update', name: 'Update', icon: RefreshCw },
    { path: '/plaid', name: 'Plaid', icon: Bank },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <LineChart size={24} />
              <span className="font-bold text-xl">Expense Visualizer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={classNames(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
                    {
                      'bg-indigo-700': location.pathname === item.path,
                      'hover:bg-indigo-500': location.pathname !== item.path,
                    }
                  )}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-500 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={classNames(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium w-full',
                      {
                        'bg-indigo-700': location.pathname === item.path,
                        'hover:bg-indigo-500': location.pathname !== item.path,
                      }
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation