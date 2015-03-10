(function($){

	$.fn.extend({
		tooltip: function() {

			if(typeof window['tooltipsCounter'] == 'undefined'){
				window['tooltipsCounter'] = 0;
			}

			return this.each(function(){

				window['tooltipsCounter'] += 1;

				var element = $(this);
				var elementOffset = element.offset();
				var elementWidth = element.outerWidth();
				var elementHeight = element.outerHeight();
				var elementEvent = element.data('event') != undefined ? element.data('event') : 'mouseover';

				if(element.css('position') != 'absolute' && element.css('position') != 'relative'){
					element.css({'position':'relative'});
				}

				var tooltipId = element.data('tooltip-id') || false;
				var tooltipText = element.data('tooltip') || '';
				var tooltipPosition = element.data('position') || 'top';
				var tooltipAlign = element.data('align') || 'center';
				var tooltipShow = element.data('show') != undefined && element.data('show') ? true : false;
				var tooltipFixed = element.data('fixed') != undefined && element.data('fixed') ? true : false;

				if(tooltipId) {
					var tooltip = $('#'+tooltipId);
				} else {
					var tooltipId = 'tooltip_'+window['tooltipsCounter'];
					var tooltip = $('<div class="tooltip" id="'+tooltipId+'"></div>');
					element.attr('data-tooltip-id', tooltipId);
					$('body').append(tooltip);
				}

				tooltip.html(tooltipText);
				tooltip.addClass('position-'+tooltipPosition);
				tooltip.addClass('align-'+tooltipAlign);

				var tooltipWidth = parseInt(tooltip.outerWidth());
				var tooltipHeight = parseInt(tooltip.outerHeight());

				if(tooltipFixed) {

					tooltip.css({
						'position': 'fixed',
						'top': (elementOffset.top - (tooltipHeight - 20))+'px',
						'left': (elementOffset.left + ((elementWidth - tooltipWidth) / 2))+'px'
					});

				} else {

					switch(tooltipPosition){
						case 'top':

							tooltip.css({
								'top': (elementOffset.top - (tooltipHeight + 15))+'px',
								'left': (elementOffset.left + ((elementWidth - tooltipWidth) / 2))+'px'
							});

						break;
						case 'right':

							tooltip.css({
								'top': (elementOffset.top + ((elementHeight - tooltipHeight) / 2))+'px',
								'left': (elementOffset.left + (elementWidth + 20))+'px'
							});

						break;
						case 'left':

							tooltip.css({
								'top': (elementOffset.top + ((elementHeight - tooltipHeight) / 2))+'px',
								'left': (elementOffset.left - (tooltipWidth + 20))+'px'
							});

						break;
						case 'bottom':

							tooltip.css({
								'top': (elementOffset.top + (elementHeight + 20))+'px',
								'left': (elementOffset.left + ((elementWidth - tooltipWidth) / 2))+'px'
							});

						break;
					}

				}

				if(tooltipShow){

					tooltip.show();

				} else {

					switch(elementEvent){
						case 'click':

							element.click(function(){
								if(!tooltip.hasClass('active')){
									tooltip.fadeIn('fast', function(){
										$(this).addClass('active');
									});
								} else {
									tooltip.fadeOut('fast',function(){
										$(this).removeClass('active');
									});
								}
								return false;
							});

							$('body').click(function(){
								$('.tooltip.active').fadeOut('fast',function(){
									$(this).removeClass('active');
								});
								return false;
							});

						break;
						case 'mouseover':

							element.on('mouseover',function(){
								tooltip.fadeIn(150, function(){
									$(this).addClass('active');
								});
							});
							element.on('mouseleave',function(){
								tooltip.fadeOut(150,function(){
									tooltip.removeClass('active');
								});
							});

						break;
					}

				}

			});
		}
	});
})(jQuery);
