// app/admin/revenue/page.tsx
export default function RevenueDashboard() {
  const [revenueData, setRevenueData] = useState({
    affiliate: { clicks: 0, conversions: 0, revenue: 0 },
    subscriptions: { active: 0, mrr: 0, churn: 0 },
    users: { total: 0, premiumRate: 0, growth: 0 }
  });
  
  return (
    <div className="revenue-dashboard">
      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard 
          title="MRR (Monthly Recurring Revenue)"
          value={`฿${revenueData.subscriptions.mrr.toLocaleString()}`}
          change={12.5}
        />
        <MetricCard 
          title="Affiliate Revenue"
          value={`฿${revenueData.affiliate.revenue.toLocaleString()}`}
          change={8.2}
        />
        <MetricCard 
          title="Premium Conversion Rate"
          value={`${revenueData.users.premiumRate}%`}
          change={3.1}
        />
      </div>
      
      {/* Charts */}
      <div className="charts-grid">
        <RevenueChart data={revenueData} />
        <AffiliatePerformanceChart />
        <UserGrowthChart />
      </div>
      
      {/* Affiliate Links Management */}
      <AffiliateLinkManager />
      
      {/* Subscription Management */}
      <SubscriptionManager />
    </div>
  );
}