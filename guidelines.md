# Development Guidelines

These guidelines must be strictly followed when working on the Smart Field Survey & Inspection App.

## 1. Modular Development Workflow
- **One by One:** Implement tasks strictly one module at a time.
- **Local Testing First:** Complete a module, and wait for the user to verify everything locally. **Do not push the code until the user confirms it is verified.**
- **Commit & Push:** Once verified by the user, commit the code to GitHub with a detailed commit message describing the feature.
- **Pacing:** After completing a module and pushing, wait for about half an hour (or when requested by the user) before starting the next module, following the exact same process.

## 2. Project Structure
- **Preserve Structure:** Do not destroy the existing folder structure.
- **No Resets:** Do not reset the project under any circumstances. Work within the established setup.

## 3. Code Quality & Style
- **Beginner-Friendly:** Write code that is very easy for a beginner to inspect and understand.
- **Keep It Simple:** Avoid highly complex or "high-level" logic. The code should be straightforward and readable.
- **Exceptional UI/UX & Styling:** Focus heavily on creating a beautiful, modern user interface. While the logic should remain low-level and simple, the styling should be premium. Use well-chosen color palettes, smooth interactive buttons (like active opacity/pressable effects), good spacing, rounded corners, and clear typography.

## 4. Progress Tracking
- **Update Task File:** After completing a module, update the `task.md` file to mark the corresponding module's checklist as completed (e.g., using `[x]`). This helps track our overall progress.
