---
name: Describe Module
description: This prompt is used to describe a module
agent: agent
model: Claude Haiku 4.5 (copilot)
--# Documentation Enhancement

## Goal

Enhance markdown documentation by analyzing source files and reference documents, then rewriting descriptions with consistent tone, proper formatting, and validated links/images using sub-agent orchestration.

## Command Syntax

```
Describe the [N] [things] for [topic] in the style of [reference doc].
```

**Example:**
```
Describe the 5 demos for signals in the style of Angular best practices guide. Not too detailed but mention any standout technical details.
```

---

## Orchestration Flow

```
Main Agent: Parse command + identify target file + reference doc
    ↓
    ├─→ [Parallel] Task A: Analyze reference document
    └─→ [Parallel] Task B: Scan source files & folder structure
              ↓
    ├─→ [Parallel] Task C: Validate links & images
    └─→ [Parallel] Task D: Extract & audit code snippets
              ↓
    ├─→ [Sequential after C & D] Task E: Generate descriptions
    └─→ [Sequential after E] Task F: Format & integrate
              ↓
Synthesize & present enhanced markdown
```

---

## Sub-Agent Task Definitions

### Task A: Analyze Reference Document
**Trigger:** After reference document identified  
**Runs in Parallel with:** Task B  
**Input:** Reference document path (e.g., Angular best practices guide, style guide URL)  
**Output:** Style profile, tone markers, formatting patterns

**Process:**

1. **Read reference document:**
   - Extract opening paragraphs (introductory tone)
   - Identify section structures and headings
   - Note formatting conventions (bold, italics, code blocks, lists)

2. **Analyze writing style:**
   - Sentence length: short + punchy vs. long + detailed?
   - Vocabulary: technical jargon vs. accessible language?
   - Tone: formal vs. casual, instructive vs. narrative?
   - Description length: 1 sentence, 2-3 sentences, paragraphs?

3. **Extract key patterns:**
   - How are features introduced? (e.g., "What it demonstrates", "Primary use case")
   - How are technical details highlighted? (callouts, bold, inline)
   - How are links formatted? (`[text](url)` style, footnotes, etc.)
   - Example description from reference (to use as template)

4. **Return:**
   - [tone: string, sentenceMaxLength: number, preferredStructure: string, exampleDescription: string, formattingRules: {}]

---

### Task B: Scan Source Files & Folder Structure
**Trigger:** After target file/folder identified  
**Runs in Parallel with:** Task A  
**Input:** Markdown file path + folder containing source files  
**Output:** Inventory of items to describe, extracted metadata

**Process:**

1. **Identify target items:**
   - Parse markdown file for items to describe (indicated by `[N] [things]` in command)
   - For each item, extract:
     - Current description (if exists)
     - Associated folder path (if nested)
     - Existing links/files mentioned
     - Any code examples present

2. **Scan source folders:**
   - For each item, navigate to corresponding subfolder
   - Inventory files: `.ts`, `.html`, `readme.md`, images, etc.
   - Extract:
     - Feature descriptions from readme.md (H1, introduction)
     - Component/service names from file naming
     - Key imports or technologies used
     - File structure and key entry points

3. **Identify assets:**
   - List image files (`*.png`, `*.jpg`, `*.svg`) with relative paths
   - List markdown files that could be linked
   - Note any script files (`.sh`, `package.json` for npm commands)

4. **Return:**
   - [items: [{ name, folderPath, currentDescription, files: [], images: [], readme: string, detectedTech: [] }]]

---

### Task C: Validate Links & Images
**Trigger:** After Task B completes  
**Depends on:** Item inventory from Task B  
**Runs in Parallel with:** Task D  
**Input:** Current markdown content + image/link references  
**Output:** Link validation report, image path fixes, broken link flags

**Process:**

1. **Validate all existing links:**
   - For each `[text](url)` in original markdown:
     - Check if URL is relative to repo (starts with `./` or `../`)
     - Verify target file/folder exists
     - Fix relative paths if necessary
     - Flag external URLs for review

2. **Validate all images:**
   - For each image reference `![alt](path)`:
     - Check if file exists at path
     - Verify common formats: `.png`, `.jpg`, `.svg`, `.gif`
     - Try to fix broken paths (search for image name in folder tree)
     - Suggest better alt-text if missing

3. **Extract new links from source analysis:**
   - From Task B findings, identify files worth linking:
     - readme.md files (overview)
     - Component files (code reference)
     - Example scripts or configs
   - Format as `[file name](./path/to/file)`

4. **Return:**
   - [validLinks: [], brokenLinks: [{ text, oldPath, suggestedPath }], images: [{ alt, path, isValid, suggestedPath }], newLinks: []]

---

### Task D: Extract & Audit Code Snippets
**Trigger:** After Task B completes  
**Depends on:** Source file inventory from Task B  
**Runs in Parallel with:** Task C  
**Input:** Source code files, existing code snippets in markdown  
**Output:** Code snippet recommendations, audit findings

**Process:**

