import { CardTranslation } from 'src/app/models/card';
import { CardTypeTranslation } from 'src/app/models/card-type';
import { EditionTranslation } from 'src/app/models/edition';
import hungarianEditionTranslations from './editions.hungarian.json';
import hungarianCardTypeTranslations from './card-types.hungarian.json';
import hungarianCardTranslations from './cards.hungarian.json';

export const editionTranslations: EditionTranslation[] = hungarianEditionTranslations;
export const cardTypeTranslations: CardTypeTranslation[] = hungarianCardTypeTranslations;
export const cardTranslations: CardTranslation[] = hungarianCardTranslations;
