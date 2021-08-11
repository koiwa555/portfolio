'use strict';
// --------------------------------------------------------------------------------


// フロート要素の操作
var floatContent = function(opt){
  var checkOptionIsNum = function(v) {
    // 0以上の整数判定用の変数
    var isNumber = /^([1-9]\d*|0)$/;
    // 型が数値 また 無限ではない また 正の整数
    if (typeof v === 'number' && isFinite(v) && isNumber.test(v)) return true;
  };
  
  
  
  var checkOptionIsAllowedStr = function(v, arr) {
    var length = arr.length;
    for (var i = 0; i < length; i++) {
      if (typeof v === 'string' && v === arr[i]) return true;
    }
  };
  
  
  
  // 各プロパティの値を元に分別する
  var checkOptions = function(v) {
    // idの指定がない場合
    if (!v.id) {
      console.log('Please specify ID name of the float element');
      v.error = true;
      return;
    }
    // idを取得
    if (document.getElementById(v.id)) v.target = document.getElementById(v.id);
    else {
      console.log('ID name [' + v.id + '] specified in [id] is not defined.');
      v.error = true;
      return;
    }
    
    // 表示を開始するスクロール量
    if (v.switchPosition) {
      //値が [正の整数] [型が数値] の場合は何もしない
      if (checkOptionIsNum(v.switchPosition)) {}
      // id指定の場合
      else if (document.getElementById(v.switchPosition)) {
        v.switchTarget = document.getElementById(v.switchPosition);
        v.switchPosition = null;
      }
      else {
        console.log('[switchPosition] must be [Positive integer] or [ID name of the target element].\nSpecified value is [' + v.switchPosition + '].');
        v.error = true;
        return;
      }
    }
    // 初期値がなければ常に表示で 0 を代入
    else v.switchPosition = 0;
    
    // 表示を開始するブラウザ幅
    if (v.displayWidth) {
      // 配列の 0 番目に値がない または 値はあるが max-width と min-width 以外の値の場合
      if (
        !v.displayWidth[0] ||
        (v.displayWidth[0] &&
        !checkOptionIsAllowedStr(v.displayWidth[0], ['max-width', 'min-width']))
      ) throw new Error('The first argument of [displayWidth] must be [\'max-width\'] or [\'min-width\'].');
      
      // 配列の 1 番目に値がない または 値はあるが 整数でない・型が数値でない場合
      if (
        !v.displayWidth[1] ||
        (v.displayWidth[1] &&
        !checkOptionIsNum(v.displayWidth[1]))
      ) throw new Error('The second argument of [displayWidth] must be [Positive integer].');
    }
    
    // フロート要素の高さを他の要素に付け足す
    if (v.addHeightTargetId && v.addHeightDirection) {
      // IDが取得できた場合
      if (document.getElementById(v.addHeightTargetId))
        v.addHeightTargetId = document.getElementById(v.addHeightTargetId);
      // 値があるけどIDが取得できない場合
      else {
        console.log('ID name [' + v.addHeightTargetId + '] specified in [addHeightTargetId] is not defined.');
        v.error = true;
        return;
      }
      
      // フロート要素の高さを対象要素に付け足すか否か
      // 値があるけど top・bottom でもない場合
      if (!checkOptionIsAllowedStr(v.addHeightDirection, ['top', 'bottom']))
        throw new Error('[addHeightDirection] must be [\'top\'] or [\'bottom\'].');
    }
    // 片方だけ値が無い場合
    else if (
      (v.addHeightTargetId && !v.addHeightDirection) ||
      (!v.addHeightTargetId && v.addHeightDirection)
    ) throw new Error('Specify [addHeightTargetId] and [addHeightDirection] as a set.');
    
    // 先行のフロート要素にツライチでフロートする要素
    if (v.stackTargetId) {
      // IDが取得できた場合
      if (document.getElementById(v.stackTargetId))
        v.stackTargetId = document.getElementById(v.stackTargetId);
      // 値があるけどIDが取得できない場合
      else {
        console.log('ID name [' + v.stackTargetId + '] specified in [stackTargetId] is not defined.');
        v.error = true;
        return;
      }
    }
  };
  
  
  
  var toggleDisableTransition = function(target, str) {
    if (str === 'add') {
      target.style.transition = 'none';
      target.style.animation = 'none';
      return;
    }
    target.style.transition = '';
    target.style.animation = '';
  };
  
  
  
  // 指定要素にフロート要素分の高さを付与する
  var setAddHeightToTarget = function(v) {
    // フロート要素がフロートしている場合
    if (v.target.classList.contains('is-float_showed' && 'is-float_floated')) {
      // 高さを付け足す方向が top の場合
      if (v.addHeightDirection === 'top') {
        v.addHeightTargetId.style.paddingTop = v.totalPadding + 'px';
        return;
      }
      // 高さを付け足す方向が bottom の場合
      v.addHeightTargetId.style.paddingBottom = v.totalPadding + 'px';
      return;
    }
    
    // フロート要素がフロートしていない or フロート要素がブラウザ表示幅ではない場合
    if (v.addHeightDirection === 'top') {
      v.addHeightTargetId.style.paddingTop = v.defaultPadding + 'px';
      return;
    }
    v.addHeightTargetId.style.paddingBottom = v.defaultPadding + 'px';
  };
  
  
  
  // is-float_floated クラスの付け外し
  var toggleIsFloatFloatedClass = function(v) {
    var SCROLL_Y = window.pageYOffset || document.documentElement.scrollTop;
    
    // 0pxで常時フロートする要素はフロートさせて返す
    if (v.switchPosition !== null && v.switchPosition === 0) {
      v.target.classList.add('is-float_floated');
      return;
    }
    
    // 表示スクロール量が数値指定の場合
    if (v.switchPosition !== null) {
      // 指定値よりスクロール量が大きい場合 or 数値が 0 で常にフロートしている場合
      if (v.switchPosition < SCROLL_Y) {
        v.target.classList.add('is-float_floated');
        return;
      }
      v.target.classList.remove('is-float_floated');
      return;
    }
    
    // 表示スクロール量がID指定の場合
    // スクロール量と比較
    if (v.switchScrollAmount < SCROLL_Y) {
      v.target.classList.add('is-float_floated');
      return;
    }
    v.target.classList.remove('is-float_floated');
  };
  
  
  
  // ロード・リサイズ・スクロール時
  var loadResizeScrollCallSummary = function(v) {
    // フロートさせるか判定する
    if (v.target.classList.contains('is-float_showed')) toggleIsFloatFloatedClass(v);
    
    // 高さを追加するタイプではない場合
    if (!v.addHeightDirection) return;
    // 追加分の高さの付け外し
    toggleDisableTransition(v.addHeightTargetId, 'add');
    setAddHeightToTarget(v);
    toggleDisableTransition(v.addHeightTargetId, 'remove');
  };
  
  
  
  // 表示スクロール量がID指定の場合(ロード・リサイズ用)
  var getSwitchScrollAmount = function(v) {
    var targetOffset,
        stackHeight,
        bodyOffset;
    
    // 対象要素の座標を取得する
    targetOffset = v.switchTarget.getBoundingClientRect().top;
    
    // 先行でフロートしている要素にツライチでフロートする場合
    if (v.stackTargetId) {
      // 先行でフロートしている要素の transition を無効にする
      toggleDisableTransition(v.stackTargetId, 'add');
      
      // 先行フロート要素が表示ブラウザ幅でない場合は何もしない
      if (!v.stackTargetId.classList.contains('is-float_showed')) {}
      
      // 先行フロート要素が表示ブラウザ幅でフロートしている場合
      else if (v.stackTargetId.classList.contains('is-float_floated'))
        stackHeight = v.stackTargetId.getBoundingClientRect().height;
      
      // 先行フロート要素が表示ブラウザ幅でフロートしていない場合
      else {
        v.stackTargetId.classList.add('is-float_floated');
        stackHeight = v.stackTargetId.getBoundingClientRect().height;
        v.stackTargetId.classList.remove('is-float_floated');
      }
      
      toggleDisableTransition(v.stackTargetId, 'remove');
    }
    // ツライチフロートの対象でない or 先行フロート要素が表示ブラウザ幅ではない場合
    else stackHeight = 0;
    
    // stackTargetId にフロートするクラスを付与しても高さが取得できなかった場合
    if (stackHeight === undefined) {
      console.log('[stackTargetId] of [' + v.id + '] cannot float.');
      stackHeight = 0;
    }
    
    // body のブラウザ座標を取得
    bodyOffset = document.body.getBoundingClientRect().top;
    // 対象要素の絶対座標(必要なスクロール量)を取得する
    v.switchScrollAmount = targetOffset - bodyOffset - stackHeight;
  };
  
  
  
  // 高さを付け足す対象要素に対してcssで指定した上下のpaddingを取得する
  var getPaddingAddHeightTarget = function(v) {
    // padding の値を格納
    var cssPadding;
    
    // 高さを付け足す方向が top の場合
    if (v.addHeightDirection === 'top') {
      v.addHeightTargetId.style.paddingTop = '';
      cssPadding = window.getComputedStyle(v.addHeightTargetId).getPropertyValue('padding-top');
    }
    // 高さを付け足す方向が bottom の場合
    else {
      v.addHeightTargetId.style.paddingBottom = '';
      cssPadding = window.getComputedStyle(v.addHeightTargetId).getPropertyValue('padding-bottom');
    }
    // ○○px から px を取り除き数字の文字列にする
    cssPadding = cssPadding.split('px');
    // 小数点付きの文字列を小数点付きのまま数値に変換
    // 小数点も認識するので値は丸めなくておｋ
    cssPadding[0] = parseFloat(cssPadding[0]);
    
    // 取得した高さとフロート要素の高さを合算
    v.totalPadding = cssPadding[0] + v.floatElemHeight;
    // 元々の高さを親スコープで参照できるようにオブジェクトに追加
    v.defaultPadding = cssPadding[0];
  };
  
  
  
  // 表示ブラウザ幅の判定(ロード・リサイズ用)
  var toggleIsFloatShowedClass = function(v) {
    var WINDOW_WIDTH = window.innerWidth;
    
    // ブラウザ幅問わず表示の場合
    if (!v.displayWidth) {
      v.target.classList.add('is-float_showed');
      // 表示の場合は true を返す
      return true;
    }
    
    // max-width の場合
    if (v.displayWidth[0] === 'max-width') {
     // 指定幅以下で表示
      if (v.displayWidth[1] >= WINDOW_WIDTH) {
        v.target.classList.add('is-float_showed');
        return true;
      }
     // 指定幅以上で非表示
      v.target.classList.remove('is-float_showed');
      return;
    }
    
    // min-width の場合
    // 指定幅以上で表示
    if (v.displayWidth[1] <= WINDOW_WIDTH) {
      v.target.classList.add('is-float_showed');
      return true;
    }
    // 指定幅以下で非表示
    v.target.classList.remove('is-float_showed');
  };
  
  
  
  // ロード・リサイズ時は付与クラスをリセット
  var resetClass = function (v) {
      v.target.classList.remove('is-float_showed');
      v.target.classList.remove('is-float_floated');
  };
  
  
  
  // ロードとリサイズ時
  var loadResizeCallSummary = function(v) {
    var IsFloatShowed;
    
    resetClass(v);
    // 表示ブラウザ幅の場合は true を受け取る
    IsFloatShowed = toggleIsFloatShowedClass(v);
    // 表示ブラウザ幅でなければ return
    if (!IsFloatShowed) return;
    
    // 表示ブラウザ幅の場合 ----------------------------------------
    // 対象要素に高さを追加するフロート要素の場合
    if (v.addHeightDirection) {
      v.floatElemHeight = v.target.getBoundingClientRect().height;
      getPaddingAddHeightTarget(v);
    }
    // 表示スクロール量がID指定の場合
    if (v.switchTarget) getSwitchScrollAmount(v);
  };
  
  
  
  var scrollEvent = function() {
    opt.forEach(function(v) {
      if (v.error) return;
      loadResizeScrollCallSummary(v);
    });
  };
  
  
  
  var resizeEvent = function() {
    opt.forEach(function(v) {
      if (v.error) return;
      loadResizeCallSummary(v);
      loadResizeScrollCallSummary(v);
    });
  };
  
  
  
  var thinOutResizeEvent = function() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(resizeEvent, 500);
  };
  
  
  
  // リサイズイベント内の処理を間引く
  var setResizeEvent = function() {
    var obj = {
      timeoutId: null,
      handleEvent: thinOutResizeEvent
    };
    
    window.addEventListener('resize', obj);
  };
  
  
  
  // // ロード時の処理a
  var loadEvent = function() {
    opt.forEach(function(v) {
      checkOptions(v);
      if (v.error) return;
      toggleDisableTransition(v.target, 'add');
      
      loadResizeCallSummary(v);
      loadResizeScrollCallSummary(v);
      
      toggleDisableTransition(v.target, 'remove');
    });
    
    setResizeEvent();
    window.addEventListener('scroll', scrollEvent);
  };
  window.addEventListener('load', loadEvent);
};


