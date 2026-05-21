# Agent Instructions — Innovation Lab

## Permanent Rules

### Icons — NEVER use emojis
For all UI work on this project, ALWAYS use professional SVG icon libraries. Emojis are never acceptable.

**Approved icon sources (in preference order):**
1. `lucide-react` — already installed (`npm install lucide-react`)
2. `@heroicons/react` — `npm install @heroicons/react`
3. `@phosphor-icons/react` — `npm install @phosphor-icons/react`
4. `@iconify/react` — `npm install @iconify/react @iconify/icons-heroicons`

**Icon naming conventions by library:**
| Concept | lucide | Heroicons | Phosphor |
|---|---|---|---|
| Dashboard | `ChartBar` | `ChartBarIcon` | `ChartBar` |
| Users | `Users` | `UsersIcon` | `Users` |
| Projects | `FolderKanban` | `FolderIcon` | `Folders` |
| Settings | `Settings` | `Cog6ToothIcon` | `GearSix` |
| Edit | `Pencil` | `PencilIcon` | `PencilSimple` |

**If you need an icon and can't find it in the installed library:**
1. Search https://phosphoricons.com
2. Search https://heroicons.com
3. Search https://icon-sets.iconify.design
4. Install the appropriate library, then use the icon

## Tech Stack
- Frontend: React 19, Tailwind CSS, HeroUI
- Backend: Spring Boot 3.4, Java 21, PostgreSQL
- Deploy: Netlify (frontend), Render (backend + DB)
