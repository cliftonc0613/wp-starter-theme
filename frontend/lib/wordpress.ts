/**
 * WordPress API Functions
 * Fetch functions for interacting with the WordPress REST API
 */

// Read env var dynamically each time (not cached at module load)
function getWordPressApiUrl(): string | undefined {
  return process.env.WORDPRESS_API_URL;
}

// Validation helper - throws clear error if API URL is not configured
function getApiUrl(): string {
  const url = getWordPressApiUrl();
  if (!url) {
    throw new Error(
      'WORDPRESS_API_URL environment variable is not set. ' +
      'Please set it in your .env.local file or Vercel environment variables. ' +
      'Example: https://your-site.com/wp-json/wp/v2'
    );
  }
  return url;
}

// Check if WordPress API is configured (useful for build-time checks)
export function isWordPressConfigured(): boolean {
  return !!getWordPressApiUrl();
}

// =============================================================================
// TypeScript Interfaces
// =============================================================================

/**
 * WordPress Media/Image
 */
export interface WPImage {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full?: string;
  };
}

/**
 * ACF Image Field (from REST API)
 */
export interface ACFImage {
  ID: number;
  id: number;
  title: string;
  filename: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes: {
    thumbnail: string;
    'thumbnail-width': number;
    'thumbnail-height': number;
    medium: string;
    'medium-width': number;
    'medium-height': number;
    large: string;
    'large-width': number;
    'large-height': number;
  };
}

/**
 * WordPress Post (Blog)
 */
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  author_name?: string;
  featured_media: number;
  featured_image_url?: string | null;
  categories: number[];
  tags: number[];
  acf?: Record<string, unknown>;
}

/**
 * WordPress Page
 */
export interface WPPage {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  featured_image_url?: string | null;
  parent: number;
  menu_order: number;
  template: string;
  acf?: Record<string, unknown>;
}

/**
 * Service Custom Post Type
 */
export interface WPService {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  featured_image_url?: string | null;
  acf?: ServiceACF;
}

/**
 * Service ACF Fields
 */
export interface ServiceACF {
  pricing?: string;
  duration?: string;
  features?: Array<{ feature: string }>;
  cta_text?: string;
  cta_link?: string;
}

/**
 * Testimonial Custom Post Type
 */
export interface WPTestimonial {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  featured_media: number;
  featured_image_url?: string | null;
  acf?: TestimonialACF;
}

/**
 * Testimonial ACF Fields
 */
export interface TestimonialACF {
  client_name?: string;
  company?: string;
  quote?: string;
  photo?: ACFImage | null;
  rating?: number;
  related_service?: WPService | null;
}

/**
 * WordPress Category
 */
export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  parent: number;
}

/**
 * WordPress Tag
 */
export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
}

// =============================================================================
// API Fetch Functions
// =============================================================================

/**
 * Generic fetch function with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Always fetch fresh data from WordPress
    ...options,
  });

  if (!response.ok) {
    throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// Posts (Blog)
// =============================================================================

/**
 * Fetch all blog posts
 */
