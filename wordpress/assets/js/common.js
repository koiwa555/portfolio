'use strict';
var setCssCustomProp = function() {
  // スマホでの正確な vh を取得してカスタムプロパティにセットする
  var setViewHeightAsOneVh = function(WINDOW_HEIGHT) {
    var val = WINDOW_HEIGHT * 0.01;
    
    // 変数展開で単位を指定
    // document.documentElement.style.setProperty('--vh', `${WINDOW_HEIGHT}px`);
    document.documentElement.style.setProperty('--one_vh_as_px', val + 'px');
  };
  
  
  // スマホ時の slideNav で必要な値を取得セットする
  var setViewHeightAsPercent = function(WINDOW_HEIGHT) {
    // slideNav 用に親要素の幅 249px を 100% として、高さのパーセンテージを求める
    // 249:100 = 〇〇〇:X
    // X = 〇〇〇 * 100 / 249;
    var val = WINDOW_HEIGHT * 100 / 249;
    
    document.documentElement.style.setProperty('--vh_as_percent', val + '%');
  };
  
  
  var loadResizeCallSummary = function() {
    var WINDOW_HEIGHT;
    
    if (window.innerWidth > 767) return;
    
    WINDOW_HEIGHT = window.innerHeight;
    setViewHeightAsOneVh(WINDOW_HEIGHT);
    setViewHeightAsPercent(WINDOW_HEIGHT);
  };
  
  window.addEventListener('load', loadResizeCallSummary);
  window.addEventListener('resize', loadResizeCallSummary);
};
setCssCustomProp();


