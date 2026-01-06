# Plan: Dedicated Custom Product Request Page

## Overview
Create a new standalone "Custom" page as a main navigation section (alongside Shop, Workshops, Private Sessions, About) where users can submit requests for completely custom/new products - not tied to any existing product from the shop.

## Problem
The current customization form is tied to individual products (requires `product_id`). Users want to request entirely new custom pieces without selecting an existing product first.

## Solution

### 1. Database Schema Update
**Modify `custom_requests` table** to make `product_id` nullable:
- Currently: `product_id uuid NOT NULL`
- Change to: `product_id uuid NULLABLE`
- This allows custom requests that are not tied to any existing product

**SQL Migration:**
```sql
ALTER TABLE public.custom_requests 
ALTER COLUMN product_id DROP NOT NULL;
```

### 2. Create New Page: `/custom`
**File: `src/pages/Custom.tsx`**

Page structure (following Sessions.tsx pattern):
- Hero section with title "Custom Creations" or "Bespoke Pieces"
- Brief description of the custom order process
- Features/benefits section (3 cards):
  - "Your Vision" - Describe your dream piece
  - "Reference Images" - Upload inspiration photos
  - "Personal Touch" - We craft it just for you
- Customization form (for logged-in users)
- Sign-in prompt (for logged-out users)

Form fields:
- **Product Type** (optional dropdown): Vase, Bowl, Mug, Plate, Planter, Set, Other
- **Customization Notes** (textarea): "Describe your dream piece - size, color, style, usage..."
- **Reference Image** (optional): JPG/PNG, max 5MB
- Submit button

### 3. Add Navigation Link
**File: `src/components/layout/Header.tsx`**

Add "Custom" to the navigation array:
```tsx
const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/sessions', label: 'Private Sessions' },
  { href: '/custom', label: 'Custom' },  // NEW
  { href: '/about', label: 'About' },
];
```

### 4. Add Route
**File: `src/App.tsx`**

Add route for the new page:
```tsx
import Custom from "./pages/Custom";
// ...
<Route path="/custom" element={<Custom />} />
```

### 5. Confirmation Dialog
Same confirmation popup as existing implementation:
- Title: "Customization Request Submitted"
- Message about team review
- Clickable phone number: +91 9879575601
- "Okay, Got It" and "Contact Us" buttons

## Implementation Steps

1. **Database Migration** - Make `product_id` nullable in `custom_requests` table
2. **Create Custom.tsx** - New page with hero, features, and form
3. **Update Header.tsx** - Add "Custom" to navigation links
4. **Update App.tsx** - Add route for `/custom`

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `supabase/migrations/[timestamp].sql` | CREATE | Make product_id nullable |
| `src/pages/Custom.tsx` | CREATE | New custom request page |
| `src/components/layout/Header.tsx` | MODIFY | Add nav link |
| `src/App.tsx` | MODIFY | Add route |

## UX Considerations

- Matches existing wabi-sabi design aesthetic
- Mobile-safe layout
- Form requires auth (shows sign-in prompt for logged-out users)
- Loading states and error handling
- Confirmation popup on success
- No animations per requirements

## Safety Guarantees

- Does NOT affect existing shop functionality
- Does NOT modify checkout or pricing
- Does NOT break existing product customization flow
- Backward compatible - existing custom requests with product_id still work
- RLS policies already in place will work for new records
