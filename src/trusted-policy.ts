// @ts-expect-error trustedTypes interface
const transparentPolicy = trustedTypes.createPolicy("us-policy", {
  createHTML(value: string) {
    return value;
  },
});

export function createTrustedHtml(value: string) {
  try {
    return transparentPolicy.createHTML(value);
  } catch {
    return value;
  }
}
