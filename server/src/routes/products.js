import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Helper to map DB row to frontend Product type
export const mapProductRow = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  category: row.category_id || row.category,
  categoryName: row.category_name,
  collection: row.collection,
  tagline: row.tagline || '',
  price: Number(row.price),
  originalPrice: Number(row.original_price || row.price),
  discountPercentage: Number(row.discount_percentage || 0),
  rating: Number(row.rating || 5.0),
  reviewsCount: Number(row.reviews_count || 0),
  images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? JSON.parse(row.images) : []),
  isNew: !!row.is_new,
  isBestSeller: !!row.is_best_seller,
  isAntiTarnish: !!row.is_anti_tarnish,
  isWaterproof: !!row.is_waterproof,
  isHypoallergenic: !!row.is_hypoallergenic,
  material: row.material || '',
  baseMetal: row.base_metal || '',
  coating: row.coating || '',
  finishes: Array.isArray(row.finishes) ? row.finishes : (typeof row.finishes === 'string' ? JSON.parse(row.finishes) : ['18K Yellow Gold']),
  availableSizes: Array.isArray(row.available_sizes) ? row.available_sizes : (typeof row.available_sizes === 'string' ? JSON.parse(row.available_sizes) : []),
  dimensions: row.dimensions || '',
  weight: row.weight || '',
  description: row.description || '',
  features: Array.isArray(row.features) ? row.features : (typeof row.features === 'string' ? JSON.parse(row.features) : []),
  careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : (typeof row.care_instructions === 'string' ? JSON.parse(row.care_instructions) : []),
  inStock: !!row.in_stock,
  stockCount: Number(row.stock_count || 50),
  sku: row.sku || '',
  createdAt: row.created_at,
});

// GET /api/v1/products - List products with filter, search, sort, pagination
router.get('/', async (req, res) => {
  try {
    const {
      category,
      collection,
      search,
      minPrice,
      maxPrice,
      inStock,
      minRating,
      sortBy,
      page = 1,
      limit = 50,
    } = req.query;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Filter by Category
    if (category && category !== 'all') {
      conditions.push(`category_id = $${paramIndex++}`);
      values.push(category);
    }

    // Filter by Collection
    if (collection && collection !== 'all') {
      if (collection === 'anti-tarnish') {
        conditions.push(`is_anti_tarnish = true`);
      } else if (collection === 'new-arrivals') {
        conditions.push(`is_new = true`);
      } else if (collection === 'best-sellers') {
        conditions.push(`is_best_seller = true`);
      } else if (collection === 'minimalist') {
        conditions.push(`collection = 'minimalist'`);
      } else {
        conditions.push(`collection = $${paramIndex++}`);
        values.push(collection);
      }
    }

    // Filter by Search Query
    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      conditions.push(`(
        LOWER(name) LIKE $${paramIndex} OR
        LOWER(category_name) LIKE $${paramIndex} OR
        LOWER(description) LIKE $${paramIndex} OR
        LOWER(material) LIKE $${paramIndex} OR
        LOWER(sku) LIKE $${paramIndex}
      )`);
      values.push(q);
      paramIndex++;
    }

    // Filter by Price Range
    if (minPrice) {
      conditions.push(`price >= $${paramIndex++}`);
      values.push(Number(minPrice));
    }
    if (maxPrice) {
      conditions.push(`price <= $${paramIndex++}`);
      values.push(Number(maxPrice));
    }

    // Filter by Stock Status
    if (inStock === 'true' || inStock === true) {
      conditions.push(`in_stock = true`);
    }

    // Filter by Rating
    if (minRating) {
      conditions.push(`rating >= $${paramIndex++}`);
      values.push(Number(minRating));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    let orderBy = 'ORDER BY created_at DESC';
    if (sortBy) {
      switch (sortBy) {
        case 'price-low-high':
          orderBy = 'ORDER BY price ASC';
          break;
        case 'price-high-low':
          orderBy = 'ORDER BY price DESC';
          break;
        case 'newest':
          orderBy = 'ORDER BY is_new DESC, created_at DESC';
          break;
        case 'rating':
        case 'best-rated':
          orderBy = 'ORDER BY rating DESC';
          break;
        case 'bestseller':
        case 'most-popular':
          orderBy = 'ORDER BY is_best_seller DESC, rating DESC';
          break;
        default:
          orderBy = 'ORDER BY created_at DESC';
      }
    }

    // Get Total Count
    const countSql = `SELECT COUNT(*)::int as total FROM products ${whereClause}`;
    const countResult = await query(countSql, values);
    const total = countResult.rows[0].total;

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const offset = (pageNum - 1) * limitNum;
    const totalPages = Math.ceil(total / limitNum);

    const dataSql = `
      SELECT * FROM products
      ${whereClause}
      ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    values.push(limitNum, offset);

    const result = await query(dataSql, values);
    const products = result.rows.map(mapProductRow);

    res.json({
      success: true,
      data: products,
      total,
      page: pageNum,
      totalPages,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
});

// GET /api/v1/products/:idOrSlug - Single product
router.get('/:idOrSlug', async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.idOrSlug).toLowerCase().trim();
    const normalized = raw.replace(/^-+|-+$/g, '');

    const sql = `
      SELECT * FROM products
      WHERE LOWER(id) = $1
         OR LOWER(slug) = $1
         OR LOWER(slug) = $2
         OR (LENGTH($2) >= 3 AND LOWER(slug) LIKE '%' || $2 || '%')
      LIMIT 1
    `;
    const result = await query(sql, [raw, normalized]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: mapProductRow(result.rows[0]),
    });
  } catch (err) {
    console.error('Error fetching product by ID/slug:', err);
    res.status(500).json({ success: false, message: 'Server error fetching product' });
  }
});

// POST /api/v1/products - Create new product (Admin)
router.post('/', async (req, res) => {
  try {
    const p = req.body;
    const id = p.id || `aur-custom-${Date.now()}`;
    const slug = p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}`);

    const sql = `
      INSERT INTO products (
        id, name, slug, category_id, category_name, collection, tagline,
        price, original_price, discount_percentage, rating, reviews_count,
        images, is_new, is_best_seller, is_anti_tarnish, is_waterproof,
        is_hypoallergenic, material, base_metal, coating, finishes,
        available_sizes, dimensions, weight, description, features,
        care_instructions, in_stock, stock_count, sku
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22,
        $23, $24, $25, $26, $27,
        $28, $29, $30, $31
      ) RETURNING *
    `;

    const values = [
      id,
      p.name || 'Untitled Jewelry',
      slug,
      p.category || 'necklaces',
      p.categoryName || (p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Fine Jewelry'),
      p.collection || null,
      p.tagline || '',
      Number(p.price) || 0,
      Number(p.originalPrice || p.price || 0),
      Number(p.discountPercentage || 0),
      Number(p.rating || 5.0),
      Number(p.reviewsCount || 0),
      JSON.stringify(p.images || []),
      !!p.isNew,
      !!p.isBestSeller,
      p.isAntiTarnish !== undefined ? !!p.isAntiTarnish : true,
      p.isWaterproof !== undefined ? !!p.isWaterproof : true,
      p.isHypoallergenic !== undefined ? !!p.isHypoallergenic : true,
      p.material || '316L Surgical Stainless Steel',
      p.baseMetal || 'Surgical Steel',
      p.coating || '18K Gold Vacuum PVD',
      JSON.stringify(p.finishes || ['18K Yellow Gold']),
      JSON.stringify(p.availableSizes || []),
      p.dimensions || '',
      p.weight || '',
      p.description || '',
      JSON.stringify(p.features || []),
      JSON.stringify(p.careInstructions || []),
      p.inStock !== undefined ? !!p.inStock : true,
      Number(p.stockCount || 50),
      p.sku || `AUR-${id.toUpperCase()}`
    ];

    const result = await query(sql, values);

    // Update category item count
    await query(`
      UPDATE categories SET item_count = (SELECT COUNT(*)::int FROM products WHERE category_id = $1) WHERE id = $1
    `, [p.category || 'necklaces']);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: mapProductRow(result.rows[0]),
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: 'Server error creating product' });
  }
});

