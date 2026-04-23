<?php get_header(); the_post(); ?>

<!-- Page Hero -->
<section class="post-hero">
  <div class="container">
    <div class="post-hero-inner">
      <h1 class="display"><?php the_title(); ?></h1>
    </div>
  </div>
</section>

<!-- Page Content -->
<section class="section">
  <div class="container">
    <div class="page-content">
      <?php the_content(); ?>
    </div>
  </div>
</section>

<?php get_footer(); ?>
