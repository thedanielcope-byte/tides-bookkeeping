<?php get_header(); ?>

<!-- Blog Hero -->
<section class="blog-hero">
  <div class="container">
    <div class="blog-hero-inner">
      <div class="eyebrow" style="color:var(--teal);background:rgba(65,207,208,.12);border-color:rgba(65,207,208,.3);">Tides Bookkeeping Blog</div>
      <h1 class="display">Bookkeeping Insights<br/>for Small Business.</h1>
      <p>Practical tips, financial guides, and local business resources — written for small business owners across South Carolina and beyond.</p>
    </div>
  </div>
</section>

<!-- Posts -->
<section class="section">
  <div class="container">
    <?php if (have_posts()) : ?>
      <div class="posts-grid">
        <?php $count = 0; while (have_posts()) : the_post(); $count++; ?>

          <article class="post-card <?php echo $count === 1 ? 'featured-post' : ''; ?>">
            <?php if (has_post_thumbnail()) : ?>
              <?php the_post_thumbnail('large', ['class' => 'post-card-img', 'alt' => get_the_title()]); ?>
            <?php else : ?>
              <div class="post-card-img-placeholder">📊</div>
            <?php endif; ?>
            <div class="post-card-body">
              <?php
                $cats = get_the_category();
                if ($cats) :
              ?>
                <span class="post-card-cat"><?php echo esc_html($cats[0]->name); ?></span>
              <?php endif; ?>
              <h2 class="post-card-title">
                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
              </h2>
              <div class="post-card-excerpt"><?php the_excerpt(); ?></div>
              <div class="post-card-meta">
                <span class="post-card-date"><?php echo get_the_date('M j, Y'); ?></span>
                <a href="<?php the_permalink(); ?>" class="post-card-read">
                  Read article →
                </a>
              </div>
            </div>
          </article>

        <?php endwhile; ?>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <?php
          echo paginate_links([
            'prev_text' => '←',
            'next_text' => '→',
            'type'      => 'list',
          ]);
        ?>
      </div>

    <?php else : ?>
      <div style="text-align:center;padding:4rem 0;">
        <div class="eyebrow" style="justify-content:center;">Coming Soon</div>
        <h2 style="font-family:'Bebas Neue',sans-serif;font-size:3rem;margin-bottom:1rem;">First Post Coming Soon.</h2>
        <p style="max-width:480px;margin:0 auto 2rem;">We're working on bookkeeping guides, tips, and local business resources. Check back soon.</p>
        <a href="https://tidesbookkeeping.com/schedule" class="btn btn-primary">Book a Free Consultation</a>
      </div>
    <?php endif; ?>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="container">
    <div class="cta-inner">
      <div class="eyebrow" style="color:var(--teal);background:rgba(65,207,208,.12);border-color:rgba(65,207,208,.3);margin:0 auto 1.5rem;">Get Started Today</div>
      <h2 class="display">Ready for Clean Books<br/>Every Month?</h2>
      <p>Schedule a free 15-minute consultation. Flat monthly rate, no contracts, one dedicated bookkeeper.</p>
      <div class="cta-actions">
        <a href="https://tidesbookkeeping.com/schedule" class="btn btn-teal btn-lg">Book Free Consultation</a>
        <a href="https://tidesbookkeeping.com/pricing" class="btn btn-outline-white btn-lg">View Pricing</a>
      </div>
      <p class="cta-note">No setup fees &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; First month guaranteed</p>
    </div>
  </div>
</section>

<?php get_footer(); ?>
