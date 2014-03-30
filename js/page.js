var Page = (function() {

	var $container = $( '#container' ),
		$bookBlock = $( '#bb-bookblock' ),
		$navNext = $( '#bb-nav-next' ),
		$navPrev = $( '#bb-nav-prev' ),
		$navFirst = $( '#bb-nav-first' ),
		$navLast = $( '#bb-nav-last' ),
		$items = $bookBlock.children(),
		config = {
						$bookBlock : $( '#bb-bookblock' ),
						$navNext : $( '#bb-nav-next' ),
						$navPrev : $( '#bb-nav-prev' ),
						$navFirst : $( '#bb-nav-first' ),
						$navLast : $( '#bb-nav-last' )
					},
		itemsCount = $items.length,
		current = 0,


		bb = $( '#bb-bookblock' ).bookblock( {
			speed : 800,
			perspective : 2000,
			shadowSides	: 0.8,
			shadowFlip	: 0.4,
			onEndFlip : function(old, page, isLimit) {
				
				current = page;
				// update TOC current
				updateTOC();
				// updateNavigation
				updateNavigation( isLimit );
				// initialize jScrollPane on the content div for the new item
				setJSP( 'init' );
				// destroy jScrollPane on the content div for the old item
				setJSP( 'destroy', old );

			}
		} ),
		
		$menuItems = $container.find( 'ul.menu-toc > li' ),
		$tblcontents = $( '#tblcontents' ),
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
		supportTransitions = Modernizr.csstransitions;

	function init() {

		// initialize jScrollPane on the content div of the first item
		setJSP( 'init' );
		openTOC();
		initEvents(); 	

	}
	
	function initEvents() {

						var $slides = config.$bookBlock.children();
						
						// add navigation events
						config.$navNext.on( 'click', function() {
							config.$bookBlock.bookblock( 'next' );
							
							return false;
						} );

						config.$navPrev.on( 'click', function() {
							config.$bookBlock.bookblock( 'prev' );
						
							return false;
						} );

						/*
						// add swipe events
						$slides.on( {
							'swipeleft' : function( event ) {
								config.$bookBlock.bookblock( 'next' );
								return false;
							},
							'swiperight' : function( event ) {
								config.$bookBlock.bookblock( 'prev' );
								return false;
							}
						} );
						*/

		// show table of contents
		$tblcontents.on( 'click', openTOC );

		// click a menu item
		$menuItems.on( 'click', function() {
	
			var $el = $( this );
			idx = $el.index();
			
			$( '#bb-bookblock' ).bookblock( 'jump', idx + 1  );
			
			return false;
			
		} );

		// reinit jScrollPane on window resize
		$( window ).on( 'debouncedresize', function() {
			// reinitialise jScrollPane on the content div
			setJSP( 'reinit' );
		} );

	}

	function setJSP( action, idx ) {
		
		var idx = idx === undefined ? current : idx,
			$content = $items.eq( idx ).children( 'div.content' ),
			apiJSP = $content.data( 'jsp' );
		
		if( action === 'init' && apiJSP === undefined ) {
			$content.jScrollPane({verticalGutter : 0, hideFocus : true, maintainPosition : false});
		}
		else if( action === 'reinit' && apiJSP !== undefined ) {
			apiJSP.reinitialise();
		}
		else if( action === 'destroy' && apiJSP !== undefined ) {
			apiJSP.destroy();
	

		}

	}

	function updateTOC() {
		$menuItems.removeClass( 'menu-toc-current' ).eq( current ).addClass( 'menu-toc-current' );
	}

	function updateNavigation( isLastPage ) {
		
		if( current === 0 ) {
			config.$navNext.show();
			config.$navPrev.hide();
		}
		else if( isLastPage ) {
			config.$navNext.hide();
			config.$navPrev.show();
		}
		else {
			config.$navNext.show();
			config.$navPrev.show();
		}

	}

	function toggleTOC() {
		var opened = $container.data( 'opened' );
		opened ? closeTOC() : openTOC();
	}

	function openTOC() {
		
		$container.addClass( 'slideRight' ).data( 'opened', true );
	}

	function closeTOC( callback ) {

		updateNavigation( current === itemsCount - 1 );
		
		if( callback ) {
			if( supportTransitions ) {
				$container.on( transEndEventName, function() {
					$( this ).off( transEndEventName );
					callback.call();
				} );
			}
			else {
				callback.call();
			}
		}

	}

	return { init : init , closeTOC : closeTOC};

})();