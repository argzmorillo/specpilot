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
          cp .env.production.example .env.production
          docker compose -f docker-compose.prod.yml --env-file .env.production config
        '''
      }
    }

    stage('Build Docker Images') {
      steps {
        sh '''
          docker compose -f docker-compose.prod.yml --env-file .env.production build specpilot-api specpilot-frontend
        '''
      }
    }
  }
}