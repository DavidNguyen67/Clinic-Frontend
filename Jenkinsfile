pipeline {
    agent any

    environment {
        DOCKERHUB_REPO        = 'davidnguyendev/frontend'
        APP_CONTAINER_NAME    = 'frontend'
        APP_PORT              = '8080'
        K8S_NAMESPACE         = 'app'
        K8S_DEPLOYMENT        = 'frontend'
        K8S_CONTAINER         = 'frontend'

        // Credential IDs in Jenkins
        DOCKERHUB_CREDS       = 'dockerhub-credentials'
        TELEGRAM_BOT_TOKEN    = 'telegram-bot-token'
        TELEGRAM_CHAT_ID      = 'telegram-chat-id'
        JENKINS_API_CREDS     = 'jenkins-api-credentials'
        ENV_FILE              = 'frontend-env'
        KUBECONFIG_CREDS      = 'kubeconfig-credentials'
    }

    triggers { githubPush() }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('CI/CD') {
            when {
                expression { env.GIT_BRANCH ==~ /^(origin\/)?master$/ }
            }
            stages {
                stage('🔍 Checkout') {
                    steps {
                        checkout scm
                        script {
                            def commitShort = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                            env.GIT_COMMIT_SHORT = commitShort
                            env.IMAGE_TAG        = "${DOCKERHUB_REPO}:${commitShort}"
                            echo "📦 Image tag: ${env.IMAGE_TAG}"
                        }
                    }
                }

                stage('🏗️ Build Docker Image') {
                    steps {
                        script {
                            withCredentials([file(credentialsId: "${env.ENV_FILE}", variable: 'DOTENV_FILE')]) {
                                echo "🔨 Building image: ${env.IMAGE_TAG}"
                                sh 'cp $DOTENV_FILE .env'
                                sh "docker build -t ${env.IMAGE_TAG} ."
                                sh "docker tag ${env.IMAGE_TAG} ${DOCKERHUB_REPO}:latest"
                                sh 'rm -f .env'
                            }
                        }
                    }
                }

                stage('🚀 Push to DockerHub') {
                    steps {
                        withCredentials([usernamePassword(
                            credentialsId: "${DOCKERHUB_CREDS}",
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_PASS'
                        )]) {
                            sh """
                                echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                                docker push ${env.IMAGE_TAG}
                                docker push ${DOCKERHUB_REPO}:latest
                                docker logout
                            """
                        }
                    }
                }

               stage('🌐 Deploy to k3s') {
                   steps {
                       withCredentials([
                           file(credentialsId: "${KUBECONFIG_CREDS}", variable: 'KUBECONFIG_FILE'),
                           file(credentialsId: "${ENV_FILE}", variable: 'DOTENV_FILE')
                       ]) {
                           script {
                               sh """
                                   kubectl --kubeconfig "\$KUBECONFIG_FILE" apply -f k8s/namespace.yaml

                                   kubectl --kubeconfig "\$KUBECONFIG_FILE" -n ${K8S_NAMESPACE} create secret generic
                                    frontend-env \
                                       --from-env-file="\$DOTENV_FILE" \
                                       --dry-run=client -o yaml | \
                                   kubectl --kubeconfig "\$KUBECONFIG_FILE" apply -f -

                                   kubectl --kubeconfig "\$KUBECONFIG_FILE" -n ${K8S_NAMESPACE} apply -f k8s/

                                   kubectl --kubeconfig "\$KUBECONFIG_FILE" -n ${K8S_NAMESPACE} set image deployment/${K8S_DEPLOYMENT} \
                                       ${K8S_CONTAINER}=${env.IMAGE_TAG}

                                   kubectl --kubeconfig "\$KUBECONFIG_FILE" -n ${K8S_NAMESPACE} rollout status deployment/${K8S_DEPLOYMENT} --timeout=180s
                               """
                           }
                       }
                   }
               }

               stage('🩺 Health Check') {
                   steps {
                       withCredentials([
                           file(credentialsId: "${KUBECONFIG_CREDS}", variable: 'KUBECONFIG_FILE')
                       ]) {
                           sh """
                               kubectl --kubeconfig "\$KUBECONFIG_FILE" -n ${K8S_NAMESPACE} get deployment ${K8S_DEPLOYMENT}
                               kubectl --kubeconfig "\$KUBECONFIG_FILE" -n ${K8S_NAMESPACE} get pods -l app=${K8S_DEPLOYMENT}
                               kubectl --kubeconfig "\$KUBECONFIG_FILE" -n ${K8S_NAMESPACE} rollout status deployment/${K8S_DEPLOYMENT} --timeout=180s
                           """
                       }
                   }
               }
            }
        }
    }

    post {
        success {
            script {
                sendTelegram(
                    "✅ *BUILD THÀNH CÔNG*\n" +
                    "📦 *Project:* `${env.JOB_NAME}`\n" +
                    "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                    "🔖 *Image:* `${env.IMAGE_TAG ?: 'N/A'}`\n" +
                    "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                    "🌿 *Branch:* `${env.GIT_BRANCH}`\n" +
                    "⏱️ *Thời gian:* ${currentBuild.durationString}"
                )
            }
        }

        failure {
            script {
                sendTelegramWithFile(
                    "❌ *BUILD THẤT BẠI*\n" +
                    "📦 *Project:* `${env.JOB_NAME}`\n" +
                    "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                    "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                    "🌿 *Branch:* `${env.GIT_BRANCH}`\n" +
                    "⏱️ *Thời gian:* ${currentBuild.durationString}"
                )
            }
        }

        aborted {
            script {
                sendTelegramWithFile(
                    "⚠️ *BUILD BỊ HỦY*\n" +
                    "📦 *Project:* `${env.JOB_NAME}`\n" +
                    "📝 *Commit:* `${env.GIT_COMMIT_SHORT ?: 'N/A'}`\n" +
                    "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                    "🌿 *Branch:* `${env.GIT_BRANCH}`\n" +
                    "⏱️ *Thời gian:* ${currentBuild.durationString}"
                )
            }
        }

        always {
            script {
                if (env.IMAGE_TAG) {
                    sh "docker rmi ${env.IMAGE_TAG} ${DOCKERHUB_REPO}:latest 2>/dev/null || true"
                }

                sh "rm -f ${LOCAL_DEPLOY_SCRIPT} ${LOCAL_HEALTH_SCRIPT} 2>/dev/null || true"

                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: "${SSH_CREDS}",
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh """
                        ssh -i \$SSH_KEY \\
                            -o StrictHostKeyChecking=no \\
                            -o ConnectTimeout=5 \\
                            -o ServerAliveInterval=3 \\
                            -o ServerAliveCountMax=2 \\
                            \$SSH_USER@${VPS_HOST} \\
                            "rm -f ${VPS_DEPLOY_SCRIPT} ${VPS_HEALTH_SCRIPT}" 2>/dev/null || true
                    """
                }
            }
        }
    }
}


