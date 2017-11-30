<?php
/**
 * Register any necessary taxonomies to be used throughout the build
 *
 * @package Theme
 * @since   1.0.0
 */
function register_custom_taxonomies() {
    $taxonomies = [];

    if (!empty($taxonomies)) {
        foreach ($taxonomies as $name => $args) {
            register_taxonomy($name, $args['post_types'], $args['args']);
        }
    }
}
