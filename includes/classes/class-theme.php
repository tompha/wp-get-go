<?php
namespace Theme;

class Theme {
	public static function enqueueStyle(
		$name,
		$source,
		$external = false,
		$dependecies = array(),
		$version = '1.0.0'
	) {
		if ($external == false) {
			$source = self::getStylesheet($source);

			if ($source == false) {
				return false;
			}
		}

		wp_enqueue_style($name, $source, $dependencies, $version);
	}

	public static function enqueueScript(
		$name,
		$source,
		$external = false,
		$dependecies = array(),
		$version = '1.0.0',
		$inFooter = false
	) {
		if ($external == false) {
			$source = self::getScript($source);

			if ($source == false) {
				return false;
			}
		}

		wp_enqueue_script($name, $source, $dependencies, $version, $inFooter);
	}

	public static function getStylesheet($name) {
		$path = ASSETS_DIR . '/css/' . $name . '.css';
		return file_exists($path) ? ASSETS_URL . '/css/' . $name . '.css' : false;
	}

	public static function getScript($name) {
		$path = ASSETS_DIR . '/js/' . $name . '.js';
		return file_exists($path) ? ASSETS_URL . '/js/' . $name . '.js' : false;
	}

	public static function getImage($image) {
		$path = ASSETS_DIR . '/images/' . $name . '.' . $extension;
		return file_exists($path) ? ASSETS_URL . '/images/' . $name . '.' . $extension : false;
	}

	public static function debug($data, $function = 'print_r', $endScript = false) {
		if (!function_exists($function)) {
			return false;
		}

		echo '<pre class="debug">';
		$function($data);
		echo '</pre>';

		if ($endScript === true) {
			exit;
		}
	}
}