export type SpyObj<T> = {
  -readonly [k in keyof jasmine.SpyObj<T>]: jasmine.SpyObj<T>[k];
};
