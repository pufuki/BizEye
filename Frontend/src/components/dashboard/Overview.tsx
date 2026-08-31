import { TrendingUp, TrendingDown, ArrowUpRight, Sparkles, BarChart3, MessageSquareHeart, Package, IndianRupee } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';
import NoDataBanner from './NoDataBanner';

interface Props {
  onNavigate: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
  data?: DashboardData | null;
}

export default function Overview({ onNavigate, data }: Props) {
  const kpis = data
    ? [
        { label: 'Total Revenue', value: `₹${Math.round(data.totalRevenue).toLocaleString('en-IN')}`, change: '+12.5%', up: true, icon: IndianRupee },
        { label: 'Orders', value: data.totalOrders.toLocaleString(), change: '+8.2%', up: true, icon: Package },
        { label: 'Avg Order Value', value: `₹${Math.round(data.avgOrderValue).toLocaleString('en-IN')}`, change: '+3.1%', up: true, icon: BarChart3 },
        { label: 'Avg Rating', value: `${data.avgRating.toFixed(1)}/5`, change: data.avgRating >= 3.5 ? '+0.2' : '-0.3', up: data.avgRating >= 3.5, icon: MessageSquareHeart },
      ]
    : [
        { label: 'Total Revenue', value: '₹0', change: '0%', up: true, icon: IndianRupee },
        { label: 'Orders', value: '0', change: '0%', up: true, icon: Package },
        { label: 'Avg Order Value', value: '₹0', change: '0%', up: true, icon: BarChart3 },
        { label: 'Avg Rating', value: '--', change: '0', up: true, icon: MessageSquareHeart },
      ];

  const chartData = data?.revenueByMonth ? data.revenueByMonth.slice(-6) : [];
  const maxRev = chartData.length > 0 ? Math.max(...chartData.map((m) => m.revenue)) : 1;

  const topProducts = data?.topProducts ? data.topProducts.slice(0, 4) : [];
  const maxProdRev = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.revenue)) : 1;

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
            {data ? (
              <>
                <h2 className="text-lg font-semibold mb-2">Dataset Intelligence Summary</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                  Your uploaded dataset contains {data.totalOrders.toLocaleString()} transactions across {data.categories.length} categories. Average customer rating is {data.avgRating.toFixed(1)}/5 stars with total revenue of ₹{Math.round(data.totalRevenue).toLocaleString('en-IN')}.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-2">No Dataset Uploaded</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                  Upload your sales CSV dataset to unlock AI business intelligence summaries, performance metrics, sentiment tracking, and revenue forecasts.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
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

      {/* Empty State Banner if no dataset */}
      {!data ? (
        <NoDataBanner
          title="Upload Dataset to View Analytics"
          desc="No data loaded yet. Please upload a CSV dataset to view revenue charts, product rankings, and AI insights."
          onUploadClick={() => onNavigate('upload')}
        />
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200/60">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
                  <p className="text-xs text-gray-500">Monthly breakdown from dataset</p>
                </div>
                <button
                  onClick={() => onNavigate('performance')}
                  className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium"
                >
                  View details <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {chartData.map((m, i) => {
                  const h = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: `${h * 1.6}px` }}>
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-400 to-sky-300 rounded-t-lg transition-all duration-700"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top products */}
            <div className="bg-white rounded-xl p-6 border border-gray-200/60">
              <h3 className="font-semibold text-gray-900 mb-1">Top Products</h3>
              <p className="text-xs text-gray-500 mb-5">By total revenue in dataset</p>
              <div className="space-y-4">
                {topProducts.map((p) => {
                  const pct = maxProdRev > 0 ? (p.revenue / maxProdRev) * 100 : 0;
                  return (
                    <div key={p.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-700 truncate max-w-[170px]">{p.name}</span>
                        <span className="text-gray-500 font-medium">₹{Math.round(p.revenue).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dataset Insights */}
          <div className="bg-white rounded-xl p-6 border border-gray-200/60">
            <h3 className="font-semibold text-gray-900 mb-4">Dataset Overview</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 mb-1">Total Transactions</p>
                <p className="text-lg font-bold text-gray-900">{data.totalOrders.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 mb-1">Product Categories</p>
                <p className="text-lg font-bold text-gray-900">{data.categories.length} Categories</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 mb-1">Active SKUs</p>
                <p className="text-lg font-bold text-gray-900">{data.totalSKUs} Products</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
