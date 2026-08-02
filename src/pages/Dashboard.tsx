import { useState } from 'react';
import {
  Eye, LayoutDashboard, BarChart3, MessageSquareHeart, TrendingUp,
  Upload, LogOut, Search, Bell, ChevronDown, Sparkles,
} from 'lucide-react';
import Overview from '@/components/dashboard/Overview';
import Performance from '@/components/dashboard/Performance';
import Sentiment from '@/components/dashboard/Sentiment';
import Predictive from '@/components/dashboard/Predictive';

interface Props {
  userName: string;
  onLogout: () => void;
}

type Section = 'overview' | 'performance' | 'sentiment' | 'predictive';

const NAV: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'sentiment', label: 'Sentiment', icon: MessageSquareHeart },
  { id: 'predictive', label: 'Predictive', icon: TrendingUp },
];

export default function Dashboard({ userName, onLogout }: Props) {
  const [section, setSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-[#0a0a0a] text-white flex flex-col transition-transform duration-300 shrink-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-2 border-b border-white/[0.06]">
          <Eye className="w-6 h-6 text-sky-400" strokeWidth={2.5} />
          <span className="text-lg font-semibold tracking-tight">
            Biz<span className="text-sky-400">Eye</span>
          </span>
        </div>

        {/* Upload CTA */}
        <div className="px-4 py-4">
          <button className="w-full flex items-center justify-center gap-2 bg-sky-400 text-black font-medium text-sm py-3 rounded-lg hover:bg-sky-300 transition-colors">
            <Upload className="w-4 h-4" />
            Upload Data
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          <p className="text-xs text-gray-600 uppercase tracking-wider px-3 py-2">Intelligence</p>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                section === item.id
                  ? 'bg-sky-400/10 text-sky-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* AI assistant card */}
        <div className="px-4 py-4">
          <div className="bg-gradient-to-br from-sky-400/10 to-sky-400/5 border border-sky-400/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-medium text-white">AI Assistant</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Ask questions about your data in plain English.
            </p>
            <button className="w-full text-xs text-sky-400 border border-sky-400/30 rounded-lg py-2 hover:bg-sky-400/10 transition-colors">
              Open Assistant
            </button>
          </div>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-semibold text-sm">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">Free Plan</p>
            </div>
            <button onClick={onLogout} className="text-gray-500 hover:text-white transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#f7f7f5]/80 backdrop-blur-md border-b border-gray-200/60">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600"
              >
                <div className="w-5 h-px bg-current mb-1.5" />
                <div className="w-5 h-px bg-current mb-1.5" />
                <div className="w-3 h-px bg-current" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 capitalize">{section}</h1>
                <p className="text-xs text-gray-500">
                  {section === 'overview' && 'Business intelligence at a glance'}
                  {section === 'performance' && 'Product & sales performance analysis'}
                  {section === 'sentiment' && 'Customer sentiment & feedback intelligence'}
                  {section === 'predictive' && 'AI-powered forecasts & predictions'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-64">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search insights..."
                  className="bg-transparent text-sm outline-none flex-1 placeholder-gray-400"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full" />
              </button>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-600 font-semibold text-xs">
                  {userName.charAt(0)}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </div>
            </div>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {section === 'overview' && <Overview onNavigate={setSection} />}
          {section === 'performance' && <Performance />}
          {section === 'sentiment' && <Sentiment />}
          {section === 'predictive' && <Predictive />}
        </main>
      </div>
    </div>
  );
}
