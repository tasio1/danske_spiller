// shared/validate.js
// Dataset validation for all shared/data/*.js and per-game data.js files.
// Runs in Node (`node shared/validate.js`) or in a browser console after the
// dataset scripts have been loaded via <script> tags.
// Schema (see prd.md § 1.9): checks unique IDs, allowed levels, required
// fields, non-empty accepted_answers, correct-in-options, and duplicates
// after normalization. Returns { errors: [], warnings: [] }.
(function (root) {
  'use strict';

  var LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

  function normalize(str) {
    return String(str)
      .toLowerCase()
      .replace(/[.,!?;:"'()\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Validates a flat array of dataset items.
  // opts:
  //   idField            (default 'id')
  //   levelField          (default 'level')
  //   requiredFields      (default ['id', 'level', 'note'])
  //   optionsField        (e.g. 'options') — checked against correctField if present
  //   correctField        (e.g. 'correct')
  //   acceptedAnswersField (e.g. 'accepted_answers')
  //   dedupeField         (field, or array of fields, used to detect duplicate items after normalization)
  //   allowedModes        (array of valid mode names; flags unsupported modes)
  //   modeField           (default 'mode')
  function validateDataset(items, opts) {
    opts = opts || {};
    var idField = opts.idField || 'id';
    var levelField = opts.levelField || 'level';
    var requiredFields = opts.requiredFields || ['id', 'level', 'note'];
    var errors = [];
    var warnings = [];

    if (!Array.isArray(items)) {
      errors.push('Dataset is not an array.');
      return { errors: errors, warnings: warnings };
    }

    var seenIds = {};
    var seenDedupe = {};

    items.forEach(function (item, index) {
      var label = (item && item[idField]) || ('index ' + index);

      requiredFields.forEach(function (field) {
        var value = item ? item[field] : undefined;
        if (value === undefined || value === null || value === '') {
          errors.push(label + ': missing required field "' + field + '"');
        }
      });

      var id = item ? item[idField] : undefined;
      if (id !== undefined && id !== null && id !== '') {
        if (seenIds[id]) {
          errors.push('Duplicate id: "' + id + '"');
        }
        seenIds[id] = true;
      }

      var level = item ? item[levelField] : undefined;
      if (level !== undefined && LEVELS.indexOf(level) === -1) {
        errors.push(label + ': invalid level "' + level + '" (allowed: ' + LEVELS.join('/') + ')');
      }

      if (opts.allowedModes) {
        var modeField = opts.modeField || 'mode';
        var mode = item ? item[modeField] : undefined;
        if (mode !== undefined && opts.allowedModes.indexOf(mode) === -1) {
          errors.push(label + ': unsupported mode "' + mode + '"');
        }
      }

      if (opts.acceptedAnswersField) {
        var accepted = item ? item[opts.acceptedAnswersField] : undefined;
        if (accepted !== undefined) {
          if (!Array.isArray(accepted) || accepted.length === 0) {
            errors.push(label + ': "' + opts.acceptedAnswersField + '" must be a non-empty array');
          }
        }
      }

      if (opts.optionsField && opts.correctField) {
        var options = item ? item[opts.optionsField] : undefined;
        var correct = item ? item[opts.correctField] : undefined;
        if (Array.isArray(options)) {
          var normalizedOptions = options.map(normalize);
          var uniqueOptions = {};
          normalizedOptions.forEach(function (o) {
            if (uniqueOptions[o]) {
              warnings.push(label + ': duplicate option "' + o + '"');
            }
            uniqueOptions[o] = true;
          });
          if (correct !== undefined && normalizedOptions.indexOf(normalize(correct)) === -1) {
            errors.push(label + ': correct answer "' + correct + '" not present in options');
          }
        }
      }

      if (opts.dedupeField) {
        var fields = Array.isArray(opts.dedupeField) ? opts.dedupeField : [opts.dedupeField];
        var key = fields.map(function (f) { return normalize(item ? item[f] : ''); }).join('|');
        if (key.trim() !== '') {
          if (seenDedupe[key]) {
            warnings.push(label + ': possible duplicate of "' + seenDedupe[key] + '" after normalization');
          } else {
            seenDedupe[key] = id || label;
          }
        }
      }
    });

    return { errors: errors, warnings: warnings };
  }

  // Runs the standard set of checks against every known shared dataset.
  // Node-only: relies on require() to load each file into an isolated
  // sandbox window object, since the files assign to window.DANSK_*.
  function validateAllSharedData() {
    /* eslint-disable no-undef */
    var fs = require('fs');
    var path = require('path');
    var vm = require('vm');

    var dataDir = path.join(__dirname, 'data');
    var files = fs.readdirSync(dataDir).filter(function (f) { return f.slice(-3) === '.js'; });

    var results = {};
    files.forEach(function (file) {
      var sandbox = { window: {}, console: console };
      vm.createContext(sandbox);
      var code = fs.readFileSync(path.join(dataDir, file), 'utf8');
      vm.runInContext(code, sandbox, { filename: file });

      var exportedKeys = Object.keys(sandbox.window);
      exportedKeys.forEach(function (key) {
        var value = sandbox.window[key];
        var dataset = Array.isArray(value) ? value : flattenParadigmObject(value);
        if (!dataset) { return; }
        results[file + ' :: ' + key] = validateDataset(dataset, { requiredFields: ['id', 'level'] });
      });
    });

    return results;
  }

  // Pronoun paradigms are grouped by category rather than a flat array;
  // flatten them so validateDataset can check each entry uniformly.
  // Entries without an id (e.g. the "personal" subject/object pairs) are skipped.
  function flattenParadigmObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) { return null; }
    var flat = [];
    Object.keys(value).forEach(function (category) {
      var list = value[category];
      if (Array.isArray(list)) {
        list.forEach(function (entry) {
          if (entry && entry.id !== undefined) { flat.push(entry); }
        });
      }
    });
    return flat.length ? flat : null;
  }

  var api = {
    LEVELS: LEVELS,
    normalize: normalize,
    validateDataset: validateDataset,
    validateAllSharedData: validateAllSharedData
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.DanskValidate = api;
  }

  if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
    var results = validateAllSharedData();
    var totalErrors = 0;
    var totalWarnings = 0;
    Object.keys(results).forEach(function (key) {
      var r = results[key];
      totalErrors += r.errors.length;
      totalWarnings += r.warnings.length;
      console.log(key + ': ' + r.errors.length + ' errors, ' + r.warnings.length + ' warnings');
      r.errors.forEach(function (e) { console.log('  ERROR: ' + e); });
      r.warnings.forEach(function (w) { console.log('  WARN: ' + w); });
    });
    console.log('TOTAL: ' + totalErrors + ' errors, ' + totalWarnings + ' warnings');
    if (totalErrors > 0) { process.exitCode = 1; }
  }
})(typeof window !== 'undefined' ? window : null);
