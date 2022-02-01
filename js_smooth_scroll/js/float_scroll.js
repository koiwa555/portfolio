'use strict';
// --------------------------------------------------------------------------------
// フロート要素の操作
var floatContent = function(opt){
  var WINDOW_WIDTH,
      SCROLL_Y,
      // 前回のスクロール量
      PREV_SCROLL_Y,
      // 前回のスクロール量を取得するか否かの判定フラグ
      enabledPrevScrollY = false,
      // スムーススクロール中の判定用フラグ
      isSmoothScrolled = false;
  
  
  // start check options --------------------------------------------------
  var checkIsExistsIdElem = function(val, useTpl, critical, str) {
    var message;
    
    if (document.getElementById(val)) return true;
    if (useTpl) {
      message = 'ID name [' + val + '] specified in [' + str + '] is not defined.';
      if (critical) throw new Error(message);
      console.log(message);
    }
    // テンプレートを使用して console.log() でエラーを出力した場合も
    // ここで [false] を返す
    return false;
  };
  
  
  var checkIsNum = function(val, useTpl, str) {
    // 0以上の整数判定用の変数
    var isNumber = /^([1-9]\d*|0)$/;
    
    // 型が数値 かつ 無限ではない かつ 正の整数
    if (typeof val === 'number' && isFinite(val) && isNumber.test(val)) return true;
    
    if (useTpl) throw new Error('[' + str + '] must be [Positive integer].');
    return false;
  };
  
  
  var checkIsCorrectStr = function(val, arr, useTpl, str) {
    var i,
        message;
    
    // 配列でなければ配列にしてから処理をする
    if (!Array.isArray(arr)) arr = [arr];
    
    // 一致したらループを抜ける
    for (i = 0; i < arr.length; i++) {
      if (typeof val === 'string' && val === arr[i]) return true;
    }
    
    // エラー処理
    // テンプレートを使う場合
    if (useTpl) {
      i = 0;
      message = '[' + str + '] must specify [' + arr[i] + ']';
      for (i++; i < arr.length; i++) {
        message += ' or [' + arr[i] + ']';
      }
      message += '.';
      throw new Error(message);
    }
    // テンプレートを使わない場合
    return false;
  };
  
  
  var checkIsBool = function(val, useTpl, str) {
    if (typeof val === 'boolean') return true;
    if (useTpl) throw new Error('[' + str + '] must specify [true] or [false].');
    return false;
  };
  
  
  // 配列の構成が正しいか否かの判定
  var checkIsCorrectArrLength = function(arr, length, useTpl, str) {
    if (arr.length === length) return true;
    if (useTpl) throw new Error('[' + length + ']' + ' elements are required for [' + str + '].');
    return false;
  };
  
  
  // オブジェクトの空判定
  var checkIsEmptyObject = function(obj, str) {
    if (!Object.keys(obj).length)
      throw new Error('[' + str + '] object is empty.');
  };
  
  
  // 必須項目が存在しない場合
  var throwErrorRequired = function(str) {
    throw new Error('[' + str + '] is a required.');
  };
  
  
  var checkOptions = function(v) {
    // 有効ブラウザ幅の指定があるオプションでの添え字を格納するオブジェクト
    v.index = {};
    
    // idの指定がない場合
    if (!v.id) {
      console.log('Please specify ID name of the float element');
      v.error = true;
      return;
    }
    // idを取得
    if (checkIsExistsIdElem(v.id, true, false, 'id')) {
      v.id = document.getElementById(v.id);
    } else {
      v.error = true;
      return;
    }
    
    // 表示を開始するスクロール量 または フロートする目印となる要素のID
     // 0 を含めた数値または文字列が渡ってくるので [!= null] で判定
    if (v.switchPosition != null) {
      //値が [正の整数] [型が数値] の場合は何もしない
      if (checkIsNum(v.switchPosition)) {
      } else if (checkIsExistsIdElem(v.switchPosition)) { // id 指定の場合
        v.switchTarget = document.getElementById(v.switchPosition);
        v.switchPosition = null;
      } else { // 指定が正しくない場合
        // 指定された値と合わせてエラーを出力
        console.log('[switchPosition] must be [Positive integer] or [ID name of the target element].\nSpecified value is [' + v.switchPosition + '].');
        v.error = true;
        return;
      }
    } else { // 初期値がなければ常に表示となる 0 を代入
      v.switchPosition = 0;
    }
    
    // 表示を開始するブラウザ幅
    if (v.float) {
      if (!Array.isArray(v.float)) {
        v.float = [v.float];
      }
      v.float.forEach(function(w, i) {
        var text = 'float[' + i + '].';
        
        // オブジェクトの空判定
        checkIsEmptyObject(w, 'float');
        
        if (w.enabled != null) {
          checkIsBool(w.enabled, true, text + 'enabled');
        } else { // [enabled] を記述していなければ有効とする
          w.enabled = true;
        }
        
        // [range] がなければループを飛ばす
        if (!w.range) return;
        checkIsCorrectArrLength(w.range, 2, true, text + 'range');
        checkIsCorrectStr(w.range[0], ['max-width', 'min-width'], true, text + 'range[0]');
        checkIsNum(w.range[1], true, text + 'range[1]');
      });
    } else { // 表示ブラウザの指定が無い場合は判定しないので表示される
      v.float = false;
    }
    
    // 不要なオブジェクトであっても、後々判定で利用されることがあるので false を代入しておく。
    // false であれば Boolean オブジェクトであり、存在するものとして扱われるため。
    // null・undefined だとエラーになる。
    
    // フロート要素の高さを対象要素に付け足すか否か
    if (v.addHeight) {
      // フロート要素の高さを他の要素に付け足す
      if (v.addHeight.id && v.addHeight.direction) {
        // IDが取得できた場合
        if (checkIsExistsIdElem(v.addHeight.id, true, false, 'addHeight.id')) {
          v.addHeight.id = document.getElementById(v.addHeight.id);
        } else {
          v.error = true;
          return;
        }
        
        // 値が top・bottom か判定
        checkIsCorrectStr(v.addHeight.direction, ['top', 'bottom'], true, 'addHeight.direction');
      } else if (
        (v.addHeight.id && !v.addHeight.direction) ||
        (!v.addHeight.id && v.addHeight.direction)
      ) { // 片方だけ値が無い場合
        throw new Error('Specify [addHeight.id] and [addHeight.direction] as a set.');
      }
    } else { // どちらも無い場合
      v.addHeight = false;
    }
    
    // 先行のフロート要素にツライチでフロートする要素
    if (v.stackId) {
      if (checkIsExistsIdElem(v.stackId, true, false, 'stackId')) {
        v.stackId = document.getElementById(v.stackId);
      } else {
        v.error = true;
        return;
      }
    }
    
    if (v.scrollUp) {
      if (!Array.isArray(v.scrollUp)) {
        v.scrollUp = [v.scrollUp];
      }
      v.scrollUp.forEach(function(w, i) {
        var text = 'scrollUp[' + i + '].';
        
        // オブジェクトの空判定
        checkIsEmptyObject(w, 'scrollUp');
        
        // 真偽値の存在チェック
        // ※false を判定できる版
        if (w.enabled != null) {
          checkIsBool(w.enabled, true, text + 'enabled');
        } else { // [enabled] を記述していなければ有効とする
          w.enabled = true;
        }
        
        if (w.range) {
          checkIsCorrectArrLength(w.range, 2, true, text + 'range');
          checkIsCorrectStr(w.range[0], ['max-width', 'min-width'], true, text + 'range[0]');
          checkIsNum(w.range[1], true, text + 'range[1]');
        }
        if (w.feature) {
          checkIsCorrectStr(w.feature, ['changeMargin', 'addClass'], true, text + 'feature');
        } else {
          throwErrorRequired(text + 'feature');
        }
        if (w.feature === 'changeMargin' && !w.marginDirection) {
          throw new Error('[scrollUp.marginDirection] is required to use [changeMargin].');
        }
        if (w.marginDirection) {
          checkIsCorrectStr(w.marginDirection, ['top', 'bottom'], true, text + 'marginDirection');
        }
      });
    } else { // [scrollUp] の指定がなかった場合
      v.scrollUp = false;
    }
    
    if (v.cancel) {
      if (!Array.isArray(v.cancel)) {
        v.cancel = [v.cancel];
      }
      v.cancel.forEach(function(w, i) {
        var text = 'cancel[' + i + '].';
        
        checkIsEmptyObject(w, 'cancel');
        if (w.enabled != null) {
          checkIsBool(w.enabled, true, text + 'enabled');
        } else {
          w.enabled = true;
        }
        if (w.range) {
          checkIsCorrectArrLength(w.range, 2, true, text + 'range');
          checkIsCorrectStr(w.range[0], ['max-width', 'min-width'], true, text + 'range[0]');
          checkIsNum(w.range[1], true, text + 'range[1]');
        }
        
        if (w.addClassId) {
          if (!Array.isArray(w.addClassId)) {
            w.addClassId = [w.addClassId];
          }
          w.addClassId.forEach(function(x, i, arr) {
            if (checkIsExistsIdElem(x, true, false, 'addHeight.id')) {
              arr[i] = document.getElementById(x);
            } else {
              v.error = true;
              return;
            }
          });
        }
        
        if (w.feature) {
          checkIsCorrectStr(w.feature, ['main', 'side'], true, text + 'feature');
        } else {
          throwErrorRequired(text + 'feature');
        }
        
        if (w.feature === 'side') {
          if (w.sideOptions) {
            if (checkIsExistsIdElem(w.sideOptions.mainId, true, true, text + 'coordinate.mainId')) {
              w.sideOptions.mainId = document.getElementById(w.sideOptions.mainId);
            }
            if (w.sideOptions.coordinate != null) {
              checkIsNum(w.sideOptions.coordinate, true, text + '.coordinate.coordinate');
            } else {
              w.sideOptions.coordinate = 0;
            }
            if (w.sideOptions.absolute != null) {
              checkIsNum(w.sideOptions.absolute, true, text + '.coordinate.absolute');
            } else {
              w.sideOptions.absolute = 0;
            }
          } else {
            throwErrorRequired(text + 'coordinate');
          }
        }
      });
    } else {
      v.cancel = false;
    }
    
  };
  // end check options --------------------------------------------------
  
  
  var toggleSideContentAbsoluteTop = function(v) {
    if (v.id.classList.contains('is-float_canceled')) {
      v.id.style.top = v.cancel.absoluteCoordinate + 'px';
    } else {
      v.id.style.top = '';
    }
  };
  
  
  var toggleCancelAddClass = function(v) {
    if (v.id.classList.contains('is-float_canceled')) {
      v.cancel[v.index.cancel].addClassId.forEach(function(w) {
        w.classList.add('is-float_canceled');
      });
      return;
    }
    v.cancel[v.index.cancel].addClassId.forEach(function(w) {
      w.classList.remove('is-float_canceled');
    });
  };
  
  
  var toggleIsFloatCanceledClass = function(v) {
    if (v.cancel.scrollAmount < SCROLL_Y) {
      v.id.classList.add('is-float_canceled');
      return true;
    }
    v.id.classList.remove('is-float_canceled');
    return false
  };
  
  
  var changeMinusMargin = function(v) {
    if (v.scrollUp[v.index.scrollUp].marginDirection === 'top') { // margin-top の場合
      v.id.style.marginTop = v.scrollUp.minusMargin + v.scrollUp.counter + 'px';
    } else { // margin-bottom の場合
      v.id.style.marginBottom = v.scrollUp.minusMargin + v.scrollUp.counter + 'px';
    }
  };
  
  
  var checkScrollUp = function() {
    return SCROLL_Y < PREV_SCROLL_Y ? true : false;
  };
  
  
  // スクロールの方向と [v.scrollUp.counter] が増減可能かを判定
  var checkScrollDirectionAndCounter = function(v) {
    // 初期値 false で条件合致で true とする
    var obj = {
      // 上スクロールの判定結果
      upDirection: false,
      // margin の増減が可能かの判定結果
      changeCount: false,
    };
    
    // 上スクロールの場合
    // 今回のスクロール量が前回のスクロール量より小さい場合
    if (checkScrollUp()) {
      obj.upDirection = true;
      // margin の増減が可能な範囲の場合
      if (v.scrollUp.counter < v.scrollUp.floatedHeight) {
        obj.changeCount = true;
      }
    } else { // 下スクロール・ロード時の場合
      // margin の増減が可能な範囲の場合
      if (v.scrollUp.counter > 0) {
        obj.changeCount = true;
      }
    }
    return obj;
  };
  
  
  var setScrollUpChangeMargin = function(v) {
    // 複数の条件判定の結果を配列で受け取る
    var result;
    
    // スムーススクロール中は返す
    if (v.id.classList.contains('is-scrolled')) {
      // 初回だけ合致させるための判定
      if (!isSmoothScrolled) {
        // 要素を表示状態にするためにフロート時の高さを値としてセット
        v.scrollUp.counter = v.scrollUp.floatedHeight;
        // 要素を表示させる
        changeMinusMargin(v);
      }
      isSmoothScrolled = true;
      return;
    }
    // [is-scrolled] クラスが外れた直後に 1 回分
    // スクロールが発生してしまうので対処する
    if (isSmoothScrolled) {
      // スクロール量の差分をなくす
      PREV_SCROLL_Y = SCROLL_Y;
      isSmoothScrolled = false;
    }
    
    // バウンススクロールの対応
    if (SCROLL_Y < 0) {
      v.scrollUp.counter == v.scrollUp.floatedHeight
      changeMinusMargin(v);
      return;
    }
    
    result = checkScrollDirectionAndCounter(v);
    
    // スムーススクロール中を除き [v.scrollUp.counter] はここ以降で設定される
    
    // 上スクロール・カウント変更 OK の場合
    if (result.upDirection && result.changeCount) {
      v.scrollUp.counter += PREV_SCROLL_Y - SCROLL_Y;
      
      // 増加後の値がフロート時の要素の高さをオーバーる場合
      if (v.scrollUp.counter > v.scrollUp.floatedHeight) v.scrollUp.counter = v.scrollUp.floatedHeight;
      changeMinusMargin(v);
    } else if (!result.upDirection && result.changeCount) { // 下スクロール・カウント変更 OK の場合
      v.scrollUp.counter -= SCROLL_Y - PREV_SCROLL_Y;
      
      // 加減後の値が 0 を下回る場合
      if (v.scrollUp.counter < 0) v.scrollUp.counter = 0;
      changeMinusMargin(v);
    }
  };
  
  
  var setScrollUpAddClass = function(v) {
    if (checkScrollUp()) {
      v.id.classList.add('is-float_scroll_up');
      return;
    }
    v.id.classList.remove('is-float_scroll_up');
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
  
  
  // 指定要素に追加しているフロート要素分の高さを (padding) を除去する
  var removePaddingToTarget = function(v) {
    if (v.addHeight.direction === 'top') {
      v.addHeight.id.style.paddingTop = '';
      return;
    }
    v.addHeight.id.style.paddingBottom = '';
  };
  
  
  // 指定要素にフロート要素分の高さを padding として付与する
  var addPaddingToTarget = function(v) {
    // 高さを付け足す方向が top の場合
    if (v.addHeight.direction === 'top') {
      v.addHeight.id.style.paddingTop = v.addHeight.padding + 'px';
      return;
    }
    // 高さを付け足す方向が bottom の場合
    v.addHeight.id.style.paddingBottom = v.addHeight.padding + 'px';
  };
  
  
  // is-float_floated クラスの付け外し
  var toggleIsFloatFloatedClass = function(v) {
    // 表示スクロール量が数値指定の場合
    // ここでは [数値] か [null] が入っていて、[undefined] は
    // 関係ないので厳密等価で比較する
    if (v.switchPosition !== null) {
      // 0pxで常時フロートする要素はフロートさせて返す
      if (v.switchPosition === 0) {
        v.id.classList.add('is-float_floated');
        return;
      }
      // 指定値よりスクロール量が大きい場合 or 数値が 0 で常にフロートしている場合
      if (v.switchPosition < SCROLL_Y) {
        v.id.classList.add('is-float_floated');
        return;
      }
      v.id.classList.remove('is-float_floated');
      return;
    }
    
    // 表示スクロール量がID指定の場合
    // スクロール量と比較
    if (v.switchScrollAmount < SCROLL_Y) {
      v.id.classList.add('is-float_floated');
      return;
    }
    v.id.classList.remove('is-float_floated');
  };
  
  
  // ロード・リサイズ・スクロール時
  var loadResizeScrollCallSummary = function(v) {
    // 表示ブラウザ幅 でなければ返す
    if (!v.id.classList.contains('is-float_enabled')) return;
    
    toggleIsFloatFloatedClass(v);
    
    // 高さを追加するタイプの場合
    if (v.addHeight.direction) {
      // 追加分の高さの付け外し
      toggleDisableTransition(v.addHeight.id, 'add');
      if (v.id.classList.contains('is-float_floated')) {
        addPaddingToTarget(v);
      } else {
        removePaddingToTarget(v);
      }
      toggleDisableTransition(v.addHeight.id, 'remove');
    }
    
    // フロートされていなければ返す
    // 以降はフロートされている要素に対する処理
    if (!v.id.classList.contains('is-float_floated')) return;
    
    if (v.scrollUp && v.index.scrollUp !== -1) {
      if (v.scrollUp[v.index.scrollUp].enabled) {
        if (v.scrollUp[v.index.scrollUp].feature === 'changeMargin') {
          setScrollUpChangeMargin(v);
        } else {
          setScrollUpAddClass(v);
        }
      }
    }
    
    if (v.cancel && v.index.cancel !== -1) {
      if (v.cancel[v.index.cancel].enabled) {
        toggleIsFloatCanceledClass(v);
        if (v.cancel[v.index.cancel].addClassId) toggleCancelAddClass(v);
        if (v.cancel[v.index.cancel].feature === 'side') toggleSideContentAbsoluteTop(v);
      }
    }
  };
  
  
  var getBodyOffsetAndHeight = function(v) {
    var obj = {
      // body の相対座標を取得
      offset: document.body.getBoundingClientRect().top,
      // ブラウザの高さを取得
      height: document.documentElement.clientHeight,
    };
    return obj;
  };
  
  
  var setCancelMain = function(v) {
    var body = getBodyOffsetAndHeight(),
        // 要素の相対座標を取得
        targetOffset  = v.id.getBoundingClientRect().top,
        targetCoordinate,
        floatedHeight = getFloatedHeight(v.id);
    
    // 要素の絶対座標を算出
    targetCoordinate = targetOffset - body.offset;
    // キャンセル用クラスを付与させたい絶対座標を算出する
    v.cancel.scrollAmount = targetCoordinate - body.height + floatedHeight;
  };
  
  
  var setCancelSide = function(v) {
    var body = getBodyOffsetAndHeight(),
        mainOffset = v.cancel[v.index.cancel].sideOptions.mainId.getBoundingClientRect().top,
        mainHeight = v.cancel[v.index.cancel].sideOptions.mainId.getBoundingClientRect().height,
        mainCoordinate,
        mainBottomCoordinate,
        sideFloatedHeight = v.id.getBoundingClientRect().height;
    
    // main の座標を算出
    mainCoordinate = mainOffset - body.offset;
    // main の下端の座標を算出
    mainBottomCoordinate = mainCoordinate + mainHeight;
    // クラス付与が発火する絶対座標を算出
    v.cancel.scrollAmount = mainBottomCoordinate - body.height + v.cancel[v.index.cancel].sideOptions.coordinate;
    // side に指定する absolute の top の座標
    v.cancel.absoluteCoordinate = mainBottomCoordinate - sideFloatedHeight - v.cancel[v.index.cancel].sideOptions.absolute;
  };
  
  
  var setScrollUpParam = function(v) {
    // 小数点を切り捨てで、表示・非表示のスクロールに誤差が出ないようにする。
    v.scrollUp.floatedHeight = Math.floor(getFloatedHeight(v.id));
    v.scrollUp.counter = v.scrollUp.floatedHeight;
    // フロート中の高さをマイナスマージンとする
    v.scrollUp.minusMargin = -v.scrollUp.floatedHeight;
  };
  
  
  var getFloatedHeight = function(target) {
    var floatedHeight;
    
    target.classList.add('is-float_floated');
    floatedHeight = target.getBoundingClientRect().height;
    target.classList.remove('is-float_floated');
    return floatedHeight;
  };
  
  
  var checkEnabledRange = function(arr) {
    // 有効ブラウザ幅に一致しなかった場合の初期値
    var index = -1;
    
    arr.forEach(function(v, i) {
      // 有効ブラウザ幅の指定がない場合
      if (!v.range) {
        // 直上のforEach を抜けるための return
        index = i;
        return;
      }
      if (v.range[0] === 'max-width' && v.range[1] >= WINDOW_WIDTH) {
      // max-width の場合
      // ブラウザ幅が指定数値以下で有効
        index = i;
        return;
      } else if (v.range[0] === 'min-width' && v.range[1] <= WINDOW_WIDTH) {
      // min-width の場合
      // ブラウザ幅が指定数値以上で有効
        index = i;
        return;
      }
    });
    
    return index;
  };
  
  
  // 表示スクロール量がID指定の場合(ロード・リサイズ用)
  var getSwitchScrollAmount = function(v) {
    var stackHeight,
        targetOffset,
        bodyOffset;
    
    // 先行でフロートしている要素にツライチでフロートする場合
    if (v.stackId) {
      // 先行でフロートしている要素の transition を無効にする
      toggleDisableTransition(v.stackId, 'add');
      
      // 先行フロート要素が表示ブラウザ幅でない場合は何もしない
      if (!v.stackId.classList.contains('is-float_enabled')) {
      } else if (v.stackId.classList.contains('is-float_floated')) { // 先行フロート要素が表示ブラウザ幅でフロートしている場合
        stackHeight = v.stackId.getBoundingClientRect().height;
      } else { // 先行フロート要素が表示ブラウザ幅でフロートしていない場合
        // フロートさせて高さを取得してフロート解除する
        stackHeight = getFloatedHeight(v.stackId);
      }
      
      toggleDisableTransition(v.stackId, 'remove');
    } else { // ツライチフロートの対象でない or 先行フロート要素が表示ブラウザ幅ではない場合
      stackHeight = 0;
    }
    // stackId にフロートするクラスを付与しても高さが取得できなかった場合
    if (stackHeight === undefined) {
      console.log('[stackId] of [' + v.id + '] cannot float.');
      stackHeight = 0;
    }
    
    // 対象要素の座標を取得する
    targetOffset = v.switchTarget.getBoundingClientRect().top;
    // body のブラウザ座標を取得
    bodyOffset = document.body.getBoundingClientRect().top;
    // 対象要素の絶対座標(必要なスクロール量)を取得する
    v.switchScrollAmount = targetOffset - bodyOffset - stackHeight;
  };
  
  
  // 高さを付け足す対象要素に対してcssで指定した上下のpaddingを取得して
  // 追加分の高さと合算する
  var getPaddingAddHeightTarget = function(v) {
    // css でスタイリングしている padding の値を格納する
    var cssPadding,
        unFloatedHeight = v.id.getBoundingClientRect().height;
    
    if (v.addHeight.direction === 'top') { // 高さを付け足す方向が top の場合
      cssPadding = window.getComputedStyle(v.addHeight.id).getPropertyValue('padding-top');
    } else { // 高さを付け足す方向が bottom の場合
      cssPadding = window.getComputedStyle(v.addHeight.id).getPropertyValue('padding-bottom');
    }
    // ○○px から px を取り除き数字の文字列にする
    cssPadding = cssPadding.split('px');
    // 小数点付きの文字列を小数点付きのまま数値に変換
    // 小数点も認識するので値は丸めなくておｋ
    cssPadding[0] = parseFloat(cssPadding[0]);
    
    // 取得した高さとフロート要素の高さを合算
    v.addHeight.padding = cssPadding[0] + unFloatedHeight;
  };
  
  
  // ロードとリサイズ時
  var loadResizeCallSummary = function(v, PREV_WINDOW_WIDTH) {
    // 表示ブラウザ幅の指定がある場合
    if (v.float) {
      // 有効な範囲指定があるかチェック
      v.index.float = checkEnabledRange(v.float);
      
      // 有効な範囲指定、且つ有効化が true の場合。
      if (v.index.float !== -1 && v.float[v.index.float].enabled) {
        v.id.classList.add('is-float_enabled');
      }
    } else { // 指定が無ければ無条件でクラスを付与
      v.id.classList.add('is-float_enabled');
    }
    
    // 表示ブラウザ幅でなければ return
    if (!v.id.classList.contains('is-float_enabled')) return;
    
    // 表示ブラウザ幅の場合 ----------------------------------------
    // 対象要素に高さを追加するフロート要素の場合
    if (v.addHeight.direction) {
      
      // ここの分岐は必須！
      //
      // if 側で [v.unFloatedHeight = v.id.getBoundingClientRect().height] の
      // 処理を行わないことでエラーを対処できた。
      // 要因を追ったけどわからなかった。
      //
      // ■症状
      // Footer が表示されるエリアまでスクロールして、高さだけのリサイズを行うと、
      // 上スクロールの対象要素が完全に表示されてしまうのを防ぐことができた。
      // ※手を尽くしたけど、何故そうなるかはわからなかった…
      //
      if (WINDOW_WIDTH <= 767 && PREV_WINDOW_WIDTH === WINDOW_WIDTH) {
      } else {
        getPaddingAddHeightTarget(v);
      }
    }
    
    // 表示スクロール量がID指定の場合
    if (v.switchTarget) getSwitchScrollAmount(v);
    
    // scrollUp に記述があれば、有効な設定を取得する
    if (v.scrollUp) {
      // スマホサイズで、幅が変わらないリサイズを判定
      if (WINDOW_WIDTH <= 767 && PREV_WINDOW_WIDTH === WINDOW_WIDTH) {
      } else {
        v.index.scrollUp = checkEnabledRange(v.scrollUp);
        
        // 有効ブラウザ幅に一致 かつ 上スクロール判定が有効な場合
        // [-1] の場合は scrollUp は無効となる
        if (v.index.scrollUp !== -1 && v.scrollUp[v.index.scrollUp].enabled) {
          enabledPrevScrollY = true;
          // [changeMargin] の場合
          if (v.scrollUp[v.index.scrollUp].feature === 'changeMargin') setScrollUpParam(v);
        }
      }
    }
    
    if (v.cancel) {
      v.index.cancel = checkEnabledRange(v.cancel);
      
      if (v.index.cancel !== -1 && v.cancel[v.index.cancel].enabled) {
        if (v.cancel[v.index.cancel].feature === 'side') { // [side] の場合
          setCancelSide(v);
        } else { // [main] の場合
          setCancelMain(v);
        }
      }
    }
  };
  
  
  var resetScrollUp = function(v) {
    // 有効幅でない場合に JS 指定の margin を初期化するために必要
    v.id.style.marginTop = '';
    v.id.style.marginBottom = '';
    
    // スクロール方向の判定用として前回のスクロール量と
    // 今回のスクロール量を一致させておく
    PREV_SCROLL_Y = SCROLL_Y;
  };
  
  
  var resetAddHeight = function(v) {
    toggleDisableTransition(v.addHeight.id, 'add');
    removePaddingToTarget(v);
    toggleDisableTransition(v.addHeight.id, 'remove');
  };
  
  
  // ロード・リサイズ時は付与クラスをリセット
  var resetClass = function (v) {
      v.id.classList.remove('is-float_enabled');
      v.id.classList.remove('is-float_floated');
      v.id.classList.remove('is-float_canceled');
  };
  
  
  // リサイズ時に初期化
  // 以前はロード時にも行っていたけど、意味ないので独立させた。
  var resizeCallSummary = function(v) {
    resetClass(v);
    if (v.addHeight) resetAddHeight(v);
    if (v.scrollUp) resetScrollUp(v);
  };
  
  
  var setPrevScrollY = function() {
    PREV_SCROLL_Y = SCROLL_Y;
  };
  
  
  var getScrollY = function() {
    SCROLL_Y = window.pageYOffset || document.documentElement.scrollTop;
  };
  
  
  var getWindowWidth = function() {
    WINDOW_WIDTH = window.innerWidth;
  };
  
  
  var scrollEvent = function() {
    getScrollY();
    
    opt.forEach(function(v) {
      if (v.error) return;
      loadResizeScrollCallSummary(v);
    });
    
    if (enabledPrevScrollY) setPrevScrollY();
  };
  
  
  var resizeEvent = function() {
    var PREV_WINDOW_WIDTH = WINDOW_WIDTH;
    
    // WINDOW_WIDTH の更新
    getWindowWidth();
    getScrollY();
    
    opt.forEach(function(v) {
      if (v.error) return;
      resizeCallSummary(v);
      
      // 幅が変わらないリサイズの場合に端折られる処理
      loadResizeCallSummary(v, PREV_WINDOW_WIDTH);
      
      loadResizeScrollCallSummary(v);
    });
    
    if (enabledPrevScrollY) setPrevScrollY();
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
    getWindowWidth();
    getScrollY();
    // ロード時に値をセットして、以降はイベントごとに上書きする。
    setPrevScrollY();
    
    opt.forEach(function(v) {
      checkOptions(v);
      if (v.error) return;
      toggleDisableTransition(v.id, 'add');
      
      loadResizeCallSummary(v);
      loadResizeScrollCallSummary(v);
      
      toggleDisableTransition(v.id, 'remove');
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
      // 13 ～16
      // Android だと 13 より大きいと、近距離でのスクロールでガクガクする。
      frame = 13,
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
  
  
  // ここまでが変数と関数の宣言
  // ↓ easing 関数を取得してループ開始
  
  // 引数を元にeasing 関数のメソッドを取得して変数に格納する
  easingFunc = getEasingFunc(obj.easingName);
  executeLoop();
};


// --------------------------------------------------------------------------------


// スムーススクロール
var smoothScroll = function(opt){
  // アニメーション中か判定するための配列
  var isAnimated = false,
      floatTopElemDetail = {
        unFloatedCoordinates: [],
        floatedHeight: []
      };
  
  
  var checkIsExistsIdElem = function(val, useTpl, critical, str) {
    var message;
    
    if (document.getElementById(val)) return true;
    if (useTpl) {
      message = 'ID name [' + val + '] specified in [' + str + '] is not defined.';
      if (critical) throw new Error(message);
      console.log(message);
    }
    return false;
  };
  
  
  var checkIsNum = function(val, useTpl, str) {
    // 0以上の整数判定用の変数
    var isNumber = /^([1-9]\d*|0)$/;
    
    // 型が数値 かつ 無限ではない かつ 正の整数
    if (typeof val === 'number' && isFinite(val) && isNumber.test(val)) return true;
    if (useTpl) throw new Error('[' + str + '] must be [Positive integer].');
    return false;
  };
  
  
  var checkIsBool = function(val, useTpl, str) {
    if (typeof val === 'boolean') return true;
    if (useTpl) throw new Error('[' + str + '] must specify [true] or [false].');
    return false;
  };
  
  
  var checkIsEmptyObject = function(obj, str) {
    if (!Object.keys(obj).length)
      throw new Error('[' + str + '] object is empty.');
  };
  
  
  var checkOptions = function() {
    // [easing] は別でチェックするのでここではしない
    
    if (opt.duration) {
      // 数値の 0 も判定できるよう [undefined] と [null] が判定できる方法で処理
      // [!== undefined] は [undefined] だけで汎用的でないので使わない
      if (opt.duration.anchor != null) {
        checkIsNum(opt.duration.anchor, true, 'duration.anchor');
      } else {
        opt.duration.anchor = 1000;
      }
      if (opt.duration.urlHash != null) {
        checkIsNum(opt.duration.urlHash, true, 'duration.urlHash');
      } else {
        opt.duration.urlHash = opt.duration.anchor;
      }
    } else {
      opt.duration = {
        anchor: 1000,
        urlHash: 1000
      };
    }
    
    if (opt.dynamic) {
      // [dynamic.support] が定義されている場合
      if (opt.dynamic.support != null) {
        checkIsBool(opt.dynamic.support, true, 'dynamic.support');
        
        // true の場合
        if (opt.dynamic.support) {
          // 動的要素に対応する際の親要素を取得する(可能な限り狭める)
          if (opt.dynamic.parentId) {
            opt.dynamic.parentId
              = checkIsExistsIdElem(opt.dynamic.parentId, true, false, 'dynamic.parentId')
                ? document.getElementById(opt.dynamic.parentId)
                // 指定した要素が取得できなければ document とする
                : document;
          } else { // dynamic.parentId の指定がない場合
            opt.dynamic.parentId = document;
          }
        }
      } else { // [dynamic.support] が未定義の場合
        opt.dynamic.support = false;
      }
    } else { // [dynamic] が未定義の場合
      opt.dynamic = {
        support:false
      };
    }
    
    
    if (opt.floatTopElem) {
      // 配列でなくても配列にして forEach で一括処理
      if (!Array.isArray(opt.floatTopElem)) {
        opt.floatTopElem = [opt.floatTopElem];
      }
      
      // トップにフロートする要素のIDを取得
      opt.floatTopElem.forEach(function(v) {
        if (!v.id) {
          console.log('Please specify ID name of the float element');
          v.error = true;
          return;
        }
        if (checkIsExistsIdElem(v.id, true, false, 'floatTopElem.id')) {
          v.id = document.getElementById(v.id);
        } else {
          v.error = true;
          return;
        }
        // 指定が無ければ偽(false)として処理が進むけど、一応初期値として入れておく
        if (v.alwaysFloated) {
          checkIsBool(v.alwaysFloated, true, 'alwaysFloated');
        } else {
          v.alwaysFloated = false;
        }
      });
    }
    
    if (opt.floatStatus) {
      opt.floatStatus.floatedClass = opt.floatStatus.floatedClass ? opt.floatStatus.floatedClass : 'is-float_floated';
      opt.floatStatus.enabledClass = opt.floatStatus.enabledClass ? opt.floatStatus.enabledClass : 'is-float_enabled';
    } else {
      opt.floatStatus = {
        floatedClass: 'is-float_floated',
        enabledClass: 'is-float_enabled'
      };
    }
    
    if (opt.addClass) {
      if (!Array.isArray(opt.addClass.id)) {
        opt.addClass.id = [opt.addClass.id];
      }
      opt.addClass.id.forEach(function(v, i, arr) {
        if (checkIsExistsIdElem(v, true, false, 'addClass.id')) {
          arr[i] = document.getElementById(v);
        } else { // 取得できなかった場合
          arr[i] = null;
        }
      });
    } else {
      opt.addClass = false;
    }
    
    if (opt.eventUseCapture != null) {
      checkIsBool(opt.eventUseCapture, true, 'eventUseCapture');
    } else {
      opt.eventUseCapture = false;
    }
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
      if (opt.addClass.id) removeIsAnchorClickedClass();
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
      // ループで呼び出されるメソッド
      animationFunc: scrollToTarget,
      // スクロールとタッチのイベント
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
  
  
  // スクロール先でフロート要素がフロートしているか確認する
  var checkIsFloatedTopAtTheLink = function(alwaysFloated, i, obj) {
        // フロート要素のtopからのスクロール量(絶対座標)
    var floatCoordinates,
        // リンク先のtopからのスクロール量(絶対座標)
        linkCoordinates;
    
    // 常にフロートする要素の場合
    if (alwaysFloated) return true;
    
    // フロート要素の絶対座標を算出
    floatCoordinates = floatTopElemDetail.unFloatedCoordinates[i];
    
    // リンク先の絶対座標を算出
    linkCoordinates = obj.linkOffset - obj.bodyOffset;
    
    // スクロール先でフロート要素がフロートされていない場合は返す
    // フロート要素の座標がリンク先の座標より大きい場合
    if (floatCoordinates > linkCoordinates) return;
    // スクロール先でフロート要素がフロートしている場合
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
      if (!v.id.classList.contains(opt.floatStatus.enabledClass)) return;
      
      // リンク先でトップにフロートする要素がフロートしているかチェック
      // メソッドを実行しつつ真偽値を配列に格納する
      result = checkIsFloatedTopAtTheLink(v.alwaysFloated, i, offsetObj);
      // リンク先でフロートしている場合はフロート時の高さを取得する
      if (result) topMargin += floatTopElemDetail.floatedHeight[i];
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
  
  
  var removeIsAnchorClickedClass = function() {
    opt.addClass.id.forEach(function(v) {
      if (v) v.classList.remove('is-scrolled');
    });
  };
  
  
  var addIsAnchorClickedClass = function() {
    opt.addClass.id.forEach(function(v) {
      // ID を取得できている場合
      if (v) v.classList.add('is-scrolled');
    });
  };
  
  
  // スクロール処理開始の関数
  var startScrollCallSummary = function(e, linkTarget) {
    // スクロールイベントを無効にする関数を呼び出す
    var toggleScrollEvent = getToggleEvent('scroll'),
        toggleTouchEvent = getToggleEvent('touch'),
        offsetObj,
        topMargin = 0,
        targetObj;
    
    toggleScrollEvent.disableScroll();
    toggleTouchEvent.disableTouch();
    // スクロール中を示すクラスを付与するオプションが有効の場合
    if (opt.addClass.id) addIsAnchorClickedClass();
    
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
      
      toggleScrollEvent.enableScroll();
      toggleTouchEvent.enableTouch();
      if (opt.addClass.id) removeIsAnchorClickedClass();
      isAnimated = false;
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
      startScrollCallSummary(e, linkTarget);
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
    } else if (idName === '') { // 【<a href="#"】ダミーリンクの場合
                                // [#] を削ってるので空文字で判定する
      // body要素を取得
      linkTarget = document.body;
      return linkTarget;
    } else { // # が1文字目で名前も付いてるけどリンク先が無い場合
      console.log('ID name [' + idName + '] specified in [anchor] is not defined.');
    }
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
      
      while (anchor.tagName !== 'A' && anchor.tagName !== 'BODY') {
        anchor = anchor.parentNode;
      }
      if (anchor.tagName === 'A') linkTarget = getAnchorLinkTarget(anchor);
      if (!linkTarget) return;
      
      // 引数を1つ渡して返り値として関数を取得する
      // → イベントオブジェクトを引数として取得した関数を実行する
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
      startScrollCallSummary(null, linkTarget);
  };
  
  
  var setEachScroll = function() {
    // ハッシュリンクへのスクロール
    if (location.hash) prepareHashLinkScroll();
    
    // 動的要素に対応するか否かで処理を分ける
    if (opt.dynamic.support) {
      opt.dynamic.parentId.addEventListener('click', prepareDynamicAnchorScroll, {capture: opt.eventUseCapture});
    } else {
      prepareStaticAnchorScroll();
    }
  };
  
  
  var unDoIsFloatedClass = function(v) {
    // クリック時にフロートしていた場合
    if (v.isFloated) return;
    // クリック時にフローとしていなかった場合
    v.id.classList.remove(opt.floatStatus.floatedClass);
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
    
    // 一律に一旦フロートさせる
    v.id.classList.add(opt.floatStatus.floatedClass);
    // フロート時の高さを取得
    floatedHeight = v.id.getBoundingClientRect().height;
    return floatedHeight;
  };
  
  
  var getUnFloatedCoordinates = function(v) {
        // フロート要素のブラウザ座標(相対座標)
    var unFloatedOffset,
        bodyOffset,
        unFloatedHeight,
        unFloatedCoordinates;
    
    // 常時フロートしている要素の場合
    // エラーまたは例外に対して null を格納する…という
    // 仕様の配列にプッシュするので null を返す。
    if (v.alwaysFloated) return null;
    
    // 一律に一旦フロートを解除する
    v.id.classList.remove(opt.floatStatus.floatedClass);
    
    // フロート解除中にブラウザ座標(相対座標)を取得しておく
    unFloatedOffset = v.id.getBoundingClientRect().top;
    bodyOffset = document.body.getBoundingClientRect().top;
    // 対象要素がクリック時にフロートしていた場合のみ、絶対座標算出に
    // 非フロート時の高さが必要となる。
    unFloatedHeight = v.isFloated ? v.id.getBoundingClientRect().height : 0;
    
    unFloatedCoordinates = unFloatedOffset - bodyOffset - unFloatedHeight;
    return unFloatedCoordinates;
  };
  
  
  // トップにフロートする要素がクリック時にフロートしているかチェック
  var checkIsFloatedTopWhenClicked = function(v) {
    // 既にフロートしている場合
    if (v.id.classList.contains(opt.floatStatus.floatedClass)) {
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
        !v.id.classList.contains(opt.floatStatus.enabledClass)
      ) {
        // エラーがある場合は [null] を代入
        // 配列のインデックスで管理するので必須
        floatTopElemDetail.unFloatedCoordinates.push(null);
        floatTopElemDetail.floatedHeight.push(null);
        return;
      }
      // クリック時にフロートしているか判定する
      checkIsFloatedTopWhenClicked(v);
      
      // フロートするクラスを付与させた際に transition があると高さがずれるので
      // 一律に transition を無効にしたうえで高さを取得する
      toggleDisableTransition(v.id, 'add');
      // 非フロート時の相対座標を取得して返り値として配列へプッシュ
      floatTopElemDetail.unFloatedCoordinates.push(getUnFloatedCoordinates(v));
      // フロート時の高さを取得して返り値として配列へプッシュ
      floatTopElemDetail.floatedHeight.push(getIsFloatedTopHeight(v));
      toggleDisableTransition(v.id, 'remove');
      
      // 一律にフロートしているので、クリック時にフロートしていない要素から
      // フロートクラスを外す
      unDoIsFloatedClass(v);
    });
  };
  
  
  var resetObj = function() {
    // floatTopElemDetail は親スコープのオブジェクト
    Object.keys(floatTopElemDetail).forEach(function(prop) {
      floatTopElemDetail[prop] = [];
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

