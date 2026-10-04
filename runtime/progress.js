/* Keeper Playbook — runtime/progress.js
   Progress is an append-only log of facts. This file owns the STORE INTERFACE
   { append(event), all(), clear() } and ships a localStorage implementation under
   `kp-progress-v1`. A server-backed store is a future implementation of the same
   interface; nothing above it changes.

   Every event is stamped { v:1, t:ISO, type, pack, packVersion, ...payload }. */
(function () {
  'use strict';
  window.KP = window.KP || {};

  var KEY = 'kp-progress-v1';
  var SCHEMA = 1;
  var RESERVED = { v: 1, t: 1, type: 1 };

  // localStorage-backed store. Keeps an in-memory copy so reads are cheap and the
  // app keeps working (for the session) if storage is unavailable or quota'd.
  function createLocalStore(key) {
    key = key || KEY;
    var cache = null;
    function read() {
      if (cache) return cache;
      try {
        var raw = window.localStorage.getItem(key);
        var parsed = raw ? JSON.parse(raw) : [];
        cache = Array.isArray(parsed) ? parsed : [];
      } catch (e) { cache = []; }
      return cache;
    }
    function write() {
      try { window.localStorage.setItem(key, JSON.stringify(cache)); } catch (e) { /* storage unavailable — stay in memory */ }
    }
    return {
      append: function (event) { read().push(event); write(); return event; },
      all: function () { return read().slice(); },
      clear: function () { cache = []; try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ } }
    };
  }

  // In-memory store (tests, private mode fallbacks).
  function createMemoryStore() {
    var events = [];
    return {
      append: function (event) { events.push(event); return event; },
      all: function () { return events.slice(); },
      clear: function () { events = []; }
    };
  }

  // Build a fully stamped event. `ctx` = { pack, packVersion } (either may be null for
  // site-level facts such as settings). Payload keys never override the stamp.
  function stamp(type, payload, ctx) {
    var ev = {
      v: SCHEMA,
      t: new Date().toISOString(),
      type: String(type),
      pack: ctx && ctx.pack ? String(ctx.pack) : null,
      packVersion: ctx && ctx.packVersion ? String(ctx.packVersion) : null
    };
    if (payload && typeof payload === 'object') {
      for (var k in payload) if (!RESERVED[k] && k !== 'pack' && k !== 'packVersion') ev[k] = payload[k];
    }
    return ev;
  }

  window.KP.progress = {
    KEY: KEY,
    SCHEMA: SCHEMA,
    createLocalStore: createLocalStore,
    createMemoryStore: createMemoryStore,
    stamp: stamp
  };
})();
