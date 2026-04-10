import { TrendingUp } from 'lucide-react'
import { useApi } from '../hooks'
import { pageUrl } from '../config'
import { Loader, ErrorBox, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

export default function PredictionsPage() {
  const { data, loading, error, reload } = useApi(pageUrl('predictions'))
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const forecasts = data.forecasts || []

  return (
    <div className="space-y-6">
      <PageHeader title="Predictive Forecasts" count={forecasts.length} onRefresh={reload} />
      <div className="space-y-2">
        {forecasts.map(f => (
          <div key={f.id} className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                {f.forecast_type && <Badge text={f.forecast_type} variant="default" />}
                {f.title && <p className="text-sm text-slate-200 mt-1">{f.title}</p>}
                {f.description && <p className="text-xs text-slate-400 mt-1">{f.description}</p>}
              </div>
              <div className="text-right">
                {f.probability != null && (
                  <div className={`text-lg font-bold ${f.probability >= 0.7 ? 'text-emerald-400' : f.probability >= 0.4 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {(f.probability * 100).toFixed(0)}%
                  </div>
                )}
                <TimeAgo date={f.created_at} />
              </div>
            </div>
          </div>
        ))}
        {forecasts.length === 0 && <EmptyState message="No forecasts generated yet" icon={TrendingUp} />}
      </div>
    </div>
  )
}
