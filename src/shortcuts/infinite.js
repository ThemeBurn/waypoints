(function() {
    'use strict';

    var $ = window.jQuery,
        Waypoint = window.Waypoint;

    /* http://imakewebthings.com/waypoints/shortcuts/infinite-scroll */
    function Infinite(options) {
        this.options     = $.extend({}, Infinite.defaults, options);
        this.$container  = $(this.options.container !== 'auto' ? this.options.container : this.options.element);
        this.$more       = $(this.options.more);
        this.$pagination = $(this.options.pagination);

        if (this.$more.length) {
            this.setupHandler();
            this.waypoint = new Waypoint(this.options)
        }
        if (this.$pagination.length) {
            this.$pagination.hide();
        }
    }

    /* Private */
    Infinite.prototype.setupHandler = function() {
        this.options.handler = $.proxy(function() {
            this.options.onBeforePageLoad();
            this.destroy();
            this.$container.addClass(this.options.loadingClass);

            var $loadingHTML;

            if (this.options.loadingHTML) {
                $loadingHTML = $(this.options.loadingHTML).appendTo(this.$container);
            }

            $.get($(this.options.more).attr('href'), $.proxy(function(data) {
                var $data    = $($.parseHTML(data)),
                    $newMore = $data.find(this.options.more),
                    $items   = $data.find(this.options.items),
                    timeout  = this.options.timeout || 0,
                    instance = this;

                if (!$items.length) {
                    $items = $data.filter(this.options.items)
                }

                setTimeout(function() {
                    instance.options.onBeforeInsertItems();
                    instance.$container.append($items);
                    instance.$container.removeClass(instance.options.loadingClass);

                    if (instance.options.loadingHTML) {
                        $loadingHTML.remove();
                    }

                    if (!$newMore.length) {
                        $newMore = $data.filter(instance.options.more)
                    }
                    if ($newMore.length) {
                        instance.$more.replaceWith($newMore);
                        instance.$more = $newMore;
                        instance.waypoint = new Waypoint(instance.options)
                    }
                    else {
                        instance.$more.remove()
                    }

                    instance.options.onAfterPageLoad($items);
                }, timeout);
            }, this))
        }, this)
    };

    /* Public */
    Infinite.prototype.destroy = function() {
        if (this.waypoint) {
            this.waypoint.destroy();
        }
    };

    Infinite.defaults = {
        container:           'auto',
        items:               '.infinite-item',
        more:                '.infinite-more-link',
        pagination:          false,
        offset:              'bottom-in-view',
        timeout:             0,
        loadingClass:        'infinite-loading',
        loadingHTML:         false,
        onBeforeInsertItems: $.noop,
        onAfterInsertItems:  $.noop,
        onBeforePageLoad:    $.noop,
        onAfterPageLoad:     $.noop
    };

    Waypoint.Infinite = Infinite
}());