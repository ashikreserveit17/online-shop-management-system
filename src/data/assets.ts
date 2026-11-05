/**
 * High-resolution, authentic e-commerce product and brand photography.
 * Real, verified Unsplash CDN images matching specific product titles.
 */
export const IMAGES = {
  // Homepage starting hero banner
  hero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  heroAlt: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80',

  // Women's Collection
  blackKnitTrousers: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  azureSalwarSuit: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
  noirSalwarSuit: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',

  // Men's Wardrobe
  azurePoloShirt: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=900&q=80',
  panjabi: 'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?auto=format&fit=crop&w=900&q=80',
  leatherWallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',

  // Home Appliances
  espressoMachine: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80',
  airFryer: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=900&q=80',

  // Office & Tech
  curvedMonitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  laptopBackpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',

  // Phones & Telecom
  satellitePhone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  wirelessEarbuds: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
  smartWatch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',

  // Automobiles & Lifestyle
  luxurySedan: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80',
  runningSneakers: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  luxuryPerfume: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',

  // Category Banner Defaults
  wardrobe: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
  homeAppliances: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
  officeEquipment: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  telecom: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  automobiles: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80',
  showcase: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
};

/**
 * Normalizes any image URL or legacy placeholder so that high-resolution,
 * authentic product images are always returned.
 */
export function resolveImageUrl(url: string | undefined | null, productName?: string): string {
  // If product name is provided and matches specific known products, prioritize accurate title match
  if (productName) {
    const pn = productName.toLowerCase();
    if (pn.includes('ribbed knit') || (pn.includes('trousers') && pn.includes('black'))) return IMAGES.blackKnitTrousers;
    if (pn.includes('azure blossom')) return IMAGES.azureSalwarSuit;
    if (pn.includes('noir blossom')) return IMAGES.noirSalwarSuit;
    if (pn.includes('polo')) return IMAGES.azurePoloShirt;
    if (pn.includes('panjabi')) return IMAGES.panjabi;
    if (pn.includes('wallet')) return IMAGES.leatherWallet;
    if (pn.includes('espresso') || pn.includes('aerobarista')) return IMAGES.espressoMachine;
    if (pn.includes('air fryer')) return IMAGES.airFryer;
    if (pn.includes('display') || pn.includes('monitor') || pn.includes('provision')) return IMAGES.curvedMonitor;
    if (pn.includes('titan') || pn.includes('satellite') || pn.includes('communicator')) return IMAGES.satellitePhone;
    if (pn.includes('earbud')) return IMAGES.wirelessEarbuds;
    if (pn.includes('smart watch') || pn.includes('smartwatch')) return IMAGES.smartWatch;
    if (pn.includes('backpack')) return IMAGES.laptopBackpack;
    if (pn.includes('perfume') || pn.includes('oud')) return IMAGES.luxuryPerfume;
    if (pn.includes('sneaker') || pn.includes('running')) return IMAGES.runningSneakers;
    if (pn.includes('sedan') || pn.includes('veloce') || pn.includes('car')) return IMAGES.luxurySedan;
  }

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return IMAGES.blackKnitTrousers;
  }

  const clean = url.trim();

  // If valid external image (Unsplash, Cloudinary, etc.)
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    // If it's a broken placeholder or old broken link, replace with high quality asset
    if (clean.includes('placeholder') || clean.includes('via.placeholder')) {
      return IMAGES.blackKnitTrousers;
    }
    return clean;
  }

  // Local assets (e.g. logos)
  if (clean.startsWith('/assets/')) {
    return clean;
  }

  const lower = clean.toLowerCase();

  // Specific product keyword resolution
  if (lower.includes('ribbed') || lower.includes('knit') || lower.includes('trousers')) return IMAGES.blackKnitTrousers;
  if (lower.includes('azure') && (lower.includes('salwar') || lower.includes('blossom'))) return IMAGES.azureSalwarSuit;
  if (lower.includes('noir') && (lower.includes('salwar') || lower.includes('blossom'))) return IMAGES.noirSalwarSuit;
  if (lower.includes('polo')) return IMAGES.azurePoloShirt;
  if (lower.includes('panjabi')) return IMAGES.panjabi;
  if (lower.includes('wallet')) return IMAGES.leatherWallet;
  if (lower.includes('espresso') || lower.includes('barista') || lower.includes('coffee')) return IMAGES.espressoMachine;
  if (lower.includes('fryer')) return IMAGES.airFryer;
  if (lower.includes('display') || lower.includes('curved') || lower.includes('provision')) return IMAGES.curvedMonitor;
  if (lower.includes('titan') || lower.includes('communicator')) return IMAGES.satellitePhone;
  if (lower.includes('earbud')) return IMAGES.wirelessEarbuds;
  if (lower.includes('watch')) return IMAGES.smartWatch;
  if (lower.includes('backpack')) return IMAGES.laptopBackpack;
  if (lower.includes('perfume') || lower.includes('oud')) return IMAGES.luxuryPerfume;
  if (lower.includes('sneaker')) return IMAGES.runningSneakers;
  if (lower.includes('sedan') || lower.includes('veloce') || lower.includes('car')) return IMAGES.luxurySedan;

  // Category level resolution
  if (lower.includes('hero') || lower.includes('starting') || lower.includes('banner')) return IMAGES.hero;
  if (lower.includes('wardrobe') || lower.includes('dress') || lower.includes('cloth')) return IMAGES.wardrobe;
  if (lower.includes('appliance') || lower.includes('kitchen')) return IMAGES.homeAppliances;
  if (lower.includes('office') || lower.includes('monitor') || lower.includes('desk')) return IMAGES.officeEquipment;
  if (lower.includes('telecom') || lower.includes('phone')) return IMAGES.telecom;
  if (lower.includes('auto') || lower.includes('car')) return IMAGES.automobiles;

  // If it's a data URI, allow it unless it was old broken base64
  if (clean.startsWith('data:image/')) {
    // Only return if valid
    return clean;
  }

  return IMAGES.blackKnitTrousers;
}
