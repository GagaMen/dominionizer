export interface CardDto {
  id: number;
  name: string;
  description?: string;
  expansions: number[];
  types: number[];
  cost?: number;
  debt?: number;
  points?: number;
  money?: number;
  draws?: number;
  actions?: number;
  purchases?: number;
  potion?: boolean;
}
