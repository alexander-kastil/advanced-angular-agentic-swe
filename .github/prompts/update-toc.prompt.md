---
name: update-toc
description: Validate and synchronize Table of Contents (TOCs) in demos/*/readme.md files. Ensures TOCs match the filesystem structure, using subfolder readme.md H1 headings as titles when available. Filesystem is the source of truth.
--# Validate & Sync Demo TOCs

## Goal

Traverse all `readme.md` files in the `demos/*` directory, validate that Tables of Contents (TOCs) match the filesystem (authoritative source), and optionally auto-fix discrepancies using sub-agent orchestration.

## Input Parameters

Specify in your prompt:

- **`path`**: Directory pattern to scan (default: `demos/*/readme.md`)
- **`fixMode`**: `true` to auto-update TOCs, `false` to report only (default: `false`)
- **`depth`**: Maximum nesting depth for TOC entries (default: `2`)
  - `1`: List only immediate subfolders (flat list)
  - `2`: Include one level deeper (nested), showing sub-topics under parent items
  - `n`: Recursive nesting for all levels with subdirectories

---

## Orchestration Flow

```
Main Agent: Identify path pattern + params
    ↓
    ├─→ [Parallel] Task A: Discover existing TOCs
    └─→ [Parallel] Task B: Audit filesystem structure
              ↓
    ├─→ [Sequential after A & B] Task C: Validate TOCs
    └─→ [Sequential after C] Task D: Generate fixes/suggestions
              ↓
Synthesize Report (fixMode=false) OR Apply Fixes (fixMode=true)
    ↓
Output: Summary report + (optionally) updated files
```

---

## Sub-Agent Task Definitions

### Task A: Discover Existing TOCs
**Trigger:** After path pattern confirmed  
**Runs in Parallel with:** Task B  
**Input:** Path pattern (e.g., `demos/*/readme.md`), depth setting  
**Output:** Structured TOC map for each readme, orphaned links flagged

**Process:**

1. **Find all matching readme.md files:**
   - Glob scan for `demos/*/readme.md` (or custom path)
   - Record file path and parent directory (the "module path")

2. **Extract existing TOC from each file:**
   - Identify markdown sections that list links (usually under a heading like "## Topics", "## Demos", "## Contents")
   - Extract all `[text](./subfolder/)` or `[text](subfolder/)` patterns
   - Record link text, target path, relative position (line number), nesting level
   - Preserve formatting (indentation, bullet style)

3. **Detect orphaned links:**
   - For each link, verify target folder exists
   - Flag links pointing to non-existent subfolders
   - Flag links to excluded folders (e.g., `_images`, `_templates`)

4. **Return:**
   - [readmeFile, modulePath, existingTOC: [{ text, path, lineNum, nestLevel, isOrphaned }], orphanedCount]

---

### Task B: Audit Filesystem Structure
**Trigger:** After path pattern confirmed  
**Runs in Parallel with:** Task A  
**Input:** Module paths from Task A, depth setting, file exclusion patterns  
**Output:** Authoritative subfolder list with extracted titles

**Process:**

1. **For each module directory:**
   - List all immediate subfolders
   - Exclude: `_images`, `_templates`, `_assets`, `.hidden`, etc.
   - Sort alphabetically by folder name

2. **For each qualifying subfolder, extract title:**
   - **Derive from folder name:**
     - Remove numeric prefix (e.g., `01-` → remove)
     - Replace hyphens with spaces (e.g., `ai-assisted-coding` → `ai assisted coding`)
     - Capitalize each word (e.g., `ai assisted coding` → `AI Assisted Coding`)
   - **Look for readme.md H1 in subfolder:**
     - Parse first `# Heading` in `subfolder/readme.md` (if exists)
     - If H1 is more polished/accurate than folder name, use it
     - Apply decision rule: **Pick whichever reads most professional**
   - **Never use made-up labels** — title MUST be either folder-derived OR H1

3. **Build expected TOC structure:**
   - Format entries as `- [Title](./subfolder/)`
   - Use relative links with `./` prefix
   - Maintain order (alphanumeric by folder name)
   - Apply depth nesting (if depth=2, show two levels; if depth=1, flat)

4. **Return:**
   - [modulePath, authoritative: [{ folder, folderDerivedTitle, h1Title, chosenTitle, depth }], totalFolders]

---

### Task C: Validate TOCs Against Filesystem
**Trigger:** After Task A & B complete  
**Depends on:** Task A (existing TOCs) + Task B (authoritative structure)  
**Input:** Existing TOC map + authoritative TOC structure  
**Output:** Validation report with categorized discrepancies

**Process:**

1. **For each module:**
   - Compare existing TOC entries (from Task A) with authoritative folders (from Task B)

2. **Categorize findings:**
   - **Missing entries:** Subfolders in filesystem NOT in existing TOC
   - **Orphaned entries:** TOC links pointing to non-existent folders
   - **Title mismatches:** TOC title doesn't match folder-derived OR H1 title
   - **Format issues:** Links using inconsistent relative format (e.g., missing `./` prefix)
   - **Ordering issues:** TOC entries not in alphanumeric order

