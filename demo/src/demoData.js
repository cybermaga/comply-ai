/**
 * demoData.js — all scripted content for the /guided-demo presentation mode.
 *
 * IMPORTANT: This is a self-contained, front-end-only demo. Nothing here calls
 * the backend or the database. Every value is hardcoded so the walkthrough is
 * 100% deterministic for video recording and live presentations.
 *
 * Honesty labels (see StatusBadge.jsx) reflect the ACTUAL state of the codebase:
 *   working  — real & wired in the full product
 *   demo     — scripted demo data shown in this walkthrough
 *   partial  — code exists but needs config / is not fully productised
 *   planned  — not built yet; future architecture
 *   internal — exists but internal-only / not customer-facing
 */

// ─── Step 0: status cards (honest maturity of each capability) ────────────────
export const STATUS_CARDS = [
  { label: 'Web app', status: 'working', note: 'Web workflow in the product prototype; shown here as a scripted tour.' },
  { label: 'Assessment workflow', status: 'working', note: 'Prototype modules cover intake, classification, evidence, gaps and tasks.' },
  { label: 'Report preview', status: 'demo', note: 'Shown here as demo data; real DOCX/PDF export exists in the full product.' },
  { label: 'LLM reasoning', status: 'working', note: 'Mistral integration in the product prototype. No model is called in this tour.' },
  { label: 'SDK / Public API', status: 'planned', note: 'Early internal code only. Not a shipped product feature.' },
  { label: 'Plugins / connectors', status: 'partial', note: 'A read-only GitHub connector exists; others are planned.' },
  { label: 'Human legal review', status: 'required', note: 'Final legal/compliance sign-off is always human-led.' },
];

// ─── Scenarios ────────────────────────────────────────────────────────────────
export const SCENARIOS = {
  hr: {
    key: 'hr',
    label: 'HR Candidate Screening AI',
    tag: 'Primary scenario',
    intake: {
      'System name': 'HR Candidate Screening Assistant',
      Description:
        'AI system that screens job applications, ranks candidates, and recommends which applicants should be shortlisted for human recruiter review.',
      'Use case':
        'Analyses CVs, application forms, work history, education, skills and job requirements. Generates a candidate score and shortlist recommendation for recruiters. The final hiring decision remains with human recruiters, but the AI output may significantly influence who is invited to interview.',
      'Application domain': 'Employment / Recruitment / Worker Management',
      'Provider / Deployer role': 'Deployer using a third-party AI tool in a professional recruitment process',
      'Intended users': 'HR team, recruiters, hiring managers',
      'Affected persons': 'Job applicants and candidates',
      'Decision impact': 'The AI output may significantly influence access to employment because it helps rank and shortlist candidates.',
      'Human involvement': 'Human recruiters review the AI recommendation, but the oversight process is not fully documented.',
    },
    riskNotes: [
      'Bias and discrimination risk',
      'Lack of transparency to candidates',
      'Insufficient human oversight',
      'Poor documentation of training / evaluation data',
      'Overreliance by recruiters',
      'Incomplete logging and audit trail',
      'Missing appeal or contestation process',
      'Unclear vendor / provider responsibility split',
    ],
    classification: {
      level: 'High-risk',
      legalBasis: 'EU AI Act Annex III — employment, worker management and access to self-employment.',
      reasoning:
        'The system is used to screen and rank job applicants and may influence access to employment. AI systems used for recruitment or selection, including filtering applications and evaluating candidates, fall within high-risk categories.',
      confidence: 'High',
      uncertainty:
        'The final classification depends on the exact role of the company, the level of influence of the AI output, the degree of human oversight, and whether the system is only preparatory or materially affects candidate selection.',
      clarifying: [
        'Is the AI score used to reject candidates automatically?',
        'Can recruiters override the recommendation?',
        'Are candidates informed that AI is used?',
        'Does the vendor provide technical documentation?',
        'Is bias testing available?',
        'Are decisions logged?',
      ],
    },
  },
  healthcare: {
    key: 'healthcare',
    label: 'Healthcare Blood Test Analysis Assistant',
    tag: 'Secondary scenario',
    intake: {
      'System name': 'Healthcare Blood Test Analysis Assistant',
      Description:
        'AI system that analyses uploaded blood test results and provides preliminary interpretation, risk flags, and recommended next steps for the user. It does not make a final medical diagnosis and is intended to support follow-up with a qualified healthcare professional.',
      'Use case':
        'After a user uploads or enters blood test results, the system evaluates selected biomarkers, identifies values outside reference ranges, explains possible clinical relevance, and suggests whether the user should consult a doctor, repeat testing, or seek urgent medical review.',
      'Application domain': 'Healthcare / Medical Decision Support',
      'Provider / Deployer role': 'Depends on setup — often provider of a medical decision-support tool',
      'Intended users': 'Patients / end users, and potentially clinicians',
      'Affected persons': 'Patients / individuals whose health data is analysed',
      'Decision impact': 'May influence health-seeking behaviour and follow-up decisions',
      'Human involvement': 'Intended to support, not replace, a qualified healthcare professional',
    },
    riskNotes: [
      'Potential overlap with medical device regulation (MDR)',
      'Risk of misinterpretation of results by users',
      'Transparency of limitations to users',
      'Data quality and reference-range validity',
      'Clinical validation evidence required',
    ],
    classification: {
      level: 'Potential high-risk — requires careful assessment',
      legalBasis:
        'Potential high-risk / medical decision support. May intersect with medical device regulation. Requires combined legal and regulatory assessment.',
      reasoning:
        'AI used in a health context that informs follow-up decisions can be high-risk and may also fall under medical device rules. The exact classification depends on the intended medical purpose and the degree of reliance placed on the output.',
      confidence: 'Medium — needs legal + regulatory review',
      uncertainty:
        'Whether the tool qualifies as a medical device, the stated intended purpose, and the degree of clinical influence all materially change the classification and applicable obligations.',
      clarifying: [
        'Is the intended purpose a defined medical purpose?',
        'Does the output diagnose, or only inform follow-up?',
        'Is there clinical validation evidence?',
        'Is a qualified professional always in the loop?',
        'Does it qualify as a medical device under MDR?',
      ],
    },
  },
};

