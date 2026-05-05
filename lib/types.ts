export type ProjectType = 'integration' | 'fabrication'

export type ItemScope = 'my_scope' | 'client_scope'

export type CardType =
  | 'tank'
  | 'bell_housing'
  | 'coupling'
  | 'motor'
  | 'pump'
  | 'valve_assembly'
  | 'tank_accessories'
  | 'instruments'
  | 'manifold_block'
  | 'enclosure'
  | 'piping'
  | 'commissioning_spares'
  | 'hpu_integration'

export type CardStage =
  | 'backlog'
  // Fabrication
  | 'in_fabrication'
  // Enclosure (outsourced)
  | 'planning'
  | 'sheets_procured'
  | 'with_vendor'
  | 'received'
  // Machined bought-outs (Bell Housing, Coupling)
  | 'ordered'
  | 'with_vendor_machining'
  // Bought-outs (Motor, Pump, Valves, etc.)
  | 'bom_check'
  | 'po_placed'
  | 'in_transit'
  // Piping
  | 'pipes_fittings_procured'
  | 'piping_in_progress'
  // HPU Integration master card
  | 'locked'
  | 'pre_test_check'
  | 'testing'
  | 'post_test_check'
  | 'in_painting'
  | 'pre_despatch'
  | 'despatch_ready'
  // End
  | 'ready'

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  hpu_integration: 'HPU Integration',
  tank: 'Tank',
  bell_housing: 'Bell Housing',
  coupling: 'Coupling',
  motor: 'Motor',
  pump: 'Pump',
  valve_assembly: 'Valve Assembly',
  tank_accessories: 'Tank Accessories',
  instruments: 'Instruments',
  manifold_block: 'Manifold Block',
  enclosure: 'Enclosure',
  piping: 'Piping',
  commissioning_spares: 'Commissioning Spares',
}

export const CARD_TYPE_COLORS: Record<CardType, string> = {
  hpu_integration: 'bg-slate-800 text-white',
  tank: 'bg-blue-100 text-blue-800',
  bell_housing: 'bg-orange-100 text-orange-800',
  coupling: 'bg-amber-100 text-amber-800',
  motor: 'bg-green-100 text-green-800',
  pump: 'bg-emerald-100 text-emerald-800',
  valve_assembly: 'bg-red-100 text-red-800',
  tank_accessories: 'bg-cyan-100 text-cyan-800',
  instruments: 'bg-indigo-100 text-indigo-800',
  manifold_block: 'bg-yellow-100 text-yellow-800',
  enclosure: 'bg-purple-100 text-purple-800',
  piping: 'bg-teal-100 text-teal-800',
  commissioning_spares: 'bg-slate-100 text-slate-700',
}

export const CARD_STAGE_FLOWS: Record<CardType, CardStage[]> = {
  hpu_integration: ['locked', 'pre_test_check', 'testing', 'post_test_check', 'in_painting', 'pre_despatch', 'despatch_ready'],
  tank: ['backlog', 'in_fabrication', 'ready'],
  bell_housing: ['backlog', 'ordered', 'with_vendor_machining', 'received', 'ready'],
  coupling: ['backlog', 'ordered', 'with_vendor_machining', 'received', 'ready'],
  motor: ['backlog', 'bom_check', 'po_placed', 'in_transit', 'received', 'ready'],
  pump: ['backlog', 'bom_check', 'po_placed', 'in_transit', 'received', 'ready'],
  valve_assembly: ['backlog', 'bom_check', 'po_placed', 'in_transit', 'received', 'ready'],
  tank_accessories: ['backlog', 'bom_check', 'po_placed', 'in_transit', 'received', 'ready'],
  instruments: ['backlog', 'bom_check', 'po_placed', 'in_transit', 'received', 'ready'],
  manifold_block: ['backlog', 'bom_check', 'ordered', 'with_vendor', 'received', 'ready'],
  enclosure: ['backlog', 'planning', 'sheets_procured', 'with_vendor', 'received', 'ready'],
  piping: ['backlog', 'planning', 'pipes_fittings_procured', 'piping_in_progress', 'ready'],
  commissioning_spares: ['backlog', 'bom_check', 'po_placed', 'received', 'ready'],
}

