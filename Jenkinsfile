pipeline {
    agent any
    environment {
        SUPABASE_KEY = credentials('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        GOOGLE_CLIENT = credentials('NEXT_PUBLIC_GOOGLE_CLIENT_ID')
        PORT = ''
        TUNNEL_URL = ''
        NEXT_PUBLIC_SUPABASE_URL="https://bsmhubsp.obtuse.kr"
        NEXT_PUBLIC_SITE_URL = ''
    }
    stages {
      stage("Install Dependencies") {
          steps {
            sh "npm install"
            sh 'npm install --os=linux --cpu=x64 sharp'
          }
      }

        stage('Prepare for build') {
            steps {
                sh '''
                    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY}" > .env.local
                    echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT}" >> .env.local
                    echo "NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}" >> .env.local
                    
                    echo "import type { NextConfig } from 'next';
                    const nextConfig: NextConfig = {
                        typescript: {
                            ignoreBuildErrors: true,
                        },
                        eslint: {
                            ignoreDuringBuilds: true,
                        },
                    };
                    export default nextConfig;" > next.config.ts
                '''
            }
        }

        stage('Find Available Port') {
            steps {
                script {
                    // 전역 변수로 포트 저장
                    PORT = sh(
                        script: '''#!/bin/bash
                            for port in $(seq 4000 5000); do
                                if ! netstat -tna | grep -q ":$port "; then
                                    echo "$port"
                                    exit 0
                                fi
                            done
                        ''',
                        returnStdout: true
                    ).trim()
                    
                    // 환경 변수 설정
                    env.PORT = PORT
                    
                    // 설정된 포트 확인
                    echo "Found port: ${PORT}"
                    sh """
                        echo "PORT=${PORT}" >> .env.local
                        echo "NEXT_PUBLIC_SITE_URL=10.3.0.127:${PORT}" >> .env.local
                    """
                }
            }
        }

        stage("Build") {
          steps {
              sh "npm run build"
            }
          }
      }

        // stage('Setup Cloudflared') {
        //     steps {
        //         script {
        //             sh """
        //                 pm2 delete cloudflared-${env.BRANCH_NAME} || true
        //                 pm2 start cloudflared --name cloudflared-${env.BRANCH_NAME} -- tunnel --url http://localhost:${PORT}
        //                 sleep 5
        //             """
                    
        //             def tunnelUrl = sh(
        //                 script: """
        //                     pm2 logs cloudflared-${env.BRANCH_NAME} --nostream --lines 50 | grep -o 'https://.*\\.trycloudflare\\.com' | tail -n 1
        //                 """,
        //                 returnStdout: true
        //             ).trim()
                    
        //             env.TUNNEL_URL = tunnelUrl
        //             env.NEXT_PUBLIC_SITE_URL = tunnelUrl
                    
        //             sh """
        //                 echo "NEXT_PUBLIC_SITE_URL=${env.NEXT_PUBLIC_SITE_URL}" >> .env.local
        //             """
        //             echo "Cloudflare URL: ${tunnelUrl}"
        //             echo "Cloudflare URLEnv: ${env.TUNNEL_URL}"

        //         }
        //     }
        // }

        stage('Deploy with PM2') {
            steps {
                script {
                    sh """
                        pm2 delete bsmhub-${env.BRANCH_NAME} || true
                        PORT=${PORT} pm2 start npm --name bsmhub-${env.BRANCH_NAME} -- start
                        pm2 save
                    """
                }
            }
        }

    //     stage('Update PR') {
    //         steps {
    //             script {
    //                 def comment = """
    //                     🚀 배포가 완료되었습니다!
                        
    //                     - 배포 URL: ${env.TUNNEL_URL}
    //                     - 포트: ${env.PORT}
    //                     - 브랜치: ${env.BRANCH_NAME}
    //                 """
                    
    //                 withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_TOKEN')]) {
    //                     sh """
    //                         curl -X POST \
    //                             -H "Authorization: token ${GITHUB_TOKEN}" \
    //                             -H "Accept: application/vnd.github.v3+json" \
    //                             https://api.github.com/repos/BSM-Deploy/bsmhub/issues/${env.CHANGE_ID}/comments \
    //                             -d '{"body": "${comment}"}'
    //                     """
    //                 }
    //             }
    //         }
    //     }
    // }
    
    // post {
    //     failure {
    //         script {
    //             withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_TOKEN')]) {
    //                 sh """
    //                     curl -X POST \
    //                         -H "Authorization: token ${GITHUB_TOKEN}" \
    //                         -H "Accept: application/vnd.github.v3+json" \
    //                         https://api.github.com/repos/BSM-Deploy/bsmhub/issues/${env.CHANGE_ID}/comments \
    //                         -d '{"body": "❌ 배포 중 오류가 발생했습니다. Jenkins 로그를 확인해주세요."}'
    //                 """
    //             }
    //         }
    //     }
    }
}