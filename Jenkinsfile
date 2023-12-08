library 'jenkins-telegram-notification'
library 'jenkins-pipeline'

node('pipeline') {
    withEnv(["NODE_HOME=${tool 'node14'}", "PATH+NODE_BIN=${tool 'node14'}/bin"]) {
        uxPipeline(this)
    }
}
