export interface DemoItem {
  url: string;
  title: string;
  teaches: string;
  sortOrder: number;
  topic: string;
  md: string;
}

export interface DemoDb {
  demos: DemoItem[];
}
