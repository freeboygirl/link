// get watches in an expr.
var watchStartRegex = /[a-zA-Z$_]/,
  validWatchChar = /[a-zA-Z0-9$\.]/;
function Lexer(text) {
  this.text = text;
  this.index = 0;
  this.len = text.length;
  this.watches = [];
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
      else {
        this.index++;
      }
    }

    return this.watches;
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
  },

  _peek: function (i) {
    i = i || 1;
    return (this.index + i < this.len) ? this.text[this.index + 1] : false;
  }
};