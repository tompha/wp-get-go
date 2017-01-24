<?php
class Theme {
    public static function enqueueStyle(
        $name,
        $source,
        $external = false,
        $dependencies = array(),
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
        $dependencies = array(),
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

    public static function getImage($name, $extension) {
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

    public static function obfuscate($string) {
        if (strlen($string) > 0) {
            $obfuscation = array();

            for ($i = 0; $i < strlen($string); $i++) {
                $obfuscation[] = sprintf('&#%s;', ord($string[$i]));
            }

            return implode('', $obfuscation);
        }

        return $string;
    }

    public static function __return_low() {
        return 'low';
    }

    public static function __return_high() {
        return 'high';
    }
}