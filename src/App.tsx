import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AnalyzePage from './pages/AnalyzePage';
import UpdatePage from './pages/UpdatePage';
import PlaidPage from './pages/PlaidPage';
import PlaidOAuthRedirect from './pages/PlaidOAuthRedirect';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/update" element={<UpdatePage />} />
          <Route path="/plaid" element={<PlaidPage />} />
          <Route path="/plaid-oauth-redirect" element={<PlaidOAuthRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;