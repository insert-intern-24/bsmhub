pipeline {
    agent any
    environment {
        REGISTRY = "10.3.0.130:5000"
        IMAGE_NAME = "bsmhub"
        SUPABASE_KEY = credentials('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        GOOGLE_CLIENT = credentials('NEXT_PUBLIC_GOOGLE_CLIENT_ID')
        PORT = ''
        NEXT_PUBLIC_SUPABASE_URL="https://bsmhubsp.obtuse.kr"
        CONTAINER_NAME = "bsmhub-${env.BRANCH_NAME}"
        DEPLOY_SERVER = "10.3.0.130"
        DEPLOY_CREDS = credentials('DEPLOY_SERVER_CREDS')
    }
    stages {
        stage('Find Available Port') {
            steps {
                script {
                    def remote = [:]
                    remote.name = 'deploy-server'
                    remote.host = env.DEPLOY_SERVER
                    remote.allowAnyHosts = true
                    remote.user = DEPLOY_CREDS_USR
                    remote.password = DEPLOY_CREDS_PSW
                    
                    // 원격 서버에서 사용 가능한 포트 찾기
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
                    
                    env.PORT = PORT
                    echo "Found port on remote server: ${PORT}"
                }
            }
        }

        stage('Create env file') {
            steps {
                sh '''
                    cat << EOF > .env.local
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY}
                    NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT}
                    NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
                    NEXT_PUBLIC_SITE_URL=http://10.3.0.130:${PORT}
                    PORT=${PORT}
                    EOF
                '''
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
                    def imageTag = "${env.REGISTRY}/${env.IMAGE_NAME}:${env.BRANCH_NAME}"
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
                            -p ${env.PORT}:3000 \\
                            --restart unless-stopped \\
                            --env-file /tmp/.env.local \\
                            ${imageTag}
                        rm /tmp/.env.local
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