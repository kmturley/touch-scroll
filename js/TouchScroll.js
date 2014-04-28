/*
 * TouchScroll - using dom overflow:scroll
 * by kmturley
 */

/*globals window, document */

var TouchScroll = function () {
    'use strict';
    
    var module = {
        axis: 'x',
        drag: false,
        zoom: 1,
        isIE: window.navigator.userAgent.toLowerCase().indexOf('msie') > -1,
        isFirefox: window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
        init: function (options) {
            var me = this;
            if (options && options.id) {
                this.el = document.getElementById(options.id);
            } else {
                if (this.isIE || this.isFirefox) {
                    this.el = document.documentElement;
                } else {
                    this.el = document.body;
                }
            }
            this.addEvent('mousedown', this.el, function (e) { me.onMouseDown(e); });
			this.addEvent('mousemove', this.el, function (e) { me.onMouseMove(e); });
			this.addEvent('mouseup', this.el, function (e) { me.onMouseUp(e); });
            
            // if zoom param exists add mouse wheel functionality
            if (options && options.zoom) {
                this.elzoom = document.getElementById(options.zoom);
                if (this.isFirefox) {
                    this.addEvent('DOMMouseScroll', this.el, function (e) { me.onMouseWheel(e); });
                } else {
                    this.addEvent('mousewheel', this.el, function (e) { me.onMouseWheel(e); });
                }
            }
        },
        addEvent: function (name, el, func) {
            if (el.addEventListener) {
                el.addEventListener(name, func, false);
            } else if (el.attachEvent) {
                el.attachEvent('on' + name, func);
            } else {
                el[name] = func;
            }
        },
        onMouseDown: function (e) {
            if (!e) { e = window.event; }
            if (e.target && e.target.nodeName === 'IMG') {
                e.preventDefault();
            } else if (e.srcElement && e.srcElement.nodeName === 'IMG') {
                e.returnValue = false;
            }
            this.startx = e.clientX + this.el.scrollLeft;
            this.starty = e.clientY + this.el.scrollTop;
            this.diffx = 0;
            this.diffy = 0;
            this.drag = true;
        },
        onMouseMove: function (e) {
            if (this.drag === true) {
                if (!e) { e = window.event; }
                this.diffx = (this.startx - (e.clientX + this.el.scrollLeft));
                this.diffy = (this.starty - (e.clientY + this.el.scrollTop));
                this.el.scrollLeft += this.diffx;
                this.el.scrollTop += this.diffy;
            }
        },
        onMouseUp: function (e) {
            if (!e) { e = window.event; }
            this.drag = false;
            var me = this,
                start = 1,
                animate = function () {
                    var step = Math.sin(start);
                    if (step <= 0) {
                        window.cancelAnimationFrame(animate);
                    } else {
                        me.el.scrollLeft += me.diffx * step;
                        me.el.scrollTop += me.diffy * step;
                        start -= 0.02;
                        window.requestAnimationFrame(animate);
                    }
                };
            animate();
        },
        onMouseWheel: function (e) {
            if (!e) { e = window.event; }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            if (e.detail) {
                this.zoom -= e.detail;
            } else {
                this.zoom += (e.wheelDelta / 1200);
            }
            if (this.zoom < 1) {
                this.zoom = 1;
            } else if (this.zoom > 10) {
                this.zoom = 10;
            }
            /*
            this.elzoom.style.OTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            this.elzoom.style.MozTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            this.elzoom.style.msTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            this.elzoom.style.WebkitTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            this.elzoom.style.transform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            */
            this.elzoom.style.zoom = this.zoom * 100 + '%';
            //this.el.scrollLeft += e.wheelDelta / 10;
            //this.el.scrollTop += e.wheelDelta / 8;
        }
    };
    return module;
};