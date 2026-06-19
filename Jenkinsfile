pipeline {
    agent any

    environment {
            // Docker Hub
            DOCKERHUB_REPO  = 'davidnguyendev/frontend'
            DOCKERHUB_CREDS = 'dockerhub-credentials'

            // File .env frontend
            ENV_FILE = 'frontend-env'

            // Kubernetes
            K8S_HOST       = '178.128.118.157'
            K8S_NAMESPACE  = 'staging'
            K8S_DEPLOYMENT = 'clinic-frontend-deployment'
            K8S_CONTAINER  = 'clinic-backend'

            // SSH vào VPS K3s
            SSH_CREDS = 'deploy-frontend-ssh'

            // Telegram
            TELEGRAM_BOT_TOKEN = 'telegram-bot-token'
            TELEGRAM_CHAT_ID   = 'telegram-chat-id'

            JENKINS_API_CREDS = 'jenkins-api-credentials'
        }

    triggers {
        githubPush()
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm

                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    env.IMAGE_TAG = "${DOCKERHUB_REPO}:${env.GIT_COMMIT_SHORT}"

                    echo "Image: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([
                    file(
                        credentialsId: "${ENV_FILE}",
                        variable: 'DOTENV_FILE'
                    )
                ]) {
                    sh '''
                        cp "$DOTENV_FILE" .env

                        docker build \
                            -t "$IMAGE_TAG" \
                            .
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKERHUB_CREDS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASS" |
                            docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin

                        docker push "$IMAGE_TAG"

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: "${SSH_CREDS}",
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        ssh \
                            -i "$SSH_KEY" \
                            -o StrictHostKeyChecking=no \
                            -o ConnectTimeout=10 \
                            "$SSH_USER@$K8S_HOST" \
                            "
                                sudo k3s kubectl set image \
                                    deployment/$K8S_DEPLOYMENT \
                                    $K8S_CONTAINER=$IMAGE_TAG \
                                    -n $K8S_NAMESPACE \
                                && \
                                sudo k3s kubectl rollout status \
                                    deployment/$K8S_DEPLOYMENT \
                                    -n $K8S_NAMESPACE \
                                    --timeout=600s
                            "
                    '''
                }
            }
        }
    }

    post {
        success {
            script {
                sendTelegram(
                    "✅ *BUILD SUCCEEDED*\n" +
                    "📦 *Project:* `${env.JOB_NAME}`\n" +
                    "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                    "🔖 *Image:* `${env.IMAGE_TAG ?: 'N/A'}`\n" +
                    "☸️ *Namespace:* `${env.K8S_NAMESPACE}`\n" +
                    "🚀 *Deployment:* `${env.K8S_DEPLOYMENT}`\n" +
                    "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                    "🌿 *Branch:* `${env.GIT_BRANCH ?: env.BRANCH_NAME ?: 'N/A'}`\n" +
                    "⏱️ *Time:* ${currentBuild.durationString}"
                )
            }
        }

        failure {
            script {
                sendTelegramWithFile(
                    "❌ *BUILD FAILED*\n" +
                    "📦 *Project:* `${env.JOB_NAME}`\n" +
                    "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                    "🔖 *Image:* `${env.IMAGE_TAG ?: 'N/A'}`\n" +
                    "☸️ *Namespace:* `${env.K8S_NAMESPACE}`\n" +
                    "🚀 *Deployment:* `${env.K8S_DEPLOYMENT}`\n" +
                    "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                    "🌿 *Branch:* `${env.GIT_BRANCH ?: env.BRANCH_NAME ?: 'N/A'}`\n" +
                    "⏱️ *Time:* ${currentBuild.durationString}"
                )
            }
        }

        aborted {
            script {
                sendTelegramWithFile(
                    "⚠️ *BUILD HAS BEEN ABORTED*\n" +
                    "📦 *Project:* `${env.JOB_NAME}`\n" +
                    "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                    "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                    "🌿 *Branch:* `${env.GIT_BRANCH ?: env.BRANCH_NAME ?: 'N/A'}`\n" +
                    "⏱️ *Time:* ${currentBuild.durationString}"
                )
            }
        }

        always {
            script {
                sh 'rm -f .env 2>/dev/null || true'
                sh 'docker logout 2>/dev/null || true'

                if (env.IMAGE_TAG) {
                    sh """
                        docker rmi ${env.IMAGE_TAG} 2>/dev/null || true
                    """
                }
            }
        }
    }
}


def sendTelegram(String message) {
    withCredentials([
        string(
            credentialsId: env.TELEGRAM_BOT_TOKEN,
            variable: 'BOT_TOKEN'
        ),
        string(
            credentialsId: env.TELEGRAM_CHAT_ID,
            variable: 'CHAT_ID'
        )
    ]) {
        def tmpFile = "/tmp/tg_msg_${env.BUILD_NUMBER}.txt"

        writeFile file: tmpFile, text: message

        sh """
            TEXT=\$(cat '${tmpFile}')

            curl -s -X POST \
                "https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage" \
                -F chat_id="\${CHAT_ID}" \
                -F parse_mode="Markdown" \
                -F disable_web_page_preview="true" \
                -F text="\${TEXT}"

            rm -f '${tmpFile}'
        """
    }
}


def getLogContent() {
    withCredentials([
        usernamePassword(
            credentialsId: env.JENKINS_API_CREDS,
            usernameVariable: 'JENKINS_USER',
            passwordVariable: 'JENKINS_TOKEN'
        )
    ]) {
        return sh(
            script: """
                curl -s \
                    -u "\${JENKINS_USER}:\${JENKINS_TOKEN}" \
                    "${env.JENKINS_URL}job/${env.JOB_NAME}/${env.BUILD_NUMBER}/consoleText"
            """,
            returnStdout: true
        ).trim()
    }
}


def sendTelegramWithFile(String caption = '') {
    def logFile = "/tmp/build_log_${env.BUILD_NUMBER}.txt"
    def tmpCaption = "/tmp/tg_caption_${env.BUILD_NUMBER}.txt"

    writeFile file: logFile, text: getLogContent()
    writeFile file: tmpCaption, text: caption

    withCredentials([
        string(
            credentialsId: env.TELEGRAM_BOT_TOKEN,
            variable: 'BOT_TOKEN'
        ),
        string(
            credentialsId: env.TELEGRAM_CHAT_ID,
            variable: 'CHAT_ID'
        )
    ]) {
        sh """
            CAPTION=\$(cat '${tmpCaption}')

            curl -s -X POST \
                "https://api.telegram.org/bot\${BOT_TOKEN}/sendDocument" \
                -F chat_id="\${CHAT_ID}" \
                -F parse_mode="Markdown" \
                -F caption="\${CAPTION}" \
                -F document=@"${logFile}"
        """
    }

    sh """
        rm -f '${tmpCaption}'
        rm -f '${logFile}'
    """
}