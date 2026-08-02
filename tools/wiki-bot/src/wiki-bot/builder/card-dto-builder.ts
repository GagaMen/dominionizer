import { CardTypePage, CargoCard } from './../wiki-client/api-models';
import { CardType } from './../../../../../src/app/models/card-type';
import { CardPage, WikiText } from '../wiki-client/api-models';
import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { extractTemplate, extractTemplatePropertyValue, normalize } from './helper-functions';
import { Edition } from 'src/app/models/edition';
import { buildCargoId } from './cargo-id';

export class CardDtoBuilder {
    build(
        cargoCard: CargoCard,
        page: CardPage | CardTypePage,
        editions: Edition[],
        cardTypes: CardType[],
    ): CardDto {
        const wikiText: WikiText = page.revisions[0].slots.main['*'] ?? '';
        const infoBox: WikiText = extractTemplate(wikiText, 'Infobox');

        return {
            id: buildCargoId(cargoCard),
            name: cargoCard.Name,
            description: this.extractDescription(infoBox),
            image: cargoCard.Art.replaceAll(' ', '_'),
            illustrator: cargoCard.Illustrator,
            wikiUrl: page.fullurl,
            editions: this.determineEditionIds(cargoCard, editions),
            types: this.determineCardTypeIds(cargoCard, cardTypes),
            isKingdomCard: cargoCard.Purpose === 'Kingdom Pile',
            cost: Number(cargoCard.CostCoin),
            costModifier: this.determineCostModifier(cargoCard),
            debt: this.determineCostDebt(cargoCard),
        };
    }

    private determineEditionIds(cargoCard: CargoCard, editions: Edition[]) {
        const cargoEditions = cargoCard.Edition.split('&');
        const editionIds: string[] = [];
        for (const edition of editions) {
            if (
                edition.expansion === cargoCard.Expansion &&
                cargoEditions.includes(edition.edition)
            ) {
                editionIds.push(edition.id);
            }
        }
        return editionIds;
    }

    private determineCardTypeIds(cargoCard: CargoCard, cardTypes: CardType[]) {
        const cargoCardTypes = cargoCard.Types.split('-');
        const typeIds: string[] = [];
        for (const cardType of cardTypes) {
            if (cargoCardTypes.includes(cardType.name)) {
                typeIds.push(cardType.id);
            }
        }
        return typeIds;
    }

    private extractDescription(infoBox: WikiText): string {
        const text: WikiText = normalize(
            extractTemplatePropertyValue(infoBox, 'text').replace(/<br\/>/g, '<br>'),
        );
        const text2: WikiText = normalize(
            extractTemplatePropertyValue(infoBox, 'text2').replace(/<br\/>/g, '<br>'),
        );

        return text2 ? `${text}{{divline}}${text2}` : text;
    }

    private determineCostModifier(cargoCard: CargoCard): string | undefined {
        if (cargoCard.CostExtra !== '') {
            return cargoCard.CostExtra;
        }

        if (cargoCard.CostPotion === '1') {
            return 'P';
        }

        return undefined;
    }

    private determineCostDebt(cargoCard: CargoCard): number | undefined {
        return cargoCard.CostDebt !== '' ? Number(cargoCard.CostDebt) : undefined;
    }
}
