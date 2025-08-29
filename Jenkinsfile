pipeline {
  agent any

  parameters {
    choice(
      name: 'BRANCH_ENV',
      choices: ['dev', 'qa', 'stg'],
      description: 'Select the environment to deploy'
    )
  }

  stages {

    stage('Clone Repository') {
      steps {
        git branch: "${params.BRANCH_ENV}",
            credentialsId: 'scmcred',
            url: 'https://gitlab.com/hatchmark-astropeace/astropeace-admin-web.git'
      }
    }

    stage('Get Package Info') {
      steps {
        script {
          echo "Build Branch: ${params.BRANCH_ENV} : ${env.BUILD_NUMBER}"
          def currentMonthYear = new Date().format('yyyy.MM')
          env.TAG_VERSION = "${currentMonthYear}.${env.BUILD_NUMBER}"
          echo "Image Tag: hatchmark-astropeace/astropeace-admin-web:${env.TAG_VERSION}"
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build . -t registry.gitlab.com/hatchmark-astropeace/astropeace-admin-web:${TAG_VERSION}"
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'scmcred', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          sh '''
            docker login registry.gitlab.com -u "${USERNAME}" -p "${PASSWORD}"
            docker push registry.gitlab.com/hatchmark-astropeace/astropeace-admin-web:${TAG_VERSION}
          '''
        }
      }
    }

    stage('Clean Up Local Image') {
      steps {
        sh 'docker rmi registry.gitlab.com/hatchmark-astropeace/astropeace-admin-web:${TAG_VERSION} || true'
      }
    }

    stage('Update Manifest Repo') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'scmcred', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
          script {
            sh "rm -rf astropeace-cd"
            sh "git clone --branch ${params.BRANCH_ENV} https://${GIT_USERNAME}:${GIT_PASSWORD}@gitlab.com/hatchmark-ops/astropeace-cd"
            dir("astropeace-cd/src") {
              sh """
                sed -i 's#hatchmark-astropeace/astropeace-admin-web.*#hatchmark-astropeace/astropeace-admin-web:${TAG_VERSION}#g' astropeace-admin-web.deploy.yaml
              """
              sh "git config user.email admin@hatchmark.com"
              sh "git config user.name devops-bot"
              sh "git add ."
              sh "git commit -m 'Update image version to: ${TAG_VERSION}' || echo \"No changes to commit\""
              sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@gitlab.com/hatchmark-ops/astropeace-cd HEAD:${params.BRANCH_ENV} -f"
            }
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}