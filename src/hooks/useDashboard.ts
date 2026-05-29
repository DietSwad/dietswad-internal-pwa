import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDashboard, triggerRefresh, markForceFresh, type DashboardType } from '../api/dashboards'

export function useDashboard<T>(type: DashboardType) {
  return useQuery({
    queryKey: ['dashboard', type],
    queryFn: () => getDashboard<T>(type),
    staleTime: 60_000,
  })
}

export function useTriggerRefresh() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => triggerRefresh('full-refresh'),
    onSuccess: () => {
      markForceFresh()
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
