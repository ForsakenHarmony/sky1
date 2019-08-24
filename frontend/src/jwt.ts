interface Jwt {
  iat: number;
  exp: number;
}

export function getValidPayloadFromToken<T extends Jwt>(
  token: string
): T | undefined {
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payloadIsValid(payload) ? payload : undefined;
    } catch (_) {}
  }
  return;
}

function payloadIsValid<T extends Jwt>(payload: T): boolean {
  return payload && payload.exp * 1000 > new Date().getTime();
}
