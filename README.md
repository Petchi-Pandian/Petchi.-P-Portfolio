# Petchi P — Power Platform Developer Portfolio

A complete, responsive, AI-enhanced personal portfolio website for **Petchi P**, Power Platform Developer at Veelead Solutions.

Built with semantic HTML5, custom Vanilla CSS design system (Obsidian Charcoal & Burnt Orange with editorial Ivory contrast), and modern vanilla JavaScript.

---

## 🌟 Key Highlights & Architecture

1. **AI-Enhanced Visual Identity**:
   - **Cinematic Hero Portrait**: Realistic editorial photography portrait based directly on Petchi P's authentic photographs, featuring warm amber edge rim lighting, tailored charcoal suit, and executive presence.
   - **Editorial About Portrait**: Warm, approachable studio portrait in light linen shirt with natural oak slats and warm cream lighting.
   - **Hero Background**: Enterprise technology environment with glowing orange and bronze light trails and holographic cloud nodes.
   - **Conceptual Project Visuals**: 3D glassmorphic visualizations for real projects (Performance Management, Purchase Order Approval Workflow, SPFx Modern Portals, Power BI Dashboard, Vendor & HR Hub, Help Desk Ticketing).
   - **Interactive Comparison Switcher**: Recruiter-friendly toggle that allows comparing the AI-enhanced portrait directly against the authentic reference photo.

2. **Verified Resume Data**:
   - All professional information, employment history at Veelead Solutions (3+ years), certifications (PL-900 & MS-900), key projects, and education (BCA - University of Madras, Diploma in Mechanical Engineering) are 100% verified from Petchi P's resume.
   - Client confidentiality preserved across all enterprise project descriptions.

3. **Downloadable Resume (PDF & DOCX)**:
   - Includes both the clean, executive A4 PDF resume and the original Word document in `assets/resume/`.
   - Accessible via the top navigation dropdown, hero section, and contact section.

4. **Interactive Features**:
   - Real-time active section scrollspy navigation
   - Mobile responsive drawer menu
   - Skill category filtering tabs (Power Platform, SharePoint, Web/SPFx, ALM)
   - Project category filtering
   - Reusable Project Detail Modal with problem, solution architecture, and verified technical contribution breakdown
   - One-click copy email to clipboard with animated toast notification
   - Interactive contact form with auto-formatted mailto link generator and feedback toast

---

## 📁 Directory Structure

```text
Portfolio/
├── index.html                   # Semantic HTML5 entry point
├── styles.css                   # Custom responsive CSS design system
├── script.js                    # Interactive UX, modal, filters, scrollspy
├── README.md                    # Documentation
└── assets/
    ├── images/                  # Hero, About, and source portraits
    │   ├── hero-portrait.jpg    # AI-enhanced cinematic portrait
    │   ├── about-portrait.jpg   # AI-enhanced editorial portrait
    │   ├── hero-tech-bg.jpg     # AI-enhanced ambient background
    │   ├── original-portrait-warm.jpg
    │   ├── original-developer-screen.jpg
    │   ├── original-workspace-desk.jpg
    │   └── original-portrait-outdoor.jpg
    ├── projects/                # Conceptual project illustrations
    │   ├── project-perf-mgmt.jpg
    │   ├── project-approval-flow.jpg
    │   ├── project-spfx-portal.jpg
    │   ├── project-powerbi-dash.svg
    │   ├── project-helpdesk.svg
    │   └── project-vendor-hr.svg
    ├── original/                # Original uploaded WhatsApp photos
    └── resume/                  # Downloadable resume files
        ├── Petchi_P_Power_Platform_Developer_Resume.pdf
        └── Petchi_P_Power_Platform_Developer_Resume.docx
```

---

## 🚀 How to Run Locally

Because the website uses standard web standards (HTML/CSS/JS), you can open it in any modern browser:

### Option 1: Using Python's built-in HTTP server
```bash
python -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.

### Option 2: Using Node.js `npx serve` or `live-server`
```bash
npx serve .
```

### Option 3: Double-click
Simply open `index.html` in Microsoft Edge, Google Chrome, Firefox, or Safari.

---

## 🌐 Deploying to the Web

### GitHub Pages (Free & 2 Minutes)
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, choose `main` / `root`, and click **Save**.
4. Your site will be live at `https://<your-username>.github.io/portfolio/`.

### Vercel / Netlify
- Drag and drop this folder directly into the Netlify Drop dashboard, or import the GitHub repository into Vercel with zero configuration required.

---

## 🎨 Color Tokens Reference

- **Primary Background**: `#090c13` (Deep Obsidian Charcoal)
- **Secondary Dark**: `#0e131d` (Dark Slate)
- **Accent Orange**: `#ea580c` / `#f97316` (Warm Burnt Orange)
- **Editorial Contrast (About Section)**: `#faf7f2` (Warm Sand / Ivory)
- **Primary Text**: `#ffffff` / `#cbd5e1` (Off-white & slate)
- **Ivory Section Text**: `#131720` (Rich Charcoal)

---

&copy; 2026 Petchi P. All rights reserved.
