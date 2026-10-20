# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A teaching exercise ("Clase 1 — SRP & OCP") for a fictional online shop, PedidoExpress. The goal is to refactor a deliberately monolithic `OrderService` so it follows the Single Responsibility and Open/Closed principles. The README (in Spanish) holds the full assignment, acceptance criteria and hints.

## Commands

Requires Node >= 22. There is no build step: TypeScript runs directly via `tsx` (demo) and `vitest` (tests).

```bash
npm install
npm test                                      # vitest run (18 tests)
npx vitest run test/order-service.test.ts -t "<test name>"   # single test
npm run test:watch
npm run typecheck                             # tsc --noEmit (src + test)
npm run demo                                  # tsx src/demo.ts
```

## Architecture

- `src/order-service.ts` is the only logic file. `processOrder()` does everything in one method: validation, subtotal, customer discount, payment fee, shipping, tax (21%), text invoice, DB insert, confirmation email. It returns the invoice text. `exportInvoice(order, format)` reuses `processOrder`, so exporting also persists the order and sends an email (a known bug the exercise wants fixed by separating calculation from side effects).
- `src/types.ts` is the domain model (Order, Customer, OrderLine).
- `src/infra/database.ts` and `src/infra/email-gateway.ts` are in-memory singletons that the tests inspect and reset directly. Keep them importable as singletons.
- The four `switch`/`if` chains over customer type, payment method, country and export format are the intended OCP targets. New cases (e.g. `partner` customer at 15%, Bizum at 0.5% fee, JSON export) should be added as new files plus registration, not by editing existing branches.

## Constraints

- `test/order-service.test.ts` must NOT be modified. It is the safety net and pins current behavior (rounding, invoice text format, error messages, the fixed `createdAt` timestamp). `OrderService`, its `processOrder` and `exportInvoice` signatures, and the infra singletons are its public surface.
- Tests for the new cases (partner, Bizum, JSON export) go in new test files.
- Acceptance: `npm test` and `npm run typecheck` both pass. No new module may mix money calculation with text formatting, persistence, or email.
- Imports use explicit `.ts` extensions (`allowImportingTsExtensions`).
- Code and error messages in the source are in Spanish; the global convention is to write new docs in English.
