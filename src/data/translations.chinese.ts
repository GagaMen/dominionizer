import { CardTranslation } from 'src/app/models/card';
import { CardTypeTranslation } from 'src/app/models/card-type';
import { EditionTranslation } from 'src/app/models/edition';
import chineseEditionTranslations from './editions.chinese.json';
import chineseCardTypeTranslations from './card-types.chinese.json';
import chineseCardTranslations from './cards.chinese.json';

export const editionTranslations: EditionTranslation[] = chineseEditionTranslations;
export const cardTypeTranslations: CardTypeTranslation[] = chineseCardTypeTranslations;
export const cardTranslations: CardTranslation[] = chineseCardTranslations;
