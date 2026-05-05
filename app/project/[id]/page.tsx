'use client'

import { getProject, updateCardStage, updateCardChecklist, updateCardComments } from '@/lib/db'
import {
  Card, CardStage, CardType, ChecklistItem, Comment, Project,
  CARD_STAGE_FLOWS, CARD_TYPE_COLORS, CARD_TYPE_LABELS,
  STAGE_LABELS, getHPUStageChecklist,
} from '@/lib/types'
import Link from 'next/link'
import { use, useState, useEffect } from 'react'

const SWIMLANE_ORDER_LIST: CardType[] = [
  'tank',
  'bell_housing',
  'coupling',
  'motor',
  'pump',
  'valve_assembly',
  'manifold_block',
  'tank_accessories',
  'instruments',
  'enclosure',
  'piping',
  'commissioning_spares',
  'hpu_integration',
]

function CardAddons({ card, onAddChecklistItem, onAddComment, dark }: {
  card: Card
  onAddChecklistItem: (card: Card, label: string) => void
  onAddComment: (card: Card, text: string) => void
  dark?: boolean
}) {
  const [newItem, setNewItem] = useState('')
  const [newComment, setNewComment] = useState('')
  const [showChecklist, setShowChecklist] = useState(false)
  const [showComment, setShowComment] = useState(false)

  const textColor = dark ? 'text-slate-300' : 'text-slate-600'
  const inputClass = dark
    ? 'w-full text-xs bg-white/10 border border-white/20 rounded px-2 py-1 text-white placeholder-white/40 focus:outline-none focus:border-white/50'
    : 'w-full text-xs border border-slate-200 rounded px-2 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-300'
  const btnClass = dark
    ? 'text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-white transition-colors'
    : 'text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors'

  function submitItem() {
    if (!newItem.trim()) return
    onAddChecklistItem(card, newItem.trim())
    setNewItem('')
    setShowChecklist(false)
  }

  function submitComment() {
    if (!newComment.trim()) return
    onAddComment(card, newComment.trim())
    setNewComment('')
    setShowComment(false)
  }

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {/* Comments display */}
      {card.comments.length > 0 && (
        <div className={`text-xs ${dark ? 'border-t border-white/10' : 'border-t border-slate-100'} pt-1.5 mt-1`}>
          {card.comments.map((c: Comment) => (
            <div key={c.id} className={`flex gap-1 mb-1 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className="flex-shrink-0">💬</span>
              <span className="leading-snug">{c.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add checklist item */}
      {showChecklist ? (
        <div className="flex gap-1">
          <input
            autoFocus
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submitItem(); if (e.key === 'Escape') setShowChecklist(false) }}
            placeholder="Checklist item..."
            className={inputClass}
          />
          <button onClick={submitItem} className={btnClass}>Add</button>
        </div>
      ) : (
        <button onClick={() => setShowChecklist(true)} className={`text-left text-xs ${textColor} hover:opacity-80`}>
          + Add checklist item
        </button>
      )}

      {/* Add comment */}
      {showComment ? (
        <div className="flex gap-1">
          <input
            autoFocus
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submitComment(); if (e.key === 'Escape') setShowComment(false) }}
            placeholder="Add comment..."
            className={inputClass}
          />
          <button onClick={submitComment} className={btnClass}>Add</button>
        </div>
      ) : (
        <button onClick={() => setShowComment(true)} className={`text-left text-xs ${textColor} hover:opacity-80`}>
          💬 Add comment
        </button>
      )}
    </div>
  )
}

function CardItem({ card, onMove, onChecklistToggle, onAddChecklistItem, onAddComment, allOtherCardsReady }: {
  card: Card
  onMove: (card: Card, dir: 'forward' | 'back') => void
  onChecklistToggle: (card: Card, itemId: string) => void
  onAddChecklistItem: (card: Card, label: string) => void
  onAddComment: (card: Card, text: string) => void
  allOtherCardsReady?: boolean
}) {
  const isHPU = card.card_type === 'hpu_integration'
  const isLocked = isHPU && card.stage === 'locked' && !allOtherCardsReady
  const isClientScope = card.scope === 'client_scope'
  const flow = CARD_STAGE_FLOWS[card.card_type]
  const currentIdx = flow.indexOf(card.stage)
  const checklist = card.checklist ?? []
  const checkedCount = checklist.filter(i => i.checked).length
  const allChecked = checklist.length === 0 || checkedCount === checklist.length
  const canForward = !isClientScope && !isLocked && currentIdx < flow.length - 1 && allChecked
  const canBack = !isClientScope && !isLocked && currentIdx > 0

  if (isHPU) {
    return (
      <div className={`rounded-xl border-2 p-4 shadow-md min-w-[240px] max-w-[260px]
        ${isLocked ? 'bg-slate-100 border-slate-300 opacity-70' : 'bg-slate-900 border-slate-700 text-white'}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/20 text-white">
            HPU Integration
          </span>
          {isLocked && <span className="text-lg">🔒</span>}
        </div>
        <p className="font-bold text-sm mb-1">{card.name}</p>
        <p className={`text-xs mb-3 ${isLocked ? 'text-slate-500' : 'text-slate-300'}`}>
          {isLocked ? 'Waiting — complete all cards above first' : STAGE_LABELS[card.stage]}
        </p>

        {!isLocked && checklist.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-300">
                {STAGE_LABELS[card.stage]} Checklist
              </p>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${allChecked ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                {checkedCount}/{checklist.length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              {checklist.map((item: ChecklistItem) => (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => onChecklistToggle(card, item.id)}
                    className="mt-0.5 flex-shrink-0 accent-green-400"
                  />
                  <span className={`text-xs leading-snug ${item.checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            {!allChecked && (
              <p className="text-xs text-yellow-400 mt-2">Complete checklist to advance</p>
            )}
          </div>
        )}

        {!isLocked && (
          <div className="flex gap-1 mt-2">
            <button onClick={() => onMove(card, 'back')} disabled={!canBack}
              className="flex-1 text-xs py-1.5 rounded border border-white/20 hover:bg-white/10 disabled:opacity-25 transition-colors text-white">
              ← Back
            </button>
            <button onClick={() => onMove(card, 'forward')} disabled={!canForward}
              className={`flex-1 text-xs py-1.5 rounded font-medium transition-colors
                ${canForward ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}>
              Forward →
            </button>
          </div>
        )}

        {isLocked && allOtherCardsReady && (
          <button onClick={() => onMove(card, 'forward')}
            className="w-full text-xs py-1.5 rounded bg-green-600 hover:bg-green-500 text-white font-medium mt-1 transition-colors">
            🔓 Unlock — Start Pre-Test Check
          </button>
        )}

        {!isLocked && (
          <div className="mt-3 border-t border-white/10 pt-3">
            <CardAddons card={card} onAddChecklistItem={onAddChecklistItem} onAddComment={onAddComment} dark />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border p-3 shadow-sm min-w-[200px] max-w-[230px]
      ${card.has_flag ? 'border-red-300' : isClientScope ? 'border-slate-200 opacity-75' : 'border-slate-200'}`}>

      <div className="flex items-start justify-between gap-1 mb-2">
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${CARD_TYPE_COLORS[card.card_type]}`}>
          {CARD_TYPE_LABELS[card.card_type]}
        </span>
        <div className="flex gap-1 items-center">
          {isClientScope && (
            <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">Client</span>
          )}
          {card.has_flag && <span className="text-red-500 text-sm">⚑</span>}
        </div>
      </div>

      <p className="font-semibold text-slate-800 text-sm mb-1 leading-tight">{card.name}</p>
      {card.make_model && <p className="text-xs text-slate-500 mb-1 leading-tight">{card.make_model}</p>}
      {card.bom_ref && <p className="text-xs text-slate-400 mb-1">BOM: {card.bom_ref}</p>}
      {card.qty && <p className="text-xs text-slate-400 mb-1">Qty: {card.qty}</p>}
      {card.notes && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mb-2 leading-snug">{card.notes}</p>
      )}

      {/* Checklist */}
      {checklist.length > 0 && (
        <div className="mt-2 mb-2 border-t border-slate-100 pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-medium text-slate-600">Checklist</p>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${allChecked ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {checkedCount}/{checklist.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {checklist.map((item: ChecklistItem) => (
              <label key={item.id} className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => onChecklistToggle(card, item.id)}
                  className="mt-0.5 accent-blue-600 flex-shrink-0"
                />
                <span className={`text-xs leading-snug ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          {!allChecked && checklist.length > 0 && (
            <p className="text-xs text-amber-600 mt-1.5">Complete checklist to move forward</p>
          )}
        </div>
      )}

      {!isClientScope && (
        <div className="flex gap-1 mt-2">
          <button
            onClick={() => onMove(card, 'back')}
            disabled={!canBack}
            className="flex-1 text-xs py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={() => onMove(card, 'forward')}
            disabled={!canForward}
            className={`flex-1 text-xs py-1 rounded text-white transition-colors
              ${canForward ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            Forward →
          </button>
        </div>
      )}
      {isClientScope && (
        <p className="text-xs text-slate-400 italic mt-1">Client supplies — tracking only</p>
      )}

      <CardAddons card={card} onAddChecklistItem={onAddChecklistItem} onAddComment={onAddComment} />
    </div>
  )
}

function Swimlane({ cardType, cards, onMove, onChecklistToggle, onAddChecklistItem, onAddComment, allOtherCardsReady }: {
  cardType: CardType
  cards: Card[]
  onMove: (card: Card, dir: 'forward' | 'back') => void
  onChecklistToggle: (card: Card, itemId: string) => void
  onAddChecklistItem: (card: Card, label: string) => void
  onAddComment: (card: Card, text: string) => void
  allOtherCardsReady?: boolean
}) {
  const flow = CARD_STAGE_FLOWS[cardType]
  const typeCards = cards.filter(c => c.card_type === cardType)
  if (typeCards.length === 0) return null

  const myCards = typeCards.filter(c => c.scope === 'my_scope')
  const clientCards = typeCards.filter(c => c.scope === 'client_scope')

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${CARD_TYPE_COLORS[cardType]}`}>
          {CARD_TYPE_LABELS[cardType]}
        </span>
        <span className="text-xs text-slate-400">{myCards.length} my scope</span>
        {clientCards.length > 0 && (
          <span className="text-xs text-slate-400">· {clientCards.length} client scope</span>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {flow.map(stage => {
          const stageCards = typeCards.filter(c => c.stage === stage)
          return (
            <div key={stage} className="flex-shrink-0 min-w-[220px]">
              <div className={`text-xs font-medium mb-2 px-2 py-1 rounded flex items-center justify-between
                ${stage === 'ready' ? 'bg-green-100 text-green-700'
                : stage === 'backlog' ? 'bg-slate-100 text-slate-500'
                : stage === 'bom_check' ? 'bg-yellow-100 text-yellow-700'
                : 'bg-blue-50 text-blue-700'}`}>
                {STAGE_LABELS[stage]}
                {stageCards.length > 0 && (
                  <span className="bg-white rounded-full px-1.5 text-xs font-bold ml-1">
                    {stageCards.length}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {stageCards.map(card => (
                  <CardItem key={card.id} card={card} onMove={onMove} onChecklistToggle={onChecklistToggle} onAddChecklistItem={onAddChecklistItem} onAddComment={onAddComment} allOtherCardsReady={allOtherCardsReady} />
                ))}
                {stageCards.length === 0 && (
                  <div className="border-2 border-dashed border-slate-100 rounded-lg h-12" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ProjectBoard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProject(id).then(p => {
      if (p) { setProject(p); setCards(p.cards ?? []) }
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>
  if (!project) return <div className="p-8 text-slate-500">Project not found.</div>

  function handleMove(card: Card, dir: 'forward' | 'back') {
    const flow = CARD_STAGE_FLOWS[card.card_type]
    const idx = flow.indexOf(card.stage)
    const newStage: CardStage = dir === 'forward' ? flow[idx + 1] : flow[idx - 1]
    const newChecklist = card.card_type === 'hpu_integration'
      ? getHPUStageChecklist(newStage)
      : card.checklist
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, stage: newStage, checklist: newChecklist } : c))
    updateCardStage(card.id, newStage, newChecklist)
  }

  function handleChecklistToggle(card: Card, itemId: string) {
    setCards(prev => prev.map(c => {
      if (c.id !== card.id) return c
      const newChecklist = c.checklist.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
      updateCardChecklist(c.id, newChecklist)
      return { ...c, checklist: newChecklist }
    }))
  }

  function handleAddChecklistItem(card: Card, label: string) {
    setCards(prev => prev.map(c => {
      if (c.id !== card.id) return c
      const newItem: ChecklistItem = { id: `custom_${Date.now()}`, label, checked: false }
      const newChecklist = [...c.checklist, newItem]
      updateCardChecklist(c.id, newChecklist)
      return { ...c, checklist: newChecklist }
    }))
  }

  function handleAddComment(card: Card, text: string) {
    setCards(prev => prev.map(c => {
      if (c.id !== card.id) return c
      const newComment: Comment = { id: `cmt_${Date.now()}`, text, created_at: new Date().toISOString() }
      const newComments = [...c.comments, newComment]
      updateCardComments(c.id, newComments)
      return { ...c, comments: newComments }
    }))
  }

  const myCards = cards.filter(c => c.scope === 'my_scope')
  const nonHPUMyCards = myCards.filter(c => c.card_type !== 'hpu_integration')
  const allOtherCardsReady = nonHPUMyCards.length > 0 && nonHPUMyCards.every(c => c.stage === 'ready')
  const readyCount = myCards.filter(c => c.stage === 'ready' || c.stage === 'despatch_ready').length
  const flagCount = cards.filter(c => c.has_flag).length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="mb-2">
          <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm">← All Projects</Link>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="font-bold text-slate-900 text-xl">{project.name}</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                ${project.project_type === 'integration' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                {project.project_type === 'integration' ? 'Integration' : 'Fabrication Only'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="font-mono">OA: {project.oa_number}</span>
              <span>{project.customer}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-bold text-slate-900 text-xl">{readyCount}/{myCards.length}</p>
              <p className="text-slate-500 text-xs">My Scope Ready</p>
            </div>
            {flagCount > 0 && (
              <div className="text-center">
                <p className="font-bold text-red-500 text-xl">{flagCount}</p>
                <p className="text-slate-500 text-xs">Flags</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></span>
          BOM Check — verify model codes before PO
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300"></span>
          Client Scope — tracking only
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-red-500">⚑</span>
          Flagged item
        </span>
      </div>

      {/* Board */}
      <main className="px-6 py-6">
        {SWIMLANE_ORDER_LIST.map(cardType => (
          <div key={cardType}>
            {cardType === 'hpu_integration' && (
              <div className="my-6 border-t-2 border-dashed border-slate-300 flex items-center gap-3">
                <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full -mt-3">
                  HPU INTEGRATION — Final Stages
                </span>
                {allOtherCardsReady
                  ? <span className="text-green-600 text-xs font-medium -mt-3">✓ All items ready — unlock to begin</span>
                  : <span className="text-slate-400 text-xs -mt-3">Complete all items above to unlock</span>
                }
              </div>
            )}
            <Swimlane
              cardType={cardType}
              cards={cards}
              onMove={handleMove}
              onChecklistToggle={handleChecklistToggle}
              onAddChecklistItem={handleAddChecklistItem}
              onAddComment={handleAddComment}
              allOtherCardsReady={allOtherCardsReady}
            />
          </div>
        ))}
      </main>
    </div>
  )
}
