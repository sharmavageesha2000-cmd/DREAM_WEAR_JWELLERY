import express from 'express';
import { query } from '../config/db.js';
import { seedDatabase } from '../seed.js';

const router = express.Router();

// GET /api/v1/admin/analytics
router.get('/analytics', async (req, res) => {
  try {
    const ordersStatsPromise = query(`
      SELECT 
        COUNT(*)::int as total_orders,
        COALESCE(SUM(total), 0)::numeric as total_revenue,
        COUNT(CASE WHEN LOWER(status) = 'delivered' THEN 1 END)::int as delivered_orders,
        COUNT(CASE WHEN LOWER(status) = 'processing' THEN 1 END)::int as processing_orders
      FROM orders
    `);

    const productStatsPromise = query(`
      SELECT 
        COUNT(*)::int as total_products,
        COUNT(CASE WHEN stock_count <= 10 OR in_stock = false THEN 1 END)::int as low_stock_count
      FROM products
    `);

    const customerStatsPromise = query(`
      SELECT COUNT(*)::int as total_customers FROM users WHERE role = 'customer'
    `);

    const recentOrdersPromise = query(`
      SELECT id, order_number, shipping_address->>'name' as customer_name, total, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const categoryStatsPromise = query(`
      SELECT c.name, COUNT(p.id)::int as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY product_count DESC
    `);

    const [ordersStats, productStats, customerStats, recentOrders, categoryStats] = await Promise.all([
      ordersStatsPromise,
      productStatsPromise,
      customerStatsPromise,
      recentOrdersPromise,
      categoryStatsPromise,
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: Number(ordersStats.rows[0].total_revenue),
        totalOrders: Number(ordersStats.rows[0].total_orders),
        processingOrders: Number(ordersStats.rows[0].processing_orders),
        deliveredOrders: Number(ordersStats.rows[0].delivered_orders),
        totalProducts: Number(productStats.rows[0].total_products),
        lowStockCount: Number(productStats.rows[0].low_stock_count),
        totalCustomers: Number(customerStats.rows[0].total_customers),
        recentOrders: recentOrders.rows,
        categoryDistribution: categoryStats.rows,
      },
    });
  } catch (err) {
    console.error('Error fetching admin analytics:', err);
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
});

// GET /api/v1/admin/customers
router.get('/customers', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.created_at,
        COALESCE(COUNT(o.id), 0)::int as total_orders,
        COALESCE(SUM(o.total), 0)::numeric as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'customer'
      GROUP BY u.id, u.name, u.email, u.phone, u.created_at
      ORDER BY total_spent DESC
    `);

    res.json({
      success: true,
      data: result.rows.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '+91 98765 43210',
        totalOrders: Number(c.total_orders),
        totalSpent: Number(c.total_spent),
        joinedDate: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        hasWarranty: true,
      })),
    });
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ success: false, message: 'Server error fetching customers' });
  }
});

// POST /api/v1/admin/reset-catalog - Reset database to pristine state
router.post('/reset-catalog', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Catalog reset to original fine jewelry collection' });
  } catch (err) {
    console.error('Error resetting catalog:', err);
    res.status(500).json({ success: false, message: 'Failed to reset catalog' });
  }
});

export default router;
