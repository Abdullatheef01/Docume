// Sections the AI may write. "key" + "title" must stay the same as the frontend (src/data/library.js).
// "hint" tells the AI what that section should look like.

export const SECTIONS = {
  repome: {
    'title-description': { title: 'Title and Description', hint: 'Starts with "# Project Name", then 1-3 sentences: what the project does and who it is for.' },
    badges: { title: 'Badges', hint: 'A few shields.io badges (license, tech used). Only badges that are true for this project.' },
    features: { title: 'Features', hint: '"## Features" then a bullet list of real features taken from the facts.' },
    'tech-stack': { title: 'Tech Stack', hint: '"## Tech Stack" then lines like "**Client:** React, Tailwind" and "**Server:** Node, Express" (only what the facts show).' },
    installation: { title: 'Installation', hint: '"## Installation" with fenced bash code blocks (clone, install, run). Use the right commands for the detected stack.' },
    usage: { title: 'Usage/Examples', hint: '"## Usage/Examples" with a short realistic example or the main commands.' },
    env: { title: 'Environment Variables', hint: '"## Environment Variables" only if the facts show env files or variables.' },
    'running-tests': { title: 'Running Tests', hint: '"## Running Tests" only if the project has tests (test script / test folder).' },
    deployment: { title: 'Deployment', hint: '"## Deployment" only if there is deployment info (homepage, scripts, config files).' },
    'api-reference': { title: 'API Reference', hint: '"## API Reference" only if this is clearly an API project. Do not invent endpoints.' },
    roadmap: { title: 'Roadmap', hint: '"## Roadmap" with 2-4 sensible next steps.' },
    contributing: { title: 'Contributing', hint: '"## Contributing" with short fork / branch / pull request steps.' },
    license: { title: 'License', hint: '"## License" with the detected license, e.g. [MIT](https://choosealicense.com/licenses/mit/).' },
    authors: { title: 'Authors', hint: '"## Authors" with the owner as a GitHub link.' },
    acknowledgements: { title: 'Acknowledgements', hint: '"## Acknowledgements" only if the facts mention credits.' },
    faq: { title: 'FAQ', hint: '"## FAQ" with 2-3 useful questions.' },
    support: { title: 'Support', hint: '"## Support" with how to get help (issues page).' },
    feedback: { title: 'Feedback', hint: '"## Feedback" short line.' },
    appendix: { title: 'Appendix', hint: 'Extra notes.' },
    'color-reference': { title: 'Color Reference', hint: 'Only if the project clearly has a color palette.' },
    demo: { title: 'Demo', hint: 'Only if a demo / homepage link exists.' },
    lessons: { title: 'Lessons Learned', hint: 'Only if the author notes mention it.' },
    screenshots: { title: 'Screenshots', hint: 'Only if screenshots are mentioned.' },
  },

  imme: {
    title: { title: 'Title', hint: '<h1 align="center">Hi 👋, I\'m NAME</h1> then <h3 align="center">one short headline about the person</h3>.' },
    'text-animation': {
      title: 'Text Animation',
      hint:
        'A centered typing animation: <p align="center"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&center=true&vCenter=true&width=520&lines=LINE+ONE;LINE+TWO;LINE+THREE" alt="Typing animation" /></p>. 3 short lines (spaces written as +, lines separated by ;).',
    },
    summary: { title: 'Summary', hint: '"## 👨‍💻 About Me" then 2-4 sentences about who they are and what they build. Only facts from the data.' },
    'social-media': {
      title: 'Social Media',
      hint:
        '"## 🌐 Connect with me" then <p> with <a href="LINK"><img src="https://skillicons.dev/icons?i=ICON" width="40" alt="NAME" /></a> for each profile. Always the GitHub profile. Other networks (linkedin, twitter, instagram, youtube...) ONLY if a link is in the data or notes.',
    },
    'quick-facts': { title: 'Quick Facts', hint: '"## ⚡ Quick Facts" then emoji bullets (working on, learning, ask me about, location). Only facts from the data.' },
    'tech-stack': {
      title: 'Tech Stack',
      hint:
        '"## 🛠️ Tech Stack" then groups like **Frontend**, **Backend**, **Tools**, each followed by <p><img src="https://skillicons.dev/icons?i=ID,ID,ID" alt="..." /></p>. Use ONLY these icon ids: html,css,js,ts,react,nextjs,vue,angular,nodejs,express,mongodb,mysql,postgres,redis,firebase,python,java,cpp,c,cs,go,rust,php,kotlin,dart,flutter,django,flask,fastapi,laravel,spring,tailwind,bootstrap,sass,redux,graphql,vite,git,github,docker,aws,linux,figma,vscode,postman,vercel,netlify. Pick from languages / topics in the data.',
    },
    'github-stats': {
      title: 'GitHub Stats',
      hint:
        '"## 📊 GitHub Stats" then centered <p align="center"> with <img> tags: https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=dark&hide_border=true , https://github-readme-stats.vercel.app/api/top-langs/?username=USERNAME&layout=compact&theme=dark&hide_border=true and https://streak-stats.demolab.com?user=USERNAME&theme=dark&hide_border=true',
    },
    projects: { title: 'Projects', hint: '"## 🚀 Featured Projects" bullet list of the top repositories with their links from the data.' },
    achievements: { title: 'Achievements', hint: '"## 🏆 Achievements" only if the notes mention achievements.' },
    contact: { title: 'Contact', hint: '"## 📫 Contact" only with contact details that are in the data or notes.' },
    'profile-views': {
      title: 'Profile Views',
      hint: '<p align="center"><img src="https://komarev.com/ghpvc/?username=USERNAME&color=blue&style=flat-square" alt="Profile views" /></p>',
    },
  },
}

export const sectionKeys = (mode) => Object.keys(SECTIONS[mode])
export const sectionTitle = (mode, key) => SECTIONS[mode][key]?.title
