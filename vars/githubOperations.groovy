import org.kohsuke.github.GitHubBuilder

def createDeployment(String branch, String repoOwner, String repoName, String token) {
    def github = new GitHubBuilder()
        .withEndpoint('https://api.github.com')
        .withOAuthToken(token)
        .build()
    def repo = github.getRepository("${repoOwner}/${repoName}")
    def deployment = repo.createDeployment(branch)
                        .environment('preview')
                        .autoMerge(false)
                        .create()
    return deployment.getId()
}

def updateDeploymentStatus(String deploymentId, String repoOwner, String repoName, String token, String deployServer, String port) {
    def github = new GitHubBuilder()
        .withEndpoint('https://api.github.com')
        .withOAuthToken(token)
        .build()
    def repo = github.getRepository("${repoOwner}/${repoName}")
    repo.createDeploymentStatus(deploymentId)
        .state('success')
        .targetUrl("http://${deployServer}:${port}")
        .description('Deployment finished successfully!')
        .create()
}

return this
