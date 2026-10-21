import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, FileText, X,
  Sparkles, PanelRightOpen, PanelRightClose, CheckCircle2, AlertTriangle,
  XCircle, Circle, Layers, ClipboardList, Scale, FolderSearch, ListChecks,
  Cpu, ArrowRight, ExternalLink, FastForward, Loader2,
  Volume2, VolumeX, Captions, Repeat, Video, Gauge, Download,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import {
  STATUS_CARDS, SCENARIOS, QUESTIONNAIRE, EVIDENCE, OBLIGATIONS, GAP_MATRIX,
  TASKS, REPORT, ARCHITECTURE, COMMERCIAL, STEPS, PRESENTER_NOTES,
  ASSESSMENT_ANALYSIS, EVIDENCE_COLLECTING, STEP_STATUS, TYPEWRITER_FIELDS,
  NARRATION, TIMING, SPEED_MULT, VOICE_RATE, STEP_REVEAL_MS, LONG_HOLD_STEPS,
} from './demoData';

const DISCLAIMER =
  'This product provides a structured preliminary AI Act readiness assessment that supports legal, compliance and product teams. Final legal/compliance review remains human-led.';
const SCRIPTED_NOTE =
  'This public tour uses synthetic scenarios and scripted outputs. It does not upload files, connect to a backend or perform a live legal assessment. Final review remains human-led.';

const Brand = ({ compact = false }) => (
  <span className={`nf-brand ${compact ? 'nf-brand-compact' : ''}`}>
    <svg viewBox="0 0 40 40" aria-hidden="true" className="nf-mark">
      <path d="M5 30V7L20 20V7L35 20V33L20 20V33L5 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
    <span>normfold</span>
  </span>
);

const PortfolioLinks = ({ compact = false }) => (
  <div className={`nf-portfolio-links ${compact ? 'nf-portfolio-compact' : ''}`}>
    <a href="https://code-and-control.com" target="_blank" rel="noreferrer">Code &amp; Control <ExternalLink aria-hidden="true" /></a>
    <span className="nf-portfolio-project"><span>Machine Authority</span><small>Research project · by Marharet Babaieva</small></span>
  </div>
);