export const STAGE_LABELS: Record<CardStage, string> = {
  locked: 'Locked — Waiting for all cards',
  pre_test_check: 'Pre-Test Check',
  testing: 'Testing',
  post_test_check: 'Post-Test Check',
  in_painting: 'In Painting',
  pre_despatch: 'Pre-Despatch',
  despatch_ready: 'Despatch Ready',
  backlog: 'Backlog',
  in_fabrication: 'In Fabrication',
  planning: 'Planning',
  sheets_procured: 'Sheets Procured',
  with_vendor: 'With Vendor',
  ordered: 'Ordered',
  with_vendor_machining: 'With Vendor (Machining)',
  received: 'Received',
  bom_check: 'BOM Check',
  po_placed: 'PO Placed',
  in_transit: 'In Transit',
  pipes_fittings_procured: 'Pipes & Fittings Procured',
  piping_in_progress: 'Piping In Progress',
  ready: 'Ready',
}

// Standard items shown during project setup for scope selection
export interface StandardItem {
  card_type: CardType
  label: string
  description: string
  default_scope: ItemScope
  applies_to: ProjectType[] // which project types this item appears in
}

export const STANDARD_ITEMS: StandardItem[] = [
  { card_type: 'tank', label: 'Tank', description: 'MS hydraulic tank', default_scope: 'my_scope', applies_to: ['integration', 'fabrication'] },
  { card_type: 'bell_housing', label: 'Bell Housing', description: 'Motor-pump bell housing (machined)', default_scope: 'my_scope', applies_to: ['integration', 'fabrication'] },
  { card_type: 'coupling', label: 'Coupling', description: 'Motor-pump coupling with nylon sleeve', default_scope: 'my_scope', applies_to: ['integration', 'fabrication'] },
  { card_type: 'motor', label: 'Motor', description: 'Electric motor (TEFC, IP55)', default_scope: 'my_scope', applies_to: ['integration'] },
  { card_type: 'pump', label: 'Pump', description: 'Hydraulic gear/piston pump', default_scope: 'my_scope', applies_to: ['integration'] },
  { card_type: 'valve_assembly', label: 'Valve Assembly', description: 'DC valves, relief valves, check valves, FCV', default_scope: 'my_scope', applies_to: ['integration'] },
  { card_type: 'manifold_block', label: 'Manifold Block', description: 'SPL manifold block', default_scope: 'my_scope', applies_to: ['integration'] },
  { card_type: 'tank_accessories', label: 'Tank Accessories', description: 'Air breather, oil level gauge, return line filter', default_scope: 'my_scope', applies_to: ['integration'] },
  { card_type: 'instruments', label: 'Instruments', description: 'Pressure gauges, gauge isolators, minimess couplings', default_scope: 'my_scope', applies_to: ['integration'] },
  { card_type: 'enclosure', label: 'Enclosure', description: 'MS electrical enclosure (outsourced bending)', default_scope: 'my_scope', applies_to: ['integration'] },
  { card_type: 'piping', label: 'Piping & Fittings', description: 'Pipes and fittings as per hydraulic circuit', default_scope: 'my_scope', applies_to: ['integration'] },
  { card_type: 'commissioning_spares', label: 'Commissioning Spares', description: 'Filter elements, spare gauges, minimess hose, mandatory spares', default_scope: 'my_scope', applies_to: ['integration'] },
]

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

