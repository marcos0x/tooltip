(function(global, $) {
  'use strict';

	global.tooltipsCounter = 0;

	function Tooltip(element, settings) {
		var _this = this;
		_this.element = element;
		_this.settings = settings;

		_this.init = function() {
			_this.config = {
				isInput: _this.element.is('input') || _this.element.is('select') || _this.element.is('textarea') || _this.element.is('button') || false,
				width: _this.element.outerWidth(),
				height: _this.element.outerHeight(),
				position: _this.element.css('position')
			}

			_this.settings = $.extend(true, {
				id: _this.element.data('tooltip-id') || false,
				text: _this.element.data('tooltip') || '',
				position: _this.element.data('position') || 'top',
				width: _this.element.data('width') || false,
				height: _this.element.data('height') || false,
				align: _this.element.data('align') || 'center',
				lineHeight: _this.element.data('line-height') || false,
				show: _this.element.data('show') != undefined && _this.element.data('show') ? true : false,
				fixed: _this.element.data('fixed') != undefined && _this.element.data('fixed') ? true : false,
				attached: _this.element.data('attached') != undefined && _this.element.data('attached') ? true : false,
				noclick: _this.element.data('noclick') != undefined && _this.element.data('noclick') ? true : false,
				event: _this.element.data('event') != undefined ? _this.element.data('event') : 'mouseover',
				update: false
			}, _this.settings);

			if (!_this.settings.text.length) {
				return false;
			}

			if (_this.config.isInput && (_this.element.parent().css('position') != 'absolute' && _this.element.parent().css('position') != 'relative')) {
				_this.element.parent().css({ position: 'relative' });
			} else if (_this.config.position != 'absolute' && _this.config.position != 'relative') {
				_this.element.css({ position: 'relative' });
			}

			if (_this.settings.id || _this.settings.update) {
				_this.tooltip = $('#'+_this.settings.id);
			} else {
				global.tooltipsCounter += 1;
				_this.settings.id = 'tooltip_'+global.tooltipsCounter;
				_this.tooltip = $('<div class="tooltip" id="'+_this.settings.id+'"></div>');

				_this.element.attr('data-tooltip-id', _this.settings.id);

				if (!_this.settings.attached) {
					$('body').append(_this.tooltip);
				} else {
					if (_this.config.isInput) {
						_this.element.after(_this.tooltip);
					} else {
						_this.element.append(_this.tooltip);
					}
				}

				_this.tooltip.addClass('position-'+_this.settings.position+' align-'+_this.settings.align).html(_this.settings.text);

				if (_this.settings.lineHeight) {
					_this.tooltip.css({ lineHeight: parseFloat(_this.settings.lineHeight) });
				}
			}

			_this.setPosition();

			return true;
		};

		_this.setPosition = function() {
			_this.config.offset = _this.element.offset();
			_this.settings.positionTop = !_this.settings.attached ? _this.config.offset.top : 0;
			_this.settings.positionLeft = !_this.settings.attached ? _this.config.offset.left : 0;

			if (_this.settings.width) {
				_this.tooltip.css({ width: _this.settings.width+'px' });
			} else {
				_this.settings.width = parseInt(_this.tooltip.outerWidth());
			}

			if (_this.settings.height) {
				_this.tooltip.css({ height: _this.settings.height+'px' });
			} else {
				_this.settings.height = parseInt(_this.tooltip.outerHeight());
			}

			if (_this.settings.fixed) {
				_this.tooltip.css({
					position: 'fixed',
					top: (_this.settings.positionTop - (_this.settings.height - 10))+'px',
					left: (_this.settings.positionLeft + ((_this.config.width - _this.settings.width) / 2))+'px'
				});
			} else {
				switch(_this.settings.position) {
					case 'top':
						_this.tooltip.css({
							top: (_this.settings.positionTop - (_this.settings.height + 10))+'px',
							left: (_this.settings.positionLeft + ((_this.config.width - _this.settings.width) / 2))+'px'
						});
					break;
					case 'right':
						_this.tooltip.css({
							top: (_this.settings.positionTop + ((_this.config.height - _this.settings.height) / 2))+'px',
							left: (_this.settings.positionLeft + (_this.config.width + 20))+'px'
						});
					break;
					case 'left':
						_this.tooltip.css({
							top: (_this.settings.positionTop + ((_this.config.height - _this.settings.height) / 2))+'px',
							left: (_this.settings.positionLeft - (_this.settings.width + 20))+'px'
						});
					break;
					case 'bottom':
						_this.tooltip.css({
							top: (_this.settings.positionTop + (_this.config.height + 10))+'px',
							left: (_this.settings.positionLeft + ((_this.config.width - _this.settings.width) / 2))+'px'
						});
					break;
				}
			}
		};

		_this.update = function() {
			return _this.init({ update: true });
		};

		_this.bind = function() {
			if (!_this.init()) {
				return;
			}

			if (_this.settings.show) {
				_this.tooltip.show();
				return;
			}

			switch(_this.settings.event) {
				case 'click':
					_this.element.on('click', function() {
						_this.element.tooltip('update');
						if (!_this.tooltip.hasClass('active')) {
							_this.tooltip.fadeIn('fast', function() {
								$(this).addClass('active');
							});
						} else {
							_this.tooltip.fadeOut('fast',function() {
								$(this).removeClass('active');
							});
						}
						return false;
					});

					$('body').on('click', function() {
						$('.tooltip.active').fadeOut('fast',function() {
							$(this).removeClass('active');
						});
						return false;
					});
				break;
				case 'mouseover':
					_this.element.on('mouseover',function() {
						_this.element.tooltip('update');
						_this.tooltip.fadeIn(250, function() {
							$(this).addClass('active');
						});
					});

					_this.element.on('mouseleave',function() {
						if (_this.tooltip.hasClass('active')){
							_this.tooltip.fadeOut(250,function() {
								_this.tooltip.removeClass('active');
							});
						}
					});

					if (_this.settings.noclick) {
						_this.element
							.css({ cursor: 'default' })
							.on('click', function() {
								return false;
							});
					}
				break;
			}

			$(document).ajaxComplete(function() {
				_this.element.tooltip();
			});
		};
	}

	$.fn.extend({
		tooltip: function(options) {
      var settings = options || {};

			return this.each(function() {
			  var tooltip = new Tooltip($(this), settings);

        switch(settings) {
          default:
          case 'bind':
            tooltip.bind();
          break;
          case 'update':
            tooltip.update();
          break;
        }
			});
		}
	});

})(window, jQuery);
