<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<nav class="nav-wrap">
  <div class="nav-inner">
    <div class="nav-logo">
      <a href="https://tidesbookkeeping.com/">
        <img src="<?php echo get_template_directory_uri(); ?>/logo.png" alt="Tides Bookkeeping" />
      </a>
    </div>
    <ul class="nav-links" id="navLinks">
      <li><a href="https://tidesbookkeeping.com/#how-it-works">How It Works</a></li>
      <li><a href="https://tidesbookkeeping.com/services">Services</a></li>
      <li><a href="https://tidesbookkeeping.com/who-we-serve">Who We Serve</a></li>
      <li><a href="https://tidesbookkeeping.com/about">About Us</a></li>
      <li><a href="https://tidesbookkeeping.com/contact">Contact Us</a></li>
      <li><a href="https://tidesbookkeeping.com/pricing">Pricing</a></li>
      <li><a href="<?php echo home_url('/'); ?>" class="<?php echo is_home() || is_singular('post') ? 'current' : ''; ?>">Blog</a></li>
      <li class="nav-mobile-cta"><a href="https://tidesbookkeeping.com/schedule">Book Appointment</a></li>
    </ul>
    <div class="nav-cta">
      <a href="#" class="btn btn-outline">Sign In</a>
      <a href="https://tidesbookkeeping.com/schedule" class="btn btn-primary">Book Appointment</a>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
