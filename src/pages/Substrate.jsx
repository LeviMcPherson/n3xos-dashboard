import { useApi } from '../hooks'
import { pageUrl } from '../config'
import { Loader, ErrorBox, KpiCard, Badge, SbgmBar, PcStageIndicator, TimeAgo, PageHeader } from '../components/shared'

export default function SubstratePage() {
  const { data, loading, error, reload } = useApi(pageUrl('substrate'))
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const { kpis, entities, judgments, buyer_code_strategies } = data

  return (
    <div className="space-y-6">
      <PageHeader title="Judgment Substrate" onRefresh={reload} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard label="Judgments" value={kpis.total_judgments} color="cyan" />
        <KpiCard label="Scanned" value={kpis.stakeholders_scanned} color="purple" />
        <KpiCard label="Buyer Codes" value={kpis.stakeholders_with_buyer_code} color="emerald" />
        <KpiCard label="Observations" value={kpis.total_observations} color="amber" />
        <KpiCard label="Avg Confidence" value={`${(kpis.avg_confidence * 100).toFixed(0)}%`} color="cyan" />
        <KpiCard label="Tokens Used" value={kpis.total_tokens_used.toLocaleString()} color="purple" />
      </div>

      {/* Entity Cards */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wider">Stakeholders ({entities.length})</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {entities.map(e => (
            <div key={e.id} className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-slate-200">{e.entity_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge text={e.entity_type} variant="default" />
                    <Badge text={e.gate_status || 'unscanned'} variant={e.gate_status === 'active' ? 'active' : 'default'} />
                    {e.pc_stage && <PcStageIndicator stage={e.pc_stage} direction={e.pc_direction} />}
                  </div>
                </div>
                <div className="text-right">
                  {e.mrr_amount > 0 && <div className="text-sm text-emerald-400">${parseFloat(e.mrr_amount).toLocaleString()}</div>}
                  <TimeAgo date={e.last_scanned_at} />
                </div>
              </div>
              <SbgmBar sbgm={e.sbgm_read} />
              {e.buyer_codes && e.buyer_codes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="text-xs text-slate-500 mb-1.5">Buyer Code Sequence</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {e.buyer_codes.sort((a, b) => a.position - b.position).map(bc => (
                      <span key={bc.position} className="px-2 py-1 bg-cyan-900/40 text-cyan-300 rounded text-xs" title={bc.strategy?.core_function || ''}>
                        {bc.position}. {bc.strategy?.human_label || '?'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {e.dominant_tension && (
                <div className="mt-2 text-xs text-slate-500">
                  Tension: <span className="text-slate-300">{e.dominant_tension}</span>
                  {e.tension_resolution && <span className="ml-2 text-slate-400">Resolution: {e.tension_resolution}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Judgments */}
      {judgments.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wider">Recent Judgments ({judgments.length})</h3>
          <div className="space-y-2">
            {judgments.slice(0, 10).map(j => (
              <div key={j.id} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge text={j.judgment_type} variant="default" />
                  <span className="text-sm text-slate-300">{j.model_used || 'unknown'}</span>
                  {j.was_overridden && <Badge text="overridden" variant="critical" />}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">{((j.confidence || 0) * 100).toFixed(0)}% conf</span>
                  <span className="text-xs text-slate-500">{(j.prompt_tokens || 0) + (j.completion_tokens || 0)} tokens</span>
                  <TimeAgo date={j.judged_at} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategy Reference */}
      {buyer_code_strategies && buyer_code_strategies.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wider">Strategy Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {buyer_code_strategies.map(s => (
              <div key={s.mechanical_id} className="bg-slate-800 rounded-lg p-3">
                <div className="text-sm text-cyan-300 font-medium">{s.human_label}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{s.mechanical_id}</div>
                <div className="text-xs text-slate-400 mt-1">{s.core_function}</div>
                {s.sbgm_root && <div className="text-xs text-slate-600 mt-0.5">SBGM root: {s.sbgm_root}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
