import { defineConfig } from 'astro/config'
import { VitePWA } from 'vite-plugin-pwa'

// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// https://astro.build/config
export default defineConfig({
	vite: {
    build: {
      sourcemap: true
    },
		plugins: [
      VitePWA({
        srcDir: './src',
        filename: 'sw.ts',
        strategies: 'injectManifest',
        devOptions: {
          enabled: true,
          type: 'module',
        },
      })
    ],
	},
});

