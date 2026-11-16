import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        include: ['src/**/*.spec.ts'],
        // restore spies created with vi.spyOn after each test, the way jasmine did
        restoreMocks: true,
        // run in random order to reveal specs that depend on each other, the way jasmine did
        sequence: { shuffle: true },
    },
});
