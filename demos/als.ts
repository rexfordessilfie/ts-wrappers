import { AsyncLocalStorage } from "async_hooks";
import { als } from "../src";
import crypto from "crypto";

export async function demo() {
  const initStore = (req: Request) => {
    return {
      timestamp: Date.now(),
      traceId: crypto.randomUUID(),
      pathname: new URL(req.url).pathname,
    };
  };

  const storage = new AsyncLocalStorage<ReturnType<typeof initStore>>();

  function handler() {
    const store = storage.getStore();

    const response = new Response("OK");

    if (store) {
      response.headers.set("X-Timestamp", store.timestamp.toString());
      response.headers.set("X-TraceId", store.traceId);
    }

    return response;
  }

  const alsHandler = als(storage, initStore)(handler);

  const response = alsHandler(new Request(new URL("http://localhost:3000")));
  console.log(Object.fromEntries(response.headers.entries()));
}

demo();
