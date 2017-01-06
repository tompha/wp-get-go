<?php
/**
 * Constants
**/
	define('THEME_DIR', dirname(__FILE__));
	define('ASSETS_DIR', THEME_DIR . '/assets');
	define('INCLUDES_DIR', THEME_DIR . '/includes');
	define('THEME_URL', get_template_directory_uri());
	define('ASSETS_URL', THEME_URL . '/assets');

/**
 * Autoloading
**/
	$themeClasses = glob(INCLUDES_DIR . '/classes/*.php');
	$themeScripts = glob(INCLUDES_DIR . '/general/*.php');

	if (!empty($themeClasses)) {
		foreach ($themeClasses as $classPath) {
			require_once $classPath;
		}
	}

	if (!empty($themeScripts)) {
		foreach ($themeScripts as $scriptPath) {
			require_once $scriptPath;
		}
	}

/**
 * Hooks
**/
	add_action('init', 'theme_initialisation');

/**
 * Custom functions
**/
	function theme_initialisation() {
		if (is_admin() || in_array($GLOBALS['pagenow'], array('wp-register.php', 'wp-login.php'))) {
			return;
		}

		/* styles */
		Theme::enqueueStyle('theme-styles', 'theme');

		/* scripts */
		if (wp_script_is('jquery', 'registered')) {
			wp_deregister_script('jquery');
		}

		Theme::enqueueScript('jquery', '//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js', true, array(), '1.12.4', false);
		Theme::enqueueScript('theme-plugins', 'plugins');
		Theme::enqueueScript('theme-libraries', 'libraries');
		Theme::enqueueScript('theme-general', 'theme');
	}