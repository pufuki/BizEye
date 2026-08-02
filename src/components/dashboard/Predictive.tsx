import { TrendingUp, AlertTriangle, Sparkles, Package, Users, DollarSign } from 'lucide-react';

const FORECASTS = [
  { metric: 'Revenue', current: '$284K', predicted: '$335K', change: '+18%', confidence: 92, icon: DollarSign },
  { metric: 'Orders', current: '1,847', predicted: '2,180', change: '+18%', confidence: 88, icon: Package },
  { metric: 'New Customers', current: '412', predicted: '520', change: '+26%', confidence: 85, icon: Users },
];

const STOCKOUTS = [
  { product: 'Organic Cotton Tee', days: 9, severity: 'critical', stock: 24, velocity: '2.7/day' },
  { product: 'Summer Hoodie', days: 14, severity: 'warning', stock: 56, velocity: '4.0/day' },
  { product: 'Linen Shirt', days: 21, severity: 'warning', stock: 89, velocity: '4.2/day' },
  { product: 'Denim Jacket', days: 38, severity: 'safe', stock: 152, velocity: '4.0/day' },
];

const AT_RISK_CUSTOMERS = [
  { name: 'Sarah K.', orders: 3, lastOrder: '47 days ago', risk: 'High', reason: 'No repeat purchase in 47 days' },
  { name: 'Mike R.', orders: 5, lastOrder: '38 days ago', risk: 'High', reason: 'Sent negative review' },
  { name: 'Emma L.', orders: 2, lastOrder: '25 days ago', risk: 'Medium', reason: 'Decreasing order frequency' },
  { name: 'James P.', orders: 8, lastOrder: '21 days ago', risk: 'Medium', reason: 'Lower AOV than usual' },
];

export default function Predictive() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI insight banner */}
      <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-sky-400/10 rounded-full blur-[80px]" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 bg-sky-400/20 border border-sky-400/30 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-sky-400 uppercase tracking-widest mb-1">AI Forecast</p>
            <h2 className="text-lg font-semibold mb-2">Next month looks strong — but prepare for 2 stockouts.</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
              Based on 6 months of sales velocity, AI predicts 18% revenue growth next month. However, "Organic Cotton Tee" will sell out in 9 days at current pace. Place a restock order now to avoid lost sales.
            </p>
          </div>
        </div>
      </div>

      {/* Forecast cards */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">30-Day Forecasts</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {FORECASTS.map((f) => (
            <div key={f.metric} className="bg-white rounded-xl p-6 border border-gray-200/60">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-sky-600" />
                </div>
                <span className="text-xs text-gray-400">{f.confidence}% confidence</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{f.metric}</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-2xl font-bold text-gray-900">{f.predicted}</span>
                <span className="text-sm text-gray-400 mb-1">from {f.current}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-600">{f.change} predicted</span>
              </div>
              {/* Confidence bar */}
              <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${f.confidence}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stockout predictions */}
      <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Stockout Predictions</h3>
            <p className="text-xs text-gray-500 mt-1">When each product will run out at current sales velocity</p>
          </div>
          <AlertTriangle className="w-5 h-5 text-sky-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium text-right">Current Stock</th>
                <th className="px-6 py-3 font-medium text-right">Sales Velocity</th>
                <th className="px-6 py-3 font-medium text-right">Days Until Stockout</th>
                <th className="px-6 py-3 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {STOCKOUTS.map((s) => (
                <tr key={s.product} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{s.product}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{s.stock} units</td>
                  <td className="px-6 py-4 text-right text-gray-500">{s.velocity}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${s.severity === 'critical' ? 'text-red-600' : s.severity === 'warning' ? 'text-sky-600' : 'text-emerald-600'}`}>
                      {s.days} days
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      s.severity === 'critical' ? 'bg-red-50 text-red-600'
                      : s.severity === 'warning' ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {s.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* At-risk customers */}
      <div className="bg-white rounded-xl p-6 border border-gray-200/60">
        <h3 className="font-semibold text-gray-900 mb-1">At-Risk Customers</h3>
        <p className="text-xs text-gray-500 mb-6">AI-flagged customers likely to churn — reach out to retain them</p>
        <div className="space-y-3">
          {AT_RISK_CUSTOMERS.map((c) => (
            <div key={c.name} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-semibold text-sm">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.reason}</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-xs text-gray-400">{c.orders} orders</p>
                <p className="text-xs text-gray-400">Last: {c.lastOrder}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                c.risk === 'High' ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-700'
              }`}>
                {c.risk} Risk
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
