import { Sparkles, ThumbsUp, ThumbsDown, Meh, Star } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';
import NoDataBanner from './NoDataBanner';

interface Props {
  data?: DashboardData | null;
  onNavigate?: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
}

export default function Sentiment({ data, onNavigate }: Props) {
  const sentimentData = data
    ? [
        { label: 'Positive (4-5★)', value: data.sentimentBreakdown.positive, icon: ThumbsUp },
        { label: 'Neutral (3★)', value: data.sentimentBreakdown.neutral, icon: Meh },
        { label: 'Negative (1-2★)', value: data.sentimentBreakdown.negative, icon: ThumbsDown },
      ]
    : [];

  const themes = data
    ? data.ratingByCategory.map((r) => ({
        name: r.name,
        score: r.score,
        mentions: r.count,
      }))
    : [];

  const reviews = data
    ? data.recentReviews.map((r) => ({
        text: r.text,
        product: r.productName,
        rating: r.rating,
        date: r.date,
        sentiment: r.sentiment,
      }))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI Analysis Card */}
      <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-sky-400/10 rounded-full blur-[80px]" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 bg-sky-400/20 border border-sky-400/30 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-sky-400 uppercase tracking-widest mb-1">Sentiment Intelligence</p>
            {data ? (
              <>
                <h2 className="text-lg font-semibold mb-2">Customer Feedback Analysis</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                  Analyzed {data.totalOrders.toLocaleString()} customer ratings across {data.categories.length} categories. Overall average customer satisfaction score is {data.avgRating.toFixed(1)} / 5.0 stars.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-2">No Customer Reviews Loaded</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                  Upload a CSV dataset with customer ratings and review texts to analyze sentiment distribution and category satisfaction scores.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {!data ? (
        <NoDataBanner
          title="No Sentiment Data Available"
          desc="Upload a CSV dataset to view review sentiment breakdown, category satisfaction ratings, and customer feedback."
          onUploadClick={onNavigate ? () => onNavigate('upload') : undefined}
        />
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Donut Sentiment Breakdown */}
            <div className="bg-white rounded-xl p-6 border border-gray-200/60 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Overall Sentiment</h3>
                <p className="text-xs text-gray-500 mb-6">Based on dataset star ratings</p>
              </div>

              {/* Circular percentage display */}
              <div className="flex justify-center my-4">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(data.sentimentBreakdown.positive * 2.51).toFixed(0)} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-gray-900">{data.sentimentBreakdown.positive}%</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Positive</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
                {sentimentData.map((s) => (
                  <div key={s.label} className="p-2 rounded-lg bg-gray-50">
                    <s.icon
                      className={`w-4 h-4 mx-auto mb-1 ${
                        s.label.includes('Positive')
                          ? 'text-emerald-500'
                          : s.label.includes('Neutral')
                          ? 'text-gray-400'
                          : 'text-red-400'
                      }`}
                    />
                    <p className="text-xs font-bold text-gray-900">{s.value}%</p>
                    <p className="text-[10px] text-gray-400 truncate">{s.label.split(' ')[0]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Satisfaction Scores */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200/60">
              <h3 className="font-semibold text-gray-900 mb-1">Satisfaction by Category</h3>
              <p className="text-xs text-gray-500 mb-6">Star rating score converted to 0–100 index</p>
              <div className="space-y-4">
                {themes.map((t) => (
                  <div key={t.name}>
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="text-gray-700 font-medium">{t.name}</span>
                      <span className="text-xs text-gray-500">
                        {t.score}/100 <span className="text-gray-400 font-normal">({t.mentions} reviews)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          t.score >= 75 ? 'bg-emerald-500' : t.score >= 50 ? 'bg-sky-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${t.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="bg-white rounded-xl p-6 border border-gray-200/60">
            <h3 className="font-semibold text-gray-900 mb-1">Customer Reviews & Feedback</h3>
            <p className="text-xs text-gray-500 mb-6">Recent customer reviews from uploaded dataset</p>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((r, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900 truncate max-w-[180px]">{r.product}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3 h-3 ${idx < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{r.text}"</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/40 text-[10px] text-gray-400">
                    <span>{r.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        r.sentiment === 'positive'
                          ? 'bg-emerald-100 text-emerald-700'
                          : r.sentiment === 'neutral'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.sentiment}
                    </span>
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
