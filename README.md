<div align="center">

# ✨ **Pooja's Portfolio**

#### *Computer Science Teacher & Developer*

[![Deployed on Vercel](https://img.shields.io/badge/DEPLOYED%20ON-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://my-portfolio-chaudharypooja12s-projects.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/chaudharypooja12/my_portfolio?style=for-the-badge&color=8b5cf6)](https://github.com/chaudharypooja12/my_portfolio)
[![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

---

A **cosmic galaxy-themed** personal portfolio built with Next.js, featuring animated starfields, glassmorphism UI, and a professional showcase of Computer Science teaching expertise.

**[Live Preview](https://my-portfolio-chaudharypooja12s-projects.vercel.app)**

</div>

---

## ✨ Highlights

<table>
<tr>
<td>

**Design**
- Cosmic galaxy dark theme
- Animated starfield canvas
- Glassmorphism UI components
- Animated gradient borders
- Custom cursor glow effect

</td>
<td>

**Features**
- Typewriter role animation
- Auto-scrolling project carousel
- Animated stats counters
- Scroll-reveal animations
- Active section navigation

</td>
<td>

**Tech**
- Next.js 16 + React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui
- Lucide icons

</td>
</tr>
</table>

---

## 🛠 Tech Stack

<div align="center">

| Category | Technology |
|:---:|:---|
| **Framework** | <img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" /> |
| **Language** | <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" /> |
| **UI Library** | <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" /> |
| **Styling** | <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwind-css&logoColor=white" /> |
| **Components** | <img src="https://img.shields.io/badge/shadcn/ui-4-000000" /> |
| **Icons** | <img src="https://img.shields.io/badge/Lucide-React-000000?logo=lucide" /> |
| **Deployment** | <img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white" /> |
| **Font** | <img src="https://img.shields.io/badge/Space_Grotesk-OUTFIT-8b5cf6" /> |

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** / **yarn** / **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/chaudharypooja12/my_portfolio.git

# Navigate to project
cd my_portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
my_portfolio/
├── src/
│   ├── app/
│   │   ├── api/contact/        # Contact form API endpoint
│   │   ├── layout.tsx          # Root layout with fonts & providers
│   │   ├── page.tsx            # Main page composing all sections
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── global-error.tsx    # Global error boundary
│   │   └── globals.css         # Design system & animations
│   │
│   ├── components/
│   │   ├── layout/             # Navigation, Footer, Starfield, Nebula
│   │   ├── portfolio/          # Carousel, Stats, Typewriter
│   │   ├── sections/           # Section headers
│   │   └── ui/                 # shadcn/ui components
│   │
│   └── modules/
│       ├── home/               # Hero section
│       ├── about/              # About section
│       ├── experience/         # Experience timeline
│       ├── skills/             # Skills grid
│       ├── education/          # Education timeline
│       ├── projects/           # Projects carousel
│       ├── certificates/       # Certificates section
│       └── achievements/       # Achievements highlight
│
├── public/
│   └── images/                 # Static images
│
├── memory-bank/                # Project documentation
├── package.json
├── tsconfig.json
├── next.config.ts
└── vercel.json
```

---

## 👩‍🏫 Portfolio Sections

| Section | Description |
|:---|:---|
| **Hero** | Profile image, typewriter animation, CTA buttons, cosmic background |
| **Stats** | Animated counters for experience, skills, degrees, projects |
| **About** | Professional summary, core strengths grid, education highlight |
| **Experience** | Teaching timeline with glowing dots and responsibility cards |
| **Skills** | Categorized skill bars with gradient progress indicators |
| **Education** | Academic timeline with degree cards |
| **Projects** | Auto-scrolling carousel with 4 project slides |
| **Certificates** | NSS Certificate & Data Analysis certification |
| **Achievements** | Dean's List recognition highlight |

---

## 🎨 Design System

<details>
<summary><b>Cosmic Color Palette</b></summary>

<br />

| Token | Usage | Color |
|:---|:---|:---|
| `--primary` | Main accent, buttons, links | <span style="color:#8b5cf6">■</span> Purple |
| `--accent` | Secondary accent, hover states | <span style="color:#06b6d4">■</span> Teal |
| `--nebula-1` | Gradient decorations | <span style="color:#7c3aed">■</span> Violet |
| `--nebula-2` | Gradient decorations | <span style="color:#ec4899">■</span> Pink |
| `--nebula-3` | Gradient decorations | <span style="color:#14b8a6">■</span> Teal |
| `--success` | Status indicators | <span style="color:#10b981">■</span> Green |
| `--background` | Deep space background | <span style="color:#0a0618">■</span> Dark |

</details>

<details>
<summary><b>Animation Catalog</b></summary>

<br />

| Animation | Element | Duration |
|:---|:---|:---|
| `starfield` | Canvas star particles | Infinite |
| `shootingStar` | Diagonal streaks | Random |
| `nebulaDrift` | Background nebula blobs | 20-30s |
| `aurora` | Color wave overlay | 15-20s |
| `float` | Gradient orbs | 6-12s |
| `spin-slow` | Profile ring | 20s |
| `typewriter` | Role text | 80ms/char |
| `slideUp` | Scroll reveals | 0.6s |
| `pulseGlow` | Achievement card | 4s |
| `rotateGradient` | Border animation | 8s |

</details>

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
# Contact Form Email Service
EMAIL_SERVICE_API_KEY=your_api_key
EMAIL_FROM=your-email@example.com
EMAIL_TO=poojachaudhary0912@gmail.com
```

> **Note:** Never commit `.env` files. `.env.example` is provided as a template.

---

## 🛫 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Configure environment variables
4. Deploy

### Manual

```bash
npm run build
npm run start
```

---

## 👩‍🎓 About Pooja

- **Degree:** M.Sc. Computer Science — Maharshi Dayanand University, Rohtak
- **Experience:** CS Teacher at GD Goenka Public School, Jhajjar (2023-2024)
- **Skills:** Python, C, C++, SQL, HTML, MS Office, Visual Basic
- **Focus:** Computer Science Education & Software Development

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Made with ♥ by Pooja**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chaudharypooja12)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>
