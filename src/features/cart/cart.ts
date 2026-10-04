import { byId, products } from '../../data/catalog';
export const MAX_QUANTITY = 20;
export const STORAGE_KEY = 'everyday-cart-v1';
export const FREE_DELIVERY_AT = 300000;
export const DELIVERY_FEE = 14900;
export type Cart = Readonly<Record<string, number>>;
export type CartAction =
  | { type: 'add'; id: string }
  | { type: 'quantity'; id: string; quantity: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' };
export function reduceCart(cart: Cart, action: CartAction): Cart {
  if (action.type === 'clear') return {};
  if (!byId.has(action.id)) return cart;
  const next = { ...cart };
  if (action.type === 'remove') delete next[action.id];
  if (action.type === 'add') next[action.id] = Math.min(MAX_QUANTITY, (cart[action.id] ?? 0) + 1);
  if (action.type === 'quantity') {
    if (!Number.isInteger(action.quantity) || action.quantity < 0 || action.quantity > MAX_QUANTITY)
      return cart;
    if (action.quantity === 0) delete next[action.id];
    else next[action.id] = action.quantity;
  }
  return next;
}
// Stored text is untrusted: import only bounded quantities for known IDs.
export function readCart(text: string | null): Cart {
  if (!text || text.length > 4096) return {};
  try {
    const value: unknown = JSON.parse(text);
    if (
      typeof value !== 'object' ||
      value === null ||
      !('version' in value) ||
      value.version !== 1 ||
      !('lines' in value) ||
      typeof value.lines !== 'object' ||
      value.lines === null ||
      Array.isArray(value.lines)
    )
      return {};
    const lines = value.lines as Record<string, unknown>;
    return Object.fromEntries(
      products.flatMap((product) => {
        const q = lines[product.id];
        return typeof q === 'number' && Number.isInteger(q) && q > 0 && q <= MAX_QUANTITY
          ? [[product.id, q]]
          : [];
      }),
    );
  } catch {
    return {};
  }
}
export const serializeCart = (cart: Cart) => JSON.stringify({ version: 1, lines: cart });
export const itemCount = (cart: Cart) =>
  Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
export function totals(cart: Cart) {
  const subtotal = products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] ?? 0),
    0,
  );
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
  return { subtotal, delivery, total: subtotal + delivery };
}
export function money(minorUnits: number) {
  if (!Number.isSafeInteger(minorUnits) || minorUnits < 0)
    throw new RangeError('Price must be nonnegative integer paise');
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100);
}
