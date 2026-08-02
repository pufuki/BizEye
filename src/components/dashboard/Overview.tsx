import { TrendingUp, TrendingDown, ArrowUpRight, Sparkles, BarChart3, MessageSquareHeart, Package, DollarSign } from 'lucide-react';

interface Props {
  onNavigate: (s: 'overview' | 'performance' | 'sentiment' | 'predictive') => void;
}

const KPIS = [
  { label: 'Total Revenue', value: '$284,500', change: '+12.5%', up: true, icon: DollarSign },
  { label: 'Orders', value: '1,847', change: '+8.2%', up: true, icon: Package },
  { label: 'Avg Order Value', value: '$154', change: '+3.1%', up: true, icon: BarChart3 },
  { label: 'Customer Satisfaction', value: '4.2/5', change: '-0.3', up: false, icon: MessageSquareHeart },
];

const INSIGHTS = [
  {
    type: 'positive',
    title: 'Revenue up 12.5% this month',
    desc: 'Driven by a 34% surge in your "Summer Collection" category. Consider increasing ad spend here.',
  },
  {
    type: 'warning',
    title: '3 products declining sharply',
    desc: 'Wireless Earbuds Pro, Phone Case V2, and USB-C Cable saw 20%+ drop in sales. Review pricing or inventory.',
  },
  {
    type: 'predictive',
    title: 'Stockout predicted in 9 days',
    desc: 'At current sales velocity, "Organic Cotton Tee" will sell out before your next restock arrives.',
  },
];

const RECENT_ACTIVITY = [
  { time: '2h ago', text: 'New insight: Customer sentiment improving for "Skincare Set"', tag: 'Sentiment' },
  { time: '5h ago', text: 'Forecast updated for Q3 demand — expected 18% growth', tag: 'Predictive' },
  { time: '1d ago', text: 'Performance report generated for 1,847 orders', tag: 'Performance' },
  { time: '2d ago', text: 'Data uploaded: July sales data (2,341 rows)', tag: 'Upload' },
];

export default function Overview({ onNavigate }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI Summary banner */}
      <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-sky-400/10 rounded-full blur-[80px]" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 bg-sky-400/20 border border-sky-400/30 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-sky-400 uppercase tracking-widest mb-1">AI Summary</p>
            <h2 className="text-lg font-semibold mb-2">Your business is healthy, but 3 products need attention.</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
              Revenue grew 12.5% driven by your Summer Collection. Customer sentiment is stable but dipped slightly due to shipping delays on 2 SKUs. AI predicts an 18% demand increase next month — consider pre-ordering inventory for your top 5 products.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-gray-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                <kpi.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
            <button
              onClick={() => onNavigate('performance')}
              className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium"
            >
              View details <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {/* SVG chart */}
          <div className="h-48 flex items-end justify-between gap-2">
            {[45, 52, 48, 61, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: `${h * 1.6}px` }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-400 to-sky-300 rounded-t-lg transition-all duration-700"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl p-6 border border-gray-200/60">
          <h3 className="font-semibold text-gray-900 mb-1">Top Products</h3>
          <p className="text-xs text-gray-500 mb-5">By revenue this month</p>
          <div className="space-y-4">
            {[
              { name: 'Summer Cotton Tee', rev: '$42,300', pct: 100 },
              { name: 'Organic Hoodie', rev: '$31,800', pct: 75 },
              { name: 'Linen Shirt', rev: '$24,500', pct: 58 },
              { name: 'Denim Jacket', rev: '$18,200', pct: 43 },
            ].map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-700">{p.name}</span>
                  <span className="text-gray-500 font-medium">{p.rev}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            {INSIGHTS.map((ins) => (
              <div
                key={ins.title}
                className="bg-white rounded-xl p-4 border border-gray-200/60 flex gap-3"
              >
                <div
                  className={`w-1 rounded-full shrink-0 ${
                    ins.type === 'positive' ? 'bg-emerald-500' : ins.type === 'warning' ? 'bg-red-500' : 'bg-sky-400'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{ins.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{ins.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="bg-white rounded-xl border border-gray-200/60 divide-y divide-gray-100">
            {RECENT_ACTIVITY.map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <div className="w-2 h-2 bg-sky-400 rounded-full mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{act.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{act.time}</span>
                    <span className="text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{act.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
