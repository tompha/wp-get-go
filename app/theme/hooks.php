<?php
/**
 * Any action/filter hooks should be added here
 *
 * @package Theme
 * @since   1.0.0
 */

/**
 * Hide the admin bar on the front-end
 */
add_action('show_admin_bar', '__return_false');

/**
 * Load the theme assets
 */
add_action('init', function() {
    if (is_admin() || in_array($GLOBALS['pagenow'], ['wp-register.php', 'wp-login.php'])) {
        return;
    }

    Theme::enqueueScript(
        'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
        true, [], '2.2.4', false
    );

    Theme::enqueueStyle('app', 'app');
    Theme::enqueueScript('app', 'app');
});

/**
 * Register any specific theme functionality
 */
add_action('after_setup_theme', function() {
    add_theme_support('html5');
    add_theme_support('post-thumbnails');

    register_nav_menu('main', 'Main Menu');

    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title'  => 'Theme',
            'parent_slug' => 'options-general.php',
            'menu_slug'   => 'theme-options'
        ]);
    }
});

/**
 * Reduce Yoast SEO meta box priority
 */
add_filter('wpseo_metabox_prio', function() {
    return '__low';
});
