Link.prototype.bindEventLinkContext = function bindEventLinkContext(eventLinkContext) {
  var el = eventLinkContext.el,
    event = eventLinkContext.event,
    fn = eventLinkContext.fn,
    args = eventLinkContext.args, // when fn is null, args is expr to eval.
    that = this;

  var unshift = Array.prototype.unshift,
    quoteRegx = /[\'\"]/g;

  var func = function (ev) {
    if (fn === null) {
      // expr 
      $eval(args, that.model);
    } else if (that.model[fn]) {
      if (!isArray(args)) {
        that.model[fn].apply(that.model, [ev, el]);
      }
      else {
        var eargs = [ev, el];
        var evaledArgs = [];
        each(args, function (arg) {
          arg = trim(arg);
          if (arg.charAt(0) === "'" || arg.charAt(0) === '"') {
            evaledArgs.push(arg.replace(quoteRegx, ''));
          } else if (isPrimitive(arg)) {
            evaledArgs.push($eval(arg, that.model));
          }
          else {
            evaledArgs.push(arg);
          }
        });
        unshift.apply(eargs, evaledArgs);
        that.model[fn].apply(that.model, eargs);
      }

    }
  };

  addEventListenerHanlder(el, event, func);
  eventLinkContext.func = func; // update func ref
};