var displayCurrentNav = function(opt) {
  var WINDOW_WIDTH;
  
  var checkIsNum = function(val, useTpl, str) {
    var isNumber = /^([1-9]\d*|0)$/;
    
    if (typeof val === 'number' && isFinite(val) && isNumber.test(val)) return true;
    if (useTpl) throw new Error('[' + str + '] must be [Positive integer].');
    return false;
  };
  
  
  var checkIsCorrectStr = function(val, arr, useTpl, str) {
    var i,
        message;
    
    if (!Array.isArray(arr)) arr = [arr];
    for (i = 0; i < arr.length; i++) {
      if (typeof val === 'string' && val === arr[i]) return true;
    }
    if (useTpl) {
      i = 0;
      message = '[' + str + '] must specify [' + arr[i] + ']';
      for (i++; i < arr.length; i++) {
        message += ' or [' + arr[i] + ']';
      }
      message += '.';
      throw new Error(message);
    }
    return false;
  };
  
  
  var checkIsCorrectArrLength = function(arr, length, useTpl, str) {
    if (arr.length === length) return true;
    if (useTpl) throw new Error('[' + length + ']' + ' elements are required for [' + str + '].');
    return false;
  };
  
  
  var checkIsEmptyObject = function(obj, str) {
    if (!Object.keys(obj).length)
      throw new Error('[' + str + '] object is empty.');
  };
  
  
  var outputScrollY = function() {
    console.log('SCROLL_Y ' + window.pageYOffset || document.documentElement.scrollTop);
  };
  
  
  var outputCheckList = function(obj) {
    console.log(obj.elem.target);
    console.log(obj.elem.anchor);
    obj.coordinates.forEach(function(v, i) {
      console.log('target[' + i + '] ' + v);
    });
    outputScrollY();
  };
  
  
  var addClassCurrentNav = function(indexAnchor, i) {
    Object.keys(indexAnchor).forEach(function(j) {
      indexAnchor[j].classList.remove('is-current');
    });
    indexAnchor[i].classList.add('is-current');
  };
  
  
  // 座標のチェック
  // body に指定した top の値と比較する。
  var checkNavCoordinatesRangeByTop = function(coordinates) {
    // ページ位置がトップのときの対処
    // 左辺が [falsy] な場合に、右辺の 0 が代入される。
    var top = parseInt(document.body.style.top) * -1 || 0;
    
    for (var i = 0; i < coordinates.length; i++) {
      if (coordinates[i] > top) break;
    }
    if (i > 0) i--;
    return i;
  };
  
  
  // 座標のチェック
  var checkNavCoordinatesRangeByScroll = function(coordinates) {
    var SCROLL_Y = window.pageYOffset || document.documentElement.scrollTop;
    
    for (var i = 0; i < coordinates.length; i++) {
      // 座標がスクロール量 [より大きい] となった場合
      if (coordinates[i] > SCROLL_Y) break;
    }
    // インデックスが 0 ではない場合
    // インデックス 0 こと、最初の要素の場合は、デクリすると
    // 要素が存在しないので除外する。
    if (i > 0) i--;
    return i;
  };
  
  
  // 各要素の座標を取得する
  var getNavCoordinates = function(target) {
    var coordinates = [],
        targetOffset,
        bodyOffset = document.body.getBoundingClientRect().top;
    
    Object.keys(target).forEach(function(i) {
      targetOffset= target[i].getBoundingClientRect().top;
      
      // スムーススクロールは切り上げだけど、こちらは切り捨てで問題なし
      coordinates[i] = Math.floor(targetOffset - bodyOffset - opt.enabledAdjustHeight);
    });
    return coordinates;
  };
  
  
  var checkEnabledRange = function(arr) {
    var index = -1;
    
    arr.forEach(function(v, i) {
      if (!v.range) {
        index = i;
        return;
      }
      if (v.range[0] === 'max-width' && v.range[1] >= WINDOW_WIDTH) {
        index = i;
        return;
      } else if (v.range[0] === 'min-width' && v.range[1] <= WINDOW_WIDTH) {
        index = i;
        return;
      }
    });
    
    return index;
  };
  
  
  var getWindowWidth = function() {
    WINDOW_WIDTH = window.innerWidth;
  };
  
  
  var checkAdjust = function() {
    if (!Array.isArray(opt.adjust)) opt.adjust = [opt.adjust];
    
    opt.adjust.forEach(function(v, i) {
      var text = 'adjust[' + i + '].';
      
      // オブジェクトの空判定
      checkIsEmptyObject(v, 'adjust');
      
      // [range] がなければループを飛ばす
      if (!v.range) return;
      checkIsCorrectArrLength(v.range, 2, true, text + 'range');
      checkIsCorrectStr(v.range[0], ['max-width', 'min-width'], true, text + 'range[0]');
      checkIsNum(v.range[1], true, text + 'range[1]');
    });
  };
  
  
  var checkTargetAndAnchor = function(elem) {
    // querySelectorAll() は取得できなくてもエラーは出ないので
    // 取得された要素数で判断する。
    if (!elem.target.length) {
      throw new Error('Could not get the [target] element.');
    } else if (!elem.anchor.length) {
      throw new Error('Could not get the [anchor] element.');
    } else if (elem.target.length !== elem.anchor.length) { // 要素数が異なる場合
      throw new Error('[target] and [anchor] have different numbers of elements');
    }
  };
  
  
  var getTargetAndAnchor = function() {
    // カンマ繋ぎで記述することで、要素を一括で取得できる。
    // querySelectorAll('h2, h3, h4, h5, h6');
    var obj = {
      // 対象要素を一括で配列で取得する
      target: document.querySelectorAll(opt.target),
      // 現在値を示すためのアンカーを取得する
      anchor: document.querySelectorAll(opt.anchor)
    };
    
    return obj;
  };
  
  
  // リサイズイベントでの [self] と スクロールイベントでの [this] は
  // それぞれオブジェクトなので、ここで [obj] として受け取る。
  var loadResizeScrollCallSummary = function(obj) {
    var current;
    
    // PC ではスクロール量、タブ・スマホでは body に指定した top の座標を用いて処理を行う
    if (WINDOW_WIDTH > 767) {
      current = checkNavCoordinatesRangeByScroll(obj.common.coordinates);
    } else {
      current = checkNavCoordinatesRangeByTop(obj.common.coordinates);
    }
    addClassCurrentNav(obj.common.elem.anchor, current);
  };
  
  
  var scrollEvent = function() {
    loadResizeScrollCallSummary(this);
    
    // 確認用出力
    if (opt.output) outputScrollY();
  };
  
  
  var loadResizeCallSummary = function() {
    var enableRangeIndex;
    
    opt.enabledAdjustHeight = 0;
    if (opt.adjust) {
      getWindowWidth();
      enableRangeIndex = checkEnabledRange(opt.adjust);
      if (enableRangeIndex !== -1) opt.enabledAdjustHeight = opt.adjust[enableRangeIndex].height;
    }
  };
  
  
  var resizeEvent = function(self) {
    return function() {
      loadResizeCallSummary();
      self.common.coordinates = getNavCoordinates(self.common.elem.target);
      loadResizeScrollCallSummary(self);
      
      // 確認用出力
      if (opt.output) outputCheckList(self.common);
    };
  };
  
  
  var thinOutResizeEvent = function() {
    var self = this;
    
    clearTimeout(self.timeoutId);
    
    // 座標のズレ対策として、間引く時間を 500 から 800 にした
    // 500 のままだと高さが正しく取得できないもよう。
    self.timeoutId = setTimeout(resizeEvent(self), 800);
  };
  
  
  // リサイズイベント内の処理を間引く
  var setResizeEvent = function(obj) {
    var resizeHandle = {
      common: obj,
      timeoutId: null,
      handleEvent: thinOutResizeEvent,
    };
    
    window.addEventListener('resize', resizeHandle);
  };
  
  
  var loadEventCallSummary = function() {
    // ロード・リサイズ・スクロールで共用するオブジェクト
    var common = {
          elem: null,
          coordinates: null,
        },
        // リサイズイベント用のオブジェクト
        obj = {
          common: common,
        },
        // スクロールイベント用のハンドルイベントオブジェクト
        scrollHandle = {
          common: common,
          handleEvent: scrollEvent,
        };
    
    common.elem = getTargetAndAnchor();
    // エラーチェック
    checkTargetAndAnchor(common.elem);
    if (opt.adjust) checkAdjust();
    loadResizeCallSummary();
    
    common.coordinates = getNavCoordinates(common.elem.target);
    
    loadResizeScrollCallSummary(obj);
    
    // 確認用出力
    if (opt.output) outputCheckList(common);
    
    setResizeEvent(common);
    window.addEventListener('scroll', scrollHandle);
  };
  
  window.addEventListener('load', loadEventCallSummary);
};


