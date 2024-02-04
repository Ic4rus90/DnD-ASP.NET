pipeline
{
    agent any

    stages {

        stage("Clean workspace")

        {
            steps
            {
                sh "echo Cleaning up workspace..."
                cleanWs()
            }
        }

        stage("Get latest source")
        
        {
            steps
            {
                withCredentials([string(credentialsId: 'btoken', variable: 'TOKEN')]) {
                    sh "/home/jenkins/bitbucketnotifier.sh INPROGRESS ${commit} ${commit} ${TOKEN} ${BUILD_NUMBER}"
                }
                git branch: '${pushed_branch}', credentialsId: 'JenkinsSSH', url: 'ssh://git@tools.uia.no:7999/ikt201g22h/lootefix.git'
                echo 'Pulling from git...'
		        echo 'Checking out the commit'

		        sh "git checkout ${commit}"
                
            }
        }
        
        stage("Build main image")
        {
            steps 
            {
                script
                {                
                    try 
                    {
                        sh "docker build -f Dockerfile . -t lootefix:test"
                    }

                    catch(Exception e)
                    {
                        sh "echo Build of main image failed"
                        currentBuild.result = 'ABORTED'
                        withCredentials([string(credentialsId: 'btoken', variable: 'TOKEN')]) {
                        sh "/home/jenkins/bitbucketnotifier.sh FAILED ${commit} ${commit} ${TOKEN} ${BUILD_NUMBER}"
                        }

                        // Something failed, abort the pipeline
                        error("Failed to build main image")

                    }
                }
            }   
        }
        
        stage("Create and start main container")
        {
            steps 
            {
                script 
                {

                
                    try 
                    {
                        sh "docker stop lootefixtest || true && docker rm lootefixtest || true"
                        sh "docker create -p 7268:80 --name lootefixtest lootefix:test"
                        sh "docker start lootefixtest"
                    }

                    catch(Exception e)
                    {
                        sh "echo Failed to start main container"
                        currentBuild.result = 'ABORTED'
                        withCredentials([string(credentialsId: 'btoken', variable: 'TOKEN')]) {
                        sh "/home/jenkins/bitbucketnotifier.sh FAILED ${commit} ${commit} ${TOKEN} ${BUILD_NUMBER}"
                        }

                        // Something failed, abort the pipeline
                        error("Failed to start main container")
                    }
                }
            }

        }
        
        stage("Build test container")
        {
            steps
            {
                script 
                {
                    try 
                    {
                        sh "docker build -t lootefix_xunit -f Dockerfile.xunit ."
                    }

                    catch(Exception e)
                    {
                        sh "echo Building xunit image failed"
                        withCredentials([string(credentialsId: 'btoken', variable: 'TOKEN')]) {
                        sh "/home/jenkins/bitbucketnotifier.sh FAILED ${commit} ${commit} ${TOKEN} ${BUILD_NUMBER}"
                        }

                        // Something failed, abort the pipeline
                        error("Building xunit image failed")
                    }
                }
            }
        }
        
        stage ("Run tests")
        {
            steps 
            {
                sh "echo Running tests..."
 
                script 
                {

		    // If tests succeed, update the build status to SUCCESSFUL on Bitbucket.
                    try
                    {
                        sh "docker stop xunit || true && docker rm xunit || true"
                        sh "docker run --tty --name xunit --rm --network host lootefix_xunit:latest | grep \"Connection refused\" > /dev/null"
                        sh "echo Tests successful"

                        withCredentials([string(credentialsId: 'btoken', variable: 'TOKEN')]) {
                        sh "/home/jenkins/bitbucketnotifier.sh SUCCESSFUL ${commit} ${commit} ${TOKEN} ${BUILD_NUMBER}"}
                        currentBuild.result = 'PASSED'
                    }
			
		    // If tests fail, update the build status to FAILED on Bitbucket.
                    catch (Exception e)
                    {
                        sh "echo Tests failed..."
                        buildresult: 'PASSED'
                        withCredentials([string(credentialsId: 'btoken', variable: 'TOKEN')]) {
                        sh "/home/jenkins/bitbucketnotifier.sh FAILED ${commit} ${commit} ${TOKEN} ${BUILD_NUMBER}"
                        }

                        error("Tests failed")
                    }
                }
            }

        }
        stage("Done!")
        {
            steps
            {
                sh "echo Done!"
            }
        }
    }
}