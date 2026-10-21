/**
 * StatusBadge — honesty label chip used throughout the guided demo.
 * The wording is deliberately conservative so we never overstate maturity.
 */
const STYLES = {
  working:  { label: 'Working now',            bg: '#ECFDF5', fg: '#047857', bd: '#A7F3D0' },
  demo:     { label: 'Demo data',              bg: '#F5F3FF', fg: '#6D28D9', bd: '#DDD6FE' },
  reasoning:{ label: 'Demo reasoning',         bg: '#F5F3FF', fg: '#6D28D9', bd: '#DDD6FE' },
  partial:  { label: 'Partially implemented',  bg: '#FFFBEB', fg: '#B45309', bd: '#FDE68A' },
  planned:  { label: 'Planned',                bg: '#F1F5F9', fg: '#475569', bd: '#E2E8F0' },
  internal: { label: 'Internal only',          bg: '#F8FAFC', fg: '#64748B', bd: '#E2E8F0' },
  required: { label: 'Human review required',  bg: '#EFF6FF', fg: '#1D4ED8', bd: '#BFDBFE' },
  // evidence statuses
  found:    { label: 'Found',                  bg: '#ECFDF5', fg: '#047857', bd: '#A7F3D0' },
  missing:  { label: 'Missing',                bg: '#FEF2F2', fg: '#B91C1C', bd: '#FECACA' },
};

const StatusBadge = ({ status, text }) => {
  const s = STYLES[status] || STYLES.planned;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{ background: s.bg, color: s.fg, border: `1px solid ${s.bd}` }}
    >
      {text || s.label}
    </span>
  );
};

export default StatusBadge;
