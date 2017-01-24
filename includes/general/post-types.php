<?php
/**
 * Register any post types necessary for the theme to function.
**/
    function register_custom_post_types() {
        $post_types = array();

        if (!empty($post_types)) {
            foreach ($post_types as $name => $args) {
                register_post_type($name, $args);
            }
        }
    }