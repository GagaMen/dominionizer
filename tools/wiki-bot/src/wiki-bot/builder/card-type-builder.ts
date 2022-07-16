import { CardType } from '../../../../../src/app/models/card-type';
import { CardTypePage } from '../wiki-client/api-models';

export class CardTypeBuilder {
    build(cardTypePage: CardTypePage): CardType {
        return {
            id: cardTypePage.pageid,
            name: cardTypePage.title,
        };
    }
}
