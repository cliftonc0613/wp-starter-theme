<?php
/**
 * Main template file - Coming Soon Page
 *
 * A beautiful coming soon page for headless WordPress installations.
 * Settings managed via Settings → Homepage in the admin.
 *
 * @package Starter_WP_Theme
 * @version 1.2.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Get ACF fields
$logo = function_exists('get_field') ? get_field('homepage_logo', 'option') : '';
$title = function_exists('get_field') ? get_field('homepage_title', 'option') : '';
$intro = function_exists('get_field') ? get_field('homepage_intro', 'option') : '';
$frontend_url = function_exists('get_field') ? get_field('homepage_frontend_url', 'option') : '';
$frontend_label = function_exists('get_field') ? get_field('homepage_frontend_label', 'option') : '';
$show_endpoints = function_exists('get_field') ? get_field('homepage_show_endpoints', 'option') : true;
$endpoints = function_exists('get_field') ? get_field('homepage_endpoints', 'option') : array();

// Defaults
if (empty($title)) $title = 'Coming Soon';
if (empty($intro)) $intro = '<p>Something amazing is in the works.</p>';
if (empty($frontend_url)) $frontend_url = defined('STARTER_FRONTEND_URL') ? STARTER_FRONTEND_URL : get_option('starter_frontend_url', '');
if (empty($frontend_label)) $frontend_label = 'Visit Site';

// Default endpoints
if (empty($endpoints) && $show_endpoints) {
    $endpoints = array(
        array('name' => 'Posts', 'path' => '/wp-json/wp/v2/posts'),
        array('name' => 'Pages', 'path' => '/wp-json/wp/v2/pages'),
        array('name' => 'Services', 'path' => '/wp-json/wp/v2/services'),
        array('name' => 'Testimonials', 'path' => '/wp-json/wp/v2/testimonials'),
        array('name' => 'Media', 'path' => '/wp-json/wp/v2/media'),
    );
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title><?php echo esc_html($title); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: #000;
            color: #fff;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Noise texture overlay */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            opacity: 0.03;
            pointer-events: none;
            z-index: 1;
        }

        /* Gradient glow */
        .glow {
            position: fixed;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            filter: blur(150px);
            opacity: 0.15;
            pointer-events: none;
        }

        .glow-1 {
            top: -200px;
            left: -200px;
            background: #fff;
            animation: pulse 8s ease-in-out infinite;
        }

        .glow-2 {
            bottom: -200px;
            right: -200px;
            background: #888;
            animation: pulse 8s ease-in-out infinite reverse;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(1.1); }
        }

        /* Main container */
        .container {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            text-align: center;
        }

        /* Logo */
        .logo {
            margin-bottom: 4rem;
            opacity: 0;
            animation: fadeUp 1s ease forwards;
        }

        .logo img {
            height: 40px;
            width: auto;
            filter: brightness(0) invert(1);
        }

        /* Title */
        .title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(4rem, 15vw, 10rem);
            font-weight: 500;
            letter-spacing: -0.04em;
            line-height: 0.9;
            margin-bottom: 2rem;
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.2s;
        }

        /* Intro */
        .intro {
            max-width: 400px;
            font-size: 1.125rem;
            line-height: 1.7;
            color: rgba(255,255,255,0.5);
            margin-bottom: 3rem;
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.4s;
        }

        .intro p { margin: 0; }

        /* CTA Button */
        .cta {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            background: #fff;
            color: #000;
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            border-radius: 100px;
            transition: all 0.3s ease;
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.6s;
        }

        .cta:hover {
            transform: scale(1.05);
            box-shadow: 0 0 60px rgba(255,255,255,0.3);
        }

        .cta svg {
            width: 16px;
            height: 16px;
            transition: transform 0.3s ease;
        }

        .cta:hover svg {
            transform: translateX(4px);
        }

        /* API Section */
        .api-section {
            margin-top: 4rem;
            padding-top: 3rem;
            border-top: 1px solid rgba(255,255,255,0.08);
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.8s;
        }

        .api-header {
            margin-bottom: 1.5rem;
        }

        .api-label {
            font-size: 0.625rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: rgba(255,255,255,0.35);
        }

        .api-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
        }

        .api-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 100px;
            color: rgba(255,255,255,0.5);
            font-size: 0.75rem;
            text-decoration: none;
            transition: all 0.2s ease;
        }

        .api-chip:hover {
            background: rgba(255,255,255,0.08);
            border-color: rgba(255,255,255,0.15);
            color: rgba(255,255,255,0.8);
        }

        .api-chip code {
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 0.6875rem;
            color: rgba(255,255,255,0.4);
        }

        .api-chip:hover code {
            color: rgba(255,255,255,0.6);
        }

        /* Footer */
        .footer {
            margin-top: 4rem;
            padding-top: 2rem;
            text-align: center;
            opacity: 0;
            animation: fadeIn 1s ease forwards 1s;
        }

        .footer a {
            color: rgba(255,255,255,0.3);
            font-size: 0.75rem;
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .footer a:hover {
            color: rgba(255,255,255,0.6);
        }

        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @media (max-width: 640px) {
            .footer { flex-direction: column; gap: 1rem; text-align: center; }
            .api-panel { right: 1rem; left: 1rem; width: auto; bottom: 6rem; }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>
<body>
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>

    <main class="container">
        <?php if ($logo): ?>
            <div class="logo">
                <img src="<?php echo esc_url($logo); ?>" alt="">
            </div>
        <?php endif; ?>

        <h1 class="title"><?php echo esc_html($title); ?></h1>

        <div class="intro"><?php echo wp_kses_post($intro); ?></div>

        <?php if ($frontend_url): ?>
            <a href="<?php echo esc_url($frontend_url); ?>" class="cta">
                <?php echo esc_html($frontend_label); ?>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </a>
        <?php endif; ?>

        <?php if ($show_endpoints && !empty($endpoints)): ?>
            <div class="api-section">
                <div class="api-header">
                    <span class="api-label">REST API Endpoints</span>
                </div>
                <div class="api-grid">
                    <?php foreach ($endpoints as $ep): ?>
                        <a href="<?php echo esc_url(home_url($ep['path'])); ?>" target="_blank" class="api-chip">
                            <?php echo esc_html($ep['name']); ?>
                            <code><?php echo esc_html($ep['path']); ?></code>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <footer class="footer">
            <a href="<?php echo esc_url(admin_url()); ?>">WordPress Admin</a>
</body>
</html>
