pipeline {
    agent any

    environment {
        DOCKERHUB_REPO = 'davidnguyendev/fe-clinic'
        APP_CONTAINER_NAME = 'fe-clinic'
        APP_PORT = '3000'
        KEEP_IMAGES = '3'

        DOCKERHUB_CREDS = 'dockerhub-credentials'
        SSH_CREDS = 'vps-ssh-credentials'
        TELEGRAM_BOT_TOKEN = 'telegram-bot-token'
        TELEGRAM_CHAT_ID = 'telegram-chat-id'
        JENKINS_API_CREDS = 'jenkins-api-credentials'
        ENV_FILE = 'fe-clinic-env'

        VPS_HOST = '168.144.141.68'
        VPS_USER = 'root'
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
        stage('🔍 Checkout') {
            when {
                expression { env.GIT_BRANCH ==~ /^(origin\/)?master$/ }
            }
            steps {
                checkout scm
                script {
                    def commitShort = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.GIT_COMMIT_SHORT = commitShort
                    env.IMAGE_TAG = "${DOCKERHUB_REPO}:${commitShort}"
                    echo "📦 Image tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('🏗️ Build Docker Image') {
            when {
                expression { env.GIT_BRANCH ==~ /^(origin\/)?master$/ }
            }
            steps {
                script {
                    echo "🔨 Building: ${env.IMAGE_TAG}"
                    sh "docker build -t ${env.IMAGE_TAG} ."
                    sh "docker tag  ${env.IMAGE_TAG} ${DOCKERHUB_REPO}:latest"
                }
            }
        }

        stage('🚀 Push to DockerHub') {
            when {
                expression { env.GIT_BRANCH ==~ /^(origin\/)?master$/ }
            }
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

        stage('🌐 Deploy to VPS') {
            when {
                expression { env.GIT_BRANCH ==~ /^(origin\/)?master$/ }
            }
            steps {
                withCredentials([
                        sshUserPrivateKey(credentialsId: "${SSH_CREDS}", keyFileVariable: 'SSH_KEY'),
                        file(credentialsId: "${ENV_FILE}", variable: 'DOTENV_FILE'),
                        usernamePassword(credentialsId: "${DOCKERHUB_CREDS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    script {
                        def sshOpts = "-i \$SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=10"
                        def target = "${VPS_USER}@${VPS_HOST}"

                        sh """
                            ssh ${sshOpts} ${target} "mkdir -p /opt/fe-clinic"
                            scp ${sshOpts} "\$DOTENV_FILE" ${target}:/opt/fe-clinic/.env
                        """

                        sh """
                            sed \
                                -e 's|__IMAGE_TAG__|${env.IMAGE_TAG}|g' \
                                -e 's|__DOCKERHUB_REPO__|${DOCKERHUB_REPO}|g' \
                                -e 's|__APP_NAME__|${APP_CONTAINER_NAME}|g' \
                                -e 's|__APP_PORT__|${APP_PORT}|g' \
                                -e 's|__KEEP_IMAGES__|${KEEP_IMAGES}|g' \
                                scripts/deploy.sh > /tmp/deploy_clinic.sh

                            sed \
                                -e 's|__IMAGE_TAG__|${env.IMAGE_TAG}|g' \
                                -e 's|__DOCKERHUB_REPO__|${DOCKERHUB_REPO}|g' \
                                -e 's|__APP_NAME__|${APP_CONTAINER_NAME}|g' \
                                -e 's|__APP_PORT__|${APP_PORT}|g' \
                                scripts/healthcheck.sh > /tmp/healthcheck_clinic.sh

                            scp ${sshOpts} /tmp/deploy_clinic.sh      ${target}:/tmp/deploy_clinic.sh
                            scp ${sshOpts} /tmp/healthcheck_clinic.sh  ${target}:/tmp/healthcheck_clinic.sh

                            rm -f /tmp/deploy_clinic.sh /tmp/healthcheck_clinic.sh
                        """

                        sh """
                            ssh ${sshOpts} ${target} \
                                "DOCKER_USER_ARG=\$DOCKER_USER DOCKER_PASS_ARG=\$DOCKER_PASS bash /tmp/deploy_clinic.sh; \
                                 rm -f /tmp/deploy_clinic.sh"
                        """
                    }
                }
            }
        }

        stage('🩺 Health Check') {
            when {
                expression { env.GIT_BRANCH ==~ /^(origin\/)?master$/ }
            }
            steps {
                withCredentials([
                        sshUserPrivateKey(credentialsId: "${SSH_CREDS}", keyFileVariable: 'SSH_KEY')
                ]) {
                    script {
                        def sshOpts = "-i \$SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=10"
                        def target = "${VPS_USER}@${VPS_HOST}"

                        sh """
                            ssh ${sshOpts} ${target} \
                                "bash /tmp/healthcheck_clinic.sh; \
                                 rm -f /tmp/healthcheck_clinic.sh"
                        """
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
                                "📝 *Commit:* `${env.GIT_COMMIT_SHORT}`\n" +
                                "🔖 *Image:* `${env.IMAGE_TAG}`\n" +
                                "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                                "🌿 *Branch:* `${env.GIT_BRANCH}`\n" +
                                "⏱️ *Thời gian:* ${currentBuild.durationString}"
                )
            }
        }

        failure {
            script {
                sendTelegram(
                        "❌ *BUILD THẤT BẠI*\n" +
                                "📦 *Project:* `${env.JOB_NAME}`\n" +
                                "📝 *Commit:* `${env.GIT_COMMIT_SHORT}`\n" +
                                "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                                "🌿 *Branch:* `${env.GIT_BRANCH}`\n" +
                                "⏱️ *Thời gian:* ${currentBuild.durationString}"
                )
                saveAndSendLog("📋 Log build *#${env.BUILD_NUMBER}*")
            }
        }

        aborted {
            script {
                sendTelegram(
                        "⚠️ *BUILD BỊ HỦY*\n" +
                                "📦 *Project:* `${env.JOB_NAME}`\n" +
                                "📝 *Commit:* `${env.GIT_COMMIT_SHORT}`\n" +
                                "🔢 *Build:* [#${env.BUILD_NUMBER}](${env.BUILD_URL})\n" +
                                "🌿 *Branch:* `${env.GIT_BRANCH}`\n" +
                                "⏱️ *Thời gian:* ${currentBuild.durationString}"
                )
                saveAndSendLog("📋 Log build *#${env.BUILD_NUMBER}*")
            }
        }

        always {
            script {
                sh "docker rmi ${env.IMAGE_TAG} ${DOCKERHUB_REPO}:latest 2>/dev/null || true"
            }
        }
    }
}


def sendTelegram(String message) {
    withCredentials([
            string(credentialsId: "${TELEGRAM_BOT_TOKEN}", variable: 'BOT_TOKEN'),
            string(credentialsId: "${TELEGRAM_CHAT_ID}", variable: 'CHAT_ID')
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

def sendTelegramFile(String filePath, String caption = "") {
    withCredentials([
            string(credentialsId: "${TELEGRAM_BOT_TOKEN}", variable: 'BOT_TOKEN'),
            string(credentialsId: "${TELEGRAM_CHAT_ID}", variable: 'CHAT_ID')
    ]) {
        def tmpCaption = "/tmp/tg_caption_${env.BUILD_NUMBER}.txt"
        writeFile file: tmpCaption, text: caption
        sh """
            CAPTION=\$(cat ${tmpCaption})
            curl -s -X POST "https://api.telegram.org/bot\${BOT_TOKEN}/sendDocument" \\
                -F chat_id="\${CHAT_ID}" \\
                -F parse_mode="Markdown" \\
                -F caption="\${CAPTION}" \\
                -F document=@"${filePath}"
            rm -f ${tmpCaption}
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

def saveAndSendLog(String caption = "") {
    def logFile = "/tmp/build_log_${env.BUILD_NUMBER}.txt"
    writeFile file: logFile, text: getLogContent()
    sendTelegramFile(logFile, caption)
    sh "rm -f ${logFile}"
}