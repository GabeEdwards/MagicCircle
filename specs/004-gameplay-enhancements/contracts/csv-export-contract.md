# Contract: CSV Export Format

**Feature**: [spec.md](../spec.md) | **Version**: 1.0 | **Date**: 2026-08-30

This contract defines the format and contents of exported game results as a CSV file.

---

## Overview

The CSV export contains one row per completed game, ordered newest-first (most recent games first), with columns representing game metadata, participants, outcomes, and performance metrics.

---

## Column Specification

### Header Row

```
Date,Team A Members,Team B Members,Winner,Final Turn,Team A Final Life,Team B Final Life,Team A Elapsed Time (MM:SS),Team B Elapsed Time (MM:SS)
```

### Column Details

| Column | Type | Format | Rules |
|--------|------|--------|-------|
| **Date** | timestamp | ISO 8601 UTC | `YYYY-MM-DDTHH:mm:ssZ` (e.g., `2026-08-30T15:23:45Z`) |
| **Team A Members** | text | Comma-separated | Player names in alphabetical order, enclosed in quotes if contains comma/quote (e.g., `"Gabe, Phil"`) |
| **Team B Members** | text | Comma-separated | Player names in alphabetical order, enclosed in quotes if contains comma/quote (e.g., `"Tung, Siu"`) |
| **Winner** | text | Team identifier | Literal `Team A` or `Team B` |
| **Final Turn** | integer | Decimal | Positive integer representing the turn number at game end (e.g., `5`) |
| **Team A Final Life** | integer | Decimal | Signed integer; may be negative or > 40 (e.g., `-3`, `42`) |
| **Team B Final Life** | integer | Decimal | Signed integer; may be negative or > 40 (e.g., `18`, `52`) |
| **Team A Elapsed Time (MM:SS)** | time | Duration | Format: `MM:SS` for durations < 1 hour, `H:MM:SS` for durations ≥ 1 hour (e.g., `3:45`, `1:23:45`) |
| **Team B Elapsed Time (MM:SS)** | time | Duration | Format: `MM:SS` for durations < 1 hour, `H:MM:SS` for durations ≥ 1 hour (e.g., `2:30`, `0:45:22`) |

---

## Example CSV Content

```csv
Date,Team A Members,Team B Members,Winner,Final Turn,Team A Final Life,Team B Final Life,Team A Elapsed Time (MM:SS),Team B Elapsed Time (MM:SS)
2026-08-30T15:24:00Z,"Gabe, Phil","Tung, Siu",Team A,5,42,-3,3:45,2:30
2026-08-30T14:50:00Z,"Gabe, Anthony","Phil, Siu",Team B,4,5,38,2:15,3:20
2026-08-30T14:10:00Z,"Chris, Kate","Gabe, Tung",Team B,6,2,45,4:30,5:15
```

---

## Encoding and Formatting Rules

### Character Encoding
- UTF-8 with no BOM (Byte Order Mark)
- All player names must be valid UTF-8 strings

### Line Endings
- LF (`\n`) only; no CRLF (`\r\n`)
- No trailing newline after the last data row (optional trailing newline is acceptable)

### Field Delimiter
- Comma (`,`) separates fields
- No spaces around delimiters

### Text Qualification
- Fields containing commas, double quotes, or newlines must be enclosed in double quotes (`"`)
- Example: `"Gabe, Phil"` (with quotes because field contains comma)
- Fields without special characters may be quoted or unquoted (both valid)

### Quote Escaping
- Double quote character (`"`) within a quoted field must be escaped as `""` (two consecutive double quotes)
- Example: If a player name is `O"Brien`, the CSV field would be `"O""Brien"`
- In practice, player names in the fixed pool (Gabe, Phil, Tung, Siu, Anthony, Chris, Kate) contain no special characters, so quoting is primarily for team member lists containing commas

### Timestamp Format
- ISO 8601 UTC format with Z suffix: `YYYY-MM-DDTHH:mm:ssZ`
- Example: `2026-08-30T15:23:45Z` (not `2026-08-30 15:23:45` or other formats)

### Time Format (Elapsed)
- `MM:SS` format for durations less than 1 hour (zero-padded minutes and seconds)
  - Example: `03:45` represents 3 minutes 45 seconds
  - Example: `00:30` represents 30 seconds
  - Example: `45:00` represents 45 minutes
