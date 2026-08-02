import { TrendingUp, TrendingDown, Package } from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200/60">
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
          desc="Upload a CSV dataset to analyze product performance, category breakdowns, and units sold."
          onUploadClick={onNavigate ? () => onNavigate('upload') : undefined}
        />
      ) : (
        <>
          {/* Category breakdown */}
          <div className="bg-white rounded-xl p-6 border border-gray-200/60">
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
          <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden">
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