1. **Audit existing code snippets:**
   - For each code block in original markdown:
     - Check if code is still relevant (no files deleted)
     - Verify syntax is valid for declared language
     - Check for deprecated patterns (old Angular syntax, etc.)
     - Mark as "outdated" if better patterns exist

2. **Extract relevant code samples from source:**
   - Scan component `.ts` files for:
     - Class declarations and key methods
     - Standalone component decorators (if relevant)
     - Signal usage, service injection, route params
   - Scan `.html` templates for:
     - Control flow syntax (`@if`, `@for`, `@switch`)
     - Directives and attribute bindings
     - Component composition

3. **Select snippet candidates:**
   - Choose 1-2 snippets max per description that:
     - Illustrate the core concept/feature
     - Are short (5-15 lines ideal)
     - Show modern Angular patterns
     - Are not boilerplate code

4. **Prepare snippet blocks:**
   - Extract exact code from files
   - Add language identifier (e.g., `typescript`, `html`)
   - Add descriptive comments if helpful (max 1-2)
   - Ready for markdown fence formatting

5. **Return:**
   - [snippets: [{ file, language, code, relevance: "high"|"medium"|"low" }], outdatedSnippets: [], updateRecommendations: []]

---

## Dependent Execution Tasks

### Task E: Generate Descriptions
**Trigger:** After Tasks A, B, C, D complete  
**Depends on:** Style profile (A) + source inventory (B) + validated links (C) + code snippets (D)  
**Input:** Style profile + item metadata + recommended code snippets  
**Output:** Rewritten description copy for each item

**Process:**

1. **For each item in source inventory:**
   - Extract: name, detected technologies, key features, readme summary
   - Reference style profile from Task A to set:
     - Sentence length
     - Tone (formal vs. casual)
     - Description structure (opening + features + technical detail)

2. **Structure description:**
   - **Opening:** What it demonstrates (1 sentence)
     - Example: "Demonstrates standalone components without NgModule"
   - **Features:** 1-2 standout technical details (1-2 sentences)
     - Example: "Declare dependencies directly in the component decorator with imports, providers, and styles"
   - **Optional:** If code snippet is illustrative, note: "(See example below)"

3. **Apply formatting rules from Task A:**
   - No bold/italic formatting in body text
   - Max 3 sentences per paragraph
   - Keep paragraphs short (2-3 lines visual)
   - Separate multiple items with blank lines

4. **Return:**
   - [descriptions: [{ itemName, description: string, codeSnippet: string|null, suggestedLinks: [] }]]

---

### Task F: Format & Integrate Output
**Trigger:** After Task E completes  
**Depends on:** Generated descriptions + validated links + images  
**Input:** Generated descriptions + original markdown structure  
**Output:** Enhanced markdown file, integrations complete

**Process:**

1. **Replace descriptions in original markdown:**
   - Locate each item in original file
   - Preserve list structure and ordering
   - Insert new description text
   - Add code snippets where suggested

2. **Integrate images:**
   - For each image from Task C:
     - Add valid image references `![caption](path)`
     - Place close to relevant description
     - Use fixed absolute paths where possible

3. **Add link section:**
   - Create `## Key Topics Covered in This Module` section at end (if not exists)
   - Compile all validated links from Task C
   - Group by type: component readmes, code files, external resources
   - Format as markdown list: `- [text](path)`

4. **Format code blocks:**
   - All code snippets in triple-backtick fences
   - Language identifier (typescript, html, bash, etc.)
   - Proper indentation preserved

5. **Final checks:**
   - No broken internal links
   - All images render correctly
   - Consistent spacing between items
   - No double-blank-lines or oversized gaps

6. **Return:**
   - [enhancedMarkdown: string, filesModified: [], linksIntegrated: number, imagesIntegrated: number]

---

## Output Summary

**Enhanced Markdown includes:**

```markdown
## [Item Name]

[Description - 2-3 sentences max, no bold/italic]

[Optional code snippet if illustrative]

[Another item...]

## Key Topics Covered in This Module

- [Component readme](./01-components/)
- [Service guide](./01-components/guide.md)
- [External reference](https://angular.io/...)
```

---

## Key Rules Reference

| Requirement | Rule |
|---|---|
| **Description length** | 2-3 sentences max per paragraph |
| **Formatting** | No bold/italic in body text (code blocks are OK) |
| **Paragraph separation** | One blank line between items |
| **Images** | Valid paths, descriptive captions, integrated into flow |
| **Links** | Relative paths (`./` prefix), validated for existence |
| **Code snippets** | Max 15 lines, one per item, language identifier required |
| **Section header** | `## Key Topics Covered in This Module` (consistent naming) |
| **Reference style** | Match tone/structure of provided reference document |

---

## Task Execution Model

- **Parallel discovery:** A ∥ B (independent analysis of reference + source)
- **Parallel validation:** C ∥ D (after B completes — links/images vs. code snippets)
- **Sequential generation:** E → F (descriptions must be generated before formatting/integration)
- **Non-breaking:** Tasks A-D never modify files; only E-F apply changes
- **Validation-first:** All links, images, code verified before integration
