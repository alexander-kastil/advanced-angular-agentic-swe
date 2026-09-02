export interface MarkdownItem {
    id: number;
    url: string;
    title: string;
    comment: string;
    saved?: Date;
}

export function createMarkdownItem(partial?: Partial<MarkdownItem>): MarkdownItem {
    return { id: 0, url: '', title: '', comment: '', ...partial };
}
