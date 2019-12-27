function ss_cols() {

  const COLS = makeAtoAZ();

  return {
    DATE: { name: 'A', no: COLS.A.no, colNo: COLS.A.colNo },
    START_TIME: { name: 'B', no: COLS.B.no, colNo: COLS.B.colNo },
    END_TIME: { name: 'C', no: COLS.C.no, colNo: COLS.C.colNo },
    TITLE: { name: 'D', no: COLS.D.no, colNo: COLS.D.colNo },
    CALENDAR_ID: { name: 'E', no: COLS.E.no, colNo: COLS.E.colNo },
  };
}

function makeAtoAZ() {
  // https://stackoverflow.com/questions/57847697/insert-emoji-unicode-from-google-sheets-to-an-email-using-script-editor からコピペ
  /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
  if (!String.fromCodePoint) {
    (function () {
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) { }
        return result;
      }());
      var stringFromCharCode = String.fromCharCode;
      var floor = Math.floor;
      var fromCodePoint = function () {
        var MAX_SIZE = 0x4000;
        var codeUnits = [];
        var highSurrogate;
        var lowSurrogate;
        var index = -1;
        var length = arguments.length;
        if (!length) {
          return '';
        }
        var result = '';
        while (++index < length) {
          var codePoint = Number(arguments[index]);
          if (
            !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 ||              // not a valid Unicode code point
            codePoint > 0x10FFFF ||       // not a valid Unicode code point
            floor(codePoint) != codePoint // not an integer
          ) {
            throw RangeError('Invalid code point: ' + codePoint);
          }
          if (codePoint <= 0xFFFF) { // BMP code point
            codeUnits.push(codePoint);
          } else { // Astral code point; split in surrogate halves
            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000;
            highSurrogate = (codePoint >> 10) + 0xD800;
            lowSurrogate = (codePoint % 0x400) + 0xDC00;
            codeUnits.push(highSurrogate, lowSurrogate);
          }
          if (index + 1 == length || codeUnits.length > MAX_SIZE) {
            result += stringFromCharCode.apply(null, codeUnits);
            codeUnits.length = 0;
          }
        }
        return result;
      };
      if (defineProperty) {
        defineProperty(String, 'fromCodePoint', {
          'value': fromCodePoint,
          'configurable': true,
          'writable': true
        });
      } else {
        String.fromCodePoint = fromCodePoint;
      }
    }());
  }
  const A = 'A';
  const Z = 'Z';
  const first = A.charCodeAt(0);
  const last = Z.charCodeAt(0);

  const AtoAZ = new Array();

  // A 〜 Z　まで
  for (var i = first; i <= last; i++) {
    var alpabet = String.fromCodePoint(i);
    AtoAZ.push(alpabet);
  }

  // AA 〜 AZ まで
  for (var i = first; i <= last; i++) {
    var alpabet = String.fromCodePoint(i);
    AtoAZ.push(A + alpabet);
  }

  const result = {};

  for (var i = 0; i < AtoAZ.length; i++) {
    result[AtoAZ[i]] = { no: i, colNo: i + 1, };
  }

  return result;
}
