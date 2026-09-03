export interface PassTier {
  id: string;
  name: string;
  badge: string;
  price: string;
  currency: string;
  description: string;
  tokenType: string;
  features: string[];
  recommended?: boolean;
}

export const PASS_TIERS: PassTier[] = [
  {
    id: 'standard',
    name: 'STANDARD FREQUENCY',
    badge: 'TIER 01 // GENERAL',
    price: '₹ 8,500',
    currency: 'INR',
    description: 'Complete 2-day access to all 3 stages (CORE, VOID, SIGNAL) and central digital art installations.',
    tokenType: 'Anodized Carbon Access Key',
    features: [
      'Access to all 3 Stages across 2 Nights',
      'Entry to Digital Arts Pavilions & Installations',
      'RFID Frequency Token Wristband',
      'Full Interactive Festival Map & Schedule App',
    ],
  },
  {
    id: 'vip',
    name: 'SPATIAL VIP PASS',
    badge: 'TIER 02 // ELEVATED',
    price: '₹ 16,500',
    currency: 'INR',
    description: 'Elevated spatial listening positions, expedited resonance entry, and backstage acoustic lounge access.',
    tokenType: 'Brushed Titanium Resonance Key',
    recommended: true,
    features: [
      'Priority Fast-Track Resonance Gate Entry',
      'Elevated Binaural Spatial Audio Viewing Platforms',
      'Access to The Subterranean VIP Lounge & Rest Areas',
      'Exclusive Artist Spatial Sound Stems & Master Download',
      'Dedicated Bar & Acoustic Recovery Lounges',
    ],
  },
  {
    id: 'resonance',
    name: 'FULL RESONANCE TOKEN',
    badge: 'TIER 03 // COLLECTOR',
    price: '₹ 28,000',
    currency: 'INR',
    description: 'The ultimate architectural & artistic immersion. Private sound engineer walk-through and physical NFC collector token.',
    tokenType: 'Smoked Chrome & Titanium Physical Resonance Token',
    features: [
      'All Spatial VIP Perks Included',
      'Private Pre-Festival Sound System Acoustic Calibration Tour',
      'Backstage & Artist Enclave Access',
      'Physical Machined Titanium NFC Resonance Gate Token',
      'Invitation to the Private Opening & Closing Ceremony Sessions',
    ],
  },
];
