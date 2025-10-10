const policy = (() => {
  const htmlCreator = {
    createHTML(value: string) {
      return value;
    },
  };
  try {
    // @ts-expect-error trustedTypes interface
    return trustedTypes.createPolicy("us-policy", htmlCreator);
  } catch {
    return htmlCreator;
  }
})();

export function createTrustedHtml(value: string) {
  try {
    return policy.createHTML(value);
  } catch {
    return value;
  }
}
