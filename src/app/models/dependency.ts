import { Card } from './card';
import { Material } from './material';

export type Dependency =
    | CardDependency
    | PlayerMatDependency
    | SplitPileDependency
    | TokenDependency;

export interface CardDependency {
    card: Card;
    type: DependencyType.Card;
}

export interface PlayerMatDependency {
    material: Material;
    type: DependencyType.PlayerMat;
}

export interface SplitPileDependency {
    card: Card;
    type: DependencyType.SplitPile;
}

export interface TokenDependency {
    material: Material;
    type: DependencyType.Token;
}

export enum DependencyType {
    Card = 1,
    PlayerMat,
    SplitPile,
    Token,
}
