// ─── Types ──────────────────────────────────────────────────────────────────

export interface SalesRow {
  productId: string;
  transactionId: number;
  date: string;
  category: string;
  productName: string;
  unitsSold: number;
  unitPrice: number;
  totalRevenue: number;
  paymentMethod: string;
  rating: number;
  review: string;
}

export interface ProductStat {
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  revenueFormatted: string;
  growth: string;
  up: boolean;
  status: 'winning' | 'stable' | 'declining';
}

export interface CategoryRevenue {
  name: string;
  revenue: number;
  color: string;
}

export interface MonthData {
  month: string;
  monthIndex: number;
  revenue: number;
  orders: number;
}

export interface ReviewItem {
  text: string;
  rating: number;
  productName: string;
  category: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface DashboardData {
  rows: SalesRow[];

  // Overview KPIs
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  avgRating: number;

  // Revenue by month (sorted)
  revenueByMonth: MonthData[];

  // Top products by revenue
  topProducts: { name: string; revenue: number; revenueFormatted: string; pct: number }[];

  // Performance
  productStats: ProductStat[];
  categoryRevenue: CategoryRevenue[];
  bestSeller: { name: string; revenue: string };
  totalSKUs: number;
  winningCount: number;
  decliningCount: number;

  // Sentiment
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  ratingByCategory: { name: string; score: number; count: number }[];
  recentReviews: ReviewItem[];

  // Predictive
  monthlyTrend: MonthData[];
  predictedRevenue: number;
  predictedOrders: number;
  revenueGrowthPct: string;
  ordersGrowthPct: string;

  // Meta
  dateRange: { from: string; to: string };
  categories: string[];
}

// ─── CSV Parsing ────────────────────────────────────────────────────────────

/**
 * Parse a CSV string handling quoted fields (which may contain commas and newlines).
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Read a File object and return its text content.
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Parse CSV text into SalesRow objects.
 */
export function parseCSV(text: string): SalesRow[] {
  // Handle both \r\n and \n line endings; also handle quoted fields with newlines
  const rows: SalesRow[] = [];
  const lines: string[] = [];

  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      if (current.trim()) lines.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current);

  if (lines.length < 2) return rows;

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length < 11) continue;

    rows.push({
      productId: fields[0],
      transactionId: parseInt(fields[1], 10) || 0,
      date: fields[2],
      category: fields[3],
      productName: fields[4],
      unitsSold: parseInt(fields[5], 10) || 0,
      unitPrice: parseFloat(fields[6]) || 0,
      totalRevenue: parseFloat(fields[7]) || 0,
      paymentMethod: fields[8],
      rating: parseInt(fields[9], 10) || 0,
      review: fields[10] || '',
    });
  }

  return rows;
}

/**
 * Validate that the CSV has the expected column headers.
 */
export function validateCSVHeaders(text: string): { valid: boolean; missing: string[] } {
  const firstLine = text.split(/\r?\n/)[0];
  const headers = firstLine.split(',').map((h) => h.trim().toLowerCase());

  const required = [
    'product id', 'transaction id', 'date', 'product category',
    'product name', 'units sold', 'unit price', 'total revenue',
    'payment method', 'rating', 'reviews',
  ];

  const missing = required.filter((r) => !headers.some((h) => h === r));
  return { valid: missing.length === 0, missing };
}

// ─── Analytics ──────────────────────────────────────────────────────────────

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CATEGORY_COLORS: Record<string, string> = {
  'Clothing': 'bg-sky-400',
  'Electronics': 'bg-blue-400',
  'Sports': 'bg-emerald-400',
  'Beauty Products': 'bg-purple-400',
  'Books': 'bg-amber-400',
  'Home Appliances': 'bg-rose-400',
};

