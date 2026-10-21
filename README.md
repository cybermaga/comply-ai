# Normfold

**AI compliance. Grounded in evidence.**

Normfold is an AI readiness product built around a structured review: understand the system, organise its evidence, identify gaps and prepare the findings for a human reviewer.

- [Interactive guided demo](https://cybermaga.github.io/comply-ai/demo/)
- [Project page](https://cybermaga.github.io/comply-ai/)
- [Product site](https://comply-ai-demo.vercel.app)

The public demo uses **scripted data**. It demonstrates the assessment workflow and report structure; it does not run a live compliance assessment. The full product source and backend are private.

## Explore the workflow

1. **System profile** — purpose, users, affected people, deployment context and role in decisions.
2. **Structured intake** — the facts and assumptions relevant to the assessment.
3. **Evidence review** — available, partial and missing supporting material.
4. **Preliminary assessment** — classification, reasoning, uncertainty and obligations.
5. **Gap matrix** — requirements, evidence, gaps and proposed actions.
6. **Remediation roadmap** — priorities and owners.
7. **Report preview** — the structure of an assessment prepared for human review.

The demo includes HR and healthcare scenarios, manual and automatic presentation modes, optional browser narration and a report preview with a downloadable sample in Markdown. The shared evidence, gap and report examples are illustrated with the primary HR scenario where indicated in the interface.

## This repository

| Path | Contents |
|---|---|
| `demo/` | React + Vite source for the public, scripted guided demo. |
| `docs/index.html` | Static project page served through GitHub Pages. |
| `docs/demo/` | Built guided demo. |
| `docs/assets/` | Normfold identity and sharing assets. |
| `docs/brand.md` | Naming, visual system and migration notes. |
| `docs/img/` | Earlier interface images retained at their original URLs. |

### Run locally

```bash
cd demo
npm install
npm run dev
```

Create the static demo build:

```bash
cd demo
npm run build
```

The build writes to `docs/demo/`. Serve `docs/` with a local static server to view the portfolio and embedded demo together.

## Identity

The product is now **Normfold**, previously **Comply AI**. The existing repository name, GitHub Pages paths and Vercel hostname are intentionally retained so existing links continue to work. They are deployment addresses, not the current product name.

Normfold shares a visual language with [Code & Control](https://code-and-control.com) and Machine Authority, a research project by Marharet Babaieva. Machine Authority has no public project destination configured here. Each remains a distinct project; shared styling does not imply an integrated backend or a corporate parent relationship.

## Founder

[Marharet Babaieva](https://linkedin.com/in/magreat) — product direction, legal workflow design and AI-assisted development.

Normfold supports readiness review. It does not certify compliance. Final classification, legal interpretation and risk acceptance require a qualified human reviewer.