// ─── Step 2: intake questionnaire (HR scenario) ───────────────────────────────
export const QUESTIONNAIRE = [
  { q: 'Is the system used in employment, recruitment or worker management?', a: 'Yes', tone: 'flag' },
  { q: 'Does it rank, filter or evaluate candidates?', a: 'Yes', tone: 'flag' },
  { q: 'Can the output influence access to employment?', a: 'Yes', tone: 'flag' },
  { q: 'Is there human review?', a: 'Yes, but the process is not fully documented', tone: 'warn' },
  { q: 'Are candidates informed about AI use?', a: 'Partially / unclear', tone: 'warn' },
  { q: 'Is bias testing documented?', a: 'No evidence provided', tone: 'gap' },
  { q: 'Are logs retained?', a: 'Partially', tone: 'warn' },
  { q: 'Is there a complaint / appeal process?', a: 'Missing', tone: 'gap' },
];

// ─── Step 3: evidence review ──────────────────────────────────────────────────
export const EVIDENCE = {
  found: [
    { name: 'Vendor product description', status: 'demo' },
    { name: 'HR workflow description', status: 'demo' },
    { name: 'Draft AI use policy', status: 'partial' },
    { name: 'Basic recruiter review process', status: 'partial' },
    { name: 'Candidate scoring description', status: 'demo' },
  ],
  missing: [
    { name: 'Bias testing documentation', status: 'missing' },
    { name: 'Dataset documentation', status: 'missing' },
    { name: 'Human oversight procedure', status: 'missing' },
    { name: 'Candidate transparency notice', status: 'missing' },
    { name: 'Logging and audit trail policy', status: 'missing' },
    { name: 'Post-market monitoring process', status: 'missing' },
    { name: 'Vendor responsibility matrix', status: 'missing' },
    { name: 'Fundamental rights impact assessment (if applicable)', status: 'planned' },
  ],
};

