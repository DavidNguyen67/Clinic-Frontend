pipeline {
    agent any

    environment {
        DOCKERHUB_REPO        = 'davidnguyendev/fe-clinic'
        APP_CONTAINER_NAME    = 'fe-clinic'
        APP_PORT              = '3000'
        KEEP_IMAGES           = '3'

        // Credential IDs in Jenkins
        DOCKERHUB_CREDS       = 'dockerhub-credentials'
        SSH_CREDS             = 'vps-ssh-credentials'
        TELEGRAM_BOT_TOKEN    = 'telegram-bot-token'
        TELEGRAM_CHAT_ID      = 'telegram-chat-id'
        JENKINS_API_CREDS     = 'jenkins-api-credentials'
        ENV_FILE              = 'fe-clinic-env'

        // VPS connection details
        VPS_HOST              = '168.144.141.68'
        VPS_USER              = 'root'

        APP_DIR               = '/opt/fe-clinic'
        LOCAL_DEPLOY_SCRIPT   = "/tmp/deploy_${APP_CONTAINER_NAME}_${BUILD_TAG}.sh"
        LOCAL_HEALTH_SCRIPT   = "/tmp/healthcheck_${APP_CONTAINER_NAME}_${BUILD_TAG}.sh"
        VPS_DEPLOY_SCRIPT     = "/tmp/deploy_${APP_CONTAINER_NAME}_${BUILD_TAG}.sh"
        VPS_HEALTH_SCRIPT     = "/tmp/healthcheck_${APP_CONTAINER_NAME}_${BUILD_TAG}.sh"
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

                stage('🌐 Deploy to VPS') {
                    steps {
                        withCredentials([
                            sshUserPrivateKey(credentialsId: "${SSH_CREDS}", keyFileVariable: 'SSH_KEY'),
                            file(credentialsId: "${ENV_FILE}", variable: 'DOTENV_FILE'),
                            usernamePassword(credentialsId: "${DOCKERHUB_CREDS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                        ]) {
                            script {
                                def sshOpts = "-i \$SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=10"
                                def target  = "${VPS_USER}@${VPS_HOST}"

                                sh """
                                    ssh ${sshOpts} ${target} "mkdir -p ${APP_DIR}"
                                    scp ${sshOpts} "\$DOTENV_FILE" ${target}:${APP_DIR}/.env
                                """

                                sh """
                                    sed \\
                                        -e 's|__IMAGE_TAG__|${env.IMAGE_TAG}|g' \\
                                        -e 's|__DOCKERHUB_REPO__|${DOCKERHUB_REPO}|g' \\
                                        -e 's|__APP_NAME__|${APP_CONTAINER_NAME}|g' \\
                                        -e 's|__APP_PORT__|${APP_PORT}|g' \\
                                        -e 's|__KEEP_IMAGES__|${KEEP_IMAGES}|g' \\
                                        -e 's|__APP_DIR__|${APP_DIR}|g' \\
                                        scripts/deploy.sh > ${LOCAL_DEPLOY_SCRIPT}

                                    sed \\
                                        -e 's|__IMAGE_TAG__|${env.IMAGE_TAG}|g' \\
                                        -e 's|__DOCKERHUB_REPO__|${DOCKERHUB_REPO}|g' \\
                                        -e 's|__APP_NAME__|${APP_CONTAINER_NAME}|g' \\
                                        -e 's|__APP_PORT__|${APP_PORT}|g' \\
                                        -e 's|__APP_DIR__|${APP_DIR}|g' \\
                                        -e 's|__BUILD_TAG__|${BUILD_TAG}|g' \\
                                        scripts/healthcheck.sh > ${LOCAL_HEALTH_SCRIPT}

                                    test -s ${LOCAL_DEPLOY_SCRIPT} || (echo "❌ deploy script empty!"      && exit 1)
                                    test -s ${LOCAL_HEALTH_SCRIPT} || (echo "❌ healthcheck script empty!" && exit 1)
                                """

                                sh "scp ${sshOpts} ${LOCAL_DEPLOY_SCRIPT} ${target}:${VPS_DEPLOY_SCRIPT}"
                                sh "scp ${sshOpts} ${LOCAL_HEALTH_SCRIPT} ${target}:${VPS_HEALTH_SCRIPT}"
                                sh "rm -f ${LOCAL_DEPLOY_SCRIPT} ${LOCAL_HEALTH_SCRIPT}"

                                sh """
                                    ssh ${sshOpts} ${target} \\
                                        "DOCKER_USER_ARG=\$DOCKER_USER DOCKER_PASS_ARG=\$DOCKER_PASS bash ${VPS_DEPLOY_SCRIPT}"
                                """
                            }
                        }
                    }
                }

                stage('🩺 Health Check') {
                    steps {
                        withCredentials([
                            sshUserPrivateKey(credentialsId: "${SSH_CREDS}", keyFileVariable: 'SSH_KEY')
                        ]) {
                            script {
                                def sshOpts = "-i \$SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=10"
                                def target  = "${VPS_USER}@${VPS_HOST}"

                                sh "ssh ${sshOpts} ${target} \"bash ${VPS_HEALTH_SCRIPT}\""
                            }
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
                    sshUserPrivateKey(credentialsId: "${SSH_CREDS}", keyFileVariable: 'SSH_KEY')
                ]) {
                    sh """
                        ssh -i \$SSH_KEY \\
                            -o StrictHostKeyChecking=no \\
                            -o ConnectTimeout=5 \\
                            -o ServerAliveInterval=3 \\
                            -o ServerAliveCountMax=2 \\
                            ${VPS_USER}@${VPS_HOST} \\
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