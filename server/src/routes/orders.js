import express from 'express';
import { query } from '../config/db.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const mapOrderRow = (row) => ({
  id: row.id,
  orderNumber: row.order_number,
  userId: row.user_id,
  createdAt: row.created_at,
  items: Array.isArray(row.items) ? row.items : (typeof row.items === 'string' ? JSON.parse(row.items) : []),
  shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : row.shipping_address,
  shippingMethod: row.shipping_method || 'standard',
  paymentMethod: row.payment_method || 'upi',
  paymentStatus: row.payment_status || 'paid',
  subtotal: Number(row.subtotal),
  discount: Number(row.discount || 0),
  couponCode: row.coupon_code || '',
  shippingFee: Number(row.shipping_fee || 0),
  total: Number(row.total),
  status: row.status || 'Processing',
  trackingNumber: row.tracking_number || '',
  estimatedDelivery: row.estimated_delivery || '3-4 Business Days',
});

// GET /api/v1/orders - Get orders
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { userId, status, search } = req.query;
    let sql = 'SELECT * FROM orders';
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      values.push(userId);
    } else if (req.user && req.user.role !== 'admin') {
      conditions.push(`user_id = $${paramIndex++}`);
      values.push(req.user.id);
    }

    if (status && status !== 'all') {
      conditions.push(`LOWER(status) = $${paramIndex++}`);
      values.push(status.toLowerCase());
    }

    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      conditions.push(`(
        LOWER(order_number) LIKE $${paramIndex} OR
        LOWER(tracking_number) LIKE $${paramIndex} OR
        LOWER(shipping_address->>'name') LIKE $${paramIndex} OR
        LOWER(shipping_address->>'city') LIKE $${paramIndex}
      )`);
      values.push(q);
      paramIndex++;
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, values);
    const orders = result.rows.map(mapOrderRow);

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Server error fetching orders' });
  }
});

// GET /api/v1/orders/:idOrNumber - Get single order
router.get('/:idOrNumber', async (req, res) => {
  try {
    const param = req.params.idOrNumber;
    const sql = `
      SELECT * FROM orders
      WHERE id = $1 OR order_number = $1
      LIMIT 1
    `;
    const result = await query(sql, [param]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: mapOrderRow(result.rows[0]),
    });
  } catch (err) {
    console.error('Error fetching order by ID/number:', err);
    res.status(500).json({ success: false, message: 'Server error fetching order' });
  }
});

// POST /api/v1/orders - Place new customer order
router.post('/', optionalAuth, async (req, res) => {
  try {
    const body = req.body;
    const orderId = body.id || `ord-${Date.now()}`;
    const orderNumber = body.orderNumber || `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = body.trackingNumber || `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const userId = body.userId || (req.user ? req.user.id : null);

    const items = body.items || [];
    const shippingAddress = body.shippingAddress || {};

    const sql = `
      INSERT INTO orders (
        id, order_number, user_id, items, shipping_address, shipping_method,
        payment_method, payment_status, subtotal, discount, coupon_code,
        shipping_fee, total, status, tracking_number, estimated_delivery
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING *
    `;

    const values = [
      orderId,
      orderNumber,
      userId,
      JSON.stringify(items),
      JSON.stringify(shippingAddress),
      body.shippingMethod || 'standard',
      body.paymentMethod || 'upi',
      body.paymentStatus || 'paid',
      Number(body.subtotal || 0),
      Number(body.discount || 0),
      body.couponCode || null,
      Number(body.shippingFee || 0),
      Number(body.total || 0),
      body.status || 'Processing',
      trackingNumber,
      body.estimatedDelivery || (body.shippingMethod === 'express' ? '1-2 Business Days' : '3-4 Business Days'),
    ];

    const result = await query(sql, values);

    // Save individual relational order items
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await query(
          `INSERT INTO order_items (id, order_id, product_id, product_name, image, price, quantity, finish, size)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [
            `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            orderId,
            item.productId || null,
            item.productName || 'Aurelia Jewelry',
            item.image || null,
            Number(item.price || 0),
            Number(item.quantity || 1),
            item.finish || null,
            item.size || null,
          ]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: mapOrderRow(result.rows[0]),
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: 'Server error creating order' });
  }
});

// PATCH /api/v1/orders/:id/status - Update order fulfillment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const sql = `
      UPDATE orders
      SET status = $1
      WHERE id = $2 OR order_number = $2
      RETURNING *
    `;

    const result = await query(sql, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: mapOrderRow(result.rows[0]),
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, message: 'Server error updating order status' });
  }
});

// DELETE /api/v1/orders/:id - Cancel or remove order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM orders WHERE id = $1 OR order_number = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ success: false, message: 'Server error deleting order' });
  }
});

export default router;
