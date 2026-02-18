# Development Guide

## Adding a New Hub Page

1. Create page in `src/pages/`:
   ```typescript
   import { Link } from 'react-router-dom'
   import { useTranslation } from 'react-i18next'
   import { PersistentHeader } from '@/components/shared/PersistentHeader'
   import type { ModuleTab } from '@/components/shared'

   const SUB_MODULES: ModuleTab[] = [
     {
       id: 'sub-module-1',
       route: '/my-module/sub1',
       icon: SomeIcon,
       label: 'Sub Module 1',
       labelZh: '...',
       description: '...',
       descriptionZh: '...',
       status: 'active', // or 'coming-soon'
     },
   ]

   export default function MyHubPage() { /* ... */ }
   ```
2. Add lazy import in `App.tsx`
3. Add route in `App.tsx`
4. Export from `src/pages/index.ts`
5. Add translations to locale files
6. Add link in `Footer.tsx` if needed

## Adding a New Demo

1. Create component in `src/components/demos/unit*/`
2. Import in `DemosPage.tsx`
3. Add to `getDemoInfo()` in `DemosPage.tsx`
4. Add entry to `DEMOS` array:
   ```typescript
   {
     id: 'my-demo',
     titleKey: 'demos.myDemo.title',
     unit: 1,
     component: MyDemoComponent,
     descriptionKey: 'demos.myDemo.description',
     visualType: '2D', // or '3D'
   }
   ```
5. Add translations to `en.json` and `zh.json`
6. Export from `src/components/demos/index.ts`

### Creating Demos with Framer Motion

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'

export function MyDemo() {
  const [value, setValue] = useState(50)
  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <svg viewBox="0 0 700 300" className="w-full">
          <motion.path d="..." fill="none" stroke="#22d3ee" strokeWidth="3"
            animate={{ d: [...] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
      <ControlPanel title="Parameters">
        <SliderControl label="Value" value={value} min={0} max={100} onChange={setValue} />
      </ControlPanel>
    </div>
  )
}
```

### Demo Controls (DemoControls.tsx)

Available components: `SliderControl`, `Toggle`, `ControlPanel`, `InfoCard`, `ValueDisplay`

## Adding a New Block Type (3D Game)

1. Add type to `BlockType` union in `src/core/types.ts`
2. Add default handling in `createDefaultBlockState()`
3. Add physics processing in `LightPhysics.ts` (if affects light)
4. Add case in `World.propagateLight()` switch statement
5. Add mesh rendering in `Blocks.tsx`
6. Update `BlockSelector.tsx` UI

## Adding a New 2D Level

Define in `src/pages/Game2DPage.tsx` in the `LEVELS` array:

```typescript
{
  id: 11,
  name: 'Level Name',
  nameZh: '...',
  description: '...',
  descriptionZh: '...',
  hint: 'Optional hint',
  hintZh: '...',
  difficulty: 'medium', // 'easy'|'medium'|'hard'|'expert'
  gridSize: { width: 100, height: 100 },
  openEnded: true,
  components: [
    { id: 'e1', type: 'emitter', x: 15, y: 50, angle: 0,
      polarizationAngle: 0, direction: 'right', locked: true },
    { id: 'p1', type: 'polarizer', x: 50, y: 50, angle: 0,
      polarizationAngle: 45, locked: false },
    { id: 's1', type: 'sensor', x: 85, y: 50, angle: 0,
      requiredIntensity: 50, requiredPolarization: 45, locked: true },
  ],
}
```

- `x`, `y` are percentages (0-100) of the grid area
- `locked: true` for components players cannot modify

## Adding Translations

```json
// src/i18n/locales/en.json
{ "namespace": { "key": "English text" } }

// src/i18n/locales/zh.json
{ "namespace": { "key": "..." } }
```

```tsx
const { t } = useTranslation()
return <span>{t('namespace.key')}</span>
```

### Adding a New Language

1. Create `src/i18n/locales/{lang}.json`
2. Import and add to `resources` in `src/i18n/index.ts`
3. Add language option to `LanguageThemeSwitcher.tsx`

## Theme Support

```tsx
import { useTheme } from '@/contexts/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>
      {/* Use CSS variables or conditional classes */}
    </div>
  )
}
```

## Build Configuration

### Vite Config

```typescript
{
  plugins: [react(), tailwindcss()],
  base: './',
  resolve: { alias: { '@': resolve(__dirname, './src') } },
  build: { outDir: 'dist', sourcemap: true }
}
```

### Dependencies

**Production:** react 19, react-router-dom v7, three + R3F + drei, framer-motion, zustand, i18next

**Development:** typescript, vite, vitest + testing-library, tailwindcss v4, lucide-react, cva + clsx + tailwind-merge

**Backend:** @nestjs/*, @colyseus/*

## Backend Server

Multiplayer planned but not yet implemented:

```bash
cd server && npm run start:dev  # Port 3001
```

- API prefix: `/api`
- WebSocket: `ws://localhost:3001`
- CORS: `localhost:5173`, `localhost:3000`
