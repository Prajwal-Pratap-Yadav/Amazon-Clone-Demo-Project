import { describe, expect, it } from 'vitest';
import { validateCheckout } from '../../src/features/checkout/validate';
describe('fictional checkout', () => {
  it('accepts a Unicode demo name and fictional address', () => {
    expect(validateCheckout({ name: ' नमूना ', email: 'shopper@example.test' })).toEqual({});
  });
  it('rejects missing, oversized and real-domain fields', () => {
    expect(Object.keys(validateCheckout({ name: '', email: '' }))).toEqual(['name', 'email']);
    expect(validateCheckout({ name: 'x'.repeat(61), email: 'shopper@example.com' })).toHaveProperty(
      'name',
    );
    expect(validateCheckout({ name: 'Demo', email: 'two@@example.test' })).toHaveProperty('email');
  });
});
