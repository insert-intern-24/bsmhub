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
        stage('Check run') {
            steps {
                script {
                    // 추가: 동적 시작 시간 생성 (UTC 기준)
                    def startedAt = new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone('UTC'))
                    def checkRunPayload = groovy.json.JsonOutput.toJson([
                        name: '자동 미리보기 배포',
                        head_sha: env.GIT_COMMIT,
                        status: 'in_progress',
                        external_id: '42',
                        started_at: startedAt,
                        output: [
                            title: 'Check run from Jenkins!',
                            summary: 'This is a check run which has been generated from Jenkins as GitHub App',
                            text: '...and that is awesome'
                        ]
                    ])
                    def response = sh(script: """
                        curl -H "Content-Type: application/json" \\
                            -H "Accept: application/vnd.github.antiope-preview+json" \\
                            -H "authorization: Bearer \$GITHUB_APP_PSW" \\
                            -d '${checkRunPayload}' https://api.github.com/repos/\$REPO_OWNER/\$REPO_NAME/check-runs
                    """, returnStdout: true).trim()
                    def jsonResponse = new groovy.json.JsonSlurper().parseText(response)
                    CHECK_RUN_ID = jsonResponse.id
                }
            }
        }

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
                        |✨ 프리뷰: http://${env.DEPLOY_SERVER}:${PORT}
                        |""".stripMargin()
                    def payload = groovy.json.JsonOutput.toJson([body: comment])
                    sh """
                        curl -X POST \\
                        -H "Authorization: Bearer \$GITHUB_APP_PSW" \\
                        -H "Accept: application/vnd.github.v3+json" \\
                        https://api.github.com/repos/\$REPO_OWNER/\$REPO_NAME/issues/\$CHANGE_ID/comments \\
                        -d '${payload}'
                    """

                    // Check run 상태 업데이트 추가
                    def completedAt = new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone('UTC'))
                    def checkRunCompletePayload = groovy.json.JsonOutput.toJson([
                        name: '자동 미리보기 배포',
                        status: 'completed',
                        conclusion: 'success',
                        completed_at: completedAt,
                        output: [
                            title: 'Check run completed!',
                            summary: 'The check run has been completed successfully.',
                            text: 'Deployment and preview are available.'
                        ]
                    ])
                    sh """
                        curl -X PATCH \\
                        -H "Content-Type: application/json" \\
                        -H "Accept: application/vnd.github.antiope-preview+json" \\
                        -H "authorization: Bearer \$GITHUB_APP_PSW" \\
                        -d '${checkRunCompletePayload}' https://api.github.com/repos/\$REPO_OWNER/\$REPO_NAME/check-runs/\$CHECK_RUN_ID
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
