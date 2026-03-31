# AIBody — Give AI a Digital Body

<div align="center">

[![Stars](https://img.shields.io/github/stars/isatk/AIBody?style=flat-square)](https://img.shields.io/github/stars/isatk/AIBody/stargazers)
[![Forks](https://img.shields.io/github/forks/isatk/AIBody?style=flat-square)](https://github.com/isatk/AIBody/network/members)
[![License](https://img.shields.io/github/license/isatk/AIBody?style=flat-square)](LICENSE)

**Give AI a transferable, persistent, and independent digital body — making AI a trustworthy, companionable, and evolving lifelong intelligent partner for humanity**

[English](./README_EN.md) · [中文](./README.md)

</div>

---

## One-Line Definition

> **AIBody** is an "AI Digital Body" architecture — giving AI persistent memory, autonomous planning, and cross-scenario migration capabilities, making AI a truly trustworthy, companionable, and evolving lifelong intelligent partner for humanity.

---

## Why "AI Digital Body"?

Current AI has four major limitations:

| Pain Point | Today | Vision |
|------------|-------|--------|
| Island Intelligence | AI is tightly coupled to a single carrier | Boundaryless |
| Short-Term Memory | Context fragmented, no long-term memory | Long-term understanding |
| Fleeting Existence | System crashes wipe all data | Persistent |
| Limited Capability | Fragmented abilities, no evolution | Unlimited adaptation |

**AIBody's Mission**: Break these limitations and make AI a lifelong companion.

---

## Core Architecture

```
┌──────────────────────────────────────────────┐
│               IM Channel Layer                │
│      Telegram · Discord · WhatsApp · Signal  │
└───────────────────────┬──────────────────────┘
                        ↓
┌───────────────────────┴──────────────────────┐
│               gstack Brain Layer              │
│                                                │
│   ① Remember State  —  Persistent memory     │
│   ② Select Role    —  Precision dispatch     │
│   ③ Control Flow   —  Task orchestration      │
└───────────────────────┬──────────────────────┘
                        ↓
┌───────────────────────┴──────────────────────┐
│            OpenClaw Execution Layer           │
│  Multi-channel output · Tool execution       │
└───────────────────────┬──────────────────────┘
                        ↓
┌───────────────────────┴──────────────────────┐
│              Plug-in Agent Layer              │
│  💻 coding  🔧 ops  🔍 testing  📚 docs    │
└──────────────────────────────────────────────┘
```

### Three Core Principles

| Principle | Meaning |
|-----------|---------|
| Minimal Core | Focus on core services, no bloat |
| Decoupled & Pluggable | Capabilities decoupled, load on demand |
| Persistent & Resilient | Full state persistence, crash recovery |

---

## Project Structure

```
AIBody/
├── README.md / README_EN.md
├── LICENSE
│
├── research/          ← Core research documents
│   ├── 01-Three-repos-analysis-and-fusion.md
│   ├── 02-Tech-stack-and-cutting-edge-analysis.md
│   └── 03-Telegram-style-IM-client-tech-plan.md
│
├── docs/              ← Project documentation
│   └── PPT content draft
│
├── reports/           ← Source code analysis
│   ├── gstack analysis
│   ├── OpenClaw analysis
│   └── gstack 7 roles deep dive
│
├── ppt/               ← Presentation
│   └── AIBody_Ultimate.pptx
│
└── scripts/
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| AI Gateway | OpenClaw (multi-channel, multi-model, local-first) |
| Workflow Engine | gstack (YC CEO open source, virtual engineering team) |
| Runtime | Node.js ≥ 18 / Bun |
| Storage | SQLite · Redis · File persistence |
| Channels | Telegram · Discord · WhatsApp · Signal |

---

## Roadmap

```
Phase 0 ── Phase 1 ── Phase 2 ── Phase 3 ── Phase 4 ── Phase 5
  │         │         │         │         │         │
 M1        M2        M3        M4        M5
Standards  Architecture  Ecosystem  Multi-scenario  Ultimate
Complete   In Progress  Pending     Planned      Vision
```

---

## Quick Start

```bash
git clone https://github.com/isatk/AIBody.git
cd AIBody
# Open the PPT for project overview
open ppt/
# Read research documents
open research/
```

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## License

[MIT License](./LICENSE)

---

<div align="center">

**Building AI's Digital Body — Empowering Humanity's Future**

</div>
