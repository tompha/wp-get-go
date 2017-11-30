<!DOCTYPE html>
<html <?php language_attributes(); ?>>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title><?php echo wp_title(); ?></title>

        <?php wp_head(); ?>

        <script>
            window.App = <?= json_encode([
		        'urls'      => [
			        'site'  => home_url(),
			        'theme' => get_template_directory_uri(),
			        'ajax'  => admin_url('admin-ajax.php')
		        ],
		        'variables' => [
			        'debug'    => (bool) WP_DEBUG,
			        'loggedIn' => (bool) is_user_logged_in()
		        ],
		        'data'      => []
	        ]); ?>;
        </script>
    </head>

    <body <?php body_class(); ?>>
        <header id="site-header"></header>