import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";

  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

export function handleError(error) {
  console.error("<--------------------AN ERROR OCCURED----------------->");
  // console.log("name of the error", error.name, error.cause, error.message);

  fetch("http://localhost:3000/send-error-report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": "8ac0c6e750abe935a4f04831a98d7d686d3b0154",
    },
    body: JSON.stringify({
      error: {
        message: error.toString(),
        stackTrace: error.stack,
        appName: "WhatsApp Integration Lite",
      },
    }),
  })
    .then((response) => response.json())
    .then((resData) => console.log(resData.msg))
    .catch((err) => console.log(err));
}
