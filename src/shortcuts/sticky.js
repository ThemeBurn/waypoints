(function() {
  var Sticky = function(options) {
    this.options = $.extend({}, Waypoint.defaults, Sticky.defaults, options)
    this.element = this.options.element
    this.$element = $(this.element)
    this.createWrapper()
    this.createWaypoint()
  }

  Sticky.prototype.destroy = function() {
    this.waypoint.destroy()
    this.$element.removeClass(this.options.stuckClass).unwrap()
  }

  /* Internal */
  Sticky.prototype.createWrapper = function() {
    this.$element.wrap(this.options.wrapper)
    this.$wrapper = this.$element.parent()
    this.wrapper = this.$wrapper[0]
  }

  /* Internal */
  Sticky.prototype.createWaypoint = function() {
    var originalHandler = this.options.handler

    this.waypoint = new Waypoint($.extend({}, this.options, {
      element: this.wrapper,
      handler: $.proxy(function(direction) {
        var shouldBeStuck = this.options.direction.indexOf(direction) > -1
        var wrapperHeight = shouldBeStuck ? this.$element.outerHeight(true) : ''

        this.$element.toggleClass(this.options.stuckClass, shouldBeStuck)
        this.$wrapper.height(wrapperHeight)

        if (originalHandler) {
          originalHandler.call(this, direction)
        }
      }, this)
    }))
  }

  Sticky.defaults = {
    wrapper: '<div class="sticky-wrapper" />',
    stuckClass: 'stuck',
    direction: 'down right'
  }

  window.Waypoint.Sticky = Sticky
})()