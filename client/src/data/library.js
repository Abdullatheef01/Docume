import { uid } from '../utils/markdown.js'

const md = (...lines) => lines.join('\n')

/* ------------------------------------------------------------------ */
/*  REPOME  (repository README sections)                               */
/* ------------------------------------------------------------------ */
const repome = [
  {
    key: 'title-description',
    title: 'Title and Description',
    content: md(
      '# Project Title',
      '',
      "A brief description of what this project does and who it's for"
    ),
  },
  {
    key: 'acknowledgements',
    title: 'Acknowledgements',
    content: md(
      '## Acknowledgements',
      '',
      ' - [Awesome README](https://github.com/matiassingers/awesome-readme)',
      ' - [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md#travel--places)'
    ),
  },
  {
    key: 'api-reference',
    title: 'API Reference',
    content: md(
      '## API Reference',
      '',
      '#### Get all items',
      '',
      '```http',
      '  GET /api/items',
      '```',
      '',
      '| Parameter | Type     | Description                |',
      '| :-------- | :------- | :------------------------- |',
      '| `api_key` | `string` | **Required**. Your API key |',
      '',
      '#### Get item',
      '',
      '```http',
      '  GET /api/items/${id}',
      '```',
      '',
      '| Parameter | Type     | Description                       |',
      '| :-------- | :------- | :-------------------------------- |',
      '| `id`      | `string` | **Required**. Id of item to fetch |'
    ),
  },
  {
    key: 'appendix',
    title: 'Appendix',
    content: md('## Appendix', '', 'Any additional information goes here'),
  },
  {
    key: 'authors',
    title: 'Authors',
    content: md('## Authors', '', '- [@your-username](https://github.com/your-username)'),
  },
  {
    key: 'badges',
    title: 'Badges',
    content: md(
      '## Badges',
      '',
      '![MIT License](https://img.shields.io/badge/License-MIT-green.svg)',
      '![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)'
    ),
  },
  {
    key: 'color-reference',
    title: 'Color Reference',
    content: md(
      '## Color Reference',
      '',
      '| Color             | Hex                                                                |',
      '| ----------------- | ------------------------------------------------------------------ |',
      '| Example Color | ![#0a192f](https://via.placeholder.com/10/0a192f?text=+) #0a192f |',
      '| Example Color | ![#f8f8f8](https://via.placeholder.com/10/f8f8f8?text=+) #f8f8f8 |'
    ),
  },
  {
    key: 'contributing',
    title: 'Contributing',
    content: md(
      '## Contributing',
      '',
      'Contributions are always welcome!',
      '',
      '1. Fork the repository',
      '2. Create a feature branch',
      '3. Commit your changes and open a pull request'
    ),
  },
  {
    key: 'demo',
    title: 'Demo',
    content: md('## Demo', '', 'Insert gif or link to demo'),
  },
  {
    key: 'deployment',
    title: 'Deployment',
    content: md('## Deployment', '', 'To deploy this project run', '', '```bash', '  npm run deploy', '```'),
  },
  {
    key: 'env',
    title: 'Environment Variables',
    content: md(
      '## Environment Variables',
      '',
      'To run this project, you will need to add the following environment variables to your .env file',
      '',
      '`API_KEY`',
      '',
      '`MONGO_URI`'
    ),
  },
  {
    key: 'faq',
    title: 'FAQ',
    content: md('## FAQ', '', '#### Question 1', '', 'Answer 1', '', '#### Question 2', '', 'Answer 2'),
  },
  {
    key: 'features',
    title: 'Features',
    content: md('## Features', '', '- Light/dark mode toggle', '- Live previews', '- Fullscreen mode', '- Cross platform'),
  },
  {
    key: 'feedback',
    title: 'Feedback',
    content: md('## Feedback', '', 'If you have any feedback, please reach out to us at you@example.com'),
  },
  {
    key: 'installation',
    title: 'Installation',
    content: md(
      '## Installation',
      '',
      'Install my-project with npm',
      '',
      '```bash',
      '  npm install my-project',
      '  cd my-project',
      '```'
    ),
  },
  {
    key: 'license',
    title: 'License',
    content: md('## License', '', '[MIT](https://choosealicense.com/licenses/mit/)'),
  },
  {
    key: 'lessons',
    title: 'Lessons Learned',
    content: md(
      '## Lessons Learned',
      '',
      'What did you learn while building this project? What challenges did you face and how did you overcome them?'
    ),
  },
  {
    key: 'roadmap',
    title: 'Roadmap',
    content: md('## Roadmap', '', '- Additional browser support', '- Add more integrations'),
  },
  {
    key: 'running-tests',
    title: 'Running Tests',
    content: md('## Running Tests', '', 'To run tests, run the following command', '', '```bash', '  npm run test', '```'),
  },
  {
    key: 'screenshots',
    title: 'Screenshots',
    content: md('## Screenshots', '', '![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)'),
  },
  {
    key: 'support',
    title: 'Support',
    content: md('## Support', '', 'For support, email you@example.com or open an issue.'),
  },
  {
    key: 'tech-stack',
    title: 'Tech Stack',
    content: md(
      '## Tech Stack',
      '',
      '**Client:** React, Redux, TailwindCSS',
      '',
      '**Server:** Node, Express, MongoDB'
    ),
  },
  {
    key: 'usage',
    title: 'Usage/Examples',
    content: md(
      '## Usage/Examples',
      '',
      '```javascript',
      "import Component from 'my-project'",
      '',
      'function App() {',
      '  return <Component />',
      '}',
      '```'
    ),
  },
]

