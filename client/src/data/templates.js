// Imme starter templates. Each template is a ready-made README split into sections.
// Replace YOUR_USERNAME / YOUR NAME etc. inside the editor after picking a template.

const md = (...lines) => lines.join('\n')

const developerClassic = [
  {
    key: 'title',
    title: 'Title',
    content: md(
      '# Hey, I\'m YOUR NAME :)'
    ),
  },
  {
    key: 'text-animation',
    title: 'Text Animation',
    content: md(
      '[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=009FF7&width=435&height=40&lines=Your+Role+One;Your+Role+Two;Your+Role+Three;Always+Learning;)](https://git.io/typing-svg)'
    ),
  },
  {
    key: 'summary',
    title: 'Summary',
    content: md(
      'I\'m a student / developer. I like to work with React, Node.js, Express and MongoDB. I love designing clean UIs. I\'m aiming to become a YOUR DREAM ROLE.<br>'
    ),
  },
  {
    key: 'social-media',
    title: 'Social Media',
    content: md(
      '[![Github](https://img.shields.io/github/followers/YOUR_USERNAME?label=Follow&style=social)](https://github.com/YOUR_USERNAME)',
      '![](https://komarev.com/ghpvc/?username=YOUR_USERNAME&color=green)',
      '[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_USERNAME)',
      '<a href="https://instagram.com/YOUR_USERNAME/" target="_blank"><img src="https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white" /></a> [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://youtube.com/@YOUR_CHANNEL) [![email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:you@example.com)'
    ),
  },
  {
    key: 'quick-facts',
    title: 'Quick Facts',
    content: md(
      '<h2>⚡️ A Few Quick Facts</h2>',
      '',
      '💻 Interested in YOUR INTEREST<br>🐍 Intermediate level in YOUR LANGUAGE<br>🧠 Built YOUR PROJECT<br>🥽 Currently working on YOUR CURRENT PROJECT<br>🔧 Love coding and solving real-world problems<br>📚 Continuously learning new technologies'
    ),
  },
  {
    key: 'tech-stack',
    title: 'Tech Stack',
    content: md(
      '# 💻 Tech Stack:',
      '### Design',
      '[![My Skills](https://skillicons.dev/icons?i=ps,figma&theme=light)](https://skillicons.dev)',
      '',
      '### Front-End Development',
      '[![My Skills](https://skillicons.dev/icons?i=html,css,tailwind,js,react&theme=light)](https://skillicons.dev)',
      '',
      '### Back-End Development',
      '[![My Skills](https://skillicons.dev/icons?i=nodejs,express&theme=light)](https://skillicons.dev)',
      '',
      '### Databases',
      '[![My Skills](https://skillicons.dev/icons?i=mongodb,supabase&theme=light)](https://skillicons.dev)',
      '',
      '### Tooling',
      '[![My Skills](https://skillicons.dev/icons?i=firebase,vscode,github,git,npm,postman&theme=light)](https://skillicons.dev)',
      '',
      '### Deployments',
      '[![My Skills](https://skillicons.dev/icons?i=vercel,netlify&theme=light)](https://skillicons.dev)'
    ),
  },
  {
    key: 'github-stats',
    title: 'GitHub Stats',
    content: md(
      '# 📊 GitHub Stats:',
      '',
      '<div align="center">',
      '',
      '<img src="https://github-readme-stats.shion.dev/api?username=YOUR_USERNAME&theme=transparent&hide_border=false&include_all_commits=false&count_private=false" />',
      '<br/>',
      '',
      '<img src="https://streak-stats.demolab.com/?user=YOUR_USERNAME&theme=transparent&hide_border=false" />',
      '<br/>',
      '',
      '<img src="https://github-readme-stats.shion.dev/api/top-langs/?username=YOUR_USERNAME&theme=transparent&hide_border=false&include_all_commits=false&count_private=false&layout=compact" />',
      '',
      '</div>',
      '',
      '---',
      '',
      '![GitHub Snake Light](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/github-snake.svg#gh-light-mode-only)',
      '![GitHub Snake Dark](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/github-snake-dark.svg#gh-dark-mode-only)'
    ),
  },
  {
    key: 'thanks',
    title: 'Thanks Note',
    content: md(
      '<div align="center">',
      '',
      '**Thanks for visiting! Let\'s build something amazing together! 🚀**',
      '',
      '</div>'
    ),
  },
]

