'use client'

import { Project, Card, CARD_TYPE_LABELS, STAGE_LABELS, CardStage } from '@/lib/types'

const STAGE_COLOR: Partial<Record<CardStage, string>> = {
  ready: 'bg-green-100 text-green-800',
  despatch_ready: 'bg-green-200 text-green-900',
  bom_check: 'bg-yellow-100 text-yellow-800',
  locked: 'bg-slate-100 text-slate-500',
  backlog: 'bg-slate-100 text-slate-500',
  in_painting: 'bg-purple-100 text-purple-800',
  testing: 'bg-blue-200 text-blue-900',
  pre_test_check: 'bg-orange-100 text-orange-800',
  post_test_check: 'bg-orange-100 text-orange-800',
  pre_despatch: 'bg-teal-100 text-teal-800',
}

function stageBadge(stage: CardStage, hasFlag: boolean) {
  const color = STAGE_COLOR[stage] ?? 'bg-blue-50 text-blue-800'
  const label = STAGE_LABELS[stage] ?? stage
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {stage === 'ready' || stage === 'despatch_ready' ? '✓' : hasFlag ? '⚑' : '●'}
      {label}
    </span>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const cards = (project.cards ?? []).filter(c => c.scope === 'my_scope')
  const readyCount = cards.filter(c => c.stage === 'ready' || c.stage === 'despatch_ready').length
  const flagCount = cards.filter(c => c.has_flag).length
  const pct = cards.length > 0 ? Math.round((readyCount / cards.length) * 100) : 0
  const isIntegration = project.project_type === 'integration'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-5">
      {/* Project Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
            <span className={`text-sm font-medium px-3 py-0.5 rounded-full ${isIntegration ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
              {isIntegration ? 'Integration' : 'Fabrication Only'}
            </span>
            {flagCount > 0 && (
              <span className="text-sm font-medium px-3 py-0.5 rounded-full bg-red-50 text-red-600">
                ⚑ {flagCount} flag{flagCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-5 text-slate-500">
            <span className="font-mono text-base">OA: {project.oa_number}</span>
            <span className="text-base">{project.customer}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-slate-900">{readyCount}<span className="text-slate-400 text-xl">/{cards.length}</span></p>
          <p className="text-slate-500 text-sm">items ready</p>
          {/* Mini progress bar */}
          <div className="w-32 bg-slate-100 rounded-full h-2 mt-2 ml-auto">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Card List */}
      <div className="divide-y divide-slate-50">
        {cards.map(card => (
          <div key={card.id} className={`px-6 py-4 flex items-center justify-between ${card.has_flag ? 'bg-red-50/40' : ''}`}>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-semibold px-2 py-1 rounded w-36 text-center
                ${card.card_type === 'hpu_integration' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {CARD_TYPE_LABELS[card.card_type]}
              </span>
              <div>
                <p className="text-base font-semibold text-slate-800">{card.name}</p>
                {card.make_model && <p className="text-sm text-slate-500">{card.make_model}</p>}
                {card.notes && (
                  <p className="text-sm text-amber-700 mt-0.5">⚠ {card.notes}</p>
                )}
                {/* Checklist summary */}
                {card.checklist.length > 0 && (
                  <p className="text-sm text-slate-400 mt-0.5">
                    Checklist: {card.checklist.filter(i => i.checked).length}/{card.checklist.length} done
                  </p>
                )}
                {/* Comments */}
                {card.comments.length > 0 && (
                  <p className="text-sm text-slate-400 mt-0.5">
                    💬 {card.comments[card.comments.length - 1].text}
                  </p>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              {stageBadge(card.stage, card.has_flag)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TabView({ projects }: { projects: Project[] }) {
  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <p className="text-slate-500 text-base">Live project status — all items</p>
      </div>
      {projects.map(project => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </div>
  )
}