var slideNav = function() {
  var WINDOW_WIDTH;
  
  var setInPageLinkClickEvent = function() {
    var inPageLink = document.querySelectorAll('#sideNavContent a');
    
    Object.keys(inPageLink).forEach(function(v) {
      inPageLink[v].addEventListener('click', slideNavToggleBtnEvent);
    });
  };
  
  
  // サイドナビを下端までスクロールさせて Latest が表示された状態にしておく
  var setSideNavListScroll = function() {
    var target = document.getElementById('slideNavContentInner');
    
    target.scrollTop = 1000;
  };
  
  
  var removeIsDisabledScroll = function(arr) {
    var topCoordinate;
    
    arr.forEach(function(v) {
      v.classList.remove('is-disabled_scroll');
    });
    
    // css でスタイリングした値を取得
    // 取得した値は文字列なので整数にパースする
    topCoordinate = parseInt(arr[1].style.top) * -1;
    arr[1].style.top = '';
    scrollTo(0, topCoordinate);
  };
  
  
  var addIsDisabledScroll = function(arr) {
    var SCROLL_Y = window.pageYOffset || document.documentElement.scrollTop;
    
    arr.forEach(function(v) {
      v.classList.add('is-disabled_scroll');
    });
    arr[1].style.top = - SCROLL_Y + 'px';
    return;
  };
  
  
  var slideNavToggleBtnEvent = function() {
    var target = document.getElementById('slideNav'),
        disableTarget = [
          document.documentElement,
          document.body,
        ];
    
    // 開く処理
    if(!target.classList.contains('is-showed')) {
      setSideNavListScroll();
      target.classList.add('is-showed');
      
      if (WINDOW_WIDTH <= 767) addIsDisabledScroll(disableTarget);
      return;
    }
    // 閉じる処理
    target.classList.remove('is-showed');
    if (WINDOW_WIDTH <= 767) removeIsDisabledScroll(disableTarget);
    
    // スライドナビが閉るのを待ってから、ナビの位置をトップに戻す。
    setTimeout(setSideNavListScroll, 300);
  };
  
  
  var clickSideNavToggleBtn = function(str) {
    var arr = [
      document.getElementById('slideNavToggleBtn'),
      document.getElementById('slideNavOverlay')
    ];
    
    if (str === 'add') {
      arr.forEach(function(v) {
        v.addEventListener('click',slideNavToggleBtnEvent);
      });
      return;
    }
    arr.forEach(function(v) {
      v.removeEventListener('click',slideNavToggleBtnEvent);
    });
  };
  
  
  var loadResizeCallSummary = function() {
    clickSideNavToggleBtn('add');
    setSideNavListScroll();
    setInPageLinkClickEvent();
  };
  
  
  var resizeCallSummary = function() {
    var PREV_WINDOW_WIDTH = WINDOW_WIDTH;
    
    WINDOW_WIDTH = window.innerWidth;
    // リサイズ時に PC 幅になったらイベントを解除しつつ返す
    if (WINDOW_WIDTH > 899) {
      clickSideNavToggleBtn('remove');
      return;
    }
    // スマホのアドレスバーとツールバー対策
    // 幅が変わらないリサイズの場合は処理をしない
    if (WINDOW_WIDTH <= 767 && PREV_WINDOW_WIDTH === WINDOW_WIDTH) return;
    loadResizeCallSummary();
  };
  
  
  var thinOutResizingEvent = function() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(resizeCallSummary, 500);
  };
  
  
  var setThinOutResizingEvent = function() {
    var handleObj = {
      timeoutId: null,
      handleEvent: thinOutResizingEvent
    };
    
    window.addEventListener('resize', handleObj);
  };
  
  
  var loadEvent = function() {
    WINDOW_WIDTH = window.innerWidth;
    if (WINDOW_WIDTH > 899) return;
    loadResizeCallSummary();
    setThinOutResizingEvent();
  }
  
  
  window.addEventListener('load', loadEvent);
};
