---
layout: post
title:  "Writing a Minimalistic x86 Bootloader"
description: "It's small but mighty"
date:   2018-10-31 14:50:55 +0800
categories: Operating Systems
---

In computing, programs are loaded by progressively smaller and smaller programs, and a bootloader is the smallest of such programs. When you power on a computer, it will first boot the BIOS (Basic Input-Output System) firmware which performs some tests and then boots into the Operating System (OS). More precisely the standard boot up process is as follows:

- The computer boots into the BIOS.
- The BIOS performs a Power-on Self-test (POST).
- Using the information from the POST, and BIOS, the possible boot devices are selected.
- For disk devices, the first 512 bytes of the disk — termed the 'boot sector' — is considered for booting. If the sector can be read and the standard boot signature is present in the last two bytes (`0x55 0xAA`), the device is considered bootable. Otherwise, the next device in the list of candidates is checked.
- Assuming the disk drive is bootable, the 512-byte boot sector is copied to address `0x007C00` at which point the BIOS transfers control to the loaded sector through a jump instruction to `0x007C00`.
- The BIOS installs device drivers to control devices and handle an interrupt.
- The BIOS functions provide operating systems with an advanced collection of low-level API functions.
- Memory access is faster due to the lack of descriptor tables to check and smaller registers

Although real-mode is a 16-bit mode, the 32-bit registers are still available and usable. In real-mode, there is little over 1 MB of addressable memory including the High Memory Area. Now that we understand what real-mode is, let's get started.

I will be using NASM because it's the most ubiquitous flavour of assembly. Since the x86 real-mode defaults to using 16-bit instructions, we want the assembler to output instructions as such. To operate in the 16-bit mode, we need to tell the NASM assembler that we are operating in 16-bit mode using the `BITS` directive.

{% highlight nasm %}
BITS 16  ; 16-bit real-mode instructions
{% endhighlight nasm %}

We already know that the BIOS will copy our boot sector to the memory location `0x7C00` thus we need to use `ORG` directive to specify the origin address at which we expect our bootloader to be loaded to.

{% highlight nasm %}
ORG 7C00H ; Expect the bootloader to be loaded into memory at 0x7C00
{% endhighlight nasm %}

Addresses in x86 processors are calculated by adding the segment address value to an offset value. x86 processors use 16-bit segment registers in both real and protected modes. Thus it's important to ensure that our segments, in particular, our stack and data segments refer to sensible 64K regions. 

Although we won't explicitly be using the stack segment, its good practice to set up one — especially given the fact that some instructions explicitly make use of the segments. It would also be inappropriate not to define a stack if the bootloader were to be expanded beyond our current functionality. I am going to structure the bootloader such that it has a 1K stack just after the location of the boot sector in memory. Our boot sector will be loaded into `0x7C00` and is `0x200` (512) bytes wide, we want our stack to reside just after this. In x86, segments are referred to as 64K chunks of memory and not as specific locations.

{% assign imgs = "../../assets/images/boot-stack.png," | split: ',' %}
{% include image.html images=imgs maxmaxwidth="100%" caption="The boot stack." %}<br class="img">


Before we assign the final location to the stack segment we need to divide the address values by 16. The code to set up our 1K stack is as follows:

{% highlight nasm %}
STACK: MOV AX, 7C0H  ; Set AX equal to the location of xBoot
       ADD AX, 20H   ; Skip over the size of the bootloader divided by 16
       MOV SS, AX    ; Set Stack Segment (SS) to this location
       MOV SP, 400H  ; Set SS:SP at the top of our 1K stack
{% endhighlight nasm %}

Now that we have everything set up, we want to print out some text to the screen. To do that, we can make use of the BIOS interrupt calls which allow us to invoke the facilities of Basic Input/Output System. BIOS only runs in real mode and if we want to make interrupt calls, our program must also run in real mode. Because our program is already running in real mode, we don’t have to worry about that. To write some text to the screen we must first define it. 

{% highlight nasm %}
BOOTMSG: DB 0AH, "Hello, I am xBoot", 0 ; Display the message on a new line
{% endhighlight nasm %}

