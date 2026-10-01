$gitPath = 'C:\Users\VAGEESHA\mingit\cmd\git.exe'
$ghPath = 'C:\Users\VAGEESHA\gh\bin\gh.exe'

$env:PATH = 'C:\Users\VAGEESHA\mingit\cmd;C:\Users\VAGEESHA\gh\bin;' + $env:PATH

Write-Host "--- 1. Initializing Git ---"
& $gitPath init

Write-Host "--- 2. Setting Git User ---"
& $gitPath config user.name "sharmavageesha2000-cmd"
& $gitPath config user.email "sharmavageesha2000@gmail.com"

Write-Host "--- 3. Setting Main Branch ---"
& $gitPath branch -M main

Write-Host "--- 4. Setting Remote Origin ---"
$existingRemote = & $gitPath remote get-url origin 2>$null
if ($existingRemote) {
    & $gitPath remote set-url origin https://github.com/sharmavageesha2000-cmd/DREAM_WEAR_JWELLERY.git
} else {
    & $gitPath remote add origin https://github.com/sharmavageesha2000-cmd/DREAM_WEAR_JWELLERY.git
}

Write-Host "--- 5. Staging Files ---"
& $gitPath add .

Write-Host "--- 6. Status of Staged Files ---"
& $gitPath status -s

Write-Host "--- 7. Committing ---"
& $gitPath commit -m "feat: complete luxury fine jewelry e-commerce website with Node.js Express REST API and PostgreSQL database"

Write-Host "--- 8. Pushing to GitHub ---"
& $gitPath push -u origin main

Write-Host "--- Finished! ---"
