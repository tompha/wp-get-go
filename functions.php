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
 * @param bool $wrap Whether the blocks should be wrapped with another element
 * @param array $classes Any additional classes to put on the wrapper
 * @return void
 */
function output_flexible_layout_blocks($id = null, $wrap = true, $classes = []) {
    if ($id === null) {
        $id = get_the_ID();
    }

    $blocks = get_field('page_builder_blocks', $id);

    if ($blocks) {
        $block_wrapper = '%s';
        $block_markup = [];

        foreach ($blocks as $block) {
            $name = $block['acf_fc_layout'];

            if (page_builder_block_exists($name)) {
                ob_start();
                set_query_var('block', (object)$block);
                get_template_part('resources/page-builder/' . $name);
            }

            $block_markup[] = ob_get_clean();
        }

        if ($wrap === true) {
            $classes = array_merge(['page-blocks'], $classes);
            $block_wrapper = '<div class="page-blocks">%s</div>';
        }

        echo sprintf($block_wrapper, implode('', $block_markup));
    }
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

/**
 * Get a theme-specific setting from the theme options page
 * 
 * @param string $name
 * @param string $scope
 * @return mixed
 */
function get_theme_option($name, $scope) {
    return get_field('option_' . $scope . '_' . $name, 'option');
}
