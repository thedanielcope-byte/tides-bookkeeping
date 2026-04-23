<?php get_header(); the_post(); ?>

<!-- Post Hero -->
<section class="post-hero">
  <div class="container">
    <div class="post-hero-inner">
      <?php
        $cats = get_the_category();
        if ($cats) :
      ?>
        <span class="post-hero-cat"><?php echo esc_html($cats[0]->name); ?></span>
      <?php endif; ?>
      <h1 class="display"><?php the_title(); ?></h1>
      <div class="post-hero-meta">
        <span>📅 <?php echo get_the_date('F j, Y'); ?></span>
        <span>⏱ <?php echo tides_reading_time(); ?></span>
        <span>✍️ <?php the_author(); ?></span>
      </div>
    </div>
  </div>
</section>

<?php if (has_post_thumbnail()) : ?>
  <?php the_post_thumbnail('full', ['class' => 'post-featured-img']); ?>
<?php endif; ?>

<!-- Post Content -->
<section class="section">
  <div class="container">
    <div class="post-layout">

      <!-- Main Content -->
      <div class="post-content-area">
        <div class="post-body">
          <?php the_content(); ?>
        </div>

        <!-- Tags -->
        <?php
          $tags = get_the_tags();
          if ($tags) :
        ?>
          <div class="post-tags">
            <?php foreach ($tags as $tag) : ?>
              <a href="<?php echo get_tag_link($tag->term_id); ?>" class="post-tag"><?php echo esc_html($tag->name); ?></a>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>

        <!-- Prev / Next -->
        <?php
          $prev = get_previous_post();
          $next = get_next_post();
          if ($prev || $next) :
        ?>
          <div class="post-nav">
            <?php if ($prev) : ?>
              <a href="<?php echo get_permalink($prev->ID); ?>" class="post-nav-item prev">
                <div class="post-nav-label">← Previous</div>
                <div class="post-nav-title"><?php echo get_the_title($prev->ID); ?></div>
              </a>
            <?php else : ?>
              <div></div>
            <?php endif; ?>
            <?php if ($next) : ?>
              <a href="<?php echo get_permalink($next->ID); ?>" class="post-nav-item next">
                <div class="post-nav-label">Next →</div>
                <div class="post-nav-title"><?php echo get_the_title($next->ID); ?></div>
              </a>
            <?php endif; ?>
          </div>
        <?php endif; ?>
      </div>

      <!-- Sidebar -->
      <aside class="post-sidebar">

        <!-- CTA Widget -->
        <div class="sidebar-widget sidebar-cta">
          <h4>Free Consultation</h4>
          <p>Get clean books every month. Flat rate, no contracts, one dedicated bookkeeper.</p>
          <a href="https://tidesbookkeeping.com/schedule" class="btn btn-teal">Book Free Call →</a>
        </div>

        <!-- Recent Posts Widget -->
        <?php
          $recent = get_posts(['numberposts' => 4, 'exclude' => [get_the_ID()]]);
          if ($recent) :
        ?>
          <div class="sidebar-widget">
            <h4>Recent Posts</h4>
            <?php foreach ($recent as $post) : setup_postdata($post); ?>
              <div class="sidebar-post">
                <?php if (has_post_thumbnail($post->ID)) : ?>
                  <?php echo get_the_post_thumbnail($post->ID, 'thumbnail', ['class' => 'sidebar-post-thumb']); ?>
                <?php else : ?>
                  <div class="sidebar-post-thumb" style="background:var(--bg-alt);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;">📊</div>
                <?php endif; ?>
                <div>
                  <div class="sidebar-post-title">
                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                  </div>
                  <div class="sidebar-post-date"><?php echo get_the_date('M j, Y'); ?></div>
                </div>
              </div>
            <?php endforeach; wp_reset_postdata(); ?>
          </div>
        <?php endif; ?>

        <!-- Services Widget -->
        <div class="sidebar-widget">
          <h4>Our Services</h4>
          <ul class="footer-links" style="margin:0;">
            <li><a href="https://tidesbookkeeping.com/service-monthly-bookkeeping" style="color:var(--body);">Monthly Bookkeeping</a></li>
            <li><a href="https://tidesbookkeeping.com/service-catchup-bookkeeping" style="color:var(--body);">Catch-Up Bookkeeping</a></li>
            <li><a href="https://tidesbookkeeping.com/service-payroll" style="color:var(--body);">Payroll Support</a></li>
            <li><a href="https://tidesbookkeeping.com/service-financial-reporting" style="color:var(--body);">Financial Reporting</a></li>
            <li><a href="https://tidesbookkeeping.com/service-software-setup" style="color:var(--body);">QuickBooks Setup</a></li>
          </ul>
        </div>

      </aside>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="container">
    <div class="cta-inner">
      <div class="eyebrow" style="color:var(--teal);background:rgba(65,207,208,.12);border-color:rgba(65,207,208,.3);margin:0 auto 1.5rem;">Get Started Today</div>
      <h2 class="display">Ready to Stop Stressing<br/>About Your Books?</h2>
      <p>Schedule a free 15-minute consultation. We'll review your situation and give you a clear picture of what clean books look like for your business.</p>
      <div class="cta-actions">
        <a href="https://tidesbookkeeping.com/schedule" class="btn btn-teal btn-lg">Book Free Consultation</a>
        <a href="https://tidesbookkeeping.com/pricing" class="btn btn-outline-white btn-lg">View Pricing</a>
      </div>
      <p class="cta-note">No setup fees &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; First month guaranteed</p>
    </div>
  </div>
</section>

<?php get_footer(); ?>
