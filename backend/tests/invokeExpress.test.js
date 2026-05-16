const { describe, it } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const { invokeExpress } = require('../lib/invokeExpress');

describe('invokeExpress', () => {
  it('resolves when Express sends a JSON response', async () => {
    const app = express();
    app.get('/api/test', (_req, res) => {
      res.json({ ok: true });
    });

    const req = { method: 'GET', url: '/api/test', headers: {} };
    const res = {
      statusCode: 200,
      headersSent: false,
      _headers: {},
      _listeners: { finish: [], close: [] },
      on(event, fn) {
        this._listeners[event].push(fn);
      },
      setHeader(k, v) {
        this._headers[k] = v;
        return this;
      },
      getHeader(k) {
        return this._headers[k];
      },
      removeHeader() {
        return this;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        this.headersSent = true;
        this._listeners.finish.forEach((fn) => fn());
      },
    };

    await invokeExpress(app, req, res);
    assert.strictEqual(res.body.ok, true);
  });
});
