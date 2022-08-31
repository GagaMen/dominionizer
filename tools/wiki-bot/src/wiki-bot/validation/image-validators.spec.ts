import { ImagePage } from '../wiki-client/api-models';
import { ImagesValidator } from './image-validators';
import { ValidationResult } from './validation-result';

describe('image validators', () => {
    describe('ImagesValidator', () => {
        const validator = new ImagesValidator();

        describe('validate', () => {
            it('with valid image amount should return Success', () => {
                const images: { id: number }[] = [{ id: 1 }, { id: 2 }];
                const imagePages: ImagePage[] = [
                    { pageid: 1 } as ImagePage,
                    { pageid: 2 } as ImagePage,
                ];
                const expected = ValidationResult.Success;

                const actual = validator?.validate(images, imagePages);

                expect(actual).toEqual(expected);
            });

            it('with no image for image page should return Failure', () => {
                const images: { id: number }[] = [{ id: 1 }];
                const imagePages: ImagePage[] = [
                    { pageid: 1 } as ImagePage,
                    { pageid: 2, title: 'Image 2' } as ImagePage,
                    { pageid: 3, title: 'Image 3' } as ImagePage,
                ];
                const expected = ValidationResult.Failure(
                    'For following image pages no image was generated:\nImage 2\nImage 3',
                );

                const actual = validator?.validate(images, imagePages);

                expect(actual).toEqual(expected);
            });
        });
    });
});
