# Buổi 6 - Docker, Testing, CI

## Môi trường
- OS: Windows
- Docker version: <docker --version>
- Python / Node version: <python --version>, <node --version>

## Kết quả local
- pytest backend/tests -q: 2 passed
- npm test: 9 passed
- npm run build: <pass/fail>
- docker compose up --build: backend healthy, trang 8080 tải được dữ liệu qua /api

## Một luồng tích hợp đã kiểm tra
- Request: GET /api/courses, /api/sections, /api/students/22000004/enrollments qua 8080
- HTTP status: 200
- SQL xác nhận: chưa thử (chưa làm luồng đăng ký/hủy trong bản Docker)

## Debug / AI
- Lỗi 1: pytest báo ModuleNotFoundError: No module named 'backend'. Bằng chứng: traceback; `python -m pytest` chạy được. Cách sửa: thêm pytest.ini (pythonpath = .).
- Lỗi 2: CI backend đỏ, RuntimeError: Thieu bien moi truong (database.py cần DB_*, GitHub không có .env). Cách sửa: thêm env giả vào job backend.
- Lỗi 3: CI frontend đỏ, "Could not find tests/api.test.mjs", và job docker cần .env.docker.example. Nguyên nhân: tệp chưa git add. Cách sửa: add và push.
- Nếu dùng AI: <gợi ý nào đã dùng, xác minh thế nào>

## Pull Request / CI
- PR:
- Reviewer:
- CI run: pass (sau khi sửa 3 lỗi ở trên)