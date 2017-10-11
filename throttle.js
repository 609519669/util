throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;//previous指的是目标函数执行时候的时间
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : new Date().getTime();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = new Date().getTime();//函数调用时候的时间  也可以说是事件发生时候的时间
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);//我调用的事件距离上次函数执行发生的时间间隔
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {//如果间隔的时间小于0的话 就执行函数
        if (timeout) {//如果有定时器就清除
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;//记录调用函数事件
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);//如果没有定时器就在间隔时间后调用函数   达到的目的就是每隔一定的时间调用函数。如果多次触发的话
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };
