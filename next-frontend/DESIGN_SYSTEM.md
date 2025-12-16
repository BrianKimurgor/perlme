# Perlme Web Frontend - Design System & Pages Documentation

## 📚 Overview

The web frontend has been redesigned to match the Android mobile app's color scheme and design language while maintaining a modern, professional web aesthetic.

---

## 🎨 Color System

Colors are based on the Android app's theme colors:

### Primary Colors
- **Primary Tint**: `#0a7ea4` (Cyan/Blue)
- **Primary Accent**: `#ff3366` (Pink/Red) - Main brand color
- **Secondary**: `#06b6d4` (Light Cyan)
- **Tertiary**: `#687076` (Gray)

### Supporting Colors
- **Success**: `#10b981` (Emerald Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

### Theme-Aware Colors
**Light Mode:**
- Background: `#ffffff`
- Text: `#11181C`
- Surface: `#f5f5f5`
- Border: `#e0e0e0`

**Dark Mode:**
- Background: `#151718`
- Text: `#ECEDEE`
- Surface: `#1f2023`
- Border: `#333333`

---

## 📁 Page Structure

### 1. **Features Page** (`/app/features/page.tsx`)

**Purpose:** Showcase all platform features in detail

**Sections:**
1. **Hero Section**
   - Large headline: "Powerful Features for Connection"
   - Subheading about meaningful connections
   - Uses accent color gradient

2. **Features Grid (8 Cards)**
   - Smart Matching (`#ff3366`)
   - Real-Time Messaging (`#0a7ea4`)
   - Group Communities (`#06b6d4`)
   - Location-Based Discovery (`#10b981`)
   - Privacy & Security (`#8b5cf6`)
   - Lightning Fast (`#f59e0b`)
   - Safe Community (`#ef4444`)
   - Engagement Metrics (`#ec4899`)
   
   Each card includes:
   - Icon with matching color background
   - Glowing shadow effect
   - Hover scale animation
   - Title and description
   - Light/dark theme support

3. **Why Choose Perlme Section**
   - 4 highlighted benefit cards
   - Each with unique color theme
   - Hover shadow effects
   - Staggered animations

4. **Call-to-Action Section**
   - Button with glow effect
   - Links to login/signup

---

### 2. **Solutions Page** (`/app/solutions/page.tsx`)

**Purpose:** Present problem-solution pairs for different user groups

**Sections:**
1. **Hero Section**
   - "Solutions for Every Connection Goal"
   - Emotional, aspirational copy

2. **Solutions Grid (6 Cards)**
   - Find Your Perfect Match
   - Build Your Community
   - Express Yourself
   - Discover What Matters
   - Measure Your Impact
   - Learn & Grow
   
   Each card features:
   - Icon with gradient background
   - Title and description
   - Expandable benefits list (click to expand)
   - Smooth height animation
   - "Learn more" toggle button

3. **How It Works Section**
   - 4-step process with numbered cards
   - Arrow indicators between steps
   - Step icons with gradient backgrounds

4. **Perfect For Section**
   - 4 use case cards
   - Left border accent in accent color
   - Slide-in animations

5. **Call-to-Action Section**

---

### 3. **Pricing Page** (`/app/pricing/page.tsx`)

**Purpose:** Display subscription tiers and pricing options

**Sections:**
1. **Hero Section**
   - "Simple, Transparent Pricing"
   - Trust-building messaging

2. **Billing Toggle**
   - Monthly/Yearly selector
   - "Save 20%" badge for yearly
   - Animated background change

3. **Pricing Cards (3 Tiers)**
   
   **Free Plan** (`#687076`)
   - Forever pricing
   - 10 feature list items
   - Secondary button styling
   
   **Plus Plan** (`#0a7ea4`) - **FEATURED**
   - $4.99/month
   - "Most Popular" badge
   - Enhanced shadow and glow
   - Primary button styling
   - 10 features with checkmarks
   
   **Premium Plan** (`#ff3366`)
   - $9.99/month
   - All premium features
   - Priority support
   - Primary button styling

   Card Features:
   - Feature list with icons (check/x)
   - Color-coded badges
   - Hover shadow effects
   - Responsive grid

4. **FAQ Section (6 items)**
   - Common questions about billing, cancellation, refunds
   - Clean card layout
   - Expandable on click (optional)

5. **Comparison Table**
   - Features comparison across all 3 tiers
   - Responsive horizontal scroll on mobile
   - Check/X icons for clarity

6. **Call-to-Action Section**
   - Primary and secondary button options

---

### 4. **About Page** (`/app/about/page.tsx`)

**Purpose:** Build trust and share company story

**Sections:**
1. **Hero Section**
   - "About Perlme"
   - Mission-focused messaging

2. **Mission & Vision Cards**
   - Side-by-side layout
   - Mission: Heart icon, pink color
   - Vision: Globe icon, cyan color
   - Detailed text content
   - Parallax scroll animations

3. **Our Story Section (3 parts)**
   - The Beginning (Problem statement)
   - The Development (Solution approach)
   - Today & Beyond (Current state and future)
   - Staggered entrance animations

4. **Core Values Section (4 cards)**
   - Authenticity (Heart)
   - Privacy First (Lock)
   - Inclusivity (Users)
   - Innovation (Zap)
   - Color-coded icons
   - Grid layout

5. **Milestones/Journey Timeline**
   - 4 key milestones with years
   - Vertical timeline with centered dots
   - Left-right alternating layout
   - Color-coded by year
   - Mobile-friendly structure

6. **Team Section (3 members)**
   - Founder & CEO (Gakenye Ndiritu)
   - CTO & Lead Developer (Mwangaza)
   - Product Lead (Enock)
   - Emoji avatars
   - Role and bio
   - Hover effects

7. **Stats Section (4 metrics)**
   - 100K+ Active Users
   - 50+ Countries
   - 10M+ Messages Daily
   - 98% User Satisfaction
   - Large, bold typography
   - Accent color numbers

8. **Call-to-Action Section**

---

## 🎯 Design System Components

### Animations & Transitions
- **Entrance**: fade-in + slide (initial → whileInView)
- **Hover**: scale, shadow increase, opacity change
- **Scroll**: staggered animations using `delay`
- **Transitions**: 300ms standard duration

### Typography Hierarchy
1. **H1**: 3rem-3.75rem (hero sections)
2. **H2**: 2.25rem-3rem (section headers)
3. **H3**: 1.25rem-2rem (card titles)
4. **Body**: 1rem (default text)
5. **Small**: 0.875rem (metadata)

### Spacing
- Section padding: `py-20` (5rem vertical)
- Card padding: `p-6` to `p-8` (1.5-2rem)
- Gap between items: `gap-6` to `gap-8`
- Border radius: `rounded-2xl` for cards

### Visual Effects
- **Glows**: `boxShadow: '0 0 20px ${color}40'`
- **Borders**: `border-[1px]` with theme-aware colors
- **Backdrops**: `backdrop-blur-sm` for glass effect
- **Shadows**: `hover:shadow-lg` on interactive elements

---

## 🌓 Theme Implementation

All pages detect and respond to system theme preferences:

```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setIsDark(savedTheme === 'dark');
  } else {
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
}, []);
```

Then apply theme colors dynamically:
```typescript
const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
const bgColor = isDark ? '#151718' : '#ffffff';
const textColor = isDark ? '#ECEDEE' : '#11181C';
```

---

## 🔗 Navigation Structure

Updated header navigation with correct routes:

```
/          - Home (Hero)
/features  - Features showcase
/solutions - Solution pairs
/pricing   - Pricing tiers
/about     - Company info
/auth/login - Authentication (future)
```

All navigation items are now functional links.

---

## 💡 Design Patterns Used

### 1. **Hero Section Pattern**
- Full viewport height
- Centered content
- Large headline with accent color span
- Subheading with reduced opacity
- Fade-in entrance animation

### 2. **Feature Card Pattern**
- Icon with colored background and glow
- Title and description
- Hover scale animation
- Light/dark theme support

### 3. **Two-Column Layout**
- Used in Mission/Vision, How It Works
- Responsive: stacks on mobile
- Parallax animations on scroll

### 4. **Grid Patterns**
- 4-column on desktop
- 2-column on tablet
- 1-column on mobile
- Consistent gap spacing

### 5. **Button Styling**
- Primary: Accent color background + glow
- Secondary: Border only, accent color text
- Hover: Scale 105% + enhanced shadow
- Icons from lucide-react

---

## 📱 Responsive Breakpoints

Using Tailwind CSS breakpoints:
- **Mobile**: < 640px (default)
- **Small**: 640px+ (`sm:`)
- **Medium**: 768px+ (`md:`)
- **Large**: 1024px+ (`lg:`)
- **Extra Large**: 1280px+ (`xl:`)

Key responsive patterns:
- Hero text: 3xl on mobile → 6xl on desktop
- Grid columns: 1 → 2 → 3/4 on larger screens
- Padding: adjust for mobile comfort

---

## 🎬 Animation Details

### Page Entrance
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

### Scroll Entrance (Cards)
```typescript
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: index * 0.1 }}
viewport={{ once: true }}
```

### Hover Effects
```typescript
className="group-hover:scale-110 transition-transform duration-300"
```

---

## 📊 Color Usage Guide

| Purpose | Color | Usage |
|---------|-------|-------|
| Primary Brand | `#ff3366` | Main CTAs, Hero accents, important elements |
| Primary Tint | `#0a7ea4` | Secondary actions, headers |
| Highlights | `#06b6d4` `#10b981` `#f59e0b` | Feature icons, varied visual interest |
| Backgrounds | Theme-based | Page and section backgrounds |
| Text | Theme-based | All body copy |
| Borders | Theme-based | Card borders, dividers |

---

## 🚀 Development Notes

1. **Theme Colors** defined in `lib/theme.ts`
2. All pages use `'use client'` directive for interactivity
3. Uses **motion/react** (Framer Motion) for animations
4. Uses **lucide-react** for icons
5. Theme detection happens on component mount
6. All pages are responsive-first design

---

## 📋 Testing Checklist

- [ ] Test all pages in light mode
- [ ] Test all pages in dark mode
- [ ] Test mobile responsiveness (320px+)
- [ ] Test navigation links work correctly
- [ ] Test hover effects and animations
- [ ] Test scroll trigger animations
- [ ] Test expandable/interactive elements
- [ ] Test theme persistence (localStorage)
- [ ] Test CTA buttons link correctly
- [ ] Verify accessibility (keyboard navigation, alt text)

---

## 🔮 Future Enhancements

1. Add search functionality
2. Implement dynamic testimonials section
3. Add blog/content pages
4. Newsletter signup integration
5. Live chat support widget
6. Social proof elements (user count, reviews)
7. API integration for real data
8. Internationalization (i18n)
9. Analytics tracking
10. SEO optimization

