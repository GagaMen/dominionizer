import { AmountValidator } from './amount-validator';
import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CardPage, CardTypePage } from '../wiki-client/api-models';
import { JoiValidator } from './joi-validator';
import * as Joi from 'joi';
import { ValidationResult } from './validation-result';
import { existsSync } from 'fs';

export class CardDtoValidator {
    readonly name: string = 'card dto';

    private imageFileMustExist: Joi.CustomValidator<string> = (
        value: string,
        helpers: Joi.CustomHelpers,
    ) => {
        return existsSync(`${this.targetPath}/card_art/${value}`)
            ? value
            : helpers.message({
                  custom: `"${value}" must exist. Is category "Card art" assigned to the corresponding image page?`,
              });
    };

    private joiValidator: JoiValidator<CardDto> = new JoiValidator();
    private schema: Joi.ObjectSchema<CardDto> = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required().custom(this.imageFileMustExist),
        wikiUrl: Joi.string()
            .uri({ scheme: ['http', 'https'] })
            .required(),
        expansions: Joi.array().items(Joi.number()).min(1).required(),
        types: Joi.array().items(Joi.number()).min(1).required(),
        isKingdomCard: Joi.boolean().required(),
        cost: Joi.number().integer().min(0).required(),
        costModifier: Joi.string().valid('P', '*', '+').optional(),
        debt: Joi.number().integer().min(0).optional(),
    });

    constructor(private targetPath: string) {}

    validate(card: CardDto, page: CardPage | CardTypePage): ValidationResult {
        return this.joiValidator.validate(
            card,
            this.schema,
            `Card Dto (ID: ${card.id}, Name: "${page.title}"):`,
        );
    }
}

export class CardDtosValidator {
    readonly name: string = 'card dtos';

    private amountValidator: AmountValidator<CardDto, CardPage> = new AmountValidator();

    validate(cards: CardDto[], cardPages: CardPage[]): ValidationResult {
        return this.amountValidator.validate(
            cards,
            cardPages,
            'For following card pages no card was generated:',
        );
    }
}
