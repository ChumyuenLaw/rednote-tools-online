# rednote-tools-online Development Documentation

## 1. Project Overview

`rednote-tools-online` appears to be a web application built with Next.js. Based on file names like `RedNoteImage.tsx` and `types/rednote.ts`, it likely provides tools related to "RedNote", potentially involving image processing or manipulation, alongside features like a blog and internationalization support.

## 2. Tech Stack

*   **Framework:** Next.js (App Router likely used based on `src/app`)
*   **Language:** TypeScript
*   **UI:** React, Tailwind CSS, shadcn/ui, Framer Motion
*   **Internationalization:** `next-intl`
*   **State Management:** (Likely React Context or Zustand/Jotai, needs confirmation)
*   **API Communication:** Standard `fetch` or a library like `axios` (inferred from `lib/api.ts`)
*   **Linting/Formatting:** ESLint (configured in `.eslintrc.json` or `eslint.config.mjs`)
*   **Analytics:** Vercel Analytics, Google Analytics (`lib/gtag.ts`)

## 3. Project Structure (`src` directory)

*   `app/`: Core application structure using Next.js App Router.
    *   `[locale]/`: Handles internationalized routes. Contains page layouts and specific page components.
    *   `api/`: API route handlers.
    *   `layout.tsx`: Root layout for the application.
    *   `page.tsx`: Main entry page component for the root route.
    *   `globals.css`: Global CSS styles.
    *   `not-found.tsx`: Custom 404 page.
*   `components/`: Reusable React components.
    *   `ui/`: Generic UI components, likely built with shadcn/ui.
    *   `home/`: Components specific to the homepage.
    *   `blog/`: Components related to the blog feature.
    *   `shared/` (or similar): Might contain components used across different sections (e.g., `Footer.tsx`, `Logo.tsx`).
    *   Specific feature components (e.g., `UploadDropzone.tsx`, `ResultSection.tsx`, `RedNoteImage.tsx`).
*   `lib/`: Utility functions, API clients, and core logic.
    *   `api.ts`: Functions for interacting with backend APIs.
    *   `utils.ts`: General utility functions.
    *   `cache.ts`: Caching logic.
    *   `sign.ts`: Potentially related to authentication or request signing.
    *   `gtag.ts`: Google Analytics integration helper.
*   `i18n/`: Internationalization configuration and locale files.
    *   `locales/` or `messages/`: Contains translation files (e.g., `en.json`, `zh.json`).
    *   Configuration files for `next-intl`.
*   `content/`: Static content, like blog posts (Markdown or MDX files likely inside `blog/`).
*   `types/`: TypeScript type definitions.
    *   `rednote.ts`: Specific types related to the "RedNote" functionality.
*   `pages/`: Used for specific Next.js files like `_document.tsx` if needed alongside the App Router.

## 4. Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd rednote-tools-online
    ```
2.  **Install dependencies:**
    *   Make sure you have Node.js and npm installed.
    *   If you are behind a proxy, configure it first:
        ```bash
        export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
        ```
    *   Install packages:
        ```bash
        npm install
        ```
3.  **Environment Variables:**
    *   Create a `.env.local` file in the project root.
    *   Copy the contents of `.env.example` (if it exists) or add necessary environment variables (e.g., API keys, base URLs). Refer to `.env.local` if it exists for required variables.
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:3000`.

## 5. Key Development Areas

*   **Adding a new UI Component:** Create the component file in `src/components/ui` or a relevant subdirectory. Use Tailwind CSS for styling and follow existing patterns (e.g., using `clsx` and `tailwind-merge` via `lib/utils.ts`).
*   **Adding a new Page/Route:** Create a new folder within `src/app/[locale]/`. Add a `page.tsx` file for the route's UI.
*   **Fetching Data:** Use or add functions in `src/lib/api.ts` to interact with APIs. Fetch data within Server Components or use React Hooks (`useEffect`, `useState`) in Client Components.
*   **Internationalization:** Add new translation keys to the JSON files in `src/i18n/messages/` (or similar path). Use the `useTranslations` hook from `next-intl` in components.
*   **Adding Blog Posts:** Create new Markdown/MDX files in `src/content/blog/`.

# Maintenance Guide

## 1. Updating Dependencies

1.  Check for outdated packages:
    ```bash
    npm outdated
    ```
2.  Update packages (use proxy if needed):
    ```bash
    export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890 # If needed
    npm update
    # Or update specific packages
    npm install package-name@latest
    ```
3.  After updating, test the application thoroughly.

## 2. Building for Production

```bash
npm run build
```
This command creates an optimized production build in the `.next` directory.

## 3. Deployment

*   The project uses Vercel Analytics (`@vercel/analytics`), suggesting it's likely deployed on **Vercel**.
*   Deployment is typically handled by connecting the Git repository to Vercel, which automatically builds and deploys on pushes to the main branch.
*   Ensure environment variables are correctly configured in the Vercel project settings.

## 4. Linting and Code Style

*   Run the linter to check for code style issues:
    ```bash
    npm run lint
    ```
*   Configure linting rules in `.eslintrc.json` or `eslint.config.mjs`.

## 5. Monitoring and Analytics

*   Check **Vercel Analytics** for website traffic and performance metrics.
*   Check **Google Analytics** dashboard if `gtag.ts` is actively used.

## 6. Troubleshooting

*   **Build Failures:** Check logs on Vercel or run `npm run build` locally for detailed errors. Often related to type errors or configuration issues.
*   **Runtime Errors:** Use browser developer tools and check server logs (if applicable) for errors.
*   **Dependency Issues:** Delete `node_modules` and `package-lock.json` (or `pnpm-lock.yaml`), then run `npm install` again (using proxy if necessary). 