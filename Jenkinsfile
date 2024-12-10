pipeline {
    agent any

    environment {
        RESOURCE_GROUP = 'cicd-jenkins'
        FUNCTION_APP_NAME = 'node-leesa-9019432'
    }

    stages {
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
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'AZURE_CLIENT_ID', variable: 'AZURE_CLIENT_ID'),
                        string(credentialsId: 'AZURE_CLIENT_SECRET', variable: 'AZURE_CLIENT_SECRET'),
                        string(credentialsId: 'AZURE_TENANT_ID', variable: 'AZURE_TENANT_ID')
                    ]) {
                        echo 'Deploying to Azure...'
                        sh """
                            az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID
                            zip -r function.zip .
                            az functionapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $FUNCTION_APP_NAME --src function.zip
                        """
                    }
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
