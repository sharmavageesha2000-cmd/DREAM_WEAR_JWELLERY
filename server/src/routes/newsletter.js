import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'A valid email address is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const id = `sub-${Date.now()}`;
    const couponCode = 'WELCOME10';

    await query(
      `INSERT INTO newsletter_subscribers (id, email, coupon_code)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [id, cleanEmail, couponCode]
    );

    res.json({
      success: true,
      message: 'Welcome to the AURELIA Circle! Your 10% welcome privilege has been unlocked.',
      couponCode,
    });
  } catch (err) {
    console.error('Error during newsletter subscription:', err);
    res.status(500).json({ success: false, message: 'Server error during subscription' });
  }
});

export default router;
