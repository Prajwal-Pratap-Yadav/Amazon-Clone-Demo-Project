import type { Category, Product } from '../../data/catalog';
export type Sort = 'featured' | 'price-low' | 'price-high' | 'name';
export interface Query {
  text: string;
  category: Category | 'All';
  sort: Sort;
}
const normalize = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export function selectProducts(catalog: readonly Product[], query: Query): Product[] {
  const words = normalize(query.text.trim().slice(0, 100)).split(/\s+/).filter(Boolean);
  const result = catalog.filter(
    (product) =>
      (query.category === 'All' || product.category === query.category) &&
      words.every((word) =>
        normalize(`${product.name} ${product.category} ${product.description}`).includes(word),
      ),
  );
  if (query.sort === 'price-low')
    result.sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));
  if (query.sort === 'price-high')
    result.sort((a, b) => b.price - a.price || a.id.localeCompare(b.id));
  if (query.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
