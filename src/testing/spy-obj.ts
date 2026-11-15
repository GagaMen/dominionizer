import { Signal } from '@angular/core';

// signals are functions, but a spec replaces them by a real signal instead of spying on them
export type SpyObj<T> = {
    -readonly [K in keyof T]: T[K] extends Signal<unknown> ? T[K] : jasmine.SpyObj<T>[K];
};
