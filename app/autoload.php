<?php
/**
 * Autoload any necessary files from the specified directories
 *
 * @package Theme
 * @since   1.0.0
 */
$directories = ['classes', 'theme', 'ajax'];

foreach ($directories as $directory) {
    $path = __DIR__ . '/' . $directory;

    if (file_exists($path)) {
        $files = glob($path . '/*.php');

        if (!empty($files)) {
            foreach ($files as $file) {
                require_once $file;
            }
        }
    }
}