// --------------------------------------------------------------------------------


// スムーススクロール中に動作を妨げるキー入力を停止する
var getToggleEvent = function(str) {
      // 各イベントでのスクロールを有効または無効にする。
  var preventDefault = function(e) {
        e.preventDefault();
      },
      events = {
        scroll: {
          disableScroll: function() {
            // PC
            document.addEventListener('wheel', preventDefault, {passive: false});
            // mobile
            document.addEventListener('touchmove', preventDefault, {passive: false});
          },
          enableScroll: function() {
            document.removeEventListener('wheel', preventDefault, {passive: false});
            document.removeEventListener('touchmove', preventDefault, {passive: false});
          },
        },
        touch: {
          disableTouch: function() {
            document.addEventListener('touchstart', preventDefault, {passive: false});
          },
          enableTouch: function() {
            document.removeEventListener('touchstart', preventDefault, {passive: false});
          },
        }
      },
      obj = {};
  
  Object.keys(events).forEach(function(name) {
    if (name === str) obj = events[name];
  });
  return obj;
};


// --------------------------------------------------------------------------------


// アニメーションの処理
var setAnimation = function(obj) {
  var easingFunc,
      // 経過時間
      elapsedTime = 0,
      // 前回のeasing関数で取得した座標
      prevCoordinate,
      // 今回のeasing関数で取得した座標
      currentCoordinate = 0,
      // ループ処理の間隔
      frame = 16,
      loopObj = {
        // ループ回数のカウンタ
        count: 0,
        // ループ回数(+1 必須)
        loopCountLimit: Math.ceil(obj.duration / frame) + 1,
        animationAmount: 0,
      };
  
  var getEasingFunc = function(name) {
    // t: current time, b: begInnIng value, c: change In value, d: duration
    var easingObj = {
      linear: function(x, t, b, c, d) {
        return c * t / d + b;
      },
      easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
      },
      easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
      },
      easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOutQuad: function(x, t, b, c, d) {
        if (( t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      },
      easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      },
      easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
      },
      easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      },
      // easeOutBounce: function(x, t, b, c, d) {
      //   if ((t/=d) < (1/2.75)) {
      //    return c*(7.5625*t*t) + b;
      //   } else if (t < (2/2.75)) {
      //    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
      //   } else if (t < (2.5/2.75)) {
      //    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
      //   } else {
      //    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
      //   }
      // },
    };
    
    // 引数 name と合致する easing関数がある場合は関数を返す
    if (easingObj[name]) return easingObj[name];
    // easing関数を指定していない場合 または name プロパティが無い場合
    if (!name) return easingObj.linear;
    // 引数 name と合致する easing関数が無い場合
    throw new Error('easing function [' + name + '] is not found');
  };
  
  
  
  // ループ処理
  var executeLoop = function() {
    loopObj.count++;
    
    // ループごとに currentCoordinate の座標を前回の値として保持
    // 初回は currentCoordinate の初期値の 0
    prevCoordinate = currentCoordinate;
    
    // easing関数でグラフ座標の値を取得
    currentCoordinate = easingFunc(null, elapsedTime, obj.start, obj.difference, obj.duration);
    
    // 1回分のアニメーション量を算出【今回のグラフ座標 - 前回のグラフ座標】
    loopObj.animationAmount = currentCoordinate - prevCoordinate;
    
    // 経過時間に対して1フレーム分の時間を加算
    elapsedTime += frame;
    
    if (obj.animationFunc(loopObj)) return;
    
    // ループ続行
    setTimeout(executeLoop, frame);
  };
  
  // 引数を元にeasing関数のメソッドを取得して変数に格納する
  easingFunc = getEasingFunc(obj.easingName);
  executeLoop();
};


