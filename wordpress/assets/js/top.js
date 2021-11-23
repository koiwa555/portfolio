'use strict';

// スライドナビの呼び出し
slideNav();

var setDisplayCurrentNavOptions = function() {
  var options = {
    target: '#prof, #skill, #practice, #work',
    anchor: '#pageNav a',
    adjust: [
      { // PC
        height: 55,
      },
      { // 767 以下
        range: ['max-width', 767],
        height: 40,
      },
    ],
    // output: true,
  };
  displayCurrentNav(options);
};
setDisplayCurrentNavOptions();


var setFloatOptions = function() {
  var floatOptions = [
    {
      id: 'header',
      switchPosition: 0,
      addHeight: {
        id: 'body',
        direction: 'top',
      },
      scrollUp: [
        {
          range: ['max-width', 767],
          enabled: true,
          feature: 'changeMargin',
          marginDirection: 'top',
        },
      ],
    },
    {
      id: 'toTopCircle',
      switchPosition: 300,
      float: {
        enabled: true,
        range: ['min-width', 768],
      },
      cancel: [
        {
          enabled: true,
          // range: ['max-width', 767],
          addClassId: ['toTopCircleOuter'],
          feature: 'side',
          sideOptions: {
            mainId: 'main',
            // 座標調整用の値
            coordinate: 0,
            // absolute の top の座標
            absolute: 40,
          },
        },
      ],
    },
  ];
  floatContent(floatOptions);
};
setFloatOptions();


var setSmoothScrollOptions = function() {
  var smoothScrollOptions = {
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
      }
    ],
    addClass: {
      id: ['header'],
    },
    // floatStatus: {
    //   floatedClass: 'is-float_floated',
    //   activatedClass: 'is-float_activated',
    // },
    eventUseCapture: false
  };
  smoothScroll(smoothScrollOptions);
};
setSmoothScrollOptions();
