pipeline {
    agent any


    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh 'trivy fs --scanners vuln,misconfig,secret .'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t healthcare-app:v1.0.2 .'
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image --exit-code 0 healthcare-app:v1.0.2'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        sh """
                          ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=VLE-9-Secure-Healthcare-DevSecOps \
                          -Dsonar.projectName='VLE-9 Secure Healthcare DevSecOps' \
                          -Dsonar.sources=app.js
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    export HOME=/home/ubuntu
                    export KUBECONFIG=/home/ubuntu/.kube/config

                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/
                    kubectl rollout status deployment/healthcare-app -n healthcare --timeout=180s
                    kubectl get pods -n healthcare
                    kubectl get services -n healthcare
                '''
            }
        }
    }
}
