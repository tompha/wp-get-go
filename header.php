<!DOCTYPE html>
<html <?php language_attributes(); ?>>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title><?php echo wp_title(); ?></title>

        <?php wp_head(); ?>

        <script>
            window.siteParameters = {
                url: '<?php bloginfo('url'); ?>',
                theme: '<?php echo get_template_directory_uri(); ?>',
                debug: parseInt('<?php echo WP_DEBUG ? 'true' : 'false'; ?>'),
                user_logged_in: parseInt('<?php echo is_user_logged_in() ? 'true' : 'false'; ?>')
            };
        </script>
    </head>

    <body <?php body_class(); ?>>
        <header id="site-header"></header>