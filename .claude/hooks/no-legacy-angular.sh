#!/usr/bin/env bash
# The hook receives the whole PreToolUse payload on stdin, not as arguments.
payload="$(cat)"

# -o prints only the matched text, so file_path arrives without its JSON key.
file="$(printf '%s' "$payload" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"\([^"]*\)"$/\1/')"
case "$file" in
  *.ts|*.html) ;;
  *) exit 0 ;;
esac

# The gate guards the lab workbench only; the demos teach these APIs deliberately.
# The bracket class matches either path separator without naming a backslash.
case "$file" in
  labs[!A-Za-z0-9]*|*[!A-Za-z0-9]labs[!A-Za-z0-9]*) ;;
  *) exit 0 ;;
esac

# Anti-patterns from CLAUDE.md that the compiler accepts and the course rejects.
patterns='\*ngIf|\*ngFor|\*ngSwitch|@Input\(\)|@Output\(\)|ngClass|ngStyle|@HostBinding|@HostListener|standalone:[[:space:]]*true'

hits="$(printf '%s' "$payload" | grep -oE "$patterns" | sort -u | tr '\n' ' ')"
if [ -n "$hits" ]; then
  echo "Legacy Angular API in $file: $hits. See the anti-pattern table in CLAUDE.md." >&2
  # Exit 2 blocks the tool call and returns stderr to the agent.
  exit 2
fi
exit 0
