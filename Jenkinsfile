#!/usr/bin/env groovy

node {
        stage('checkout') {
            checkout scm
        }

        stage('checkout') {
            sh "echo $BASE_API"
            sh "echo $MATERIAL_API"
            sh "echo $IMAGE_NAME"
        }

        stage('packaging') {
            sh "yarn install"
            sh "node build/build.js"
            sh "rm -f dist/static/js/*.map"
            sh "rm -rf target"
            sh "mkdir target"
            sh "tar cvf target/manage-front.tar dist/**"
            archiveArtifacts artifacts: '**/target/*.tar', fingerprint: true
        }

        def dockerImage
        stage('build docker') {
            if("$BUILD_DOCKER" == "true"){
                dockerImage = docker.build('$DOCKER_REGISTRY/connext/$IMAGE_NAME', '.')
            }
        }

        stage('publish docker') {
            if("$BUILD_DOCKER" == "true"){
                dockerImage.push 'latest'
            }
        }
}
