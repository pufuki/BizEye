import { TrendingUp, TrendingDown, Package } from 'lucide-react';

const PRODUCTS = [
  { name: 'Summer Cotton Tee', sku: 'TEE-001', sold: 342, revenue: '$42,300', growth: '+34%', up: true, status: 'winning' },
  { name: 'Organic Hoodie', sku: 'HUD-002', sold: 210, revenue: '$31,800', growth: '+18%', up: true, status: 'winning' },
  { name: 'Linen Shirt', sku: 'SHT-003', sold: 168, revenue: '$24,500', growth: '+12%', up: true, status: 'stable' },
  { name: 'Denim Jacket', sku: 'JCK-004', sold: 95, revenue: '$18,200', growth: '+5%', up: true, status: 'stable' },
  { name: 'Wireless Earbuds Pro', sku: 'AUD-005', sold: 42, revenue: '$8,400', growth: '-22%', up: false, status: 'declining' },
  { name: 'Phone Case V2', sku: 'CSE-006', sold: 38, revenue: '$2,300', growth: '-28%', up: false, status: 'declining' },
  { name: 'USB-C Cable', sku: 'CBL-007', sold: 31, revenue: '$930', growth: '-20%', up: false, status: 'declining' },
  { name: 'Skincare Set', sku: 'SKN-008', sold: 156, revenue: '$15,600', growth: '+9%', up: true, status: 'stable' },
];

const CATEGORIES = [
  { name: 'Apparel', revenue: 142, color: 'bg-sky-400' },
  { name: 'Electronics', revenue: 48, color: 'bg-blue-400' },
  { name: 'Beauty', revenue: 62, color: 'bg-emerald-400' },
  { name: 'Accessories', revenue: 32, color: 'bg-purple-400' },
];

export default function Performance() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Best Seller', value: 'Summer Cotton Tee', sub: '$42,300 revenue', icon: Package },
          { label: 'Total SKUs', value: '47', sub: '8 active this month', icon: Package },
          { label: 'Winning Products', value: '4', sub: 'Growth > 10%', icon: TrendingUp },
          { label: 'Declining Products', value: '3', sub: 'Needs attention', icon: TrendingDown },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200/60">
            <s.icon className="w-5 h-5 text-gray-400 mb-3" />
            <p className="text-lg font-bold text-gray-900 mb-0.5">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown + Monthly comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200/60">
          <h3 className="font-semibold text-gray-900 mb-1">Revenue by Category</h3>
          <p className="text-xs text-gray-500 mb-6">This month ($ thousands)</p>
          <div className="space-y-4">
            {CATEGORIES.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-700">{c.name}</span>
                  <span className="text-gray-500 font-medium">${c.revenue}k</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${(c.revenue / 142) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200/60">
          <h3 className="font-semibold text-gray-900 mb-1">Monthly Comparison</h3>
          <p className="text-xs text-gray-500 mb-6">This year vs last year</p>
          <div className="space-y-3">
            {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => {
              const prev = [38, 42, 40, 52, 58, 62][i];
              const curr = [45, 52, 48, 61, 70, 85][i];
              return (
                <div key={m} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-8">{m}</span>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 rounded-full" style={{ width: `${prev}%` }} />
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full" style={{ width: `${curr}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium w-10 text-right">+{curr - prev}%</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-gray-300 rounded-full" /> Last year</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-sky-400 rounded-full" /> This year</span>
          </div>
        </div>
      </div>

      {/* Product table */}
      <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Product Performance</h3>
          <p className="text-xs text-gray-500 mt-1">All products ranked by revenue this month</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium text-right">Units Sold</th>
                <th className="px-6 py-3 font-medium text-right">Revenue</th>
                <th className="px-6 py-3 font-medium text-right">Growth</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PRODUCTS.map((p) => (
                <tr key={p.sku} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{p.sold}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{p.revenue}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${p.up ? 'text-emerald-600' : 'text-red-500'}`}>
                      {p.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {p.growth}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      p.status === 'winning' ? 'bg-emerald-50 text-emerald-700'
                      : p.status === 'declining' ? 'bg-red-50 text-red-600'
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
