import { ImagePage } from './../wiki-client/api-models';
import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import { AmountValidator } from './amount-validator';

export class ImagesValidator implements Validator<[{ id: number }[], ImagePage[]]> {
    readonly name: string = 'images';

    private amountValidator: AmountValidator<{ id: number }, ImagePage> = new AmountValidator();

    validate(images: { id: number }[], ImagePages: ImagePage[]): ValidationResult {
        return this.amountValidator.validate(
            images,
            ImagePages,
            'For following image pages no image was generated:',
        );
    }
}
