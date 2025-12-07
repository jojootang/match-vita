-- Function สำหรับคำนวณคะแนนสุขภาพ
CREATE OR REPLACE FUNCTION calculate_health_score(
  p_user_id UUID,
  p_category TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER;
BEGIN
  -- คำนวณจาก assessment ล่าสุด
  SELECT score INTO v_score
  FROM assessment_results ar
  JOIN assessments a ON ar.assessment_id = a.id
  WHERE a.user_id = p_user_id
    AND ar.category = p_category
  ORDER BY a.created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(v_score, 50); -- default 50 ถ้าไม่มีข้อมูล
END;
$$ LANGUAGE plpgsql;