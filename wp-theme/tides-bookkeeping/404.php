<?php get_header(); ?>

<!-- 404 Hero -->
<section class="post-hero">
  <div class="container">
    <div class="post-hero-inner" style="text-align:center;">
      <span class="post-hero-cat">404 Error</span>
      <h1 class="display">Page Not Found.</h1>
      <p style="color:rgba(255,255,255,.75);font-size:1.1rem;max-width:480px;margin:1rem auto 0;">
        The page you're looking for doesn't exist or has been moved.
      </p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container" style="text-align:center;padding:3rem 0;">
    <a href="<?php echo home_url('/'); ?>" class="btn btn-primary" style="margin-right:1rem;">← Back to Blog</a>
    <a href="https://tidesbookkeeping.com/" class="btn btn-outline">Go to Main Site</a>
  </div>
</section>

<?php get_footer(); ?>
