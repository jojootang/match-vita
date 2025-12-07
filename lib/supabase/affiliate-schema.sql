-- ============================================
-- AFFILIATE SYSTEM SCHEMA
-- ============================================

-- ถ้าตารางมีอยู่แล้วให้ลบ (สำหรับ development)
-- DROP TABLE IF EXISTS affiliate_earnings CASCADE;
-- DROP TABLE IF EXISTS affiliate_conversions CASCADE;
-- DROP TABLE IF EXISTS affiliate_clicks CASCADE;
-- DROP TABLE IF EXISTS store_affiliate_links CASCADE;

-- ============================================
-- 1. affiliate_clicks - ติดตามการคลิกลิงก์
-- ============================================
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  store TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  original_url TEXT NOT NULL,
  click_count INTEGER DEFAULT 1,
  first_clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  revenue DECIMAL(10, 2) DEFAULT 0,
  commission_rate DECIMAL(5, 2) DEFAULT 0,
  status TEXT DEFAULT 'clicked' CHECK (status IN ('clicked', 'converted', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. affiliate_conversions - ติดตามการซื้อ
-- ============================================
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  click_id UUID REFERENCES affiliate_clicks(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id TEXT,
  order_amount DECIMAL(10, 2),
  commission_amount DECIMAL(10, 2),
  conversion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
  platform TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. affiliate_earnings - สรุปรายได้
-- ============================================
CREATE TABLE IF NOT EXISTS affiliate_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  period DATE NOT NULL, -- รูปแบบ YYYY-MM-DD
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  total_commission DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period)
);

-- ============================================
-- 4. store_affiliate_links - ข้อมูลร้านค้า
-- ============================================
CREATE TABLE IF NOT EXISTS store_affiliate_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store TEXT NOT NULL,
  product_category TEXT,
  base_url TEXT NOT NULL,
  affiliate_tag TEXT,
  commission_rate DECIMAL(5, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES สำหรับประสิทธิภาพ
-- ============================================
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user ON affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_date ON affiliate_clicks(first_clicked_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product ON affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_click ON affiliate_conversions(click_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_date ON affiliate_conversions(conversion_date);
CREATE INDEX IF NOT EXISTS idx_affiliate_earnings_period ON affiliate_earnings(period);
CREATE INDEX IF NOT EXISTS idx_store_links_store ON store_affiliate_links(store, is_active);

-- ============================================
-- TRIGGERS สำหรับอัปเดต updated_at อัตโนมัติ
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_affiliate_clicks_updated_at 
BEFORE UPDATE ON affiliate_clicks 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_conversions_updated_at 
BEFORE UPDATE ON affiliate_conversions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_earnings_updated_at 
BEFORE UPDATE ON affiliate_earnings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_affiliate_links_updated_at 
BEFORE UPDATE ON store_affiliate_links 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_affiliate_links ENABLE ROW LEVEL SECURITY;

-- Policies สำหรับ affiliate_clicks
CREATE POLICY "Users can view own clicks" ON affiliate_clicks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert clicks" ON affiliate_clicks
FOR INSERT WITH CHECK (true);

-- Policies สำหรับ affiliate_conversions
CREATE POLICY "Users can view own conversions" ON affiliate_conversions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert conversions" ON affiliate_conversions
FOR INSERT WITH CHECK (true);

-- Policies สำหรับ affiliate_earnings
CREATE POLICY "Users can view own earnings" ON affiliate_earnings
FOR SELECT USING (auth.uid() = user_id);

-- Policies สำหรับ store_affiliate_links (public read)
CREATE POLICY "Anyone can view store links" ON store_affiliate_links
FOR SELECT USING (true);

-- ============================================
-- SEED DATA - ข้อมูลเริ่มต้น
-- ============================================
INSERT INTO store_affiliate_links (store, base_url, affiliate_tag, commission_rate) VALUES
('Shopee', 'https://shp.ee/', '?aff_id=matchvita', 5.0),
('Lazada', 'https://s.lazada.co.th/', '?aff_id=matchvita', 4.5),
('iHerb', 'https://th.iherb.com/', '?rcode=MATCHVITA', 8.0),
('Amazon', 'https://www.amazon.com/', '?tag=matchvita-20', 6.0),
('Welove', 'https://www.weloveshopping.com/', '?ref=matchvita', 7.0),
('JD Central', 'https://www.jd.co.th/', '?aff=matchvita', 5.5)
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS สำหรับใช้งาน
-- ============================================
-- Function สำหรับคำนวณ commission
CREATE OR REPLACE FUNCTION calculate_commission(
  order_amount DECIMAL,
  platform TEXT
) RETURNS DECIMAL AS $$
DECLARE
  commission_rate DECIMAL;
BEGIN
  SELECT COALESCE(commission_rate, 0.05)
  INTO commission_rate
  FROM store_affiliate_links
  WHERE store = platform
  LIMIT 1;
  
  RETURN order_amount * commission_rate;
END;
$$ LANGUAGE plpgsql;

-- Function สำหรับสรุปสถิติรายเดือน
CREATE OR REPLACE FUNCTION get_monthly_affiliate_stats(
  user_uuid UUID,
  month_date DATE DEFAULT CURRENT_DATE
) RETURNS TABLE (
  total_clicks BIGINT,
  total_conversions BIGINT,
  total_revenue DECIMAL,
  total_commission DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(ac.click_count), 0)::BIGINT as total_clicks,
    COALESCE(COUNT(DISTINCT acv.id), 0)::BIGINT as total_conversions,
    COALESCE(SUM(acv.order_amount), 0) as total_revenue,
    COALESCE(SUM(acv.commission_amount), 0) as total_commission
  FROM affiliate_clicks ac
  LEFT JOIN affiliate_conversions acv ON ac.id = acv.click_id
  WHERE ac.user_id = user_uuid
    AND DATE_TRUNC('month', ac.first_clicked_at) = DATE_TRUNC('month', month_date);
END;
$$ LANGUAGE plpgsql;