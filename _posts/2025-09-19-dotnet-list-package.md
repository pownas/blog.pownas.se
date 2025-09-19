---
layout: post
title: "dotnet list package"
date: 2025-09-19 22:22:22 +0200
category: "c-sharp,.NET,programmering"
---

En liten påminnelse om `dotnet list package` som är ett enkelt kommando man kan köra för att kolla om man är på senaste NuGet-paket versioner, är då att använda sig av:   
```ps
dotnet list package --outdated
```

Ger då en trevlig lista över vilka NuGet-paket som inte uppdaterats: 
```ps
Project `ArvidsonFoto` has the following updates to its packages
   [net10.0]: 
   Top-level Package                                           Requested   Resolved   Latest
   > Azure.Identity                                            1.13.1      1.13.1     1.16.0
   > MailKit                                                   4.9.0       4.9.0      4.13.0
   > Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore      9.0.0       9.0.0      9.0.9 
   > Microsoft.AspNetCore.Identity.EntityFrameworkCore         9.0.0       9.0.0      9.0.9 
   > Microsoft.AspNetCore.Identity.UI                          9.0.0       9.0.0      9.0.9 
   > Microsoft.EntityFrameworkCore.SqlServer                   9.0.0       9.0.0      9.0.9 
   > Microsoft.EntityFrameworkCore.Tools                       9.0.0       9.0.0      9.0.9 
   > MimeKit                                                   4.9.0       4.9.0      4.13.0
   > Serilog                                                   4.2.0       4.2.0      4.3.0 
   > Serilog.Sinks.File                                        6.0.0       6.0.0      7.0.0 

The given project `ArvidsonFoto-LogReader` has no updates given the current sources.
Project `ArvidsonFoto.Tests.Unit` has the following updates to its packages
   [net10.0]: 
   Top-level Package                Requested   Resolved   Latest 
   > Aspire.Hosting.Testing         9.0.0       9.0.0      9.4.2  
   > coverlet.collector             6.0.2       6.0.2      6.0.4  
   > Microsoft.NET.Test.Sdk         17.10.0     17.10.0    17.14.1
   > xunit                          2.9.2       2.9.2      2.9.3  
   > xunit.runner.visualstudio      2.8.2       2.8.2      3.1.4  
```

Då kan man enkelt se vilka paket man har som behöver uppdateras och vad som är senaste versionen. 


Mer info om `dotnet list package` på engelska: 

-------------------------

The dotnet list package command is used to list NuGet package references for a project or solution. It provides details about installed packages, their versions, and can also identify outdated or vulnerable packages.

**Example: Basic Usage**

To list all package references in a project:  
`dotnet list package`

**Key Options and Examples** 
List Outdated Packages Use the --outdated option to find packages with newer versions available:  
`dotnet list package --outdated`

Include Prerelease Versions Combine --outdated with --include-prerelease to include prerelease versions:  
`dotnet list package --outdated --include-prerelease`

Include Transitive Dependencies To display transitive dependencies (packages indirectly referenced):  
`dotnet list package --include-transitive`

Filter by Framework Specify a target framework to filter results:  
`dotnet list package --framework net10.0`

Output in JSON Format Generate machine-readable JSON output:  
`dotnet list package --format json`

Check Vulnerabilities Identify packages with known vulnerabilities:  
`dotnet list package --vulnerable`

**Important Notes**

Ensure the project is built before running this command, as it relies on the assets file.
The `--outdated` option only lists stable versions unless combined with `--include-prerelease`.
Use dotnet restore if the assets file is missing.

This command is highly useful for maintaining and auditing NuGet dependencies in .NET projects

------------

Läs mer via Microsoft Learn:  
[https://learn.microsoft.com/en-us/nuget/consume-packages/install-use-packages-dotnet-cli](https://learn.microsoft.com/en-us/nuget/consume-packages/install-use-packages-dotnet-cli)

Och även:  
[https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-package-list](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-package-list)

