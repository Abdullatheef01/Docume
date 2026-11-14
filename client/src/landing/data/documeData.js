export const HERO_DEFAULT_MARKDOWN = `# Docume CLI

Generate clean, structured GitHub READMEs directly from your repository tree in seconds.

## Features
- Automatic stack & script detection from package.json
- Live split-pane GitHub Flavored Markdown preview
- One-click export to README.md or clipboard

## Quick Start
\`\`\`bash
npx docume-cli init
\`\`\`

## Environment
| Variable | Description | Required |
| :--- | :--- | :--- |
| \`GITHUB_TOKEN\` | Private repo access | Optional |
| \`DOCUME_THEME\` | Output badge style | Optional |`;
export const REPO_PRESETS = [
  {
    id: "cli",
    label: "Open Source CLI",
    repoUrl: "https://github.com/abdul/docume-cli",
    markdown: HERO_DEFAULT_MARKDOWN
  },
  {
    id: "saas",
    label: "Full-Stack SaaS",
    repoUrl: "https://github.com/abdul/pulseboard-app",
    markdown: `# Pulseboard

Lightweight analytics workspace for modern React and Node.js teams.

## Highlights
- Real-time event ingestion with sub-50ms query latency
- Role-based team workspaces and shareable snapshots
- Zero-config Docker deployment

## Installation
\`\`\`bash
git clone https://github.com/abdul/pulseboard-app.git
npm install && npm run dev
\`\`\`

## Tech Stack
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, MongoDB`
  },
  {
    id: "profile",
    label: "Developer Profile",
    repoUrl: "https://github.com/abdul",
    markdown: `# Hi, I'm Abdul \u{1F44B}

Full-stack developer building fast developer tools and clean web interfaces.

## Currently Working On
- **Docume** \u2014 Instant README generator for repos and profiles
- Exploring AI-assisted developer workflows

## Core Stack
- TypeScript \xB7 React \xB7 Node.js \xB7 Express \xB7 MongoDB

## Connect
- Portfolio: docume.co.in
- GitHub: @abdul`
  },
  {
    id: "api",
    label: "API & SDK Docs",
    repoUrl: "https://github.com/abdul/mailkit-sdk",
    markdown: `# Mailkit SDK

Typed transactional email client with built-in retry queues and webhook verification.

## Usage
\`\`\`ts
import { Mailkit } from 'mailkit-sdk';

const client = new Mailkit(process.env.MAILKIT_KEY);
await client.send({
  to: 'team@docume.co.in',
  subject: 'Welcome aboard',
  template: 'onboarding'
});
\`\`\`

## Endpoints
- \`POST /v1/send\` \u2014 Dispatch single or batch emails
- \`GET /v1/events\` \u2014 Stream delivery telemetry`
  }
];
export function generateReadmeFromPrompt(input) {
  const trimmed = input.trim();
  if (!trimmed) return HERO_DEFAULT_MARKDOWN;
  const isUrl = trimmed.includes("github.com/") || trimmed.startsWith("http");
  let projectName = "My Project";
  if (isUrl) {
    const clean = trimmed.replace(/\/+$/, "");
    const parts = clean.split("/");
    const last = parts[parts.length - 1] || "project";
    projectName = last.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  } else {
    const words = trimmed.split(/\s+/).slice(0, 4).join(" ");
    projectName = words.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return `# ${projectName}

${isUrl ? `Automatically documented from \`${trimmed}\`.` : trimmed}

## Overview
- Clean architecture built for fast onboarding and clear maintainability
- Ready-to-run local development setup with minimal configuration
- Structured documentation generated with Docume

## Installation
\`\`\`bash
${isUrl ? `git clone ${trimmed}.git` : "git clone https://github.com/username/project.git"}
npm install
npm run dev
\`\`\`

## Project Structure
- \`src/\` \u2014 Application source modules and components
- \`package.json\` \u2014 Scripts, dependencies, and build targets`;
}
export const FAQ_ITEMS = [
  {
    question: "Is it free?",
    answer: "Yes. You can generate repository READMEs with Repome and GitHub profile READMEs with Imme for free after signing in with Google or GitHub, with no credit card required."
  },
  {
    question: "Is my data safe?",
    answer: "Yes. For public repositories, Docume only reads publicly available repository metadata and file structure to draft your documentation. Your drafts are stored securely in your account so you can revisit them anytime."
  },
  {
    question: "Which AI is used?",
    answer: "Docume is powered by Google Gemini models tuned for code comprehension and technical writing, turning raw directory trees, package manifests, and project prompts into accurate Markdown."
  },
  {
    question: "What are the usage limits?",
    answer: "Each free account gets 6 AI README generations and 15 magic wand edits every 5 hours. Live editing, preview, copy and download are not limited."
  }
];
