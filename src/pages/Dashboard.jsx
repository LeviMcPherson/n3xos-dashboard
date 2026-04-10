import { Zap, CheckCircle } from 'lucide-react'
import { useApi } from '../hooks'
import { dashboardUrl } from '../config'
import { Loader, ErrorBox, KpiCard, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

export default function DashboardPage() {
  const { data, loading, error, reload } = useApi(dashboardUrl)
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const { kpis, decisions, agent_actions, entities } = data

  return (
    <div className="space-y-6">
      <PageHeader title="Command Dashboard" onRefresh={reload} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Open Decisions" value={kpis.open_decisions} color="cyan" />
        <KpiCard label="Critical Alerts" value={kpis.critical_alerts} color="red" />
        <KpiCard label="MRR at Risk" value={`$${(kpis.mrr_at_risk || 0).toLocaleString()}`} color="amber" />
        <KpiCard label="Momentum" value={kpis.momentum} color={kpis.momentum === 'high' ? 'emerald' : kpis.momentum === 'quiet' ? 'red' : 'cyan'} />
        <KpiCard label="Pending Actions" value={kpis.pending_actions} sub={`${kpis.approved_actions} approved`} color="purple" />
        <KpiCard label="Total Clients" value={kpis.total_clients} color="cyan" />
        <KpiCard label="Healthy" value={kpis.healthy_clients} color="emerald" />
        <KpiCard label="At Risk / Critical" value={`${kpis.at_risk_clients} / ${kpis.critical_clients}`} color="red" />
      </div>

      {/* Decision Cards */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wider">Decision Queue</h3>
        <div className="space-y-2">
          {decisions.slice(0, 8).map(d => (
            <div key={d.id} className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge text={d.urgency} variant={d.urgency} />
                  <Badge text={d.status} variant={d.status} />
                </div>
                <p className="text-sm text-slate-200 truncate">{d.title}</p>
              </div>
              <div className="text-right ml-4 shrink-0">
                {d.mrr_impact > 0 && <div className="text-sm text-amber-400 font-medium">${parseFloat(d.mrr_impact).toLocaleString()}</div>}
                {d.probability_score != null && <div className="text-xs text-slate-500">{(d.probability_score * 100).toFixed(0)}% prob</div>}
                {d.days_to_consequence != null && <div className="text-xs text-slate-600">{d.days_to_consequence}d to consequence</div>}
              </div>
            </div>
          ))}
          {decisions.length === 0 && <EmptyState message="No open decisions" icon={CheckCircle} />}
        </div>
      </div>

      {/* Agent Actions */}
      {agent_actions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wider">Agent Actions</h3>
          <div className="space-y-2">
            {agent_actions.slice(0, 5).map(a => (
              <div key={a.id} className="bg-slate-800 rounded-lg p-3 flex items-start gap-3">
                <Zap className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge text={a.status} variant={a.status} />
                    <span className="text-xs text-slate-500">{a.action_type}</span>
                  </div>
                  <p className="text-sm text-slate-300 truncate">{a.action_summary}</p>
                  {a.entity_ref && <p className="text-xs text-slate-500 mt-1">{a.entity_ref}</p>}
                </div>
                <div className="text-right shrink-0">
                  {a.confidence_score != null && <div className="text-xs text-slate-400">{(a.confidence_score * 100).toFixed(0)}% conf</div>}
                  {a.mrr_at_risk > 0 && <div className="text-xs text-amber-400">${parseFloat(a.mrr_at_risk).toLocaleString()}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Health */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wider">Client Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {entities.map(e => (
            <div key={e.id} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-200">{e.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge text={e.entity_type} variant="default" />
                  <Badge text={e.gate_status || 'unknown'} variant={e.gate_status === 'active' ? 'active' : 'default'} />
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${e.health_score >= 70 ? 'text-emerald-400' : e.health_score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                  {e.health_score}
                </div>
                <div className="text-xs text-slate-500">health</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