// Stage-specific checklists for HPU Integration card
export const HPU_STAGE_CHECKLISTS: Partial<Record<CardStage, Omit<ChecklistItem, 'checked'>[]>> = {
  pre_test_check: [
    { id: 'valve_orientation', label: 'All valve orientations correct per circuit (flow control, PO check, direction valve)' },
    { id: 'float_height', label: 'Float switch collar height fits within tank height' },
    { id: 'temp_ctrl_sensor', label: 'Temp controller sensor connected to controller — NOT to JB' },
    { id: 'limit_sw', label: 'Limit switches connected — check for short circuit before power on' },
    { id: 'motor_rotation', label: 'Motor rotation direction verified before full load' },
    { id: 'oil_filled', label: 'Tank filled with hydraulic oil to correct level (correct grade)' },
    { id: 'relief_preset', label: 'Pressure relief valve pre-set to correct pressure' },
    { id: 'valve_codes', label: 'All valve model codes physically verified against BOM (B6/B8, KHB/KHM etc.)' },
    { id: 'gauge_ranges', label: 'All pressure gauge ranges verified per BOM' },
    { id: 'connections_tight', label: 'All pipe/hose connections tight — no open ports' },
    { id: 'wiring_complete', label: 'All solenoid valve and instrument wiring complete' },
    { id: 'safety_check', label: 'Safety — no personnel near rotating parts during startup' },
  ],
  post_test_check: [
    { id: 'all_functions', label: 'All circuit functions tested per hydraulic circuit diagram' },
    { id: 'motor_current', label: 'Motor current at working pressure within nameplate rating' },
    { id: 'po_check_fn', label: 'PO check valve function verified (clean if required)' },
    { id: 'pressure_settings', label: 'All pressure settings verified and recorded' },
    { id: 'no_leakage', label: 'No internal or external leakage observed' },
    { id: 'open_points', label: 'All open points from testing listed and actioned' },
  ],
  in_painting: [
    { id: 'paint_stock', label: 'Paint stock available — correct shade confirmed' },
    { id: 'dft_target', label: 'DFT target: 130 micron min, 150–160 micron application' },
    { id: 'primer_type', label: 'Primer: Zinc phosphate (mat finish — NOT zinc rich, NOT glossy)' },
    { id: 'retapping', label: 'All sockets re-tapped after painting' },
    { id: 'cure_time', label: 'Paint cure time: 48–72 hours before handling' },
  ],
  pre_despatch: [
    { id: 'loose_supply', label: 'Loose supply list prepared and all items physically present' },
    { id: 'comm_spares', label: 'Commissioning spares offered and packed' },
    { id: 'mand_spares', label: 'Mandatory 2-year spares offered and packed' },
    { id: 'dft_measured', label: 'Paint DFT measured at multiple points — recorded' },
    { id: 'all_open_pts', label: 'All open points from inspection/testing closed' },
    { id: 'acp_nameplate', label: 'ACP and OA name plate fitted' },
    { id: 'labels', label: 'All labels fitted' },
    { id: 'tcs', label: 'All TCs (test certificates) for bought-out items received' },
    { id: 'wiring_diag', label: 'Wiring diagram copy packed with unit' },
    { id: 'jb_diagram', label: 'JB wiring diagram pasted inside JB door' },
    { id: 'machined_protection', label: 'All machined surfaces protected for transport' },
    { id: 'dispatch_docs', label: 'Dispatch documents ready (invoice, packing list, TCs)' },
  ],
}

// Default checklists per card type — shown inside the card
export const CARD_DEFAULT_CHECKLISTS: Partial<Record<CardType, Omit<ChecklistItem, 'checked'>[]>> = {
  tank: [
    { id: 'tank_door_ring', label: 'Tank door ring readiness' },
    { id: 'tank_gasket', label: 'Tank gasket readiness' },
  ],
  piping: [
    { id: 'unf_fittings', label: 'Any UNF fittings required?' },
    { id: 'sae_flanges', label: 'SAE flanges readiness' },
    { id: 'asa_flanges', label: 'ASA round flange readiness' },
    { id: 'std_fittings', label: 'Standard fittings readiness' },
    { id: 'pipe_stock', label: 'Pipe in stock?' },
    { id: 'suction_nb', label: 'Suction NB pipe in stock' },
    { id: 'elbow_tee', label: 'Any elbow / tee needed for NB pipes?' },
  ],
}

export function getDefaultChecklist(cardType: CardType): ChecklistItem[] {
  const items = CARD_DEFAULT_CHECKLISTS[cardType] ?? []
  return items.map(item => ({ ...item, checked: false }))
}

export function getHPUStageChecklist(stage: CardStage): ChecklistItem[] {
  const items = HPU_STAGE_CHECKLISTS[stage] ?? []
  return items.map(item => ({ ...item, checked: false }))
}

export interface Comment {
  id: string
  text: string
  created_at: string
}

export interface Card {
  id: string
  project_id: string
  name: string
  card_type: CardType
  scope: ItemScope
  stage: CardStage
  bom_ref?: string
  make_model?: string
  qty?: number
  notes?: string
  has_flag: boolean
  checklist: ChecklistItem[]
  comments: Comment[]
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  oa_number: string
  customer: string
  project_type: ProjectType
  created_at: string
  cards?: Card[]
}

export type UserRole = 'admin' | 'editor' | 'viewer'
