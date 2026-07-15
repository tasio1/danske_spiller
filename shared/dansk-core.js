/*
  DanskCore — shared library for the danske_spiller Danish grammar games.
  Exposes window.DanskCore. No frameworks, no build step, works via file://.

  This file is built up incrementally across build tasks. Each task appends
  an IIFE that extends the same window.DanskCore object — never redefine it.

  Module 1 (this block): store, tts, srs, diff.
*/
(function () {
  'use strict';

  var DanskCore = window.DanskCore || (window.DanskCore = {});

  // ---------------------------------------------------------------------
  // DanskCore.store — localStorage wrapper with error handling
  // ---------------------------------------------------------------------

  function storeGet(key) {
    try {
      var raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw);
      } catch (parseErr) {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  function storeSet(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Swallow QuotaExceededError and any other storage failure (private
      // browsing, disabled storage, etc). Progress loss is acceptable;
      // a thrown error breaking the game is not.
    }
  }

  function storeRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      // ignore
    }
  }

  DanskCore.store = {
    get: storeGet,
    set: storeSet,
    remove: storeRemove,
    namespace: function (prefix) {
      var p = prefix + ':';
      return {
        get: function (key) { return storeGet(p + key); },
        set: function (key, value) { storeSet(p + key, value); },
        remove: function (key) { storeRemove(p + key); }
      };
    }
  };

  // ---------------------------------------------------------------------
  // DanskCore.tts — Danish speech synthesis with silent fallback
  // ---------------------------------------------------------------------

  var lastSpokenText = null;
  var lastSpokenOptions = null;
  var cachedVoice = null;
  var voiceListPrimed = false;

  function ttsAvailable() {
    return typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';
  }

  function findVoice() {
    if (!ttsAvailable()) return null;
    if (cachedVoice) return cachedVoice;
    var voices = [];
    try {
      voices = window.speechSynthesis.getVoices() || [];
    } catch (err) {
      return null;
    }
    if (!voices.length) return null;
    var exact = null;
    var partial = null;
    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      var lang = (v.lang || '').toLowerCase();
      if (lang === 'da-dk' || lang === 'da_dk') {
        exact = v;
        break;
      }
      if (!partial && lang.indexOf('da') === 0) {
        partial = v;
      }
    }
    cachedVoice = exact || partial || null;
    return cachedVoice;
  }

  if (ttsAvailable()) {
    // Voice lists load asynchronously in most browsers; prime the cache
    // once they're ready so the first speak() call doesn't miss the
    // Danish voice.
    try {
      window.speechSynthesis.addEventListener('voiceschanged', function () {
        cachedVoice = null;
        findVoice();
        voiceListPrimed = true;
      });
    } catch (err) {
      // ignore — some environments (older Safari) lack addEventListener here
    }
  }

  function ttsSpeak(text, options) {
    options = options || {};
    return new Promise(function (resolve) {
      if (!ttsAvailable() || document.hidden || !text) {
        resolve();
        return;
      }
      try {
        window.speechSynthesis.cancel();
        var utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = 'da-DK';
        var voice = findVoice();
        if (voice) utterance.voice = voice;
        utterance.rate = typeof options.rate === 'number' ? options.rate : 1;
        utterance.pitch = typeof options.pitch === 'number' ? options.pitch : 1;
        var finished = false;
        function finish() {
          if (finished) return;
          finished = true;
          if (typeof options.onEnd === 'function') {
            try { options.onEnd(); } catch (cbErr) { /* ignore consumer errors */ }
          }
          resolve();
        }
        utterance.onend = finish;
        utterance.onerror = finish;
        lastSpokenText = text;
        lastSpokenOptions = options;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        resolve();
      }
    });
  }

  DanskCore.tts = {
    speak: ttsSpeak,
    replay: function () {
      if (!lastSpokenText) return Promise.resolve();
      return ttsSpeak(lastSpokenText, lastSpokenOptions || {});
    },
    isAvailable: ttsAvailable,
    findVoice: findVoice
  };

  // ---------------------------------------------------------------------
  // DanskCore.srs — Leitner 5-box spaced repetition
  // ---------------------------------------------------------------------

  var SRS_BOX_INTERVAL_MS = [
    0,                    // box 1 — due immediately
    1 * 24 * 60 * 60000,  // box 2 — 1 day
    3 * 24 * 60 * 60000,  // box 3 — 3 days
    7 * 24 * 60 * 60000,  // box 4 — 7 days
    14 * 24 * 60 * 60000  // box 5 — 14 days
  ];
  var SRS_MAX_BOX = 5;
  var SRS_MIN_BOX = 1;

  function srsStorageKey(namespace) {
    return 'srs:' + namespace;
  }

  function srsLoad(namespace) {
    var raw = storeGet(srsStorageKey(namespace));
    var state = (raw && typeof raw === 'object') ? raw : {};
    if (!state.items || typeof state.items !== 'object') state.items = {};
    if (!state.patterns || typeof state.patterns !== 'object') state.patterns = {};
    state.namespace = namespace;
    return state;
  }

  function srsPersist(state) {
    if (!state || !state.namespace) return;
    storeSet(srsStorageKey(state.namespace), {
      items: state.items,
      patterns: state.patterns
    });
  }

  function srsRecord(state, itemId, correct) {
    if (!state || !itemId) return state;
    var entry = state.items[itemId];
    if (!entry) {
      entry = { box: SRS_MIN_BOX, dueAt: 0, lastSeen: 0 };
      state.items[itemId] = entry;
    }
    entry.box = correct
      ? Math.min(SRS_MAX_BOX, entry.box + 1)
      : SRS_MIN_BOX;
    var now = Date.now();
    entry.lastSeen = now;
    entry.dueAt = now + SRS_BOX_INTERVAL_MS[entry.box - 1];
    srsPersist(state);
    return state;
  }

  function srsIsDue(state, itemId) {
    if (!state || !itemId) return true;
    var entry = state.items[itemId];
    if (!entry) return true;
    return Date.now() >= entry.dueAt;
  }

  function srsNextItems(state, pool, n) {
    if (!state || !Array.isArray(pool) || !n) return [];
    var due = [];
    for (var i = 0; i < pool.length && due.length < n; i++) {
      var item = pool[i];
      if (item && srsIsDue(state, item.id)) {
        due.push(item);
      }
    }
    return due;
  }

  function srsPattern(state, patternKey, correct) {
    if (!state || !patternKey) return state;
    var entry = state.patterns[patternKey];
    if (!entry) {
      entry = { correct: 0, incorrect: 0 };
      state.patterns[patternKey] = entry;
    }
    if (correct) entry.correct += 1;
    else entry.incorrect += 1;
    srsPersist(state);
    return state;
  }

  DanskCore.srs = {
    load: srsLoad,
    record: srsRecord,
    isDue: srsIsDue,
    nextItems: srsNextItems,
    pattern: srsPattern
  };

  // ---------------------------------------------------------------------
  // DanskCore.diff — answer normalization and token diffing
  // ---------------------------------------------------------------------

  function diffNormalize(str) {
    if (typeof str !== 'string') return '';
    return str
      .toLowerCase()
      .replace(/[‘’`´]/g, "'") // typographic apostrophes/backticks -> straight
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[.!?]+$/g, '')
      .trim();
  }

  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    var prev = new Array(n + 1);
    var curr = new Array(n + 1);
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      curr[0] = i;
      for (j = 1; j <= n; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        curr[j] = Math.min(
          prev[j] + 1,
          curr[j - 1] + 1,
          prev[j - 1] + cost
        );
      }
      var tmp = prev; prev = curr; curr = tmp;
    }
    return prev[n];
  }

  function diffCheck(answer, acceptedAnswers) {
    var list = Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers];
    var normalizedAnswer = diffNormalize(answer);
    var closest = list.length ? list[0] : '';
    var bestDistance = Infinity;
    var correct = false;
    for (var i = 0; i < list.length; i++) {
      var candidate = list[i];
      var normalizedCandidate = diffNormalize(candidate);
      if (normalizedCandidate === normalizedAnswer) {
        correct = true;
        closest = candidate;
        bestDistance = 0;
        break;
      }
      var distance = levenshtein(normalizedAnswer, normalizedCandidate);
      if (distance < bestDistance) {
        bestDistance = distance;
        closest = candidate;
      }
    }
    return { correct: correct, closest: closest };
  }

  function tokenize(str) {
    if (typeof str !== 'string' || !str.length) return [];
    return str.split(/\s+/).filter(function (t) { return t.length > 0; });
  }

  function tokenDiff(a, b) {
    var tokensA = tokenize(a);
    var tokensB = tokenize(b);
    var m = tokensA.length, n = tokensB.length;
    var lcs = [];
    for (var i = 0; i <= m; i++) {
      lcs.push(new Array(n + 1).fill(0));
    }
    for (i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        if (tokensA[i - 1] === tokensB[j - 1]) {
          lcs[i][j] = lcs[i - 1][j - 1] + 1;
        } else {
          lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
        }
      }
    }
    var result = [];
    i = m; var jj = n;
    while (i > 0 || jj > 0) {
      if (i > 0 && jj > 0 && tokensA[i - 1] === tokensB[jj - 1]) {
        result.unshift({ text: tokensA[i - 1], type: 'equal' });
        i--; jj--;
      } else if (jj > 0 && (i === 0 || lcs[i][jj - 1] >= lcs[i - 1][jj])) {
        result.unshift({ text: tokensB[jj - 1], type: 'add' });
        jj--;
      } else if (i > 0) {
        result.unshift({ text: tokensA[i - 1], type: 'del' });
        i--;
      }
    }
    return result;
  }

  DanskCore.diff = {
    normalize: diffNormalize,
    check: diffCheck,
    tokenDiff: tokenDiff
  };

})();
