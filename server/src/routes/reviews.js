import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

const mapReviewRow = (row) => ({
  id: row.id,
  productId: row.product_id,
  productName: row.product_name,
  author: row.author,
  location: row.location || 'India',
  avatar: row.avatar,
  rating: Number(row.rating),
  title: row.title,
  comment: row.comment,
  verifiedPurchase: !!row.verified_purchase,
  likes: Number(row.likes || 0),
  date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
});

// GET /api/v1/reviews
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    let sql = 'SELECT * FROM reviews';
    const values = [];

    if (productId) {
      sql += ' WHERE product_id = $1';
      values.push(productId);
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, values);

    res.json({
      success: true,
      data: result.rows.map(mapReviewRow),
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, message: 'Server error fetching reviews' });
  }
});

// POST /api/v1/reviews - Submit customer review
router.post('/', async (req, res) => {
  try {
    const { productId, productName, author, location, rating, title, comment } = req.body;
    if (!author || !rating || !title || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide all required review details' });
    }

    const id = `rev-${Date.now()}`;
    const sql = `
      INSERT INTO reviews (id, product_id, product_name, author, location, rating, title, comment, verified_purchase, likes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, 0)
      RETURNING *
    `;

    const result = await query(sql, [
      id,
      productId || null,
      productName || 'AURELIA Jewelry',
      author,
      location || 'Mumbai, MH',
      Number(rating),
      title,
      comment
    ]);

    // Recalculate product rating if associated with a product
    if (productId) {
      await query(`
        UPDATE products SET
          rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE product_id = $1),
          reviews_count = (SELECT COUNT(*)::int FROM reviews WHERE product_id = $1)
        WHERE id = $1
      `, [productId]);
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: mapReviewRow(result.rows[0]),
    });
  } catch (err) {
    console.error('Error posting review:', err);
    res.status(500).json({ success: false, message: 'Server error posting review' });
  }
});

// POST /api/v1/reviews/:id/like - Like a review
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE reviews SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING likes',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, likes: result.rows[0].likes });
  } catch (err) {
    console.error('Error liking review:', err);
    res.status(500).json({ success: false, message: 'Server error liking review' });
  }
});

export default router;
