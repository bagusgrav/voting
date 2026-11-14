export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  delayMs = 1500,
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let response: Response;

    try {
      response = await fetch(url, options);
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    if (response.status < 500 || response.status > 599) {
      return response;
    }

    if (attempt === retries) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error("Request failed after all retry attempts.");
}
