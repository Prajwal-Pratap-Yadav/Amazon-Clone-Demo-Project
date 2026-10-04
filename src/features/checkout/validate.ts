export interface CheckoutInput {
  name: string;
  email: string;
}
export type CheckoutErrors = Partial<Record<keyof CheckoutInput, string>>;
export function validateCheckout(input: CheckoutInput): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (input.name.trim().length < 2 || input.name.trim().length > 60)
    errors.name = 'Enter a demo name between 2 and 60 characters.';
  if (
    input.email.length > 120 ||
    !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.test$/i.test(input.email.trim())
  )
    errors.email = 'Use a fictional address ending in .test, such as shopper@example.test.';
  return errors;
}
