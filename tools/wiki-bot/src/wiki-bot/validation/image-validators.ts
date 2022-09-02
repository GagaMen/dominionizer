import { EncodedImage } from './../builder/image-builder';
import { ImagePage } from './../wiki-client/api-models';
import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import { AmountValidator } from './amount-validator';

export class ImagesValidator implements Validator<[EncodedImage[], ImagePage[]]> {
    readonly name: string = 'images';

    private amountValidator: AmountValidator<EncodedImage, ImagePage> = new AmountValidator();

    validate(images: EncodedImage[], ImagePages: ImagePage[]): ValidationResult {
        return this.amountValidator.validate(
            images,
            ImagePages,
            'For following image pages no image was generated:',
        );
    }
}
