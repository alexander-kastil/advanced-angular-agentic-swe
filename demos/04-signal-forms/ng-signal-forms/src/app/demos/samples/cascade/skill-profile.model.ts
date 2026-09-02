export interface SkillItem {
    techType: string;
    techValues: string;
}

export interface SkillProfile {
    firstName: string;
    lastName: string;
    skills: SkillItem[];
}
