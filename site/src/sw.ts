import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

export interface ServiceWorkerPayload {
  type: string,
  url: string,
}
export interface ServiceWorkerEvent {
  data: ServiceWorkerPayload
}

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('fetch', internalAPIHandler);

self.skipWaiting();
clientsClaim();


/**
 * Main job of this is to add a global listener for unauthorized api calls,
 * instead of having to handle unauthorized logic in every service.
 */
function internalAPIHandler(event: FetchEvent) {
  // http with an optional 's',
  // then anything that isnt a slash,
  // then '/api/' as the first part of path.
  // then whatever
  const apiMatcher = /^https?:\/\/[^\/]+\/api\//;

  if (!apiMatcher.test(event.request.url)) {
    return;
  }

  event.respondWith(
    fetch(event.request).then(response => {
      if (response.status === 401) {
        notifyClient(event, {
          type: 'unauthorized',
          url: event.request.url,
        });
        return response;
      }

      return response;
    })
  );
}

async function notifyClient(event: FetchEvent, payload: ServiceWorkerPayload) {
  // Exit early if we don't have access to the client.
  // Eg, if it's cross-origin.
  if (!event.clientId) {
    return;
  }

  // Get the client.
  const client = await self.clients.get(event.clientId);
  // Exit early if we don't get the client.
  // Eg, if it closed.
  if (!client) {
    return;
  }

  // Send a message to the client.
  client.postMessage(payload);
}
