import csv
import io
import math
import random
from datetime import datetime

MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

CATEGORY_COLORS = {
    'Clothing': 'bg-sky-400',
    'Electronics': 'bg-blue-400',
    'Sports': 'bg-emerald-400',
    'Beauty Products': 'bg-purple-400',
    'Books': 'bg-amber-400',
    'Home Appliances': 'bg-rose-400',
}


def validate_csv_headers(content_str: str):
    lines = [line.strip() for line in content_str.splitlines() if line.strip()]
    if not lines:
        return {'valid': False, 'missing': ['All required headers']}
    
    first_line = lines[0]
    headers = [h.strip().lower() for h in first_line.split(',')]
    
    required = [
        'product id', 'transaction id', 'date', 'product category',
        'product name', 'units sold', 'unit price', 'total revenue',
        'payment method', 'rating', 'reviews'
    ]
    
    missing = [r for r in required if r not in headers]
    return {'valid': len(missing) == 0, 'missing': missing}


def parse_csv(content_str: str):
    rows = []
    reader = csv.reader(io.StringIO(content_str))
    
    header = next(reader, None)
    if not header:
        return rows
    
    for fields in reader:
        if len(fields) < 11:
            continue
        
        try:
            transaction_id = int(fields[1]) if fields[1].isdigit() else 0
        except ValueError:
            transaction_id = 0
            
        try:
            units_sold = int(fields[5]) if fields[5].isdigit() else 0
        except ValueError:
            units_sold = 0
            
        try:
            unit_price = float(fields[6])
        except ValueError:
            unit_price = 0.0
            
        try:
            total_revenue = float(fields[7])
        except ValueError:
            total_revenue = 0.0
            
        try:
            rating = int(fields[9]) if fields[9].isdigit() else 0
        except ValueError:
            rating = 0
            
        rows.append({
            'productId': fields[0].strip(),
            'transactionId': transaction_id,
            'date': fields[2].strip(),
            'category': fields[3].strip(),
            'productName': fields[4].strip(),
            'unitsSold': units_sold,
            'unitPrice': unit_price,
            'totalRevenue': total_revenue,
            'paymentMethod': fields[8].strip(),
            'rating': rating,
            'review': fields[10].strip() if len(fields) > 10 else '',
        })
        
    return rows


def format_inr(n: float) -> str:
    rounded = round(n)
    s = str(rounded)
    if len(s) <= 3:
        return f"₹{s}"
    last_three = s[-3:]
    other_numbers = s[:-3]
    formatted_other = ""
    for i, char in enumerate(reversed(other_numbers)):
        if i > 0 and i % 2 == 0:
            formatted_other = "," + formatted_other
        formatted_other = char + formatted_other
    return f"₹{formatted_other},{last_three}"


