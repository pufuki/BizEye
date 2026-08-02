import { MessageSquareHeart, ThumbsUp, ThumbsDown, Meh, Sparkles } from 'lucide-react';

const SENTIMENT_BREAKDOWN = [
  { label: 'Positive', value: 62, color: 'bg-emerald-400', icon: ThumbsUp },
  { label: 'Neutral', value: 26, color: 'bg-gray-300', icon: Meh },
  { label: 'Negative', value: 12, color: 'bg-red-400', icon: ThumbsDown },
];

const THEMES = [
  { theme: 'Product Quality', sentiment: 'positive', score: 78, mentions: 342 },
  { theme: 'Shipping Speed', sentiment: 'negative', score: 42, mentions: 218 },
  { theme: 'Customer Service', sentiment: 'positive', score: 85, mentions: 156 },
  { theme: 'Value for Money', sentiment: 'neutral', score: 60, mentions: 134 },
  { theme: 'Product Range', sentiment: 'positive', score: 72, mentions: 98 },
  { theme: 'Returns Process', sentiment: 'negative', score: 38, mentions: 76 },
];

const REVIEWS = [
  { text: 'The Summer Cotton Tee is incredibly soft and fits perfectly. Will buy again!', sentiment: 'positive', source: 'Verified Purchase', product: 'Summer Cotton Tee' },
  { text: 'Shipping took 2 weeks when it said 3 days. Product is fine but the wait was frustrating.', sentiment: 'negative', source: 'Verified Purchase', product: 'Organic Hoodie' },
  { text: 'Good quality for the price. Nothing amazing but does the job.', sentiment: 'neutral', source: 'Verified Purchase', product: 'Linen Shirt' },
  { text: 'Customer service helped me exchange sizes with no hassle. Very impressed!', sentiment: 'positive', source: 'Support Ticket', product: 'Denim Jacket' },
  { text: 'The return process was confusing and I had to email 3 times to get a refund.', sentiment: 'negative', source: 'Support Ticket', product: 'Phone Case V2' },
];

export default function Sentiment() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall sentiment */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-sky-400/10 rounded-full blur-[60px]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-xs text-sky-400 uppercase tracking-widest">AI Analysis</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Overall sentiment is <span className="text-emerald-400 font-medium">positive</span> but shipping complaints are rising. Address logistics to prevent a dip in satisfaction.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MessageSquareHeart className="w-3.5 h-3.5" />
              Analyzed 1,024 reviews & tickets
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200/60">
          <h3 className="font-semibold text-gray-900 mb-1">Sentiment Breakdown</h3>
          <p className="text-xs text-gray-500 mb-6">Last 30 days across all channels</p>
          <div className="grid grid-cols-3 gap-4">
            {SENTIMENT_BREAKDOWN.map((s) => (
              <div key={s.label} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={s.label === 'Positive' ? '#34d399' : s.label === 'Neutral' ? '#d1d5db' : '#f87171'}
                      strokeWidth="8"
                      strokeDasharray={`${s.value * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <s.icon className={`w-4 h-4 mb-1 ${s.label === 'Positive' ? 'text-emerald-500' : s.label === 'Neutral' ? 'text-gray-400' : 'text-red-400'}`} />
                    <span className="text-lg font-bold text-gray-900">{s.value}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment by theme */}
      <div className="bg-white rounded-xl p-6 border border-gray-200/60">
        <h3 className="font-semibold text-gray-900 mb-1">Sentiment by Theme</h3>
        <p className="text-xs text-gray-500 mb-6">AI-extracted topics from customer feedback</p>
        <div className="space-y-4">
          {THEMES.map((t) => (
            <div key={t.theme} className="flex items-center gap-4">
              <div className="w-40 shrink-0">
                <p className="text-sm text-gray-700">{t.theme}</p>
                <p className="text-xs text-gray-400">{t.mentions} mentions</p>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full ${
                      t.sentiment === 'positive' ? 'bg-emerald-400'
                      : t.sentiment === 'negative' ? 'bg-red-400' : 'bg-gray-300'
                    }`}
                    style={{ width: `${t.score}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <span className={`text-xs font-medium ${
                  t.sentiment === 'positive' ? 'text-emerald-600'
                  : t.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {t.score}/100
                </span>
              </div>
              <div className="w-24 text-right">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  t.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700'
                  : t.sentiment === 'negative' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {t.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reviews */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Recent Customer Feedback</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    r.sentiment === 'positive' ? 'bg-emerald-50'
                    : r.sentiment === 'negative' ? 'bg-red-50' : 'bg-gray-100'
                  }`}>
                    {r.sentiment === 'positive' ? <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    : r.sentiment === 'negative' ? <ThumbsDown className="w-4 h-4 text-red-500" />
                    : <Meh className="w-4 h-4 text-gray-500" />}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{r.source}</p>
                    <p className="text-xs text-gray-400">{r.product}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  r.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700'
                  : r.sentiment === 'negative' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {r.sentiment}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
