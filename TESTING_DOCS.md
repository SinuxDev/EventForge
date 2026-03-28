# Backend Testing Docs

## What We Use

- **Runner:** Jest
- **Integration HTTP Testing:** Supertest
- **Test Database:** mongodb-memory-server
- **Language:** TypeScript (`ts-jest`)

## Folder Structure

```text
src/
  test/
    jest.setup.ts
    utils/
      mongo-memory.ts
    unit/
      auth.validation.test.ts
      auth.service-token.test.ts
    integration/
      setup.ts
      health.test.ts
      auth.test.ts
```

## Conventions

- Use `*.test.ts`.
- Put isolated logic/validation tests in `unit/`.
- Put route-level API behavior tests in `integration/`.
- Keep tests **black-box**: verify status codes, response body, and externally observable behavior.

## Commands

```bash
npm run test
npm run test:watch
npm run test:unit
npm run test:integration
npm run lint
npm run build
```

## Notes

- First integration run may download a MongoDB binary for memory server.
- Environment defaults for tests are set in `src/test/jest.setup.ts`.
- Test logs are muted by default; set `DEBUG_TEST_LOGS=true` to see console output.

## Add a New Test

1. Choose `unit` or `integration`.
2. Place the file under `src/test/<type>/...` by feature/domain.
3. For integration tests, import `src/test/integration/setup.ts`.
4. Run `npm run test`.
