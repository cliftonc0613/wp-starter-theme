<?php
/**
 * Starter WP Theme functions and definitions
 *
 * @package Starter_WP_Theme
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Constants
 */
define('STARTER_THEME_VERSION', '1.0.0');
define('STARTER_THEME_DIR', get_template_directory());
define('STARTER_THEME_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function starter_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));

    // Add support for editor styles
    add_theme_support('editor-styles');

    // Add support for responsive embeds
    add_theme_support('responsive-embeds');

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'starter-wp-theme'),
        'footer'  => __('Footer Menu', 'starter-wp-theme'),
    ));

    // Set content width
    if (!isset($content_width)) {
        $content_width = 1200;
    }
}
add_action('after_setup_theme', 'starter_theme_setup');

/**
 * Enqueue Scripts and Styles
 */
function starter_theme_scripts() {
    // Enqueue main stylesheet
    wp_enqueue_style(
        'starter-theme-style',
        get_stylesheet_uri(),
        array(),
        STARTER_THEME_VERSION
    );
}
add_action('wp_enqueue_scripts', 'starter_theme_scripts');

/**
 * ACF JSON Save Point
 * Save ACF field groups to theme directory for version control
 */
function starter_theme_acf_json_save_point($path) {
    return STARTER_THEME_DIR . '/acf-json';
}
add_filter('acf/settings/save_json', 'starter_theme_acf_json_save_point');

/**
 * ACF JSON Load Point
 * Load ACF field groups from theme directory
 */
function starter_theme_acf_json_load_point($paths) {
    // Remove original path
    unset($paths[0]);

    // Add theme path
    $paths[] = STARTER_THEME_DIR . '/acf-json';

    return $paths;
}
add_filter('acf/settings/load_json', 'starter_theme_acf_json_load_point');

/**
 * Add ACF fields to REST API response
 */
function starter_theme_add_acf_to_rest() {
    // Get all public post types
    $post_types = get_post_types(array('public' => true), 'names');

    foreach ($post_types as $post_type) {
        register_rest_field(
            $post_type,
            'acf',
            array(
                'get_callback' => function($object) {
                    return get_fields($object['id']);
                },
                'schema' => null,
            )
        );
    }
}
add_action('rest_api_init', 'starter_theme_add_acf_to_rest');

/**
 * Add featured image URL to REST API response
 */
function starter_theme_add_featured_image_to_rest() {
    $post_types = get_post_types(array('public' => true), 'names');

    foreach ($post_types as $post_type) {
        register_rest_field(
            $post_type,
            'featured_image_url',
            array(
                'get_callback' => function($object) {
                    if ($object['featured_media']) {
                        $img = wp_get_attachment_image_src($object['featured_media'], 'full');
                        return $img ? $img[0] : null;
                    }
                    return null;
                },
                'schema' => null,
            )
        );
    }
}
add_action('rest_api_init', 'starter_theme_add_featured_image_to_rest');

/**
 * Enable CORS for REST API (development only)
 * Remove or restrict in production
 */
function starter_theme_cors_headers() {
    // Only enable for development
    if (defined('WP_DEBUG') && WP_DEBUG) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
}
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        starter_theme_cors_headers();
        return $value;
    });
});

/**
 * Customize REST API response for better Next.js integration
 * Add author name directly to post response
 */
function starter_theme_add_author_to_rest() {
    register_rest_field(
        'post',
        'author_name',
        array(
            'get_callback' => function($object) {
                return get_the_author_meta('display_name', $object['author']);
            },
            'schema' => null,
        )
    );
}
add_action('rest_api_init', 'starter_theme_add_author_to_rest');

/**
 * Modify preview link to point to Next.js frontend
 */
function starter_theme_preview_link($preview_link, $post) {
    // Get the Next.js frontend URL from environment or options
    $frontend_url = defined('STARTER_FRONTEND_URL')
        ? STARTER_FRONTEND_URL
        : get_option('starter_frontend_url', 'http://localhost:3000');

    $preview_secret = defined('STARTER_PREVIEW_SECRET')
        ? STARTER_PREVIEW_SECRET
        : get_option('starter_preview_secret', 'preview-secret');

    // Build the preview URL
    $slug = $post->post_name;
    $post_type = $post->post_type;

    // Map post types to frontend routes
    $route_map = array(
        'post'         => 'blog',
        'page'         => '',
        'services'     => 'services',
        'testimonials' => 'testimonials',
    );

    $route = isset($route_map[$post_type]) ? $route_map[$post_type] : $post_type;
    $path = $route ? "/{$route}/{$slug}" : "/{$slug}";

    return add_query_arg(
        array(
            'secret' => $preview_secret,
            'slug'   => $slug,
            'id'     => $post->ID,
        ),
        $frontend_url . '/api/preview'
    );
}
add_filter('preview_post_link', 'starter_theme_preview_link', 10, 2);

/**
 * Disable Gutenberg for this headless theme (optional)
 * Uncomment if you prefer the classic editor
 */
// add_filter('use_block_editor_for_post', '__return_false');

/**
 * Include additional functionality files
 */
// Uncomment when files are created:
// require_once STARTER_THEME_DIR . '/inc/rest-api.php';
// require_once STARTER_THEME_DIR . '/inc/acf-fields.php';
