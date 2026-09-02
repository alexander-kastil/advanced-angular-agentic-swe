import { Component, DOCUMENT, Injector, computed, declareExperimentalWebMcpTool, inject, signal } from '@angular/core';
import { FormField, email, form, min, minLength, required, submit } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { BoxedDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { JsonPipe } from '@angular/common';

interface BookingModel {
  guest: string;
  guestEmail: string;
  nights: number;
}

@Component({
  selector: 'app-webmcp-form-tool',
  templateUrl: './webmcp-form-tool.component.html',
  imports: [
    MarkdownRendererComponent,
    MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions,
    FormField, MatFormField, MatLabel, MatInput, MatButton,
    BoxedDirective, ColumnDirective, JsonPipe,
  ],
})
export class WebMcpFormToolComponent {
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);

  readonly agentAvailable = signal(this.detectAgentSurface());
  readonly toolLog = signal<string[]>([]);
  readonly confirmation = signal<string | null>(null);

  readonly model = signal<BookingModel>({ guest: '', guestEmail: '', nights: 1 });

  readonly bookingForm = form(
    this.model,
    (s) => {
      required(s.guest, { message: 'Guest name is required' });
      minLength(s.guest, 3, { message: 'At least 3 characters' });
      required(s.guestEmail, { message: 'Email is required' });
      email(s.guestEmail, { message: 'Not a valid email address' });
      min(s.nights, 1, { message: 'At least one night' });
    },
    {
      experimentalWebMcpTool: {
        name: 'fill-booking-form',
        description:
          'Fill the hotel booking form. Accepts guest, guestEmail and nights and reports back which fields are still invalid.',
      },
    },
  );

  readonly invalidFields = computed(() =>
    (['guest', 'guestEmail', 'nights'] as const).filter((key) => this.bookingForm[key]().invalid()),
  );

  constructor() {
    declareExperimentalWebMcpTool(
      {
        name: 'read-booking-form',
        description:
          'Read the current state of the hotel booking form, optionally including the validation errors per field.',
        inputSchema: {
          type: 'object',
          properties: {
            includeErrors: {
              type: 'boolean',
              description: 'Include the validation error messages for every invalid field.',
            },
          },
        },
        execute: (args) => {
          this.log(`read-booking-form(includeErrors: ${args.includeErrors ?? false})`);
          const state = { value: this.model(), valid: this.bookingForm().valid() };
          if (!args.includeErrors) {
            return JSON.stringify(state);
          }
          return JSON.stringify({
            ...state,
            errors: this.invalidFields().map((key) => ({
              field: key,
              messages: this.bookingForm[key]().errors().map((e) => e.message),
            })),
          });
        },
      },
      this.injector,
    );
  }

  book(): void {
    submit(this.bookingForm, async () => {
      this.confirmation.set(`Booked ${this.model().nights} night(s) for ${this.model().guest}`);
      this.log(`submit -> ${this.confirmation()}`);
    });
  }

  simulateAgentCall(): void {
    this.model.set({ guest: 'Ada Lovelace', guestEmail: 'ada@integrations.at', nights: 3 });
    this.log('fill-booking-form({ guest: "Ada Lovelace", guestEmail: "ada@integrations.at", nights: 3 })');
  }

  clearLog(): void {
    this.toolLog.set([]);
  }

  private log(entry: string): void {
    this.toolLog.update((entries) => [...entries, entry]);
  }

  private detectAgentSurface(): boolean {
    const fromDocument = (this.document as unknown as { modelContext?: unknown }).modelContext;
    const fromNavigator = (globalThis.navigator as unknown as { modelContext?: unknown } | undefined)?.modelContext;
    return !!(fromDocument ?? fromNavigator);
  }
}
