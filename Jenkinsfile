pipeline {
    agent any
	environment {
        AWS_ACCESS_KEY_ID     = 'AKIA5WBTPYA3JCQDSGME'
        AWS_SECRET_ACCESS_KEY = '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'
        AWS_REGION = 'us-east-1'
        LOG_GROUP_NAME = 'practice'
        LOG_STREAM_NAME = '${BUILD_NAME}-${BUILD_NUMBER}'
    }
     stages {
        // stage('Publish to CloudWatch Logs') {
        //     steps {
        //         script {
                    
        //             sh "aws configure set region ${AWS_REGION}"
        //             sh " aws logs create-log-stream --log-group-name $LOG_GROUP_NAME --log-stream-name $LOG_STREAM_NAME"
        //             // Publish logs to CloudWatch
        //             sh "echo 'Hello cloudies Logs are on the way ..........!'"
        //         }
        //     }
        // }
    
        stage('Push Docker image to ECR') {
            steps {
                script{
                   // sh "docker rmi -f learning111"
                   sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 940705824822.dkr.ecr.us-east-1.amazonaws.com"
                    sh "docker build -t mypracticewebsitel ."
                    //sh "docker build -t learning111 ."
                    sh "docker tag mypracticewebsitel:latest 940705824822.dkr.ecr.us-east-1.amazonaws.com/mypracticewebsitel:latest"
                    sh "docker push 940705824822.dkr.ecr.us-east-1.amazonaws.com/mypracticewebsitel:latest"
                }
			}
		}
        
        stage('Pull Docker image from ECR') {
            steps {
                script{
                        // sh "docker pull ${buildProps.AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/node-repo:${env.BUILD_NUMBER}"
						//sh "docker run -itd -p 3000:3000 --name learning111 ${buildProps.AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/node-repo:${env.BUILD_NUMBER}"
						// Removing existing image
						// sh "docker rmi -f automationecr"
						// Pulling latest version of docker image
						sh "docker pull 940705824822.dkr.ecr.us-east-1.amazonaws.com/mypracticewebsitel:latest"
                    
						sh 'docker ps -f name=My-practice-website -q | xargs --no-run-if-empty docker container stop'

						sh 'docker container ls -a -fname=My-practice-website -q | xargs -r docker container rm'
                }
			}
		}
        
	}
}
