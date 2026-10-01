import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/v1/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.tagline, 
        c.description, 
        c.image, 
        COALESCE(p.item_count, 0) as item_count
      FROM categories c
      LEFT JOIN (
        SELECT category_id, COUNT(*)::int as item_count 
        FROM products 
        GROUP BY category_id
      ) p ON c.id = p.category_id
      ORDER BY c.created_at ASC
    `;

    const result = await query(sql);
    const data = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      tagline: row.tagline,
      description: row.description,
      image: row.image,
      itemCount: Number(row.item_count),
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
});

// GET /api/v1/categories/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM categories WHERE id = $1 OR slug = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ success: false, message: 'Server error fetching category' });
  }
});

export default router;
