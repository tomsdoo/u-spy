type Handler = <T = unknown>(data: T) => void | Promise<void>;
type RegisteredEvent = {
  handler: Handler;
  once?: boolean;
};
const handlersMap = new Map<string | symbol, RegisteredEvent[]>();

export const eventBus = {
  emit<T = unknown>(eventName: string | symbol, data?: T) {
    for (const { handler, once } of handlersMap.get(eventName) ?? []) {
      if (once) {
        eventBus.off(eventName, handler);
      }
      void handler(data);
    }
  },
  on(eventName: string | symbol, handler: Handler) {
    const nextHandlers = [...(handlersMap.get(eventName) ?? []), { handler }];
    handlersMap.set(eventName, nextHandlers);
  },
  off(eventName: string | symbol, handler: Handler) {
    const nextHandlers = (handlersMap.get(eventName) ?? []).filter(
      (registered) => registered.handler !== handler,
    );
    handlersMap.set(eventName, nextHandlers);
  },
  once(eventName: string | symbol, handler: Handler) {
    const nextHandlers = [
      ...(handlersMap.get(eventName) ?? []),
      {
        handler,
        once: true,
      },
    ];
    handlersMap.set(eventName, nextHandlers);
  },
  clear(eventName?: string | symbol) {
    if (eventName == null) {
      handlersMap.clear();
      return;
    }
    handlersMap.delete(eventName);
  },
};
