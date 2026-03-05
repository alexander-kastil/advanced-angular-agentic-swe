# Server-Side Rendering Demo: Food Shop

A complete server-side rendering (SSR) implementation of a food shop application demonstrating Angular 21+ SSR patterns with Express.

## Overview

This module demonstrates a full-featured e-commerce application with server-side rendering, including:

- **SSR Configuration**: Angular SSR setup with `@angular/ssr` and Express
- **Server Bootstrap**: Node.js server with CommonEngine for rendering
- **Responsive UI**: Food catalog with detailed product views
- **State Management**: Reactive data loading and component state
- **Material Design**: Angular Material integration for professional UI

## Demonstrated Patterns & Features

| Feature                  | Location                        | Description                                                                |
| ------------------------ | ------------------------------- | -------------------------------------------------------------------------- |
| **SSR Bootstrap**        | `main.server.ts`                | Server bootstrap function with Angular SSR context                         |
| **Server Configuration** | `app.config.server.ts`          | Application config with `provideServerRendering()`                         |
| **Express Server**       | `server.ts`                     | Node.js Express server setup with CommonEngine for rendering               |
| **Food Service**         | `src/app/food/food.service.ts`  | Reactive data service for product catalog                                  |
| **Food List**            | `src/app/food/food-list/`       | Main product list component with filtering and pagination                  |
| **Food Details**         | `src/app/food/food-details/`    | Product detail view with selection capabilities                            |
| **Shop Item**            | `src/app/food/shop-item/`       | Reusable product card component with add-to-cart                           |
| **Euro Pipe**            | `src/app/shared/euro.pipe.ts`   | Custom pipe for currency formatting                                        |
| **Number Picker**        | `src/app/shared/number-picker/` | Quantity selector component                                                |
| **Static Assets**        | `src/assets/`                   | Product images and static resources                                        |
| **Data Source**          | `db.json`                       | Mock product catalog (Butter Chicken, Blini with Salmon, Wiener Schnitzel) |

## Application Structure

```
src/
├── app/
│   ├── app.component.ts
│   ├── app.config.ts              # Client configuration
│   ├── app.config.server.ts       # Server configuration with SSR provider
│   ├── app.routes.ts              # Route definitions
│   ├── food/
│   │   ├── food.model.ts
│   │   ├── food.service.ts
│   │   ├── food-list/             # Product listing page
│   │   ├── food-details/          # Product details page
│   │   └── shop-item/             # Product card component
│   └── shared/
│       ├── euro.pipe.ts           # Currency formatting
│       └── number-picker/         # Quantity selector
├── main.ts                        # Client bootstrap
├── main.server.ts                 # Server bootstrap
└── server.ts                      # Express server with SSR rendering
```

## Key SSR Concepts

- **Hydration**: Server-rendered HTML is hydrated on the client for interactive functionality
- **CommonEngine**: Angular's server-side rendering engine for Express
- **Static Asset Serving**: Efficient caching of compiled browser bundle
- **APP_BASE_HREF**: Dynamic base URL handling for universal apps

## Running the Application

```bash
# Development server
npm start

# Production build with SSR
npm run build

# Run SSR server
npm run serve:ssr:food-shop-ssr
```

## Performance Benefits

- **Initial Page Load**: HTML rendered on server vs. empty shell in client-only apps
- **SEO Improvement**: Pre-rendered content available to search engines
- **Time to Interactive**: Reduced JavaScript parsing on client
- **Network Efficiency**: Smaller initial JavaScript bundle with deferred hydration
