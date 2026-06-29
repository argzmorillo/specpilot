pipeline {
  agent any

  stages {
    stage('Validate Workspace') {
      steps {
        sh '''
          echo "Validating SpecPilot workspace"
          pwd
          ls -la
          test -f package.json
          test -d backend
          test -d frontend
          test -f docker-compose.prod.yml
          docker --version
        '''
      }
    }

    stage('Backend Tests') {
      steps {
        dir('backend') {
          sh '''
            npm ci
            npx prisma generate
            npm run build
            npm run test
          '''
        }
      }
    }

    stage('Frontend Build') {
      steps {
        dir('frontend') {
          sh '''
            npm ci
            npm run build
          '''
        }
      }
    }

    stage('Docker Compose Config') {
      steps {
        sh '''
          docker compose -f docker-compose.prod.yml config
        '''
      }
    }
  }
}