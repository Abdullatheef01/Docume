// skillicons.dev icons (github.com/tandpfun/skill-icons). "id:Name" – the id goes into  ?i=id1,id2
const group = (cat, text) =>
  text.split(',').map((p) => {
    const [id, name] = p.trim().split(':')
    return { id, name: name || id, cat }
  })

export const ICON_CATEGORIES = ['All', 'Languages', 'Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'AI & Data', 'Mobile & Game', 'Design', 'Tools', 'Social']

export const ICONS = [
  ...group(
    'Languages',
    'js:JavaScript,ts:TypeScript,py:Python,java:Java,c:C,cpp:C++,cs:C#,go:Go,rust:Rust,php:PHP,ruby:Ruby,kotlin:Kotlin,swift:Swift,dart:Dart,scala:Scala,lua:Lua,perl:Perl,r:R,haskell:Haskell,elixir:Elixir,clojure:Clojure,crystal:Crystal,nim:Nim,zig:Zig,v:V,ocaml:OCaml,fortran:Fortran,forth:Forth,bash:Bash,powershell:PowerShell,matlab:MATLAB,octave:Octave,solidity:Solidity,wasm:WebAssembly,coffeescript:CoffeeScript,haxe:Haxe,html:HTML,css:CSS,md:Markdown,latex:LaTeX,regex:Regex,svg:SVG,sass:Sass,less:Less,gherkin:Gherkin,pkl:Pkl,vala:Vala'
  ),
  ...group(
    'Frontend',
    'react:React,nextjs:Next.js,vue:Vue,nuxtjs:Nuxt,angular:Angular,svelte:Svelte,solidjs:Solid,astro:Astro,remix:Remix,gatsby:Gatsby,alpinejs:Alpine.js,lit:Lit,htmx:HTMX,jquery:jQuery,redux:Redux,pinia:Pinia,reactivex:ReactiveX,ember:Ember,tailwind:Tailwind,bootstrap:Bootstrap,materialui:Material UI,vuetify:Vuetify,styledcomponents:Styled Comp.,emotion:Emotion,windicss:WindiCSS,vite:Vite,webpack:Webpack,rollupjs:Rollup,babel:Babel,gulp:Gulp,threejs:Three.js,d3:D3,p5js:p5.js,processing:Processing,pug:Pug,yew:Yew,jest:Jest,vitest:Vitest,cypress:Cypress,selenium:Selenium'
  ),
  ...group(
    'Backend',
    'nodejs:Node.js,express:Express,nestjs:NestJS,deno:Deno,bun:Bun,elysia:Elysia,django:Django,flask:Flask,fastapi:FastAPI,spring:Spring,dotnet:.NET,laravel:Laravel,symfony:Symfony,rails:Rails,actix:Actix,rocket:Rocket,ktor:Ktor,adonis:Adonis,graphql:GraphQL,apollo:Apollo,prisma:Prisma,sequelize:Sequelize,hibernate:Hibernate,kafka:Kafka,rabbitmq:RabbitMQ,nginx:Nginx,maven:Maven,gradle:Gradle,npm:npm,yarn:Yarn,pnpm:pnpm,postman:Postman'
  ),
  ...group(
    'Database',
    'mongodb:MongoDB,mysql:MySQL,postgres:PostgreSQL,sqlite:SQLite,redis:Redis,supabase:Supabase,firebase:Firebase,dynamodb:DynamoDB,cassandra:Cassandra,elasticsearch:Elasticsearch,planetscale:PlanetScale,appwrite:Appwrite'
  ),
  ...group(
    'Cloud & DevOps',
    'docker:Docker,kubernetes:Kubernetes,aws:AWS,azure:Azure,gcp:Google Cloud,vercel:Vercel,netlify:Netlify,heroku:Heroku,cloudflare:Cloudflare,workers:CF Workers,terraform:Terraform,ansible:Ansible,jenkins:Jenkins,githubactions:GH Actions,gitlab:GitLab,bitbucket:Bitbucket,grafana:Grafana,prometheus:Prometheus,sentry:Sentry,openshift:OpenShift,openstack:OpenStack,replit:Replit'
  ),
  ...group('AI & Data', 'tensorflow:TensorFlow,pytorch:PyTorch,sklearn:scikit-learn,opencv:OpenCV,anaconda:Anaconda,aiscript:AiScript,ros:ROS'),
  ...group(
    'Mobile & Game',
    'flutter:Flutter,androidstudio:Android Studio,unity:Unity,unreal:Unreal,godot:Godot,blender:Blender,gamemakerstudio:GameMaker,bevy:Bevy,haxeflixel:HaxeFlixel,robloxstudio:Roblox Studio,electron:Electron,tauri:Tauri,qt:Qt,gtk:GTK,raspberrypi:Raspberry Pi,arduino:Arduino'
  ),
  ...group('Design', 'figma:Figma,ps:Photoshop,ai:Illustrator,ae:After Effects,pr:Premiere,au:Audition,xd:Adobe XD,autocad:AutoCAD,sketchup:SketchUp,webflow:Webflow,wordpress:WordPress'),
  ...group(
    'Tools',
    'git:Git,github:GitHub,vscode:VS Code,vscodium:VSCodium,visualstudio:Visual Studio,idea:IntelliJ,pycharm:PyCharm,webstorm:WebStorm,phpstorm:PhpStorm,clion:CLion,rider:Rider,eclipse:Eclipse,sublime:Sublime,atom:Atom,vim:Vim,neovim:Neovim,emacs:Emacs,cmake:CMake,notion:Notion,obsidian:Obsidian,codepen:CodePen,ableton:Ableton,linux:Linux,ubuntu:Ubuntu,debian:Debian,arch:Arch,kali:Kali,redhat:Red Hat,nix:Nix,mint:Mint,bsd:BSD,plan9:Plan 9,windows:Windows,apple:Apple'
  ),
  ...group(
    'Social',
    'linkedin:LinkedIn,twitter:Twitter / X,instagram:Instagram,discord:Discord,bots:Discord Bots,discordjs:Discord.js,gmail:Gmail,devto:Dev.to,stackoverflow:StackOverflow,mastodon:Mastodon,misskey:Misskey,fediverse:Fediverse,activitypub:ActivityPub,ipfs:IPFS'
  ),
]
