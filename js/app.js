
(function(w){
  "use strict";

  var $ = w.jQuery;


// Util
var kujiUtil = {
  interval: null,
  TANKA : 300,
  INTERVAL: 2,
  zeroPad: function (num, keta){
    var zero = '';
    for(var i = 0; i<keta; i++){
      zero += '0';
    }
    return ( zero + num).substr(-keta);
  },
  start: function () {
    kujiUtil.interval = setInterval(kujiUtil.getKuji, kujiUtil.INTERVAL);
  },
  stop: function () {
    clearInterval( kujiUtil.interval);
  },
  getKuji: function () {
    var k = new Kuji();
    dispResult( judge(k) );
  },
  atariArr : []
};


var dispResult = function ( atariKuji ){
  if( atariKuji.name ){
    // console.time('t')
    vm.totalGetMoney += atariKuji.kingaku;
    vm.dispItems.forEach(function(item){
      if (item.category === atariKuji.category){
        item.atariCount++;
      }
    });

    //console.timeEnd('t')
  }
  vm.totalKujiCount++;
  vm.totalSpendMoney += kujiUtil.TANKA;
  vm.sagaku = vm.totalGetMoney - vm.totalSpendMoney;
}



/*
 くじクラス
 */
var Kuji = function () {
  var self = this;

  // 組は2けたのゼロ埋め数字
  self.kumi = kujiUtil.zeroPad( Math.floor( Math.random() * 100 ), 2);

  // 番号は6けたのゼロ埋め数字
  self.bangou = kujiUtil.zeroPad( Math.floor( Math.random() * 100000 ), 6 );

  self.name = function () {
    return self.kumi + '組' + self.bangou + '番';
  }
}

/*
 あたり判定テストケース
 */
var atariKuji = function () {
  var self = this;
  self.kumi = '87';
  self.bangou = '178686';

  self.name = function(){
    return self.kumi + '組' + self.bangou + '番';
  }
}


/*
  くじ結果データ管理のviewModel
 */
var vm = new Vue({
  el: '#app',
  data: {
    totalSpendMoney: 0,
    totalGetMoney: 0,
    totalKujiCount: 0,
    sagaku: 0,
    dispItems: []
  },
  computed: {
    isMinus: function () {
      return this.sagaku < 0 ;
    }
  }
});
Vue.filter('kanma', function (value) {
  return value.toLocaleString();
})

/*
スタートストップボタン管理のviewModel
*/
var actionVm = new Vue({
  el: '#actionBar',
  data: {
    isStop: true,
    isStart: false
  },
  methods: {
    start: function (e) {
      this.isStop = false;
      this.isStart = true;
      kujiUtil.start();
    },
    stop: function (e) {
      this.isStop = true;
      this.isStart = false;
      kujiUtil.stop();
    }
  }
});


/*
* 判定
* @param Kuji
* @return object
* TODO: 高速化
*/
var judge = function (kuji) {
  var isSameKumi = false;
  var isSameBan = false;
  var arr = kujiUtil.atariArr;
  var l = arr.length;
  for(var i=l-1;i>0;i--){
    //各当選回ごとにジャッジをリセット
    var isSameKumi_ = false;
    var isSameBan_ = false;
    if(arr[i].atari.kumi === '##'){
      isSameKumi_ = true;
    }
    if(arr[i].atari.kumi === kuji.kumi){
      isSameKumi_ = true;
    }
    if(!isSameKumi_) continue;

    if(arr[i].atari.bangou === kuji.bangou){
      isSameBan_ = true;
    }
    // 5等、6等の判定
    if(arr[i].atari.bangou.indexOf('#') !== -1){

      // 下1けた、下2けたの判定のため文字列を反転させて前方一致する考え方
      var ban = ' ' + arr[i].atari.bangou.replace(/#/gi, '').split('').reverse().join('');
      var kujiban = ' ' + kuji.bangou.split('').reverse().join('');
      if( kujiban.indexOf(ban) !== -1){
        isSameBan_ = true;
      }
    }
    if( isSameBan_ && isSameKumi_){
      isSameKumi = isSameKumi_;
      isSameBan = isSameBan_;
      //あたり
      return arr[i];
    }
  }

  return {};
}







$(document).ready(function (){
  $.getJSON('js/setting.json', function (data){
    kujiUtil.atariArr = data;

    var l = kujiUtil.atariArr.length;
    var category = '';
    var items = [];
    for(var i=0; i< l; i++){
      if(kujiUtil.atariArr[i].category === category) continue;
      category = kujiUtil.atariArr[i].category;
      var atariVmData = {
        name: kujiUtil.atariArr[i].name,
        kingaku: kujiUtil.atariArr[i].kingaku,
        category: kujiUtil.atariArr[i].category,
        atariCount: 0
      };
      vm.dispItems.push( atariVmData );
    }
  })
});




})(window);