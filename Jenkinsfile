pipeline {
    agent any

    environment {
        RESOURCE_GROUP = 'cicd-jenkins'
        FUNCTION_APP_NAME = 'node-leesa-9019432'
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    echo 'Installing dependencies...'
                    sh '''
                        if [ "$(uname)" = "Linux" ]; then
                            # Linux
                            if ! command -v zip &> /dev/null; then
                                sudo apt-get update
                                sudo apt-get install -y zip
                            fi
                        elif [ "$(uname)" = "Darwin" ]; then
                            # macOS
                            if ! command -v zip &> /dev/null; then
                                brew install zip
                            fi
                        elif [ "$(uname -o)" = "Msys" ]; then
                            # Windows with Git Bash
                            if ! command -v zip &> /dev/null; then
                                choco install zip -y
                            fi
                        fi
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo 'Building the application...'
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo 'Running tests...'
                    sh 'npm test'
                }
            }
        }

        stage('Deploy') {
            environment {
                AZURE_CLIENT_ID = credentials('AZURE_CLIENT_ID')
                AZURE_CLIENT_SECRET = credentials('AZURE_CLIENT_SECRET')
                AZURE_TENANT_ID = credentials('AZURE_TENANT_ID')
            }
            steps {
                script {
                    echo 'Deploying to Azure...'
                    sh '''
                        az login --service-principal -u ${AZURE_CLIENT_ID} -p ${AZURE_CLIENT_SECRET} --tenant ${AZURE_TENANT_ID}
                        zip -r function.zip .
                        az functionapp deployment source config-zip --resource-group ${RESOURCE_GROUP} --name ${FUNCTION_APP_NAME} --src function.zip
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    echo 'Cleaning up...'
                    sh 'rm -f function.zip'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
