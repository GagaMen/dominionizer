import { CardDto, CardDtoV2 } from '../../../../../src/app/dtos/card-dto';
import { CardPage, CardTypePage } from '../wiki-client/api-models';
import { JoiValidator } from './joi-validator';
import Joi from 'joi';
import { ValidationResult } from './validation-result';
import { existsSync } from 'fs';

export class CardDtoValidator {
    readonly name: string = 'card dto';

    private imageFileMustExist: Joi.CustomValidator<string> = (
        value: string,
        helpers: Joi.CustomHelpers<string>,
    ) => {
        return existsSync(`${this.targetPath}/assets/card_art/${value}`)
            ? value
            : helpers.message({
                  custom: `"${value}" must exist. Is category "Card art" assigned to the corresponding image page?`,
              });
    };

    private joiValidator = new JoiValidator<CardDtoV2>();
    private schema: Joi.ObjectSchema<CardDtoV2> = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required().custom(this.imageFileMustExist),
        illustrator: Joi.string().required(),
        wikiUrl: Joi.string()
            .uri({ scheme: ['http', 'https'] })
            .required(),
        editions: Joi.array().items(Joi.string()).min(1).required(),
        types: Joi.array().items(Joi.string()).min(1).required(),
        isKingdomCard: Joi.boolean().required(),
        cost: Joi.number().integer().min(0).required(),
        costModifier: Joi.string().valid('P', '*', '+').optional(),
        debt: Joi.number().integer().min(0).optional(),
    });

    constructor(private targetPath: string) {}

    validate(_card: CardDto, _page: CardPage | CardTypePage): ValidationResult {
        return ValidationResult.Success;
    }

    validateFromCargo(card: CardDtoV2): ValidationResult {
        return this.joiValidator.validate(
            card,
            this.schema,
            `Card Dto (ID: ${card.id}, Name: "${card.name}"):`,
        );
    }
}

export class CardDtosValidator {
    readonly name: string = 'card dtos';

    validate(_cards: CardDto[], _cardPages: CardPage[]): ValidationResult {
        return ValidationResult.Success;
    }
}
