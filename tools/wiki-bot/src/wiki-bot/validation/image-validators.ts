import { EncodedImage } from './../builder/image-builder';
import { ImagePage } from './../wiki-client/api-models';
import { ValidationResult } from './validation-result';
import { AmountValidator } from './amount-validator';

export class ImagesValidator {
    readonly name: string = 'images';

    private amountValidator: AmountValidator<EncodedImage, ImagePage> = new AmountValidator();

    validate(images: EncodedImage[], imagePages: ImagePage[]): ValidationResult {
        return this.amountValidator.validate(
            images,
            imagePages,
            'For following image pages no image was generated:',
        );
    }
}
