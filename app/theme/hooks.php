<?php
/**
 * Any action/filter hooks should be added here
 *
 * @package Theme
 * @since   1.0.0
 */

// register any post types/taxonomies needed
add_action('init', 'register_custom_post_types');
add_action('init', 'register_custom_taxonomies');

// load any assets needed
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

// register any additional functionality needed
add_action('after_setup_theme', function() {
    // theme support
    add_theme_support('html5');
    add_theme_support('post-thumbnails');

    // menus
    register_nav_menu('main', 'Main Menu');

    // theme options page
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title'  => 'Options',
            'parent_slug' => 'themes.php',
            'menu_slug'   => 'theme-options'
        ]);
    }
});
