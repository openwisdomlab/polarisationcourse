# Course Content - 课程内容

This directory contains course-specific content that extends beyond the existing demos.

## Structure

```
content/
├── unit0/        # Unit 0: Optical Basics (光学基础)
├── unit1/        # Unit 1: Polarization States (偏振态)
├── unit2/        # Unit 2: Interface Reflection (界面反射)
├── unit3/        # Unit 3: Transparent Media (透明介质)
├── unit4/        # Unit 4: Turbid Media (浑浊介质)
├── unit5/        # Unit 5: Full Polarimetry (全偏振技术)
└── README.md     # This file
```

## Content Strategy

### Reuse Existing Components

The course content layer **reuses existing demo components** from `/src/components/demos/` rather than duplicating code. This is achieved through:

1. **Lazy loading in LessonPage.tsx** - Demo components are imported dynamically
2. **Wrapper components** - Course-specific context is added around demos
3. **Difficulty adaptation** - Content adjusts based on selected learning level

### When to Add New Content

Add content to this directory when:

1. A lesson requires **custom theory explanations** not covered by existing demos
2. You need **course-specific visualizations** that don't fit the demo format
3. A lesson involves **multi-demo workflows** with guided transitions
4. You want to add **reflection exercises** or **quiz components**

### Example Custom Lesson Component

```tsx
// content/unit1/LessonMalusAdvanced.tsx
import { lazy, Suspense } from 'react'
import { LessonWrapper } from '../../components/LessonWrapper'

const MalusDemo = lazy(() => import('@/components/demos/unit1/MalusLawDemo'))

export function LessonMalusAdvanced() {
  return (
    <LessonWrapper>
      {/* Theory Section */}
      <TheorySection>
        <h2>Understanding Malus's Law</h2>
        <p>When linearly polarized light passes through a polarizer...</p>
        <FormulaDisplay formula="I = I_0 \cos^2(\theta)" />
      </TheorySection>

      {/* Interactive Demo */}
      <Suspense fallback={<DemoLoader />}>
        <MalusDemo />
      </Suspense>

      {/* Reflection Questions */}
      <ReflectionSection>
        <Question>
          What happens when θ = 45°?
        </Question>
        <Question>
          Why does intensity follow cos²θ instead of cosθ?
        </Question>
      </ReflectionSection>
    </LessonWrapper>
  )
}
```

## Guidelines

1. **Don't duplicate physics logic** - The core physics engine in `/src/core/` is shared
2. **Prefer composition** - Wrap existing components rather than copying
3. **Keep i18n keys in locales** - All text should use translation keys
4. **Follow difficulty levels** - Adapt content for foundation/application/research