/* ------------------------------------------------------------------ */
/*  IMME  (GitHub profile README sections)                             */
/* ------------------------------------------------------------------ */
const imme = [
  {
    key: 'title',
    title: 'Title',
    content: md(
      '<h1 align="center">Hi 👋, I\'m Your Name</h1>',
      '<h3 align="center">A passionate Full Stack Developer</h3>'
    ),
  },
  {
    key: 'text-animation',
    title: 'Text Animation',
    content: md(
      '<p align="center">',
      '  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&center=true&vCenter=true&width=520&lines=Full+Stack+Developer;MERN+Stack+Enthusiast;Always+Learning+and+Building" alt="Typing animation" />',
      '</p>'
    ),
  },
  {
    key: 'summary',
    title: 'Summary',
    content: md(
      '## 👨‍💻 About Me',
      '',
      'I am a developer who loves building useful products. Write two or three lines about yourself, what you build and what you are aiming for.'
    ),
  },
  {
    key: 'social-media',
    title: 'Social Media',
    content: md(
      '## 🌐 Connect with me',
      '',
      '<p>',
      '  <a href="https://github.com/YOUR_USERNAME"><img src="https://skillicons.dev/icons?i=github" width="40" alt="GitHub" /></a>',
      '  <a href="https://linkedin.com/in/YOUR_USERNAME"><img src="https://skillicons.dev/icons?i=linkedin" width="40" alt="LinkedIn" /></a>',
      '  <a href="https://twitter.com/YOUR_USERNAME"><img src="https://skillicons.dev/icons?i=twitter" width="40" alt="Twitter" /></a>',
      '  <a href="https://instagram.com/YOUR_USERNAME"><img src="https://skillicons.dev/icons?i=instagram" width="40" alt="Instagram" /></a>',
      '</p>'
    ),
  },
  {
    key: 'quick-facts',
    title: 'Quick Facts',
    content: md(
      '## ⚡ Quick Facts',
      '',
      '- 🔭 I’m currently working on **Project Name**',
      '- 🌱 I’m currently learning **Something New**',
      '- 👯 I’m looking to collaborate on **Open Source**',
      '- 💬 Ask me about **React, Node.js, MongoDB**',
      '- 📫 How to reach me: **you@example.com**'
    ),
  },
  {
    key: 'tech-stack',
    title: 'Tech Stack',
    content: md(
      '## 🛠️ Tech Stack',
      '',
      '**Frontend**',
      '',
      '<p><img src="https://skillicons.dev/icons?i=html,css,js,react,tailwind" alt="Frontend stack" /></p>',
      '',
      '**Backend**',
      '',
      '<p><img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" alt="Backend stack" /></p>',
      '',
      '**Tools**',
      '',
      '<p><img src="https://skillicons.dev/icons?i=git,github,vscode,figma" alt="Tools" /></p>'
    ),
  },
  {
    key: 'github-stats',
    title: 'GitHub Stats',
    content: md(
      '## 📊 GitHub Stats',
      '',
      '<p align="center">',
      '  <img src="https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true&theme=dark&hide_border=true" alt="GitHub stats" />',
      '  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=YOUR_USERNAME&layout=compact&theme=dark&hide_border=true" alt="Top languages" />',
      '</p>',
      '',
      '<p align="center">',
      '  <img src="https://streak-stats.demolab.com?user=YOUR_USERNAME&theme=dark&hide_border=true" alt="GitHub streak" />',
      '</p>'
    ),
  },
  {
    key: 'projects',
    title: 'Projects',
    content: md(
      '## 🚀 Featured Projects',
      '',
      '- [**Project One**](https://github.com/YOUR_USERNAME/project-one) - short description',
      '- [**Project Two**](https://github.com/YOUR_USERNAME/project-two) - short description',
      '- [**Project Three**](https://github.com/YOUR_USERNAME/project-three) - short description'
    ),
  },
  {
    key: 'achievements',
    title: 'Achievements',
    content: md(
      '## 🏆 Achievements',
      '',
      '- Add a certification, hackathon or award',
      '- Add another highlight'
    ),
  },
  {
    key: 'contact',
    title: 'Contact',
    content: md('## 📫 Contact', '', '- Email: you@example.com', '- LinkedIn: [your-username](https://linkedin.com/in/your-username)'),
  },
  {
    key: 'profile-views',
    title: 'Profile Views',
    content: md(
      '<p align="center">',
      '  <img src="https://komarev.com/ghpvc/?username=YOUR_USERNAME&color=blue&style=flat-square" alt="Profile views" />',
      '</p>'
    ),
  },
]

export const LIBRARY = { repome, imme }

export const findLib = (mode, key) => LIBRARY[mode].find((l) => l.key === key)

export const makeSection = (lib) => ({
  id: uid(),
  key: lib.key,
  title: lib.title,
  content: lib.content,
})

export const customSection = (name) => ({
  id: uid(),
  key: `custom-${uid()}`,
  title: name,
  content: `## ${name}\n\n`,
})

/* ------------------------------------------------------------------ */
/*  Imme templates (placeholders – to be replaced with the two sample  */
/*  READMEs the author will provide).                                   */
/* ------------------------------------------------------------------ */
export const TEMPLATES = [
  {
    id: 'developer-classic',
    name: 'Developer Classic',
    keys: ['title', 'text-animation', 'summary', 'social-media', 'quick-facts', 'tech-stack', 'github-stats'],
  },
  {
    id: 'minimal-profile',
    name: 'Minimal Profile',
    keys: ['title', 'summary', 'tech-stack', 'github-stats', 'contact'],
  },
]
