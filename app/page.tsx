'use client'

import { ItemScope, Project, ProjectType, STANDARD_ITEMS, CardType, CARD_STAGE_FLOWS, getDefaultChecklist, getHPUStageChecklist } from '@/lib/types'
import { getProjects, createProject, createCard } from '@/lib/db'
import { getCurrentUser, signOut, AppUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import TabView from '@/app/components/TabView'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function getProjectProgress(project: Project) {
  const myCards = (project.cards ?? []).filter(c => c.scope === 'my_scope')
  const ready = myCards.filter(c => c.stage === 'ready').length
  return { ready, total: myCards.length }
}

function getProjectCurrentStage(project: Project): string {
  const myCards = (project.cards ?? []).filter(c => c.scope === 'my_scope')
  if (myCards.length === 0) return 'No cards'
  const notReady = myCards.filter(c => c.stage !== 'ready')
  if (notReady.length === 0) return 'All Ready'

  const stagePriority: Record<string, number> = {
    piping_in_progress: 0, in_fabrication: 1, with_vendor_machining: 2,
    with_vendor: 3, po_placed: 4, in_transit: 5, bom_check: 6,
    planning: 7, ordered: 8, sheets_procured: 9,
    pipes_fittings_procured: 10, received: 11, backlog: 12,
  }
  const stageLabels: Record<string, string> = {
    in_fabrication: 'In Fabrication', piping_in_progress: 'Piping In Progress',
    with_vendor_machining: 'With Vendor (Machining)', with_vendor: 'With Vendor',
    po_placed: 'PO Placed', in_transit: 'In Transit', bom_check: 'BOM Check',
    planning: 'Planning', ordered: 'Ordered', sheets_procured: 'Sheets Procured',
    pipes_fittings_procured: 'Pipes & Fittings Procured', received: 'Received', backlog: 'Backlog',
  }
  const active = notReady.sort((a, b) => (stagePriority[a.stage] ?? 99) - (stagePriority[b.stage] ?? 99))
  return stageLabels[active[0].stage] ?? active[0].stage
}

function getFlagCount(project: Project): number {
  return (project.cards ?? []).filter(c => c.has_flag).length
}

// New Project Modal — Step 1: basic info
// Step 2: scope selection per standard item
function NewProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [oa, setOa] = useState('')
  const [customer, setCustomer] = useState('')
  const [projectType, setProjectType] = useState<ProjectType>('integration')
  const [saving, setSaving] = useState(false)
  const [scopes, setScopes] = useState<Record<string, ItemScope>>(() => {
    const defaults: Record<string, ItemScope> = {}
    STANDARD_ITEMS.forEach(item => { defaults[item.card_type] = item.default_scope })
    return defaults
  })

  const applicableItems = STANDARD_ITEMS.filter(item => item.applies_to.includes(projectType))

  function toggleScope(cardType: string) {
    setScopes(prev => ({
      ...prev,
      [cardType]: prev[cardType] === 'my_scope' ? 'client_scope' : 'my_scope',
    }))
  }

  const myCount = applicableItems.filter(i => scopes[i.card_type] === 'my_scope').length
  const clientCount = applicableItems.filter(i => scopes[i.card_type] === 'client_scope').length

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">New Project</h2>
            <p className="text-slate-500 text-sm">Step {step} of 2 — {step === 1 ? 'Project Details' : 'Scope Selection'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        {/* Step 1 — Project Details */}
        {step === 1 && (
          <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Project Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. NTPC HPU Door Opening"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">OA Number</label>
              <input
                value={oa}
                onChange={e => setOa(e.target.value)}
                placeholder="e.g. 1608823276"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Customer</label>
              <input
                value={customer}
                onChange={e => setCustomer(e.target.value)}
                placeholder="e.g. Elecon Engineering"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Project Type</label>
              <div className="flex gap-3">
                {(['integration', 'fabrication'] as ProjectType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setProjectType(type)}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors
                      ${projectType === type
                        ? type === 'integration' ? 'bg-blue-600 text-white border-blue-600' : 'bg-orange-500 text-white border-orange-500'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    {type === 'integration' ? 'Integration' : 'Fabrication Only'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Scope Selection */}
        {step === 2 && (
          <div className="px-6 py-4 flex flex-col gap-2 overflow-y-auto">
            <p className="text-sm text-slate-600 mb-2">
              For each item, select who is responsible. <span className="font-semibold text-blue-700">My Scope</span> = Suyog procures & tracks.
              <span className="font-semibold text-slate-500"> Client Scope</span> = client supplies, tracked for visibility only.
            </p>
            <div className="flex gap-3 text-xs text-slate-500 mb-1">
              <span>My Scope: <strong className="text-blue-700">{myCount}</strong></span>
              <span>Client Scope: <strong className="text-slate-600">{clientCount}</strong></span>
            </div>
            {applicableItems.map(item => {
              const isMine = scopes[item.card_type] === 'my_scope'
              return (
                <div key={item.card_type}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition-colors
                    ${isMine ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'}`}
                  onClick={() => toggleScope(item.card_type)}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <div className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0
                    ${isMine ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {isMine ? 'My Scope' : 'Client'}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between">
          {step === 1 ? (
            <>
              <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">Cancel</button>
              <button
                onClick={() => setStep(2)}
                disabled={!name || !oa || !customer}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next: Set Scope →
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-700">← Back</button>
              <button
                disabled={saving}
                onClick={async () => {
                  setSaving(true)
                  try {
                    const project = await createProject({ name, oa_number: oa, customer, project_type: projectType })
                    const applicableItems = STANDARD_ITEMS.filter(i => i.applies_to.includes(projectType))
                    for (const item of applicableItems) {
                      const scope = scopes[item.card_type] ?? item.default_scope
                      const flow = CARD_STAGE_FLOWS[item.card_type as CardType]
                      const checklist = item.card_type === 'hpu_integration'
                        ? getHPUStageChecklist('pre_test_check')
                        : getDefaultChecklist(item.card_type as CardType)
                      await createCard({
                        project_id: project.id,
                        name: item.label,
                        card_type: item.card_type,
                        scope,
                        stage: flow[0],
                        checklist,
                        comments: [],
                        has_flag: false,
                      })
                    }
                    // Add HPU Integration card for integration projects
                    if (projectType === 'integration') {
                      await createCard({
                        project_id: project.id,
                        name: 'HPU Integration',
                        card_type: 'hpu_integration',
                        scope: 'my_scope',
                        stage: 'locked',
                        checklist: getHPUStageChecklist('pre_test_check'),
                        comments: [],
                        has_flag: false,
                      })
                    }
                    onCreated()
                    onClose()
                  } finally {
                    setSaving(false)
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Project'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [tabView, setTabView] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const user = await getCurrentUser()
      if (!user) { router.push('/login'); return }
      setCurrentUser(user)
      getProjects().then(data => { setProjects(data); setLoading(false) })
    }
    init()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50">
      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} onCreated={() => getProjects().then(setProjects)} />}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SH</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-none">Suyog Hydrosystems</h1>
            <p className="text-slate-500 text-xs">HPU Project Tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setTabView(false)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${!tabView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Board View
            </button>
            <button
              onClick={() => setTabView(true)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tabView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tab View
            </button>
          </div>
          <span className="text-sm text-slate-600">{currentUser?.name ?? ''}</span>
          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
            {currentUser?.name?.[0]?.toUpperCase() ?? 'S'}
          </div>
          <button
            onClick={async () => { await signOut(); router.push('/login') }}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">All Projects</h2>
            <p className="text-slate-500 text-sm mt-1">{projects.length} active projects</p>
          </div>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setShowNewProject(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + New Project
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24 text-slate-400">
            Loading projects...
          </div>
        )}

        {/* Tab View */}
        {!loading && tabView && <TabView projects={projects} />}

        {/* Project Grid */}
        {!loading && !tabView && <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map(project => {
            const { ready, total } = getProjectProgress(project)
            const progressPct = total > 0 ? Math.round((ready / total) * 100) : 0
            const currentStage = getProjectCurrentStage(project)
            const flagCount = getFlagCount(project)
            const isIntegration = project.project_type === 'integration'
            const clientCards = (project.cards ?? []).filter(c => c.scope === 'client_scope').length

            return (
              <div key={project.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">

                {/* Badges */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                    ${isIntegration ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                    {isIntegration ? 'Integration' : 'Fabrication Only'}
                  </span>
                  {flagCount > 0 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                      ⚑ {flagCount} flag{flagCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{project.name}</h3>
                <p className="text-xs text-slate-400 font-mono mb-1">OA: {project.oa_number}</p>
                <p className="text-sm text-slate-600 mb-4">{project.customer}</p>

                {/* Progress */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{ready}/{total} my scope ready</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                {clientCards > 0 && (
                  <p className="text-xs text-slate-400 mb-2">{clientCards} client scope item{clientCards > 1 ? 's' : ''}</p>
                )}

                <p className="text-xs text-slate-500 mb-4">
                  Active: <span className="font-medium text-slate-700">{currentStage}</span>
                </p>

                <Link href={`/project/${project.id}`}
                  className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-lg py-2 transition-colors">
                  View Board
                </Link>
              </div>
            )
          })}
        </div>}
      </main>
    </div>
  )
}
