-- =========================================================
-- AURELIA JEWELRY — PostgreSQL Database Schema
-- =========================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    image TEXT,
    item_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100) NOT NULL,
    collection VARCHAR(100),
    tagline TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    discount_percentage INT DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    is_new BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_anti_tarnish BOOLEAN DEFAULT true,
    is_waterproof BOOLEAN DEFAULT true,
    is_hypoallergenic BOOLEAN DEFAULT true,
    material TEXT,
    base_metal TEXT,
    coating TEXT,
    finishes JSONB DEFAULT '[]'::jsonb,
    available_sizes JSONB DEFAULT '[]'::jsonb,
    dimensions TEXT,
    weight TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    care_instructions JSONB DEFAULT '[]'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    stock_count INT DEFAULT 50,
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    phone VARCHAR(50),
    avatar TEXT,
    role VARCHAR(50) DEFAULT 'customer',
    saved_addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS addresses (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    street TEXT NOT NULL,
    apartment TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
    items JSONB DEFAULT '[]'::jsonb,
    shipping_address JSONB NOT NULL,
    shipping_method VARCHAR(50) DEFAULT 'standard',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    coupon_code VARCHAR(50),
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Processing',
    tracking_number VARCHAR(100),
    estimated_delivery VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER ITEMS TABLE (Relational normalized details)
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    image TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    finish VARCHAR(100),
    size VARCHAR(50)
);

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(100) PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255),
    author VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    avatar TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    verified_purchase BOOLEAN DEFAULT true,
    likes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    code VARCHAR(50) PRIMARY KEY,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage' or 'flat'
    discount_value DECIMAL(10, 2) NOT NULL,
    min_spend DECIMAL(10, 2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    coupon_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
