(function($) {
    var prefix = (function () {
      var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
      };
    })();

    window.requestAnimFrame = window.requestAnimationFrame || window[prefix + RequestAnimationFrame];

    $.fn.mosaic = function(options) {
        return this.each(function() {
            var canvas = $('<canvas/>').appendTo($(this).parent())[0],
                canvas2 = $('<canvas/>')[0],
                ctx2 = canvas2.getContext('2d'),
                ctx = canvas.getContext('2d');

            if (this.tagName.toLowerCase() === 'img') {
                this.onload = function() {
                    var width = this.naturalWidth,
                        height = this.naturalHeight,
                        that = this;

                    canvas.width = canvas2.width = width;
                    canvas.height = canvas2.height = height;

                    ctx[prefix.lowercase + 'ImageSmoothingEnabled'] = false;
                    ctx2[prefix.lowercase + 'ImageSmoothingEnabled'] = false;

                    $(this).hide();

                  var ratio = 1,
                        step = 0.95;

                    function snes() {
                        ratio = ratio * step;
                        if (ratio < 0.009) {
                            ratio = 0.009;
                            step = 1.05;
                        } else if (ratio > 1) {
                            if (options.repeat) {
                                ratio = 1;
                                step = 0.9;

                                setTimeout(snes, 1000);
                            }
                            return;
                        }

                        // first draw image onto canvas
                        ctx2.drawImage(that, 0, 0, width*ratio, width*ratio);

                        ctx.drawImage(canvas2, 0, 0, width*ratio, width*ratio, 0, 0, width, height);

                        window.requestAnimFrame(snes);
                    };
                    snes();
                };
            }
        });
    };
})(jQuery);
