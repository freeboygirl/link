(function () {
  var model = {
    messages: [

    ],
    page: 1
  };

  var msgStore = [];

  for (var i = 0; i < 300; i++) {
    msgStore.push({
      title: 'title' + (i + 1),
      body: 'body' + (i + 1),
      time: (new Date()).toLocaleDateString(),
      focus: false
    });
  }
  var pageSize = 10,
    pageNumbers = [],
    pageCount = msgStore.length / pageSize;

  function loadMessage(vm) {
    vm.messages.set(msgStore.slice((vm.page - 1) * pageSize, vm.page * pageSize));
  }
  model.pageNumbers = [];
  model.pageCount = pageCount;


  function pageChangeHanlder(type, vm, pagesProp) {
    if (type === 'prev' && vm.page > 1) {
      --vm.page;
      loadMessage(vm);
    } else if (type === 'next' && vm.page < vm.pageCount) {
      ++vm.page;
      loadMessage(vm);
    }

    renderPageNumbers(vm);
  }

  function setActivePage(vm, pagesProp) {
    vm[pagesProp].each(function (item) {
      if (item.page === vm.page) {
        item.active = true;
      }
      else {
        item.active = false;
      }
    });
  }

  function getPageNumbers(page, pageCount, visiblePageCount) {
    visiblePageCount = visiblePageCount || 10;
    var low,
      high,
      v;

    pageNumbers = [];

    if (pageCount === 0) {
      return;
    }
    if (page > pageCount) {
      page = 1;
    }

    if (pageCount <= visiblePageCount) {
      low = 1;
      high = pageCount;
    } else {
      v = Math.ceil(visiblePageCount / 2);
      low = Math.max(page - v, 1);
      high = Math.min(low + visiblePageCount - 1, pageCount);

      if (pageCount - high < v) {
        low = high - visiblePageCount + 1;
      }
    }

    for (; low <= high; low++) {
      pageNumbers.push({
        page: low,
        active: false
      });
    }

    return pageNumbers;;
  }

  function renderPageNumbers(vm) {
    var pageNumbers = getPageNumbers(vm.page, vm.pageCount);
    vm.pageNumbers.set(pageNumbers);
    setActivePage(vm, 'pageNumbers');
  }


  var methods = {
    hilightMessage: function () {
      this.$item.focus = !this.$item.focus;
    },
    toggleArrow: function () {
      this.$item.up = !this.$item.up;
    },
    prev: function () {
      pageChangeHanlder('prev', this, 'pageNumbers');
    },
    next: function () {
      pageChangeHanlder('next', this, 'pageNumbers');
    },
    pageChange: function () {
      var vm = this;
      if (vm.page !== vm.$item.page) {
        vm.page = vm.$item.page;
        vm.$item.active = true;
        loadMessage(vm);

        renderPageNumbers(vm);
      }

    }
  };

  var el = document.getElementById('main');

  var timerId = 'pagination';
  console.time(timerId);

  var linker = new Link(el, model, methods);

  var vm = linker.model;

  loadMessage(vm);
  renderPageNumbers(vm)
  console.timeEnd(timerId);
})();