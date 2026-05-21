# Icon Resources — Always Use These

When any project needs icons, always prefer these sources (in order of preference).
Never use random or obscure icon sets. Always pick from this list.

---

## Tier 1 — Dev-First (MIT License, No Attribution Required)

### Lucide Icons
- **URL**: https://lucide.dev
- **CDN**: https://unpkg.com/lucide@latest
- **NPM**: `npm install lucide-react` / `npm install lucide`
- **Format**: SVG, React, Vue, Angular components
- **Count**: 1,500+ icons
- **Usage (React)**:
  ```jsx
  import { Home, Settings, User } from 'lucide-react'
  <Home size={24} color="#000" />
  ```
- **Usage (HTML)**:
  ```html
  <script src="https://unpkg.com/lucide@latest"></script>
  <i data-lucide="home"></i>
  <script>lucide.createIcons();</script>
  ```

---

### Tabler Icons
- **URL**: https://tabler.io/icons
- **CDN**: https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css
- **NPM**: `npm install @tabler/icons-react`
- **Format**: SVG, React, Vue, Webfont
- **Count**: 5,000+ icons
- **Usage (React)**:
  ```jsx
  import { IconHome, IconSettings } from '@tabler/icons-react'
  <IconHome size={24} stroke={1.5} />
  ```
- **Usage (HTML/CDN)**:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
  <i class="ti ti-home"></i>
  ```

---

### Heroicons
- **URL**: https://heroicons.com
- **NPM**: `npm install @heroicons/react`
- **Format**: SVG, React, Vue
- **Count**: 300+ icons (outline + solid variants)
- **Usage (React)**:
  ```jsx
  import { HomeIcon } from '@heroicons/react/24/outline'
  import { HomeIcon } from '@heroicons/react/24/solid'
  <HomeIcon className="h-6 w-6" />
  ```

---

### Phosphor Icons
- **URL**: https://phosphoricons.com
- **NPM**: `npm install @phosphor-icons/react`
- **Format**: SVG, React, Vue, Flutter
- **Count**: 9,000+ icons, 6 weights (Thin, Light, Regular, Bold, Fill, Duotone)
- **Usage (React)**:
  ```jsx
  import { Horse, Heart, Cube } from '@phosphor-icons/react'
  <Horse size={32} weight="duotone" />
  ```

---

### Bootstrap Icons
- **URL**: https://icons.getbootstrap.com
- **CDN**: https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css
- **NPM**: `npm install bootstrap-icons`
- **Format**: SVG, Webfont
- **Count**: 2,000+ icons
- **Usage (HTML)**:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css">
  <i class="bi bi-house"></i>
  ```

---

### Iconify (Meta-Library — All Sets in One)
- **URL**: https://iconify.design
- **Icon Browser**: https://icon-sets.iconify.design
- **NPM**: `npm install @iconify/react`
- **Format**: React, Vue, Svelte, Web Component
- **Count**: 200,000+ icons across 100+ icon sets
- **Usage (React)**:
  ```jsx
  import { Icon } from '@iconify/react'
  <Icon icon="mdi:home" width="24" height="24" />
  <Icon icon="lucide:settings" />
  <Icon icon="tabler:user" />
  ```
- **Usage (HTML — no install)**:
  ```html
  <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
  <iconify-icon icon="mdi:home"></iconify-icon>
  ```
- **Note**: Use Iconify when you need icons from multiple sets in one project.

---

## Tier 2 — Large Libraries (Free with Attribution)

### Font Awesome
- **URL**: https://fontawesome.com
- **CDN**: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css
- **NPM**: `npm install @fortawesome/react-fontawesome`
- **Free Count**: 2,000+ icons (Pro has 26,000+)
- **Usage (HTML)**:
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
  <i class="fa-solid fa-house"></i>
  <i class="fa-regular fa-heart"></i>
  ```
- **Usage (React)**:
  ```jsx
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faHouse } from '@fortawesome/free-solid-svg-icons'
  <FontAwesomeIcon icon={faHouse} />
  ```

---

### Flaticon
- **URL**: https://flaticon.com
- **Format**: SVG, PNG, Webfont, Lottie
- **Count**: 16 million+ icons
- **License**: Free with attribution (Flaticon credit link required on free plan)
- **Best for**: Design assets, PNGs, illustrations — not ideal for code-first projects

---

### Icons8
- **URL**: https://icons8.com
- **CDN/API**: https://img.icons8.com/ios/50/home.png
- **Format**: PNG, SVG, Lottie (animated)
- **Count**: 1.5 million+ icons
- **Usage (HTML — inline API)**:
  ```html
  <img src="https://img.icons8.com/ios/50/home.png" alt="home" />
  ```
- **License**: Free with attribution link to Icons8

---

## Tier 3 — Animated Icons

### LottieFiles
- **URL**: https://lottiefiles.com
- **NPM**: `npm install @lottiefiles/react-lottie-player`
- **Format**: JSON (Lottie), dotLottie
- **Best for**: Animated icons, loading states, success/error animations
- **Usage (React)**:
  ```jsx
  import { Player } from '@lottiefiles/react-lottie-player'
  <Player autoplay loop src="https://assets.lottiefiles.com/packages/lf20_xxxx.json" style={{ height: '150px' }} />
  ```

---

## Quick Decision Guide

| Situation | Use |
|-----------|-----|
| React/Next.js app | Lucide or Tabler |
| Need many icon styles/sets | Iconify |
| Want duotone or weighted icons | Phosphor |
| Tailwind CSS project | Heroicons |
| Need 5,000+ varied icons | Tabler |
| Bootstrap project | Bootstrap Icons |
| Animated icons | LottieFiles |
| Design mockups / PNGs | Icons8 or Flaticon |
| Quick HTML with CDN | Font Awesome |

---

## General Rules

1. **Always prefer SVG** over icon fonts for performance and accessibility.
2. **Lucide or Tabler** are the default picks for any React/Vue/Svelte project.
3. **Iconify** is the best single-import solution when mixing icon sets.
4. **Never hotlink Flaticon SVGs** in production — download and self-host.
5. **Add `aria-label`** or `aria-hidden="true"` to all icons for accessibility.
6. For icon-only buttons always add a visually hidden label:
   ```jsx
   <button aria-label="Close"><XIcon /></button>
   ```
