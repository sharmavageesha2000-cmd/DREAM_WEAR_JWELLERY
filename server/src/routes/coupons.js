import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/v1/coupons - List all coupons
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows.map(c => ({
        code: c.code,
        discountType: c.discount_type,
        discountValue: Number(c.discount_value),
        minSpend: Number(c.min_spend || 0),
        description: c.description,
        isActive: !!c.is_active,
      })),
    });
  } catch (err) {
    console.error('Error fetching coupons:', err);
    res.status(500).json({ success: false, message: 'Server error fetching coupons' });
  }
});

// GET /api/v1/coupons/verify/:code - Validate a promo code
router.get('/verify/:code', async (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    const result = await query(
      'SELECT * FROM coupons WHERE UPPER(code) = $1 AND is_active = true LIMIT 1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code. Try WELCOME10 or AURELIA200.',
      });
    }

    const c = result.rows[0];
    res.json({
      success: true,
      message: `Promo code "${c.code}" applied successfully!`,
      data: {
        code: c.code,
        discountPercentage: c.discount_type === 'percentage' ? Number(c.discount_value) : undefined,
        flatDiscount: c.discount_type === 'flat' ? Number(c.discount_value) : undefined,
        minSpend: Number(c.min_spend || 0),
        description: c.description,
      },
    });
  } catch (err) {
    console.error('Error verifying coupon:', err);
    res.status(500).json({ success: false, message: 'Server error verifying coupon' });
  }
});

// POST /api/v1/coupons - Add new coupon (Admin)
router.post('/', async (req, res) => {
  try {
    const { code, discountType, discountValue, minSpend, description } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ success: false, message: 'Coupon code and discount value are required' });
    }

    const upperCode = code.trim().toUpperCase();
    const sql = `
      INSERT INTO coupons (code, discount_type, discount_value, min_spend, description, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (code) DO UPDATE SET
        discount_type = EXCLUDED.discount_type,
        discount_value = EXCLUDED.discount_value,
        min_spend = EXCLUDED.min_spend,
        description = EXCLUDED.description,
        is_active = true
      RETURNING *
    `;

    const result = await query(sql, [
      upperCode,
      discountType || 'percentage',
      Number(discountValue),
      Number(minSpend || 0),
      description || `Privilege promo code ${upperCode}`,
    ]);

    res.status(201).json({
      success: true,
      message: 'Coupon code created',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating coupon:', err);
    res.status(500).json({ success: false, message: 'Server error creating coupon' });
  }
});

// DELETE /api/v1/coupons/:code
router.delete('/:code', async (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    await query('DELETE FROM coupons WHERE UPPER(code) = $1', [code]);
    res.json({ success: true, message: `Coupon ${code} removed` });
  } catch (err) {
    console.error('Error deleting coupon:', err);
    res.status(500).json({ success: false, message: 'Server error deleting coupon' });
  }
});

export default router;
