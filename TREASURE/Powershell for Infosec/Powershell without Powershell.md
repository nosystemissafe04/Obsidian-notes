![[Pasted image 20240806153519.png]]
powershell.exe is just a front end to [[System.Management.Automation]]
so the point here is to say that powershell is just a frontend which uses this dll to do automate or run cmdlets . one can also build a frontend to utilize this dll to do powershell tasks 
powershell ISE  is just another example of it . so one can utilize the functionality of this dll without ever executing powershell.exe . attackers made a custom frontend to use as powershell to bypass those logging and detection in powershell . 
i coudnt find the block or github of that c# program 
but if found the program 
```
using System;
using System.Collections.ObjectModel;
using System.Management.Automation;
using System.Management.Automation.Runspaces;
using System.Text;

/*
Simplified version of code originally authored by: Casey Smith, Twitter: @subTee
License: BSD 3-Clause

Compile with:
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe /r:C:\Windows\assembly\GAC_MSIL\System.Management.Automation\1.0.0.0__31bf3856ad364e35\System.Management.Automation.dll /unsafe /platform:anycpu /out:PSwoPS.exe C:\Users\IEUser\PowerShellForInfoSec\Tools\PSwoPS.cs
*/

 public class Program
 {
	 public static void Main()
	 {
		while(true)
		{		
			Console.Write("PS without PS >");
			string x = Console.ReadLine();
			Console.WriteLine(RunPSCommand(x));		
		}
	}
 
 	//Based on Jared Atkinson's And Justin Warner's Work
	public static string RunPSCommand(string cmd)
	{
		//Init stuff
		Runspace runspace = RunspaceFactory.CreateRunspace();
		runspace.Open();
		RunspaceInvoke scriptInvoker = new RunspaceInvoke(runspace);
		Pipeline pipeline = runspace.CreatePipeline();

		//Add commands
		pipeline.Commands.AddScript(cmd);

		//Prep PS for string output and invoke
		pipeline.Commands.Add("Out-String");
		Collection<PSObject> results = pipeline.Invoke();
		runspace.Close();

		//Convert records to strings
		StringBuilder stringBuilder = new StringBuilder();
		foreach (PSObject obj in results)
		{
			stringBuilder.Append(obj);
		}
		return stringBuilder.ToString().Trim();
	 } 
 }
```
this program is creating a runspace which powershell also does to system.management.automation and then it creates a pipeline and invoke commands same as powershell `pipeline.Commands.AddScript(cmd);` here we see we are adding a command and invoke it . we can also add a path to our powershell script any script and when this executable run it will run that script 
we have to compile this with `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe /r:C:\Windows\assembly\GAC_MSIL\System.Management.Automation\1.0.0.0__31bf3856ad364e35\System.Management.Automation.dll /unsafe /platform:anycpu /out:PSwoPS.exe C:\Users\IEUser\PowerShellForInfoSec\Tools\PSwoPS.cs`
to compile we have to use cmd  to get an executable out of it 
and runt the executable 
![[Pasted image 20240807160329.png]]
now we got that psudo prompt of ps without ps 
we can run powershell commands in it 
powershell is used by a lot of threat actors to leverage systems . so they think that if they blockit it will be secure but its the opposite powershell have some mechanisms to leverage and you cannot block system.management.automation bcz windows relies on that 
![[Pasted image 20240807174716.png]]
so powershell have those logging , contrain language mode , jea endpoint to secure things and log . so its better to not block powershell 


blogs to read https://www.blackhillsinfosec.com/powershell-without-powershell-how-to-bypass-application-whitelisting-environment-restrictions-av/ there is some bypasses to cmd.exe to run powershell without powershell well we need to compile our frontend with cmd to run another frontend inplace of powershell.exe 