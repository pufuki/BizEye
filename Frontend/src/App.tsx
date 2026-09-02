import { useState } from 'react';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

export type Page = 'landing' | 'login' | 'dashboard';

export interface UserInfo {
  username: string;
  email: string;
  role?: string;
  company?: string;
}

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: 'Demo Store Owner',
    email: 'owner@bizeye.com',
    role: 'Business Owner / Founder',
    company: 'D2C Retail Store',
  });

  const handleLogin = (user: UserInfo) => {
    setUserInfo(user);
    setPage('dashboard');
  };

  const handleUpdateUserInfo = (updated: UserInfo) => {
    setUserInfo(updated);
  };

  if (page === 'landing') return <Landing onGetStarted={() => setPage('login')} />;
  if (page === 'login') return <Login onLogin={handleLogin} onBack={() => setPage('landing')} />;
  return (
    <Dashboard
      userInfo={userInfo}
      onUpdateUserInfo={handleUpdateUserInfo}
      onLogout={() => setPage('landing')}
    />
  );
}
