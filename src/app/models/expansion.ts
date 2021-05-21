export interface Expansion {
    id: number;
    name: string;
    icon: string;
}

export type ExpansionTranslation = Pick<Expansion, 'id' | 'name'>;
