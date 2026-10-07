/** Pure acquisition methodology check; never writes facts, dispatches or activates a root. */
export const EXPORTED_SLOTS = Object.freeze(['service-intake','representation-authorization','readiness-evaluation','receiver-contribution','outcome-continuity']);
const text = x => typeof x === 'string' && x.trim().length > 0;
export function evaluateIntake(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('intake object required');
  for (const key of ['task_ref','subject_ref','service','next_action','source_map_revision','idempotency_key','organization_ref','actor_ref','purpose']) {
    if (!text(input[key])) throw new Error(`${key} required`);
  }
  if (!Array.isArray(input.requirements) || !Array.isArray(input.contributions)) throw new Error('requirements and contributions required');
  const blockers = [];
  if (input.effect_status === 'UNKNOWN') blockers.push('RECONCILE_BEFORE_RETRY');
  if (input.authority?.status !== 'ACCEPTED' || input.authority?.current !== true || input.authority?.revoked !== false || !text(input.authority?.decision_ref) || !text(input.authority?.owner) || input.authority?.scope !== input.next_action || input.authority?.source_map_revision !== input.source_map_revision || ['organization_ref','actor_ref','purpose','subject_ref','service'].some(key => input.authority?.[key] !== input[key])) blockers.push('COMPETENT_SCOPED_AUTHORITY_REQUIRED');
  const ids = new Set();
  for (const r of input.requirements) {
    if (!text(r.id) || ids.has(r.id)) throw new Error('unique requirement IDs required');
    ids.add(r.id);
    if (r.action !== input.next_action) throw new Error('requirements must be scoped to next action');
    if (r.status !== 'ACCEPTED' || !text(r.evidence_ref) || !text(r.source_ref) || !text(r.version) || !text(r.accepted_by)) blockers.push(`EVIDENCE_NOT_ACCEPTED:${r.id}`);
  }
  const contributionIds = new Set();
  for (const c of input.contributions) {
    if (!text(c.request_ref) || contributionIds.has(c.request_ref) || !text(c.owner) || !text(c.objective) || !text(c.shared_ref)) throw new Error('distinct receiver-owned contribution required');
    contributionIds.add(c.request_ref);
    if (c.status !== 'ACCEPTED_RESULT' || !text(c.response_ref) || !text(c.acceptance_ref)) blockers.push(`RECEIVER_RESULT_PENDING:${c.request_ref}`);
  }
  if (!text(input.continuity?.owner) || !text(input.continuity?.review_ref)) blockers.push('OWNED_CONTINUITY_REQUIRED');
  if (input.transfer && (input.transfer.status !== 'ACCEPTED' || !text(input.transfer.receiver) || !text(input.transfer.acceptance_ref))) blockers.push('TRANSFER_NOT_ACCEPTED');
  return { result: blockers.length ? 'BLOCKED' : 'NEXT_ACTION_ELIGIBLE', blockers, task_ref: input.task_ref, subject_ref: input.subject_ref, service: input.service, next_action: input.next_action, source_map_revision: input.source_map_revision, idempotency_key: input.idempotency_key, dispatch_performed: false, fact_written: false, authority_granted: false };
}
