# Astro Grid (Angular)

Minimal Angular app that loads a local JSON array and displays records in a grid. Provides multi-select filters for House and Planet, and shows matching records (columns: house, planet, year).

Prerequisites
- Node.js (16+ recommended) and npm installed
- (Optional) Angular CLI installed globally: npm install -g @angular/cli

Quick start (PowerShell)

```powershell
cd e:\KaliProject\astro-grid
npm install
# If you want to add Angular Material theming and schematics run:
# npx -p @angular/cli ng add @angular/material
npm start
```

Notes
- The project uses Angular Material components. If you run `ng add @angular/material` it will wire up themes and animations automatically. If you skip that, the app still tries to import the material theme from styles; run the `ng add` step to finish setup.
- Data is at `src/assets/data.json`. Edit or replace with your own JSON array.

Deploying to GitHub Pages

1. Create a GitHub repository and push your local project. You can do this via the GitHub website, or with the `gh` CLI (if installed):

```powershell
cd e:\KaliProject\astro-grid
git init
git add .
git commit -m "Initial commit"
# If you have the GitHub CLI installed you can create and push a repo with:
# gh repo create <your-username>/astro-grid --public --source=. --remote=origin --push
# Otherwise create a repo on GitHub and then run:
# git remote add origin https://github.com/<your-username>/astro-grid.git
# git branch -M main
# git push -u origin main
```

2. The repository includes a GitHub Actions workflow (`.github/workflows/pages.yml`) that will build the app and publish the `dist/astro-app` folder to GitHub Pages whenever you push to the `main` branch.

3. After the workflow completes, your site will be available at `https://<your-username>.github.io/astro-grid/` (may take a minute to appear). You can share that URL with friends for testing.

If you'd like, I can try to create the remote repo and push from this machine (requires `gh` and that you're logged into GitHub). Tell me to proceed and I'll attempt it.

Files of interest
- `src/app/app.component.*` — main UI and filter logic
- `src/assets/data.json` — sample data

If you'd like, I can run `npm install` and `npx ng serve` here (requires network and node on this machine) or switch the UI to use native HTML selects instead of Material. Which would you prefer?