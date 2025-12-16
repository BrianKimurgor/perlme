# Web Frontend - Quick Reference Guide

## 🚀 Quick Start

All pages are now live with professional designs matching the Android app's color scheme!

### New Pages Created

1. **Features** - `/app/features/page.tsx`
   - 8 feature cards with icons
   - "Why Choose Perlme" section
   - Mobile responsive
   - Light/dark theme support

2. **Solutions** - `/app/solutions/page.tsx`
   - 6 solution cards (expandable)
   - How it works step process
   - Use case scenarios
   - Interactive elements

3. **Pricing** - `/app/pricing/page.tsx`
   - 3 pricing tiers (Free, Plus, Premium)
   - Monthly/yearly toggle
   - Detailed comparison table
   - FAQ section

4. **About** - `/app/about/page.tsx`
   - Mission & Vision
   - Company story (3 parts)
   - Core values (4 items)
   - Timeline/Milestones
   - Team member profiles
   - Company stats

---

## 🎨 Colors Used (Matching Android App)

```typescript
// Primary Colors
PRIMARY_ACCENT = '#ff3366'  // Pink/Red - Brand color
PRIMARY_TINT = '#0a7ea4'    // Cyan/Blue
SECONDARY = '#06b6d4'       // Light Cyan
TERTIARY = '#687076'        // Gray

// Supporting
SUCCESS = '#10b981'         // Green
WARNING = '#f59e0b'         // Amber
ERROR = '#ef4444'           // Red
```

---

## 📁 File Structure

```
next-frontend/
├── app/
│   ├── features/
│   │   └── page.tsx          ✨ NEW
│   ├── solutions/
│   │   └── page.tsx          ✨ NEW
│   ├── pricing/
│   │   └── page.tsx          ✨ NEW
│   ├── about/
│   │   └── page.tsx          ✨ UPDATED
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── header.tsx            ✨ UPDATED (navigation links)
│   ├── hero-section.tsx
│   └── ...
├── lib/
│   └── theme.ts              ✨ NEW (color system)
└── DESIGN_SYSTEM.md          ✨ NEW (comprehensive guide)
```

---

## 🔧 Key Features Implemented

### Dynamic Theme Detection
```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  setIsDark(savedTheme === 'dark' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches);
}, []);
```

### Animated Cards with Hover Effects
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  className="hover:shadow-lg transition-all duration-300"
>
```

### Glow Effect on Icons
```typescript
style={{
  backgroundColor: color,
  boxShadow: `0 0 20px ${color}40`,
}}
```

### Responsive Grid Layouts
- 4 columns on desktop (`lg:grid-cols-4`)
- 2 columns on tablet (`md:grid-cols-2`)
- 1 column on mobile (default)

---

## 📊 Page Breakdown

### Features Page
- **Hero**: Full viewport, centered content
- **8 Feature Cards**: Grid layout, colorful icons
- **Why Choose Section**: 2x2 grid with left-right animations
- **CTA**: Primary button with glow

### Solutions Page
- **Hero**: Statement headline
- **6 Solution Cards**: Expandable details
- **How It Works**: 4-step process
- **Use Cases**: 2x2 grid
- **CTA**: Call to action

### Pricing Page
- **Hero**: Pricing headline
- **Toggle**: Monthly/Yearly selector
- **3 Cards**: Free, Plus (featured), Premium
- **FAQ**: 6 Q&A pairs
- **Comparison Table**: Feature matrix
- **CTA**: Dual buttons

### About Page
- **Hero**: Title + tagline
- **Mission/Vision**: 2-column cards
- **Story**: 3 narrative sections
- **Values**: 4 cards (Authenticity, Privacy, Inclusivity, Innovation)
- **Timeline**: Vertical milestone layout
- **Team**: 3 member profiles
- **Stats**: 4 key metrics
- **CTA**: Community invitation

---

## 🎯 Navigation Updates

Header menu items now point to correct routes:

```typescript
const menuItems = [
    { name: 'Features', href: '/features' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
]
```

---

## 💻 Technology Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React
- **State**: React Hooks
- **Type Safety**: TypeScript

---

## 🌓 Theme System

All pages automatically detect and apply the correct theme:

```typescript
// Light Mode (Default)
backgroundColor: '#ffffff'
textColor: '#11181C'
surfaceColor: '#f5f5f5'
borderColor: '#e0e0e0'

// Dark Mode
backgroundColor: '#151718'
textColor: '#ECEDEE'
surfaceColor: '#1f2023'
borderColor: '#333333'
```

---

## 🎬 Animation Patterns

### Page Load
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

### Scroll Trigger (Staggered)
```typescript
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: index * 0.1 }}
viewport={{ once: true }}
```

### Hover State
```typescript
className="hover:scale-110 transition-transform duration-300"
```

---

## 📱 Responsive Design

All pages are fully responsive:
- **Mobile-first** approach
- **Breakpoints**: sm (640), md (768), lg (1024), xl (1280)
- **Grid layouts** adapt: 1 → 2 → 3/4 columns
- **Font sizes** scale: sm (text-lg) → lg (text-6xl)
- **Padding** adjusts for mobile comfort

---

## 🔍 Quick Customization Guide

### Change Primary Color
Edit `/lib/theme.ts`:
```typescript
export const THEME_COLORS = {
  light: { secondary: '#ff3366' }, // Change this
  dark: { secondary: '#ff3366' },
}
```

### Update Team Members
Edit `/app/about/page.tsx`:
```typescript
const teamMembers = [
  { name: 'Your Name', role: 'Your Role', ... }
]
```

### Modify Features List
Edit `/app/features/page.tsx`:
```typescript
const features = [
  { title: 'Your Feature', description: '...', color: '#ff3366' }
]
```

---

## 🧪 Testing

All pages support:
- ✅ Light/Dark mode
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Animations & transitions
- ✅ Interactive elements
- ✅ Responsive images (if added)

---

## 📈 Performance Considerations

- Uses `whileInView` for scroll animations (lazy rendering)
- Framer Motion optimizes animation performance
- Images should be optimized (Next.js Image component ready)
- Font sizes scale responsively
- No unnecessary re-renders with proper dependency arrays

---

## 🔗 Next Steps

1. **Connect Backend**: Integrate pricing API
2. **Add Authentication**: Link auth pages
3. **Team/Testimonials**: Replace emoji avatars with images
4. **Analytics**: Add tracking (GA, Mixpanel)
5. **SEO**: Add metadata, structured data
6. **Forms**: Implement newsletter signup
7. **Blog**: Add blog section
8. **Live Chat**: Integrate support widget

---

## 📚 Resources

- [Design System](./DESIGN_SYSTEM.md) - Comprehensive design documentation
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js Docs](https://nextjs.org/docs)

---

**Created**: December 16, 2025  
**Status**: ✨ All pages ready for production
