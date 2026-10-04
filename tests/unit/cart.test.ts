import { describe, expect, it } from 'vitest';
import {
  MAX_QUANTITY,
  itemCount,
  money,
  readCart,
  reduceCart,
  serializeCart,
  totals,
} from '../../src/features/cart/cart';
describe('cart and pricing', () => {
  it('changes immutable cart state and clears it', () => {
    const original = { 'grid-notebook': 1 };
    const added = reduceCart(original, { type: 'add', id: 'grid-notebook' });
    expect(original).toEqual({ 'grid-notebook': 1 });
    expect(added).toEqual({ 'grid-notebook': 2 });
    const changed = reduceCart(added, { type: 'quantity', id: 'grid-notebook', quantity: 3 });
    expect(itemCount(changed)).toBe(3);
    expect(reduceCart(changed, { type: 'remove', id: 'grid-notebook' })).toEqual({});
    expect(reduceCart(changed, { type: 'quantity', id: 'grid-notebook', quantity: 0 })).toEqual({});
    expect(reduceCart(changed, { type: 'clear' })).toEqual({});
  });
  it('bounds quantities and rejects arbitrary IDs and invalid numbers', () => {
    const cart = { 'grid-notebook': MAX_QUANTITY };
    expect(reduceCart(cart, { type: 'add', id: 'grid-notebook' })).toEqual(cart);
    expect(reduceCart(cart, { type: 'add', id: '__proto__' })).toBe(cart);
    for (const quantity of [-1, 0.5, 21, NaN, Infinity])
      expect(reduceCart(cart, { type: 'quantity', id: 'grid-notebook', quantity })).toBe(cart);
  });
  it('recovers corrupt storage without importing unknown keys', () => {
    for (const text of [null, 'bad', 'null', '[]', '{"version":2,"lines":{}}', 'x'.repeat(4097)])
      expect(readCart(text)).toEqual({});
    expect(
      readCart(
        '{"version":1,"lines":{"__proto__":1,"arc-lamp":1.2,"grid-notebook":3,"stone-mug":"2","day-tote":21}}',
      ),
    ).toEqual({ 'grid-notebook': 3 });
    expect(readCart(serializeCart({ 'arc-lamp': 2 }))).toEqual({ 'arc-lamp': 2 });
  });
  it('computes integer totals and delivery boundary without fractional rounding', () => {
    expect(totals({})).toEqual({ subtotal: 0, delivery: 0, total: 0 });
    expect(totals({ 'grid-notebook': 2 })).toEqual({
      subtotal: 69800,
      delivery: 14900,
      total: 84700,
    });
    expect(totals({ 'arc-lamp': 2 }).delivery).toBe(0);
    expect(money(12345)).toBe('₹123.45');
    expect(() => money(1.2)).toThrow(RangeError);
    expect(() => money(-1)).toThrow(RangeError);
  });
});
