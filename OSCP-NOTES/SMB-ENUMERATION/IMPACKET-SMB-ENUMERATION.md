![[Pasted image 20260308074946.png]]

we logged in without any ccache file or tgt or tgs , just with -k flag of impackets smbclient , while normal smbclient will not work without ccache file we have to generate a tgt , with gettgt from impacket suite 

here also notice how using the hostname of the domain controller allowed the execcution of command 
