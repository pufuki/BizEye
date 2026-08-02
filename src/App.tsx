import { useState } from 'react';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

export type Page = 'landing' | 'login' | 'dashboard';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [userName, setUserName] = useState('');

  const handleLogin = (name: string) => {
    setUserName(name);
    setPage('dashboard');
  };

  if (page === 'landing') return <Landing onGetStarted={() => setPage('login')} />;
  if (page === 'login') return <Login onLogin={handleLogin} onBack={() => setPage('landing')} />;
  return <Dashboard userName={userName} onLogout={() => setPage('landing')} />;
}
