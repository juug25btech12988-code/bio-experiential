# DNA Computing: Exploring DNA-Based Data Storage and Information Processing

An interactive educational web application exploring how DNA can be used as a medium for computing and digital data storage.

> **Group 1 — CSE Cybersecurity**

---

## 🧬 About

This project is an Experiential Learning submission that explores the cutting-edge concept of **DNA-based computing** — encoding binary data as nucleotide sequences (A, T, G, C) and simulating core operations like encoding, complementary strand generation, GC-content analysis, and sequence lookup.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 (Vite) |
| Routing | React Router DOM v7 |
| Animations | Framer Motion |
| Charting | Recharts |
| Styling | Tailwind CSS v3 |
| Testing | Vitest + Testing Library |
| Package manager | pnpm |

---

## 🚀 Quick Start

```bash
cd "dna-computing-website"
npm install
npm run dev
```

*(Or using `pnpm`)*:
```bash
pnpm install
pnpm dev
```

The app will be available at **http://localhost:5173**

To run unit tests:
```bash
npm test
```

---

## 🗺 Routes

| Path | Page | Description |
|---|---|---|
| `/` | Landing Page | Introduction, helix animation, base primer, encoding pipeline |
| `/simulator` | DNA Simulator | Interactive encoder/decoder, sequence visualiser, GC-content chart |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx            — Navigation bar
│   ├── Footer.jsx            — Footer with team info
│   ├── DoubleHelix.jsx       — Animated SVG double helix
│   ├── NucleotideParticles.jsx — Floating A/T/G/C particle background
│   ├── HelixDivider.jsx      — Decorative animated section divider
│   ├── ScrollProgress.jsx    — Helix-style scroll progress bar
│   ├── PipelineStep.jsx      — Encoding pipeline step card
│   ├── BaseCard.jsx          — Nucleotide base information card
│   └── HelixBuilder.jsx      — Simulator helix builder animation
├── pages/
│   ├── LandingPage.jsx       — Home / landing page
│   └── SimulatorPage.jsx     — Interactive DNA simulator
├── lib/
│   ├── dnaCodec.js           — DNA encoding/decoding logic
│   └── dnaCodec.test.js      — Unit tests for the codec
├── App.jsx                   — Root app with router
├── main.jsx                  — Vite entry point
└── index.css                 — Global styles + Tailwind
```

---

## 👥 Team

**Group 1 — CSE Cybersecurity**  
- Adith Arya (`25BTRCC059`)
- Alby Thomas (`25BTRCC008`)
- Ananthu M K (`25BTRCC010`)
- Ansaff E C (`25BTRCC012`)
- Sabaresh V S B (`25BTRCC046`)
- Seyaan Ahmed T S (`25BTRCC049`)  

---

## 📄 License

For academic / educational use only.
