import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // restore spies created with vi.spyOn after each test, the way jasmine did
        restoreMocks: true,
    },
});
