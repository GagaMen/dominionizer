import { Expansion } from '../../../../../src/app/models/expansion';
import { ExpansionPage } from '../wiki-client/api-models';
import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import * as Joi from 'joi';
import { JoiValidator } from './joi-validator';

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
            `Expansion (ID: ${expansion.id}, Name: "${expansionPage.title}"):\n`,
        );
    }
}

export class ExpansionsValidator implements Validator<[Expansion[], ExpansionPage[]]> {
    readonly name: string = 'expansions';

    validate(expansions: Expansion[], expansionPages: ExpansionPage[]): ValidationResult {
        const expansionPagesWithoutExpansion = expansionPages
            .filter(
                (expansionPage) =>
                    !expansions.some((expansion) => expansion.id === expansionPage.pageid),
            )
            .map((expansionPage) => expansionPage.title);

        return expansionPagesWithoutExpansion.length === 0
            ? ValidationResult.Success
            : ValidationResult.Failure(
                  'For following expansion pages no expansion was generated:\n' +
                      expansionPagesWithoutExpansion.join('\n'),
              );
    }
}