export async function getPosts(params?: {
  per_page?: number;
  page?: number;
  categories?: number[];
  tags?: number[];
  exclude?: number[];
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<WPPost[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.categories?.length) queryParams.set('categories', params.categories.join(','));
  if (params?.tags?.length) queryParams.set('tags', params.tags.join(','));
  if (params?.exclude?.length) queryParams.set('exclude', params.exclude.join(','));
  if (params?.orderby) queryParams.set('orderby', params.orderby);
  if (params?.order) queryParams.set('order', params.order);

  // Always include _embed to get featured image data
  queryParams.set('_embed', 'true');

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPPost[]>(`/posts${query}`);
}

/**
 * Fetch a single blog post by slug
 */
export async function getPost(slug: string): Promise<WPPost | null> {
  const posts = await fetchAPI<WPPost[]>(`/posts?slug=${slug}&_embed=true`);
  return posts.length > 0 ? posts[0] : null;
}

/**
 * Fetch a single blog post by ID
 */
export async function getPostById(id: number): Promise<WPPost> {
  return fetchAPI<WPPost>(`/posts/${id}?_embed=true`);
}

// =============================================================================
// Pages
// =============================================================================

/**
 * Fetch all pages
 */
export async function getPages(params?: {
  per_page?: number;
  page?: number;
  parent?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<WPPage[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.parent !== undefined) queryParams.set('parent', params.parent.toString());
  if (params?.orderby) queryParams.set('orderby', params.orderby);
  if (params?.order) queryParams.set('order', params.order);

  queryParams.set('_embed', 'true');

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPPage[]>(`/pages${query}`);
}

/**
 * Fetch a single page by slug
 */
export async function getPage(slug: string): Promise<WPPage | null> {
  const pages = await fetchAPI<WPPage[]>(`/pages?slug=${slug}&_embed=true`);
  return pages.length > 0 ? pages[0] : null;
}

/**
 * Fetch a single page by ID
 */
export async function getPageById(id: number): Promise<WPPage> {
  return fetchAPI<WPPage>(`/pages/${id}?_embed=true`);
}

// =============================================================================
// Services (Custom Post Type)
// =============================================================================

/**
 * Fetch all services
 */
export async function getServices(params?: {
  per_page?: number;
  page?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<WPService[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.orderby) queryParams.set('orderby', params.orderby);
  if (params?.order) queryParams.set('order', params.order);

  queryParams.set('_embed', 'true');

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPService[]>(`/services${query}`);
}

/**
 * Fetch a single service by slug
 */
export async function getService(slug: string): Promise<WPService | null> {
  const services = await fetchAPI<WPService[]>(`/services?slug=${slug}&_embed=true`);
  return services.length > 0 ? services[0] : null;
}

/**
 * Fetch a single service by ID
 */
export async function getServiceById(id: number): Promise<WPService> {
  return fetchAPI<WPService>(`/services/${id}?_embed=true`);
}

// =============================================================================
// Testimonials (Custom Post Type)
// =============================================================================

/**
 * Fetch all testimonials
 */
export async function getTestimonials(params?: {
  per_page?: number;
  page?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<WPTestimonial[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.orderby) queryParams.set('orderby', params.orderby);
  if (params?.order) queryParams.set('order', params.order);

  queryParams.set('_embed', 'true');

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPTestimonial[]>(`/testimonials${query}`);
}

/**
 * Fetch a single testimonial by slug
 */
export async function getTestimonial(slug: string): Promise<WPTestimonial | null> {
  const testimonials = await fetchAPI<WPTestimonial[]>(`/testimonials?slug=${slug}&_embed=true`);
  return testimonials.length > 0 ? testimonials[0] : null;
}

/**
 * Fetch a single testimonial by ID
 */
export async function getTestimonialById(id: number): Promise<WPTestimonial> {
  return fetchAPI<WPTestimonial>(`/testimonials/${id}?_embed=true`);
}

// =============================================================================
// Categories & Tags
// =============================================================================

/**
 * Fetch all categories
 */
export async function getCategories(params?: {
  per_page?: number;
  hide_empty?: boolean;
}): Promise<WPCategory[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.hide_empty !== undefined) queryParams.set('hide_empty', params.hide_empty.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPCategory[]>(`/categories${query}`);
}

/**
 * Fetch all tags
 */
export async function getTags(params?: {
  per_page?: number;
  hide_empty?: boolean;
}): Promise<WPTag[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.hide_empty !== undefined) queryParams.set('hide_empty', params.hide_empty.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPTag[]>(`/tags${query}`);
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * URL mappings for development to production image rewrites
 * Configure via NEXT_PUBLIC_URL_REWRITES environment variable
 * Format: JSON object with local->production domain mappings
 * Example: {"http://local.site":"https://production.site"}
 */
function getUrlRewrites(): Record<string, string> {
  const envRewrites = process.env.NEXT_PUBLIC_URL_REWRITES;
  if (!envRewrites) return {};

  try {
    return JSON.parse(envRewrites);
  } catch {
    console.warn('Invalid NEXT_PUBLIC_URL_REWRITES format. Expected JSON object.');
    return {};
  }
}

/**
 * Rewrite image URLs from local/development domains to production
 * This handles cases where WordPress stores local URLs in the database
 */
export function rewriteImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const rewrites = getUrlRewrites();
  for (const [localDomain, productionDomain] of Object.entries(rewrites)) {
    if (url.startsWith(localDomain)) {
      return url.replace(localDomain, productionDomain);
    }
  }

  return url;
}

/**
 * Rewrite all image URLs in HTML content
 */
export function rewriteContentUrls(html: string): string {
  let result = html;

  const rewrites = getUrlRewrites();
  for (const [localDomain, productionDomain] of Object.entries(rewrites)) {
    result = result.replaceAll(localDomain, productionDomain);
  }

  return result;
}

/**
 * Strip HTML tags from string (for excerpts, etc.)
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Decode HTML entities
 */
export function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#8217;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&nbsp;': ' ',
  };

  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Format WordPress date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get reading time estimate from content
 */
export function getReadingTime(content: string): number {
  const text = stripHtml(content);
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
