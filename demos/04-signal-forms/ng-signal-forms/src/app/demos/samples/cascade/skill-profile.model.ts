export interface SkillItem {
    techType: string;
    techValues: string;
}

export interface SkillProfile {
    firstName: string;
    lastName: string;
    skills: SkillItem[];
}

export const skillCatalog: { type: string; values: string[] }[] = [
    { type: 'Frameworks', values: ['Angular', 'React', '.NET Core', 'Spring'] },
    { type: 'Languages', values: ['TypeScript', 'JavaScript', 'C#', 'Java', 'Python'] },
    { type: 'Cloud', values: ['Azure', 'AWS', 'Google'] },
];
