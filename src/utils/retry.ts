import { sleep } from "@/utils/sleep";

interface RetryOptions<T> {
  maxAttempts?: number;
  delay?: number;
  shouldRetryResult?: (res: T) => boolean;
  shouldRetryError?: (err: Error) => boolean;
}

async function attemptToExecute<T>(fn: () => T | Promise<T>) {
  let result: T | undefined;
  let hasError = false;
  let lastError: Error | undefined;

  try {
    result = await fn();
  } catch (error) {
    hasError = true;
    lastError = error as Error;
  }

  return { result: result as T, hasError, lastError: lastError as Error };
}

export async function withRetry<T>(
  fn: () => T | Promise<T>,
  options: RetryOptions<T> = {},
) {
  const {
    maxAttempts = 3,
    delay = 1000,
    shouldRetryResult = (_res) => false,
    shouldRetryError = (_err) => true,
  } = options;

  for (let attempt = 0; attempt <= maxAttempts - 1; attempt++) {
    const { result, hasError, lastError } = await attemptToExecute(fn);

    if (hasError && shouldRetryError(lastError) === false) {
      throw lastError;
    }
    if (hasError === false && shouldRetryResult(result) === false) {
      return result;
    }

    await sleep(delay);
  }

  const { result, hasError, lastError } = await attemptToExecute(fn);
  if (hasError) {
    throw lastError;
  }
  return result;
}
