/*
  # Afro-Furniture Database Schema

  ## Overview
  Creates the core database structure for the Afro-Furniture e-commerce website
  including products, blog posts, and customer reviews.

  ## New Tables

  ### 1. `categories`
  Product categorization table
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name (e.g., "Sofas", "Tables", "Chairs")
  - `slug` (text, unique) - URL-friendly category name
  - `description` (text) - Category description
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. `products`
  Furniture product catalog
  - `id` (uuid, primary key) - Unique product identifier
  - `title` (text) - Product name
  - `slug` (text, unique) - URL-friendly product name
  - `description` (text) - Full product description
  - `short_description` (text) - Brief product summary
  - `price` (numeric) - Product price
  - `image_url` (text) - Main product image URL
  - `category_id` (uuid) - Foreign key to categories
  - `featured` (boolean) - Featured product flag
  - `in_stock` (boolean) - Stock availability
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `blog_posts`
  Blog content management
  - `id` (uuid, primary key) - Unique post identifier
  - `title` (text) - Blog post title
  - `slug` (text, unique) - URL-friendly post title
  - `content` (text) - Full blog post content
  - `excerpt` (text) - Short preview text
  - `cover_image_url` (text) - Featured image URL
  - `author` (text) - Author name
  - `category` (text) - Blog category
  - `published` (boolean) - Publication status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `reviews`
  Customer product reviews
  - `id` (uuid, primary key) - Unique review identifier
  - `product_id` (uuid) - Foreign key to products (nullable for general reviews)
  - `customer_name` (text) - Reviewer name
  - `rating` (integer) - Rating (1-5 stars)
  - `comment` (text) - Review text
  - `approved` (boolean) - Moderation approval status
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. `contact_submissions`
  Contact form submissions
  - `id` (uuid, primary key) - Unique submission identifier
  - `name` (text) - Submitter name
  - `email` (text) - Contact email
  - `message` (text) - Message content
  - `created_at` (timestamptz) - Submission timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Public read access for published content (products, blog posts, approved reviews)
  - Authenticated users can submit reviews and contact forms
  - Insert-only policies for user-generated content to prevent tampering

  ## Notes
  - All tables use UUID primary keys for security and scalability
  - Timestamps use `timestamptz` for timezone awareness
  - Boolean flags have sensible defaults
  - Foreign keys ensure referential integrity
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  short_description text DEFAULT '',
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  image_url text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  featured boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text DEFAULT '',
  excerpt text DEFAULT '',
  cover_image_url text DEFAULT '',
  author text DEFAULT 'Afro-Furniture Team',
  category text DEFAULT 'General',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- RLS Policies for blog_posts (public read published posts)
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- RLS Policies for reviews (public read approved reviews, anyone can insert)
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (approved = true);

CREATE POLICY "Anyone can submit reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- RLS Policies for contact_submissions (anyone can insert)
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved) WHERE approved = true;