import React from 'react';

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const OfficialInstagramLogo: React.FC<{ className?: string }> = ({
  className = 'w-10 h-10',
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ig-official-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </linearGradient>
    </defs>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="url(#ig-official-gradient)" />
    <rect
      x="5.5"
      y="5.5"
      width="13"
      height="13"
      rx="3.5"
      stroke="white"
      strokeWidth="1.6"
      fill="none"
    />
    <circle cx="12" cy="12" r="3.2" stroke="white" strokeWidth="1.6" fill="none" />
    <circle cx="15.8" cy="8.2" r="0.9" fill="white" />
  </svg>
);


export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const PinterestIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m8 20 4-9" />
    <path d="M10.7 13c.43 1.2 1.3 2 2.8 2 2.2 0 4-1.8 4-4a4 4 0 0 0-4-4c-2.8 0-4.5 2.1-4.5 4.5 0 1.2.5 2.1 1.2 2.5" />
  </svg>
);

export const SocialIcons: React.FC<{
  instagram?: string;
  facebook?: string;
  pinterest?: string;
  className?: string;
}> = ({ instagram, facebook, pinterest, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {instagram && (
      <a
        href={instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-stone-100 text-charcoal hover:bg-gold-light/30 hover:text-gold-dark transition-colors"
        aria-label="Instagram"
      >
        <InstagramIcon className="w-4 h-4" />
      </a>
    )}
    {facebook && (
      <a
        href={facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-stone-100 text-charcoal hover:bg-gold-light/30 hover:text-gold-dark transition-colors"
        aria-label="Facebook"
      >
        <FacebookIcon className="w-4 h-4" />
      </a>
    )}
    {pinterest && (
      <a
        href={pinterest}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-stone-100 text-charcoal hover:bg-gold-light/30 hover:text-gold-dark transition-colors"
        aria-label="Pinterest"
      >
        <PinterestIcon className="w-4 h-4" />
      </a>
    )}
  </div>
);
