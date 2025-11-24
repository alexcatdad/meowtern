# Vercel Setup for PR Previews

This repository uses Vercel for automatic PR preview deployments.

## Quick Setup (Recommended - GitHub Integration)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`alexcatdad/meowtern`)
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave as root (we handle this in `vercel.json`)
   - **Build Command**: `cd packages/demo && bun run build` (or leave empty, it's in vercel.json)
   - **Output Directory**: `packages/demo/dist` (or leave empty, it's in vercel.json)
   - **Install Command**: `bun install` (or leave empty, it's in vercel.json)
5. Click "Deploy"

Vercel will automatically:
- Deploy the main branch to production
- Create preview deployments for every PR
- Comment on PRs with preview URLs

## Manual Setup (Using GitHub Actions)

If you prefer to use the GitHub Actions workflow instead of Vercel's GitHub integration:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select your existing project
3. Go to Project Settings → General
4. Copy your **Organization ID** and **Project ID**
5. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
6. Create a new token
7. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN` - Your Vercel token
   - `VERCEL_ORG_ID` - Your organization ID
   - `VERCEL_PROJECT_ID` - Your project ID

The GitHub Actions workflow will then automatically deploy previews for each PR.

## Configuration

The `vercel.json` file configures:
- Build command: Builds the demo package
- Output directory: Points to the built demo
- Framework: Vite
- Rewrites: SPA routing support

## Notes

- Vercel is free for public repositories
- Preview deployments are automatically cleaned up when PRs are closed
- Each PR gets a unique preview URL
- Preview URLs are automatically commented on PRs