// ─── Step 4b: obligations map ─────────────────────────────────────────────────
export const OBLIGATIONS = [
  { article: 'Article 9 — Risk management', applicability: 'Applies', evidence: 'Partial', risk: 'High' },
  { article: 'Article 10 — Data governance', applicability: 'Applies', evidence: 'Missing', risk: 'High' },
  { article: 'Article 11 — Technical documentation', applicability: 'Applies', evidence: 'Partial', risk: 'Medium/High' },
  { article: 'Article 12 — Record-keeping', applicability: 'Applies', evidence: 'Partial', risk: 'Medium' },
  { article: 'Article 13 — Transparency & instructions', applicability: 'Applies', evidence: 'Partial', risk: 'High' },
  { article: 'Article 14 — Human oversight', applicability: 'Applies', evidence: 'Undocumented', risk: 'High' },
  { article: 'Article 15 — Accuracy, robustness & cybersecurity', applicability: 'Applies', evidence: 'Missing', risk: 'High' },
  { article: 'Deployer obligations', applicability: 'Applies', evidence: 'Partial', risk: 'High' },
  { article: 'Transparency to affected persons', applicability: 'Applies', evidence: 'Missing', risk: 'High' },
  { article: 'Fundamental rights impact assessment', applicability: 'Context-dependent', evidence: 'Not assessed', risk: 'Medium' },
];

// ─── Step 5: gap matrix ───────────────────────────────────────────────────────
export const GAP_MATRIX = [
  {
    article: 'Article 9 — Risk Management',
    expected: 'Risk management file, foreseeable misuse analysis, mitigation measures, monitoring procedure',
    found: 'Partial HR workflow description',
    gap: 'No documented lifecycle risk management process',
    risk: 'High',
    remediation: 'Create AI risk management file and define periodic review process',
    owner: 'Compliance / Product',
    status: 'Open',
  },
  {
    article: 'Article 10 — Data Governance',
    expected: 'Dataset documentation, representativeness assessment, bias testing, data quality controls',
    found: 'No evidence',
    gap: 'No documented bias or data quality assessment',
    risk: 'High',
    remediation: 'Request vendor dataset documentation and bias testing summary',
    owner: 'Vendor / Compliance',
    status: 'Open',
  },
  {
    article: 'Article 11 — Technical Documentation',
    expected: 'System description, model logic, intended purpose, performance, limitations',
    found: 'Vendor product description only',
    gap: 'Insufficient technical documentation',
    risk: 'Medium/High',
    remediation: 'Request technical documentation package from vendor',
    owner: 'Vendor Management',
    status: 'Open',
  },
  {
    article: 'Article 12 — Record-keeping',
    expected: 'Logs of inputs, outputs, recommendations, user actions, overrides',
    found: 'Partial logging statement',
    gap: 'No clear audit trail and retention policy',
    risk: 'Medium',
    remediation: 'Define logging and retention requirements',
    owner: 'Engineering / Security',
    status: 'Open',
  },
  {
    article: 'Article 13 — Transparency',
    expected: 'Instructions for use, limitations, user-facing notices, recruiter guidance',
    found: 'Partial internal guidance',
    gap: 'No candidate-facing AI notice',
    risk: 'High',
    remediation: 'Prepare candidate transparency notice and recruiter instructions',
    owner: 'Legal / HR',
    status: 'Open',
  },
  {
    article: 'Article 14 — Human Oversight',
    expected: 'Human review procedure, override process, escalation rules, training',
    found: 'Human review claimed but undocumented',
    gap: 'No documented oversight process',
    risk: 'High',
    remediation: 'Document recruiter review and override procedure',
    owner: 'HR / Legal',
    status: 'Open',
  },
  {
    article: 'Article 15 — Accuracy, Robustness & Cybersecurity',
    expected: 'Accuracy testing, robustness testing, security controls, incident handling',
    found: 'No evidence',
    gap: 'No documented performance / security validation',
    risk: 'High',
    remediation: 'Request vendor validation and security evidence',
    owner: 'Security / Vendor Management',
    status: 'Open',
  },
];

