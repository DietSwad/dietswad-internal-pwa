import { apiClient } from './client'

export async function subscribePush(subscription: PushSubscription): Promise<void> {
  await apiClient.post('/push-subscribe', { subscription: subscription.toJSON() })
}