3. **Flag severity:**
   - **Critical:** Broken links, major structural gaps
   - **Warning:** Title mismatches, format inconsistencies
   - **Info:** Minor ordering issues

4. **Return:**
   - [readmeFile, isInSync: boolean, issues: [{ category, severity, detail, affectedEntries }]]

---

### Task D: Generate Fixes/Suggestions
**Trigger:** After Task C completes  
**Depends on:** Validation report from Task C  
**Input:** Existing TOC + authoritative structure + validation findings  
**Output:** Recommended patches, updated TOC content (do NOT apply yet)

**Process:**

1. **For each discrepancy found in Task C:**
   - Generate specific fix action:
     - **Missing entry:** Add `- [Title](./folder/)` at appropriate position
     - **Orphaned entry:** Remove line
     - **Title mismatch:** Update text to match authoritative title (folder-derived or H1)
     - **Format issue:** Normalize link format to `./folder/` style
     - **Ordering issue:** Re-sort entries alphabetically

2. **Regenerate full expected TOC:**
   - Apply all fixes in order
   - Preserve section header (detect current header: "## Topics", "## Demos", etc.)
   - Maintain consistent markdown formatting
   - Use consistent bullet style (all `-` or all `*`)

3. **If depth > 1, structure nested TOC:**
   - Group subfolders hierarchically
   - Indent nested entries with proper bullet characters
   - Verify no duplicate or conflicting nesting

4. **Return:**
   - [readmeFile, patchActions: [{ action, lineNum, oldContent, newContent }], newTOCContent]

---

## Execution Task

### Task E: Apply Fixes or Report
**Trigger:** After Task D completes, depends on fixMode parameter  
**Input:** Patches from Task D  
**Output:** Updated files OR report document

**If fixMode=true:**
- Apply all patches from Task D sequentially
- Write updated files to disk
- Confirm each file update
- Return: [filesUpdated: [], filesSkipped: []]

**If fixMode=false:**
- Compile comprehensive validation report
- Show each file status: ✓ in sync, ⚠️ needs updates
- List specific additions/removals/title updates per file
- Return: Report document (stdout or markdown file)

---

## Output Report Format

**If fixMode=false (Validation Report):**

```markdown
# TOC Validation Report

## Summary
- Total files scanned: N
- In sync: M
- Needs updates: K
- Critical issues: J

## Details

### demos/01-components/readme.md
✓ In sync (8 entries)

### demos/02-reactive/readme.md
⚠️ Updates needed:
  - **Added:** Advanced Patterns (04-advanced)
  - **Removed:** Deprecated Topic (ob 2)
  - **Updated:** Introduction title (was "Getting Started", now "Introduction")
  
### demos/03-signals/readme.md
❌ Critical issues:
  - **Orphaned link:** ./legacy-signals/ (folder does not exist)
  - **Missing entry:** New Feature (07-new-feature) — folder exists but not listed
```

**If fixMode=true (Update Report):**

```markdown
# TOC Update Summary

## Changes Applied

### demos/01-components/readme.md
✓ Updated (2 changes):
  - Added: Advanced Patterns (04-advanced)
  - Updated: Introduction title

### demos/02-reactive/readme.md
✓ No changes needed

### demos/03-signals/readme.md
✓ Updated (2 changes):
  - Removed: ./legacy-signals/ (orphaned)
  - Added: New Feature (07-new-feature)

## Files Updated: 2/12
## Files Skipped: 0/12
```

---

## Entry Selection Rules Reference

| Scenario                        | Action                | Example                                                                                  |
| ------------------------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| **Folder with readme.md**       | Use folder name or H1 | `01-local/` → `[Local](./01-local/)` OR better H1 if available                           |
| **Folder without readme.md**    | Use folder name       | `07-context-window/` → `[Context Window](./07-context-window/)`                          |
| **Numeric prefix in name**      | Extract digits        | `01-fundamentals` → `Fundamentals` (remove 01-)                                          |
| **Hyphens in folder name**      | Convert spaces        | `ai-assisted-coding` → `AI Assisted Coding`                                              |
| **Short folder name + good H1** | Prefer H1             | `04-sdk/` → `SDK` (folder) vs `# GitHub Copilot SDK` (H1) → use **`GitHub Copilot SDK`** |
| **Multiple words**              | Capitalize each       | `pull-requests-code-review` → `Pull Requests Code Review`                                |

---

## Best Practices

- **Filesystem is authoritative:** Folder names and structure are the source of truth
- **Derive titles systematically:** Remove numeric prefixes, convert hyphens to spaces, capitalize
- **Prefer readable titles:** If readme.md H1 is more professional, use it (readability > literal)
- **Never invent labels:** Title MUST come from folder name OR H1 — never made-up text
- **Consistent format:** All links use `[Title](./folder/)` with `./` prefix
- **Single-level default:** Most TOCs list immediate subfolders only (no deep nesting)
- **Exclude utility folders:** Always skip `_images`, `_templates`, `.assets`, etc.
- **Preserve structure:** Keep TOC near module heading, maintain section header consistency
- **Parallelizable tasks:** A & B run together, C waits for both, D waits for C