// ─── Step 6: remediation roadmap tasks ────────────────────────────────────────
export const TASKS = [
  { n: 1, title: 'Create AI system record', priority: 'Critical', owner: 'Compliance' },
  { n: 2, title: 'Confirm provider / deployer role', priority: 'Critical', owner: 'Legal' },
  { n: 3, title: 'Request vendor technical documentation', priority: 'High', owner: 'Vendor Management' },
  { n: 4, title: 'Request bias testing and data governance evidence', priority: 'High', owner: 'Vendor Management' },
  { n: 5, title: 'Draft candidate AI transparency notice', priority: 'High', owner: 'Legal' },
  { n: 6, title: 'Define human oversight and override procedure', priority: 'High', owner: 'HR' },
  { n: 7, title: 'Define logging and audit trail requirements', priority: 'Medium', owner: 'Security' },
  { n: 8, title: 'Prepare risk management file', priority: 'High', owner: 'Compliance' },
  { n: 9, title: 'Prepare management summary', priority: 'Medium', owner: 'Product' },
  { n: 10, title: 'Schedule human legal / compliance review', priority: 'Critical', owner: 'Legal' },
];

// ─── Step 7: report preview ───────────────────────────────────────────────────
export const REPORT = {
  title: 'Normfold — AI Act Readiness Report',
  subtitle: 'HR Candidate Screening Assistant · Synthetic sample assessment',
  sections: [
    {
      h: '1. Executive summary',
      body: 'The HR Candidate Screening Assistant is assessed as HIGH-RISK under the EU AI Act (Annex III — employment). Core obligations apply across Articles 9–15 plus deployer and transparency duties. Significant documentation gaps exist, particularly around bias testing, human oversight, transparency to candidates and technical documentation. A remediation roadmap of 10 prioritised actions has been generated. Final legal classification and risk acceptance remain human-led.',
    },
    {
      h: '2. AI system overview',
      body: 'An AI system that screens job applications, ranks candidates and recommends shortlists for human recruiter review. Deployed by the company using a third-party tool in a professional recruitment process.',
    },
    {
      h: '3. Intended purpose and use context',
      body: 'Analyses CVs and application data to produce candidate scores and shortlist recommendations. Final hiring decisions remain with recruiters, but AI output may materially influence who is invited to interview. Affected persons: job applicants.',
    },
    {
      h: '4. AI Act risk classification',
      body: 'Classification: HIGH-RISK. Confidence: High. Classification is preliminary and subject to human legal confirmation.',
    },
    {
      h: '5. Legal basis and reasoning',
      body: 'EU AI Act Annex III — employment, worker management and access to self-employment. Recruitment/selection systems that filter applications and evaluate candidates fall within high-risk categories and may affect fundamental rights.',
    },
    {
      h: '6. Applicable obligations',
      body: 'Articles 9–15 (risk management, data governance, technical documentation, record-keeping, transparency, human oversight, accuracy/robustness/security), plus deployer obligations, transparency to affected persons, and a possible fundamental rights impact assessment.',
    },
    {
      h: '7. Evidence reviewed',
      body: 'Found (partial): vendor product description, HR workflow description, draft AI use policy, recruiter review process, candidate scoring description. Missing: bias testing, dataset documentation, human oversight procedure, candidate transparency notice, logging/audit policy, post-market monitoring, vendor responsibility matrix.',
    },
    {
      h: '8. Key gaps',
      body: 'Highest-severity gaps: no documented bias/data governance (Art. 10), no documented human oversight (Art. 14), no candidate transparency notice (Art. 13), no accuracy/security validation (Art. 15), no lifecycle risk management file (Art. 9).',
    },
    {
      h: '9. Remediation roadmap',
      body: '10 prioritised tasks assigned across Legal, Compliance, HR, Product, Vendor Management and Security — from creating the AI system record and confirming the deployer role, to requesting vendor documentation and scheduling human legal review.',
    },
    {
      h: '10. Human review status',
      body: 'PENDING. This assessment is preliminary and software-supported. A qualified legal/compliance professional must confirm the classification, interpret context-specific obligations, and accept residual risk.',
    },
  ],
  disclaimer:
    'This report is a structured preliminary AI Act readiness assessment. It does not constitute legal advice and does not guarantee compliance. Final conclusions require review by qualified legal/compliance professionals.',
};

