import { ProviderToken, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { MockedObject } from 'vitest';

// signals are functions, but a spec replaces them by a real signal instead of mocking them
export type SpyObj<T> = {
    -readonly [K in keyof T]: T[K] extends Signal<unknown> ? T[K] : MockedObject<T>[K];
};

/** Returns the test double a spec provided for the given token, typed as mock. */
export function injectSpy<T>(token: ProviderToken<T>): SpyObj<T> {
    return TestBed.inject(token) as unknown as SpyObj<T>;
}
