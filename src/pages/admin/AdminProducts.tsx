import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  CheckCircle2,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  X,
} from 'lucide-react';
import { products as initialProducts, getStoredProducts, saveStoredProducts } from '../../data/products';
import { Product, ProductCategory } from '../../types';
import { formatPrice } from '../../config/brandConfig';
import { Modal } from '../../components/common/Modal';
import { apiService } from '../../services/api';

export const AdminProducts: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>(() => getStoredProducts());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sync with backend and storage updates
  useEffect(() => {
    apiService.getProducts({ limit: 100 }).then((res) => {
      if (res && res.data && res.data.length > 0) {
        setProductList(res.data);
      }
    }).catch((err) => console.warn('Backend load error:', err));

    const handleUpdate = () => {
      setProductList(getStoredProducts());
    };
    window.addEventListener('aurelia_products_updated', handleUpdate);
    return () => window.removeEventListener('aurelia_products_updated', handleUpdate);
  }, []);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('necklaces');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImages, setFormImages] = useState<string[]>(['', '', '', '']);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);
  const fileInputRef4 = useRef<HTMLInputElement>(null);

  const filteredProducts = productList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this product from the atelier catalog?')) {
      const updated = productList.filter((p) => p.id !== id);
      setProductList(updated);
      saveStoredProducts(updated);
      apiService.deleteProduct(id).catch((err) => console.warn('API delete product error:', err));
      setFeedback('Product removed successfully');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleToggleStock = (id: string) => {
    const target = productList.find((p) => p.id === id);
    const updated = productList.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
    setProductList(updated);
    saveStoredProducts(updated);
    if (target) {
      apiService.updateProduct(id, { inStock: !target.inStock }).catch((err) => console.warn('API update stock error:', err));
    }
  };

  const handleResetToDefaultCatalog = () => {
    if (confirm('Restore default 33 atelier products with all updated multi-angle images?')) {
      saveStoredProducts(initialProducts);
      setProductList(initialProducts);
      apiService.resetAdminCatalog().catch((err) => console.warn('API reset catalog error:', err));
      setFeedback('Atelier catalog restored with all 33 handcrafted pieces');
      setTimeout(() => setFeedback(null), 3000);
    }
  };


  const handleOpenAddModal = () => {
    setFormName('');
    setFormCategory('necklaces');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormTagline('');
    setFormDescription('');
    setFormImages(['', '', '', '']);
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setFormTagline(p.tagline || '');
    setFormDescription(p.description || '');

    const imgs = [...(p.images || [])];
    while (imgs.length < 4) {
      imgs.push(imgs[0] || '');
    }
    setFormImages(imgs.slice(0, 4));
    setIsAddModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      if (dataUrl) {
        setFormImages((prev) => {
          const next = [...prev];
          next[index] = dataUrl;
          // If index 0 is uploaded and other slots are empty, mirror it to initialize all 4 angles
          if (index === 0) {
            for (let i = 1; i < 4; i++) {
              if (!next[i]) next[i] = dataUrl;
            }
          }
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (url: string, index: number) => {
    setFormImages((prev) => {
      const next = [...prev];
      next[index] = url.trim();
      if (index === 0) {
        for (let i = 1; i < 4; i++) {
          if (!next[i]) next[i] = url.trim();
        }
      }
      return next;
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    const priceNum = parseInt(formPrice, 10);
    const origPriceNum = formOriginalPrice ? parseInt(formOriginalPrice, 10) : priceNum + 500;
    const discount = Math.round(((origPriceNum - priceNum) / origPriceNum) * 100);

    // Filter valid images or default
    const validImages = formImages.filter((img) => img && img.trim().length > 0);
    const primaryImg =
      validImages[0] ||
      (editingProduct?.images[0]
        ? editingProduct.images[0]
        : `/images/categories/cat_${formCategory}.jpg`);

    const finalImages = [
      validImages[0] || primaryImg,
      validImages[1] || validImages[0] || primaryImg,
      validImages[2] || validImages[0] || primaryImg,
      validImages[3] || validImages[0] || primaryImg,
    ];

    const cleanSlug = formName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `product-${Date.now()}`;

    if (editingProduct) {
      // Update existing
      const updatedList = productList.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName.trim(),
            slug: cleanSlug,
            category: formCategory,
            price: priceNum,
            originalPrice: origPriceNum,
            discountPercentage: discount > 0 ? discount : 0,
            tagline: formTagline || p.tagline,
            description: formDescription || p.description,
            images: finalImages,
          };
        }
        return p;
      });

      const updatedItem = {
        name: formName.trim(),
        slug: cleanSlug,
        category: formCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercentage: discount > 0 ? discount : 0,
        tagline: formTagline || editingProduct.tagline,
        description: formDescription || editingProduct.description,
        images: finalImages,
      };

      setProductList(updatedList);
      saveStoredProducts(updatedList);
      apiService.updateProduct(editingProduct.id, updatedItem).catch((err) => console.warn('API update product error:', err));
      setFeedback(`"${formName.trim()}" updated successfully!`);
    } else {
      // Create new
      const newProd: Product = {
        id: `aur-custom-${Date.now()}`,
        name: formName.trim(),
        slug: cleanSlug,
        category: formCategory,
        categoryName:
          formCategory === 'necklaces'
            ? 'Necklaces & Pendants'
            : formCategory === 'earrings'
            ? 'Earrings & Huggies'
            : formCategory === 'rings'
            ? 'Rings & Stacks'
            : formCategory === 'bracelets'
            ? 'Bracelets & Cuffs'
            : 'Jewelry Sets',
        tagline: formTagline || '18K Gold Anti-Tarnish fine jewelry piece.',
        description: formDescription || 'Crafted with 18K Real Gold Vacuum PVD on 316L medical stainless steel.',
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercentage: discount > 0 ? discount : 0,
        rating: 5.0,
        reviewsCount: 1,
        images: finalImages,
        isNew: true,
        isBestSeller: false,
        isAntiTarnish: true,
        isWaterproof: true,
        inStock: true,
        sku: `AUR-${formCategory.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        material: '316L Surgical Stainless Steel',
        baseMetal: 'Surgical Steel',
        coating: '18K Gold Vacuum PVD',
        finishes: ['18K Yellow Gold', 'Silver Rhodium', '18K Rose Gold'],
        features: ['100% Anti-Tarnish', 'Waterproof & Sweatproof', 'Hypoallergenic'],
        careInstructions: ['Shower-safe and daily wear approved.'],
      };

      const updatedList = [newProd, ...productList];
      setProductList(updatedList);
      saveStoredProducts(updatedList);
      apiService.createProduct(newProd).catch((err) => console.warn('API create product error:', err));
      setFeedback('New jewelry piece added & published across website!');
    }

    setIsAddModalOpen(false);
    setTimeout(() => setFeedback(null), 3500);
  };


  const perspectiveTitles = [
    'Angle 1: Hero Studio View',
    'Angle 2: Macro Detail Zoom',
    'Angle 3: 45° Dynamic Contour',
    'Angle 4: Atelier Perspective',
  ];

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-white">
            Jewelry Catalog Management
          </h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            Total {productList.length} handcrafted pieces in active store circulation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaultCatalog}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Restore default atelier products"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Catalog</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-stone-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900 p-4 rounded-2xl border border-stone-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU, or tag..."
            className="w-full pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-stone-950 rounded-xl border border-stone-700 text-xs text-stone-300 focus:outline-none focus:border-gold cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="necklaces">Necklaces</option>
            <option value="earrings">Earrings</option>
            <option value="rings">Rings</option>
            <option value="bracelets">Bracelets</option>
            <option value="sets">Jewelry Sets</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Price (INR)</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold">Stock Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-700 bg-stone-950 flex-shrink-0"
                      />
                      <div>
                        <a
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-white max-w-xs truncate hover:text-gold flex items-center gap-1 group"
                        >
                          <span>{p.name}</span>
                          <ExternalLink className="w-3 h-3 text-stone-500 group-hover:text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <p className="text-[11px] text-gold">{p.coating}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 capitalize text-stone-400">{p.category}</td>
                  <td className="p-4 font-mono text-[11px] text-stone-400">{p.sku}</td>
                  <td className="p-4 font-serif font-bold text-white">
                    {formatPrice(p.price)}
                    {p.originalPrice > p.price && (
                      <span className="text-[10px] text-stone-500 line-through ml-1.5 font-normal">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-amber-400">★ {p.rating} ({p.reviewsCount})</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        p.inStock
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-gold hover:bg-stone-800 transition-colors cursor-pointer"
                        title="Edit product"
                        aria-label="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors cursor-pointer"
                        title="Delete product"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingProduct ? `Edit Piece: ${editingProduct.name}` : 'Add New Anti-Tarnish Piece'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-stone-300 max-h-[80vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Piece Name *
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Sculpted Wave Cuff Bracelet"
                className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white focus:outline-none focus:border-gold text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                  className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white focus:outline-none focus:border-gold text-xs"
                >
                  <option value="necklaces">Necklaces</option>
                  <option value="earrings">Earrings</option>
                  <option value="rings">Rings</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="sets">Jewelry Sets</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Selling Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="2199"
                  className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white focus:outline-none focus:border-gold text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Original Price (₹ INR)
                </label>
                <input
                  type="number"
                  value={formOriginalPrice}
                  onChange={(e) => setFormOriginalPrice(e.target.value)}
                  placeholder="2899"
                  className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white focus:outline-none focus:border-gold text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Short Tagline
              </label>
              <input
                type="text"
                value={formTagline}
                onChange={(e) => setFormTagline(e.target.value)}
                placeholder="18K real gold vacuum PVD on hypoallergenic medical steel."
                className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white focus:outline-none focus:border-gold text-xs"
              />
            </div>

            {/* Product Photography Angles Upload Section */}
            <div className="space-y-3 p-4 rounded-2xl bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="font-semibold text-white text-xs uppercase tracking-wider">
                    Product Image & Angles (Slider)
                  </span>
                </div>
                <span className="text-[10px] text-stone-400">
                  Upload file from device or enter URL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((idx) => {
                  const inputRefs = [fileInputRef1, fileInputRef2, fileInputRef3, fileInputRef4];
                  const curImg = formImages[idx];

                  return (
                    <div key={idx} className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wide">
                          {perspectiveTitles[idx]} {idx === 0 ? '(Hero/Primary *)' : '(Optional)'}
                        </span>
                        {curImg && (
                          <button
                            type="button"
                            onClick={() => handleImageUrlChange('', idx)}
                            className="text-stone-500 hover:text-rose-400 text-[10px]"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2 items-center">
                        {curImg ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gold/40 bg-stone-950 flex-shrink-0 relative group">
                            <img src={curImg} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg border border-dashed border-stone-700 bg-stone-950 flex items-center justify-center flex-shrink-0 text-stone-600">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}

                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={curImg.startsWith('data:') ? 'Image uploaded from device' : curImg}
                            onChange={(e) => handleImageUrlChange(e.target.value, idx)}
                            placeholder={idx === 0 ? 'Image URL or upload below...' : 'Angle URL or upload...'}
                            className="w-full px-2.5 py-1.5 bg-stone-950 rounded-lg border border-stone-700 text-white text-[11px] focus:outline-none focus:border-gold"
                          />

                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              ref={inputRefs[idx]}
                              onChange={(e) => handleFileUpload(e, idx)}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => inputRefs[idx].current?.click()}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[10px] text-stone-300 font-medium transition-colors cursor-pointer"
                            >
                              <Upload className="w-3 h-3 text-gold" />
                              <span>Upload File</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-stone-400 italic">
                * If 1 primary image is provided, our atelier slider automatically generates 4 high-definition photographic angles (Hero, Macro Detail Zoom, 45° Contour, and Atelier Glow) of that exact piece.
              </p>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Description & Care Notes
              </label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe the craftsmanship, styling tips, and 2-year color guarantee..."
                className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white focus:outline-none focus:border-gold text-xs"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-stone-950 font-bold uppercase tracking-wider shadow-md cursor-pointer"
              >
                {editingProduct ? 'Save Changes' : 'Save to Catalog'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
