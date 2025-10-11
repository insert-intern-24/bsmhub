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
        stage('Determine Port') {
            steps {
                script {
                    if (env.CHANGE_ID != null) {
                        // PR인 경우: PR 번호를 기반으로 포트 계산 (4000 + PR번호)
                        def prNumber = env.CHANGE_ID as Integer
                        PORT = (4000 + (prNumber % 1000)).toString()
                        echo "PR #${env.CHANGE_ID} using fixed port: ${PORT}"
                        
                        // 기존 컨테이너가 해당 포트를 사용 중인지 확인
                        def existingContainer = sh(script: "docker ps -q -f name=${env.CONTAINER_NAME}", returnStdout: true).trim()
                        if (existingContainer) {
                            echo "✅ Found existing container ${env.CONTAINER_NAME} - will be replaced"
                        } else {
                            echo "ℹ️  No existing container found - will create new one"
                        }
                    } else {
                        // 일반 브랜치인 경우: 사용 가능한 포트 찾기
                        PORT = sh(script: '''
                                for port in $(seq 4000 4999); do
                                    if ! netstat -tna | grep -q ":$port "; then
                                        echo "$port"
                                        exit 0
                                    fi
                                done
                                echo "4000"  # Fallback port if none found
                            ''', returnStdout: true).trim()
                        echo "Branch deployment using available port: ${PORT}"
                    }
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

        stage('PR Preview Comment') {
            when {
                expression { env.CHANGE_ID != null } // PR인 경우에만 실행
            }
            steps {
                script {
                    def comment = """🚀 배포 준비중
                        |
                        | 고정포트 : `${PORT}` (PR #${env.CHANGE_ID} 전용)
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

        stage('Stop and Remove Existing Container') {
            steps {
                script {
                    echo "Checking for existing container: ${env.CONTAINER_NAME}"
                    def existingContainer = sh(script: "docker ps -aq -f name=${env.CONTAINER_NAME}", returnStdout: true).trim()
                    
                    if (existingContainer) {
                        echo "Found existing container: ${existingContainer}"
                        echo "Stopping and removing container: ${env.CONTAINER_NAME}"
                        sh """
                            docker stop ${env.CONTAINER_NAME} || true
                            docker rm ${env.CONTAINER_NAME} || true
                        """
                        echo "Successfully removed existing container"
                    } else {
                        echo "No existing container found with name: ${env.CONTAINER_NAME}"
                    }
                }
            }
        }

        stage('Deploy New Container') {
            steps {
                script {
                    def imageTag = "${env.REGISTRY}/${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                    echo "Deploying new container: ${env.CONTAINER_NAME} on port ${PORT}"
                    sh """
                        docker run -d \\
                            --name ${env.CONTAINER_NAME} \\
                            -p ${PORT}:3000 \\
                            --restart unless-stopped \\
                            --env-file .env.local \\
                            ${imageTag}
                    """
                    
                    // 컨테이너가 정상적으로 시작되었는지 확인
                    sh """
                        sleep 3
                        if docker ps | grep -q ${env.CONTAINER_NAME}; then
                            echo "✅ Container ${env.CONTAINER_NAME} is running successfully"
                        else
                            echo "❌ Container ${env.CONTAINER_NAME} failed to start"
                            docker logs ${env.CONTAINER_NAME}
                            exit 1
                        fi
                    """
                }
            }
        }

        stage('Update PR Comment') {
            when {
                expression { env.CHANGE_ID != null } // PR인 경우에만 실행
            }
            steps {
                script {
                    def comment = """🚀 배포 완료!
                        |
                        |✨ 개발서버 프리뷰: http://${env.DEPLOY_SERVER}:${PORT}
                        |📌 고정포트: `${PORT}` (PR #${env.CHANGE_ID} 전용)
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