To access the string stored in memory we need to know where each character in the string is stored in memory. To do that we need to perform pointer addressing of the string data using the Source Index (`SI`) register. To print a character onto the screen we want to use the ‘Video Services’ interrupt while setting `AH` to `0EH`. This allows us to write a character to the screen in TTY (TeleTYpe) mode. The character that we want to write to the screen is to be stored in `AL`. We use the `LODSB` instruction to load the byte at `DS:SI` into `AL` and increment `SI` so that we can access the next character progressively. We want to loop over each character until our loop hits the null-terminated end of the string. To check for a null value, we can perform a logical `OR` on the value present in the `AL` register. If the value is null, the `Zero Flag` would be set and after which we can halt execution to freeze the text on the screen.

{% highlight nasm %}
BOOT: MOV SI, BOOTMSG ; Set the address of the null-terminated string message to the SI register
      MOV AH, 0EH     ; Output characters in TTY mode

LOOP: LODSB     ; Load byte at address DS:SI into AL and increment SI
      OR AL, AL ; Trigger Zero Flag (ZF) if result is zero
      JZ HALT   ; Jump to HALT if ZF is set
      INT 10H   ; Run BIOS interrupt vector and print the character
      JMP LOOP  ; Repeat for the next character

HALT: CLI ; Clear the interrupt flag
      HLT ; Halt the execution 
{% endhighlight nasm %}

Now we've finished writing the main bulk of our program, we just need to pad the remaining 510 bytes with 0s and define the boot signature that we talked about earlier on. 

{% highlight nasm %}
TIMES 510 - ($-$$) DB 0 ; Pad the remaining 510-bytes with zeros
DW 0xAA55               ; Boot signature
{% endhighlight nasm %} 
The complete code should look like this.

{% highlight nasm %}
BITS 16   ; 16-bit real-mode instructions
ORG 7C00H ; Expect the bootloader to be loaded into memory at 0x7C00

STACK: MOV AX, 7C0H  ; Set AX equal to the location of xBoot
       ADD AX, 20H   ; Skip over the size of the bootloader divided by 16
       MOV SS, AX    ; Set Stack Segment (SS) to this location
       MOV SP, 400H  ; Set SS:SP at the top of our 1K stack

BOOT: MOV SI, BOOTMSG ; Set the address of the null-terminated string message to the SI register
      MOV AH, 0EH     ; Output characters in TTY mode

LOOP: LODSB     ; Load byte at address DS:SI into AL and increment SI
      OR AL, AL ; Trigger Zero Flag (ZF) if result is zero
      JZ HALT   ; Jump to HALT if ZF is set
      INT 10H   ; Run BIOS interrupt vector and print the character
      JMP LOOP  ; Repeat for the next character

HALT: CLI ; Clear the interrupt flag
      HLT ; Halt the execution

BOOTMSG: DB 0AH, "Hello, I am xBoot", 0 ; Display the message on a new line

TIMES 510 - ($-$$) DB 0 ; Pad the remaining 510-bytes with zeros
DW 0xAA55               ; Boot signature
{% endhighlight nasm %}

Save the file as boot.asm and assemble it using the following command.

{% highlight bash %}
nasm -f bin boot.asm -o boot.bin
{% endhighlight bash %}

Before you assemble the file using NASM, do make sure that you have NASM and QEMU installed on your host. If you're using a Mac you can install NASM and QEMU using Homebrew.

{% highlight bash %}
brew install nasm
brew install qemu
{% endhighlight bash %}

If you encounter an error with the brew link process run the following command.

{% highlight bash %}
sudo chown -R $(whoami):admin /usr/local/share/man
{% endhighlight bash %}

 To emulate the bootloader using QEMU simply run:

{% highlight bash %}
qemu-system-x86_64 -drive format=raw,file=boot.bin
{% endhighlight bash %}
QEMU will open up in a separate window and boom you have written your very own bootloader!

{% assign imgs = "../../assets/images/xBoot.png," | split: ',' %}
{% include image.html images=imgs maxmaxwidth="100%" %}<br class="img">

