/*
 * angular-hammer v1.2.4
 * (c) 2013 Monospaced http://monospaced.com
 * License: MIT
 */

(function(window, angular, Hammer){

var hmTouchEvents = angular.module('hmTouchEvents', []),
    hmGestures = ['hmHold:hold',
                  'hmTap:tap',
                  'hmPress:press',
                  'hmDoubletap:doubletap',
                  'hmDrag:drag',
                  'hmDragstart:dragstart',
                  'hmDragend:dragend',
                  'hmDragup:dragup',
                  'hmDragdown:dragdown',
                  'hmDragleft:dragleft',
                  'hmDragright:dragright',
                  'hmSwipe:swipe',
                  'hmSwipeup:swipeup',
                  'hmSwipedown:swipedown',
                  'hmSwipeleft:swipeleft',
                  'hmSwiperight:swiperight',
                  'hmTransform:transform',
                  'hmTransformstart:transformstart',
                  'hmTransformend:transformend',
                  'hmRotate:rotate',
                  'hmPinch:pinch',
                  'hmPinchin:pinchin',
                  'hmPinchout:pinchout',
                  'hmTouch:touch',
                  'hmRelease:release'];

angular.forEach(hmGestures, function(name){
  var directive = name.split(':'),
      directiveName = directive[0],
      eventName = directive[1];

  hmTouchEvents.directive(directiveName, ['$parse', '$window', function($parse, $window){
    return {
      restrict: 'A, C',
      link: function(scope, element, attr) {
        var expr = $parse(attr[directiveName]),
            fn = function(event){
              scope.$apply(function() {
                expr(scope, {$event: event});
              });
            },
            opts = $parse(attr['hmOptions'])(scope, {}),
            hammer;

        if (typeof Hammer === 'undefined' || !$window.addEventListener) {
          // fallback to mouse events where appropriate
          if (directiveName === 'hmTap') {
            element.bind('click', fn);
          }
          if (directiveName === 'hmDoubletap') {
            element.bind('dblclick', fn);
          }
          return;
        }

        // don't create multiple Hammer instances per element
        if (!(hammer = element.data('hammer'))) {
          hammer = Hammer(element[0], opts);
          element.data('hammer', hammer);
        }

        // bind Hammer touch event
        hammer.on(eventName, fn);

        // unbind Hammer touch event
        scope.$on('$destroy', function(){
          hammer.off(eventName, fn);
        });

      }
    };
  }]);
});

})(window, window.angular, window.Hammer);
