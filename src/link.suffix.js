bootstrap();
!el.$$child && console.timeEnd(timeId);
return {
  setModel: setModel,
  unlink: unlink,
  getModel: getModel,
  $model: model // wrapped model
};

};
