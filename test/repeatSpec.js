describe("repeat test suite", function () {
  var el = document.createElement('div');
  describe('x-repeat', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("x-repeat 1", function () {
      var tpl = '<div x-repeat="item in a">{{item}}</div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: [1, 2, 3] } });
      expect(el.textContent).toBe('123');
    });

    it("x-repeat 2", function () {
      var tpl = '<div x-repeat="item in a">{{item.name}}</div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: [{ name: 'wgc', age: 18 }, { name: 'leon', age: 30 }] } });
      expect(el.textContent).toBe('wgcleon');
    });
  });

});