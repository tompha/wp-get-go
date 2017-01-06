<?php get_header(); ?>

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		<main id="site-content" class="home"></main>
	<?php endwhile; endif; ?>

<?php get_footer(); ?>