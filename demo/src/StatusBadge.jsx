/**
 * StatusBadge — honesty label chip used throughout the guided demo.
 * The wording is deliberately conservative so we never overstate maturity.
 */
const STYLES = {
  working:  { label: 'Prototype module',            bg: '#f0f4ed', fg: '#426034', bd: '#cbd9bf' },
  demo:     { label: 'Demo data',              bg: '#eff2fc', fg: '#244ac5', bd: '#cbd6f7' },
  reasoning:{ label: 'Demo reasoning',         bg: '#eff2fc', fg: '#244ac5', bd: '#cbd6f7' },
  partial:  { label: 'Partially implemented',  bg: '#faf5e9', fg: '#795b24', bd: '#e6d7b0' },
  planned:  { label: 'Planned',                bg: '#f0f1e9', fg: '#525c4c', bd: '#dedfd7' },
  internal: { label: 'Internal only',          bg: '#faf9f5', fg: '#666b65', bd: '#dedfd7' },
  required: { label: 'Human review required',  bg: '#eff2fc', fg: '#244ac5', bd: '#cbd6f7' },
  // evidence statuses
  found:    { label: 'Found',                  bg: '#f0f4ed', fg: '#426034', bd: '#cbd9bf' },
  missing:  { label: 'Missing',                bg: '#f9f0ec', fg: '#7c4132', bd: '#e4c3b5' },
};

const StatusBadge = ({ status, text }) => {
  const s = STYLES[status] || STYLES.planned;
  return (
    <span
      className="nf-status-badge inline-flex items-center px-2 py-1 text-[10px] font-medium"
      style={{ background: s.bg, color: s.fg, border: `1px solid ${s.bd}` }}
    >
      {text || s.label}
    </span>
  );
};

export default StatusBadge;
