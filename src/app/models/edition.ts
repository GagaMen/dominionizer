export interface Edition {
    id: string;
    expansion: string;
    edition: string;
    icon: string;
}

export type EditionTranslation = Pick<Edition, 'id' | 'expansion'>;
