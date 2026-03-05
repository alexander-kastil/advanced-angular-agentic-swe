import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, applyEach, validate, SchemaPathTree } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { JsonPipe } from '@angular/common';

interface PetNicknamesModel {
    petName: string;
    nicknames: string[];
}

const initialData: PetNicknamesModel = {
    petName: '',
    nicknames: [],
};

@Component({
    selector: 'app-sf-arrays',
    templateUrl: './signal-form-arrays.component.html',
    imports: [
        MarkdownRendererComponent,
        MatCard, MatCardHeader, MatCardTitle, MatCardContent,
        FormField, MatFormField, MatLabel, MatInput,
        MatButton, JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SfArraysComponent {
    petModel = signal<PetNicknamesModel>(initialData);

    petForm = form(this.petModel, (s) => {
        required(s.petName, { message: 'Pet name is required' });
        applyEach(s.nicknames, (path) => {
            required(path, { message: 'If added, the nickname cannot be empty' });
            noSpacesOnly(path, { message: 'Nickname cannot be only spaces' });
        });
    });

    addNickname(): void {
        this.petModel.update((m) => ({ ...m, nicknames: [...m.nicknames, ''] }));
    }

    removeNickname(index: number): void {
        this.petModel.update((m) => ({
            ...m,
            nicknames: m.nicknames.filter((_, i) => i !== index),
        }));
    }

    onSubmit(): void {
        if (this.petForm().valid()) {
            console.log('Submitted:', this.petModel());
        }
    }

    onCancel(): void {
        this.petForm().reset(initialData);
    }
}

function noSpacesOnly(field: SchemaPathTree<string>, options?: { message?: string }) {
    validate(field, (ctx) => {
        if (ctx.value().trim().length === 0 && ctx.value().length > 0) {
            return { kind: 'noSpacesOnly', message: options?.message || 'Value cannot be only spaces' };
        }
        return null;
    });
}

