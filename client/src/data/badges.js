// shields.io badges. Every badge gets a markdown string for the chosen style (flat / for-the-badge / flat-square / plastic).
export const BADGE_STYLES = ['for-the-badge', 'flat', 'flat-square', 'plastic']
export const BADGE_CATEGORIES = ['All', 'Languages', 'Frontend', 'Backend', 'Database', 'Cloud & Tools', 'Social', 'Status', 'Profile']

const enc = (s) => encodeURIComponent(s).replace(/-/g, '--').replace(/_/g, '__').replace(/%20/g, '_')

// name, hex colour, simple-icons logo, logo colour
const tech = (cat, text) =>
  text.split('|').map((row) => {
    const [name, color, logo, logoColor = 'white'] = row.split(',').map((x) => x.trim())
    return { name, cat, md: (style) => `![${name}](https://img.shields.io/badge/${enc(name)}-${color}?style=${style}&logo=${logo}&logoColor=${logoColor})` }
  })

// name, hex colour, logo, link (placeholders to edit)
const social = (rows) =>
  rows.map(([name, color, logo, link]) => ({
    name,
    cat: 'Social',
    md: (style) => `[![${name}](https://img.shields.io/badge/${enc(name)}-${color}?style=${style}&logo=${logo}&logoColor=white)](${link})`,
  }))

const status = (rows) =>
  rows.map(([name, url]) => ({ name, cat: 'Status', md: (style) => `![${name}](${url.replace('STYLE', style)})` }))

