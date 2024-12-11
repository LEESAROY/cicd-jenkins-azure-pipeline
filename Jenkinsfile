pipeline {
    agent any

    environment {
        RESOURCE_GROUP = 'cicd-jenkins'
        FUNCTION_APP_NAME = 'node-leesa-9019432'
    }
// trigger added
    triggers {
        githubPush()
    }

    stages {
        stage('Clean Chocolatey Installation') {
            steps {
                script {
                    echo 'Cleaning existing Chocolatey installation...'
                    bat '''
                        IF EXIST "C:\\ProgramData\\chocolatey" (
                            rmdir /S /Q "C:\\ProgramData\\chocolatey"
                        )
                    '''
                }
            }
        }

        stage('Install Chocolatey') {
            steps {
                script {
                    echo 'Installing Chocolatey...'
                    bat '''
                        @echo off
                        powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"
                        setx PATH "%PATH%;C:\\ProgramData\\chocolatey\\bin"
                    '''
                }
            }
        }

        stage('Install zip') {
            steps {
                script {
                    echo 'Installing zip...'
                    bat '''
                        @echo off
                        set PATH=%PATH%;C:\\ProgramData\\chocolatey\\bin
                        choco install zip -y
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo 'Building the application...'
                    bat 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo 'Running tests...'
                    bat 'npm test'
                }
            }
        }

        stage('Azure Login') {
            environment {
                AZURE_CLIENT_ID = credentials('AZURE_CLIENT_ID')
                AZURE_CLIENT_SECRET = credentials('AZURE_CLIENT_SECRET')
                AZURE_TENANT_ID = credentials('AZURE_TENANT_ID')
            }
            steps {
                script {
                    echo 'Logging in to Azure...'
                    bat '''
                        az login --service-principal -u %AZURE_CLIENT_ID% -p %AZURE_CLIENT_SECRET% --tenant %AZURE_TENANT_ID%
                    '''
                }
            }
        }

        stage('Create Deployment Package') {
            steps {
                script {
                    echo 'Creating deployment package...'
                    bat '''
                        mkdir myFunction
                        copy index.js myFunction\\index.js
                        copy function.json myFunction\\function.json
                        powershell Compress-Archive -Path * -DestinationPath function.zip -Force
                        dir
                    '''
                }
            }
        }

        stage('Deploy to Azure') {
            steps {
                script {
                    echo 'Deploying to Azure...'
                    bat '''
                        az functionapp deployment source config-zip --resource-group %RESOURCE_GROUP% --name %FUNCTION_APP_NAME% --src function.zip
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    echo 'Cleaning up...'
                    bat 'del function.zip'
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
