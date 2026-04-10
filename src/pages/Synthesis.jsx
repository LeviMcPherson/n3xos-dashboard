import { Microscope } from 'lucide-react'
import { useApi } from '../hooks'
import { pageUrl } from '../config'
import { Loader, ErrorBox, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

export default function SynthesisPage() {
  const { data, loading, error, reload } = useApi(pageUrl('synthesis'))
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const observations = data.observations || []

  return (
    <div className="space-y-6">
      <PageHeader title="Synthesis Observations" count={observations.length} onRefresh={reload} />
      <div className="space-y-2">
        {observations.map(o => (
          <div key={o.id} className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {o.observation_type && <Badge text={o.observation_type} variant="default" />}
              {o.confidence && <span className="text-xs text-slate-400">{(o.confidence * 100).toFixed(0)}% confidence</span>}
              <TimeAgo date={o.created_at || o.observed_at} />
            </div>
            {o.observation_text && <p className="text-sm text-slate-300">{o.observation_text}</p>}
            {o.synthesis_summary && <p className="text-xs text-slate-400 mt-1">{o.synthesis_summary}</p>}
          </div>
        ))}
        {observations.length === 0 && <EmptyState message="No synthesis observations yet" icon={Microscope} />}
      </div>
    </div>
  )
}
