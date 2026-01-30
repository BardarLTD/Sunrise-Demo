# Claude Bootstrap

A ready-to-use project template for building web applications with the help of AI.

## Why Use This Project?

This project is designed to make building software easier, especially if you're new to programming or working with AI assistants like Claude.

### No External Services Required

Everything runs on your computer. You don't need to set up databases, cloud accounts, or pay for external services to get started. Just download, install, and run.

### Built-in Guardrails

The project includes automatic checks that help prevent common mistakes:

- **Type checking** catches errors before you run your code
- **Code formatting** keeps everything consistent and readable
- **Linting** warns you about potential problems
- **Commit checks** ensure your saved changes follow best practices

These guardrails mean that even if you're learning, the tools will guide you toward writing better code.

---

## Required Skills

Before getting started, you should be comfortable with these basics. If any feel unfamiliar, the linked resources will help you brush up.

- **Using the Terminal** - You'll need to type commands to install tools and run the project. No advanced skills required, just the basics of opening Terminal, typing commands, and navigating folders.
  - [Terminal Basics for Mac](https://support.apple.com/guide/terminal/welcome/mac) - Apple's official guide
  - [Command Line Crash Course](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line) - MDN's beginner-friendly introduction

- **Basic File Navigation** - Understanding how folders work on your computer and how to find files. Commands like `cd` (change directory) and `ls` (list files) are helpful to know.
  - [Navigating Files and Directories](https://swcarpentry.github.io/shell-novice/02-filedir.html) - Software Carpentry tutorial

- **Text Editing** - You'll be reading and occasionally editing code files. Any text editor works, but [VS Code](https://code.visualstudio.com/) is popular and free.
  - [VS Code Getting Started](https://code.visualstudio.com/docs/getstarted/introvideos) - Video tutorials for beginners

- **Basic Git Concepts** (optional but helpful) - Git saves versions of your code. Claude can handle most Git operations for you, but understanding commits and branches helps.
  - [Git Handbook](https://docs.github.com/en/get-started/using-git/about-git) - GitHub's concise overview
  - [Learn Git Branching](https://learngitbranching.js.org/) - Interactive visual tutorial

Don't worry if you're not an expert in these areas. Claude Code can guide you through most tasks, and you'll learn as you go.

---

## Glossary

Here's what each technology in this project does and why it was chosen:

- **Node.js** - The engine that runs JavaScript on your computer (not just in a browser). Required to run this project.
  - [Node.js Documentation](https://nodejs.org/docs/latest/api/)

- **pnpm** - A tool that downloads and manages the code libraries this project depends on. Faster and more efficient than alternatives.
  - [pnpm Documentation](https://pnpm.io/)

- **Turborepo** - Organizes the project so the frontend and backend can live together but stay separate. Makes running both at once simple.
  - [Turborepo Documentation](https://turbo.build/repo/docs)

- **TypeScript** - A version of JavaScript that catches mistakes by checking your code before it runs. Like a spell-checker for code.
  - [TypeScript Documentation](https://www.typescriptlang.org/docs/)

- **Next.js** - A framework for building the part of the app users see (the frontend). Handles pages, navigation, and displaying data.
  - [Next.js Documentation](https://nextjs.org/docs)

- **React** - A library for building user interfaces. Next.js is built on top of React.
  - [React Documentation](https://react.dev/)

- **Express** - A simple framework for building the part of the app that handles data (the backend/API).
  - [Express Documentation](https://expressjs.com/)

- **TanStack Query** - Makes it easy for the frontend to fetch and display data from the backend.
  - [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)

- **shadcn/ui** - Pre-built, good-looking buttons, cards, and other interface components you can use right away.
  - [shadcn/ui Documentation](https://ui.shadcn.com/docs)

- **Tailwind CSS** - A way to style your app by adding class names directly to elements. No need to write separate style files.
  - [Tailwind CSS Documentation](https://tailwindcss.com/docs)

- **ESLint** - Checks your code for potential problems and enforces consistent style.
  - [ESLint Documentation](https://eslint.org/docs/latest/)

- **Prettier** - Automatically formats your code to look clean and consistent.
  - [Prettier Documentation](https://prettier.io/docs/en/)

- **Husky** - Runs checks automatically before you save changes to Git.
  - [Husky Documentation](https://typicode.github.io/husky/)

---

## Setting Up Your Mac

Before you can use this project, you'll need a few tools installed on your Mac.

### Step 1: Install Xcode Command Line Tools

These are basic development tools that many other tools depend on. Open the **Terminal** app (search for "Terminal" in Spotlight) and paste this command:

```bash
xcode-select --install
```

A popup will appear asking you to install. Click "Install" and wait for it to finish.

### Step 2: Install Homebrew

Homebrew is a tool that makes it easy to install software on your Mac. Paste this command in Terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the instructions on screen. After it finishes, it will tell you to run a few commands to add Homebrew to your path - make sure to do that.

Learn more: [Homebrew Website](https://brew.sh/)

### Step 3: Install Node.js

With Homebrew installed, getting Node.js is simple:

```bash
brew install node
```

### Step 4: Install pnpm

pnpm is the package manager this project uses:

```bash
brew install pnpm
```

---

## Getting the Project

### How to Clone a Git Repository

"Cloning" means downloading a copy of a project from GitHub to your computer.

1. Open Terminal
2. Navigate to where you want the project. For example, to put it in a "Projects" folder in your Documents:
   ```bash
   cd ~/Documents
   mkdir Projects
   cd Projects
   ```
3. Clone this project:
   ```bash
   git clone git@github.com:Oliver-Bagin/Claude-Bootstrap.git
   ```
4. Move into the project folder:
   ```bash
   cd Claude-Bootstrap
   ```

If you get an error about SSH keys, you can use the HTTPS URL instead:
```bash
git clone https://github.com/Oliver-Bagin/Claude-Bootstrap.git
```

---

## Getting Started with Claude

Claude Code is an AI assistant that can help you build and modify this project by understanding your instructions in plain English.

### Install Claude Code

1. First, make sure you have Homebrew installed (see above)
2. Install Claude Code via Homebrew:
   ```bash
   brew install claude-code
   ```
3. You'll need an Anthropic API key. Get one at [console.anthropic.com](https://console.anthropic.com/)

Learn more: [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)

### Optional: Install iTerm2

iTerm2 is a better terminal app for Mac with more features than the built-in Terminal. It's not required, but many developers prefer it.

```bash
brew install --cask iterm2
```

After installing, you can find iTerm in your Applications folder.

Learn more: [iTerm2 Website](https://iterm2.com/)

---

## Opening This Project with Claude

1. Open Terminal (or iTerm2)
2. Navigate to the project folder:
   ```bash
   cd ~/Documents/Projects/Claude-Bootstrap
   ```
3. Start Claude Code:
   ```bash
   claude
   ```
4. Claude will start and show you a prompt where you can type

### Running the Project

Once Claude is running, simply type:

> Run the project for me

Claude will install any missing dependencies and start both the frontend and backend servers. You'll then be able to open your browser to [http://localhost:3000](http://localhost:3000) to see your app running.

---

## What's Next?

Once the project is running, you can ask Claude to help you:

- "Add a new page to the frontend"
- "Create an API endpoint that returns a list of items"
- "Make the homepage look different"
- "Explain how this project is structured"

Claude will make the changes for you and explain what it's doing along the way.

---

## License

MIT