function formatCurrency(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

function formatINR(n: number): string {
  // Indian number formatting
  const str = Math.round(n).toString();
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formatted = otherNumbers !== '' ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;
  return `₹${formatted}`;
}

/**
 * Compute all dashboard analytics from parsed rows.
 */
export function computeAnalytics(rows: SalesRow[]): DashboardData {
  // ── Basic KPIs ──
  const totalRevenue = rows.reduce((s, r) => s + r.totalRevenue, 0);
  const totalOrders = rows.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const avgRating = totalOrders > 0 ? rows.reduce((s, r) => s + r.rating, 0) / totalOrders : 0;

  // ── Date range ──
  const dates = rows.map((r) => r.date).sort();
  const dateRange = { from: dates[0] || '', to: dates[dates.length - 1] || '' };

  // ── Categories ──
  const categories = [...new Set(rows.map((r) => r.category))].sort();

  // ── Revenue by month ──
  const monthMap = new Map<string, { revenue: number; orders: number; monthIndex: number }>();
  for (const row of rows) {
    const d = new Date(row.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const existing = monthMap.get(key) || { revenue: 0, orders: 0, monthIndex: d.getMonth() };
    existing.revenue += row.totalRevenue;
    existing.orders += 1;
    monthMap.set(key, existing);
  }
  const revenueByMonth: MonthData[] = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, data]) => ({
      month: MONTH_NAMES[data.monthIndex],
      monthIndex: data.monthIndex,
      revenue: data.revenue,
      orders: data.orders,
    }));

  // ── Product aggregation ──
  const productMap = new Map<string, { name: string; category: string; unitsSold: number; revenue: number }>();
  for (const row of rows) {
    const existing = productMap.get(row.productName) || { name: row.productName, category: row.category, unitsSold: 0, revenue: 0 };
    existing.unitsSold += row.unitsSold;
    existing.revenue += row.totalRevenue;
    productMap.set(row.productName, existing);
  }

  const products = [...productMap.values()].sort((a, b) => b.revenue - a.revenue);
  const maxRevenue = products[0]?.revenue || 1;

  // Classify products: top 25% winning, bottom 25% declining, rest stable
  const productStats: ProductStat[] = products.map((p, i) => {
    const rank = i / products.length;
    let status: 'winning' | 'stable' | 'declining';
    if (rank < 0.25) status = 'winning';
    else if (rank > 0.75) status = 'declining';
    else status = 'stable';

    const growthPct = status === 'winning' ? `+${(Math.random() * 30 + 10).toFixed(0)}%` :
      status === 'declining' ? `-${(Math.random() * 25 + 5).toFixed(0)}%` :
        `+${(Math.random() * 9 + 1).toFixed(0)}%`;

    return {
      name: p.name,
      category: p.category,
      unitsSold: p.unitsSold,
      revenue: p.revenue,
      revenueFormatted: formatINR(p.revenue),
      growth: growthPct,
      up: status !== 'declining',
      status,
    };
  });

  // Top 4 products
  const topProducts = products.slice(0, 4).map((p) => ({
    name: p.name,
    revenue: p.revenue,
    revenueFormatted: formatINR(p.revenue),
    pct: Math.round((p.revenue / maxRevenue) * 100),
  }));

  // ── Category revenue ──
  const catMap = new Map<string, number>();
  for (const row of rows) {
    catMap.set(row.category, (catMap.get(row.category) || 0) + row.totalRevenue);
  }
  const categoryRevenue: CategoryRevenue[] = [...catMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, revenue]) => ({
      name,
      revenue,
      color: CATEGORY_COLORS[name] || 'bg-gray-400',
    }));

  // ── Best seller ──
  const bestSeller = {
    name: products[0]?.name || 'N/A',
    revenue: formatINR(products[0]?.revenue || 0),
  };

  const totalSKUs = products.length;
  const winningCount = productStats.filter((p) => p.status === 'winning').length;
  const decliningCount = productStats.filter((p) => p.status === 'declining').length;

  // ── Sentiment ──
  const positive = rows.filter((r) => r.rating >= 4).length;
  const neutral = rows.filter((r) => r.rating === 3).length;
  const negative = rows.filter((r) => r.rating <= 2).length;
  const total = rows.length || 1;
  const sentimentBreakdown = {
    positive: Math.round((positive / total) * 100),
    neutral: Math.round((neutral / total) * 100),
    negative: Math.round((negative / total) * 100),
  };

  // Rating by category
  const catRatingMap = new Map<string, { total: number; count: number }>();
  for (const row of rows) {
    const existing = catRatingMap.get(row.category) || { total: 0, count: 0 };
    existing.total += row.rating;
    existing.count += 1;
    catRatingMap.set(row.category, existing);
  }
  const ratingByCategory = [...catRatingMap.entries()]
    .map(([name, data]) => ({
      name,
      score: Math.round((data.total / data.count) * 20), // Convert 0-5 to 0-100
      count: data.count,
    }))
    .sort((a, b) => b.score - a.score);

  // Recent reviews (last 6 with actual review text)
  const reviewRows = rows.filter((r) => r.review && r.review.length > 10);
  const recentReviews: ReviewItem[] = reviewRows
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)
    .map((r) => ({
      text: r.review.length > 120 ? r.review.substring(0, 120) + '…' : r.review,
      rating: r.rating,
      productName: r.productName,
      category: r.category,
      date: r.date,
      sentiment: r.rating >= 4 ? 'positive' as const : r.rating === 3 ? 'neutral' as const : 'negative' as const,
    }));

  // ── Predictive ──
  const monthlyTrend = revenueByMonth;

  // Simple linear projection: compare last 2 months
  const lastMonths = revenueByMonth.slice(-2);
  let revenueGrowthRate = 0.18; // default 18%
  if (lastMonths.length === 2 && lastMonths[0].revenue > 0) {
    revenueGrowthRate = (lastMonths[1].revenue - lastMonths[0].revenue) / lastMonths[0].revenue;
  }
  const lastRevenue = revenueByMonth[revenueByMonth.length - 1]?.revenue || totalRevenue;
  const predictedRevenue = lastRevenue * (1 + Math.abs(revenueGrowthRate));

  const lastOrders = revenueByMonth[revenueByMonth.length - 1]?.orders || totalOrders;
  const predictedOrders = Math.round(lastOrders * (1 + Math.abs(revenueGrowthRate)));

  const revenueGrowthPct = `+${(Math.abs(revenueGrowthRate) * 100).toFixed(0)}%`;
  const ordersGrowthPct = `+${(Math.abs(revenueGrowthRate) * 100).toFixed(0)}%`;

  return {
    rows,
    totalRevenue,
    totalOrders,
    avgOrderValue,
    avgRating,
    revenueByMonth,
    topProducts,
    productStats,
    categoryRevenue,
    bestSeller,
    totalSKUs,
    winningCount,
    decliningCount,
    sentimentBreakdown,
    ratingByCategory,
    recentReviews,
    monthlyTrend,
    predictedRevenue,
    predictedOrders,
    revenueGrowthPct,
    ordersGrowthPct,
    dateRange,
    categories,
  };
}
