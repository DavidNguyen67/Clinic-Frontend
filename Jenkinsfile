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
                label 'docker-build'
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
                label 'docker-build'
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
                label 'docker-build'
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
                label 'k3s-deploy'
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
            node('docker-build') {
                script {
                    sendTelegram(
                        "✅ *BUILD SUCCEEDED*\n" +
                        "📦 *Project:* `${env.JOB_NAME}`\n" +
                        "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                        "🔖 *Image:* `${env.IMAGE_TAG ?: 'N/A'}`\n" +
                        "☸️ *Namespace:* `${env.K8S_NAMESPACE}`\n" +
                        "🚀 *Deployment:* `${env.K8S_DEPLOYMENT}`\n" +
                        "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                        "🌿 *Branch:* `${env.GIT_BRANCH_NAME ?: env.BRANCH_NAME ?: 'N/A'}`\n" +
                        "⏱️ *Time:* ${currentBuild.durationString}"
                    )
                }
            }
        }

        failure {
            node('docker-build') {
                script {
                    sendTelegramWithFile(
                        "❌ *BUILD FAILED*\n" +
                        "📦 *Project:* `${env.JOB_NAME}`\n" +
                        "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                        "🔖 *Image:* `${env.IMAGE_TAG ?: 'N/A'}`\n" +
                        "☸️ *Namespace:* `${env.K8S_NAMESPACE}`\n" +
                        "🚀 *Deployment:* `${env.K8S_DEPLOYMENT}`\n" +
                        "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                        "🌿 *Branch:* `${env.GIT_BRANCH_NAME ?: env.BRANCH_NAME ?: 'N/A'}`\n" +
                        "⏱️ *Time:* ${currentBuild.durationString}"
                    )
                }
            }
        }

        aborted {
            node('docker-build') {
                script {
                    sendTelegramWithFile(
                        "⚠️ *BUILD ABORTED*\n" +
                        "📦 *Project:* `${env.JOB_NAME}`\n" +
                        "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                        "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                        "🌿 *Branch:* `${env.GIT_BRANCH_NAME ?: env.BRANCH_NAME ?: 'N/A'}`\n" +
                        "⏱️ *Time:* ${currentBuild.durationString}"
                    )
                }
            }
        }

        cleanup {
            node('docker-build') {
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
        def tmpFile = "${env.WORKSPACE}/telegram_message_${env.BUILD_NUMBER}.txt"

        writeFile file: tmpFile, text: message

        sh """
            set +x

            curl --fail --silent --show-error \
                --request POST \
                "https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage" \
                --form chat_id="\${CHAT_ID}" \
                --form parse_mode="Markdown" \
                --form disable_web_page_preview="true" \
                --form text=<"${tmpFile}"

            rm -f "${tmpFile}"
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
                set +x

                curl --fail --silent --show-error \
                    --user "\${JENKINS_USER}:\${JENKINS_TOKEN}" \
                    "${env.BUILD_URL}consoleText"
            """,
            returnStdout: true
        ).trim()
    }
}


def sendTelegramWithFile(String caption = '') {
    def logFile = "${env.WORKSPACE}/build_log_${env.BUILD_NUMBER}.txt"
    def captionFile = "${env.WORKSPACE}/telegram_caption_${env.BUILD_NUMBER}.txt"

    try {
        writeFile file: logFile, text: getLogContent()
    } catch (Exception exception) {
        writeFile(
            file: logFile,
            text: "Không thể tải console log.\n${exception.message}"
        )
    }

    writeFile file: captionFile, text: caption

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
            set +x

            curl --fail --silent --show-error \
                --request POST \
                "https://api.telegram.org/bot\${BOT_TOKEN}/sendDocument" \
                --form chat_id="\${CHAT_ID}" \
                --form parse_mode="Markdown" \
                --form caption=<"${captionFile}" \
                --form document=@"${logFile}"
        """
    }

    sh """
        rm -f "${captionFile}"
        rm -f "${logFile}"
    """
}