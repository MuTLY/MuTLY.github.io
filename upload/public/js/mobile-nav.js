( function( $, window, undefined ) {

	'use strict';

	// global
	var Modernizr = window.Modernizr, $body = $( 'body' );

	$.mobile_menu = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};

	// the options
	$.mobile_menu.defaults = {
		// classes for the animation effects
		animationClasses : { classin : 'mobile-animate-in', classout : 'mobile-animate-out' },
		// callback: click a link that has a sub menu
		// el is the link element (li); name is the level name
		onLevelClick : function( el, name ) { return false; },
		// callback: click a link that does not have a sub menu
		// el is the link element (li); ev is the event obj
		onLinkClick : function( el, ev ) { return false; }
	};

	$.mobile_menu.prototype = {
		_init : function( options ) {

			// options
			this.options = $.extend( true, {}, $.mobile_menu.defaults, options );
			// cache some elements and initialize some variables
			this._config();

			var animEndEventNames = {
					'WebkitAnimation' : 'webkitAnimationEnd',
					'OAnimation' : 'oAnimationEnd',
					'msAnimation' : 'MSAnimationEnd',
					'animation' : 'animationend'
				},
				transEndEventNames = {
					'WebkitTransition' : 'webkitTransitionEnd',
					'MozTransition' : 'transitionend',
					'OTransition' : 'oTransitionEnd',
					'msTransition' : 'MSTransitionEnd',
					'transition' : 'transitionend'
				};
			// animation end event name
			this.animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ] + '.mobile_menu';
			// transition end event name
			this.transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ] + '.mobile_menu';
			// support for css animations and css transitions
			this.supportAnimations = Modernizr.cssanimations;
			this.supportTransitions = Modernizr.csstransitions;

			this._initEvents();

		},
		_config : function() {
			this.open = false;
			this.$menu = this.$el.children( 'ul.menu' );
			this.$menuitems = this.$menu.find( 'li:not(.mobile-back)' );
			this.$el.find( 'ul.submenu' ).prepend( '<li class="mobile-back"><a href="#"> back</a></li>' );
			this.$back = this.$menu.find( 'li.mobile-back' );
		},
		_initEvents : function() {

			var self = this;

			this.$menuitems.on( 'click.mobile_menu', function( event ) {

				event.stopPropagation();

				var $item = $(this),
					$submenu = $item.children( 'ul.submenu' );

				if( $submenu.length > 0 ) {

					var $flyin = $submenu.clone().css( 'opacity', 0 ).insertAfter( self.$menu ),
						onAnimationEndFn = function() {
							self.$menu.off( self.animEndEventName ).removeClass( self.options.animationClasses.classout ).addClass( 'mobile-subview' );
							$item.addClass( 'mobile-subviewopen' ).parents( '.mobile-subviewopen:first' ).removeClass( 'mobile-subviewopen' ).addClass( 'mobile-subview' );
							$flyin.remove();
						};

					setTimeout( function() {
						$flyin.addClass( self.options.animationClasses.classin );
						self.$menu.addClass( self.options.animationClasses.classout );
						if( self.supportAnimations ) {
							self.$menu.on( self.animEndEventName, onAnimationEndFn );
						}
						else {
							onAnimationEndFn.call();
						}

						self.options.onLevelClick( $item, $item.children( 'a:first' ).text() );
					} );

					return false;

				}
				else {
					self.options.onLinkClick( $item, event );
				}

			} );

			this.$back.on( 'click.mobile_menu', function( event ) {
				var $this = $( this ),
					$submenu = $this.parents( 'ul.submenu:first' ),
					$item = $submenu.parent(),

					$flyin = $submenu.clone().insertAfter( self.$menu );

				var onAnimationEndFn = function() {
					self.$menu.off( self.animEndEventName ).removeClass( self.options.animationClasses.classin );
					$flyin.remove();
				};

				setTimeout( function() {
					$flyin.addClass( self.options.animationClasses.classout );
					self.$menu.addClass( self.options.animationClasses.classin );
					if( self.supportAnimations ) {
						self.$menu.on( self.animEndEventName, onAnimationEndFn );
					}
					else {
						onAnimationEndFn.call();
					}

					$item.removeClass( 'mobile-subviewopen' );

					var $subview = $this.parents( '.mobile-subview:first' );
					if( $subview.is( 'li' ) ) {
						$subview.addClass( 'mobile-subviewopen' );
					}
					$subview.removeClass( 'mobile-subview' );
				} );

				return false;

			} );

		},
		// resets the menu to its original state (first level of options)
		_resetMenu : function() {
			this.$menu.removeClass( 'mobile-subview' );
			this.$menuitems.removeClass( 'mobile-subview mobile-subviewopen' );
		}
	};

	$.fn.mobile_menu = function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'mobile_menu' );
				instance[ options ].apply( instance, args );
			});
		}
		else {
			this.each(function() {
				var instance = $.data( this, 'mobile_menu' );
				if ( instance ) {
					instance._init();
				}
				else {
					instance = $.data( this, 'mobile_menu', new $.mobile_menu( options, this ) );
				}
			});
		}
		return this;
	};

} )( jQuery, window );
