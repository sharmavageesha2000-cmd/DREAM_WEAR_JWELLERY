import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, QrCode, Building2, Banknote, CheckCircle2, Lock, ArrowLeft, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import { formatPrice, brandConfig } from '../config/brandConfig';
import { Address, OrderItem } from '../types';
import { useSEO } from '../hooks/useSEO';

export const Checkout: React.FC = () => {
  useSEO({
    title: 'Secure Checkout',
    description: 'Complete your order with 256-bit encrypted checkout. Support for UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.',
  });

  const { cart, subtotal, discount, appliedCoupon, shippingFee, giftWrapFee, isGiftWrap, total, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Multi-step: 1 = Customer & Address, 2 = Shipping Method, 3 = Payment
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    houseFlat: 'Penthouse 402, Royale Crest',
    street: user?.savedAddresses[0]?.street || 'Linking Road',
    area: 'Bandra West',
    city: user?.savedAddresses[0]?.city || 'Mumbai',
    state: user?.savedAddresses[0]?.state || 'Maharashtra',
    pincode: user?.savedAddresses[0]?.postalCode || '400050',
    country: 'India',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  
  // Card Mock State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [upiId, setUpiId] = useState('vageesha@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateAddressStep = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Mobile number is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    if (!formData.houseFlat.trim()) errors.houseFlat = 'House / Flat is required';
    if (!formData.street.trim()) errors.street = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) errors.pincode = 'Valid 6-digit PIN code required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateAddressStep()) {
        setCurrentStep(2);
      } else {
        showToast('Please fill all required address fields', 'error');
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      street: `${formData.houseFlat}, ${formData.street}, ${formData.area}`,
      city: formData.city,
      state: formData.state,
      postalCode: formData.pincode,
      country: formData.country,
    };

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      image: item.product.images[0],
      price: item.product.price,
      quantity: item.quantity,
      finish: item.selectedFinish,
      size: item.selectedSize,
    }));

    try {
      const newOrder = await apiService.createOrder({
        items: orderItems,
        shippingAddress,
        shippingMethod,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        shippingFee,
        total,
      });

      addOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      showToast('Order confirmed successfully!', 'success');
      navigate(`/order-confirmation/${newOrder.orderNumber}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      showToast('Failed to process order. Please try again.', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-2xl text-charcoal">Your bag is empty</h2>
        <Link to="/shop" className="mt-4 inline-block px-6 py-2.5 bg-charcoal text-ivory rounded-xl text-xs uppercase tracking-wider">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-charcoal font-medium">
              {brandConfig.name}
            </h1>
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-dark font-sans block -mt-0.5">
              Secure Luxury Checkout
            </span>
          </Link>
        </div>

        {/* Stepper Header */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#2C2119]' : 'text-stone-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${currentStep >= 1 ? 'bg-[#B88E3A] text-white shadow-sm' : 'bg-stone-200 text-stone-600'}`}>
                01
              </span>
              <span className="hidden sm:inline">Information</span>
            </div>
            <div className={`w-8 sm:w-12 h-0.5 transition-all ${currentStep >= 2 ? 'bg-[#B88E3A]' : 'bg-stone-200'}`} />
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#2C2119]' : 'text-stone-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${currentStep >= 2 ? 'bg-[#B88E3A] text-white shadow-sm' : 'bg-stone-200 text-stone-600'}`}>
                02
              </span>
              <span className="hidden sm:inline">Delivery</span>
            </div>
            <div className={`w-8 sm:w-12 h-0.5 transition-all ${currentStep >= 3 ? 'bg-[#B88E3A]' : 'bg-stone-200'}`} />
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-[#2C2119]' : 'text-stone-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${currentStep >= 3 ? 'bg-[#B88E3A] text-white shadow-sm' : 'bg-stone-200 text-stone-600'}`}>
                03
              </span>
              <span className="hidden sm:inline">Payment</span>
            </div>
            <div className="w-8 sm:w-12 h-0.5 bg-stone-200" />
            <div className="flex items-center gap-2 text-stone-400">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold bg-stone-200 text-stone-500">
                04
              </span>
              <span className="hidden sm:inline">Confirmation</span>
            </div>
          </div>
        </div>


        {/* Grid: Form Steps + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Multi-Step Forms */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
            
            {/* STEP 1: Customer Information & Delivery Address */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="font-serif text-xl font-semibold text-charcoal">
                    1. Customer & Delivery Address
                  </h2>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400">
                    <Lock className="w-3 h-3 text-gold" />
                    <span>256-bit SSL Encrypted</span>
                  </div>
                </div>

                {/* Section A: Customer Info */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Vageesha Sharma"
                        className={`w-full px-3.5 py-2.5 bg-ivory rounded-xl border text-xs focus:outline-none focus:border-gold ${
                          formErrors.name ? 'border-rose-400' : 'border-stone-200'
                        }`}
                      />
                      {formErrors.name && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className={`w-full px-3.5 py-2.5 bg-ivory rounded-xl border text-xs focus:outline-none focus:border-gold ${
                          formErrors.phone ? 'border-rose-400' : 'border-stone-200'
                        }`}
                      />
                      {formErrors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Email Address (for live tracking) *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className={`w-full px-3.5 py-2.5 bg-ivory rounded-xl border text-xs focus:outline-none focus:border-gold ${
                        formErrors.email ? 'border-rose-400' : 'border-stone-200'
                      }`}
                    />
                    {formErrors.email && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.email}</p>}
                  </div>
                </div>

                {/* Section B: Delivery Address */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                    Delivery Address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">House / Flat / Building *</label>
                      <input
                        type="text"
                        name="houseFlat"
                        required
                        value={formData.houseFlat}
                        onChange={handleInputChange}
                        placeholder="e.g. Flat 402, Building A"
                        className="w-full px-3.5 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Street Address *</label>
                      <input
                        type="text"
                        name="street"
                        required
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="e.g. Linking Road"
                        className="w-full px-3.5 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Area / Landmark</label>
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="e.g. Near Waterfield Road"
                        className="w-full px-3.5 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">State *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        required
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 bg-ivory rounded-xl border text-xs focus:outline-none focus:border-gold ${
                          formErrors.pincode ? 'border-rose-400' : 'border-stone-200'
                        }`}
                      />
                      {formErrors.pincode && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.pincode}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Country</label>
                      <input
                        type="text"
                        disabled
                        value="India"
                        className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Continue to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Method */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="font-serif text-xl font-semibold text-charcoal">
                    2. Select Delivery Method
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-stone-400 hover:text-charcoal flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Edit Information
                  </button>
                </div>

                {/* Delivery Option 1: Standard / Free */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-gold bg-gold-light/10 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="text-gold focus:ring-gold"
                    />
                    <div>
                      <p className="text-xs font-bold text-charcoal flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-gold-dark" /> Standard Express Delivery
                      </p>
                      <p className="text-[11px] text-stone-500">Delivered in 2-4 Business Days across India</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </label>

                {/* Delivery Option 2: Priority Next Day */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-gold bg-gold-light/10 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="text-gold focus:ring-gold"
                    />
                    <div>
                      <p className="text-xs font-bold text-charcoal flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" /> Priority VIP Air Courier
                      </p>
                      <p className="text-[11px] text-stone-500">Delivered in 1-2 Business Days (Metro Cities)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-charcoal">₹199</span>
                </label>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-charcoal"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method Simulation */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="font-serif text-xl font-semibold text-charcoal">
                    3. Payment UI Selection
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-stone-400 hover:text-charcoal flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                </div>

                {/* Payment Selection Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-gold bg-gold-light/20 text-charcoal font-bold shadow-sm'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-gold-dark" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                      paymentMethod === 'card'
                        ? 'border-gold bg-gold-light/20 text-charcoal font-bold shadow-sm'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-gold-dark" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-gold bg-gold-light/20 text-charcoal font-bold shadow-sm'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-gold-dark" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-gold bg-gold-light/20 text-charcoal font-bold shadow-sm'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Banknote className="w-4 h-4 mx-auto mb-1 text-gold-dark" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {/* Dynamic Subviews based on paymentMethod */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-2xl bg-ivory-warm border border-stone-200/80 space-y-3">
                    <p className="text-xs font-semibold text-charcoal">Pay with any UPI App (Google Pay, PhonePe, Paytm)</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="flex-1 px-3.5 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                      />
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                        Instant Verified
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#3D312A] via-[#4A3B33] to-[#2C2119] text-white shadow-xl space-y-4 border border-[#584635]">
                    <div className="flex justify-between items-center text-[#B88E3A]">
                      <span className="font-brand italic text-sm tracking-wider">DREAM WEAR Golden Privé</span>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-stone-800 border border-stone-700 text-xs px-3 py-2 rounded-lg font-mono text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-stone-400">Valid Thru</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-stone-800 border border-stone-700 px-3 py-2 rounded-lg font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-stone-400">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-stone-800 border border-stone-700 px-3 py-2 rounded-lg font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-4 rounded-2xl bg-ivory-warm border border-stone-200/80 space-y-2 text-xs">
                    <label className="block font-semibold text-charcoal">Select Your Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-gold"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <p className="font-semibold">Cash on Delivery Selected</p>
                    <p className="text-[11px] text-amber-800">
                      Please keep exact cash of <strong>{formatPrice(total)}</strong> ready at the time of delivery.
                    </p>
                  </div>
                )}

                {/* Place Order CTA */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.2em] shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Securing Order...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-gold" />
                        <span>Place Order — {formatPrice(total)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-serif text-lg font-semibold text-charcoal pb-2 border-b border-stone-100">
              Order Summary ({cart.length} items)
            </h3>

            {/* Item Mini Rows */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-stone-100">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-ivory flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-medium text-charcoal truncate">{item.product.name}</p>
                    <p className="text-[11px] text-stone-500">
                      Qty: {item.quantity} • {item.selectedFinish}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-charcoal">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              {isGiftWrap && (
                <div className="flex justify-between">
                  <span>Gift Box & Card</span>
                  <span>+{formatPrice(giftWrapFee)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-sm text-charcoal">
                <span>Total Amount</span>
                <span className="font-serif text-xl font-bold">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-gold-dark" />
              <span>2-Year Anti-Tarnish Guarantee Protected</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
