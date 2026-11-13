import { useEffect, useState } from "react";
import { api } from "../api.js";
import Notice from "./Notice.jsx";

const PAGE_SIZE = 10;

export default function EventHistory({ studentId, refresh }) {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(0);
  }, [studentId]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          student_id: studentId,
          limit: String(PAGE_SIZE + 1),
          skip: String(page * PAGE_SIZE),
        });
        const data = await api(`/enrollment-events?${params}`, {
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setHasNext(data.length > PAGE_SIZE);
        setRows(data.slice(0, PAGE_SIZE));
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.message);
        setRows([]);
        setHasNext(false);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [studentId, page, refresh]);

  return (
    <section className="panel">
      <h2>4. Lịch sử đăng ký</h2>
      <Notice kind="error">{error}</Notice>
      {loading && <Notice>Đang tải lịch sử...</Notice>}
      {!loading && !error && rows.length === 0 && (
        <p className="muted">Chưa có sự kiện nào.</p>
      )}
      {!loading && !error && rows.length > 0 && (
        <div className="table-scroll">
          <table aria-label="Lịch sử đăng ký">
            <thead>
              <tr>
                <th>ID</th>
                <th>Lớp</th>
                <th>Sự kiện</th>
                <th>Thời điểm</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.class_section_id}</td>
                  <td>{row.event_type}</td>
                  <td>{new Date(row.occurred_at).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="pager">
        <button
          type="button"
          className="secondary"
          disabled={loading || page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Trang trước
        </button>
        <span className="muted">Trang {page + 1}</span>
        <button
          type="button"
          className="secondary"
          disabled={loading || !hasNext}
          onClick={() => setPage((p) => p + 1)}
        >
          Trang sau →
        </button>
      </div>
    </section>
  );
}