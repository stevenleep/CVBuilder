/**
 * 性能监控 - 开发环境自动追踪操作耗时
 */

const ENABLE_PERF_MONITORING = import.meta.env.DEV

export interface PerfStats {
  buildNodeMapCount: number
  incrementalUpdateCount: number
  historySnapshotCount: number
  avgBuildTime: number
  avgIncrementalTime: number
}

const perfStats: PerfStats = {
  buildNodeMapCount: 0,
  incrementalUpdateCount: 0,
  historySnapshotCount: 0,
  avgBuildTime: 0,
  avgIncrementalTime: 0,
}

export function measurePerf<T, A extends unknown[]>(
  fn: (...args: A) => T,
  statKey: keyof PerfStats,
  name: string
): (...args: A) => T {
  if (!ENABLE_PERF_MONITORING) return fn

  return (...args: A) => {
    const start = performance.now()
    const result = fn(...args)
    const duration = performance.now() - start

    const count = perfStats[statKey] as number
    const avgKey = `avg${name}Time` as keyof PerfStats
    if (avgKey in perfStats) {
      const avgTime = perfStats[avgKey] as number
      perfStats[avgKey] = (avgTime * count + duration) / (count + 1)
    }
    perfStats[statKey] = (count + 1) as PerfStats[typeof statKey]

    if (duration > 10) {
      console.warn(`[Perf] ${name} took ${duration.toFixed(2)}ms`)
    }

    return result
  }
}

export function getPerformanceStats(): PerfStats {
  return { ...perfStats }
}

export function resetPerformanceStats(): void {
  Object.keys(perfStats).forEach(key => {
    Reflect.set(perfStats, key, 0)
  })
}