const projectShowcase = [
  {
    key: 'title',
    title: 'Title',
    content: md(
      '<div align="center">',
      '',
      '# YOUR NAME',
      '',
      '**Your title · What you do · Your city, country**',
      '',
      '</div>'
    ),
  },
  {
    key: 'text-animation',
    title: 'Text Animation',
    content: md(
      '<div align="center">',
      '  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&duration=3000&pause=1000&color=D7A84B&center=true&vCenter=true&width=620&lines=Your+headline+one.;Your+headline+two.;Problem+%E2%86%92+Product+%E2%86%92+Working+MVP.;What+you+build+most." alt="Typing SVG" />',
      '</div>'
    ),
  },
  {
    key: 'social-media',
    title: 'Social Media',
    content: md(
      '<div align="center">',
      '',
      '[![Website](https://img.shields.io/badge/yourwebsite.com-D7A84B?style=for-the-badge&logo=google-chrome&logoColor=black)](https://yourwebsite.com)',
      '[![Twitter](https://img.shields.io/badge/X-%40YOUR_HANDLE-111111?style=for-the-badge&logo=x&logoColor=white)](https://x.com/YOUR_HANDLE)',
      '[![LinkedIn](https://img.shields.io/badge/LinkedIn-Your_Name-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/YOUR_USERNAME)',
      '[![Telegram](https://img.shields.io/badge/Telegram-%40YOUR_HANDLE-229ED9?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/YOUR_HANDLE)',
      '',
      '</div>'
    ),
  },
  {
    key: 'summary',
    title: 'Summary',
    content: md(
      '## Who I Am',
      '',
      'I\'m **Your Name**, founder of **[Your Studio / Brand](https://yourwebsite.com)** — write one line about what you do.',
      '',
      'I build focused products that solve real problems at the intersection of **TOPIC ONE, TOPIC TWO and TOPIC THREE**. My process is direct:',
      '',
      '> **Bring me the problem. I\'ll turn it into a product.**',
      '',
      'Write one more line about how you work.'
    ),
  },
  {
    key: 'what-i-build',
    title: 'What I Build',
    content: md(
      '## What I Build',
      '',
      '| Area | What it looks like |',
      '|---|---|',
      '| 🤖 **Area one** | Short example of what you build here |',
      '| ⛓️ **Area two** | Short example of what you build here |',
      '| ☀️ **Area three** | Short example of what you build here |',
      '| 🚀 **Area four** | Short example of what you build here |',
      '',
      '**My approach:**',
      '- Start with the real problem, not the technology',
      '- Build the smallest useful product',
      '- Your own principle here',
      '- Your own principle here'
    ),
  },
  {
    key: 'projects',
    title: 'Projects',
    content: md(
      '## Selected Work',
      '',
      '### 🤖 [Project One](https://github.com/YOUR_USERNAME/project-one) — Short tagline',
      'Two lines about what this project does and who it is for.',
      '',
      '`Next.js` `Node.js` `TypeScript`',
      '',
      '[![Live](https://img.shields.io/badge/LIVE-project--one.vercel.app-D7A84B?style=flat-square)](https://project-one.vercel.app)',
      '',
      '---',
      '',
      '### 🔍 [Project Two](https://github.com/YOUR_USERNAME/project-two) — Short tagline',
      'Two lines about what this project does and who it is for.',
      '',
      '`React` `Express` `MongoDB`',
      '',
      '[![Live](https://img.shields.io/badge/LIVE-project--two.vercel.app-78A9FF?style=flat-square)](https://project-two.vercel.app)',
      '',
      '---',
      '',
      '### ✍️ [Project Three](https://github.com/YOUR_USERNAME/project-three) — Short tagline',
      'Two lines about what this project does and who it is for.',
      '',
      '`Next.js` `OpenAI API`',
      '',
      '[![Live](https://img.shields.io/badge/LIVE-project--three.vercel.app-69C98B?style=flat-square)](https://project-three.vercel.app)',
      ''
    ),
  },
  {
    key: 'tech-stack',
    title: 'Tech Stack',
    content: md(
      '## Tech Stack',
      '',
      '<div align="center">',
      '',
      '![TypeScript](https://img.shields.io/badge/TypeScript-0a0a0b?style=for-the-badge&logo=typescript&logoColor=78A9FF)',
      '![Next.js](https://img.shields.io/badge/Next.js-0a0a0b?style=for-the-badge&logo=next.js&logoColor=white)',
      '![React](https://img.shields.io/badge/React-0a0a0b?style=for-the-badge&logo=react&logoColor=78A9FF)',
      '![Node.js](https://img.shields.io/badge/Node.js-0a0a0b?style=for-the-badge&logo=node.js&logoColor=69C98B)',
      '![Tailwind](https://img.shields.io/badge/Tailwind-0a0a0b?style=for-the-badge&logo=tailwindcss&logoColor=78A9FF)',
      '![MongoDB](https://img.shields.io/badge/MongoDB-0a0a0b?style=for-the-badge&logo=mongodb&logoColor=69C98B)',
      '![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0a0a0b?style=for-the-badge&logo=postgresql&logoColor=78A9FF)',
      '![Vercel](https://img.shields.io/badge/Vercel-0a0a0b?style=for-the-badge&logo=vercel&logoColor=white)',
      '',
      '</div>'
    ),
  },
  {
    key: 'github-stats',
    title: 'GitHub Stats',
    content: md(
      '## GitHub Stats',
      '',
      '<div align="center">',
      '  <img height="165" src="https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true&theme=dark&bg_color=0a0a0b&title_color=D7A84B&icon_color=78A9FF&text_color=a4a7ae&border_color=292c31&hide_border=false&count_private=true" />',
      '  <img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=YOUR_USERNAME&layout=compact&theme=dark&bg_color=0a0a0b&title_color=D7A84B&text_color=a4a7ae&border_color=292c31&hide_border=false" />',
      '</div>',
      '',
      '<div align="center">',
      '  <img src="https://github-readme-streak-stats.herokuapp.com?user=YOUR_USERNAME&theme=dark&background=0a0a0b&ring=D7A84B&fire=78A9FF&currStreakLabel=D7A84B&sideLabels=a4a7ae&dates=4B5380&border=292c31" />',
      '</div>',
      '',
      '<div align="center">',
      '  <img src="https://github-readme-activity-graph.vercel.app/graph?username=YOUR_USERNAME&bg_color=0a0a0b&color=D7A84B&line=78A9FF&point=ffffff&area=true&area_color=D7A84B&border_color=292c31" />',
      '</div>'
    ),
  },
  {
    key: 'footer',
    title: 'Footer',
    content: md(
      '<div align="center">',
      '  <strong>Your Name</strong><br/>',
      '  <sub>Your title · Your city, country</sub><br/>',
      '  <br/>',
      '  <sub>',
      '    <a href="https://yourwebsite.com">Website</a> ·',
      '    <a href="https://x.com/YOUR_HANDLE">X</a> ·',
      '    <a href="https://www.linkedin.com/in/YOUR_USERNAME">LinkedIn</a> ·',
      '    <a href="mailto:you@example.com">Email</a>',
      '  </sub>',
      '  <br/><br/>',
      '  <sub><em>Your closing line here.</em></sub>',
      '</div>'
    ),
  },
]

const make = (id, name, sections) => ({ id, name, sections, keys: sections.map((s) => s.key) })

export const TEMPLATES = [
  make('developer-classic', 'Developer Classic', developerClassic),
  make('project-showcase', 'Project Showcase', projectShowcase),
]
