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
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
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

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Find Available Port') {
            steps {
                script {
                    // 포트를 찾고 직접 변수에 할당
                    def foundPort = sh(
                        script: '''
                            for port in $(seq 3000 4000); do
                                if ! netstat -tna | grep -q ":$port "; then
                                    echo "$port"
                                    exit 0
                                fi
                            done
                        ''',
                        returnStdout: true
                    ).trim()
                    
                    // 포트 설정 확인
                    echo "Found available port: ${foundPort}"
                    env.PORT = foundPort
                    sh "echo 'Selected PORT is: ${env.PORT}'"
                }
            }
        }

        stage('Deploy with PM2') {
            steps {
                script {
                    // PORT 환경변수 확인
                    sh "echo 'Using PORT: ${env.PORT}'"
                    
                    // PM2 실행
                    sh """
                        PORT=${env.PORT} pm2 delete bsmhub-${env.BRANCH_NAME} || true
                        PORT=${env.PORT} pm2 start npm --name bsmhub-${env.BRANCH_NAME} -- start
                    """
                }
            }
        }

        stage('Setup Cloudflared') {
            steps {
                script {
                    // PORT 환경변수 확인
                    sh "echo 'Cloudflared using PORT: ${env.PORT}'"
                    
                    sh "pm2 delete cloudflared-${env.BRANCH_NAME} || true"
                    
                    sh """
                        PORT=${env.PORT} pm2 start cloudflared --name cloudflared-${env.BRANCH_NAME} -- tunnel --url http://localhost:${env.PORT}
                        sleep 5
                    """
                    
                    // 로그에서 URL 추출
                    def tunnelUrl = sh(
                        script: """
                            pm2 logs cloudflared-${env.BRANCH_NAME} --nostream --lines 50 | grep -o 'https://.*\\.trycloudflare\\.com' | tail -n 1
                        """,
                        returnStdout: true
                    ).trim()
                    
                    env.TUNNEL_URL = tunnelUrl
                    env.NEXT_PUBLIC_SITE_URL = tunnelUrl
                    
                    sh """
                        echo "NEXT_PUBLIC_SITE_URL=${env.NEXT_PUBLIC_SITE_URL}" >> .env.local
                        pm2 reload bsmhub-${env.BRANCH_NAME} -- --port ${env.PORT} --update-env
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