def sendTelegram(String message) {
    withCredentials([
        string(credentialsId: "${TELEGRAM_BOT_TOKEN}", variable: 'BOT_TOKEN'),
        string(credentialsId: "${TELEGRAM_CHAT_ID}",   variable: 'CHAT_ID')
    ]) {
        def tmpFile = "/tmp/tg_msg_${env.BUILD_NUMBER}.txt"
        writeFile file: tmpFile, text: message
        sh """
            TEXT=\$(cat ${tmpFile})
            curl -s -X POST "https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage" \\
                -F chat_id="\${CHAT_ID}" \\
                -F parse_mode="Markdown" \\
                -F disable_web_page_preview="true" \\
                -F text="\${TEXT}"
            rm -f ${tmpFile}
        """
    }
}

def getLogContent() {
    withCredentials([
        usernamePassword(
            credentialsId: "${JENKINS_API_CREDS}",
            usernameVariable: 'JENKINS_USER',
            passwordVariable: 'JENKINS_TOKEN'
        )
    ]) {
        return sh(
            script: """
                curl -s -u "\${JENKINS_USER}:\${JENKINS_TOKEN}" \\
                    "${env.JENKINS_URL}job/${env.JOB_NAME}/${env.BUILD_NUMBER}/consoleText"
            """,
            returnStdout: true
        ).trim()
    }
}

def sendTelegramWithFile(String caption = "") {
    def logFile = "/tmp/build_log_${env.BUILD_NUMBER}.txt"
    writeFile file: logFile, text: getLogContent()
    withCredentials([
            string(credentialsId: "${TELEGRAM_BOT_TOKEN}", variable: 'BOT_TOKEN'),
            string(credentialsId: "${TELEGRAM_CHAT_ID}",   variable: 'CHAT_ID')
        ]) {
            def tmpCaption = "/tmp/tg_caption_${env.BUILD_NUMBER}.txt"
            writeFile file: tmpCaption, text: caption
            sh """
                CAPTION=\$(cat ${tmpCaption})
                curl -s -X POST "https://api.telegram.org/bot\${BOT_TOKEN}/sendDocument" \\
                    -F chat_id="\${CHAT_ID}" \\
                    -F parse_mode="Markdown" \\
                    -F caption="\${CAPTION}" \\
                    -F document=@"${logFile}"
                rm -f ${tmpCaption}
            """
        }
    sh "rm -f ${logFile}"
}