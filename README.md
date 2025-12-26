<div align="center">
  <h1 align="center">HARVESTER</h1>
  <h3>Data Archival & Visualization Protocol</h3>
  <p>System Protocol: 88-X // Version 1.0.0</p>
</div>

---

## // SYSTEM_OVERVIEW

**Harvester** is a specialized interface designed for the ingestion, visualization, and archival of social media streams (specifically Twitter/X). Built with a high-fidelity **brutalist/neumorphic aesthetic**, it prioritizes data density, readability, and user control.

The system operates as a local client for browsing archived JSON payloads, offering powerful filtering, visual processing, and export capabilities.

## // CORE_MODULES

- **VISUAL INGESTION**: Drag-and-drop or manual entry of JSON data streams.
- **DYNAMIC FILTERING**: Real-time segmentation (Media, High Engagement, Long-form).
- **ADAPTIVE UI**: Fully responsive light/dark modes with `framer-motion` transitions.
- **SCRAPER UTILITY**: Integrated generator for client-side scraping scripts.
- **MASONRY LAYOUT**: High-density grid with adjustable columns (1-6x).

## // TECH_STACK

- **Construct**: React 18 + TypeScript
- **Styling**: Tailwind CSS (Utility-first)
- **Motion**: Framer Motion (Animation logic)
- **Build**: Vite (High-performance tooling)

## // DEPLOYMENT_PROTOCOL

### 1. CLONE_SOURCE
```bash
git clone https://github.com/stoicfeats/harvester.git
cd harvester
```

### 2. INSTALL_DEPENDENCIES
```bash
npm install
```

### 3. INITIATE_SYSTEM
```bash
npm run dev
```

### 4. BUILD_DISTRIBUTION
```bash
npm run build
```

---

## // DATA_FORMAT

Harvester expects a standard JSON array of tweet objects. It includes a normalization layer to handle various archive formats (official Twitter archive, scraped data, etc.).

```json
[
  {
    "created_at": "Fri May 10 12:00:00 +0000 2024",
    "full_text": "Sample tweet content...",
    "user": { ... },
    "extended_entities": { ... }
  }
]
```

## // LICENSE

OPEN_SOURCE // MIT License
Made by [@stoicfeats](https://twitter.com/stoicfeats)
