import test from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/api.js";

const realFetch = globalThis.fetch;
test.afterEach(() => {
  globalThis.fetch = realFetch;
});

function mockResponse(status, body) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response(body === null ? null : JSON.stringify(body), { status });
  };
  return calls;
}

test("GET 200 trả JSON và không gửi Content-Type", async () => {
  const calls = mockResponse(200, [{ class_id: "WEB-01" }]);
  const data = await api("/sections");
  assert.deepEqual(data, [{ class_id: "WEB-01" }]);
  assert.equal(calls[0].url, "http://127.0.0.1:8000/sections");
  assert.equal(calls[0].init.method, "GET");
  assert.deepEqual(calls[0].init.headers, {});
  assert.equal(calls[0].init.body, undefined);
});

test("POST gửi body JSON và Content-Type", async () => {
  const calls = mockResponse(201, { message: "Dang ky thanh cong" });
  const body = { student_id: "22000004", class_section_id: "WEB-01" };
  const data = await api("/enrollments", { method: "POST", body });
  assert.equal(data.message, "Dang ky thanh cong");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers["Content-Type"], "application/json");
  assert.equal(calls[0].init.body, JSON.stringify(body));
});

test("DELETE 204 trả null, không đọc JSON", async () => {
  mockResponse(204, null);
  const data = await api("/enrollments/22000004/WEB-01", { method: "DELETE" });
  assert.equal(data, null);
});

test("404 ném lỗi có status và detail", async () => {
  mockResponse(404, { detail: "Khong tim thay sinh vien" });
  await assert.rejects(
    () => api("/students/99999999/enrollments"),
    (err) => err.status === 404 && /Khong tim thay sinh vien/.test(err.message),
  );
});

test("409 ném lỗi có status 409", async () => {
  mockResponse(409, { detail: "Lop hoc phan da het cho" });
  await assert.rejects(
    () => api("/enrollments", { method: "POST", body: {} }),
    (err) => err.status === 409 && /HTTP 409/.test(err.message),
  );
});

test("422 dạng danh sách được ghép bằng dấu chấm phẩy", async () => {
  mockResponse(422, { detail: [{ msg: "loi A" }, { msg: "loi B" }] });
  await assert.rejects(
    () => api("/enrollments", { method: "POST", body: {} }),
    (err) => err.status === 422 && err.message.includes("loi A; loi B"),
  );
});

test("phản hồi không phải JSON báo lỗi rõ ràng", async () => {
  globalThis.fetch = async () => new Response("<html>oops</html>", { status: 500 });
  await assert.rejects(
    () => api("/sections"),
    (err) => /HTTP 500: phản hồi không phải JSON/.test(err.message),
  );
});

test("mất kết nối ném thông báo tiếng Việt", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  await assert.rejects(
    () => api("/sections"),
    (err) => /Không nhận được phản hồi API/.test(err.message),
  );
});

test("AbortError được ném lại nguyên vẹn", async () => {
  globalThis.fetch = async () => {
    const e = new Error("aborted");
    e.name = "AbortError";
    throw e;
  };
  await assert.rejects(
    () => api("/sections"),
    (err) => err.name === "AbortError",
  );
});