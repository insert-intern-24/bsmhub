pipeline {
  agent any
  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Prepare for build') {
      steps {
        sh '''echo "import type { NextConfig } from \'next\';
const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};




export default nextConfig;" > next.config.ts'''
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

  }
}