<?php
/**
 * Register any post types necessary for the theme to function.
 *
 * @package Theme
 * @since   1.0.0
 */
function register_custom_post_types() {
    $post_types = [];

    if (!empty($post_types)) {
        foreach ($post_types as $name => $args) {
            register_post_type($name, $args);
        }
    }
}
