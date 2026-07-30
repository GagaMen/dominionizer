import { CardTranslation } from 'src/app/models/card';
import { CardTypeTranslation } from 'src/app/models/card-type';
import { EditionTranslation } from 'src/app/models/edition';
import koreanEditionTranslations from './editions.korean.json';
import koreanCardTypeTranslations from './card-types.korean.json';
import koreanCardTranslations from './cards.korean.json';

export const editionTranslations: EditionTranslation[] = koreanEditionTranslations;
export const cardTypeTranslations: CardTypeTranslation[] = koreanCardTypeTranslations;
export const cardTranslations: CardTranslation[] = koreanCardTranslations;
