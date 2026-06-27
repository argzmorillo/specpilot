pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''
          echo "SpecPilot deployment pipeline initialized"
          pwd
          ls -la
          docker --version
          docker ps
        '''
      }
    }
  }
}