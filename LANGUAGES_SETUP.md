# Languages Management System

## 🌍 Overview

The Languages Management System allows administrators to manage application languages with full CRUD operations. This system includes a database table, API functions, and a complete admin interface.

## 📊 Database Schema

### Languages Table
```sql
CREATE TABLE languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,           -- Language name (e.g., "English")
  code VARCHAR(10) NOT NULL UNIQUE,     -- ISO language code (e.g., "en")
  native_name VARCHAR(100),             -- Native script name (e.g., "English")
  is_active BOOLEAN DEFAULT true,       -- Whether language is available
  sort_order INTEGER DEFAULT 0,        -- Display order
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Default Languages
The migration includes 10 default languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Chinese Simplified (zh-cn)
- Japanese (ja)
- Korean (ko)

## 🚀 Setup Instructions

### 1. Run Database Migration
Execute the migration file in your Supabase SQL editor:
```bash
# Copy the contents of migrations/001_create_languages.sql
# and run it in your Supabase project's SQL editor
```

### 2. Verify Database Setup
Check that the table was created successfully:
```sql
SELECT * FROM languages ORDER BY sort_order, name;
```

### 3. Test the Admin Interface
1. Navigate to `/admin/dashboard`
2. Click on the "Languages" card
3. You should see the languages management interface

## 🛠️ Features

### ✅ Complete CRUD Operations
- **Create**: Add new languages with validation
- **Read**: View all languages in a sortable table
- **Update**: Edit existing language details
- **Delete**: Remove languages with confirmation

### ✅ Advanced Features
- **Active/Inactive Toggle**: Enable/disable languages
- **Sort Order**: Customize display order
- **Code Validation**: Prevent duplicate language codes
- **Native Names**: Support for native script names
- **Responsive Design**: Works on all device sizes

### ✅ User Experience
- **Modal Forms**: Clean create/edit interface
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Confirmation Dialogs**: Prevent accidental deletions
- **Real-time Updates**: Immediate UI updates after changes

## 📁 File Structure

```
src/
├── app/admin/languages/
│   └── page.tsx                    # Main languages page
├── components/admin/
│   ├── LanguagesList.tsx           # Languages table component
│   └── LanguageForm.tsx            # Create/edit form modal
├── lib/api/
│   └── languages.ts                # API functions for CRUD operations
└── types/
    └── supabase.ts                 # TypeScript types for languages
```

## 🔧 API Functions

### LanguagesAPI Class
```typescript
// Get all languages
LanguagesAPI.getAll()

// Get active languages only
LanguagesAPI.getActive()

// Get language by ID
LanguagesAPI.getById(id)

// Get language by code
LanguagesAPI.getByCode(code)

// Create new language
LanguagesAPI.create(languageData)

// Update language
LanguagesAPI.update(id, updates)

// Delete language
LanguagesAPI.delete(id)

// Toggle active status
LanguagesAPI.toggleActive(id)

// Update sort order
LanguagesAPI.updateSortOrder(id, sortOrder)
```

## 🎨 UI Components

### LanguagesList Component
- **Responsive table** with sortable columns
- **Action buttons** for edit/delete operations
- **Status indicators** for active/inactive languages
- **Loading states** and error handling
- **Empty state** with call-to-action

### LanguageForm Component
- **Modal interface** for create/edit operations
- **Form validation** with real-time feedback
- **Field descriptions** and help text
- **Responsive design** for mobile devices
- **Loading states** during submission

## 🔒 Security Features

### Row Level Security (RLS)
```sql
-- Enable RLS on languages table
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON languages
  FOR ALL USING (auth.role() = 'authenticated');
```

### Validation
- **Unique language codes** enforced at database level
- **Required field validation** in forms
- **Input sanitization** for security
- **Type safety** with TypeScript

## 🎯 Usage Examples

### Adding a New Language
1. Click "Add Language" button
2. Fill in the form:
   - **Name**: "Arabic"
   - **Code**: "ar"
   - **Native Name**: "العربية"
   - **Sort Order**: 11
   - **Active**: ✓
3. Click "Create"

### Editing a Language
1. Click the edit icon (pencil) next to any language
2. Modify the fields as needed
3. Click "Update"

### Toggling Language Status
1. Click the active/inactive status button
2. Language status updates immediately
3. UI reflects the new status

### Deleting a Language
1. Click the delete icon (trash) next to any language
2. Confirm the deletion in the dialog
3. Language is removed from the database

## 🔄 Integration Points

### Frontend Integration
```typescript
import { LanguagesAPI } from '@/lib/api/languages'

// Get active languages for a dropdown
const { data: languages } = await LanguagesAPI.getActive()

// Use in your components
<select>
  {languages?.map(lang => (
    <option key={lang.id} value={lang.code}>
      {lang.name}
    </option>
  ))}
</select>
```

### Backend Integration
```typescript
// Server-side language retrieval
import { createServerSupabase } from '@/lib/supabase/server'

const supabase = await createServerSupabase()
const { data: languages } = await supabase
  .from('languages')
  .select('*')
  .eq('is_active', true)
  .order('sort_order')
```

## 🐛 Troubleshooting

### Common Issues

1. **"Language code already exists"**
   - Check if the language code is already in use
   - Use a different code or edit the existing language

2. **"Failed to fetch languages"**
   - Verify Supabase connection
   - Check RLS policies
   - Ensure user is authenticated

3. **Form validation errors**
   - Check required fields (name, code)
   - Ensure code is lowercase and unique
   - Verify sort order is a number

### Debug Mode
Enable debug logging in your Supabase client:
```typescript
const supabase = createClient(url, key, {
  auth: {
    debug: true
  }
})
```

## 🚀 Next Steps

1. **Customize validation rules** based on your requirements
2. **Add bulk operations** for managing multiple languages
3. **Implement language-specific features** like RTL support
4. **Add translation management** capabilities
5. **Create language-specific content management**

---

🎉 **Your Languages Management System is ready!** Navigate to `/admin/languages` to start managing your application languages.
