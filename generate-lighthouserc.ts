// generate-lighthouserc.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import sitemap from './src/app/sitemap.xml/sitemap';

config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateConfig() {
  console.log('🚀 Generating Lighthouse CI config...');

  // 1. sitemap에서 동적으로 URL 경로를 가져옵니다.
  const sitemapData = await sitemap();
  const urls = sitemapData.map((item) => item.url.replace('https://bsmhub.vercel.app', 'http://localhost:3000'));

  // 2. Lighthouse CI 설정 객체를 만듭니다.
  const config = {
    ci: {
      collect: {
        url: urls,
        startServerCommand: 'npm run start',
      },
      assert: {
        preset: 'lighthouse:recommended',
        assertions: {
          'categories:performance': ['error', { minScore: 0.9 }],
        },
      },
      upload: {
        target: 'lhci',
        token: process.env.LHCI_TOKEN,
        serverBaseUrl: 'https://lhci.insert.team/',
      },
    },
  };

  // 3. 생성된 설정 객체를 lighthouserc.json 파일로 저장합니다.
  fs.writeFileSync(
    path.join(__dirname, '.lighthouserc.json'),
    JSON.stringify(config, null, 2),
    'utf-8',
  );

  console.log('✅ lighthouserc.json file generated successfully!');
  console.log('📊 URLs to be tested:', config.ci.collect.url);
}

// 스크립트 실행
generateConfig();