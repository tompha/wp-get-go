<?php
/**
 * Register any necessary taxonomies to be used throughout the build
 */
	function register_taxonomies() {
		$taxonomies = array();

		if (!empty($taxonomies)) {
			foreach ($taxonomies as $name => $args) {
				register_taxonomy($name, $args['post_types'], $args['args']);
			}
		}
	}