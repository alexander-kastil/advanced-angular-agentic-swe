# Install software using winget
Write-Host "Installing software using winget - 1.5/4" -ForegroundColor yellow

winget install --id Microsoft.VisualStudioCode -e
winget install --id Microsoft.DotNet.SDK.8 -e
winget install --id Microsoft.AzureCLI -e
winget install --id Git.Git -e
winget install --id GitHub.cli -e
winget install --id curl.curl -e
winget install --id OpenJS.NodeJS.LTS -e --version 22.3.0

# Refresh Path Env
Write-Host "Refresh Path Env - 2/4" -ForegroundColor yellow

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Install VS Code Extensions
Write-Host "VS Code Extensions - 3/4" -ForegroundColor yellow

code --install-extension ms-dotnettools.csharp
code --install-extension ms-vscode.azurecli
code --install-extension ms-vscode.azure-account
code --install-extension ms-azuretools.vscode-docker
code --install-extension GitHub.vscode-pull-request-github
code --install-extension angular.ng-template
code --install-extension 1tontech.angular-material
code --install-extension mikael.angular-beastcode
code --install-extension mdickin.markdown-shortcuts
code --install-extension mhutchie.git-graph 
code --install-extension hbenl.vscode-test-explorer
code --install-extension raagh.angular-karma-test-explorer
code --install-extension xabikos.jasminesnippets

# Install NVM
Write-Host "Installing Node using NVM, Angular & json-server - 4/4" -ForegroundColor yellow

# Install Json-server
npm install -g json-server@0.17.4

# Install Node & Angular
npm i -g @angular/cli

# Finished Msg
Write-Host "Finished Software installation" -ForegroundColor yellow