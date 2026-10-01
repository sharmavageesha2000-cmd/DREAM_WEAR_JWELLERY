import { pool, query } from './config/db.js';
import { categories, products, customerReviews, coupons } from './data/seedData.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Database Seeding ---');
    await client.query('BEGIN');

    // 1. Seed Categories
    console.log(`Seeding ${categories.length} categories...`);
    for (const cat of categories) {
      await client.query(
        `INSERT INTO categories (id, name, slug, tagline, description, image, item_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           tagline = EXCLUDED.tagline,
           description = EXCLUDED.description,
           image = EXCLUDED.image,
           item_count = EXCLUDED.item_count`,
        [cat.id, cat.name, cat.id, cat.tagline, cat.description, cat.image, cat.itemCount || 0]
      );
    }

    // 2. Seed Products
    console.log(`Seeding ${products.length} products...`);
    for (const p of products) {
      await client.query(
        `INSERT INTO products (
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
        ) ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          category_id = EXCLUDED.category_id,
          category_name = EXCLUDED.category_name,
          collection = EXCLUDED.collection,
          tagline = EXCLUDED.tagline,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          discount_percentage = EXCLUDED.discount_percentage,
          rating = EXCLUDED.rating,
          reviews_count = EXCLUDED.reviews_count,
          images = EXCLUDED.images,
          is_new = EXCLUDED.is_new,
          is_best_seller = EXCLUDED.is_best_seller,
          is_anti_tarnish = EXCLUDED.is_anti_tarnish,
          is_waterproof = EXCLUDED.is_waterproof,
          is_hypoallergenic = EXCLUDED.is_hypoallergenic,
          material = EXCLUDED.material,
          base_metal = EXCLUDED.base_metal,
          coating = EXCLUDED.coating,
          finishes = EXCLUDED.finishes,
          available_sizes = EXCLUDED.available_sizes,
          dimensions = EXCLUDED.dimensions,
          weight = EXCLUDED.weight,
          description = EXCLUDED.description,
          features = EXCLUDED.features,
          care_instructions = EXCLUDED.care_instructions,
          in_stock = EXCLUDED.in_stock,
          stock_count = EXCLUDED.stock_count,
          sku = EXCLUDED.sku`,
        [
          p.id,
          p.name,
          p.slug,
          p.category,
          p.categoryName || p.category,
          p.collection || null,
          p.tagline || '',
          p.price,
          p.originalPrice || p.price,
          p.discountPercentage || 0,
          p.rating || 5.0,
          p.reviewsCount || 0,
          JSON.stringify(p.images || []),
          !!p.isNew,
          !!p.isBestSeller,
          p.isAntiTarnish !== undefined ? !!p.isAntiTarnish : true,
          p.isWaterproof !== undefined ? !!p.isWaterproof : true,
          p.isHypoallergenic !== undefined ? !!p.isHypoallergenic : true,
          p.material || '',
          p.baseMetal || '',
          p.coating || '',
          JSON.stringify(p.finishes || ['18K Yellow Gold']),
          JSON.stringify(p.availableSizes || []),
          p.dimensions || '',
          p.weight || '',
          p.description || '',
          JSON.stringify(p.features || []),
          JSON.stringify(p.careInstructions || []),
          p.inStock !== undefined ? !!p.inStock : true,
          p.stockCount || 50,
          p.sku || `AUR-${p.id.toUpperCase()}`
        ]
      );
    }

    // Update item counts in categories
    await client.query(`
      UPDATE categories c
      SET item_count = (SELECT COUNT(*)::int FROM products p WHERE p.category_id = c.id)
    `);

    // 3. Seed Reviews
    console.log(`Seeding ${customerReviews.length} reviews...`);
    for (const rev of customerReviews) {
      await client.query(
        `INSERT INTO reviews (id, product_name, author, location, avatar, rating, title, comment, verified_purchase, likes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING`,
        [
          rev.id,
          rev.productName || 'AURELIA Jewelry',
          rev.author,
          rev.location || 'India',
          rev.avatar || null,
          rev.rating,
          rev.title,
          rev.comment,
          rev.verifiedPurchase,
          rev.likes || 0
        ]
      );
    }

    // 4. Seed Coupons
    console.log(`Seeding ${coupons.length} coupons...`);
    for (const cp of coupons) {
      await client.query(
        `INSERT INTO coupons (code, discount_type, discount_value, min_spend, description, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (code) DO UPDATE SET
           discount_type = EXCLUDED.discount_type,
           discount_value = EXCLUDED.discount_value,
           min_spend = EXCLUDED.min_spend,
           description = EXCLUDED.description`,
        [cp.code, cp.discountType, cp.discountValue, cp.minSpend, cp.description]
      );
    }

    // 5. Seed Users (Admin & Default Customer)
    console.log('Seeding default users...');
    const hashedAdminPass = await bcrypt.hash('vageesha@2026', 10);
    const hashedUserPass = await bcrypt.hash('password123', 10);

    const defaultCustomerAddresses = [
      {
        id: 'addr-1',
        name: 'Vageesha Sharma',
        phone: '+91 98765 43210',
        street: 'Flat 402, Highgrove Apartments, Pali Hill',
        apartment: 'Near Costa Coffee',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India',
        isDefault: true,
      }
    ];

    await client.query(
      `INSERT INTO users (id, name, email, password_hash, phone, role, saved_addresses)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         phone = EXCLUDED.phone,
         role = EXCLUDED.role,
         saved_addresses = EXCLUDED.saved_addresses`,
      [
        'usr-admin',
        'Vageesha Sharma (Admin)',
        'admin@aurelia.com',
        hashedAdminPass,
        '+91 98765 43210',
        'admin',
        JSON.stringify(defaultCustomerAddresses)
      ]
    );

    await client.query(
      `INSERT INTO users (id, name, email, password_hash, phone, role, saved_addresses)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         phone = EXCLUDED.phone,
         saved_addresses = EXCLUDED.saved_addresses`,
      [
        'usr-901',
        'Vageesha Sharma',
        'vageesha@example.com',
        hashedUserPass,
        '+91 98765 43210',
        'customer',
        JSON.stringify(defaultCustomerAddresses)
      ]
    );

    // 6. Seed Sample Orders
    console.log('Seeding sample orders...');
    const sampleOrders = [
      {
        id: 'ord-101',
        orderNumber: 'AUR-892147',
        userId: 'usr-901',
        items: [
          {
            productId: 'aur-n-01',
            productName: 'Minimal Baroque Pearl Pendant Necklace',
            image: '/images/products/aur_n_01_1.jpg',
            price: 1899,
            quantity: 1,
            finish: '18K Yellow Gold',
            size: '40cm + 5cm extender',
          },
          {
            productId: 'aur-e-01',
            productName: 'Chubby Bold Huggie Hoops',
            image: '/images/products/aur_e_01_1.jpg',
            price: 1499,
            quantity: 1,
            finish: '18K Yellow Gold',
          },
        ],
        shippingAddress: {
          id: 'a1',
          name: 'Ananya Roy',
          phone: '+91 98111 22334',
          street: '14, Golf Links, Lodhi Road',
          city: 'New Delhi',
          state: 'Delhi',
          postalCode: '110003',
          country: 'India',
        },
        shippingMethod: 'standard',
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        subtotal: 3398,
        discount: 340,
        couponCode: 'WELCOME10',
        shippingFee: 0,
        total: 3058,
        status: 'Processing',
        trackingNumber: 'BLUEDART-89472190',
        estimatedDelivery: '3 Days',
      },
      {
        id: 'ord-102',
        orderNumber: 'AUR-641092',
        userId: 'usr-901',
        items: [
          {
            productId: 'aur-n-02',
            productName: 'Liquid Gold Herringbone Flat Chain',
            image: '/images/products/aur_n_02_1.jpg',
            price: 2199,
            quantity: 1,
            finish: '18K Yellow Gold',
            size: '38cm + 5cm extender',
          },
        ],
        shippingAddress: {
          id: 'a2',
          name: 'Kavya Pillai',
          phone: '+91 99444 55667',
          street: 'Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
        },
        shippingMethod: 'express',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        subtotal: 2199,
        discount: 0,
        shippingFee: 199,
        total: 2398,
        status: 'Shipped',
        trackingNumber: 'DELHIVERY-77401923',
        estimatedDelivery: 'Tomorrow',
      },
      {
        id: 'ord-103',
        orderNumber: 'AUR-510984',
        userId: 'usr-901',
        items: [
          {
            productId: 'aur-r-01',
            productName: 'Croissant Dome Signet Ring',
            image: '/images/products/aur_r_01_1.jpg',
            price: 1499,
            quantity: 1,
            finish: '18K Yellow Gold',
            size: 'US 7',
          },
        ],
        shippingAddress: {
          id: 'a3',
          name: 'Vageesha Sharma',
          phone: '+91 98765 43210',
          street: 'Flat 402, Highgrove Apartments, Pali Hill',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
        },
        shippingMethod: 'standard',
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        subtotal: 1499,
        discount: 150,
        couponCode: 'WELCOME10',
        shippingFee: 0,
        total: 1349,
        status: 'Delivered',
        trackingNumber: 'BLUEDART-55201984',
        estimatedDelivery: 'Delivered on Friday',
      },
    ];

    for (const ord of sampleOrders) {
      await client.query(
        `INSERT INTO orders (
          id, order_number, user_id, items, shipping_address, shipping_method,
          payment_method, payment_status, subtotal, discount, coupon_code,
          shipping_fee, total, status, tracking_number, estimated_delivery
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (order_number) DO UPDATE SET
          status = EXCLUDED.status,
          total = EXCLUDED.total,
          items = EXCLUDED.items`,
        [
          ord.id,
          ord.orderNumber,
          ord.userId,
          JSON.stringify(ord.items),
          JSON.stringify(ord.shippingAddress),
          ord.shippingMethod,
          ord.paymentMethod,
          ord.paymentStatus,
          ord.subtotal,
          ord.discount,
          ord.couponCode,
          ord.shippingFee,
          ord.total,
          ord.status,
          ord.trackingNumber,
          ord.estimatedDelivery
        ]
      );
    }

    await client.query('COMMIT');
    console.log('--- Database Seeding Completed Successfully! ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Allow direct execution: node src/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    console.log('Seeder finished.');
    process.exit(0);
  }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

