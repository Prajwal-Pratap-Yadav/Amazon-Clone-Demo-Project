import { describe, expect, it } from 'vitest';
import { products } from '../../src/data/catalog';
import { selectProducts } from '../../src/features/catalog/query';
describe('catalog', () => {
  it('matches all words across fields and ignores case', () => {
    expect(
      selectProducts(products, { text: ' DESK light ', category: 'All', sort: 'featured' }).map(
        (p) => p.id,
      ),
    ).toEqual(['arc-lamp']);
  });
  it('combines category and query, including empty results', () => {
    expect(selectProducts(products, { text: 'lamp', category: 'Carry', sort: 'featured' })).toEqual(
      [],
    );
    expect(selectProducts(products, { text: '', category: 'Home', sort: 'featured' })).toHaveLength(
      4,
    );
  });
  it('sorts without mutating catalog', () => {
    const ids = products.map((p) => p.id);
    expect(selectProducts(products, { text: '', category: 'All', sort: 'price-low' })[0]?.id).toBe(
      'pocket-journal',
    );
    expect(selectProducts(products, { text: '', category: 'All', sort: 'price-high' })[0]?.id).toBe(
      'arc-lamp',
    );
    expect(selectProducts(products, { text: '', category: 'All', sort: 'name' })[0]?.id).toBe(
      'arc-lamp',
    );
    expect(products.map((p) => p.id)).toEqual(ids);
  });
  it('treats markup as text', () => {
    expect(
      selectProducts(products, { text: '<img onerror=alert(1)>', category: 'All', sort: 'name' }),
    ).toEqual([]);
  });
});