// ─── Step 8: architecture / future vision ─────────────────────────────────────
export const ARCHITECTURE = {
  workingNow: [
    'Web-based AI Act readiness workflow',
    'Structured AI system intake',
    'Risk classification flow',
    'Evidence & gap mapping',
    'Remediation task flow',
    'LLM-assisted reasoning (Mistral)',
    'Report generation & DOCX/PDF export',
  ],
  partial: [
    'Backend persistence at scale',
    'Document extraction from uploads',
    'Read-only GitHub connector (needs token/config)',
    'Automated evidence collection',
  ],
  planned: [
    'SDK',
    'Public API',
    'Document repository connector',
    'Model registry connector',
    'GRC integrations',
    'Continuous monitoring',
    'CI/CD compliance checks',
  ],
};

// ─── Commercial positioning (used in Overview + Report) ───────────────────────
export const COMMERCIAL = {
  sellNow: [
    'AI system inventory entry',
    'AI Act risk classification',
    'Applicable obligations map',
    'Evidence checklist',
    'Gap assessment',
    'Remediation roadmap',
    'Management-ready report',
  ],
  humanReview: [
    'Final legal classification',
    'Legal interpretation',
    'Risk acceptance',
    'Customer-specific remediation decisions',
    'Regulatory advice',
  ],
  doNotPromise: [
    'Guaranteed compliance',
    'Full legal advice without review',
    'Automated certification',
    'Replacement of lawyers / compliance teams',
    'Fully live SDK / plugins (not yet shipped)',
  ],
};

// ─── Steps (drives the sidebar, progress bar and Next/Prev) ───────────────────
export const STEPS = [
  { key: 'overview', nav: 'Overview', title: 'From system to evidence.', subtitle: 'A guided look at the Normfold assessment workflow' },
  { key: 'system', nav: 'AI System', title: 'AI System Intake', subtitle: 'Capture the facts needed to classify the system' },
  { key: 'intake', nav: 'Intake', title: 'Intake Questionnaire', subtitle: 'Turn vague descriptions into legally relevant facts' },
  { key: 'evidence', nav: 'Evidence', title: 'Evidence Review', subtitle: 'What documentation exists vs what is missing' },
  { key: 'assessment', nav: 'Assessment', title: 'AI Act Risk Classification & Obligations', subtitle: 'Preliminary classification with legal basis' },
  { key: 'gaps', nav: 'Gap Matrix', title: 'Gap Matrix', subtitle: 'Requirement vs evidence vs risk vs remediation' },
  { key: 'tasks', nav: 'Tasks', title: 'Remediation Roadmap', subtitle: 'Prioritised, owner-assigned action plan' },
  { key: 'report', nav: 'Report', title: 'Report Preview', subtitle: 'Management-ready readiness report' },
  { key: 'future', nav: 'Future Architecture', title: 'A workflow with room to grow.', subtitle: 'Prototype modules, partial capabilities and the roadmap' },
];

