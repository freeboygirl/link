// get watches in an expr.
function Lexer(text) {
  this.text = text;
  this.index = 0;
  this.len = text.length;
  this.watches = [];
  this.filter = null;
  this.filterIndex = -1;
  this.filterEndIndex = -1;
  // this.tokens = []; // add position info
}

Lexer.prototype = {
  constructor: Lexer,

  getWatches: function () {
    while (this.index < this.len) {
      var ch = this.text[this.index];
      if (watchStartRegex.test(ch)) {
        this._getWatch(ch);
      }
      else if (ch === '"' || ch === "'") {
        // string 
        while (this._peek() !== ch && this.index < this.len) {
          this.index++;
        }
        if (this.index + 1 < this.len) {
          this.index += 2;
        } else {
          throw new Error('unclosed string in expr');
        }
      }
      else if (ch === '|') {
        if (this._peek() !== '|') {
          //filter sign
          // this.filter = trim(this.text.slice(this.index + 1));
          this.filterIndex = this.index++;
          this._getFilter();
          break; // following chars don't need going on.
        }
        else {
          // || 
          this.index += 2;
        }
      }
      else {
        this.index++;
      }
    }

    return this.watches;
  },
  _getFilter: function () {
    // last index is | 
    var filter = [this.text[this.index]];
    while (this.index < this.len) {
      if (validWatchChar.test(this._peek())) {
        filter.push(this.text[++this.index]);
      }
      else {
        this.index++;
        break;
      }
    }
    this.filterEndIndex = this.index;
    this.filter = trim(filter.join(''));
  },
  _getWatch: function (ch) {
    var watch = [ch],
      start = this.index;
    while (this.index < this.len) {
      if (validWatchChar.test(this._peek())) {
        watch.push(this.text[++this.index]);
      } else {
        this.index++;
        break;
      }
    }
    this.watches.push(watch.join(''));
    // this.tokens.push({ index: start, watch: watch.join('') });
  },

  _peek: function (i) {
    i = i || 1;
    return (this.index + i < this.len) ? this.text[this.index + 1] : false;
  }
};