<?php
/**
 * Here we're setting up some constants to use throughout the theme, and then autoloading
 * any necessary functionality from the "includes" directory.
 *
 * @package Theme
 * @since   1.0.0
 */
define('THEME_DIR', dirname(__FILE__));
define('ASSETS_DIR', THEME_DIR . '/public');
define('INCLUDES_DIR', THEME_DIR . '/includes');
define('THEME_URL', get_template_directory_uri());
define('ASSETS_URL', THEME_URL . '/public');

require_once INCLUDES_DIR . '/autoload.php';
