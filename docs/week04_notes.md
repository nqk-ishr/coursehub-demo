"Limit  (cost=2913.84..2913.97 rows=50 width=39) (actual time=4.336..4.340 rows=50.00 loops=1)"
"  Buffers: shared hit=1137"
"  ->  Sort  (cost=2913.84..2915.86 rows=808 width=39) (actual time=4.335..4.337 rows=50.00 loops=1)"
"        Sort Key: occurred_at DESC"
"        Sort Method: top-N heapsort  Memory: 31kB"
"        Buffers: shared hit=1137"
"        ->  Seq Scan on enrollment_events  (cost=0.00..2887.00 rows=808 width=39) (actual time=0.027..4.229 rows=820.00 loops=1)"
"              Filter: ((occurred_at >= '2025-12-20 00:00:00'::timestamp without time zone) AND ((dataset)::text = 'performance'::text) AND ((student_id)::text = '22000001'::text))"
"              Rows Removed by Filter: 99180"
"              Buffers: shared hit=1137"
"Planning:"
"  Buffers: shared hit=45 dirtied=1"
"Planning Time: 0.395 ms"
"Execution Time: 4.356 ms"

"Limit  (cost=0.42..68.08 rows=50 width=39) (actual time=0.055..0.091 rows=50.00 loops=1)"
"  Buffers: shared hit=50 read=3"
"  ->  Index Scan using idx_enrollment_events_dataset_student_time on enrollment_events  (cost=0.42..1081.71 rows=799 width=39) (actual time=0.054..0.087 rows=50.00 loops=1)"
"        Index Cond: (((dataset)::text = 'performance'::text) AND ((student_id)::text = '22000001'::text) AND (occurred_at >= '2025-12-20 00:00:00'::timestamp without time zone))"
"        Index Searches: 1"
"        Buffers: shared hit=50 read=3"
"Planning:"
"  Buffers: shared hit=39 read=1"
"Planning Time: 0.204 ms"
"Execution Time: 0.105 ms"

# CourseHub - Buoi 4
- Migration 001: enrollment_events.
- Demo class: RACE-01, capacity = 1.
- POST /enrollments: lock class_sections bang FOR UPDATE.
- Concurrency test: 1 request 201, 1 request 409.
- Performance data: 100000 rows, dataset=performance.
- Index: idx_enrollment_events_dataset_student_time.
- Ghi lai scan type va Execution Time truoc/sau o day.
Khong commit backend/.env.