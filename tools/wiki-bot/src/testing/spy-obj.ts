import type { Mock, MockedObject } from 'vitest';

export type SpyObj<T> = T & { [K in keyof T]: MockedObject<T>[K] };

/** Types an object of mocks as the class it stands in for. */
export function createSpyObj<T>(mocks: Partial<Record<keyof T, Mock>>): SpyObj<T> {
    return mocks as unknown as SpyObj<T>;
}