// --------------------------------------------------------------------------------


// スムーススクロール
var smoothScroll = function(opt){
  // アニメーション中か判定するための配列
  var isAnimated = false,
      floatTopElemDetailObj = {
        unFloatedCoordinates: [],
        floatedHeight: []
      };
  
  
  
  var checkOptionIdElemExists = function(v, str, critical) {
    var text = ['ID name [', '] specified in [', '] is not defined.'];
    if (document.getElementById(v)) return true;
    if (critical) throw new Error(text[0] + v + text[1] + str + text[2]);
    console.log(text[0] + v + text[1] + str + text[2]);
  };
  
  
  
  var checkOptionIsBool = function(v, str) {
    if (typeof v !== 'boolean')
      throw new Error('[' + str + '] must specify [true] or [false].');
  };
  
  
  
  var checkOptionIsNum = function(v, str) {
    // 0以上の整数判定用の変数
    var isNumber = /^([1-9]\d*|0)$/;
    // 型が数値ではない または 有限ではない(無限である) または 正の整数ではない(負数)
    if (typeof v !== 'number' || !isFinite(v) || !isNumber.test(v))
      throw new Error('[' + str + '] must be [Positive integer].');
  };
  
  
  
  var checkOptions = function() {
    
    if (opt.duration) {
      if (opt.duration.anchor !== undefined)
        checkOptionIsNum(opt.duration.anchor, 'duration.anchor');
      else opt.duration.anchor = 1000;
      
      if (opt.duration.urlHash !== undefined)
        checkOptionIsNum(opt.duration.urlHash, 'duration.urlHash');
      else opt.duration.urlHash = opt.duration.anchor;
    }
    else {
      opt.duration = {
        anchor: 1000,
        urlHash: 1000
      };
    }
    
    if (opt.dynamic) {
      // [dynamic.support] が定義されている場合
      if (opt.dynamic.support !== undefined) {
        checkOptionIsBool(opt.dynamic.support, 'dynamic.support');
        
        if (opt.dynamic.support === true) {
          // 動的要素に対応する際の親要素を取得する(可能な限り狭める)
          if (opt.dynamic.parentId) {
            opt.dynamic.parent
            = checkOptionIdElemExists(opt.dynamic.parentId, 'dynamic.parentId', false)
            ? document.getElementById(opt.dynamic.parentId)
            // 指定した要素が取得できなければ document とする
            : document;
          }
          // dynamic.parentId の指定がない場合
          else opt.dynamic.parent = document;
        }
      }
      // [dynamic.support] が未定義の場合は [false] として処理する
      else opt.dynamic.support = false;
    }
    else {
      opt.dynamic = {
        support:false
      };
    }
    
    if (opt.floatTopElem) {
      // トップにフロートする要素のIDを取得
      opt.floatTopElem.forEach(function(v) {
        if (!v.id) {
          console.log('Please specify ID name of the float element');
          v.error = true;
          return;
        }
        if (checkOptionIdElemExists(v.id, 'floatTopElem.id', false))
          v.target = document.getElementById(v.id);
        else {
          v.error = true;
          return;
        }
        // 指定が無ければ偽(false)として処理が進むけど、一応初期値として入れておく
        if (v.alwaysFloated)
          checkOptionIsBool(v.alwaysFloated, 'alwaysFloated');
        else v.alwaysFloated = false;
      });
    }
    
    if (opt.floatStatus) {
      opt.floatStatus.floatedClass = opt.floatStatus.floatedClass ? opt.floatStatus.floatedClass : 'is-float_floated';
      opt.floatStatus.showedClass = opt.floatStatus.showedClass ? opt.floatStatus.showedClass : 'is-float_showed';
    }
    else {
      opt.floatStatus = {
        floatedClass: 'is-float_floated',
        showedClass: 'is-float_showed'
      };
    }
    
    if (opt.eventUseCapture !== undefined)
      checkOptionIsBool(opt.eventUseCapture, 'eventUseCapture');
    else opt.eventUseCapture = false;
  };
  
  
  
  var scrollToTarget = function(obj) {
        // SCROLL_Y
    var currentCoordinates = window.pageYOffset || document.documentElement.scrollTop,
        // 目的値の座標
        nextCoordinates;
    
    // 渡ってきたアニメーション量が 1px or -1px 以下の場合は四捨五入で丸める
    if (obj.animationAmount < 1 && obj.animationAmount > 0) obj.animationAmount = 1;
    if (obj.animationAmount > -1 && obj.animationAmount < 0) obj.animationAmount = -1;
    
    // 1回のスクロール量の小数点以下を四捨五入する
    obj.animationAmount = Math.round(obj.animationAmount);
    
    // 現在の座標にアニメーション量を足して次の座標を求める
    nextCoordinates = currentCoordinates + obj.animationAmount;
    
    // ループを抜ける条件
    // 【①スクロール量(difference)がプラスの場合は、上から下へのスクロールとなる。
    //   次の座標(スクロール)が目的の座標より大きい(超える)とき。
    //   10 から 100 を目指し 100 より大きくなったとき。】
    // 【②スクロール量(difference)がマイナスの場合、下から上へのスクロールとなる。
    //   次の座標(スクロール)が目的の座標より小さい場合(超える)とき。
    //   100 から 10 を目指し 10 より小さくなったとき。】
    // 【③ループカウントの上限を超えた場合】
    // 【④次の座標(スクロール)が0より小さい場合】
    //
    if (
      (this.difference > 0 && nextCoordinates >= this.stop) ||
      (this.difference < 0 && nextCoordinates <= this.stop) ||
      obj.loopCountLimit === obj.count ||
      nextCoordinates < 0
    ) {
      // ループを抜ける際にリンク先の座標へスクロールさせる
      scrollTo(0, this.stop);
      
      // スクロールを有効にする
      this.toggleScrollEvent.enableScroll();
      // タッチを有効にする
      this.toggleTouchEvent.enableTouch();
      isAnimated = false;
      // setAnimation() 側でループを抜けるためのフラグを返す
      return true;
    }
    
    // ループを抜ける条件に合致しなかった場合
    // 絶対座標で徐々にスクロール
    scrollTo(0, nextCoordinates);
  };
  
  
  
  var setScrollAnimation = function(targetObj, toggleScrollEvent, toggleTouchEvent) {
    var obj = {
      easingName: opt.easing,
      duration: opt.duration.num,
      // スムーススクロールの場合は常に0
      start: 0,
      // リンク先の座標(絶対座標)
      stop: targetObj.coordinates,
      // 必要なスクロール量(相対座標)
      difference: targetObj.scrollAmount,
      animationFunc: scrollToTarget,
      toggleScrollEvent: toggleScrollEvent,
      toggleTouchEvent: toggleTouchEvent
    };
    
    setAnimation(obj);
  };
  
  
  
  // 必要なスクロール量を取得する
  var getTargetScrollAmount = function(obj, topMargin) {
    var target = {},
        // クリック時のスクロール量(絶対座標)
        SCROLL_Y = window.pageYOffset || document.documentElement.scrollTop;
    
    // リンク先の絶対座標
    target.coordinates = obj.linkOffset - obj.bodyOffset - topMargin;
    // リンク先への必要なスクロール量
    target.scrollAmount = target.coordinates - SCROLL_Y;
    
    return target;
  };
  
  
  
  // リンク先でフロートしているか確認する
  var checkIsFloatedTopAtTheLink = function(alwaysFloated, i, obj) {
        // フロート要素のtopからのスクロール量(絶対座標)
    var floatCoordinates,
        // リンク先のtopからのスクロール量(絶対座標)
        linkCoordinates;
    
    // 常にフロートする要素の場合
    if (alwaysFloated) return true;
    
    // フロート要素の絶対座標を算出
    floatCoordinates = floatTopElemDetailObj.unFloatedCoordinates[i];
    
    // リンク先の絶対座標を算出
    linkCoordinates = obj.linkOffset - obj.bodyOffset;
    
    // スクロール先でフロート要素がフロートされていない場合は返す
    // フロート要素の座標がリンク先の座標より大きい場合
    if (floatCoordinates > linkCoordinates) return;
    return true;
  };
  
  
  
  // リンク先でトップにフロートする要素の高さを取得する
  var getTopMargin = function(offsetObj) {
    var  result,
        // リンク先で表示されているトップにフロートする要素の高さ(複数の合算)
        topMargin = 0;
    
    opt.floatTopElem.forEach(function(v, i) {
      // エラープロパティがある場合は返す
      if (v.error) return;
      // フロート要素が表示ブラウザ幅でない場合
      if (!v.target.classList.contains(opt.floatStatus.showedClass)) return;
      
      // メソッドを実行しつつ真偽値を配列に格納する
      result = checkIsFloatedTopAtTheLink(v.alwaysFloated, i, offsetObj);
      
      // リンク先でフロートしている場合はフロート時の高さを取得する
      if (result) topMargin += floatTopElemDetailObj.floatedHeight[i];
    });
    return topMargin;
  };
  
  
  
  // クリックされた要素とボディのブラウザ座標を取得する
  var getOffset = function(linkTarget) {
    var obj = {
      // リンク先(スクロール先)のブラウザ座標(相対座標)を取得
      linkOffset: linkTarget.getBoundingClientRect().top,
      // body のブラウザ座標(相対座標)を取得
      bodyOffset: document.body.getBoundingClientRect().top,
    };
    return obj;
  };
  
  
  
  // スクロール処理開始の関数
  var anchorClickCallSummary = function(e, linkTarget) {
    // スクロールイベントを無効にする関数を呼び出す
    var toggleScrollEvent = getToggleEvent('scroll'),
        toggleTouchEvent = getToggleEvent('touch'),
        offsetObj,
        topMargin = 0,
        targetObj;
    
    toggleScrollEvent.disableScroll();
    toggleTouchEvent.disableTouch();
    
    // duration の振り分け
    // イベントオブジェクトがあればアンカーのクリックイベント
    // なければハッシュリンクの duration を代入
    opt.duration.num = e ? opt.duration.anchor : opt.duration.urlHash;
    
    // リンク先と body の相対座標を取得する
    offsetObj = getOffset(linkTarget);
    
    // トップにフロートする要素がある場合
    // リンク先でフロートしていれば高さを取得する
    if (opt.floatTopElem) topMargin = getTopMargin(offsetObj);
    
    targetObj = getTargetScrollAmount(offsetObj, topMargin);
    
    // 必要なスクロール量が0の場合 または duration が 0 (アニメーション不要)の場合
    // 途中で返す
    if (targetObj.scrollAmount === 0 || opt.duration.num === 0) {
      // 目的地へスクロール
      if (opt.duration.num === 0) scrollTo(0, targetObj.coordinates);
      
      isAnimated = false;
      toggleScrollEvent.enableScroll();
      toggleTouchEvent.enableTouch();
      return;
    }
    
    setScrollAnimation(targetObj, toggleScrollEvent, toggleTouchEvent);
  };
  
  
  
  var anchorClickEvent = function(linkTarget) {
    return function(e) {
      e.preventDefault();
      
      if (isAnimated) return;
      isAnimated = true;
      
      // スクロール処理開始の関数を呼び出す
      anchorClickCallSummary(e, linkTarget);
    };
  };
  
  
  
  // 入力値判定とアンカーの取得
  var getAnchorLinkTarget = function(anchor) {
    // ハッシュの付いたアンカーの抽出とリンク先の取得
    var result,
        idName,
        linkTarget;
    
    // 【href=""】の判定
    // 空文字列なら返すだけで終了
    if (anchor.hasAttribute('href') && !anchor.getAttribute('href')) return;
    // 【<a>...</a>】hrefが存在しない判定
    if (!anchor.getAttribute('href')) return;
    
    // hrefの値にハッシュがあるか判定
    result = anchor.getAttribute('href').indexOf('#');
    // ハッシュがない場合(-1) または 1文字目以外にある場合
    // → 0 じゃない場合は返す
    if (result !== 0) return;
    
    // ハッシュが1文字目にある場合
    // リンク先のID名を取得
    idName = anchor.getAttribute('href').slice(1);
    
    // リンク先がある場合
    if (document.getElementById(idName)) {
      linkTarget = document.getElementById(idName);
      return linkTarget;
    }
    // 【<a href="#"】ダミーリンクの場合
    // [#] を削ってるので空文字で判定する
    else if (idName === '') {
      // body要素を取得
      linkTarget = document.body;
      return linkTarget;
    }
    // # が1文字目で名前も付いてるけどリンク先が無い場合
    else console.log('ID name [' + idName + '] specified in [anchor] is not defined.');
  };
  
  
  
  // 入力値判定とアンカーの取得
  var prepareStaticAnchorScroll = function() {
        // 取得結果はオブジェクトになる
    var anchor = document.getElementsByTagName('a'),
        linkTarget;
    
    // ハッシュの付いたアンカーの抽出とリンク先の取得
    Object.keys(anchor).forEach(function(v) {
      linkTarget = getAnchorLinkTarget(anchor[v]);
      if (!linkTarget) return;
      anchor[v].addEventListener('click', anchorClickEvent(linkTarget), {capture: opt.eventUseCapture});
    });
  };
  
  
  
  var prepareDynamicAnchorScroll = function(e) {
      var anchor = e.target,
          linkTarget,
          returnFunc;
      
      // [e.currentTarget] は常に document を示す
      // console.log(e.currentTarget);
      //
      // [e.target] は一番最後の子孫を示す
      // console.log(e.target);
      
      while (anchor.tagName !== 'A' && anchor.tagName !== 'BODY') {
        anchor = anchor.parentNode;
      }
      
      if (anchor.tagName === 'A') linkTarget = getAnchorLinkTarget(anchor);
      
      if (!linkTarget) return;
      
      // 引数を1つ渡して返り値に関数を取得する → イベントオブジェクトを渡しつつ
      // 返り値の関数を実行する
      returnFunc = anchorClickEvent(linkTarget);
      returnFunc(e);
  };
  
  
  
  // ハッシュリンクを取得する
  var getUrlHashLink = function() {
    // URL に付与されている hash を取得して1文字目の # をスライスする
    var urlHash = location.hash.slice(1),
        target;
    
    // hash に該当するリンク先があれば取得、なければ null を代入
    target = document.getElementById(urlHash)
      ? document.getElementById(urlHash)
      : null;
    
    return target;
  };
  
  
  
  var prepareHashLinkScroll = function() {
    var linkTarget;
    linkTarget = getUrlHashLink();
    
    if (linkTarget)
      anchorClickCallSummary(null, linkTarget);
  };
  
  
  
  var setEachScroll = function() {
    // ハッシュリンクへのスクロール
    if (location.hash) prepareHashLinkScroll();
    
    // 動的要素に対応するか否かで処理を分ける
    if (opt.dynamic.support)
      opt.dynamic.parent.addEventListener('click', prepareDynamicAnchorScroll, {capture: opt.eventUseCapture});
    else prepareStaticAnchorScroll();
  };
  
  
  
  var unDoIsFloatedClass = function(v) {
    // クリック時にフロートしていた場合
    if (v.isFloated) return;
    // クリック時にフローとしていなかった場合
    v.target.classList.remove(opt.floatStatus.floatedClass);
  };
  
  
  
  var toggleDisableTransition = function(target, str) {
    if (str === 'add') {
      target.style.transition = 'none';
      target.style.animation = 'none';
      return;
    }
    target.style.transition = '';
    target.style.animation = '';
  };
  
  
  
  // トップにフロートする要素のフロート時の高さを求める
  var getIsFloatedTopHeight = function(v) {
    var floatedHeight;
    
    // 常時フロートでない要素に対して一旦フロートさせる
    if (!v.alwaysFloated) v.target.classList.add(opt.floatStatus.floatedClass);
    
    // フロート時の高さを取得
    floatedHeight = v.target.getBoundingClientRect().height;
    
    return floatedHeight;
  };
  
  
  
  var getUnFloatedCoordinates = function(v) {
    var unFloatedHeight,
        // フロート要素のブラウザ座標(相対座標)
        unFloatedOffset,
        bodyOffset,
        calcHeight,
        unFloatedCoordinates;
    
    // 常時フロートしている要素の場合
    if (v.alwaysFloated) return null;
    
    // 一律に一旦フロートを解除する
    v.target.classList.remove(opt.floatStatus.floatedClass);
    
    // フロートしていないときの高さを取得する
    unFloatedHeight = v.target.getBoundingClientRect().height;
    
    // フロート解除中にブラウザ座標(相対座標)を取得しておく
    unFloatedOffset = v.target.getBoundingClientRect().top;
    bodyOffset = document.body.getBoundingClientRect().top;
    
    // 対象要素がクリック時にフロートしていた場合のみ、絶対座標算出に
    // 非フロート時の高さが必要となる。
    calcHeight = v.isFloated ? unFloatedHeight : 0;
    
    unFloatedCoordinates = unFloatedOffset - bodyOffset - calcHeight;
    
    return unFloatedCoordinates;
  };
  
  
  
  // トップにフロートする要素がクリック時にフロートしているかチェック
  var checkIsFloatedTopWhenClicked = function(v) {
    // 既にフロートしている場合
    if (v.target.classList.contains(opt.floatStatus.floatedClass)) {
      // フロート要素がクリック時にフロートしているかを保持する値
      v.isFloated = true;
      return;
    }
    // 現状フロートしていない場合
    v.isFloated = false;
  };
  
  
  
  // ロード時にトップにフロートする要素の、フロート開始座標と
  // フロート時の高さを取得する
  var getFloatTopElemUnFloatedCoordinates = function() {
    opt.floatTopElem.forEach(function(v) {
      
      // エラープロパティがある場合 または フロート要素が表示ブラウザ幅でない場合 は返す
      if (
        v.error ||
        !v.target.classList.contains(opt.floatStatus.showedClass)
      ) {
        // エラーがある場合は取得する必要がある値に [null] を代入しておく
        floatTopElemDetailObj.unFloatedCoordinates.push(null);
        floatTopElemDetailObj.floatedHeight.push(null);
        return;
      }
      
      checkIsFloatedTopWhenClicked(v);
      
      // フロートするクラスを付与させた際に transition があると高さがずれるので
      // 一律に transition を無効にしたうえで高さを取得する
      toggleDisableTransition(v.target, 'add');
      
      // 非フロート時の相対座標を取得して返り値として配列へプッシュ
      floatTopElemDetailObj.unFloatedCoordinates.push(getUnFloatedCoordinates(v));
      // フロート時の高さを取得して返り値として配列へプッシュ
      floatTopElemDetailObj.floatedHeight.push(getIsFloatedTopHeight(v));
      
      toggleDisableTransition(v.target, 'remove');
      
      // 一律に外したフロート中のクラスを元に戻す
      unDoIsFloatedClass(v);
    });
  };
  
  
  
  var resetObj = function() {
    // floatTopElemDetailObj は親スコープのオブジェクト
    Object.keys(floatTopElemDetailObj).forEach(function(prop) {
      floatTopElemDetailObj[prop] = [];
    });
  };
  
  
  
  var resizeEvent = function() {
    resetObj();
    if (opt.floatTopElem) getFloatTopElemUnFloatedCoordinates();
  };
  
  
  
  var thinOutResizeEvent = function() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(resizeEvent, 500);
  };
  
  
  
  // リサイズイベント内の処理を間引く
  var setResizeEvent = function() {
    var obj = {
      timeoutId: null,
      handleEvent: thinOutResizeEvent
    };
    
    // リサイズ時の処理
    window.addEventListener('resize', obj);
  };
  
  
  
  var loadEventCallSummary = function() {
    checkOptions();
    if (opt.floatTopElem) getFloatTopElemUnFloatedCoordinates();
    setEachScroll();
    setResizeEvent();
  };
  
  
  
  var loadEvent = function() {
    setTimeout(loadEventCallSummary, 50);
  };
  
  
  
  window.addEventListener('load', loadEvent);
  
  
  
  // --------------------------------------------------------------------------------
  // ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
  // ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
  // ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
  // プレビュー用
  
  var changeOptionsSelect = function(e) {
    opt.easing = e.currentTarget.value;
  };
  
  var setOptionsSelectChangeEvent = function() {
    var selectHandle = {
      easingSelect: document.getElementById('easingSelect'),
      handleEvent: changeOptionsSelect
    }
    selectHandle.easingSelect.addEventListener('change', selectHandle);
  };
  setOptionsSelectChangeEvent();
  // ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
  // ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
  // ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
};

