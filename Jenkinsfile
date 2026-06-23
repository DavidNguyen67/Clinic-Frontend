pipeline {
    agent none

    environment {
        // Docker Hub
        DOCKERHUB_REPO  = 'davidnguyendev/frontend'
        DOCKERHUB_CREDS = 'dockerhub-credentials'

        // Kubernetes
        K8S_NAMESPACE  = 'staging'
        K8S_DEPLOYMENT = 'clinic-frontend-deployment'
        K8S_CONTAINER  = 'clinic-frontend'
        KUBECONFIG_CREDS = 'k3s-staging-kubeconfig'

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
        timestamps()
    }

    stages {
        stage('Checkout') {
            agent {
                label 'docker-builder'
            }

            steps {
                checkout scm

                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    env.GIT_BRANCH_NAME = sh(
                        script: 'git rev-parse --abbrev-ref HEAD',
                        returnStdout: true
                    ).trim()

                    env.IMAGE_TAG = "${env.DOCKERHUB_REPO}:${env.GIT_COMMIT_SHORT}"

                    echo "Branch: ${env.GIT_BRANCH_NAME}"
                    echo "Image: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build Docker Image') {
            agent {
                label 'docker-builder'
            }

            steps {
                sh '''
                    set -e

                    docker build \
                        --pull \
                        -t "$IMAGE_TAG" \
                        .
                '''
            }
        }

        stage('Push Docker Image') {
            agent {
                label 'docker-builder'
            }

            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: env.DOCKERHUB_CREDS,
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        set -e

                        echo "$DOCKER_PASS" |
                            docker login \
                                --username "$DOCKER_USER" \
                                --password-stdin

                        docker push "$IMAGE_TAG"
                    '''
                }
            }

            post {
                always {
                    sh 'docker logout 2>/dev/null || true'
                }
            }
        }

        stage('Deploy Kubernetes') {
            agent {
                label 'k3s-deployer'
            }

            steps {
                withCredentials([
                    file(
                        credentialsId: env.KUBECONFIG_CREDS,
                        variable: 'KUBECONFIG_FILE'
                    )
                ]) {
                    sh '''
                        set -e

                        export KUBECONFIG="$KUBECONFIG_FILE"

                        echo "Checking Kubernetes connection..."
                        kubectl cluster-info

                        echo "Updating deployment image..."
                        kubectl set image \
                            deployment/"$K8S_DEPLOYMENT" \
                            "$K8S_CONTAINER"="$IMAGE_TAG" \
                            --namespace "$K8S_NAMESPACE"

                        echo "Waiting for rollout..."
                        kubectl rollout status \
                            deployment/"$K8S_DEPLOYMENT" \
                            --namespace "$K8S_NAMESPACE" \
                            --timeout=600s

                        echo "Deployment completed."
                        kubectl get deployment "$K8S_DEPLOYMENT" \
                            --namespace "$K8S_NAMESPACE" \
                            -o wide
                    '''
                }
            }
        }
    }

    post {
        success {
            node('docker-builder') {
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
        }

        failure {
            node('docker-builder') {
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
        }

        aborted {
            node('docker-builder') {
                script {
                    sendTelegramWithFile(
                        "⚠️ *BUILD ABORTED*\n" +
                        "📦 *Project:* `${env.JOB_NAME}`\n" +
                        "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                        "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                        "🌿 *Branch:* `${env.GIT_BRANCH ?: env.BRANCH_NAME ?: 'N/A'}`\n" +
                        "⏱️ *Time:* ${currentBuild.durationString}"
                    )
                }
            }
        }

        cleanup {
            node('docker-builder') {
                script {
                    sh 'docker logout 2>/dev/null || true'

                    if (env.IMAGE_TAG?.trim()) {
                        sh '''
                            docker image rm "$IMAGE_TAG" \
                                2>/dev/null || true
                        '''
                    }

                    deleteDir()
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