# Next.js Todo App

A functional and responsive Todo List application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. 

## ✨Features

- **Next.js 15 App Router:** Utilizes the newest React features out-of-the-box.
- **Local Storage Persistence:** Client-side caching means your todos are saved securely in your browser and instantly available without a database.
- **Dark Mode UI:** A gorgeous, centered card layout using Tailwind's rich dark-mode design system. 
- **Fully Interactive:** Seamless inline editing, instant creation, and one-click deletions without page reloads.
- **Smart Timestamps:** Automatically tracks creation dates and accurate "Last updated" times for every task.

## 🛠️How It Was Built (The Logic)

This app completely relies on client-side React features, safely sidestepping server-rendering conflicts using the `"use client"` directive.

1. **State Management:** 
   We maintain a primary `todos` array in the component state using `useState`. This single source of truth holds items shaped by our custom TypeScript `Todo` interface (ID, title, description, and timestamps).

2. **Local Storage Synchronization:**
   The `useEffect` hook operates in two parts:
   - **On Mount:** Safely reads the `todos` payload from the browser's `localStorage` and hydrates the initial state. We track an `isLoaded` boolean to prevent Next.js hydration mismatches between the server-rendered shell and the client data.
   - **On Update:** Whenever the `todos` state updates (creation, edit, or deletion), another `useEffect` automatically stringifies the array and commits it back to `localStorage`.

3. **Inline Editing System:**
   Rather than simple prompts or modals, we implement inline editing natively. By keeping track of an `editingId` within the state, the UI conditionally swaps a todo's display text for interactive input fields precisely where they live on the screen.

4. **Date Formatting:**
   Timestamps are generated upon item creation and modified upon editing. We format these standard browser `Date` objects into a clean layout (`YYYY-MM-DD HH:MM [AM/PM]`) directly using native JavaScript logic.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open in Browser:** Navigate to [http://localhost:3000](http://localhost:3000)
