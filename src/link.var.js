if (!el || !data) throw Error('el and data are required!');
if (!isObject(data)) throw Error('data must be object');
var model = data,
  linkContextCollection = [], // store linkContext
  eventLinkContextCollection = [], // store eventLinkContext
  watchMap = Object.create(null), // stores watch prop & watchfns mapping
  allWatches = [], // store all model watches , for expr
  repeaterDrName='x-repeat';