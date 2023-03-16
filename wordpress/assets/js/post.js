'use strict';

// スライドナビの呼び出し
slideNav();

var setDisplayCurrentNavOptions = function() {
  var options = {
    // 対象のタグ名
    // querySelectorAll() で一括取得できるのでカンマ繋ぎで指定する
    target: 'h2, h3, h4, h5, h6',
    // 現在値を表示するための li の子要素にあたるアンカーを指定する
    anchor: '#pageNav li',
    // range を指定して最初に合致した要素を利用する…という仕組み
    adjust: [
      { // PC
        height: 40
      },
      { // 899 以下
        range: ['max-width', 899],
        height: 80
      },
    ],
    // デバッグ用
    // output: true,
  };
  displayCurrentNav(options);
};
setDisplayCurrentNavOptions();


var setFloatOptions = function() {
  var options = [
    {
      id: 'invisibleHeader',
      switchPosition: 0,
    },
    {
      id: 'sideContentInner',
      switchPosition: 'sideContentInner',
      stackId: 'invisibleHeader',
      cancel: [
        {
          enabled: true,
          // range: ['max-width', 767],
          feature: 'side',
          sideOptions: {
            mainId: 'main',
            coordinate: 40,
            // absolute の top の座標
            // absolute: 0,
          },
        },
      ],
    },
    {
      id: 'toTop',
      switchPosition: 300,
      float: {
        enabled: true,
        range: ['min-width', 900],
      },
    },
    {
      id: 'header',
      switchPosition: 0,
      float: {
        enabled: true,
        range: ['max-width', 899],
      },
      addHeight: {
        id: 'body',
        direction: 'top',
      },
      scrollUp: [
        {
          range: ['max-width', 899],
          enabled: true,
          feature: 'changeMargin',
          marginDirection: 'top',
        },
      ],
    },
    {
      id: 'sampleNav',
      switchPosition: 0,
      float: {
        enabled: true,
        range: ['max-width', 899],
      },
      addHeight: {
        id: 'footer',
        direction: 'bottom',
      },
      // scrollUp: [
      //   {
      //     range: ['max-width', 899],
      //     enabled: true,
      //     feature: 'changeMargin',
      //     marginDirection: 'bottom',
      //   },
      // ],
    },
  ];
  floatContent(options);
};
setFloatOptions();


var setSmoothScrollOptions = function() {
  var options = {
    easing: 'easeInSine',
    duration: {
      anchor: 400,
      urlHash: 0,
    },
    // dynamic: {
    //   support: false,
    //   parentId: 'body',
    // },
    floatTopElem: [
      {
        id: 'header',
        alwaysFloated: true,
      },
      {
        // 非表示だけど高さを持っている要素
        // 記事ページ用に見えない要素として上端にフロートしている
        // この要素にツライチでフロートさせることでスクロール位置を調整する。
        id: 'invisibleHeader',
        alwaysFloated: true,
      }
    ],
    addClass: {
      id: ['header', 'sampleNav'],
    },
    // floatStatus: {
    //   floatedClass: 'is-float_floated',
    //   activatedClass: 'is-float_activated',
    // },
    eventUseCapture: false
  };
  smoothScroll(options);
};
setSmoothScrollOptions();

