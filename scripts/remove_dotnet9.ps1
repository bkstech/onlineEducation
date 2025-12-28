$root = 'C:\Program Files\dotnet\shared\Microsoft.NETCore.App'
if (Test-Path $root) {
    Get-ChildItem $root -Directory | Where-Object { $_.Name -like '9.*' } | ForEach-Object {
        Write-Output "Removing: $($_.FullName)"
        Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
    Write-Output "Remaining versions:"
    Get-ChildItem $root -Name
} else {
    Write-Output "$root does not exist"
}
