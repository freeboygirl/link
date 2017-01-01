describe("model test suite", function () {
  var el = document.createElement('div');
  function createEvent(type) {
    var event;
    if ('Event' in window) {
      event = new Event(type);
    }
    else {
      event = document.createEvent('Event');
      event.initEvent(type, true, true);
    }
    return event;
  }
  describe('x-model', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("input", function () {
      var tpl = '<input x-model="name">';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc' } });
      expect(el.firstChild.value).toBe('wgc');

      el.firstChild.value = 'leon';
      var keyup = createEvent('keyup');
      el.firstChild.dispatchEvent(keyup);
      expect(el.firstChild.value).toBe('leon');
    });

    it("radio", function () {
      var tpl = '<input type="radio"  name="sex" value="male" x-model="sex"><input type="radio"  name="sex" value="female" x-model="sex">';
      el.innerHTML = tpl;
      var model = { sex: 'male' };
      link({ el: el, model: model });
      expect(el.children[0].checked).toBe(true);
      expect(el.children[1].checked).toBe(false);

      var click = createEvent('click');
      el.children[1].dispatchEvent(click);
      expect(model.sex === 'female').toBe(true);
      expect(el.children[0].checked).toBe(false);
      expect(el.children[1].checked).toBe(true);
    });

  });

});