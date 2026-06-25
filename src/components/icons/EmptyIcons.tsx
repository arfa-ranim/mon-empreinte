// src/components/icons/EmptyIcons.tsx

export const ProductIcon = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="30" width="40" height="40" rx="8" fill="#FFE0D6" stroke="#FFB5A0" strokeWidth="2"/>
    <rect x="30" y="38" width="20" height="4" rx="2" fill="#FFB5A0"/>
    <rect x="30" y="46" width="20" height="4" rx="2" fill="#FFB5A0"/>
    <rect x="30" y="54" width="12" height="4" rx="2" fill="#FFB5A0"/>
    <path d="M35 20 L45 20 L45 30 L35 30 L35 20Z" fill="#D4C5F9" stroke="#D4C5F9" strokeWidth="2"/>
    <circle cx="60" cy="50" r="6" fill="#A8D8C8" stroke="#A8D8C8" strokeWidth="2"/>
    <circle cx="20" cy="45" r="4" fill="#D4C5F9"/>
    <path d="M65 30 L75 35 L75 45 L65 40 L65 30Z" fill="#F0DBA8" stroke="#F0DBA8" strokeWidth="2"/>
  </svg>
);

export const WorkshopIcon = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="25" width="50" height="40" rx="8" fill="#D6F0E8" stroke="#A8D8C8" strokeWidth="2"/>
    <rect x="20" y="35" width="40" height="20" rx="4" fill="#A8D8C8" opacity="0.4"/>
    <circle cx="40" cy="45" r="8" fill="#A8D8C8" opacity="0.6"/>
    <path d="M25 15 L55 15 L55 25 L25 25 L25 15Z" fill="#F0DBA8" stroke="#F0DBA8" strokeWidth="2"/>
    <path d="M35 15 L45 15 L45 25 L35 25 L35 15Z" fill="#FFFCF8"/>
    <circle cx="40" cy="20" r="3" fill="#FFB5A0"/>
    <circle cx="20" cy="55" r="4" fill="#D4C5F9"/>
    <circle cx="60" cy="55" r="4" fill="#D4C5F9"/>
  </svg>
);

export const GalleryIcon = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="15" width="60" height="50" rx="8" fill="#EEE8FC" stroke="#D4C5F9" strokeWidth="2"/>
    <circle cx="30" cy="35" r="8" fill="#FFB5A0" opacity="0.6"/>
    <rect x="42" y="28" width="24" height="18" rx="4" fill="#A8D8C8" opacity="0.6"/>
    <path d="M12 60 L28 44 L36 52 L54 34 L68 48 L68 65 L12 65L12 60Z" fill="#F0DBA8" opacity="0.8"/>
    <circle cx="24" cy="28" r="3" fill="#D4C5F9"/>
    <circle cx="58" cy="22" r="3" fill="#FFB5A0"/>
    <rect x="12" y="65" width="56" height="4" rx="2" fill="#D4C5F9" opacity="0.4"/>
  </svg>
);

export const MessageIcon = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="20" width="50" height="35" rx="8" fill="#FFE0D6" stroke="#FFB5A0" strokeWidth="2"/>
    <path d="M15 35 L30 45 L45 35" stroke="#FFB5A0" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="28" cy="30" r="4" fill="#D4C5F9"/>
    <circle cx="52" cy="30" r="4" fill="#D4C5F9"/>
    <rect x="20" y="55" width="40" height="8" rx="4" fill="#D4C5F9" opacity="0.3"/>
  </svg>
);