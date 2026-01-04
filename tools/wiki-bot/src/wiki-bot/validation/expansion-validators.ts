import { Expansion } from '../../../../../src/app/models/expansion';
import { ExpansionPage } from '../wiki-client/api-models';
import { ValidationResult } from './validation-result';
import Joi from 'joi';
import { JoiValidator } from './joi-validator';
import { AmountValidator } from './amount-validator';

export class ExpansionValidator {
    readonly name: string = 'expansion';

    private joiValidator = new JoiValidator<Expansion>();
    private schema: Joi.ObjectSchema<Expansion> = Joi.object<Expansion>({
        id: Joi.number().required(),
        name: Joi.string().required(),
        icon: Joi.string().required(),
    });

    validate(expansion: Expansion, expansionPage: ExpansionPage): ValidationResult {
        return this.joiValidator.validate(
            expansion,
            this.schema,
            `Expansion (ID: ${expansion.id}, Name: "${expansionPage.title}"):`,
        );
    }
}

export class ExpansionsValidator {
    readonly name: string = 'expansions';

    private amountValidator = new AmountValidator<Expansion, ExpansionPage>();

    validate(expansions: Expansion[], expansionPages: ExpansionPage[]): ValidationResult {
        return this.amountValidator.validate(
            expansions,
            expansionPages,
            'For following expansion pages no expansion was generated:',
        );
    }
}
