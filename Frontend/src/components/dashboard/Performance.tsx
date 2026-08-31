import { TrendingUp, TrendingDown, Package, BarChart2 } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';
import NoDataBanner from './NoDataBanner';

interface Props {
  data?: DashboardData | null;
  onNavigate?: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
}

export default function Performance({ data, onNavigate }: Props) {
  const products = data
    ? data.productStats.slice(0, 15).map((p, idx) => ({
        name: p.name,
        sku: p.name.substring(0, 3).toUpperCase() + '-' + String(idx + 1).padStart(3, '0'),
        sold: p.unitsSold,
        revenue: p.revenueFormatted,
        growth: p.growth,
        up: p.up,
        status: p.status,
      }))
    : [];

  const categories = data
    ? data.categoryRevenue.map((c) => ({
        name: c.name,
        revenue: Math.round(c.revenue / 1000),
        color: c.color,
      }))
    : [];

  const maxCatRevenue = categories.length > 0 ? Math.max(...categories.map((c) => c.revenue)) : 1;

  const summaryCards = data
    ? [
        { label: 'Best Seller', value: data.bestSeller.name, sub: data.bestSeller.revenue + ' total revenue', icon: Package },
        { label: 'Total SKUs', value: String(data.totalSKUs), sub: `${data.productStats.length} active in dataset`, icon: Package },
        { label: 'Winning Products', value: String(data.winningCount), sub: 'Top revenue tier', icon: TrendingUp },
        { label: 'Declining Products', value: String(data.decliningCount), sub: 'Lower sales velocity', icon: TrendingDown },
      ]
    : [
        { label: 'Best Seller', value: '--', sub: '₹0 revenue', icon: Package },
        { label: 'Total SKUs', value: '0', sub: '0 active', icon: Package },
        { label: 'Winning Products', value: '0', sub: 'No data', icon: TrendingUp },
        { label: 'Declining Products', value: '0', sub: 'No data', icon: TrendingDown },
      ];

  // Sales Performance Graph calculations
  const monthlyData = data?.revenueByMonth || [];
  const maxMonthlyRevenue = monthlyData.length > 0 ? Math.max(...monthlyData.map((m) => m.revenue)) : 1;
  const peakMonth = monthlyData.length > 0
    ? monthlyData.reduce((max, curr) => (curr.revenue > max.revenue ? curr : max), monthlyData[0])
    : null;
  const avgMonthlyRevenue = data && monthlyData.length > 0 ? data.totalRevenue / monthlyData.length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200/60 shadow-sm">
            <s.icon className="w-5 h-5 text-gray-400 mb-3" />
            <p className="text-lg font-bold text-gray-900 mb-0.5 truncate">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {!data ? (
        <NoDataBanner
          title="No Performance Data Loaded"
          desc="Upload a CSV dataset to view the Sales Performance Graph, category revenue breakdowns, and product tables."
          onUploadClick={onNavigate ? () => onNavigate('upload') : undefined}
        />
      ) : (
        <>
          {/* Sales Performance Graph */}
          <div className="bg-white rounded-xl p-6 border border-gray-200/60 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart2 className="w-5 h-5 text-sky-500" />
                  <h3 className="font-semibold text-gray-900 text-base">Sales Performance Graph</h3>
                </div>
                <p className="text-xs text-gray-500">Monthly revenue trends and order volume from uploaded dataset</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-gray-600">
                  <span className="w-3 h-3 bg-sky-400 rounded-sm" /> Monthly Sales (₹)
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-3 px-2 border-b border-gray-100">
              {monthlyData.map((m, i) => {
                const revHeight = maxMonthlyRevenue > 0 ? (m.revenue / maxMonthlyRevenue) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    {/* Hover Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-gray-900 text-white text-[11px] py-1 px-2.5 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap font-mono">
                      ₹{Math.round(m.revenue).toLocaleString('en-IN')} • {m.orders.toLocaleString()} orders
                    </div>
                    {/* Bar */}
                    <div className="w-full max-w-[56px] bg-gray-100 rounded-t-xl relative overflow-hidden h-48 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-sky-500 to-sky-300 rounded-t-xl transition-all duration-500 group-hover:from-sky-400 group-hover:to-sky-200"
                        style={{ height: `${Math.max(revHeight, 4)}%` }}
                      />
                    </div>
                    {/* Month Label */}
                    <span className="text-xs font-medium text-gray-600">{m.month}</span>
                  </div>
                );
              })}
            </div>

            {/* Metric summary footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center text-xs">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-400 block text-[11px] mb-0.5">Peak Sales Month</span>
                <span className="text-gray-900 font-bold text-sm">
                  {peakMonth ? `${peakMonth.month} (₹${Math.round(peakMonth.revenue).toLocaleString('en-IN')})` : '--'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-400 block text-[11px] mb-0.5">Avg Monthly Revenue</span>
                <span className="text-gray-900 font-bold text-sm">
                  ₹{Math.round(avgMonthlyRevenue).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-400 block text-[11px] mb-0.5">Tracked Months</span>
                <span className="text-gray-900 font-bold text-sm">{monthlyData.length} Months</span>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-white rounded-xl p-6 border border-gray-200/60 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Revenue by Category</h3>
            <p className="text-xs text-gray-500 mb-6">Total category performance (₹ thousands)</p>
            <div className="space-y-4">
              {categories.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700">{c.name}</span>
                    <span className="text-gray-500 font-medium">₹{c.revenue}k</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${c.color} rounded-full`}
                      style={{ width: `${(c.revenue / maxCatRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product table */}
          <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Product Performance</h3>
              <p className="text-xs text-gray-500 mt-1">Products ranked by total revenue from uploaded dataset</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50">
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium">SKU</th>
                    <th className="px-6 py-3 font-medium text-right">Units Sold</th>
                    <th className="px-6 py-3 font-medium text-right">Revenue</th>
                    <th className="px-6 py-3 font-medium text-right">Growth Tier</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.sku} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-[220px] truncate">{p.name}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.sku}</td>
                      <td className="px-6 py-4 text-right text-gray-700">{p.sold.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{p.revenue}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${p.up ? 'text-emerald-600' : 'text-red-500'}`}>
                          {p.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {p.growth}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            p.status === 'winning'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'declining'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
