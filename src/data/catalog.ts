export const categories = ['Desk', 'Home', 'Carry'] as const;
export type Category = (typeof categories)[number];
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly category: Category;
  readonly price: number;
  readonly description: string;
  readonly illustration: string;
}
// Original synthetic names, descriptions and integer-paise prices; no scraping.
export const products: readonly Product[] = [
  {
    id: 'arc-lamp',
    name: 'Arc desk lamp',
    category: 'Desk',
    price: 189900,
    description: 'A little pool of light for your reading corner.',
    illustration: 'lamp',
  },
  {
    id: 'grid-notebook',
    name: 'Grid notebook',
    category: 'Desk',
    price: 34900,
    description: 'Room for sketches, lists and next big ideas.',
    illustration: 'notebook',
  },
  {
    id: 'nest-tray',
    name: 'Nest desk tray',
    category: 'Desk',
    price: 59900,
    description: 'A tidy landing spot for the small things.',
    illustration: 'tray',
  },
  {
    id: 'folio-stand',
    name: 'Folio book stand',
    category: 'Desk',
    price: 89900,
    description: 'Keep your favourite pages within reach.',
    illustration: 'stand',
  },
  {
    id: 'stone-mug',
    name: 'Stone ceramic mug',
    category: 'Home',
    price: 64900,
    description: 'An easy companion for slow mornings.',
    illustration: 'mug',
  },
  {
    id: 'sprout-planter',
    name: 'Sprout planter',
    category: 'Home',
    price: 79900,
    description: 'A simple home for a small patch of green.',
    illustration: 'planter',
  },
  {
    id: 'linen-cushion',
    name: 'Linen cushion',
    category: 'Home',
    price: 119900,
    description: 'A soft accent for your favourite seat.',
    illustration: 'cushion',
  },
  {
    id: 'loop-vase',
    name: 'Loop bud vase',
    category: 'Home',
    price: 94900,
    description: 'One stem, one quiet moment.',
    illustration: 'vase',
  },
  {
    id: 'day-tote',
    name: 'Day canvas tote',
    category: 'Carry',
    price: 129900,
    description: 'For market mornings and everyday wandering.',
    illustration: 'tote',
  },
  {
    id: 'trail-bottle',
    name: 'Trail water bottle',
    category: 'Carry',
    price: 109900,
    description: 'A refill reminder wherever your day goes.',
    illustration: 'bottle',
  },
  {
    id: 'zip-pouch',
    name: 'Zip essentials pouch',
    category: 'Carry',
    price: 49900,
    description: 'Small essentials, all in one place.',
    illustration: 'pouch',
  },
  {
    id: 'pocket-journal',
    name: 'Pocket journal',
    category: 'Carry',
    price: 29900,
    description: 'Take a thought with you.',
    illustration: 'journal',
  },
];
export const byId = new Map(products.map((product) => [product.id, product]));
