// get watches in an expr.
var watchStartRegex = /[a-zA-Z$_]/,
  validWatchChar = /[a-zA-Z0-9$\.]/;
function Lexer(text) {
  this.text = text;
  this.index = 0;
  this.len = text.length;
  this.tokens = [];
}

Lexer.prototype = {
  constructor: Lexer,

  lex: function () {
    while (this.index < this.len) {
      var ch = this.text[this.index];
      if (watchStartRegex.test(ch)) {
        this.getWatch(ch);
      }
      else if (ch === '"' || ch === "'") {
        // string 
        while (this.peek() !== ch && this.index < this.len) {
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

    return this.tokens;
  },

  getWatch: function (ch) {
    var watch = [ch],
      start = this.index;
    while (this.index < this.len) {
      if (validWatchChar.test(this.peek())) {
        watch.push(this.text[++this.index]);
      } else {
        this.index++;
        break;
      }
    }
    this.tokens.push({
      index: start,
      watch: watch.join('')
    });
  },

  peek: function (i) {
    i = i || 1;
    return (this.index + i < this.len) ? this.text[this.index + 1] : false;
  }
};