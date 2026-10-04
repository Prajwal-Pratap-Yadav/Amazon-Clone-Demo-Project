import './styles/tokens.css';
import { categories, products, byId, type Category } from './data/catalog';
import { selectProducts, type Query, type Sort } from './features/catalog/query';
import {
  STORAGE_KEY,
  MAX_QUANTITY,
  reduceCart,
  readCart,
  serializeCart,
  itemCount,
  totals,
  money,
  type Cart,
  type CartAction,
} from './features/cart/cart';
import { validateCheckout } from './features/checkout/validate';

function required<T extends HTMLElement = HTMLElement>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`Missing UI element: ${selector}`);
  return node;
}
function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}
const grid = required('#product-grid');
const search = required<HTMLInputElement>('#search');
const category = required<HTMLSelectElement>('#category');
const sort = required<HTMLSelectElement>('#sort');
const dialog = required<HTMLDialogElement>('#cart-dialog');
const cartLines = required('#cart-lines');
const form = required<HTMLFormElement>('#checkout-form');
const cartButton = required<HTMLButtonElement>('#cart-button');
const checkoutButton = required<HTMLButtonElement>('#checkout-button');
let query: Query = { text: '', category: 'All', sort: 'featured' };
let cart: Cart = {};
let storageAvailable = true;
try {
  cart = readCart(localStorage.getItem(STORAGE_KEY));
} catch {
  storageAvailable = false;
}
function announce(text: string) {
  required('#status').textContent = text;
  if (dialog.open) required('#cart-status').textContent = text;
}
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, serializeCart(cart));
  } catch {
    storageAvailable = false;
  }
  required('#storage-note').textContent = storageAvailable
    ? 'Your demo cart is saved on this browser. No checkout details are saved.'
    : 'Browser storage is unavailable. Your demo cart lasts until this page closes.';
}
function renderCatalog() {
  const visible = selectProducts(products, query);
  const fragment = document.createDocumentFragment();
  for (const product of visible) {
    const card = el('li', 'product-card');
    const image = el('img', 'product-image');
    image.src = `${import.meta.env.BASE_URL}illustrations/${product.illustration}.svg`;
    image.alt = ''; // Adjacent heading already names the decorative drawing.
    image.width = 340;
    image.height = 300;
    image.loading = 'lazy';
    const details = el('div', 'product-details');
    details.append(
      el('p', 'eyebrow', product.category),
      el('h3', '', product.name),
      el('p', 'product-description', product.description),
    );
    const bottom = el('div', 'product-bottom');
    const button = el('button', 'add-button', 'Add +');
    button.type = 'button';
    button.setAttribute('aria-label', `Add ${product.name} to cart`);
    button.dataset.id = product.id;
    button.disabled = (cart[product.id] ?? 0) >= MAX_QUANTITY;
    if (button.disabled) button.textContent = 'Limit reached';
    bottom.append(el('span', 'price', money(product.price)), button);
    details.append(bottom);
    card.append(image, details);
    fragment.append(card);
  }
  grid.replaceChildren(fragment);
  required('#result-count').textContent =
    `${visible.length} ${visible.length === 1 ? 'item' : 'items'}`;
  required('#empty-results').hidden = visible.length !== 0;
}
function renderCart() {
  const focus = (document.activeElement as HTMLElement | null)?.dataset.focus;
  const fragment = document.createDocumentFragment();
  for (const product of products) {
    const quantity = cart[product.id];
    if (!quantity) continue;
    const row = el('li', 'cart-line');
    const description = el('div');
    description.append(
      el('h3', '', product.name),
      el('p', 'muted', `${money(product.price)} each`),
    );
    const controls = el('div', 'line-controls');
    const label = el('label', '', 'Quantity');
    const input = el('input');
    input.type = 'number';
    input.min = '1';
    input.max = String(MAX_QUANTITY);
    input.step = '1';
    input.value = String(quantity);
    input.id = `quantity-${product.id}`;
    label.htmlFor = input.id;
    input.setAttribute('aria-label', `Quantity for ${product.name}`);
    input.dataset.focus = `quantity-${product.id}`;
    input.addEventListener('change', () => {
      const value = input.valueAsNumber;
      if (!Number.isInteger(value) || value < 1 || value > MAX_QUANTITY) {
        input.value = String(quantity);
        announce(`Choose a quantity from 1 to ${MAX_QUANTITY}.`);
        return;
      }
      changeCart({ type: 'quantity', id: product.id, quantity: value });
      announce(`Updated ${product.name} quantity to ${value}.`);
    });
    const remove = el('button', 'text-button', 'Remove');
    remove.type = 'button';
    remove.setAttribute('aria-label', `Remove ${product.name}`);
    remove.dataset.focus = `remove-${product.id}`;
    remove.addEventListener('click', () => {
      changeCart({ type: 'remove', id: product.id });
      required<HTMLButtonElement>('#close-cart').focus();
      announce(`Removed ${product.name}.`);
    });
    controls.append(label, input, remove);
    row.append(description, controls, el('strong', 'line-total', money(product.price * quantity)));
    fragment.append(row);
  }
  cartLines.replaceChildren(fragment);
  const bill = totals(cart);
  required('#subtotal').textContent = money(bill.subtotal);
  required('#delivery').textContent = bill.delivery ? money(bill.delivery) : 'Free';
  required('#total').textContent = money(bill.total);
  required('#empty-cart').hidden = itemCount(cart) > 0;
  checkoutButton.disabled = itemCount(cart) === 0;
  cartButton.setAttribute('aria-label', `Open cart, ${itemCount(cart)} items`);
  required('#cart-count').textContent = String(itemCount(cart));
  if (focus)
    [...cartLines.querySelectorAll<HTMLElement>('[data-focus]')]
      .find((node) => node.dataset.focus === focus)
      ?.focus();
}
function changeCart(action: CartAction) {
  cart = reduceCart(cart, action);
  persist();
  renderCart();
  // Update state without replacing the keyboard user's catalog control.
  for (const button of grid.querySelectorAll<HTMLButtonElement>('button[data-id]')) {
    const wasFocused = document.activeElement === button;
    button.disabled = (cart[button.dataset.id ?? ''] ?? 0) >= MAX_QUANTITY;
    button.textContent = button.disabled ? 'Limit reached' : 'Add +';
    if (button.disabled && wasFocused) cartButton.focus();
  }
}
function updateQuery() {
  query = {
    text: search.value,
    category: category.value as Category | 'All',
    sort: sort.value as Sort,
  };
  renderCatalog();
  announce(`Showing ${required('#result-count').textContent}.`);
}
search.addEventListener('input', updateQuery);
required<HTMLFormElement>('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  required('#collection').scrollIntoView();
});
category.addEventListener('change', updateQuery);
sort.addEventListener('change', updateQuery);
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-category]'))
  button.addEventListener('click', () => {
    const value = button.dataset.category;
    if (value !== 'All' && !categories.includes(value as Category)) return;
    category.value = value ?? 'All';
    search.value = '';
    updateQuery();
    required('#collection').scrollIntoView();
    category.focus({ preventScroll: true });
  });
