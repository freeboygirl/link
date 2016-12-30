describe("helper test suite", function () {
  var helper = link.helper;
  var noop = function () { };

  describe('isObject', function () {
    it("null return false", function () {
      expect(helper.isObject(null)).toBe(false);
    });

    it("undefined return false", function () {
      expect(helper.isObject(undefined)).toBe(false);
    });

    it("{} return true", function () {
      expect(helper.isObject({})).toBe(true);
    });

    it("{name:'wgc'} return true", function () {
      expect(helper.isObject({ name: 'wgc' })).toBe(true);
    });

    it("function return false", function () {
      expect(helper.isObject(noop)).toBe(false);
    });
  });

  describe('isFunction', function () {
    it("null return false", function () {
      expect(helper.isFunction(null)).toBe(false);
    });

    it("undefined return false", function () {
      expect(helper.isFunction(undefined)).toBe(false);
    });

    it("{} return false", function () {
      expect(helper.isFunction({})).toBe(false);
    });

    it("function return true", function () {
      expect(helper.isFunction(noop)).toBe(true);
    });
  });

  describe('isArray', function () {
    it("null return false", function () {
      expect(helper.isArray(null)).toBe(false);
    });

    it("undefined return false", function () {
      expect(helper.isArray(undefined)).toBe(false);
    });

    it("{} return false", function () {
      expect(helper.isArray({})).toBe(false);
    });

    it("function return false", function () {
      expect(helper.isArray(noop)).toBe(false);
    });

    it("array return true", function () {
      expect(helper.isArray([1, 2])).toBe(true);
    });
  });


  describe('addClass', function () {
    it("addClass", function () {
      var el = document.createElement('div');
      helper.addClass(el, 'hi');
      expect(el.className.indexOf('hi') > -1).toBe(true);
    });
  });

  describe('removeClass', function () {
    it("removeClass", function () {
      var el = document.createElement('div');
      el.className = 'hi';
      helper.removeClass(el, 'hi');
      expect(el.className.indexOf('hi') > -1).toBe(false);
    });
  });

  describe('arrayRemove', function () {
    it("arrayRemove 1", function () {
      var arr = [1, 2, 2, 3, 1, 2];
      helper.arrayRemove(arr, 2);
      expect(arr.length === 3).toBe(true);
      helper.arrayRemove(arr, 1);
      expect(arr.length === 1).toBe(true);
    });

    it("arrayRemove 2", function () {
      var arr = [1, 1, 1];
      helper.arrayRemove(arr, 1);
      expect(arr.length === 0).toBe(true);
    });

    it("arrayRemove 3", function () {
      var arr = [1, 1, 1];
      helper.arrayRemove(arr, 0);
      expect(arr.length === 3).toBe(true);
    });
  });

  describe('formatString', function () {
    it("formatString 1", function () {
      var str = helper.formatString('{0} {1} {2} {0}', 0, 1, 2);
      expect(str === '0 1 2 0').toBe(true);
    });

    it("formatString 1", function () {
      var str = helper.formatString('{0} hey', 'wgc');
      expect(str === 'wgc hey').toBe(true);
    });
  });

  describe('trim', function () {
    it("trim 1", function () {
      expect(helper.trim('   ')).toBe('');
    });

    it("trim 2", function () {
      expect(helper.trim('  wgc  ')).toBe('wgc');
    });
  });

  describe('each', function () {
    it("each 1", function () {
      var a = [1, 2, 3], str = '';
      helper.each(a, function (e) { str += e; });
      expect(str === '123').toBe(true);
    });
  });
});