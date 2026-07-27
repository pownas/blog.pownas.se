# Kategori-audit for bloggposter

Detta dokument innehaller:
1. Ett PowerShell-script som jamfor kategorier i bloggposter mot category_name i [src/_category](../src/_category).
2. Ett Pester-test som failar om nagot inte stammer.

Malet ar att hitta:
- Kategorin fran bloggpost X, saknas i category-mappen
- Kategorin i category-mappen X har inga bloggposter kopplade till sig

## 1) Script: Check-CategoryCoverage.ps1

Skapa filen [docs/Check-CategoryCoverage.ps1](Check-CategoryCoverage.ps1) och klistra in:

~~~powershell
[CmdletBinding()]
param(
    [string]$PostsPath = "./src/_posts",
    [string]$CategoryPath = "./src/_category"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-CategoryAudit {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$PostsPath,
        [Parameter(Mandatory)] [string]$CategoryPath
    )

    $comparer = [System.StringComparer]::Ordinal

    $postCategoryEntries = New-Object System.Collections.Generic.List[object]

    $postFiles = Get-ChildItem -Path $PostsPath -File -Filter "*.md"
    foreach ($postFile in $postFiles) {
        $categoryLine = Select-String -Path $postFile.FullName -Pattern '^category:\s*"?(.*?)"?\s*$' | Select-Object -First 1
        if (-not $categoryLine) {
            continue
        }

        $rawCategories = $categoryLine.Matches[0].Groups[1].Value
        $categories = $rawCategories -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }

        foreach ($category in $categories) {
            $postCategoryEntries.Add([PSCustomObject]@{
                PostFile  = $postFile.Name
                Category  = $category
            })
        }
    }

    $categoryNames = New-Object System.Collections.Generic.List[string]
    $categoryFiles = Get-ChildItem -Path $CategoryPath -File -Filter "*.md"
    foreach ($categoryFile in $categoryFiles) {
        $nameLine = Select-String -Path $categoryFile.FullName -Pattern '^category_name:\s*(.*?)\s*$' | Select-Object -First 1
        if (-not $nameLine) {
            continue
        }

        $rawName = $nameLine.Matches[0].Groups[1].Value.Trim()
        if ($rawName.StartsWith('"') -and $rawName.EndsWith('"')) {
            $rawName = $rawName.Substring(1, $rawName.Length - 2)
        }

        if ($rawName -ne "") {
            $categoryNames.Add($rawName)
        }
    }

    $categorySet = New-Object System.Collections.Generic.HashSet[string]($comparer)
    foreach ($name in $categoryNames) {
        [void]$categorySet.Add($name)
    }

    $postSet = New-Object System.Collections.Generic.HashSet[string]($comparer)
    foreach ($entry in $postCategoryEntries) {
        [void]$postSet.Add($entry.Category)
    }

    $missingInCategoryFiles = foreach ($entry in $postCategoryEntries) {
        if (-not $categorySet.Contains($entry.Category)) {
            [PSCustomObject]@{
                PostFile = $entry.PostFile
                Category = $entry.Category
            }
        }
    }

    $unusedCategoryFiles = foreach ($name in $categoryNames) {
        if (-not $postSet.Contains($name)) {
            $name
        }
    }

    [PSCustomObject]@{
        MissingInCategoryFiles = @($missingInCategoryFiles)
        UnusedCategoryFiles    = @($unusedCategoryFiles | Sort-Object -Unique)
    }
}

$result = Get-CategoryAudit -PostsPath $PostsPath -CategoryPath $CategoryPath

if ($result.MissingInCategoryFiles.Count -eq 0 -and $result.UnusedCategoryFiles.Count -eq 0) {
    Write-Host "OK: Alla kategorier matchar mellan bloggposter och category-mappen." -ForegroundColor Green
    exit 0
}

foreach ($missing in $result.MissingInCategoryFiles) {
    Write-Host ("Kategorin fran bloggpost {0}, saknas i category-mappen: {1}" -f $missing.PostFile, $missing.Category) -ForegroundColor Yellow
}

foreach ($unused in $result.UnusedCategoryFiles) {
    Write-Host ("Kategorin i category-mappen {0} har inga bloggposter kopplade till sig" -f $unused) -ForegroundColor Yellow
}

exit 1
~~~

## 2) Test: CategoryCoverage.Tests.ps1

Skapa filen [docs/CategoryCoverage.Tests.ps1](CategoryCoverage.Tests.ps1) och klistra in:

~~~powershell
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. "$PSScriptRoot/Check-CategoryCoverage.ps1"

Describe "Category coverage" {
    It "has no post categories missing from src/_category" {
        $result = Get-CategoryAudit -PostsPath "./src/_posts" -CategoryPath "./src/_category"

        $details = $result.MissingInCategoryFiles |
            ForEach-Object { "Kategorin fran bloggpost $($_.PostFile), saknas i category-mappen: $($_.Category)" }

        $result.MissingInCategoryFiles.Count |
            Should -Be 0 -Because ($details -join [Environment]::NewLine)
    }

    It "has no category files without linked blog posts" {
        $result = Get-CategoryAudit -PostsPath "./src/_posts" -CategoryPath "./src/_category"

        $details = $result.UnusedCategoryFiles |
            ForEach-Object { "Kategorin i category-mappen $_ har inga bloggposter kopplade till sig" }

        $result.UnusedCategoryFiles.Count |
            Should -Be 0 -Because ($details -join [Environment]::NewLine)
    }
}
~~~

## 3) Sa kor du scriptet

Fran root i repot (alltid case-sensitive):

~~~powershell
pwsh ./docs/Check-CategoryCoverage.ps1
~~~

## 4) Sa kor du testet

Installera Pester (om det inte redan finns):

~~~powershell
Install-Module Pester -Scope CurrentUser -Force -SkipPublisherCheck
~~~

Kor testet:

~~~powershell
Invoke-Pester ./docs/CategoryCoverage.Tests.ps1
~~~

## 5) Tips

- Scriptet returnerar exit code 0 om allt stammer, annars 1.
- Detta gor att du enkelt kan anvanda scriptet i CI/CD senare.
- Om du vill byta mappar, ange egna sokvagar:

~~~powershell
pwsh ./docs/Check-CategoryCoverage.ps1 -PostsPath "./src/_posts" -CategoryPath "./src/_category"
~~~