// ─── Presenter notes per step ─────────────────────────────────────────────────
export const PRESENTER_NOTES = {
  overview: {
    shows: 'The product one-liner, the problem it solves, and honest status of every capability.',
    why: 'Sets expectations: this is a readiness assessment tool, not automated legal compliance.',
    say: 'Normfold turns messy AI system information into an AI Act risk classification, obligations map, gap assessment, remediation roadmap and a management-ready report.',
    dontClaim: 'Do not say it guarantees compliance or replaces lawyers.',
    question: 'Is this legal advice?',
    answer: 'No. It is a structured preliminary readiness assessment that supports legal and compliance teams. Final review is human-led.',
  },
  system: {
    shows: 'Structured intake of the AI system: purpose, users, affected persons, decision impact, human involvement.',
    why: 'You cannot classify AI Act risk from a product name — you need the facts.',
    say: 'Here we collect structured facts about the AI system, its intended purpose, users, affected persons and decision impact.',
    dontClaim: 'Do not imply the classification is automatic from the name alone.',
    question: 'Where does this data come from in real life?',
    answer: 'From a guided intake form, questionnaires, and uploaded documents — captured once and reused across the assessment.',
  },
  intake: {
    shows: 'A short questionnaire whose answers map directly to AI Act triggers.',
    why: 'It converts vague product descriptions into legally relevant, testable facts.',
    say: 'The questionnaire turns vague product descriptions into legally relevant facts for classification.',
    dontClaim: 'Do not claim these answers are verified — they are declared and later evidenced.',
    question: 'What if the customer answers incorrectly?',
    answer: 'Answers are cross-checked against evidence in the next step, and the final review is human-led.',
  },
  evidence: {
    shows: 'A checklist of expected documentation with clear Found / Partial / Missing status.',
    why: 'AI Act readiness is evidence-based, not just questionnaire-based.',
    say: 'The system does not only ask questions; it checks what documentation exists and what is missing.',
    dontClaim: 'Do not claim we auto-collect all evidence today — some connectors are planned.',
    question: 'Can it pull evidence automatically?',
    answer: 'A read-only GitHub connector exists; broader automated collection is on the roadmap. Today, evidence is uploaded or linked.',
  },
  assessment: {
    shows: 'The preliminary risk classification with legal basis, confidence, uncertainty, clarifying questions, and the applicable obligations map.',
    why: 'This is the core value: a defensible, explained classification — not a black box.',
    say: 'This is a structured preliminary classification with a clear legal basis and the obligations that follow from it.',
    dontClaim: 'Do not present this as final legal advice.',
    question: 'How accurate is the classification?',
    answer: 'High-confidence for clear Annex III cases, with explicit uncertainty and clarifying questions. A human confirms the final classification.',
  },
  gaps: {
    shows: 'A gap matrix mapping each obligation to expected evidence, what was found, the gap, risk and remediation.',
    why: 'It converts the law into a concrete, prioritised to-do list.',
    say: 'Every obligation becomes a row: what is expected, what we found, the gap, the risk, and the recommended fix with an owner.',
    dontClaim: 'Do not claim closing these gaps equals certified compliance.',
    question: 'Who decides the remediation?',
    answer: 'We propose remediation; the customer’s legal/compliance team decides and accepts residual risk.',
  },
  tasks: {
    shows: 'A prioritised remediation roadmap with owners and priorities.',
    why: 'It makes the assessment actionable across the whole team, not just compliance.',
    say: 'The gaps become a prioritised roadmap with owners across Legal, HR, Product, Vendor Management and Security.',
    dontClaim: 'Do not claim tasks auto-resolve — they are worked by the team.',
    question: 'Does this integrate with our tools?',
    answer: 'Tasks live in-product today; GRC/ticketing integrations are planned.',
  },
  report: {
    shows: 'A clean, management-ready readiness report with a clear disclaimer.',
    why: 'It is the deliverable a customer shows leadership, auditors or vendors.',
    say: 'Everything comes together in a management-ready report — classification, obligations, evidence, gaps, roadmap and human-review status.',
    dontClaim: 'Do not claim the report is a legal certificate.',
    question: 'Can we export and share it?',
    answer: 'Yes — the full product exports DOCX/PDF. This preview shows the structure with demo data.',
  },
  future: {
    shows: 'An honest map of what is live now, partially implemented, and planned.',
    why: 'It shows the vision (API/SDK/connectors) without overpromising.',
    say: 'The web app is the first customer-facing layer; the same analysis engine becomes an API, SDK and connector pipeline over time.',
    dontClaim: 'Do not present SDK/API/connectors as live unless the code proves it.',
    question: 'When is the API/SDK available?',
    answer: 'It is on the roadmap. Today the value is delivered through the web workflow; the engine is designed to be exposed as an API/SDK later.',
  },
};

// ─── Animation content (used by the scripted reveal engine) ───────────────────

// Assessment step: the simulated analysis sequence shown before the result.
// This is a DEMO simulation of the analysis flow — labelled as demo reasoning.
export const ASSESSMENT_ANALYSIS = [
  'Checking Article 5 — prohibited uses',
  'Checking Article 6 — high-risk classification',
  'Checking Annex III categories',
  'Checking provider / deployer role',
  'Checking human oversight & decision impact',
  'Mapping applicable obligations',
];

// Caption shown while the Evidence step "collects" its items.
export const EVIDENCE_COLLECTING = 'Revealing the sample evidence review…';

