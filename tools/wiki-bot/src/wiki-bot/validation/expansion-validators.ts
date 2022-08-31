import { Expansion } from '../../../../../src/app/models/expansion';
import { ExpansionPage } from '../wiki-client/api-models';
import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import * as Joi from 'joi';
import { JoiValidator } from './joi-validator';
import { AmountValidator } from './amount-validator';

export class ExpansionValidator implements Validator<[Expansion, ExpansionPage]> {
    readonly name: string = 'expansion';

    private joiValidator: JoiValidator<Expansion> = new JoiValidator();
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

export class ExpansionsValidator implements Validator<[Expansion[], ExpansionPage[]]> {
    readonly name: string = 'expansions';

    private amountValidator: AmountValidator<Expansion, ExpansionPage> = new AmountValidator();

    validate(expansions: Expansion[], expansionPages: ExpansionPage[]): ValidationResult {
        return this.amountValidator.validate(
            expansions,
            expansionPages,
            'For following expansion pages no expansion was generated:',
        );
    }
}
