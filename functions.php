<?php
/**
 * Here we're setting up some constants to use throughout the theme, and then autoloading
 * any necessary functionality from the "APP" directory.
 *
 * @package Theme
 * @since   1.0.0
 */
define('THEME_DIR', dirname(__FILE__));
define('ASSETS_DIR', THEME_DIR . '/public');
define('APP_DIR', THEME_DIR . '/app');
define('RESOURCE_DIR', THEME_DIR . '/resources');
define('THEME_URL', get_template_directory_uri());
define('ASSETS_URL', THEME_URL . '/public');

require_once APP_DIR . '/autoload.php';

/**
 * Output the current or specified post object's flexible layout blocks
 * 
 * @param int $id The post ID to find content for. Defaults to null.
 */
function output_flexible_layout_blocks($id = null) {
    if ($id === null) {
        $id = get_the_ID();
    }

    $output = '';
    $blocks = get_field('page_builder_blocks', $id);

    if ($blocks) {
        ob_start();

        foreach ($blocks as $block) {
            $name = $block['acf_fc_layout'];

            if (page_builder_block_exists($name)) {
                set_query_var('block', $block);
                get_template_part('resources/page-builder/' . $name);
            }

            $output = sprintf('<div class="page-blocks">%s</div>', ob_get_clean());
        }
    }

    echo $output;
}

/**
 * Check for the existence of the specified page builder block
 * 
 * @param string $name
 * @return bool
 */
function page_builder_block_exists($name) {
    return file_exists(RESOURCE_DIR . '/page-builder/' . $name . '.php');
}

/**
 * Format a telephone number to the UK link format
 * 
 * @param string $number
 * @return string
 */
function format_phone_link($number) {
    return sprintf('tel:+44%s', ltrim(str_replace(' ', '', $number), '0'));
}
