import express from 'express';

const router = express.Router();

router.get('/verify-pincode/:pincode', (req, res) => {
  const { pincode } = req.params;
  if (pincode && pincode.length === 6 && /^\d+$/.test(pincode)) {
    return res.json({
      success: true,
      valid: true,
      message: 'Delivery available in 2-3 business days. Free Express Shipping applies!',
      days: '2-3 Business Days',
      courierPartner: 'BlueDart Air Express / Delhivery Luxe',
    });
  }
  return res.status(400).json({
    success: false,
    valid: false,
    message: 'Please enter a valid 6-digit Indian postal PIN code.',
  });
});

export default router;