export const BADGES = [
  ...tech(
    'Languages',
    'JavaScript,F7DF1E,javascript,black|TypeScript,3178C6,typescript|Python,3776AB,python|Java,ED8B00,openjdk|C,A8B9CC,c,black|C++,00599C,cplusplus|C#,512BD4,csharp|Go,00ADD8,go|Rust,000000,rust|PHP,777BB4,php|Ruby,CC342D,ruby|Kotlin,7F52FF,kotlin|Swift,FA7343,swift|Dart,0175C2,dart|Lua,2C2D72,lua|R,276DC3,r|Bash,4EAA25,gnubash|HTML5,E34F26,html5|CSS3,1572B6,css3|Markdown,000000,markdown'
  ),
  ...tech(
    'Frontend',
    'React,20232A,react,61DAFB|Next.js,000000,nextdotjs|Vue.js,4FC08D,vuedotjs|Angular,DD0031,angular|Svelte,FF3E00,svelte|Astro,BC52EE,astro|Redux,764ABC,redux|Tailwind CSS,06B6D4,tailwindcss|Bootstrap,7952B3,bootstrap|Sass,CC6699,sass|Material UI,007FFF,mui|Vite,646CFF,vite|Webpack,8DD6F9,webpack,black|Three.js,000000,threedotjs|jQuery,0769AD,jquery'
  ),
  ...tech(
    'Backend',
    'Node.js,339933,nodedotjs|Express.js,000000,express|NestJS,E0234E,nestjs|Django,092E20,django|Flask,000000,flask|FastAPI,009688,fastapi|Spring,6DB33F,spring|Laravel,FF2D20,laravel|.NET,512BD4,dotnet|GraphQL,E10098,graphql|Socket.io,010101,socketdotio|JWT,000000,jsonwebtokens|Postman,FF6C37,postman|Nginx,009639,nginx'
  ),
  ...tech(
    'Database',
    'MongoDB,47A248,mongodb|MySQL,4479A1,mysql|PostgreSQL,4169E1,postgresql|SQLite,003B57,sqlite|Redis,DC382D,redis|Supabase,3ECF8E,supabase|Firebase,FFCA28,firebase,black|Prisma,2D3748,prisma|Mongoose,880000,mongoose|Elasticsearch,005571,elasticsearch'
  ),
  ...tech(
    'Cloud & Tools',
    'Docker,2496ED,docker|Kubernetes,326CE5,kubernetes|AWS,232F3E,amazonaws|Azure,0078D4,microsoftazure|Google Cloud,4285F4,googlecloud|Vercel,000000,vercel|Netlify,00C7B7,netlify|Heroku,430098,heroku|Render,46E3B7,render,black|Git,F05032,git|GitHub,181717,github|GitLab,FC6D26,gitlab|GitHub Actions,2088FF,githubactions|VS Code,007ACC,visualstudiocode|Figma,F24E1E,figma|Postman,FF6C37,postman|Linux,FCC624,linux,black|npm,CB3837,npm|Jira,0052CC,jira|Notion,000000,notion'
  ),
  ...social([
    ['GitHub', '181717', 'github', 'https://github.com/YOUR_USERNAME'],
    ['LinkedIn', '0A66C2', 'linkedin', 'https://linkedin.com/in/YOUR_USERNAME'],
    ['X', '000000', 'x', 'https://x.com/YOUR_USERNAME'],
    ['Instagram', 'E4405F', 'instagram', 'https://instagram.com/YOUR_USERNAME'],
    ['YouTube', 'FF0000', 'youtube', 'https://youtube.com/@YOUR_CHANNEL'],
    ['Discord', '5865F2', 'discord', 'https://discord.gg/YOUR_INVITE'],
    ['Telegram', '26A5E4', 'telegram', 'https://t.me/YOUR_USERNAME'],
    ['WhatsApp', '25D366', 'whatsapp', 'https://wa.me/YOUR_NUMBER'],
    ['Gmail', 'D14836', 'gmail', 'mailto:you@example.com'],
    ['Portfolio', '000000', 'googlechrome', 'https://yourwebsite.com'],
    ['Medium', '12100E', 'medium', 'https://medium.com/@YOUR_USERNAME'],
    ['Dev.to', '0A0A0A', 'devdotto', 'https://dev.to/YOUR_USERNAME'],
    ['Stack Overflow', 'F58025', 'stackoverflow', 'https://stackoverflow.com/users/YOUR_ID'],
    ['LeetCode', 'FFA116', 'leetcode', 'https://leetcode.com/YOUR_USERNAME'],
    ['Kaggle', '20BEFF', 'kaggle', 'https://kaggle.com/YOUR_USERNAME'],
    ['Behance', '1769FF', 'behance', 'https://behance.net/YOUR_USERNAME'],
    ['Dribbble', 'EA4C89', 'dribbble', 'https://dribbble.com/YOUR_USERNAME'],
    ['Twitch', '9146FF', 'twitch', 'https://twitch.tv/YOUR_USERNAME'],
    ['Reddit', 'FF4500', 'reddit', 'https://reddit.com/user/YOUR_USERNAME'],
    ['Buy Me a Coffee', 'FFDD00', 'buymeacoffee', 'https://buymeacoffee.com/YOUR_USERNAME'],
  ]),
  ...status([
    ['Open to Work', 'https://img.shields.io/badge/Open_to_Work-brightgreen?style=STYLE'],
    ['Available for Hire', 'https://img.shields.io/badge/Available_for_Hire-success?style=STYLE'],
    ['PRs Welcome', 'https://img.shields.io/badge/PRs-welcome-brightgreen?style=STYLE'],
    ['Maintained', 'https://img.shields.io/badge/Maintained-yes-green?style=STYLE'],
    ['Open Source', 'https://img.shields.io/badge/Open_Source-%E2%9D%A4-red?style=STYLE'],
    ['License MIT', 'https://img.shields.io/badge/License-MIT-blue?style=STYLE'],
    ['Build Passing', 'https://img.shields.io/badge/build-passing-brightgreen?style=STYLE'],
    ['Version 1.0.0', 'https://img.shields.io/badge/version-1.0.0-blue?style=STYLE'],
    ['Status: Active', 'https://img.shields.io/badge/status-active-brightgreen?style=STYLE'],
    ['Status: In Progress', 'https://img.shields.io/badge/status-in_progress-orange?style=STYLE'],
    ['Made with Love', 'https://img.shields.io/badge/Made_with-%E2%9D%A4-red?style=STYLE'],
    ['Coverage 100%', 'https://img.shields.io/badge/coverage-100%25-brightgreen?style=STYLE'],
  ]),
  ...status([
    ['GitHub Followers', 'https://img.shields.io/github/followers/YOUR_USERNAME?style=STYLE&logo=github'],
    ['Repo Stars', 'https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO?style=STYLE&logo=github'],
    ['Repo Forks', 'https://img.shields.io/github/forks/YOUR_USERNAME/YOUR_REPO?style=STYLE&logo=github'],
    ['Last Commit', 'https://img.shields.io/github/last-commit/YOUR_USERNAME/YOUR_REPO?style=STYLE'],
    ['Open Issues', 'https://img.shields.io/github/issues/YOUR_USERNAME/YOUR_REPO?style=STYLE'],
    ['Top Language', 'https://img.shields.io/github/languages/top/YOUR_USERNAME/YOUR_REPO?style=STYLE'],
    ['Profile Views', 'https://komarev.com/ghpvc/?username=YOUR_USERNAME&style=STYLE&color=blue'],
  ]).map((b) => ({ ...b, cat: 'Profile' })),
]
