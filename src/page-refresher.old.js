// Source: https://pagerefresher.com

(function () {
  var Refresher = function ($el) {
    this.$el = $el;
    this.$spinner = $el.find(".spinner");
    this._bindEvents();
    this._focusUrl();
    this.interval;
    this.window;
  };

  Refresher.prototype = {
    /**
     * Start refreshing
     */
    start: function () {
      var url = this._fixUrl(
          this.$el.find("input[name=url]").val() || "pagerefresher.com"
        ),
        secondsInterval =
          parseInt(this.$el.find("input[name=interval]").val()) || 10,
        secondsRemaining = secondsInterval,
        windowName = "refreshingWindow",
        /*
          height = (window.outerHeight || window.screen.height) - 300,
  		    width = (window.outerWidth || window.screen.width) - 600,
  		    top = (window.outerWidth)
  		            ? (Math.round((window.outerHeight - height) / 4) + window.screenY)
  		            : (Math.round((window.screen.height - height) / 4)),
  		    left = (window.outerWidth)
  		             ? (Math.round((window.outerWidth - width) / 4) + window.screenX)
  		             : (Math.round((window.screen.width - width) / 4)),
  		    windowParams = 'top=' + top + ',left=' + left + ',height=' + height + ',width= ' + width,
          */
        height = 600,
        width = 400,
        top = window.innerHeight - height,
        left = window.innerWidth - width,
        windowParams =
          "height=" +
          height +
          ", width=" +
          width +
          ", left=" +
          left +
          ", top=" +
          top,
        that = this,
        loop = function () {
          // check if the window has closed
          if (!that.window || that.window.closed) {
            that.stop();
            return;
          }

          // refresh and reset if we're at 0
          if (!secondsRemaining) {
            that.window = open(url, windowName, windowParams);
            secondsRemaining = secondsInterval;
            that.$spinner.addClass("spin");
          } else {
            that.$spinner.addClass("bounce");
          }
          that.$spinner.text(secondsRemaining);

          // decrement seconds
          secondsRemaining--;
        };

      // animate to refreshing mode
      $("body").addClass("refreshing");

      // open thw window
      that.window = open(url, windowName, windowParams);
      //that.window = open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');

      // loop now and every second
      that.interval = setInterval(loop, 1000);
    },

    /**
     * Stop refreshing
     */
    stop: function () {
      clearInterval(this.interval);
      this.interval = null;
      if (this.window) {
        this.window.close();
      }
      this.$spinner.text("START / STOP");
      $("body").removeClass("refreshing");
    },

    _fixUrl: function (url) {
      return url.match(/^[a-zA-Z]+:\/\//) ? url : "http://" + url;
    },

    /**
     * Bind events
     */
    _bindEvents: function () {
      var that = this;
      this.$el
        .on("submit", function () {
          if (that.interval) {
            that.stop();
          } else {
            that.start();
          }
          return false;
        })
        .on("mouseup", "button", function () {
          $(this).blur();
        });
      this.$spinner.on(
        "webkitAnimationEnd oAnimationEnd msAnimationEnd animationend",
        function (e) {
          $(this).removeClass(e.originalEvent.animationName);
        }
      );
    },

    /**
     * Focus the URL field (on page load)
     */
    _focusUrl: function () {
      this.$el.find("input[name=url]").focus();
    },
  };

  $(function () {
    new Refresher($("form.refresh"));
  });
})();
