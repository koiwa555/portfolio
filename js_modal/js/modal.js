'use strict';

var modal = function(opt) {
  var container = document.getElementsByClassName('modal-container'),
      isAnimated,
      floatBtnWrap,
      SCROLLBAR_WIDTH;
  
  
  
  var checkOptionCreateValue = function(v, str) {
    // modalInner の生成のみ [null] が許容されるので、その判定と追加エラー文言の宣言。
    var addText = str === 'create.modalInner' ? '' : ' or [null]. Or do not use this option';
    
    if (v !== 'auto' && v !== 'manual' && v !== null)
      throw new Error('[' + str + '] must specify [\'auto\'] or [\'manual\']' + addText + '.');
  };
  
  
  
  var checkOptionIsBool = function(v, str) {
    if (v !== true && v !== false)
    throw new Error('[' + str + '] must specify [true] or [false].');
  };
  
  
  
  var checkOptionIsNum = function(v, str) {
    var isNumber = /^([1-9]\d*|0)$/;
    // 型が数値ではない または 有限ではない(無限である) または 正の整数ではない(負数)
    if (typeof v !== 'number' || !isFinite(v) || !isNumber.test(v))
      throw new Error('[' + str + '] must specify a number.');
  };
  
  
  
  var checkOptionClassElemExists = function(v, str) {
    var text = ['Class name [', '] specified in [', '] is not defined.'];
    if (document.getElementsByClassName(v)[0]) return true;
    throw new Error(text[0] + v + text[1] + str + text[2]);
  };
  
  
  
  var checkOptions = function() {
    
    if (opt.create) {
      // create.modalInner は必須なので値があるか確認
      if (!opt.create.modalInner)
        throw new Error('[create.modalInner] is a required option. Please specify [\'auto\'] or [\'manual\'].');
      
      if (opt.create.modalInner)
        checkOptionCreateValue(opt.create.modalInner, 'create.modalInner');
      if (opt.create.normalBtn)
        checkOptionCreateValue(opt.create.normalBtn, 'create.normalBtn');
      if (opt.create.floatBtn)
        checkOptionCreateValue(opt.create.floatBtn, 'create.floatBtn');
    }
    
    if (opt.slide) {
      if (opt.slide.use) checkOptionIsBool(opt.slide.use, 'slide.use');
      if (opt.slide.loop) checkOptionIsBool(opt.slide.loop, 'slide.loop');
    }
    
    if (opt.scroll) {
      // scroll.scrollBar のオプションがない場合 または 許容された値以外の場合
      if (
        opt.scroll.scrollBar &&
        opt.scroll.scrollBar !== 'inside' &&
        opt.scroll.scrollBar !== 'outside'
      )
        throw new Error('[scroll.scrollBar] must specify [\'inside\'] or [\'outside\'].');
      
      // scroll.addFunction のオプションがない場合 または 許容された値以外の場合
      if (
        opt.scroll.addFunction &&
        opt.scroll.addFunction !== 'stopBodyScroll' &&
        opt.scroll.addFunction !== 'closeBodyScroll' &&
        opt.scroll.addFunction !== null
      )
        throw new Error('[scroll.addFunction] must specify [\'stopBodyScroll\'] or [\'closeBodyScroll\'] or [null]. Or do not use this option');
    }
    
    if (opt.openBtnClassName)
      checkOptionClassElemExists(opt.openBtnClassName, 'openBtnClassName');
    else opt.openBtnClassName = 'modal-open_btn';
    if (opt.browserVerticalMargin)
      checkOptionIsNum(opt.browserVerticalMargin, 'browserVerticalMargin');
    if (opt.outsideCloseBlockHeight)
      checkOptionIsNum(opt.outsideCloseBlockHeight, 'outsideCloseBlockHeight');
    if (opt.skipCheckExists)
      checkOptionIsBool(opt.skipCheckExists, 'skipCheckExists');
    
    // 組み合わせチェック ----------------------------------------
    
    // スライドボタンの有無チェック
    
    // スライドが有効で、通常・フロートどちらのボタンも生成しない場合
    // [slide.use] が [false] で [slide.loop] が [true] の場合
    if (opt.slide.use && !opt.create.normalBtn && !opt.create.floatBtn)
      throw new Error('[slide.use] is [true] so create a button to switch slides.');
    
    // スライドを使わないけどスライドのループが有効な場合
    // [slide.use] が [false] で [slide.loop] が [true] の場合
    if (!opt.slide.use && opt.slide.loop)
      throw new Error('[slide.use] is [false] so [slide.loop] is not needed.');
    
    // scrollBar に [outside] を選択した場合、addFunction の [closeBodyScroll] を
    // 有効にすることはできません。
    if (
      opt.scroll.scrollBar === 'outside' &&
      opt.scroll.addFunction === 'closeBodyScroll'
    )
    throw new Error('If you select [\'outside\'] as the scrollBar, addFunction cannot select [closeBodyScroll].');
  };
  
  
  
  // 要素の存在チェックは create オプションが無効の場合にのみ実行
  // 手動で要素を生成した場合に実行される
  var checkElementExists = function(target, elemName) {
    Object.keys(target).forEach(function(v) {
      
      // target のIDがあればIDを無ければクラス名を利用する
      var targetName = target[v].id ? '#' + target[v].id : '.modal-container';
      
      elemName.forEach(function(w, j, arr) {
        // 要素が取得できなければエラー
        if(target[v].getElementsByClassName(arr[j]).length === 0)
          throw new Error('[' + arr[j] + '] element is not created in [' + targetName +'].');
      });
    });
  };
  
  
  
  var getExistsElements = function() {
    var elemName = [];
    
    if (opt.create.modalInner === 'manual') {
      elemName.push('modal', 'modal-content_wrap', 'modal-content', 'modal-close_layer');
      // scroll.scrollBar が ['outside'] のときに要素を追加する
      if (opt.scroll.scrollBar === 'outside')
        elemName.push('modal-outside_close_block');
    }
    
    if (opt.create.normalBtn === 'manual')
      elemName.push('modal-btn_wrap', 'modal-close_btn', 'modal-close_btn-text');
    if (opt.create.floatBtn === 'manual')
      elemName.push('modal-float-btn_wrap', 'modal-float-close_btn', 'modal-float-close_btn-text');
    
    checkElementExists(container, elemName);
  };
  
  
  
  var getSlideContainer = function() {
    var slideContainer = [];
    Object.keys(container).forEach(function(v) {
      // [data-modal-group] 属性がない場合ことスライドに対応していない場合は返す
      if (!container[v].getAttribute('data-modal-group')) return;
      slideContainer.push(container[v]);
    });
    return slideContainer;
  };
  
  
  
  var getExistsSlideBtnElements = function() {
    var slideContainer = getSlideContainer(),
        elemName = [];
    
    if (opt.create.normalBtn === 'manual')
      elemName.push('modal-prev_btn', 'modal-next_btn');
    if (opt.create.floatBtn === 'manual')
      elemName.push('modal-float-prev_btn', 'modal-float-next_btn');
    
    checkElementExists(slideContainer, elemName);
  };
  
  
  
  // 要素を生成する
  var createElem = function(elemDetail) {
    var elem = {};
    
    Object.keys(elemDetail).forEach(function(element) {
      elem[element] = document.createElement(elemDetail[element].tagName);
      if (!elemDetail[element].attr) return;
      
      // 属性が存在する場合
      Object.keys(elemDetail[element].attr).forEach(function(prop) {
        elem[element].setAttribute(prop, elemDetail[element].attr[prop]);
      });
    });
    return elem;
  };
  
  
  
  var setModalInner = function() {
    var content = document.getElementsByClassName('modal-content'),
        // オーバーレイを生成
        overlay = document.createElement('div');
    
    overlay.setAttribute('id', 'modalOverlay');
    overlay.setAttribute('class', 'modal-overlay');
    
    // IE対策用に [index] の引数が必要！
    // [Object.keys().forEach] の [v] で代用できない箇所で [i] を用いる
    Object.keys(container).forEach(function(v, i) {
      
      var elemDetail = {
        modal: {
          tagName: 'div',
          attr: {
            class: 'modal',
          }
        },
        contentWrap: {
          tagName: 'div',
          attr: {
            class: 'modal-content_wrap',
          }
        },
        closeLayer: {
          tagName: 'div',
          attr: {
            class: 'modal-close_layer',
          }
        }
      },
      elem;
      
      // モーダルのスクロール方法が [outside] の場合は専用の要素を追加生成
      if (opt.scroll.scrollBar === 'outside') {
        elemDetail.outsideCloseBlock = {
          tagName: 'div',
          attr: {
            class: 'modal-outside_close_block',
          }
        };
      }
      
      elem = createElem(elemDetail);
      
      container[v].appendChild(elem.modal);
      elem.modal.appendChild(elem.contentWrap);
      elem.modal.appendChild(elem.closeLayer);
      elem.contentWrap.appendChild(content[i]);
      document.body.appendChild(overlay);
      
      // モーダルのスクロール方法が [outside] でない場合は返す
      if (!elem.outsideCloseBlock) return;
      elem.contentWrap.appendChild(elem.outsideCloseBlock);
    });
  };
  
  
  
  var setNormalBtn = function() {
    var contentWrap = document.getElementsByClassName('modal-content_wrap');
    
    Object.keys(contentWrap).forEach(function(v, i) {
      
      var elemDetail = {
        btnWrap: {
          tagName: 'div',
          attr: {
            class: 'modal-btn_wrap',
          }
        },
        closeBtn: {
          tagName: 'button',
          attr: {
            class: 'modal-close_btn',
            type: 'button'
          }
        },
        closeBtnText: {
          tagName: 'span',
          attr: {
            class: 'modal-close_btn-text',
          }
        },
      },
      closeText = document.createTextNode('閉じる'),
      elem;
      
      // オプションでスライドが有効で [data-modal-group] 属性が設定されている場合は
      // スライドの左右ボタンを作成する
      if (opt.slide.use && container[i].getAttribute('data-modal-group')) {
        elemDetail.prevBtn = {
          tagName:'button',
          attr: {
            class: 'modal-prev_btn',
            type: 'button'
          }
        };
        elemDetail.nextBtn = {
          tagName:'button',
          attr: {
            class: 'modal-next_btn',
            type: 'button'
          }
        };
      }
      
      elem = createElem(elemDetail);
      
      contentWrap[v].appendChild(elem.btnWrap);
      
      // 手前の要素から順に追加していく
      if (elemDetail.prevBtn) elem.btnWrap.appendChild(elem.prevBtn);
      elem.btnWrap.appendChild(elem.closeBtn).appendChild(elem.closeBtnText).appendChild(closeText);
      if (elemDetail.nextBtn) elem.btnWrap.appendChild(elem.nextBtn);
    });
  };
  
  
  
  var setFloatBtn = function() {
    var content = document.getElementsByClassName('modal-content');
    
    Object.keys(content).forEach(function(v, i) {
      var elemDetail = {
        btnWrap: {
          tagName: 'div',
          attr: {
            class: 'modal-float-btn_wrap',
          }
        },
        closeBtn: {
          tagName: 'button',
          attr: {
            class: 'modal-float-close_btn',
            type: 'button'
          }
        },
        closeBtnText: {
          tagName: 'span',
          attr: {
            class: 'modal-float-close_btn-text',
          }
        },
      },
      closeText = document.createTextNode('閉じる'),
      elem;
      
      if (opt.slide.use && container[i].getAttribute('data-modal-group')) {
        elemDetail.prevBtn = {
          tagName: 'button',
          attr: {
            class: 'modal-float-prev_btn',
            type: 'button'
          }
        };
        elemDetail.nextBtn = {
          tagName: 'button',
          attr: {
            class: 'modal-float-next_btn',
            type: 'button'
          }
        };
      }
      
      elem = createElem(elemDetail);
      
      content[v].appendChild(elem.btnWrap);
      if (elemDetail.prevBtn) elem.btnWrap.appendChild(elem.prevBtn);
      elem.btnWrap.appendChild(elem.closeBtn).appendChild(elem.closeBtnText).appendChild(closeText);
      if (elemDetail.nextBtn) elem.btnWrap.appendChild(elem.nextBtn);
    });
  };
  
  
  
  // 通常ボタンが設置される状態 ['auto'] ['manual'] の限定のクラスを付与する
  var addInsideScrollBarDedicatedClass = function() {
    Object.keys(container).forEach(function(v) {
      container[v].classList.add('has-modal_normal_btn');
    });
  };
  
  
  
  // モーダルのスクロール方法が ['inside'] またはボディのスクロールを停止する場合
  // スクロールバーの幅を取得する
  var getScrollBarWidth = function() {
    var WINDOW_WIDTH = window.innerWidth,
        BODY_WIDTH = document.body.clientWidth;
    
    // 親スコープの変数に代入なので var 宣言は不要
    SCROLLBAR_WIDTH = WINDOW_WIDTH - BODY_WIDTH;
  };
  
  
  
  // モーダルのスクロール方法が ['inside'] でフロートボタンがある場合は
  // [modal-float-btn_wrap] を取得しておく
  // スクロールバー分フロートボタンをずらすために必要
  var getFloatBtnWrap = function() {
    // 親スコープの変数に代入なので var 宣言は不要
    floatBtnWrap = document.getElementsByClassName('modal-float-btn_wrap');
  };
  
  
  
  // スクロール対象のモーダルを、スライドボタンで切り替えるときに、
  // コンテンツの一番上までスクロールさせる
  var scrollTopSlideContent = function(target) {
    var scrollElem,
        scrollAmount;
    
    // モーダルのスクロール方法が未設定または [inside] の場合
    // スクロールバーが設置される要素を取得する
    if (!opt.scroll.scrollBar || opt.scroll.scrollBar === 'inside')
      scrollElem = target.getElementsByClassName('modal-content');
    // [outside] の場合
    else scrollElem = target.getElementsByClassName('modal');
    
    // スクロールバーが表示されるエレメント内のスクロール量を取得する
    scrollAmount = scrollElem[0].scrollTop;
    // スクロール量が0の場合は返す
    if (!scrollAmount) return;
    scrollElem[0].scrollTop = -scrollAmount;
  };
  
  
  
  // ロード・リサイズ時に各モーダルコンテンツの高さを取得して
  // 予めブラウザの高さよりも高いモーダルコンテンツに対してクラスを付与しておく。
  var setCompareHeightClass = function() {
    var browserHeight = window.innerHeight,
        // ブラウザの上下の余白
        browserVerticalMargin = opt.browserVerticalMargin ? opt.browserVerticalMargin : 120,
        // is-modal_outside_scroll クラスが付与されたときの
        // 下端の閉じる領域の高さ
        outSideCloseBlockHeight = opt.outSideCloseBlockHeight ? opt.outSideCloseBlockHeight : 60,
        contentWrap,
        contentHeight,
        modalScroll;
    
    Object.keys(container).forEach(function(v, i) {
      modalScroll = container[v].getAttribute('data-modal-scroll');
      
      // モーダルを常に開いておくカスタムデータ属性を持っていて
      // 各種クラスを既に持っていれば返す(リサイズ時の対応)
      if (
        modalScroll === 'always' &&
        (container[v].classList.contains('is-modal_inside_scroll') ||
        container[v].classList.contains('is-modal_outside_scroll'))
      ) return;
      
      // クラスを一律に外す
      container[v].classList.remove('is-modal_inside_scroll');
      container[v].classList.remove('is-modal_outside_scroll');
      
      // モーダルを常に開いておくカスタムデータ属性を持っていれば
      // ここの処理を飛ばす
      if (modalScroll !== 'always') {
        contentWrap = container[v].getElementsByClassName('modal-content_wrap');
        contentHeight = contentWrap[0].clientHeight;
        
        // [outsideScroll] の場合
        // 下端の閉じる領域の高さを差し引く
        if (opt.scroll.scrollBar === 'outside')
          contentHeight = contentHeight - outSideCloseBlockHeight;
        
        // モーダルの高さがブラウザの高さより低い場合
        if (contentHeight < browserHeight - browserVerticalMargin) {
          if (!opt.create.floatBtn || opt.scroll.scrollBar === 'outside') return;
          // スタイル指定時と違って解除時は [insideScroll] でも
          // [outsideScroll] でもまとめて外す…としてしまって良い…よね…多分
          floatBtnWrap[i].style.width = '';
          return;
        }
      }
      
      // insideScroll の場合
      // スクロール方法の指定がない場合 または insideScroll を選択した場合
      if (!opt.scroll.scrollBar || opt.scroll.scrollBar === 'inside') {
        container[v].classList.add('is-modal_inside_scroll');
        
        // フロートボタンがない 場合は返す
        if (!opt.create.floatBtn) return;
        // 値が [undefined] または [0] (バグ?) なら返す
        if (!SCROLLBAR_WIDTH) return;
        
        floatBtnWrap[i].style.width = 'calc(100% - ' + SCROLLBAR_WIDTH + 'px)';
        return;
      }
      // outsideScroll の場合
      container[v].classList.add('is-modal_outside_scroll');
    });
  };
  
  
  
  // モーダルを開いた状態でリサイズした場合は
  // transition を無効にするクラスを付与する
  //
  // prepareCompareHeight は全てのモーダルに対して高さを取得する処理だけど
  // こちらのメソッドは開いているモーダルにのみクラスを付与する作り。
  //
  var toggleIsOpenResizedClass = function(target, slide, str) {
    target = !slide ? [target] : slide.group;
    
    Object.keys(target).forEach(function(v) {
      target[v].classList.remove('is-open-resized');
      // remove はここまで
      if (str === 'remove') return;
      
      // add の場合
      if (target[v].classList.contains('is-modal_opened'))
        target[v].classList.add('is-open-resized');
    });
  };
  
  
  
  var resizingEvent = function(self) {
    return function() {
      // リサイズ時にモーダルの高さを取得しなおす
      if (self.callFunctionName === 'setCompareHeightClass') {
        setCompareHeightClass();
        return;
      }
      // モーダルを開いたままリサイズされたときにクラスを付与する
      toggleIsOpenResizedClass(self.target, self.slide, 'add');
    };
  };
  
  
  
  var thinOutResizingEvent = function() {
    var self = this;
    
    clearTimeout(self.timeoutId);
    self.timeoutId = setTimeout(resizingEvent(self), 500);
  };
  
  
  
  // 設置したままにするリサイズイベント
  var setPermanentResizeEvent = function() {
    var alwaysResizeHandle = {
      timeoutId: null,
      callFunctionName: 'setCompareHeightClass',
      handleEvent: thinOutResizingEvent
    };
    window.addEventListener('resize', alwaysResizeHandle);
  };
  
  
  
  // リサイズイベントの付け外し
  var toggleResizeEvent = function(obj, str) {
    if (str === 'add') {
      window.addEventListener('resize', obj);
      return;
    }
    window.removeEventListener('resize', obj);
  };
  
  
  
  // スライドを切り替える際の transition を無効にするクラスの付け外し
  var toggleModalSlideClass = function(slide, str) {
    slide.group.forEach(function(v) {
      // add の場合
      if (str === 'add') {
        v.classList.add('is-modal_slid');
        return;
      }
      // remove の場合
      v.classList.remove('is-modal_slid');
    });
  };
  
  
  
  // スライドが最初または最後のときに左または右ボタンを押せないようにする
  var addSlideBtnUnClickableClass = function(slide, currentSlideBtn) {
    // インデックス番号が 0 なら左矢印をクリックできないようにする
    if (slide.num.current === 0) {
      Object.keys(currentSlideBtn.prev).forEach(function(v) {
        // HTMLCollection が空なら返す
        if (currentSlideBtn.prev[v].length === 0) return;
        currentSlideBtn.prev[v][0].classList.add('is-modal-btn_un_clickable');
      });
    }
    // インデックス番号が最後の番号なら右矢印をクリックできないようにする
    if (slide.num.current === slide.num.last) {
      Object.keys(currentSlideBtn.next).forEach(function(v) {
        if (currentSlideBtn.next[v].length === 0) return;
        currentSlideBtn.next[v][0].classList.add('is-modal-btn_un_clickable');
      });
    }
  };
  
  
  
  // モーダルを開いたときと、スライドの左右ボタンをクリックした後の状態を
  // チェックして表示を変更するためのメソッド
  var updateSlideBtnDisplay = function(slide) {
    var target = slide.group[slide.num.current];
    
    // モーダルの高さがブラウザの高さよりも高い状態を示すクラスを持っている場合
    // コンテンツの一番上までスクロールするメソッドを呼び出す
    if (
      target.classList.contains('is-modal_inside_scroll') ||
      target.classList.contains('is-modal_outside_scroll')
    ) scrollTopSlideContent(target);
    
    // 前回のインデックス番号が存在すれば、そのインデックス番号のモーダルを閉じる
    if (slide.num.before !== '')
      slide.group[slide.num.before].classList.remove('is-modal_opened');
    
    // 現在のインデックス番号のモーダルを開く
    target.classList.add('is-modal_opened');
  };
  
  
  
  var getCurrentSlideBtnObj = function(slide) {
    var currentSlideBtn = {
          prev: [],
          next: []
        },
        // 現在開いているモーダル
        target = slide.group[slide.num.current];
    
    // 左右の通常ボタン・フロートボタンをそれぞれまとめて取得する
    // ボタンがなくても空の HTMLCollection が変えるので、それでおｋ
    currentSlideBtn.prev.push(target.getElementsByClassName('modal-prev_btn'));
    currentSlideBtn.prev.push(target.getElementsByClassName('modal-float-prev_btn'));
    currentSlideBtn.next.push(target.getElementsByClassName('modal-next_btn'));
    currentSlideBtn.next.push(target.getElementsByClassName('modal-float-next_btn'));
    return currentSlideBtn;
  };
  
  
  
  // 非ループでスライドのインデックス番号を調整する
  var adjustSlideNumNotLoop = function(slideNum, btnDirection) {
    // 左ボタンの場合
    if (btnDirection === 'prev') {
      // ループが無効の場合
      // インデックス番号の下限に制限を掛ける
      slideNum.current = slideNum.current < 0 ? 0 : slideNum.current;
      return;
    }
    // 右ボタンの場合
    // インデックス番号の上限に制限を掛ける
    slideNum.current = slideNum.current > slideNum.last ? slideNum.last : slideNum.current;
  };
  
  
  
  // ループでスライドのインデックス番号の最初と最後を繋ぐ
  var adjustSlideNumLoop = function(slideNum, btnDirection) {
    // 左ボタンの場合
    if (btnDirection === 'prev') {
      // 現在のインデックス番号が 0 未満の場合
      if (slideNum.current < 0) slideNum.current = slideNum.last;
      return;
    }
    // 左ボタンの場合
    // 現在のインデックス番号が最後のインデックス番号の場合
    if (slideNum.current > slideNum.last) slideNum.current = 0;
  };
  
  
  
  // スライドのインデックス番号を更新する
  var updateSlideNumState = function(e, slideNum) {
    var btnDirection;
    
    // 直前に開いていたモーダルのインデックス番号を保持しておく
    slideNum.before = slideNum.current;
    
    // 左ボタンの場合
    if (
      e.currentTarget.classList.contains('modal-prev_btn') ||
      e.currentTarget.classList.contains('modal-float-prev_btn')
    ) {
      btnDirection = 'prev';
      slideNum.current--;
    }
    // 右ボタンの場合
    else {
      btnDirection = 'next';
      slideNum.current++;
    }
    return btnDirection;
  };
  
  
  
  // スライドボタンのクリックを起点としたメソッド呼び出し
  var clickSlideBtnCallSummary = function(e) {
    var btnDirection,
        currentSlideBtn;
    
    // スライドのインデックス番号を更新する
    btnDirection = updateSlideNumState(e, this.slide.num);
    
    // ループが無効の場合
    if (!opt.slide.loop) adjustSlideNumNotLoop(this.slide.num, btnDirection);
    // ループの場合
    else adjustSlideNumLoop(this.slide.num, btnDirection);
    
    currentSlideBtn = getCurrentSlideBtnObj(this.slide);
    
    // スライドボタンでスライドを切り替えた場合
    // transition を無効にするクラスを付与するメソッドを呼び出す
    if (!this.slide.group[0].classList.contains('is-modal_slid'))
      toggleModalSlideClass(this.slide, 'add');
    
    // [ボタン] 経由での状態チェックのメソッド呼び出し
    updateSlideBtnDisplay(this.slide);
    
    if(!opt.slide.loop) addSlideBtnUnClickableClass(this.slide, currentSlideBtn);
    
    e.stopPropagation();
  };
  
  
  
  // 左右ボタンのイベント付け外し
  var toggleSlideBtnClickEvent = function(obj, str) {
    Object.keys(obj.slide.prevBtn).forEach(function(prop) {
      obj.slide.prevBtn[prop].forEach(function(v, i) {
        
        // ボタンが取得できなかった場合は返す
        if (obj.slide.prevBtn[prop][i].length === 0) return;
        
        // add の場合
        if (str === 'add') {
          // 渡したい引数が1つだけなので無名オブジェクト形式で記述
          obj.slide.prevBtn[prop][i][0].addEventListener('click', obj);
          obj.slide.nextBtn[prop][i][0].addEventListener('click', obj);
          return;
        }
        // remove の場合
        obj.slide.prevBtn[prop][i][0].removeEventListener('click', obj);
        obj.slide.nextBtn[prop][i][0].removeEventListener('click', obj);
        
      });
    });
    
  };
  
  
  
  // スライドの左ボタンを取得
  var getSlidePrevBtn = function(slide) {
    // 通常・フロート両方の左ボタンを取得する
    var prevBtn = {
      normal: [],
      float: []
    };
    slide.group.forEach(function(v) {
      prevBtn.normal.push(v.getElementsByClassName('modal-prev_btn'));
      prevBtn.float.push(v.getElementsByClassName('modal-float-prev_btn'));
    });
    
    // slide オブジェクトに取得した左ボタンを追加する
    slide.prevBtn = prevBtn;
  };
  
  
  
  // スライドの右ボタンを取得
  var getSlideNextBtn = function(slide) {
    var nextBtn = {
      normal: [],
      float: []
    };
    slide.group.forEach(function(v) {
      nextBtn.normal.push(v.getElementsByClassName('modal-next_btn'));
      nextBtn.float.push(v.getElementsByClassName('modal-float-next_btn'));
    });
    slide.nextBtn = nextBtn;
  };
  
  
  
  // スライド対応のモーダルであれば、グループをまとめて取得する
  var getSlideObj = function(target) {
    // 現在開いているスライドのID名とグループ名を取得する
    var target = {
          idName: target.id,
          groupName: target.getAttribute('data-modal-group')
        },
        slide = {
          // スライドのグループを格納する
          group: [],
          // スライドの各種インデックス番号を保持する
          num: {
            current: '',
            before: '',
            last: ''
          }
        };
    
    // 同じグループのモーダルを取得する
    Object.keys(container).forEach(function(v) {
      // 開いたモーダルの[data-modal-group] の値と比較対象の値が異なれば返す
      if (container[v].getAttribute('data-modal-group')
        !== target.groupName) return;
      
      slide.group.push(container[v]);
    });
    
    // スライドの最後のインデックス番号を取得する
    slide.num.last = slide.group.length - 1;
    
    // クリックで開かれた現在のモーダルがスライドのグループ内で何番目か取得する
    slide.group.forEach(function(v, i) {
      // 対象のID名と比較のID名が一致しなければ返す
      if (v.id !== target.idName) return;
      slide.num.current = i;
    });
    return slide;
  };
  
  
  
  // モーダル表示時の body のスクロールを停止する
  var toggleStopBodyScrollClass = function(isAnimated) {
    // オープン時の処理
    if (isAnimated) {
      // スクロールバーの幅の分だけ body に padding として付け足す
      document.body.style.padding = '0 ' + SCROLLBAR_WIDTH + 'px 0 0';
      
      // html にクラスを付与
      document.documentElement.classList.add('is-modal_opened');
      // body にクラスを付与
      document.body.classList.add('is-modal_opened');
      return;
    }
    
    // クローズ時の処理
    document.body.style.padding = '';
    document.documentElement.classList.remove('is-modal_opened');
    document.body.classList.remove('is-modal_opened');
  };
  
  
  
  // 閉じるボタンをクリックしたときのイベント
  // handleEvent
  var clickCloseBtn = function(e) {
    var overlay = document.getElementById('modalOverlay'),
        target = !this.slide ? this.target : this.slide.group[this.slide.num.current];
    
    // モーダルを開いたままリサイズしたとき用のクラスを外す
    toggleIsOpenResizedClass(this.target, this.slide, 'remove');
    
    toggleResizeEvent(this.resizeHandle, 'remove');
    
    // スライドの場合
    if (this.slide) {
      // is-modal_opened を外す前に呼び出す必要あり！
      toggleModalSlideClass(this.slide, 'remove');
      // スライドボタンのイベントを外す
      toggleSlideBtnClickEvent(this.slideBtnHandle , 'remove');
    }
    
    overlay.classList.remove('is-modal_opened');
    target.classList.remove('is-modal_opened');
    
    // モーダルが動作中か確認するフラグ
    isAnimated = false;
    
    // フラグを引数として body のスクロールを停止するメソッドを呼ぶ
    if (opt.scroll.addFunction === 'stopBodyScroll')
      toggleStopBodyScrollClass(isAnimated);
    
    // 各種閉じるボタンのイベントを外す
    toggleCloseBtnClickEvent(this, 'remove');
    
    e.stopPropagation();
  };
  
  
  
  // 各種閉じるボタンにイベントを設定する
  var toggleCloseBtnClickEvent = function(obj, str) {
    
    Object.keys(obj.closeElem).forEach(function (prop) {
      // 閉じるボタンが生成されていない場合は中の配列を回す前に返す
      if (obj.closeElem[prop][0].length === 0) return;
      
      Object.keys(obj.closeElem[prop]).forEach(function(v) {
        // add の場合
        if (str === 'add') {
          obj.closeElem[prop][v][0].addEventListener('click', obj);
          return;
        }
        // remove の場合
        obj.closeElem[prop][v][0].removeEventListener('click', obj);
      });
    });
    
    // body のスクロールでモーダルを閉じる場合(insideScroll 限定)
    // オプションが無効なら返す
    if (opt.scroll.addFunction !== 'closeBodyScroll') return;
    if (str === 'add') {
      window.addEventListener('scroll', obj);
      return;
    }
    window.removeEventListener('scroll', obj);
  };
  
  
  
  // 各種閉じるボタンを取得する
  var getCloseBtn = function(target, slide) {
    
    // モーダルを閉じる要素をまとめて取得する
    var closeElem = {
          closeLayer: [],
          closeBtn: [],
          floatCloseBtn: []
        },
        // target に対して通常のモーダル、またはスライド対応のモーダルをグループごと格納する
        // 通常のモーダルは1つのみだが配列で囲って配列として格納する
        target = !slide ? [target] : slide.group;
    
    
    // モーダルのスクロール方法が [outside] の場合
    if (opt.scroll.scrollBar === 'outside') {
      closeElem.outsideCloseBlock = [];
      
      // [outside] の場合に必ず存在する要素がなければエラーを吐く(手動生成へのアナウンス)
      if (target[0].getElementsByClassName('modal-outside_close_block').length === 0)
        // ['modal-content'] の後に ['modal-outside_close_block'] を作成してください
        throw new Error('please create [\'modal-outside_close_block\'] after [\'modal-content\'].');
    }
    
    // 閉じる系のボタンを全て取得する(オーバーレイ以外)
    Object.keys(target).forEach(function(v) {
      
      closeElem.closeLayer.push(target[v].getElementsByClassName('modal-close_layer'));
      closeElem.closeBtn.push(target[v].getElementsByClassName('modal-close_btn'));
      closeElem.floatCloseBtn.push(target[v].getElementsByClassName('modal-float-close_btn'));
      
      // モーダルのスクロール方法が未設定または [inside] の場合は返す
      if (!opt.scroll.scrollBar || opt.scroll.scrollBar === 'inside') return;
      
      // モーダルのスクロール方法が [outside] の場合は専用の閉じるブロックの取得
      closeElem.outsideCloseBlock.push(target[v].getElementsByClassName('modal-outside_close_block'));
    });
    return closeElem;
  };
  
  
  
  var clickModalOpenCallSummary = function(target) {
    var slide,
        currentSlideBtn,
        slideBtnHandle  = {
          handleEvent: clickSlideBtnCallSummary
        },
        resizeHandle = {
          target: target,
          timeoutId: null,
          callFunctionName: 'toggleIsOpenResizedClass',
          handleEvent: thinOutResizingEvent,
        },
        closeBtnHandle = {
          target: target,
          handleEvent: clickCloseBtn
        };
    
    // スライドの対象の場合
    // スライドを利用する また 開いているモーダルに [data-modal-group] 属性がついている場合
    if (opt.slide.use && target.getAttribute('data-modal-group')) {
      
      slide = getSlideObj(target);
      
      // モーダルを開いた段階で一度スライドボタンの状態をチェックしておく
      currentSlideBtn = getCurrentSlideBtnObj(slide);
      updateSlideBtnDisplay(slide);
      
      // スライドのループが有効でない場合
      if (!opt.slide.loop) addSlideBtnUnClickableClass(slide, currentSlideBtn);
      
      getSlidePrevBtn(slide);
      getSlideNextBtn(slide);
      
      slideBtnHandle.slide = slide;
      toggleSlideBtnClickEvent(slideBtnHandle , 'add');
      
    // 閉じるボタンのイベント内で該当イベントを解除するため closeBtnHandle に
    // それぞれの handleEvent オブジェクトを格納する
      closeBtnHandle.slideBtnHandle  = slideBtnHandle ;
    }
    
    // ここから↓はスライド有無に関わらず共用のメソッド ----- //
    
    resizeHandle.slide = slide;
    // リサイズイベントを呼び出し現在のモーダルを引数として渡す
    toggleResizeEvent(resizeHandle, 'add');
    
    // 取得した返り値をオブジェクトに追加する
    closeBtnHandle.slide = slide;
    closeBtnHandle.closeElem = getCloseBtn(target, slide);
    
    // handleEvent オブジェクトを親ハンドルに格納する
    closeBtnHandle.resizeHandle = resizeHandle;
    
    toggleCloseBtnClickEvent(closeBtnHandle, 'add');
  };
  
  
  
  var clickModalOpen = function(e) {
    var target = e.currentTarget.getAttribute('data-modal-id'),
        overlay = document.getElementById('modalOverlay');
    
    if (isAnimated) return;
    isAnimated = true;
    
    // アニメーション中か判定するフラグを引数として body のスクロールを停止するメソッドを呼ぶ
    if (opt.scroll.addFunction === 'stopBodyScroll')
      toggleStopBodyScrollClass(isAnimated);
    
    overlay.classList.add('is-modal_opened');
    
    // 対象のモーダルを表示する
    target = document.getElementById(target);
    target.classList.add('is-modal_opened');
    
    // モーダルを開いた後の処理をまとめたメソッドを呼び出す
    clickModalOpenCallSummary(target);
    
    e.stopPropagation();
  };
  
  
  
  var setModalOpenPermanentClickEvent = function() {
    // [モーダルを開く] ボタンの要素を取得
    var openBtn = document.getElementsByClassName(opt.openBtnClassName);
    
    Object.keys(openBtn).forEach(function(v) {
      openBtn[v].addEventListener('click', clickModalOpen);
    });
  };
  
  
  
  var loadEventCallSummary = function() {
    checkOptions();
    
    // 存在チェック
    if (
      !opt.skipCheckExists &&
      (opt.create.modalInner === 'manual' ||
      opt.create.normalBtn === 'manual' ||
      opt.create.floatBtn === 'manual')
    ) getExistsElements();
    
    // スライド対応モーダルのスライドボタンの存在チェック
    if (
      !opt.skipCheckExists &&
      opt.slide.use &&
      (opt.create.normalBtn === 'manual' ||
      opt.create.floatBtn === 'manual')
    ) getExistsSlideBtnElements();
    
    // 要素生成
    if (opt.create.modalInner === 'auto') setModalInner();
    if (opt.create.normalBtn === 'auto') setNormalBtn();
    if (opt.create.floatBtn === 'auto') setFloatBtn();
    
    // 通常ボタンが設置される状態 ['auto'] ['manual'] の限定のクラスを付与する
    if (opt.create.normalBtn) addInsideScrollBarDedicatedClass();
    // スクロールバーの幅を取得する
    if (
      (!opt.scroll.scrollBar ||
      opt.scroll.scrollBar === 'inside') &&
      opt.scroll.addFunction === 'stopBodyScroll'
    ) getScrollBarWidth();
    
    // フロートボタン要素を取得
    if (
      opt.create.floatBtn &&
      (!opt.scroll.scrollBar ||
      opt.scroll.scrollBar === 'inside')
    ) getFloatBtnWrap();
    
    // モーダルの高さを取得してブラウザの高さと比較する
    setCompareHeightClass();
    // 常設のリサイズイベント
    setPermanentResizeEvent();
    // 常設のモーダルを開くボタンのクリックイベント
    setModalOpenPermanentClickEvent();
  };
  
  
  
  window.addEventListener('load', loadEventCallSummary);
  
  
  
  
  /* --------------------------------------------------------------------------------
  プレビュー用スクリプト
  -------------------------------------------------------------------------------- */
  // オプション変更後に不要要素を削除する
  var removeUnnecessaryElements = function() {
    var container = document.getElementsByClassName('modal-container'),
        modal,
        content,
        btnWrap,
        floatBtnWrap;
    
    Object.keys(container).forEach(function(v) {
      modal = container[v].getElementsByClassName('modal');
      content = container[v].getElementsByClassName('modal-content');
      btnWrap = container[v].getElementsByClassName('modal-btn_wrap');
      floatBtnWrap = container[v].getElementsByClassName('modal-float-btn_wrap');
      container[v].classList.remove('is-modal_inside_scroll');
      container[v].classList.remove('is-modal_outside_scroll');
      container[v].classList.remove('has-modal_normal_btn');
      
      // [modal-content] [modal] の外に逃がす
      container[v].appendChild(content[0]);
      
      // ここから下は不要要素の削除
      
      modal[0].parentNode.removeChild(modal[0]);
      
      // ボタンが存在すれば削除
      if (btnWrap.length !== 0) btnWrap[0].parentNode.removeChild(btnWrap[0]);
      if (floatBtnWrap.length !== 0)
        floatBtnWrap[0].parentNode.removeChild(floatBtnWrap[0]);
    });
  };
  
  
  
  var checkSelectOptions = function(e) {
    var createNormalBtnElem = document.getElementById('createNormalBtn'),
        createNormalBtnNote = document.getElementById('createNormalBtnNote'),
        createFloatBtnElem = document.getElementById('createFloatBtn'),
        createFloatBtnNote = document.getElementById('createFloatBtnNote'),
        addFunctionElem = document.getElementById('addFunction'),
        addFunctionNote =document.getElementById('addFunctionNote');
    
    createNormalBtnElem.options[2].disabled = false;
    createNormalBtnElem.options[2].classList.remove('is-forced_changed');
    createNormalBtnNote.classList.remove('is-showed-block');
    createFloatBtnElem.options[2].disabled = false;
    createFloatBtnElem.options[2].classList.remove('is-forced_changed');
    createFloatBtnNote.classList.remove('is-showed-block');
    addFunctionElem.options[2].disabled = false;
    addFunctionElem.options[2].classList.remove('is-forced_changed');
    addFunctionNote.classList.remove('is-showed-block');
    
    if (!opt.create.normalBtn) {
      createFloatBtnElem.options[2].disabled = true;
      createFloatBtnElem.options[2].classList.add('is-forced_changed');
      createFloatBtnNote.classList.add('is-showed-block');
    }
    if (!opt.create.floatBtn) {
      createNormalBtnElem.options[2].disabled = true;
      createNormalBtnElem.options[2].classList.add('is-forced_changed');
      createNormalBtnNote.classList.add('is-showed-block');
    }
    
    // [scrollBar] のセレクタを変更して [outside] を選び
    // かつ [addFunction] の値が [closeBodyScroll] だった場合
    if (
      e.currentTarget.id === 'scrollBar' &&
      opt.scroll.scrollBar === 'outside' &&
      opt.scroll.addFunction === 'closeBodyScroll'
    ) {
      addFunctionElem.selectedIndex = 0;
      opt.scroll.addFunction = null;
    }
    // scroll.scrollBar が [outside] の場合
    if (opt.scroll.scrollBar === 'outside') {
      addFunctionElem.options[2].disabled = true;
      addFunctionElem.options[2].classList.add('is-forced_changed');
      addFunctionNote.classList.add('is-showed-block');
    }
  };
  
  
  
  var updateOptions = function(e) {
    var value = e.currentTarget.value;
    
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (value === '') value = null;
    
    switch (e.currentTarget.name) {
    case 'create-modal-inner':
      opt.create.modalInner = value;
      break;
    case 'create-normal-btn':
      opt.create.normalBtn = value;
      break;
    case 'create-float-btn':
      opt.create.floatBtn = value;
      break;
    case 'slide-use':
      opt.slide.use = value;
      break;
    case 'slide-loop':
      opt.slide.loop = value;
      break;
    case 'scroll-bar':
      opt.scroll.scrollBar = value;
      break;
    case 'add-function':
      opt.scroll.addFunction = value;
      break;
    default:
      break;
    }
  };
  
  
  
  var changeOptionsSelect = function(e) {
    updateOptions(e);
    checkSelectOptions(e);
    removeUnnecessaryElements();
    
    checkOptions();
    
    // 存在チェック
    if (
      !opt.skipCheckExists &&
      (opt.create.modalInner === 'manual' ||
      opt.create.normalBtn === 'manual' ||
      opt.create.floatBtn === 'manual')
    ) getExistsElements();
    // スライド対応モーダルのスライドボタンの存在チェック
    if (
      !opt.skipCheckExists &&
      opt.slide.use &&
      (opt.create.normalBtn === 'manual' ||
      opt.create.floatBtn === 'manual')
    ) getExistsSlideBtnElements();
    
    // 要素生成
    if (opt.create.modalInner === 'auto') setModalInner();
    if (opt.create.normalBtn === 'auto') setNormalBtn();
    if (opt.create.floatBtn === 'auto') setFloatBtn();
    
    // 通常ボタンが設置される状態 ['auto'] ['manual'] の限定のクラスを付与する
    if (opt.create.normalBtn) addInsideScrollBarDedicatedClass();
    // スクロールバーの幅を取得する
    if (
      (!opt.scroll.scrollBar ||
      opt.scroll.scrollBar === 'inside') &&
      opt.scroll.addFunction === 'stopBodyScroll'
    ) getScrollBarWidth();
    // フロートボタン要素を取得
    if (
      opt.create.floatBtn &&
      (!opt.scroll.scrollBar ||
      opt.scroll.scrollBar === 'inside')
    ) getFloatBtnWrap();
    
    // モーダルの高さを取得してブラウザの高さと比較する
    setCompareHeightClass();
  };
  
  
  
  var setOptionsSelectChangeEvent = function() {
    var selectHandle = {
      optionsSelect: document.getElementsByClassName('modal-options-select'),
      handleEvent: changeOptionsSelect
    }
    
    Object.keys(selectHandle.optionsSelect).forEach(function(v) {
      selectHandle.optionsSelect[v].addEventListener('change', selectHandle);
    });
  };
  window.addEventListener('load', setOptionsSelectChangeEvent);
};

