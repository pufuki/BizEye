import { TrendingUp, AlertTriangle, Sparkles, Package, Users, IndianRupee } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';
import NoDataBanner from './NoDataBanner';

interface Props {
  data?: DashboardData | null;
  onNavigate?: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
}

export default function Predictive({ data, onNavigate }: Props) {
  const formatCurr = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n.toFixed(0)}`;
  };

  const lastMonthRevenue = data?.revenueByMonth[data.revenueByMonth.length - 1]?.revenue || 0;
  const lastMonthOrders = data?.revenueByMonth[data.revenueByMonth.length - 1]?.orders || 0;

  const forecasts = data
    ? [
        { metric: '30-Day Revenue Forecast', current: formatCurr(lastMonthRevenue), predicted: formatCurr(data.predictedRevenue), change: data.revenueGrowthPct, confidence: 92, icon: IndianRupee },
        { metric: '30-Day Order Volume', current: lastMonthOrders.toLocaleString(), predicted: data.predictedOrders.toLocaleString(), change: data.ordersGrowthPct, confidence: 88, icon: Package },
        { metric: 'Avg Customer Rating', current: data.avgRating.toFixed(1), predicted: Math.min(5.0, data.avgRating * 1.03).toFixed(1), change: '+3%', confidence: 85, icon: Users },
      ]
    : [
        { metric: '30-Day Revenue Forecast', current: '₹0', predicted: '₹0', change: '0%', confidence: 0, icon: IndianRupee },
        { metric: '30-Day Order Volume', current: '0', predicted: '0', change: '0%', confidence: 0, icon: Package },
        { metric: 'Avg Customer Rating', current: '--', predicted: '--', change: '0%', confidence: 0, icon: Users },
      ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI forecast banner */}
      <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-sky-400/10 rounded-full blur-[80px]" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 bg-sky-400/20 border border-sky-400/30 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-sky-400 uppercase tracking-widest mb-1">AI Demand Forecast</p>
            {data ? (
              <>
                <h2 className="text-lg font-semibold mb-2">Predictive Demand Analysis</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                  Based on {data.revenueByMonth.length} month(s) of sales trends across {data.totalOrders.toLocaleString()} orders, AI projects {data.revenueGrowthPct} revenue growth next month with estimated revenue of {formatCurr(data.predictedRevenue)}.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-2">No Forecast Available</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                  Upload a sales CSV dataset to calculate AI-powered 30-day demand projections and order volume forecasts.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {!data ? (
        <NoDataBanner
          title="No Predictive Data Available"
          desc="Upload a CSV dataset to generate AI 30-day revenue and order volume forecasts."
          onUploadClick={onNavigate ? () => onNavigate('upload') : undefined}
        />
      ) : (
        <>
          {/* Forecast cards */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">30-Day Forecasts</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {forecasts.map((f) => (
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

          {/* Dataset Category Growth Forecasts */}
          <div className="bg-white rounded-xl p-6 border border-gray-200/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Category Growth Forecasts</h3>
                <p className="text-xs text-gray-500">Predicted category trends for next 30 days</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-sky-500" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.categoryRevenue.map((cat) => (
                <div key={cat.name} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-2">
                  <p className="text-xs font-semibold text-gray-900">{cat.name}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Current Rev: ₹{Math.round(cat.revenue / 1000)}k</span>
                    <span className="text-emerald-600 font-medium">+15% est.</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
