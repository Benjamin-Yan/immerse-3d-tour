import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',

        rollupOptions: {
            input: {
                index: fileURLToPath(new URL('index.html', import.meta.url)),
                accordion1: fileURLToPath(
                    new URL('src/turing_study_room/index.html', import.meta.url)
                ),
                accordion2: fileURLToPath(
                    new URL('src/poster_exhibition/index.html', import.meta.url)
                ),
                accordion3: fileURLToPath(
                    new URL('src/arts_exhibition/index.html', import.meta.url)
                ),
            },
        }
    },
});
