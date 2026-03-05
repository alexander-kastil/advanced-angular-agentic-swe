Enhance markdown documentation for $ARGUMENTS by analyzing source files and rewriting descriptions with consistent tone, proper formatting, and validated links.

## Command Syntax

```
/describe-module [N] [things] for [topic] in the style of [reference doc]
```

**Example:** Describe the 5 demos for signals in the style of the Angular best practices guide.

## Orchestration Flow

Run Tasks A and B in parallel, then C and D in parallel, then E → F sequentially.

### Task A: Analyze Reference Document (parallel with B)

- Extract tone, sentence length, vocabulary, formatting conventions
- Note how features are introduced and how technical details are highlighted

### Task B: Scan Source Files (parallel with A)

- Parse markdown for items to describe
- For each item: navigate to its subfolder, inventory `.ts`, `.html`, readme, images
- Extract component names, key imports, detected technologies

### Task C: Validate Links & Images (after B, parallel with D)

- Check all `[text](url)` references exist
- Fix broken relative paths
- Validate image paths, suggest alt-text fixes

### Task D: Extract Code Snippets (after B, parallel with C)

- Audit existing code blocks for deprecated patterns
- Extract 1-2 short snippets (5-15 lines) per item that illustrate the core concept
- Prefer modern Angular patterns (`@if`, signals, `httpResource`)

### Task E: Generate Descriptions (after A, B, C, D)

For each item, write 2-3 sentences matching reference style:
- Opening: what it demonstrates
- Features: 1-2 standout technical details

**Rules:** No bold/italic in body text. Max 3 sentences per paragraph.

### Task F: Format & Integrate

- Replace descriptions in original markdown
- Add `## Key Topics Covered in This Module` section with validated links
- All code in triple-backtick fences with language identifier
