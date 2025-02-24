pipeline {
    agent any
    environment {
        REGISTRY = '10.3.0.130:5000'
        IMAGE_NAME = 'bsmhub'
        SUPABASE_KEY = credentials('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        GOOGLE_CLIENT = credentials('NEXT_PUBLIC_GOOGLE_CLIENT_ID')
        NEXT_PUBLIC_SUPABASE_URL = 'https://bsmhubsp.obtuse.kr'
        CONTAINER_NAME = "bsmhub-${env.BRANCH_NAME}"
        DEPLOY_SERVER = '10.3.0.127'
        DEPLOY_CREDS = credentials('DEPLOY_SERVER_CREDS')
        REPO_OWNER = 'insert-intern-24'
        REPO_NAME = 'bsmhub'
        GITHUB_APP = credentials('GITHUB_APP_CREDENTIALS')
    }
    stages {
        stage('Find Available Port') {
            steps {
                script {
                    PORT = sh(script: '''
                            for port in $(seq 4000 4999); do
                                if ! netstat -tna | grep -q ":$port "; then
                                    echo "$port"
                                    exit 0
                                fi
                            done
                            echo "4000"  # Fallback port if none found
                        ''', returnStdout: true).trim()

                    echo "Found port: ${PORT}"
                }
            }
        }

        stage('Create env file') {
            steps {
                script {
                    writeFile file: '.env.local', text: """
                        NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY}
                        NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT}
                        NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
                        NEXT_PUBLIC_SITE_URL=http://${DEPLOY_SERVER}:${PORT}
                    """.stripIndent()
                    sh 'cat .env.local'
                }
            }
        }

        stage('PR Preview') {
            when {
                expression { env.CHANGE_ID != null } // PR인 경우에만 실행
            }
            steps {
                script {
                    def comment = """🚀 배포 준비중
                        |
                        | 예상포트 : `${PORT}`
                        |""".stripMargin()
                    def payload = groovy.json.JsonOutput.toJson([body: comment])
                    sh """
                        curl -X POST \\
                        -H "Authorization: Bearer $GITHUB_APP_PSW" \\
                        -H "Accept: application/vnd.github.v3+json" \\
                        https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${env.CHANGE_ID}/comments \\
                        -d '${payload}'
                    """
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    def imageTag = "${env.REGISTRY}/${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                    sh "docker build -t ${imageTag} ."
                }
            }
        }

        stage('Deploy to Remote Server') {
            steps {
                script {
                    def imageTag = "${env.REGISTRY}/${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                    sh """
                        docker rm -f ${env.CONTAINER_NAME} || true
                        docker run -d \\
                            --name ${env.CONTAINER_NAME} \\
                            -p ${PORT}:3000 \\
                            --restart unless-stopped \\
                            --env-file .env.local \\
                            ${imageTag}
                    """
                }
            }
        }

        stage('Update PR') {
            when {
                expression { env.CHANGE_ID != null } // PR인 경우에만 실행
            }
            steps {
                script {
                    def comment = """🚀 배포 완료!
                        |
                        |✨ 개발서버 프리뷰: http://${env.DEPLOY_SERVER}:${PORT}
                        |
                        | Cloudflare WARP VPN을 통한 내부망 접근 필수, Google One Tab Login 사용 불가능
                        |""".stripMargin()
                    def payload = groovy.json.JsonOutput.toJson([body: comment])
                    sh """
                        curl -X POST \\
                        -H "Authorization: Bearer \$GITHUB_APP_PSW" \\
                        -H "Accept: application/vnd.github.v3+json" \\
                        https://api.github.com/repos/\$REPO_OWNER/\$REPO_NAME/issues/\$CHANGE_ID/comments \\
                        -d '${payload}'
                    """
                }
            }
        }

        stage('Clean Up') {
            steps {
                sh '''
                    docker image prune -f
                    rm .env.local
                '''
            }
        }
    }
}
