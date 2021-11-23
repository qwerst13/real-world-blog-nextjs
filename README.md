# Next.js + SWR Frontend Example App

> ### Next.js + SWR codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

## Getting started

You can view a live demo here: [https://real-world-blog-nextjs.vercel.app/](https://real-world-blog-nextjs.vercel.app/)

To get the frontend running locally:

- Clone this repo `git clone <https or ssh link>`
- `npm install` to install all dependencies
- create .env.local and set variable `NEXT_PUBLIC_API_URL=<url to RealWorld backend api here>`
- `npm run dev` to start the local server

### Making requests to the backend API

As one of the options, you can use live API server running at `https://api.realworld.io/api` just add it in your environment variable for the application to make requests against. You can view [API docs](https://api.realworld.io/api-docs/) which contains all routes & responses for the server.

The source code for the backend server (available for Node, Rails and Django) can be found in the [main RealWorld repo](https://github.com/gothinkster/realworld) and have playground to test responses locally.

## Functionality overview

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication.

**General functionality:**

- Authenticate users via JWT (login/register pages + logout in the header section)
- CRU\* users (sign up & settings page - no deleting required)
- CRUD Articles
- GET and display paginated lists of articles route based
- Favorite articles
- Protected routes (sign-in/sign-up pages protected from authenticated users, profile/edit pages protected from non-authenticated users)

**The general page breakdown looks like this:**

- Home page (URL: /)
  - Global list of articles
- Pages (URL: /articles/\[page\])
  - Pagination for list of articles
- Sign in/Sign up pages (URL: /sign-in, /sign-up)
  - Use JWT (store the token in localStorage)
- Profile page (URL: /profile )
  - Show basic user info
  - Editing user info
- Editor page to create/edit articles (URL: /new-article, /\[article-slug\]/edit)
- Article page (URL: /article/\[article-slug\])
  - Delete/edit article button (only shown to article's author)
  - Render markdown
