import { Project, getDefaultChecklist, getHPUStageChecklist } from './types'

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'NTPC - HPU Door Opening',
    oa_number: '1608823276',
    customer: 'Elecon Engineering',
    project_type: 'integration',
    created_at: '2025-11-14T00:00:00Z',
    cards: [
      { id: 'c1',  project_id: '1', name: 'Tank 40L MS', card_type: 'tank', scope: 'my_scope', stage: 'in_fabrication', bom_ref: 'Sr 1', qty: 1, has_flag: false, checklist: getDefaultChecklist('tank'), comments: [], created_at: '', updated_at: '' },
      { id: 'c2',  project_id: '1', name: 'Bell Housing', card_type: 'bell_housing', scope: 'my_scope', stage: 'with_vendor_machining', bom_ref: 'Sr 7', make_model: 'Danfoss 598871', qty: 1, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c3',  project_id: '1', name: 'Coupling', card_type: 'coupling', scope: 'my_scope', stage: 'ordered', bom_ref: 'Sr 8', make_model: 'L100-SP4 / Hydax', qty: 1, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c4',  project_id: '1', name: 'Motor 2.2kW', card_type: 'motor', scope: 'my_scope', stage: 'received', bom_ref: 'Sr 6', make_model: 'Innomotics IE4 B5 100L', qty: 1, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c5',  project_id: '1', name: 'Gear Pump', card_type: 'pump', scope: 'my_scope', stage: 'received', bom_ref: 'Sr 5', make_model: 'Danfoss SNP2 4.0cc', qty: 1, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c6',  project_id: '1', name: 'Valve Assembly', card_type: 'valve_assembly', scope: 'my_scope', stage: 'bom_check', bom_ref: 'Sr 13,14,15,16', make_model: 'Danfoss DGMC / DG17V / DGMPC / DGMFN', qty: 4, has_flag: true, notes: 'Verify model codes — B6 vs B8 risk on DC valves', checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c7',  project_id: '1', name: 'Tank Accessories', card_type: 'tank_accessories', scope: 'my_scope', stage: 'po_placed', bom_ref: 'Sr 2,3,4', make_model: 'Hydroline', qty: 3, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c8',  project_id: '1', name: 'Instruments', card_type: 'instruments', scope: 'my_scope', stage: 'received', bom_ref: 'Sr 11,12,17', make_model: 'Wika / Fenner / Hydrotechnik', qty: 3, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c9',  project_id: '1', name: 'Manifold Block', card_type: 'manifold_block', scope: 'my_scope', stage: 'with_vendor', bom_ref: 'Sr 18', make_model: 'PSC-36373 / Danfoss', qty: 1, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c10', project_id: '1', name: 'Enclosure', card_type: 'enclosure', scope: 'my_scope', stage: 'with_vendor', bom_ref: 'Sr 19,20', make_model: 'MS Enclosure', qty: 1, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c11', project_id: '1', name: 'Piping & Fittings', card_type: 'piping', scope: 'my_scope', stage: 'planning', bom_ref: 'Per circuit PSC-54146', qty: 1, has_flag: false, checklist: getDefaultChecklist('piping'), comments: [], created_at: '', updated_at: '' },
      { id: 'c12', project_id: '1', name: 'Commissioning Spares', card_type: 'commissioning_spares', scope: 'my_scope', stage: 'backlog', bom_ref: 'Sr 23-26 + Mand Spare', make_model: 'Hydroline / Wika / Innomotics', qty: 7, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c13', project_id: '1', name: 'HPU Integration', card_type: 'hpu_integration', scope: 'my_scope', stage: 'locked', qty: 1, has_flag: false, checklist: getHPUStageChecklist('pre_test_check'), comments: [], created_at: '', updated_at: '' },
    ]
  },
  {
    id: '2',
    name: 'HPU for Thickner',
    oa_number: '1608773656',
    customer: 'Metso',
    project_type: 'integration',
    created_at: '2026-04-27T00:00:00Z',
    cards: [
      { id: 'c21', project_id: '2', name: 'Tank', card_type: 'tank', scope: 'my_scope', stage: 'ready', qty: 2, has_flag: false, checklist: getDefaultChecklist('tank'), comments: [], created_at: '', updated_at: '' },
      { id: 'c22', project_id: '2', name: 'Bell Housing', card_type: 'bell_housing', scope: 'my_scope', stage: 'received', make_model: 'Danfoss', qty: 3, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c23', project_id: '2', name: 'Coupling', card_type: 'coupling', scope: 'my_scope', stage: 'received', qty: 3, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c24', project_id: '2', name: 'Motor 7.5kW', card_type: 'motor', scope: 'my_scope', stage: 'received', make_model: 'Innomotics 7.5kW', qty: 3, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c25', project_id: '2', name: 'Valve Assembly', card_type: 'valve_assembly', scope: 'my_scope', stage: 'received', has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c26', project_id: '2', name: 'Piping & Fittings', card_type: 'piping', scope: 'my_scope', stage: 'piping_in_progress', has_flag: true, notes: 'Gear pump suction — confirm hose vs hard pipe, raise as-built if deviation', checklist: getDefaultChecklist('piping'), comments: [], created_at: '', updated_at: '' },
      { id: 'c27', project_id: '2', name: 'HPU Integration', card_type: 'hpu_integration', scope: 'my_scope', stage: 'locked', qty: 1, has_flag: false, checklist: getHPUStageChecklist('pre_test_check'), comments: [], created_at: '', updated_at: '' },
    ]
  },
  {
    id: '3',
    name: 'BKT Tank Set',
    oa_number: '1608XXXXXX',
    customer: 'Parker (Mayekar)',
    project_type: 'fabrication',
    created_at: '2026-03-01T00:00:00Z',
    cards: [
      { id: 'c31', project_id: '3', name: 'Tank Set', card_type: 'tank', scope: 'my_scope', stage: 'in_fabrication', qty: 5, has_flag: true, notes: 'Bell housing PCD — verify before drilling. Last batch 838mm vs 860mm required', checklist: getDefaultChecklist('tank'), comments: [], created_at: '', updated_at: '' },
      { id: 'c32', project_id: '3', name: 'Bell Housing', card_type: 'bell_housing', scope: 'my_scope', stage: 'with_vendor_machining', qty: 5, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c33', project_id: '3', name: 'Coupling', card_type: 'coupling', scope: 'client_scope', stage: 'ready', qty: 5, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
    ]
  },
  {
    id: '4',
    name: 'HPU Boom Luffing',
    oa_number: '1608138932',
    customer: 'Lepton Projects',
    project_type: 'integration',
    created_at: '2025-10-14T00:00:00Z',
    cards: [
      { id: 'c41', project_id: '4', name: 'Tank', card_type: 'tank', scope: 'my_scope', stage: 'ready', has_flag: false, checklist: getDefaultChecklist('tank'), comments: [], created_at: '', updated_at: '' },
      { id: 'c42', project_id: '4', name: 'Bell Housing', card_type: 'bell_housing', scope: 'my_scope', stage: 'received', qty: 4, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c43', project_id: '4', name: 'Coupling', card_type: 'coupling', scope: 'my_scope', stage: 'received', qty: 4, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c44', project_id: '4', name: 'Motor 3.7kW', card_type: 'motor', scope: 'my_scope', stage: 'received', make_model: 'Siemens 3.7kW IE4', qty: 4, has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c45', project_id: '4', name: 'Enclosure', card_type: 'enclosure', scope: 'client_scope', stage: 'ready', has_flag: false, checklist: [], comments: [], created_at: '', updated_at: '' },
      { id: 'c46', project_id: '4', name: 'Piping & Fittings', card_type: 'piping', scope: 'my_scope', stage: 'backlog', has_flag: false, checklist: getDefaultChecklist('piping'), comments: [], created_at: '', updated_at: '' },
    ]
  },
]
