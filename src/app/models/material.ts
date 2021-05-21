export interface Material {
    id: number;
    name: string;
    image: string;
}

export type MaterialTranslation = Pick<Material, 'id' | 'name'>;
