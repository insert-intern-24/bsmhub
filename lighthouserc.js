import { getStaticRoutes } from './src/app/sitemap.xml/sitemap.ts';

const staticPaths = await getStaticRoutes();

const config = {
  ci: {
    collect: {
      url: staticPaths.map((path) => `http://localhost:3000${path}`),
      startServerCommand: 'npm run start',
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

console.log(config.ci.collect.url);

export default config;
