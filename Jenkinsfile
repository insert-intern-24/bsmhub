import org.kohsuke.github.GitHubBuilder

pipeline {
    agent any
    environment {
        REGISTRY = "10.3.0.130:5000"
        IMAGE_NAME = "bsmhub"
        SUPABASE_KEY = credentials('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        GOOGLE_CLIENT = credentials('NEXT_PUBLIC_GOOGLE_CLIENT_ID')
        NEXT_PUBLIC_SUPABASE_URL="https://bsmhubsp.obtuse.kr"
        CONTAINER_NAME = "bsmhub-${env.BRANCH_NAME}"
        DEPLOY_SERVER = "10.3.0.130"
        DEPLOY_CREDS = credentials('DEPLOY_SERVER_CREDS')
        REPO_OWNER = "insert-intern-24"
        REPO_NAME = "bsmhub"
        GITHUB_APP = credentials('GITHUB_APP_CREDENTIALS')
    }
    stages {
        stage('Create GitHub Deployment') {
            when {
                expression { env.CHANGE_ID != null }
            }
            steps {
                script {
                    def github = new GitHubBuilder()
                        .withEndpoint('https://api.github.com')
                        .withOAuthToken(GITHUB_APP)
                        .build()
                    def repo = github.getRepository("${REPO_OWNER}/${REPO_NAME}")
                    
                    def deployment = repo.createDeployment(env.BRANCH_NAME)
                        .environment('preview')
                        .autoMerge(false)
                        .create()

                    DEPLOYMENT_ID = deployment.getId()
                }
            }
        }
        stage('Find Available Port') {
            steps {
                script {
                    def remote = [:]
                    remote.name = 'deploy-server'
                    remote.host = env.DEPLOY_SERVER
                    remote.allowAnyHosts = true
                    remote.user = DEPLOY_CREDS_USR
                    remote.password = DEPLOY_CREDS_PSW
                    
                    // PORT 설정 방식 변경
                    PORT = sshCommand(
                        remote: remote,
                        command: '''
                            for port in $(seq 4000 4999); do
                                if ! netstat -tna | grep -q ":$port "; then
                                    echo "$port"
                                    exit 0
                                fi
                            done
                        '''
                    ).trim()
                    
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
                    sh "cat .env.local"
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    def imageTag = "${env.REGISTRY}/${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                    sh "docker build -t ${imageTag} ."
                    sh "docker push ${imageTag}"
                }
            }
        }


        stage('Deploy to Remote Server') {
            steps {
                script {
                    def imageTag = "localhost:5000/${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                    def remote = [:]
                    remote.name = 'deploy-server'
                    remote.host = env.DEPLOY_SERVER
                    remote.allowAnyHosts = true
                    remote.user = DEPLOY_CREDS_USR
                    remote.password = DEPLOY_CREDS_PSW
                    
                    // Copy env file to remote server
                    sshPut remote: remote, from: '.env.local', into: '/tmp/'
                    
                    // Execute deployment commands on remote server
                    sshCommand remote: remote, command: """
                        docker rm -f ${env.CONTAINER_NAME} || true
                        docker pull ${imageTag}
                        docker run -d \\
                            --name ${env.CONTAINER_NAME} \\
                            -p ${PORT}:3000 \\
                            --restart unless-stopped \\
                            --env-file /tmp/.env.local \\
                            ${imageTag}
                        rm /tmp/.env.local
                    """
                }
            }
        }

        stage('Update Deployment Status') {
            when {
                expression { env.CHANGE_ID != null && DEPLOYMENT_ID != null }
            }
            steps {
                script {
                    def github = new GitHubBuilder()
                        .withEndpoint('https://api.github.com')
                        .withOAuthToken(GITHUB_APP)
                        .build()
                    def repo = github.getRepository("${REPO_OWNER}/${REPO_NAME}")
                    
                    repo.createDeploymentStatus(DEPLOYMENT_ID)
                        .state('success')
                        .targetUrl("http://${env.DEPLOY_SERVER}:${PORT}")
                        .description('Deployment finished successfully!')
                        .create()
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
                    
                    sh """
                        curl -X POST \
                        -H "Authorization: Bearer ${GITHUB_APP}" \
                        -H "Accept: application/vnd.github.v3+json" \
                        https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${env.CHANGE_ID}/comments \
                        -d '{"body": "${comment}"}'
                    """
                }
            }
        }

        stage('Clean Up') {
            steps {
                sh """
                    docker image prune -f
                    rm .env.local
                """
            }
        }
    }
}