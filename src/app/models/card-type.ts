export interface CardType {
    id: number;
    name: string;
}

export type CardTypeTranslation = Pick<CardType, 'id' | 'name'>;
