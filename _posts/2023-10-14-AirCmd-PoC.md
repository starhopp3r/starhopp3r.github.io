---
title: "A Proof of Concept for Setting Up a Networkless Shell"
category: Hardware & Security
cover: /assets/img/covers/aircmd-1440.webp
cover_small: /assets/img/covers/aircmd-720.webp
cover_alt: The AirCmd radio and USB hardware prototypes
dek: Building a LoRa command shell for air-gapped systems.
---

A shell is a user interface for an operating system's services. It lets users execute commands, run scripts, and manage files and processes. Shells can be graphical (GUI) or command-line (CLI) interfaces. In a command-line shell, users type commands and receive text responses. In cybersecurity, a shell is a command interface that attackers establish on a compromised system to run commands and control it remotely, often through scripts or programs that exploit a vulnerability. Two common types in network security are bind shells and reverse shells.

Both bind shells and reverse shells need a network connection between the attacker and the target to send commands and return responses. But air-gapped networks and isolated systems are deliberately disconnected from other networks as a security measure. This makes a network connection to them extremely difficult, if not impossible.

## AirCmd

I designed AirCmd (pronounced "air command") as a set of hardware and software tools for penetration testers to establish a connectionless, networkless shell on an air-gapped network or isolated system. It provides a bidirectional, shell-like command and control interface over LoRa. LoRa's range could let a tester work up to 5 km from the target in urban areas, or up to 15 kilometers or more in rural areas within line of sight. AirCmd introduces no malware or malicious code into the target, allowing it to evade standard anti-virus software and operate undetected. It works as a "remote keyboard", typing and executing commands from a distance.

This proof of concept assumes that:

1. You have physical access to a device within the air-gapped network or isolated system.
2. The device has a USB port that accepts peripherals.
3. The facility housing the network or system is not radio-hardened.
4. PowerShell is available and usable on the target device.

When you enter a command on your device, AirCmd sends it over LoRa to the transceiver connected to the target's USB port. That hardware executes the command through PowerShell, captures the output, and sends it back over LoRa to your transceiver. This process lets you run commands remotely without a network connection, providing secure, isolated control of the target.

![img](/assets/img/aircmd-arch.png)
_Process flow of AirCmd Ax and Tx_

AirCmd has two parts: AirCmd Ax on the attacker side and AirCmd Tx on the target side. On the attacker side, the AirCmd Shell connects to the AirCmd Ax transceiver, for which I used the LILYGO® LoRa32 V2.1_1.6. On the target side, AirCmd Tx combines a Diymore BEETLE BadUSB Micro ATMEGA32U4-AU Development Expansion Module Board with an RFM95W-915S2 LoRa module. It also uses a PowerShell interface to detect the port and execute commands.

### AirCmd Shell

![img](/assets/img/aircmd-shell.png)
_The AirCmd Shell_

The AirCmd Shell is a Python script that connects the attacker to the AirCmd Ax transceiver through USB serial. When you enter a command, the script encodes it as UTF-8 and sends it to the transceiver's USB port. It then waits for a response from AirCmd Ax, which returns one after receiving a transmission from AirCmd Tx.

### AirCmd Ax Transceiver

![img](/assets/img/aircmd-hardware.png)
_AirCmd Ax and Tx Transceiver Hardware_

The AirCmd Ax transceiver monitors its USB port for serial data. When data arrives, it sends it to AirCmd Tx over LoRa and waits for a response. It then returns that response to the AirCmd Shell through the serial connection.

### AirCmd Tx Transceiver

The AirCmd Tx transceiver is AirCmd's most important part. It receives the payload, injects it into the target through PowerShell, retrieves the output, and sends it back to AirCmd Ax.

Arduino's Keyboard library makes it easy to inject and execute a PowerShell payload on the target. But execution alone is not enough: we also need the output. For example, a command that displays a file's contents on the target does not let us read them in the AirCmd Shell. To return the output, we use a series of PowerShell commands that execute the original command, pipe its output, join the output lines with a separator, and write the result to the serial port connected to AirCmd Tx.

```powershell
$lines = [CMD] | % { $_.ToString() }; $joinedLines = $lines -join '?'; $port = new-Object System.IO.Ports.SerialPort [PORT], 9600, None, 8, One; $port.Open(); $port.WriteLine($joinedLines); $port.Close();
```

`[CMD]` is the command entered in the AirCmd Shell, and `[PORT]` is the serial port that connects to AirCmd Tx. To find that port, the transceiver uses these PowerShell commands:

```powershell
Get-WmiObject -Class Win32_SerialPort | % {if ($_.Description -match 'Arduino') {iex "mode $($_.DeviceID): baud=9600 parity=n data=8 stop=1"; $port = new-Object System.IO.Ports.SerialPort $_.DeviceID,9600,None,8,One; $port.Open(); $port.WriteLine($_.DeviceID); $port.Close()}}
```

As soon as AirCmd Tx connects to the target, it opens a PowerShell window, runs the port sensing commands, and stores the port information in memory. It later uses this information to write command output back to the correct port.

### PowerShell

PowerShell, which AirCmd Tx runs on the target, supports system administration, automation, and scripting. Because Windows environments trust it, attackers may use it to bypass security measures such as antivirus software. Its ability to execute code and scripts can let them run malicious code or establish persistence, while its broad system access can let them extract sensitive data or change settings. Attackers might also use its remote management features to control a compromised system or spread malware across a network. These capabilities and its legitimate role make PowerShell a useful tool for attackers who want to exploit vulnerabilities and extract data.

## Demo

{% include embed/youtube.html id='lDhl9ivTlL0' %}

This proof of concept has limits that a more refined design could address. Because AirCmd uses LoRa to transfer data, LoRa's packet size and throughput constrain it. My main aim was to show that a networkless shell is possible and how it could compromise an air-gapped system. The implementation also provides a basis for testing solutions and exploring ways to address these limits.

The source code for this proof of concept is available [here](https://github.com/Malware-Mystic/AirCmd/).
