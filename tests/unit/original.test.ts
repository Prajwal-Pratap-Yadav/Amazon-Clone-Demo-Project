import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
it('preserves original HTML/CSS byte for byte, including line endings', () => {
  for (const [name, hash] of Object.entries({
    'index.html': '60a7a98acaf6da1c65ce093c6809ad8ab3842348c93c0862cdd950711bcfe2ea',
    'style.css': '0a3af298ff504db336bf80b7e33dc34e29fc314ef605c2a54652959d83912cba',
  }))
    expect(
      createHash('sha256')
        .update(readFileSync(`legacy/original/${name}`))
        .digest('hex'),
    ).toBe(hash);
});
