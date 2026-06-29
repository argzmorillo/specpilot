pipeline {
  agent any

  stages {
    stage('Validate Workspace') {
      steps {
        sh '''
          echo "Validating SpecPilot workspace"
          pwd
          test -f package.json
          test -d backend
          test -d frontend
          test -f docker-compose.prod.yml
          docker --version
          docker compose version
        '''
      }
    }

    stage('Docker Compose Config') {
      steps {
        sh '''
          docker compose -f docker-compose.prod.yml config
        '''
      }
    }

    stage('Build Docker Images') {
      steps {
        sh '''
          docker compose -f docker-compose.prod.yml build specpilot-api specpilot-frontend
        '''
      }
    }
  }
}