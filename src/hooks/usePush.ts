import { useState, useEffect, useCallback } from 'react'
import { subscribePush } from '../api/push'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? ''

const isSupported =
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window

export function usePush() {
  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported ? Notification.permission : 'denied'
  )
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    if (!isSupported) return
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then(setSubscription)
    )
  }, [])

  const subscribe = useCallback(async () => {
    if (!isSupported || !VAPID_PUBLIC_KEY) return
    const reg = await navigator.serviceWorker.ready
    const perm = await Notification.requestPermission()
    setPermission(perm)
    if (perm !== 'granted') return
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY,
    })
    setSubscription(sub)
    await subscribePush(sub)
  }, [])

  const unsubscribe = useCallback(async () => {
    if (!subscription) return
    await subscription.unsubscribe()
    setSubscription(null)
  }, [subscription])

  return { permission, subscription, isSupported, subscribe, unsubscribe }
}
