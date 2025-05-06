function startToObserve<T extends HTMLElement = HTMLElement>(instance: T, callback: () => void) {
  const observer = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
      if (mutation.type !== "attributes") {
        continue;
      }
      if (mutation.attributeName == null) {
        continue;
      }
      if (mutation.attributeName.startsWith(":") === false) {
        continue;
      }
      const propName = mutation.attributeName
        .replace(/^:/, "")
        .replace(/-([a-z])/g, ($0, $1) => $1.toUpperCase());
      if (propName in instance === false) {
        continue;
      }
      const isPropValid = ((instance: T, propName: string): instance is T & { [propName: string]: string } => {
        return true;
      })(instance, propName);
      if (isPropValid === false) {
        continue;
      }
      // @ts-expect-error writing instance property
      instance[propName] = (() => {
        try {
          return JSON.parse((mutation.target as Element)
            .attributes
            .getNamedItem(mutation.attributeName)?.value ?? "");
        } catch {
          return null;
        }
      })();
      callback();
    }
  });
  observer.observe(instance, { attributes: true });
  return observer;
}

export class BaseElement extends HTMLElement {
  observer: MutationObserver | null = null;
  template: string | ((instance: typeof this) => Promise<string>) = "";
  connectedCallback() {
    this.observer = startToObserve(this, () => {
      this.reflectContent();
    });
    const attrs = Array.from(
      { length: this.attributes.length },
      (v,i) => i
    )
      .map(i => this.attributes.item(i))
      .filter(v => v != null);
    for(const { name, value } of attrs) {
      if (name.startsWith(":") === false) {
        continue;
      }
      const propName = name
        .replace(/^:/, "")
        .replace(/-([a-z])/g, ($0, $1) => $1.toUpperCase());
      if (propName in this === false) {
        continue;
      }
      const isPropValid = ((instance: typeof this, propName: string): instance is typeof this & { [propName: string]: string } => {
        return true;
      })(this, propName);
      if (isPropValid === false) {
        continue;
      }
      // @ts-expect-error writing instance property
      this[propName] = (() => {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      })();
    }
    this.reflectContent();
  }
  async reflectContent() {
    this.innerHTML = "";
    const contentHtml = typeof this.template === "string"
      ? this.template
      : await this.template(this);
    this.appendChild(
      document.createRange().createContextualFragment(contentHtml),
    );
    this.onRendered();
  }
  onRendered() {}
  disconnectedCallback() {
    if (this.observer == null) {
      return;
    }
    this.observer.disconnect();
  }
}
