(function (link) {
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

  for (var i = 0; i < pageCount; i++) {
    pageNumbers.push({
      page: (i + 1),
      active: false
    });
  }

  model.pageNumbers = pageNumbers;
  model.pageCount = pageCount;


  function pageChangeHanlder(type, vm, pagesProp) {
    if (type === 'prev' && vm.page > 1) {
      --vm.page;
      loadMessage(vm);
    } else if (type === 'next' && vm.page < vm.pageCount) {
      ++vm.page;
      loadMessage(vm);
    }

    vm[pagesProp].each(function (item) {
      if (item.page === vm.page) {
        item.active = true;
      }
      else {
        item.active = false;
      }
    });
  }


  var methods = {
    makeAllRead: function () {
      console.log('all read done')
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

        vm.pageNumbers.each(function (item) {
          item.active = false;
        }, [vm.$item]);
      }

    }
  };

  var el = document.getElementById('main');

  var timerId='pagination';
  console.time(timerId);

  var linker = link(el, model, methods);

  loadMessage(linker.$model);
  console.timeEnd(timerId);
})(link);