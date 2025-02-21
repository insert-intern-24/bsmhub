pipeline {
  agent any
  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
        sh 'npm install --os=linux --cpu=x64 sharp'
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