// PUT /api/v1/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;

    const sql = `
      UPDATE products SET
        name = COALESCE($1, name),
        category_id = COALESCE($2, category_id),
        category_name = COALESCE($3, category_name),
        price = COALESCE($4, price),
        original_price = COALESCE($5, original_price),
        discount_percentage = COALESCE($6, discount_percentage),
        tagline = COALESCE($7, tagline),
        description = COALESCE($8, description),
        images = COALESCE($9, images),
        in_stock = COALESCE($10, in_stock),
        stock_count = COALESCE($11, stock_count),
        is_new = COALESCE($12, is_new),
        is_best_seller = COALESCE($13, is_best_seller),
        is_anti_tarnish = COALESCE($14, is_anti_tarnish),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *
    `;

    const values = [
      p.name,
      p.category,
      p.categoryName,
      p.price !== undefined ? Number(p.price) : null,
      p.originalPrice !== undefined ? Number(p.originalPrice) : null,
      p.discountPercentage !== undefined ? Number(p.discountPercentage) : null,
      p.tagline,
      p.description,
      p.images ? JSON.stringify(p.images) : null,
      p.inStock !== undefined ? !!p.inStock : null,
      p.stockCount !== undefined ? Number(p.stockCount) : null,
      p.isNew !== undefined ? !!p.isNew : null,
      p.isBestSeller !== undefined ? !!p.isBestSeller : null,
      p.isAntiTarnish !== undefined ? !!p.isAntiTarnish : null,
      id
    ];

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: mapProductRow(result.rows[0]),
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Server error updating product' });
  }
});

// DELETE /api/v1/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING category_id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const catId = result.rows[0].category_id;
    if (catId) {
      await query(`
        UPDATE categories SET item_count = (SELECT COUNT(*)::int FROM products WHERE category_id = $1) WHERE id = $1
      `, [catId]);
    }

    res.json({ success: true, message: 'Product removed from catalog' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
});

export default router;
