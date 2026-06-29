pipeline {
  agent any

  parameters {
    booleanParam(
      name: 'DEPLOY_TO_PRODUCTION',
      defaultValue: false,
      description: 'Deploy to production after successful image build'
    )
  }

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
          cp .env.production.example .env.production
          docker compose -f docker-compose.prod.yml --env-file .env.production config
        '''
      }
    }

    stage('Build Backend Image') {
      steps {
        sh 'docker compose -f docker-compose.prod.yml --env-file .env.production build specpilot-api'
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh 'docker compose -f docker-compose.prod.yml --env-file .env.production build specpilot-frontend'
      }
    }

    stage('Deploy Production') {
      when {
        expression { params.DEPLOY_TO_PRODUCTION == true }
      }
      steps {
        sh '''
          echo "Deploying SpecPilot to production"

          cd /opt/ecosystem/specpilot

          git checkout main
          git pull origin main

          docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build specpilot-api specpilot-frontend

          docker compose -f docker-compose.prod.yml --env-file .env.production exec -T specpilot-api npx prisma migrate deploy

          curl -f https://api.specpilot.adrianmorillo.com/health
        '''
      }
    }
  }
}