# Event Schedule Display Fix

## Problem
Event schedule data exists in the Supabase `events` table but was not displaying on the event details page on the website.

## Root Cause
1. **TypeScript types were out of sync** - The `event_schedule`, `requirements`, `includes`, and `organizer` columns existed in the database but were not defined in the TypeScript type definitions.
2. **API not selecting columns** - The events API was not explicitly selecting the new columns.
3. **Parsing logic incomplete** - The schedule parsing logic in `getEvents()` was not handling all data formats properly.

## Changes Made

### 1. Updated Supabase TypeScript Types (`src/integrations/supabase/types.ts`)
Added missing columns to the `events` table interface:
```typescript
event_schedule: Json | null;
requirements: Json | null;
includes: Json | null;
organizer: string | null;
```

### 2. Updated Events Fetcher (`src/lib/events-fetcher.ts`)
- Added new columns to the SELECT query
- Enhanced parsing logic to read from `event_schedule` column first, with fallback to `additional_info`
- Updated `EventData` interface to include new database columns
- Improved schedule parsing to handle both JSONB arrays and text formats

### 3. Updated API (`src/lib/api.ts`)
- Enhanced `getEvents()` function to properly parse `event_schedule` data
- Added comprehensive schedule parsing that handles:
  - JSONB arrays: `[{"time": "6:00 PM", "activity": "Activity"}]`
  - Text format with line breaks
  - Various time formats (12-hour with AM/PM, ranges, etc.)
- Both `agenda` and `event_schedule` properties are now populated with the same parsed data

## Database Schema
The events table has the following columns for event details:
- `"event schedule"` (TEXT) - **Column name has a SPACE!** String with newline-separated schedule items
- `requirements` (JSONB) - Array of requirement strings
- `includes` (JSONB) - Array of what's included strings
- `organizer` (TEXT) - Event organizer name
- `capacity` (INTEGER) - Total event capacity
- `additional_info` (JSONB) - Optional JSON for extra data like long_description

**IMPORTANT**: The column is named `"event schedule"` with a space, not `event_schedule` with an underscore. This requires special handling in queries.

## How to Verify the Fix

### 1. Check Database Data
Run this query in Supabase SQL Editor (note the quotes around "event schedule"):
```sql
SELECT id, title, "event schedule", requirements, includes, organizer
FROM events
LIMIT 5;
```

### 2. Check Browser Console
When viewing an event details page:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for event data logs showing the parsed schedule

### 3. Verify Schedule Display
1. Navigate to any event details page (e.g., `/events/trivia-friday`)
2. Scroll to the "Event Schedule" section
3. The schedule should display with:
   - Time in the left column (formatted as "6:00 PM")
   - Activity description in the right column

### 4. Expected Data Format in Database
The `"event schedule"` column (TEXT type) should contain newline-separated schedule items like:
```
6:00 PM - Welcome & Team Formation
7:15 PM - Round 1: General Knowledge
8:15 PM - Final Round & Results
```

Or it can be JSON-formatted text:
```json
[
  {"time": "6:00 PM", "activity": "Welcome & Team Formation"},
  {"time": "7:15 PM", "activity": "Round 1: General Knowledge"},
  {"time": "8:15 PM", "activity": "Final Round & Results"}
]
```

The parser handles both formats!

## Troubleshooting

### If schedule still doesn't show:

1. **Check if data exists in database:**
   ```sql
   SELECT title, "event schedule" FROM events WHERE "event schedule" IS NOT NULL;
   ```

2. **Verify data format:**
   - TEXT format: Each line should have time and activity (e.g., "6:00 PM - Welcome")
   - JSON format: Should be valid JSON array with `time` and `activity` keys
   - Parser handles both formats automatically

3. **Check browser console for errors:**
   - Look for parsing errors
   - Check if event data is being fetched correctly

4. **Verify the event is using database data:**
   - Check console logs for "Using database events, not sample events"
   - If using sample events, database connection may be failing

### Common Issues:

1. **Column name with space:** The column is `"event schedule"` (with space), not `event_schedule` (underscore). Queries must use double quotes.

2. **Wrong data format:** The column is TEXT type. It can contain:
   - Newline-separated text: `"6:00 PM - Activity\n7:00 PM - Next Activity"`
   - JSON string: `'[{"time":"6:00 PM","activity":"Welcome"}]'`
   
3. **Empty schedule:** If the column is NULL or empty string, the "Schedule Coming Soon" message will display (this is expected behavior).

4. **Missing time or activity:** Items without an `activity` field will be filtered out automatically.

## Testing Checklist
- [ ] Event schedule displays on event details page
- [ ] Schedule shows formatted times (e.g., "6:00 PM")
- [ ] Schedule shows activity descriptions
- [ ] Empty schedules show "Schedule Coming Soon" message
- [ ] Requirements section displays correctly
- [ ] Includes section displays correctly
- [ ] Organizer name displays correctly

## Files Modified
1. `src/integrations/supabase/types.ts` - Added missing column types
2. `src/lib/events-fetcher.ts` - Updated SELECT query and parsing logic
3. `src/lib/api.ts` - Enhanced schedule parsing in `getEvents()`

## Migration Status
The following migrations create the necessary columns:
- `20250814075201_event_details_extension.sql` - Creates initial columns
- `20250821121000_add_missing_event_columns.sql` - Adds agenda column
- `20250827000000_rename_agenda_to_event_schedule.sql` - Renames to event_schedule
- `20250902090000_rename_event_schedule_column.sql` - Handles edge cases

All migrations should already be applied if the database is up to date.