required<HTMLButtonElement>('#reset-filters').addEventListener('click', () => {
  search.value = '';
  category.value = 'All';
  sort.value = 'featured';
  updateQuery();
  search.focus();
});
grid.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-id]');
  const product = byId.get(button?.dataset.id ?? '');
  if (!product) return;
  changeCart({ type: 'add', id: product.id });
  announce(`Added ${product.name} to cart.`);
});
cartButton.addEventListener('click', () => {
  renderCart();
  dialog.showModal();
});
required<HTMLButtonElement>('#close-cart').addEventListener('click', () => dialog.close());
// Keep sequential Tab navigation on the dialog's visible enabled controls.
// Native modal inertness and Escape behavior remain provided by <dialog>.
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const controls = [
    ...dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]',
    ),
  ].filter((node) => node.getClientRects().length > 0);
  const first = controls[0];
  const last = controls.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
checkoutButton.addEventListener('click', () => {
  required('#cart-view').hidden = true;
  form.hidden = false;
  required('#dialog-title').textContent = 'Demo checkout';
  required<HTMLInputElement>('#demo-name').focus();
});
required<HTMLButtonElement>('#back-to-cart').addEventListener('click', () => {
  form.hidden = true;
  required('#cart-view').hidden = false;
  required('#dialog-title').textContent = 'Your cart';
  checkoutButton.focus();
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = {
    name: required<HTMLInputElement>('#demo-name').value,
    email: required<HTMLInputElement>('#demo-email').value,
  };
  const errors = validateCheckout(input);
  for (const field of ['name', 'email'] as const) {
    required(`#${field}-error`).textContent = errors[field] ?? '';
    required(`#demo-${field}`).setAttribute('aria-invalid', errors[field] ? 'true' : 'false');
  }
  const summary = required('#error-summary');
  summary.hidden = Object.keys(errors).length === 0;
  if (!summary.hidden) {
    summary.textContent = Object.values(errors).join(' ');
    summary.focus();
    return;
  }
  if (!itemCount(cart)) {
    dialog.close();
    return;
  }
  const total = totals(cart).total;
  changeCart({ type: 'clear' });
  form.reset();
  form.hidden = true;
  required('#confirmation').hidden = false;
  required('#confirmation-total').textContent =
    `Demo total: ${money(total)}. Your cart is now empty.`;
  required('#dialog-title').textContent = 'Demo complete';
  required('#confirmation-title').focus();
});
required<HTMLButtonElement>('#continue-shopping').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  form.hidden = true;
  form.reset();
  required('#error-summary').hidden = true;
  for (const field of ['name', 'email']) {
    required(`#${field}-error`).textContent = '';
    required(`#demo-${field}`).removeAttribute('aria-invalid');
  }
  required('#confirmation').hidden = true;
  required('#cart-view').hidden = false;
  required('#dialog-title').textContent = 'Your cart';
  cartButton.focus();
});
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  cart = readCart(event.newValue);
  renderCart();
  renderCatalog();
  announce('Cart updated from another tab.');
  if (itemCount(cart) === 0 && !form.hidden) dialog.close();
});
persist();
renderCatalog();
renderCart();
