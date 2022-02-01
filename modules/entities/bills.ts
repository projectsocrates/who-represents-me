export interface ChicagoBills {
  status: string;
  date: string;
  sponsor: string;
  id: string;
  title: string;
  link: string;
  tags: string[];
}

export type Bills = ChicagoBills;

export type Locales = 'Chicago';
