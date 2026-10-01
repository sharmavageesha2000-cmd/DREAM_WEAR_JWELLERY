import React, { useState } from 'react';
import { Mail, Phone, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { brandConfig } from '../config/brandConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SocialIcons } from '../components/common/SocialIcons';
import { useToast } from '../context/ToastContext';
import { useSEO } from '../hooks/useSEO';

export const ContactUs: React.FC = () => {
  useSEO({
    title: 'Concierge & Atelier Support',
    description: 'Connect with our jewelry concierge team on WhatsApp, email, or telephone for styling advice, order tracking, and custom sizing.',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Tracking Inquiry',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Please enter your name';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) errors.phone = 'Please enter your mobile number';
    if (!formData.message.trim()) errors.message = 'Please type your message';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Thank you! Our concierge will reply within 4 business hours.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Order & Tracking Inquiry',
        message: '',
      });
    }, 800);
  };

  return (
    <div className="py-8 sm:py-16 bg-ivory">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Contact Concierge' },
          ]}
        />

        {/* Header Banner */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-dark font-semibold">
            We Are Here For You
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal-dark">
            Connect With Our Atelier
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            Have questions about styling, anti-tarnish care, custom sizing, or your order? Our concierge is at your service.
          </p>
        </div>

        {/* Main Grid: Form + Info Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="font-serif text-xl font-medium text-charcoal">
                Send a Message
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Average response time: under 4 business hours</p>
            </div>

            {isSubmitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Message Received</p>
                  <p className="text-emerald-800">Our concierge has received your request and will reach out shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Vageesha Sharma"
                    className={`w-full px-3.5 py-2.5 bg-ivory rounded-xl border text-xs text-charcoal focus:outline-none focus:border-gold ${
                      formErrors.name ? 'border-rose-400' : 'border-stone-200'
                    }`}
                  />
                  {formErrors.name && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className={`w-full px-3.5 py-2.5 bg-ivory rounded-xl border text-xs text-charcoal focus:outline-none focus:border-gold ${
                      formErrors.email ? 'border-rose-400' : 'border-stone-200'
                    }`}
                  />
                  {formErrors.email && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3.5 py-2.5 bg-ivory rounded-xl border text-xs text-charcoal focus:outline-none focus:border-gold ${
                      formErrors.phone ? 'border-rose-400' : 'border-stone-200'
                    }`}
                  />
                  {formErrors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs text-charcoal focus:outline-none focus:border-gold"
                  >
                    <option value="Order & Tracking Inquiry">Order & Tracking Inquiry</option>
                    <option value="2-Year Anti-Tarnish Warranty Claim">2-Year Anti-Tarnish Warranty Claim</option>
                    <option value="Return or Exchange Request">Return or Exchange Request</option>
                    <option value="Sizing & Styling Advice">Sizing & Styling Advice</option>
                    <option value="Wholesale / Collaborations">Wholesale / Collaborations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Your Message *</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can we assist you today? Please include your order number if applicable..."
                  className={`w-full p-3.5 bg-ivory rounded-xl border text-xs text-charcoal focus:outline-none focus:border-gold ${
                    formErrors.message ? 'border-rose-400' : 'border-stone-200'
                  }`}
                />
                {formErrors.message && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-gold" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Contact Information Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick WhatsApp Banner */}
            <div className="bg-gradient-to-br from-[#FFFDF9] via-[#F8F2E8] to-[#EFE2CE] text-[#332924] rounded-3xl p-6 sm:p-8 border border-amber-300/70 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#2C2119]">Instant WhatsApp Concierge</h3>
                  <p className="text-[11px] text-[#6B5A4E]">Direct chat with our styling atelier</p>
                </div>
              </div>
              <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">
                Need fast advice on sizing, gift packaging, or order tracking? Chat with us live on WhatsApp.
              </p>
              <a
                href={`https://wa.me/${brandConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md w-full justify-center"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Support Details Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
              <h3 className="font-serif text-lg font-semibold text-charcoal pb-3 border-b border-stone-100">
                Atelier Contact Information
              </h3>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gold-dark mt-0.5" />
                  <div>
                    <p className="font-semibold text-charcoal">Email Inquiries</p>
                    <a href={`mailto:${brandConfig.contact.email}`} className="text-stone-500 hover:text-gold-dark">
                      {brandConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold-dark mt-0.5" />
                  <div>
                    <p className="font-semibold text-charcoal">Customer Helpline</p>
                    <a href={`tel:${brandConfig.contact.phone}`} className="text-stone-500 hover:text-gold-dark">
                      {brandConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gold-dark mt-0.5" />
                  <div>
                    <p className="font-semibold text-charcoal">Business Hours</p>
                    <p className="text-stone-500">{brandConfig.contact.supportHours}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Follow Our Social Journal
                </p>
                <div className="flex items-center gap-3">
                  <SocialIcons
                    instagram={brandConfig.social.instagram}
                    facebook={brandConfig.social.facebook}
                    pinterest={brandConfig.social.pinterest}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
