'use strict';

var setFloatOptions = function() {
  var options = [
    {
      id: 'toTopCircle',
      switchPosition: 300,
      cancel: [
        {
          addClassId: ['toTopCircleOuter'],
          feature: 'side',
          sideOptions: {
            mainId: 'main',
            coordinate: 0,
            absolute: 2,
          },
        },
      ],
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
    eventUseCapture: false
  };
  smoothScroll(options);
};
setSmoothScrollOptions();