const downloadSampleReport = () => {
  const markdown = [
    '# Normfold — Sample AI Act Readiness Report',
    '',
    '**SYNTHETIC DEMO DATA · SCRIPTED OUTPUT · HUMAN REVIEW PENDING**',
    '',
    REPORT.subtitle,
    '',
    SCRIPTED_NOTE,
    '',
    ...REPORT.sections.flatMap((section) => [`## ${section.h}`, '', section.body, '']),
    '## Review limitations', '', REPORT.disclaimer, '',
    'Normfold · AI compliance. Grounded in evidence.',
  ].join('\n');
  const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'normfold-sample-readiness-report.md';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const TYPE_MS = 26; // per-character speed for the light typewriter (short fields)

// ─── tiny helpers ─────────────────────────────────────────────────────────────

// Stable component identity preserves toolbar focus during animated reveals.
const Ctrl = ({ onClick, disabled, children, primary, title, extra = '' }) => (
  <button onClick={onClick} disabled={disabled} title={title}
    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${extra} ${
      primary ? 'bg-blue-600 text-white hover:opacity-95' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
    {children}
  </button>
);
const NAV_ICONS = {
  overview: Layers, system: Cpu, intake: ClipboardList, evidence: FolderSearch,
  assessment: Scale, gaps: AlertTriangle, tasks: ListChecks, report: FileText, future: Sparkles,
};

const riskColor = (risk = '') => {
  const r = risk.toLowerCase();
  if (r.includes('high')) return { bg: '#f9f0ec', fg: '#7c4132', bd: '#e4c3b5' };
  if (r.includes('medium')) return { bg: '#faf5e9', fg: '#795b24', bd: '#e6d7b0' };
  return { bg: '#f0f4ed', fg: '#426034', bd: '#cbd9bf' };
};
const RiskPill = ({ risk }) => {
  const c = riskColor(risk);
  return (
    <span className="inline-flex rounded-full px-2 py-0.5 text-[12px] font-semibold"
      style={{ background: c.bg, color: c.fg, border: `1px solid ${c.bd}` }}>{risk}</span>
  );
};
const priorityColor = (p) =>
  p === 'Critical' ? { bg: '#f9f0ec', fg: '#7c4132' } :
  p === 'High' ? { bg: '#faf3e9', fg: '#8c602f' } : { bg: '#faf5e9', fg: '#795b24' };

const Card = ({ children, className = '' }) => (
  <div className={`nf-panel ${className}`}>{children}</div>
);
const SectionTitle = ({ children, hint }) => (
  <div className="mb-3 flex items-baseline gap-2">
    <h3 className="nf-section-title">{children}</h3>
    {hint && <span className="text-xs text-slate-400">{hint}</span>}
  </div>
);

const Reveal = ({ show, delay = 0, className = '', children }) =>
  show ? <div className={`fade-up ${className}`} style={{ animationDelay: `${delay}ms` }}>{children}</div> : null;

const DoneCaption = ({ text }) => (
  <div className="fade-up mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5">
    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
    <span className="text-[13px] font-medium text-emerald-800">{text}</span>
  </div>
);

const Typewriter = ({ text, active, instant }) => {
  const [n, setN] = useState(instant ? text.length : 0);
  useEffect(() => {
    if (!active) { setN(0); return; }
    if (instant) { setN(text.length); return; }
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1; setN(i);
      if (i >= text.length) clearInterval(id);
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [text, active, instant]);
  return (
    <span>{text.slice(0, n)}{active && !instant && n < text.length && <span className="animate-pulse text-slate-400">▌</span>}</span>
  );
};

// ─── Presenter notes panel ────────────────────────────────────────────────────
const PresenterNotes = ({ note }) => {
  const Row = ({ label, value, tone }) => (
    <div className="mb-3">
      <p className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: tone === 'warn' ? '#795b24' : tone === 'good' ? '#426034' : '#666b65' }}>{label}</p>
      <p className="mt-0.5 text-[13px] leading-relaxed text-slate-700">{value}</p>
    </div>
  );
  return (
    <div className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-600" />
        <h3 className="text-sm font-semibold text-slate-800">Presenter Notes</h3>
      </div>
      {note && <>
        <Row label="What this screen shows" value={note.shows} />
        <Row label="Why it matters" value={note.why} />
        <Row label="What to say" value={note.say} tone="good" />
        <Row label="What NOT to claim" value={note.dontClaim} tone="warn" />
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-[11px] font-semibold text-slate-500">Likely question</p>
          <p className="text-[13px] font-medium text-slate-800">{note.question}</p>
          <p className="mt-1.5 text-[11px] font-semibold text-slate-500">Suggested answer</p>
          <p className="text-[13px] text-slate-700">{note.answer}</p>
        </div>
      </>}
      <div className="mt-5 rounded-lg border border-violet-200 bg-violet-50 p-3">
        <p className="text-[12px] leading-relaxed text-violet-800">{SCRIPTED_NOTE}</p>
      </div>
    </div>
  );
};

// ─── Report preview modal ─────────────────────────────────────────────────────
const ReportModal = ({ open, onClose }) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = () => Array.from(dialog.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
    (focusable()[0] || dialog).focus({ preventScroll: true });
    const handleDialogKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const controls = focusable();
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
      } else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleDialogKey, true);
    return () => {
      document.removeEventListener('keydown', handleDialogKey, true);
      const returnTarget = previousFocus instanceof HTMLElement && previousFocus.isConnected
        ? previousFocus
        : document.querySelector('button[title="Open the report preview"]');
      if (returnTarget instanceof HTMLElement) returnTarget.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="nf-report-title" tabIndex={-1} className="nf-report-modal relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden bg-white">
        <div className="nf-report-header flex flex-shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-start gap-2">
              <FileText aria-hidden="true" className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
              <h2 id="nf-report-title" className="min-w-0 text-base font-semibold text-slate-900">{REPORT.title}</h2>
            </div>
            <div className="mt-2"><StatusBadge status="demo" text="Demo report preview" /></div>
          </div>
          <button onClick={onClose} aria-label="Close sample report" className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="nf-report-content min-h-0 overflow-y-auto px-8 py-6">
          <div className="nf-report-brand"><Brand compact /><span className="nf-label">SAMPLE / HR-001</span></div>
          <p className="text-sm text-slate-500">{REPORT.subtitle}</p>
          <p className="nf-report-disclosure">Synthetic HR scenario · Scripted report · Human review pending</p>
          <div className="mt-5 space-y-5">
            {REPORT.sections.map((s) => (
              <div key={s.h}>
                <h3 className="text-sm font-semibold text-slate-900">{s.h}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">Disclaimer</p>
            <p className="mt-1 text-[13px] leading-relaxed text-amber-900">{REPORT.disclaimer}</p>
          </div>
        </div>
        <div className="nf-report-footer flex-shrink-0 border-t border-slate-100 px-6 py-3">
          <p className="text-xs text-slate-500">A sample of the report structure. No live assessment was run.</p>
          <button onClick={downloadSampleReport} className="nf-button nf-button-secondary"><Download className="h-4 w-4" /> Download sample (.md)</button>
        </div>
      </div>
    </div>
  );
};

// ─── how many "reveal units" a step has ───────────────────────────────────────
export const stepTotal = (key, scenario) => {
  switch (key) {
    case 'overview': return STATUS_CARDS.length;
    case 'system': return Object.keys(scenario.intake).length;
    case 'intake': return QUESTIONNAIRE.length;
    case 'evidence': return EVIDENCE.found.length + EVIDENCE.missing.length;
    case 'assessment': return ASSESSMENT_ANALYSIS.length + 1;
    case 'gaps': return GAP_MATRIX.length;
    case 'tasks': return TASKS.length;
    case 'report': return REPORT.sections.length;
    case 'future': return 3;
    default: return 1;
  }
};

// ─── Step content (unchanged rendering, driven by `reveal`/`done`/`instant`) ──
const StepBody = ({ stepKey, scenario, reveal, done, instant }) => {
  const notHr = scenario.key !== 'hr';
  const HrBanner = () =>
    notHr ? (
      <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2.5 text-[13px] text-violet-800">
        This step is illustrated with the primary <b>HR Candidate Screening</b> scenario. The healthcare scenario
        primarily changes the intake and classification, and additionally requires combined medical-device (MDR) review.
      </div>
    ) : null;

  switch (stepKey) {
    case 'overview':
      return (
        <div className="space-y-6">
          <Card className="fade-up p-6">
            <p className="text-[17px] font-medium leading-relaxed text-slate-800">
              “Normfold helps companies prepare for the EU AI Act by turning AI system information, questionnaires
              and evidence into a risk classification, obligations map, gap assessment, remediation roadmap and report.”
            </p>
          </Card>
          <div>
            <SectionTitle hint="prototype modules and roadmap">Status</SectionTitle>
            <div className="nf-capability-grid grid gap-3">
              {STATUS_CARDS.map((c, i) => (
                <Reveal key={c.label} show={i < reveal}>
                  <Card className="p-4">
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-800">{c.label}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">{c.note}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
          {done && (
            <div className="nf-capability-grid grid gap-4">
              <Reveal show delay={40}><Card className="p-4 ring-2 ring-emerald-200">
                <SectionTitle>Assessment outputs</SectionTitle>
                <ul className="space-y-1 text-[13px] text-slate-600">
                  {COMMERCIAL.sellNow.map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />{x}</li>)}
                </ul>
              </Card></Reveal>
              <Reveal show delay={120}><Card className="p-4 ring-2 ring-blue-200">
                <SectionTitle>Human review required</SectionTitle>
                <ul className="space-y-1 text-[13px] text-slate-600">
                  {COMMERCIAL.humanReview.map((x) => <li key={x} className="flex gap-2"><Scale className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-500" />{x}</li>)}
                </ul>
              </Card></Reveal>
              <Reveal show delay={200}><Card className="p-4">
                <SectionTitle>We do not promise</SectionTitle>
                <ul className="space-y-1 text-[13px] text-slate-600">
                  {COMMERCIAL.doNotPromise.map((x) => <li key={x} className="flex gap-2"><XCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rose-400" />{x}</li>)}
                </ul>
              </Card></Reveal>
            </div>
          )}
          {done && <DoneCaption text={STEP_STATUS.overview} />}
        </div>
      );

    case 'system': {
      const entries = Object.entries(scenario.intake);
      return (
        <div className="space-y-4">
          <p className="text-[13px] text-slate-500">
            This step captures the facts needed to classify the AI system under the EU AI Act.
            The product cannot classify risk properly from the product name alone.
          </p>
          <Card className="divide-y divide-slate-100">
            {entries.map(([k, v], i) => (
              <div key={k} className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[210px_1fr]">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{k}</span>
                <span className="min-h-[20px] text-[14px] text-slate-800">
                  {i < reveal
                    ? (TYPEWRITER_FIELDS.includes(k)
                        ? <Typewriter text={v} active instant={instant} />
                        : <span className="fade-up inline-block">{v}</span>)
                    : <span className="text-slate-300">…</span>}
                </span>
              </div>
            ))}
          </Card>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status="working" text="Prototype module: intake" />
            <StatusBadge status="demo" text="Auto-filled demo data" />
          </div>
          {done && <DoneCaption text={STEP_STATUS.system} />}
        </div>
      );
    }

    case 'intake':
      return (
        <div className="space-y-4">
          <HrBanner />
          <p className="text-[13px] text-slate-500">The questionnaire turns vague product descriptions into legally relevant facts.</p>
          <Card className="divide-y divide-slate-100">
            {QUESTIONNAIRE.map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-[14px] text-slate-700">{row.q}</span>
                <span className="min-w-[120px] flex-shrink-0 text-right">
                  {i < reveal
                    ? <span className={`fade-up inline-block rounded-md px-2.5 py-1 text-[12px] font-semibold ${
                        row.tone === 'flag' ? 'bg-blue-50 text-blue-700'
                        : row.tone === 'gap' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{row.a}</span>
                    : <Loader2 className="ml-auto h-4 w-4 animate-spin text-slate-300" />}
                </span>
              </div>
            ))}
          </Card>
          {done && <DoneCaption text={STEP_STATUS.intake} />}
        </div>
      );

    case 'evidence': {
      const total = EVIDENCE.found.length + EVIDENCE.missing.length;
      const pct = Math.round((Math.min(reveal, total) / total) * 100);
      const foundShown = Math.min(reveal, EVIDENCE.found.length);
      const missShown = Math.max(0, reveal - EVIDENCE.found.length);
      return (
        <div className="space-y-5">
          <HrBanner />
          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                {!done && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                {done ? 'Sample evidence review complete' : EVIDENCE_COLLECTING}
              </span>
              <span className="text-[13px] font-semibold text-slate-500">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <SectionTitle>Evidence found</SectionTitle>
              <ul className="space-y-2">
                {EVIDENCE.found.map((e, i) => (
                  <Reveal key={e.name} show={i < foundShown}>
                    <li className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-[13px] text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{e.name}</span>
                      <StatusBadge status={e.status} />
                    </li>
                  </Reveal>
                ))}
              </ul>
            </Card>
            <Card className="p-4">
              <SectionTitle>Missing / to collect</SectionTitle>
              <ul className="space-y-2">
                {EVIDENCE.missing.map((e, i) => (
                  <Reveal key={e.name} show={i < missShown}>
                    <li className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-[13px] text-slate-700">
                        {e.status === 'planned' ? <Circle className="h-4 w-4 text-slate-300" /> : <XCircle className="h-4 w-4 text-rose-400" />}{e.name}
                      </span>
                      <StatusBadge status={e.status} />
                    </li>
                  </Reveal>
                ))}
              </ul>
            </Card>
          </div>
          <p className="text-xs text-slate-400">Connector capability belongs to the product prototype. This tour reveals a prepared sample evidence list; no sources are connected here.</p>
          {done && <DoneCaption text={STEP_STATUS.evidence} />}
        </div>
      );
    }

    case 'assessment': {
      const c = scenario.classification;
      const analysisShown = Math.min(reveal, ASSESSMENT_ANALYSIS.length);
      const resultShown = reveal > ASSESSMENT_ANALYSIS.length;
      return (
        <div className="space-y-5">
          <Card className="p-4">
            <SectionTitle hint="demo simulation of the analysis flow">Assessment walkthrough</SectionTitle>
            <ul className="space-y-1.5">
              {ASSESSMENT_ANALYSIS.map((line, i) => {
                const shown = i < analysisShown;
                const active = i === analysisShown && !resultShown;
                return (
                  <li key={line} className={`flex items-center gap-2 text-[13px] ${shown ? 'text-slate-700' : active ? 'text-slate-500' : 'text-slate-300'}`}>
                    {shown ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      : active ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      : <Circle className="h-4 w-4 text-slate-200" />}
                    {line}
                  </li>
                );
              })}
            </ul>
          </Card>

          {resultShown && (
            <Reveal show>
              <Card className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-rose-50 px-6 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Risk classification</p>
                    <p className="text-2xl font-bold text-rose-700">{c.level}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status="working" text="Prototype classification flow" />
                    <StatusBadge status="reasoning" text="Demo reasoning" />
                    <StatusBadge status="required" />
                  </div>
                </div>
                <div className="space-y-4 px-6 py-5">
                  <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Legal basis</p><p className="mt-0.5 text-[14px] text-slate-800">{c.legalBasis}</p></div>
                  <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reasoning</p><p className="mt-0.5 text-[14px] leading-relaxed text-slate-700">{c.reasoning}</p></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Confidence</p><p className="mt-0.5 text-[14px] font-medium text-slate-800">{c.confidence}</p></div>
                    <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Uncertainty</p><p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{c.uncertainty}</p></div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Clarifying questions (human-in-the-loop)</p>
                    <ul className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
                      {c.clarifying.map((q) => <li key={q} className="flex gap-2 text-[13px] text-slate-700"><ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-300" />{q}</li>)}
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="mt-5">
                <SectionTitle hint="what follows from a high-risk classification">Applicable obligations map</SectionTitle>
                {notHr && <HrBanner />}
                <Card className="overflow-x-auto">
                  <table className="min-w-[520px] w-full text-left text-[13px]">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400">
                      <tr><th className="px-4 py-2 font-semibold">Requirement</th><th className="px-4 py-2 font-semibold">Applicability</th><th className="px-4 py-2 font-semibold">Evidence</th><th className="px-4 py-2 font-semibold">Risk</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {OBLIGATIONS.map((o) => (
                        <tr key={o.article}>
                          <td className="px-4 py-2.5 font-medium text-slate-800">{o.article}</td>
                          <td className="px-4 py-2.5 text-slate-600">{o.applicability}</td>
                          <td className="px-4 py-2.5 text-slate-600">{o.evidence}</td>
                          <td className="px-4 py-2.5"><RiskPill risk={o.risk} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
              {done && <DoneCaption text={STEP_STATUS.assessment} />}
            </Reveal>
          )}
        </div>
      );
    }

    case 'gaps':
      return (
        <div className="space-y-4">
          <HrBanner />
          <p className="text-[13px] text-slate-500">Every obligation becomes a row: expected evidence, what was found, the gap, the risk, and the recommended fix with an owner.</p>
          <div className="overflow-x-auto">
            <Card className="min-w-[860px] overflow-hidden">
              <table className="w-full text-left text-[12.5px]">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400">
                  <tr>
                    {['Article / Requirement', 'Expected evidence', 'Found', 'Gap', 'Risk', 'Remediation', 'Owner', 'Status'].map((h) =>
                      <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 align-top">
                  {GAP_MATRIX.map((r, i) => (
                    i < reveal ? (
                      <tr key={r.article} className="fade-up">
                        <td className="px-3 py-2.5 font-medium text-slate-800">{r.article}</td>
                        <td className="px-3 py-2.5 text-slate-500">{r.expected}</td>
                        <td className="px-3 py-2.5 text-slate-500">{r.found}</td>
                        <td className="px-3 py-2.5 text-slate-700">{r.gap}</td>
                        <td className="px-3 py-2.5"><RiskPill risk={r.risk} /></td>
                        <td className="px-3 py-2.5 text-slate-600">{r.remediation}</td>
                        <td className="px-3 py-2.5 text-slate-600">{r.owner}</td>
                        <td className="px-3 py-2.5"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{r.status}</span></td>
                      </tr>
                    ) : null
                  ))}
                  {reveal < GAP_MATRIX.length && (
                    <tr><td colSpan={8} className="px-3 py-3 text-[12px] text-slate-400"><Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" />Revealing sample gap rows…</td></tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>
          {done && <DoneCaption text={STEP_STATUS.gaps} />}
        </div>
      );

    case 'tasks':
      return (
        <div className="space-y-4">
          <HrBanner />
          <p className="text-[13px] text-slate-500">The gaps become a prioritised roadmap with owners across Legal, HR, Product, Vendor Management and Security.</p>
          <div className="nf-task-grid grid gap-3">
            {TASKS.map((t, i) => {
              const pc = priorityColor(t.priority);
              return (
                <Reveal key={t.n} show={i < reveal}>
                  <Card className="flex items-center gap-3 p-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-500">{t.n}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-slate-800">{t.title}</p>
                      <p className="text-xs text-slate-400">Owner: {t.owner}</p>
                    </div>
                    <span className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: pc.bg, color: pc.fg }}>{t.priority}</span>
                  </Card>
                </Reveal>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status="working" text="Prototype module: tasks" />
            <StatusBadge status="planned" text="GRC / ticketing integration" />
          </div>
          {done && <DoneCaption text={STEP_STATUS.tasks} />}
        </div>
      );

    case 'report':
      return (
        <div className="space-y-4">
          <p className="text-[13px] text-slate-500">Everything comes together in a management-ready report — classification, obligations, evidence, gaps, roadmap and human-review status.</p>
          <Card className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{REPORT.title}</h3>
                <p className="text-sm text-slate-500">{REPORT.subtitle}</p>
              </div>
              <StatusBadge status="demo" text="Demo report preview" />
            </div>
            <div className="space-y-3">
              {REPORT.sections.map((s, i) => (
                <Reveal key={s.h} show={i < reveal}>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5">
                    <p className="text-[13px] font-semibold text-slate-700">{s.h}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">{s.body}</p>
                  </div>
                </Reveal>
              ))}
              {reveal < REPORT.sections.length && (
                <p className="text-[12px] text-slate-400"><Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" />Revealing sample report sections…</p>
              )}
            </div>
            {done && (
              <div className="fade-up mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">Disclaimer</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-amber-900">{REPORT.disclaimer}</p>
              </div>
            )}
          </Card>
          {done && <DoneCaption text={STEP_STATUS.report} />}
        </div>
      );

    case 'future': {
      const cols = [
        { title: 'Prototype modules', items: ARCHITECTURE.workingNow, status: 'working' },
        { title: 'Partially implemented', items: ARCHITECTURE.partial, status: 'partial' },
        { title: 'Planned', items: ARCHITECTURE.planned, status: 'planned' },
      ];
      return (
        <div className="space-y-4">
          <p className="text-[13px] text-slate-500">
            The product architecture starts with a web workflow. API, SDK and broader connector access belong to the roadmap; this public tour is a standalone demonstration.
          </p>
          <div className="nf-capability-grid grid gap-4">
            {cols.map((col, i) => (
              <Reveal key={col.title} show={i < reveal}>
                <Card className="p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><SectionTitle>{col.title}</SectionTitle><StatusBadge status={col.status} /></div>
                  <ul className="space-y-1.5 text-[13px] text-slate-600">
                    {col.items.map((x) => <li key={x} className="flex gap-2"><Circle className="mt-1 h-2 w-2 flex-shrink-0 fill-slate-300 text-slate-300" />{x}</li>)}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
          {done && (
            <div className="fade-up rounded-xl bg-blue-600 px-6 py-4 text-center">
              <p className="text-base font-semibold text-white">{STEP_STATUS.future}</p>
            </div>
          )}
        </div>
      );
    }
    default:
      return null;
  }
};

// ─── small control primitives ─────────────────────────────────────────────────
const Seg = ({ value, options, onChange, icon: Icon, title }) => (
  <div className="flex items-center gap-1.5" title={title}>
    {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
    <div className="flex rounded-lg border border-slate-200 p-0.5">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} aria-pressed={value === o.v}
          className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors ${value === o.v ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{o.label}</button>
      ))}
    </div>
  </div>
);
const Chip = ({ on, onClick, icon: Icon, label, title, accent = 'blue' }) => (
  <button onClick={onClick} title={title} aria-pressed={on}
    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-medium transition-colors ${
      on ? (accent === 'rose' ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-blue-300 bg-blue-50 text-blue-700')
         : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
    <Icon className="h-3.5 w-3.5" /> {label}
  </button>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const GuidedDemo = () => {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState('auto');
  const [scenarioKey, setScenarioKey] = useState('hr');
  const [stepIdx, setStepIdx] = useState(0);
  const [reveal, setReveal] = useState(0);
  const [paused, setPaused] = useState(false);
  const [instant, setInstant] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(true);

  // recording / narration settings
  const [speed, setSpeed] = useState('slow');          // slow | normal | fast  (default Slow)
  const [narrationOn, setNarrationOn] = useState(false);
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [voiceRate, setVoiceRate] = useState('normal');
  const [muted, setMuted] = useState(false);
  const [recordingMode, setRecordingMode] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [narrationEnded, setNarrationEnded] = useState(true);

  const scrollRef = useRef(null);
  const spokenKeyRef = useRef(null);
  const hasSpeech = typeof window !== 'undefined' && !!window.speechSynthesis;

  const scenario = SCENARIOS[scenarioKey];
  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const total = stepTotal(step.key, scenario);
  const done = reveal >= total;

  // ── speech helpers ──
  const cancelSpeech = useCallback(() => { try { if (hasSpeech) window.speechSynthesis.cancel(); } catch (_) {} }, [hasSpeech]);
  const speakNow = useCallback((text) => {
    if (!hasSpeech || !text) { setNarrationEnded(true); return; }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = VOICE_RATE[voiceRate] || 1;
      u.onend = () => setNarrationEnded(true);
      u.onerror = () => setNarrationEnded(true);
      setNarrationEnded(false);
      window.speechSynthesis.speak(u);
    } catch (_) { setNarrationEnded(true); }
  }, [hasSpeech, voiceRate]);

  // ── navigation ──
  const goStep = useCallback((i, animate = true) => {
    const clamped = Math.min(Math.max(i, 0), STEPS.length - 1);
    setStepIdx(clamped);
    const t = stepTotal(STEPS[clamped].key, scenario);
    setInstant(!animate);
    setReveal(animate ? 0 : t);
  }, [scenario]);

  const start = (m) => {
    cancelSpeech(); spokenKeyRef.current = null;
    setMode(m); setStarted(true); setStepIdx(0); setReveal(0); setPaused(false); setInstant(false);
  };
  const resetDemo = () => {
    cancelSpeech(); spokenKeyRef.current = null;
    setStarted(false); setPaused(false); setStepIdx(0); setReveal(0); setInstant(false); setReportOpen(false); setSubtitle('');
  };
  const skip = useCallback(() => { setInstant(true); setReveal(total); }, [total]);
  const next = useCallback(() => {
    if (!done) { setInstant(true); setReveal(total); }
    else if (!isLast) { cancelSpeech(); goStep(stepIdx + 1, true); }
  }, [done, isLast, total, stepIdx, goStep, cancelSpeech]);
  const prev = useCallback(() => { setPaused(false); cancelSpeech(); goStep(stepIdx - 1, false); }, [stepIdx, goStep, cancelSpeech]);

  const pause = () => { setPaused(true); try { if (hasSpeech) window.speechSynthesis.pause(); } catch (_) {} };
  const resume = () => { setPaused(false); try { if (hasSpeech && window.speechSynthesis.paused) window.speechSynthesis.resume(); } catch (_) {} };

  const toggleNarration = () => { cancelSpeech(); spokenKeyRef.current = null; setNarrationEnded(true); setNarrationOn((v) => !v); };
  const toggleMute = () => { cancelSpeech(); spokenKeyRef.current = null; setNarrationEnded(true); setMuted((v) => !v); };
  const replay = () => { spokenKeyRef.current = `${scenarioKey}:${stepIdx}`; speakNow(NARRATION[step.key] || ''); setSubtitle(NARRATION[step.key] || ''); };

  // Recording Mode: only sets best settings — does NOT start the demo.
  const toggleRecording = () => {
    const on = !recordingMode; setRecordingMode(on);
    if (on) { setSpeed('slow'); setNarrationOn(true); setSubtitlesOn(true); setNotesOpen(true); setMode('auto'); spokenKeyRef.current = null; }
  };

  // ── subtitle text follows the current step ──
  useEffect(() => { setSubtitle(started ? (NARRATION[step.key] || '') : ''); }, [started, step.key]);

  // ── narrate once per step (guarded, never overlapping) ──
  useEffect(() => {
    if (!started) return;
    if (!narrationOn || muted) { cancelSpeech(); setNarrationEnded(true); return; }
    const key = `${scenarioKey}:${stepIdx}`;
    if (spokenKeyRef.current === key) return;
    spokenKeyRef.current = key;
    speakNow(NARRATION[step.key] || '');
  }, [started, stepIdx, scenarioKey, narrationOn, muted, step.key, speakNow, cancelSpeech]);

  // ── reveal engine (deterministic; speed multiplier applied) ──
  useEffect(() => {
    if (!started || paused || done) return;
    const base = STEP_REVEAL_MS[step.key] || TIMING.REVEAL_MS;
    const ms = base * (SPEED_MULT[speed] || 1);
    const id = setTimeout(() => setReveal((r) => Math.min(r + 1, total)), ms);
    return () => clearTimeout(id);
  }, [started, paused, done, reveal, step.key, total, speed]);

  // ── auto-advance: wait for narration (if on) then a readable hold ──
  useEffect(() => {
    if (!started || paused || mode !== 'auto' || !done || isLast) return;
    if (narrationOn && !muted && hasSpeech && !narrationEnded) return; // wait for the voice to finish
    const base = LONG_HOLD_STEPS.includes(step.key) ? TIMING.LONG_STEP_HOLD_MS : TIMING.STEP_HOLD_MS;
    const hold = base * (SPEED_MULT[speed] || 1);
    const id = setTimeout(() => { cancelSpeech(); goStep(stepIdx + 1, true); }, hold);
    return () => clearTimeout(id);
  }, [started, paused, mode, done, isLast, narrationOn, muted, hasSpeech, narrationEnded, step.key, speed, stepIdx, goStep, cancelSpeech]);

  // ── scroll to top on step change ──
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [stepIdx]);

  // ── cancel any speech on unmount ──
  useEffect(() => () => { try { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); } catch (_) {} }, []);

  // ── keyboard ──
  useEffect(() => {
    if (!started) return;
    const onKey = (e) => {
      if (reportOpen) return; // The dialog owns keyboard navigation while open.
      if (e.target.closest('button, a, input, select, textarea')) return;
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') setReportOpen(false);
      else if (e.code === 'Space') { e.preventDefault(); paused ? resume() : pause(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, next, prev, paused, reportOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const styleTag = (
    <style>{`
      @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      .fade-up { animation: fadeUp .5s ease both; }
    `}</style>
  );

  // ── Landing ──
  if (!started) {
    return (
      <div className="nf-entry">
        {styleTag}
        <header className="nf-entry-header">
          <a href="../" className="nf-brand-link" aria-label="Normfold home"><Brand /></a>
          <span className="nf-label nf-entry-edition">PRODUCT TOUR / 2026</span>
          <a href="../" className="nf-back-link">Project overview <ArrowRight aria-hidden="true" /></a>
        </header>

        <main className="nf-entry-main">
          <section className="nf-entry-intro">
            <p className="nf-eyebrow"><span /> THE NORMFOLD WALKTHROUGH</p>
            <h1>AI compliance.<br /><em>Grounded in evidence.</em></h1>
            <p className="nf-intro-copy">Follow one AI system from its intended purpose to a clear record of requirements, evidence, gaps and next steps.</p>
            <div className="nf-entry-process" aria-label="Walkthrough stages">
              <span><b>01</b> Understand</span><span><b>02</b> Assess</span><span><b>03</b> Act</span>
            </div>
            <div className="nf-demo-disclosure">
              <span className="nf-label">SCRIPTED PRODUCT TOUR</span>
              <p>{SCRIPTED_NOTE}</p>
            </div>
          </section>

          <section className="nf-entry-setup" aria-labelledby="nf-setup-title">
            <div className="nf-setup-heading"><span className="nf-label">YOUR WALKTHROUGH</span><span className="nf-label">9 STEPS</span></div>
            <h2 id="nf-setup-title">Start with a system.</h2>
            <p className="nf-setup-copy">Choose a synthetic scenario to explore the assessment workflow.</p>
            <div className="nf-scenarios" role="group" aria-label="Demo scenario">
              {Object.values(SCENARIOS).map((s) => (
                <button key={s.key} onClick={() => setScenarioKey(s.key)} aria-pressed={scenarioKey === s.key}
                  className={`nf-scenario ${scenarioKey === s.key ? 'nf-scenario-selected' : ''}`}>
                  <span className="nf-radio" aria-hidden="true" />
                  <span className="nf-scenario-copy"><b>{s.label}</b><small>{s.tag}</small></span>
                  <ArrowRight aria-hidden="true" />
                </button>
              ))}
            </div>

            <div className="nf-recording-setting">
              <div className="nf-recording-copy"><Video aria-hidden="true" /><span><b>Presenter setup</b><small>Slow playback, narration, subtitles and notes</small></span></div>
              <button onClick={toggleRecording} className={`nf-switch ${recordingMode ? 'nf-switch-on' : ''}`}
                role="switch" aria-checked={recordingMode} aria-label="Enable presenter recording setup"><span /></button>
            </div>
            {recordingMode && <p className="nf-setting-hint" role="status">Presenter setup is ready. Start the tour when you are ready to record.</p>}

            <div className="nf-entry-actions">
              <button onClick={() => start('auto')} className="nf-button nf-button-primary"><Play className="h-4 w-4" /> Play guided tour <ArrowRight className="h-4 w-4" /></button>
              <button onClick={() => start('manual')} className="nf-button nf-button-secondary">Explore at your pace <ChevronRight className="h-4 w-4" /></button>
            </div>
            <p className="nf-setup-footnote">Guided mode advances automatically. Manual mode lets you choose when to move on.</p>
          </section>
        </main>

        <footer className="nf-entry-footer">
          <div><span className="nf-label">A CONNECTED BODY OF WORK</span><PortfolioLinks /></div>
          <p>Independent projects by Marharet Babaieva.<br />Research, assessment and delegated authority.</p>
        </footer>
      </div>
    );
  }

  // ── Running demo ──
  const note = PRESENTER_NOTES[step.key];

  return (
    <div className="nf-shell flex h-[100dvh] flex-col bg-slate-50">
      {styleTag}
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />

      {/* Subtitle bar (bottom-center, hideable) */}
      {subtitlesOn && subtitle && !reportOpen && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[110] w-[92%] max-w-3xl -translate-x-1/2">
          <div className="rounded-xl bg-slate-900/85 px-5 py-3 text-center shadow-lg backdrop-blur-sm">
            <p className="text-[15px] font-medium leading-relaxed text-white sm:text-base">{subtitle}</p>
          </div>
        </div>
      )}

      {/* Top control bar */}
      <header className="nf-app-header flex flex-shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={resetDemo} className="nf-brand-link" aria-label="Return to Normfold tour setup"><Brand compact /></button>
          <span className="nf-app-divider" aria-hidden="true" />
          <span className="nf-label hidden sm:inline">PRODUCT TOUR</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{mode === 'auto' ? 'Auto' : 'Manual'}</span>
          {!done && <span className="hidden items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 sm:inline-flex"><Loader2 className="h-3 w-3 animate-spin" />Animating</span>}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Ctrl onClick={prev} disabled={stepIdx === 0} title="Previous step"><ChevronLeft className="h-4 w-4" /> Prev</Ctrl>
          {paused
            ? <Ctrl onClick={resume} title="Resume animation & narration" extra=""><Play className="h-4 w-4 fill-slate-700" /> Resume</Ctrl>
            : <Ctrl onClick={pause} title="Pause animation & narration" extra=""><Pause className="h-4 w-4" /> Pause</Ctrl>}
          <Ctrl onClick={skip} disabled={done} title="Skip animation — complete this step instantly" extra=""><FastForward className="h-4 w-4" /> Skip</Ctrl>
          <Ctrl onClick={next} disabled={isLast && done} primary title="Next (completes the animation, then advances)">Next <ChevronRight className="h-4 w-4" /></Ctrl>
          <Ctrl onClick={() => setReportOpen(true)} title="Open the report preview"><FileText className="h-4 w-4" /> Report</Ctrl>
          <button onClick={() => setSubtitlesOn((v) => !v)} aria-pressed={subtitlesOn} aria-label="Toggle subtitles" className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 md:hidden"><Captions className="h-4 w-4" /></button>
          <Ctrl onClick={resetDemo} title="Reset the demo" extra=""><RotateCcw className="h-4 w-4" /> Reset</Ctrl>
          <button onClick={() => setNotesOpen((v) => !v)} title="Toggle presenter notes" aria-label="Toggle presenter notes" aria-expanded={notesOpen}
            className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 lg:inline-flex">
            {notesOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Settings row: speed / narration / subtitles / voice / recording */}
      <div className="nf-settings hidden flex-shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 bg-slate-50 px-4 py-2 md:flex">
        <Seg icon={Gauge} title="Playback speed" value={speed}
          onChange={setSpeed} options={[{ v: 'slow', label: 'Slow' }, { v: 'normal', label: 'Normal' }, { v: 'fast', label: 'Fast' }]} />
        <span className="text-slate-200">|</span>
        <Chip on={narrationOn} onClick={toggleNarration} icon={narrationOn ? Volume2 : VolumeX}
          label={narrationOn ? 'Narration: On' : 'Narration: Off'} title="Toggle browser voiceover" />
        <Chip on={subtitlesOn} onClick={() => setSubtitlesOn((v) => !v)} icon={Captions}
          label={subtitlesOn ? 'Subtitles: On' : 'Subtitles: Off'} title="Toggle subtitles" />
        <Seg title="Voice speed" value={voiceRate}
          onChange={setVoiceRate} options={[{ v: 'slow', label: 'Slow' }, { v: 'normal', label: 'Normal' }, { v: 'fast', label: 'Fast' }]} />
        <Chip on={muted} onClick={toggleMute} icon={muted ? VolumeX : Volume2} label={muted ? 'Muted' : 'Mute'} title="Mute / unmute narration" accent="rose" />
        <button onClick={replay} disabled={!narrationOn && !hasSpeech} title="Replay narration for this step"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40">
          <Repeat className="h-3.5 w-3.5" /> Replay narration
        </button>
        <span className="text-slate-200">|</span>
        <Chip on={recordingMode} onClick={toggleRecording} icon={Video} label="Recording Mode" title="Set slow + narration + subtitles + notes + auto" accent="rose" />
        {!hasSpeech && <span className="text-[11px] text-amber-600">Voice not supported in this browser — subtitles still work.</span>}
      </div>

      {/* Progress bar */}
      <div className="nf-progress flex-shrink-0 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <button key={s.key} onClick={() => { setPaused(false); cancelSpeech(); goStep(i, false); }} title={s.title} aria-label={`Step ${i + 1}: ${s.title}`} aria-current={i === stepIdx ? 'step' : undefined} className="group flex flex-1 items-center gap-1.5">
              <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                i < stepIdx ? 'bg-emerald-500 text-white' : i === stepIdx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}`}>
                {i < stepIdx ? '✓' : i + 1}
              </span>
              {i < STEPS.length - 1 && <span className={`h-0.5 flex-1 rounded ${i < stepIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <nav aria-label="Assessment workflow" className="nf-sidebar hidden w-52 flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-white py-4 md:flex md:flex-col">
          <span className="nf-label nf-sidebar-label">ASSESSMENT WORKFLOW</span>
          {STEPS.map((s, i) => {
            const Icon = NAV_ICONS[s.key] || Circle;
            const active = i === stepIdx;
            return (
              <button key={s.key} onClick={() => { setPaused(false); cancelSpeech(); goStep(i, false); }}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                  active ? 'bg-blue-50 font-medium text-blue-800' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="truncate">{s.nav}</span>
                {i < stepIdx && <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-500" />}
              </button>
            );
          })}
          <div className="mx-4 mt-3 border-t border-slate-100 pt-3">
            <p className="text-[11px] leading-relaxed text-slate-400">Synthetic data. Scripted results. Explore the workflow; no live assessment runs in this tour.</p>
          </div>
          <div className="nf-sidebar-portfolio"><span className="nf-label">FOUNDER PORTFOLIO</span><PortfolioLinks compact /><a href="../" className="nf-sidebar-back">Normfold overview <ArrowRight aria-hidden="true" /></a></div>
        </nav>

        <main ref={scrollRef} className="nf-workspace min-w-0 flex-1 overflow-y-auto px-6 py-7 pb-28">
          <div className="mx-auto max-w-4xl">
            <div className="nf-step-heading mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="nf-label">Step {stepIdx + 1} of {STEPS.length}</p>
                <h1 className="nf-step-title">{step.title}</h1>
                <p className="text-sm text-slate-500">{step.subtitle}</p>
              </div>
              <span className="nf-scenario-label">{scenario.label}</span>
            </div>
            <p className="nf-inline-disclosure"><span aria-hidden="true" /> Synthetic scenario · Scripted outputs · Human review required</p>
            <StepBody stepKey={step.key} scenario={scenario} reveal={reveal} done={done} instant={instant} />

            <div className="nf-step-actions mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <button onClick={prev} disabled={stepIdx === 0}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" /> {stepIdx > 0 ? STEPS[stepIdx - 1].nav : 'Previous'}
              </button>
              {isLast && done ? (
                <button onClick={() => setReportOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  <FileText className="h-4 w-4" /> Open Full Report Preview
                </button>
              ) : (
                <button onClick={next}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  {!done ? 'Complete step' : STEPS[Math.min(stepIdx + 1, STEPS.length - 1)].nav} <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </main>

        {notesOpen && (
          <aside className="nf-notes hidden w-80 flex-shrink-0 overflow-y-auto border-l border-slate-200 bg-white lg:block">
            <PresenterNotes note={note} />
          </aside>
        )}
      </div>
    </div>
  );
};

export default GuidedDemo;