// Per-step completion caption shown once a step finishes animating.
export const STEP_STATUS = {
  overview: 'Product positioning loaded',
  system: 'System profile completed',
  intake: 'Legally relevant facts extracted',
  evidence: 'Sample evidence review complete — gaps illustrated',
  assessment: 'Preliminary classification ready — human review required',
  gaps: '7 obligations mapped — 6 material gaps detected',
  tasks: 'Sample remediation roadmap ready',
  report: 'Report compiled — demo preview',
  future: 'Web workflow first. API, SDK and broader connectors on the roadmap.',
};

// Fields treated as "short" → light typewriter; everything else fades in.
export const TYPEWRITER_FIELDS = ['System name', 'Application domain'];

// ─── Narration scripts (browser Web Speech API + subtitles) ───────────────────
// Concise, presenter-style. Spoken once per step; also shown as subtitles.
export const NARRATION = {
  overview:
    'Normfold helps companies prepare for the EU AI Act. It turns AI system information, questionnaires and evidence into a risk classification, obligations map, gap assessment, remediation roadmap and management-ready report. This is a readiness workflow, not automated legal advice.',
  system:
    'First, we capture the AI system profile. The product needs more than a product name. It collects the intended purpose, users, affected persons, decision impact and human involvement so the assessment is based on legally relevant facts.',
  intake:
    'The intake questionnaire turns a vague product description into structured facts. Here, the system confirms that the AI is used in recruitment, ranks candidates and may influence access to employment.',
  evidence:
    'Next, the product reviews available evidence. It separates what is found, what is partial and what is missing. This matters because AI Act readiness is not just a checklist. It requires documentation and evidence.',
  assessment:
    'The assessment checks prohibited use cases, high-risk categories and the company’s role. For this HR candidate screening system, the preliminary result is high-risk, because AI used for recruitment and candidate evaluation falls within Annex the third.',
  gaps:
    'The gap matrix maps legal requirements to evidence. For each obligation, the product shows expected evidence, what was found, what is missing, the risk level and the recommended remediation.',
  tasks:
    'The product then turns gaps into practical tasks. This creates a remediation roadmap with owners, priorities and links to the relevant AI Act obligations.',
  report:
    'Finally, the system generates a management-ready report. It includes the system overview, classification, reasoning, obligations, evidence reviewed, key gaps, remediation roadmap and a disclaimer that final review remains human-led.',
  future:
    'Today, the product is a web-based AI Act readiness workflow. The same analysis engine can later become an API, SDK and connector-based pipeline for GitHub, document repositories, model registries and GRC systems.',
};

// ─── Central timing (Slow defaults). All tunable in one place. ────────────────
// A global speed control multiplies every value: Slow ×1.0, Normal ×0.7, Fast ×0.45.
export const TIMING = {
  REVEAL_MS: 800,          // short field / generic per-item reveal
  LONG_TEXT_HOLD_MS: 1400, // per-item reveal for long-text items
  EVIDENCE_MS: 1200,       // evidence item reveal
  ASSESSMENT_LINE_MS: 1300,// assessment analysis line reveal
  GAP_ROW_MS: 1500,        // gap matrix row reveal
  TASK_ROW_MS: 1200,       // task reveal
  REPORT_SECTION_MS: 1600, // report section reveal
  STEP_HOLD_MS: 3500,      // pause after a step completes before auto-advancing
  LONG_STEP_HOLD_MS: 5000, // longer hold for text-heavy steps (assessment, report)
};

export const SPEED_MULT = { slow: 1.0, normal: 0.7, fast: 0.45 };
export const VOICE_RATE = { slow: 0.85, normal: 1.0, fast: 1.15 };

// Per-step base reveal speed (ms), before the global speed multiplier.
export const STEP_REVEAL_MS = {
  overview: TIMING.REVEAL_MS,
  system: TIMING.LONG_TEXT_HOLD_MS,
  intake: TIMING.REVEAL_MS,
  evidence: TIMING.EVIDENCE_MS,
  assessment: TIMING.ASSESSMENT_LINE_MS,
  gaps: TIMING.GAP_ROW_MS,
  tasks: TIMING.TASK_ROW_MS,
  report: TIMING.REPORT_SECTION_MS,
  future: TIMING.REVEAL_MS,
};

// Steps that get the longer post-completion hold.
export const LONG_HOLD_STEPS = ['assessment', 'report'];
