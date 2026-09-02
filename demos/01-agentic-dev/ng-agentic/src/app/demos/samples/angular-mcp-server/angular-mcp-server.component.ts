import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface McpTool {
  name: string;
  title: string;
  stability: 'stable' | 'experimental';
  readOnly: boolean;
  localOnly: boolean;
  purpose: string;
  askFor: string;
}

interface HostConfig {
  host: string;
  file: string;
  snippet: string;
}

@Component({
  selector: 'app-angular-mcp-server',
  templateUrl: './angular-mcp-server.component.html',
  styleUrl: './angular-mcp-server.component.scss',
  imports: [CodeBlockComponent]
})
export class AngularMcpServerComponent {
  readonly tools: McpTool[] = [
    {
      name: 'list_projects',
      title: 'List Angular Projects',
      stability: 'stable',
      readOnly: true,
      localOnly: true,
      purpose:
        'Returns every workspace, project, builder, prefix, style language and target from angular.json. The server instructions make it the mandatory first call.',
      askFor: 'Which Angular projects are in this repo?'
    },
    {
      name: 'get_best_practices',
      title: 'Get Angular Coding Best Practices Guide',
      stability: 'stable',
      readOnly: true,
      localOnly: true,
      purpose:
        'Returns the guide that matches the installed framework version. Pass workspacePath and you get the v22 rules, omit it and you get the generic one.',
      askFor: 'Load the Angular best practices for this workspace before you write code.'
    },
    {
      name: 'search_documentation',
      title: 'Search Angular Documentation (angular.dev)',
      stability: 'stable',
      readOnly: true,
      localOnly: false,
      purpose:
        'Searches the angular.dev index for a given major version. The only tool that leaves the machine, so --local-only drops it.',
      askFor: 'What replaced *ngIf in Angular 22? Cite the docs page.'
    },
    {
      name: 'run_target',
      title: 'Run Project Target',
      stability: 'stable',
      readOnly: false,
      localOnly: true,
      purpose:
        'Runs an architect target such as build, test or lint and returns the real output. Stable in 22.1, no opt-in flag needed.',
      askFor: 'Run the build target for ng-agentic and fix what fails.'
    },
    {
      name: 'devserver_start',
      title: 'Start Development Server',
      stability: 'stable',
      readOnly: false,
      localOnly: true,
      purpose: 'Starts ng serve in the background and returns the URL the agent can then inspect.',
      askFor: 'Serve ng-agentic so we can look at the demo page.'
    },
    {
      name: 'devserver_wait_for_build',
      title: 'Wait for Devserver Build',
      stability: 'stable',
      readOnly: true,
      localOnly: true,
      purpose:
        'Blocks until the running dev server finishes a rebuild and reports its diagnostics. This is what makes an edit-and-check loop reliable.',
      askFor: 'Wait for the rebuild, then tell me if it compiled clean.'
    },
    {
      name: 'devserver_stop',
      title: 'Stop Development Server',
      stability: 'stable',
      readOnly: false,
      localOnly: true,
      purpose: 'Stops a dev server the agent started, so no stray process survives the session.',
      askFor: 'Stop the dev server you started.'
    },
    {
      name: 'onpush_zoneless_migration',
      title: 'Plan migration to OnPush and/or zoneless',
      stability: 'stable',
      readOnly: true,
      localOnly: true,
      purpose:
        'Analyses zone.js usage and drives the file-by-file migration to OnPush and a zoneless application.',
      askFor: 'Plan the zoneless migration for this app.'
    },
    {
      name: 'ai_tutor',
      title: 'Start Angular AI Tutor',
      stability: 'stable',
      readOnly: true,
      localOnly: true,
      purpose:
        'Loads a guided tutoring prompt so the agent teaches an Angular topic instead of writing the code for you.',
      askFor: 'Teach me signal forms, do not write the code for me.'
    }
  ];

  readonly hostConfigs: HostConfig[] = [
    {
      host: 'Claude Code',
      file: '.mcp.json',
      snippet: `{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}`
    },
    {
      host: 'VS Code / Copilot',
      file: '.vscode/mcp.json',
      snippet: `{
  "servers": {
    "angular-cli": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}`
    },
    {
      host: 'Hardened (read-only, offline)',
      file: '.mcp.json',
      snippet: `{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp", "--read-only", "--local-only"]
    }
  }
}`
    }
  ];

  readonly onlyReadOnly = signal(false);
  readonly onlyLocal = signal(false);
  readonly selectedName = signal(this.tools[0].name);
  readonly selectedHost = signal(this.hostConfigs[0].host);

  readonly visibleTools = computed(() =>
    this.tools.filter(
      (tool) =>
        (!this.onlyReadOnly() || tool.readOnly) && (!this.onlyLocal() || tool.localOnly)
    )
  );

  readonly selected = computed(
    () => this.visibleTools().find((tool) => tool.name === this.selectedName()) ?? this.visibleTools()[0]
  );

  readonly host = computed(
    () => this.hostConfigs.find((entry) => entry.host === this.selectedHost()) ?? this.hostConfigs[0]
  );

  readonly droppedCount = computed(() => this.tools.length - this.visibleTools().length);

  readonly experimentalCount = computed(
    () => this.tools.filter((tool) => tool.stability === 'experimental').length
  );

  select(name: string): void {
    this.selectedName.set(name);
  }

  selectHost(host: string): void {
    this.selectedHost.set(host);
  }

  toggleReadOnly(): void {
    this.onlyReadOnly.update((value) => !value);
  }

  toggleLocal(): void {
    this.onlyLocal.update((value) => !value);
  }
}