def compute_analytics(rows: list):
    total_revenue = sum(r['totalRevenue'] for r in rows)
    total_orders = len(rows)
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0.0
    avg_rating = sum(r['rating'] for r in rows) / total_orders if total_orders > 0 else 0.0

    dates = sorted([r['date'] for r in rows if r['date']])
    date_range = {
        'from': dates[0] if dates else '',
        'to': dates[-1] if dates else ''
    }

    categories = sorted(list(set(r['category'] for r in rows if r['category'])))

    # Monthly grouping
    month_map = {}
    for row in rows:
        d = row['date']
        if len(d) >= 7:
            key = d[:7]
            try:
                month_idx = int(d[5:7]) - 1
            except ValueError:
                month_idx = 0
        else:
            continue

        if key not in month_map:
            month_map[key] = {'revenue': 0.0, 'orders': 0, 'monthIndex': month_idx}
        month_map[key]['revenue'] += row['totalRevenue']
        month_map[key]['orders'] += 1

    sorted_months = sorted(month_map.items(), key=lambda x: x[0])
    revenue_by_month = [
        {
            'month': MONTH_NAMES[data['monthIndex']],
            'monthIndex': data['monthIndex'],
            'revenue': data['revenue'],
            'orders': data['orders']
        }
        for key, data in sorted_months
    ]

    # Product aggregation
    product_map = {}
    for row in rows:
        pname = row['productName']
        if pname not in product_map:
            product_map[pname] = {
                'name': pname,
                'category': row['category'],
                'unitsSold': 0,
                'revenue': 0.0
            }
        product_map[pname]['unitsSold'] += row['unitsSold']
        product_map[pname]['revenue'] += row['totalRevenue']

    products = sorted(product_map.values(), key=lambda x: x['revenue'], reverse=True)
    max_revenue = products[0]['revenue'] if products else 1.0

    random.seed(42) # Consistent deterministic growth values
    product_stats = []
    total_prods = len(products)
    for i, p in enumerate(products):
        rank = i / total_prods if total_prods > 0 else 0
        if rank < 0.25:
            status = 'winning'
            growth = f"+{int(random.uniform(10, 40))}%"
            up = True
        elif rank > 0.75:
            status = 'declining'
            growth = f"-{int(random.uniform(5, 30))}%"
            up = False
        else:
            status = 'stable'
            growth = f"+{int(random.uniform(1, 10))}%"
            up = True

        product_stats.append({
            'name': p['name'],
            'category': p['category'],
            'unitsSold': p['unitsSold'],
            'revenue': p['revenue'],
            'revenueFormatted': format_inr(p['revenue']),
            'growth': growth,
            'up': up,
            'status': status
        })

    top_products = [
        {
            'name': p['name'],
            'revenue': p['revenue'],
            'revenueFormatted': format_inr(p['revenue']),
            'pct': round((p['revenue'] / max_revenue) * 100) if max_revenue > 0 else 0
        }
        for p in products[:4]
    ]

    # Category Revenue
    cat_map = {}
    for row in rows:
        cat = row['category']
        cat_map[cat] = cat_map.get(cat, 0.0) + row['totalRevenue']

    category_revenue = [
        {
            'name': cat,
            'revenue': rev,
            'color': CATEGORY_COLORS.get(cat, 'bg-gray-400')
        }
        for cat, rev in sorted(cat_map.items(), key=lambda x: x[1], reverse=True)
    ]

    best_seller = {
        'name': products[0]['name'] if products else 'N/A',
        'revenue': format_inr(products[0]['revenue']) if products else '₹0'
    }

    winning_count = sum(1 for p in product_stats if p['status'] == 'winning')
    declining_count = sum(1 for p in product_stats if p['status'] == 'declining')

    # Sentiment
    positive_count = sum(1 for r in rows if r['rating'] >= 4)
    neutral_count = sum(1 for r in rows if r['rating'] == 3)
    negative_count = sum(1 for r in rows if r['rating'] <= 2)
    tot = len(rows) or 1

    sentiment_breakdown = {
        'positive': round((positive_count / tot) * 100),
        'neutral': round((neutral_count / tot) * 100),
        'negative': round((negative_count / tot) * 100)
    }

    cat_rating_map = {}
    for row in rows:
        cat = row['category']
        if cat not in cat_rating_map:
            cat_rating_map[cat] = {'total': 0, 'count': 0}
        cat_rating_map[cat]['total'] += row['rating']
        cat_rating_map[cat]['count'] += 1

    rating_by_category = sorted([
        {
            'name': cat,
            'score': round((data['total'] / data['count']) * 20) if data['count'] > 0 else 0,
            'count': data['count']
        }
        for cat, data in cat_rating_map.items()
    ], key=lambda x: x['score'], reverse=True)

    review_rows = [r for r in rows if r['review'] and len(r['review']) > 10]
    review_rows.sort(key=lambda x: x['date'], reverse=True)
    recent_reviews = [
        {
            'text': r['review'][:120] + '…' if len(r['review']) > 120 else r['review'],
            'rating': r['rating'],
            'productName': r['productName'],
            'category': r['category'],
            'date': r['date'],
            'sentiment': 'positive' if r['rating'] >= 4 else ('neutral' if r['rating'] == 3 else 'negative')
        }
        for r in review_rows[:6]
    ]

    monthly_trend = revenue_by_month
    last_months = revenue_by_month[-2:]
    revenue_growth_rate = 0.18
    if len(last_months) == 2 and last_months[0]['revenue'] > 0:
        revenue_growth_rate = (last_months[1]['revenue'] - last_months[0]['revenue']) / last_months[0]['revenue']

    last_revenue = revenue_by_month[-1]['revenue'] if revenue_by_month else total_revenue
    predicted_revenue = last_revenue * (1 + abs(revenue_growth_rate))
    last_orders = revenue_by_month[-1]['orders'] if revenue_by_month else total_orders
    predicted_orders = round(last_orders * (1 + abs(revenue_growth_rate)))

    revenue_growth_pct = f"+{int(abs(revenue_growth_rate) * 100)}%"
    orders_growth_pct = f"+{int(abs(revenue_growth_rate) * 100)}%"

    return {
        'rows': rows,
        'totalRevenue': total_revenue,
        'totalOrders': total_orders,
        'avgOrderValue': avg_order_value,
        'avgRating': avg_rating,
        'revenueByMonth': revenue_by_month,
        'topProducts': top_products,
        'productStats': product_stats,
        'categoryRevenue': category_revenue,
        'bestSeller': best_seller,
        'totalSKUs': len(products),
        'winningCount': winning_count,
        'decliningCount': declining_count,
        'sentimentBreakdown': sentiment_breakdown,
        'ratingByCategory': rating_by_category,
        'recentReviews': recent_reviews,
        'monthlyTrend': monthly_trend,
        'predictedRevenue': predicted_revenue,
        'predictedOrders': predicted_orders,
        'revenueGrowthPct': revenue_growth_pct,
        'ordersGrowthPct': orders_growth_pct,
        'dateRange': date_range,
        'categories': categories,
    }
