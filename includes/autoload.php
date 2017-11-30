<?php
/**
 * Autoload any necessary files from the specified directories
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
