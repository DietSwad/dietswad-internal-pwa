/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  ({ url }) =>
    url.origin === 'https://dietswad-api.azurewebsites.net' &&
    url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 300 }),
    ],
  })
)

self.addEventListener('push', (event) => {
  const data = (event as PushEvent).data?.json() ?? {}
  const title: string = data.title ?? 'Diet Swad'
  const options: NotificationOptions = {
    body: data.body ?? 'New notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data.url ? { url: data.url } : undefined,
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  const e = event as NotificationEvent
  e.notification.close()
  const url: string = e.notification.data?.url ?? '/'
  e.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((c) => c.url === url && 'focus' in c)
        if (existing) return (existing as WindowClient).focus()
        return self.clients.openWindow(url)
      })
  )
})
