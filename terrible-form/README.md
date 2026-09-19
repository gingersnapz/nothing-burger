# Form 404-B

A standalone static joke at `/terrible-form/`, linked from the homepage. All input remains in memory; no storage, analytics, network submission, or real account creation. Use fictional details.

- `index.html`: three sections and the completion receipt.
- `form.css`: scoped form styling layered over the shared site stylesheet.
- `rules.js`: UTC birthday offsets, password checks, and per-section validation.
- `form.js`: letter shuffling, date slider, scroll acknowledgement, two bounded submit-button relocations, completion, and reset.

The intentionally awkward controls remain keyboard-operable. The birthday accepts any date from January 1, 1900 through today. Changing it clears its confirmation. The password rules always admit the sample in the optional loophole. Back navigation preserves progress. Restart clears all fields and re-locks acknowledgement. No actual CAPTCHA or legally binding terms are involved.

Run `npm test` from the repository root. Browser checks: invalid and valid paths, birthday confirmation reset, keyboard scrolling, all three submit attempts, successful receipt, complete restart, homepage round trip, and widths 320/390/768/1440. URL-relative assets support both a GitHub project subpath and a custom-domain root.
