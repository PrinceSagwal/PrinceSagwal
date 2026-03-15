const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../app");

function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `http://localhost:${server.address().port}`);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: { "Content-Type": "application/json" },
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe("API routes", () => {
  let server;

  it("should start the server", (_t, done) => {
    server = app.listen(0, done);
  });

  it("GET /api/projects returns a list of projects", async () => {
    const res = await request(server, "GET", "/api/projects");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0);
    assert.ok(res.body[0].title);
    assert.ok(res.body[0].tech);
  });

  it("GET /api/projects/:id returns a single project", async () => {
    const res = await request(server, "GET", "/api/projects/1");
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 1);
    assert.ok(res.body.title);
  });

  it("GET /api/projects/:id returns 404 for unknown id", async () => {
    const res = await request(server, "GET", "/api/projects/999");
    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });

  it("POST /api/contact creates a message", async () => {
    const payload = {
      name: "Test User",
      email: "test@example.com",
      message: "Hello!",
    };
    const res = await request(server, "POST", "/api/contact", payload);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.entry.id, "number");
    assert.ok(res.body.entry.id > 0);
  });

  it("POST /api/contact rejects missing fields", async () => {
    const res = await request(server, "POST", "/api/contact", { name: "A" });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  it("POST /api/contact rejects invalid email", async () => {
    const payload = { name: "A", email: "not-an-email", message: "Hi" };
    const res = await request(server, "POST", "/api/contact", payload);
    assert.equal(res.status, 400);
    assert.match(res.body.error, /email/i);
  });

  it("GET /api/contact returns submitted messages", async () => {
    const res = await request(server, "GET", "/api/contact");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0);
  });

  it("GET / returns HTML", async () => {
    const url = new URL("/", `http://localhost:${server.address().port}`);
    const res = await new Promise((resolve, reject) => {
      http.get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      }).on("error", reject);
    });
    assert.equal(res.status, 200);
    assert.ok(res.body.includes("<!DOCTYPE html>"));
  });

  it("should close the server", (_t, done) => {
    server.close(done);
  });
});
