-- 1. Do TRUOC index (boi den, chay rieng, luu ket qua)
EXPLAIN (ANALYZE, BUFFERS)
SELECT event_type, COUNT(*) AS total
FROM enrollment_events
WHERE dataset = 'performance'
  AND class_section_id = 'WEB-01'
  AND occurred_at >= TIMESTAMP '2025-12-01 00:00:00'
GROUP BY event_type;

-- 2. Tao index
CREATE INDEX idx_enrollment_events_dataset_section_time
ON enrollment_events (dataset, class_section_id, occurred_at);

ANALYZE enrollment_events;

-- 3. Do SAU index (cung truy van, boi den, chay rieng)
EXPLAIN (ANALYZE, BUFFERS)
SELECT event_type, COUNT(*) AS total
FROM enrollment_events
WHERE dataset = 'performance'
  AND class_section_id = 'WEB-01'
  AND occurred_at >= TIMESTAMP '2025-12-01 00:00:00'
GROUP BY event_type;