- `H:MM:SS` format for durations ≥ 1 hour (zero-padded minutes and seconds, non-padded hours)
  - Example: `1:23:45` represents 1 hour 23 minutes 45 seconds
  - Example: `2:05:00` represents 2 hours 5 minutes
- No leading zero for hours

### Row Ordering
- Rows are ordered newest-first (most recent game first)
- Matches the default display order in the between-games view

---

## Generation Algorithm

```
1. Get all completed games from local storage
2. Sort by completedAt in descending order (newest first)
3. Create header row: "Date,Team A Members,Team B Members,Winner,Final Turn,Team A Final Life,Team B Final Life,Team A Elapsed Time (MM:SS),Team B Elapsed Time (MM:SS)"
4. For each completed game:
   a. Extract teams, winner, turn number, life totals, timers
   b. Format Team A members: sort alphabetically, join with ", ", quote if contains comma
   c. Format Team B members: sort alphabetically, join with ", ", quote if contains comma
   d. Format winner: "Team A" or "Team B"
   e. Format timestamp: convert completedAt ISO string (use as-is)
   f. Format turn number: toString()
   g. Format final life totals: toString() for both teams
   h. Format elapsed times: convert milliseconds to MM:SS or H:MM:SS
   i. Build row: quote fields as needed per CSV rules, join with commas
5. Join all rows with LF
6. Return CSV string
```

---

## CSV Validation Checklist

After generation, validate:
- ✓ Header row present
- ✓ All data rows have exactly 9 columns
- ✓ All timestamps are valid ISO 8601 format
- ✓ Turn numbers are positive integers
- ✓ Life totals are integers (may be negative or > 40)
- ✓ Elapsed times are in MM:SS or H:MM:SS format (both present if multi-hour game exists)
- ✓ Winner is "Team A" or "Team B"
- ✓ No unescaped double quotes within fields
- ✓ All fields are properly delimited by commas

---

## Browser Download Mechanism

### File Generation
1. Build CSV string per algorithm above
2. Create Blob with type `text/csv;charset=utf-8`
3. Create URL via `URL.createObjectURL(blob)`
4. Create temporary `<a>` element with href set to blob URL
5. Set `download` attribute to filename (e.g., `magic-circle-games-2026-08-30.csv`)
6. Append to DOM (required for some browsers)
7. Trigger click event
8. Remove temporary element from DOM
9. Revoke blob URL via `URL.revokeObjectURL(url)`

### Filename Convention
- Format: `magic-circle-games-<YYYY-MM-DD>.csv`
- Date component represents the export date (not necessarily when games occurred)
- Example: `magic-circle-games-2026-08-30.csv`

### Browser Behavior
- User sees a save dialog (in most browsers) allowing download directory selection
- File is saved to device's default download location
- No server upload or cloud sync involved

---

## Backward Compatibility

### Games Without Timer Data

If a completed game was created in Feature 001 (before Feature 004) and lacks timer data:
- **Team A Elapsed Time (MM:SS)**: `0:00` (zero)
- **Team B Elapsed Time (MM:SS)**: `0:00` (zero)
- Add a note in CSV export or UI indicating missing data: "Historical games lack timer data"

### Import to Spreadsheet Applications

- Excel: Opens CSV directly; auto-detects encoding
- Google Sheets: Opens CSV directly; may prompt for delimiter/encoding confirmation
- LibreOffice Calc: Opens CSV directly; no special handling needed
- Apple Numbers: Opens CSV directly; may need to adjust timestamp interpretation

No special import instructions required; standard CSV handling in all applications.

---

## Security Considerations

### No Sensitive Data Exposure
- CSV contains only game data (teams, outcomes, times)
- No device identifiers, IP addresses, or authentication tokens
- No personally identifiable information beyond player names (from fixed pool)

### Integrity
- CSV is generated locally; no external transmission
- No digital signature or checksum added (not required for casual use case)

### User Control
- User explicitly triggers export via UI button
- User selects save location (via browser save dialog)
- User owns the exported file

---

## Future Enhancement Points

Potential future features (not in scope for Feature 004):
- Date range filtering (export only games between X and Y dates)
- Team filter (export only games involving specific players)
- Aggregated statistics (win rates, total games per player, etc.)
- Additional columns (players per team, game duration, etc.)
- Compress to ZIP if many files generated
- Schedule automatic exports

