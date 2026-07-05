import * as schemas from '../packages/validations/src/index';

/**
 * Smoke test for Zod schemas.
 * Ensures that basic valid/invalid cases are handled correctly to prevent
 * accidental breaking changes to core validations in CI.
 */
function runTests() {
  let passed = 0;
  let failed = 0;

  console.log('Running Zod schema validations...\n');

  // 1. CreateUserSchema
  const validUser = { email: 'test@bamblu.dev', name: 'Test User', githubHandle: 'test-user' };
  const invalidUser = { email: 'not-an-email' };
  
  if (schemas.CreateUserSchema.safeParse(validUser).success) passed++; else failed++;
  if (!schemas.CreateUserSchema.safeParse(invalidUser).success) passed++; else failed++;

  // 2. SyncRequestSchema
  if (schemas.SyncRequestSchema.safeParse({ sources: ['github'] }).success) passed++; else failed++;
  if (!schemas.SyncRequestSchema.safeParse({ sources: [] }).success) passed++; else failed++;

  // 3. ActivityQuerySchema
  const validActivity = { userId: '123e4567-e89b-12d3-a456-426614174000', source: 'github', page: 1, pageSize: 20 };
  if (schemas.ActivityQuerySchema.safeParse(validActivity).success) passed++; else failed++;

  console.log(`Results: ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    console.error('Validation tests failed!');
    process.exit(1);
  }
}

runTests();
