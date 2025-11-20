# Deployment Guide for OpenScientific

Since this is a static website (HTML/CSS/JS), deploying to GitHub Pages is very straightforward. You have two options:

## Option 1: Automated Deployment (Recommended)

I have already created a GitHub Actions workflow file for you at `.github/workflows/static.yml`. This will automatically deploy your site whenever you push to the `main` branch.

**Steps:**
1. Push your code to a GitHub repository.
2. Go to your repository on GitHub.
3. Navigate to **Settings** > **Pages**.
4. Under **Build and deployment**, change **Source** to **GitHub Actions**.
5. The workflow I created will pick up the change and deploy your site.

## Option 2: Manual Settings Configuration

If you prefer not to use GitHub Actions or want the simplest possible setup:

1. Push your code to a GitHub repository.
2. Go to your repository on GitHub.
3. Navigate to **Settings** > **Pages**.
4. Under **Build and deployment**, ensure **Source** is set to **Deploy from a branch**.
5. Under **Branch**, select `main` and `/ (root)`.
6. Click **Save**.

Your site will be live at `https://<username>.github.io/<repository-name>/` shortly after!
