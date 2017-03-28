(function($) {
	var Theme = (function() {
	/**
	 * Pseudo-constructor
	 */
		var init = (function() {
			return {
				domLoaded: function() {},
				pageLoaded: function() {},
				pageResized: function() {}
			}
		});

	/**
	 * Site functionality
	 */
		// theme methods go here

	/**
	 * Additional methods
	 */
		var __loadPlugin = function(el, method, options) {
			el = (el instanceof $) ? el : $(el);
			options = options || {};

			if (el[method]) {
				el[method](options);
			}

			return el;
		};

	/**
	 * Pseudo-destructor
	 */
		return {
			init: init
		};
	})();

/**
 * Event bindings
 */
	$(document).on('ready', function() {
		Theme.init().domLoaded();
	});

	$(window).on('load', function() {
		Theme.init().pageLoaded();
	});

	$(window).on('resize', function() {
		Theme.init().pageResized();
	});
}(jQuery));