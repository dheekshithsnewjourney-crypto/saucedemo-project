# Sauce Demo - Playwright test suite

Automated tests for https://www.saucedemo.com written with Playwright and TypeScript.

## What is covered

| File | What it checks |
|---|---|
| `auth.spec.ts` | Login, wrong password, empty fields, locked-out user, logout |
| `homepage.spec.ts` | Header, sort filter, product list, product details, footer links |
| `cart.spec.ts` | Add and remove items, cart badge, cart page, refresh |
| `checkout.spec.ts` | Full purchase, missing-field errors, total = items + tax |
| `edge-cases.spec.ts` | Bad input, script text, wrong case, back button after logout, special users |
| `accessibility.spec.ts` | Keyboard login, alt text, headings, field labels |
| `axe.spec.ts` | Automatic WCAG scan with axe-core |
| `api.spec.ts` | Restful-Booker API: create, read, update, delete, with and without a token |
| `mocking.spec.ts` | Faking network responses |

Browsers: Chromium, Firefox, WebKit, Pixel 5 and iPhone 12 (mobile emulation).

## Run it

```
npm install
npx playwright install
npm run test:chromium     # one browser, fastest
npm test                  # all browsers, one test at a time (slower, but stable)
npm run test:firefox      # Firefox alone
npm run test:firefox:headed   # Firefox with a visible window, if headless Firefox hangs
npm run test:ui           # Playwright UI mode
npm run report            # open the last HTML report
```

## Bugs found

- The inventory page has no semantic headings (`h1` to `h6`), so screen-reader users cannot navigate by heading.
- `problem_user` sees the same image for every product.
- The app sends background requests to `events.backtrace.io` with placeholder values (`universe=UNIVERSE&token=TOKEN`) and gets 401.
