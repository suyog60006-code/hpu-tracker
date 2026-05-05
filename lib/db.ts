import { supabase } from './supabase'
import { Project, Card, CardStage, ChecklistItem, Comment } from './types'

export async function getProjects(): Promise<Project[]> {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('*')

  if (cardsError) throw cardsError

  return projects.map(p => ({
    ...p,
    cards: cards.filter(c => c.project_id === p.id),
  }))
}

export async function getProject(id: string): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null

  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: true })

  if (cardsError) throw cardsError

  return { ...project, cards: cards ?? [] }
}

export async function createProject(data: {
  name: string
  oa_number: string
  customer: string
  project_type: string
}): Promise<Project> {
  const { data: project, error } = await supabase
    .from('projects')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return { ...project, cards: [] }
}

export async function createCard(data: Omit<Card, 'id' | 'created_at' | 'updated_at'>): Promise<Card> {
  const { data: card, error } = await supabase
    .from('cards')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return card
}

export async function updateCardStage(cardId: string, stage: CardStage, checklist: ChecklistItem[]): Promise<void> {
  const { error } = await supabase
    .from('cards')
    .update({ stage, checklist })
    .eq('id', cardId)

  if (error) throw error
}

export async function updateCardChecklist(cardId: string, checklist: ChecklistItem[]): Promise<void> {
  const { error } = await supabase
    .from('cards')
    .update({ checklist })
    .eq('id', cardId)

  if (error) throw error
}

export async function updateCardComments(cardId: string, comments: Comment[]): Promise<void> {
  const { error } = await supabase
    .from('cards')
    .update({ comments })
    .eq('id', cardId)

  if (error) throw error
}
