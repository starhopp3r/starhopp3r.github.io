---
layout: post
title:  "Getting Started with the TinyFPGA"
description: "Its really tiny"
date:   2020-05-31 10:10:55 +0800
categories: FPGA
---

Field Programmable Gate Arrays (FPGAs) are semiconductor devices that are based around a matrix of Configurable Logic Blocks (CLBs) connected via programmable interconnects. FPGAs can be reprogrammed to desired application or functionality requirements after manufacturing — hence the term *"field-programmable"*. The FPGA configuration is generally specified using a Hardware Description Language (HDL), similar to that used for an Application-Specific Integrated Circuit (ASIC). Circuit diagrams were previously used to specify the configuration, but this is increasingly rare due to the advent of electronic design automation tools. 

FPGAs contain an array of programmable logic blocks, and a hierarchy of reconfigurable interconnects that allow the blocks to be wired together, like many logic gates that can be inter-wired in different configurations. Logic blocks can be configured to perform complex combinational functions, or merely simple logic gates like AND and XOR. In most FPGAs, logic blocks also include memory elements, which may be simple flip-flops or more complete blocks of memory. Many FPGAs can be reprogrammed to implement different logic functions, allowing flexible reconfigurable computing as performed in computer software. FPGAs have a remarkable role in the embedded system development due to capability to:

- Start system software (SW) development simultaneously with hardware (HW).
- Enable system performance simulations at very early phase of the development.
- Allow various system partitioning (SW and HW) trials and iterations before final freezing of the system architecture.

FPGAs are very different to a traditional microcontroller board. With a microcontroller, you only have control over the code that runs on the microcontroller chip. FPGAs, on the other hand, allows you to start with a blank slate and design the circuit rather than write the code that runs on it. Once viewed as exotic and scary, the coming of the age of the maker FPGA boards has allowed hobbyists like me to venture off into the once uncharted territory of hardware description.


{% assign imgs = "../../assets/images/tinyfpga.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The TinyFPGA BX" %}<br class="img">

The TinyFPGA BX is a maker-friendly breadboardable FPGA board powered by Lattice Semiconductor's ICE40LP8K FPGA chip. The FPGA features 7,680 four-input look-up-tables, 128 KBit of block RAM, Phase Locked Loop (PLL) and 41 user IO pins. The TinyFPGA BX has 8 MBit of SPI flash and can be programmed using a standard micro-USB cable. Onboard 3.3 V (300 mA) and 1.2 V (150 mA) Low-Dropout (LDO) regulators offer protection against voltage fluctuations.

The TinyFPGA BX brings the power and flexibility of custom digital logic designs to the maker community. The BX module allows us to design and implement our own digital logic circuits in a tiny form-factor perfect for breadboards, small spaces, or custom PCBs.

This incredible power allows us to do things that are not possible with traditional microcontrollers. While microcontroller boards have a fixed set of peripheral devices on-board, the TinyFPGA BX modules can implement the exact peripheral devices needed to get the job done. It’s not software bit-banging, it’s the real deal implemented in digital logic. When the next project has different requirements, we can reprogram the TinyFPGA BX with a new design suited to the task.

Now that we have talked about the TinyFPGA's features, its time to get started with our first hardware descriptor program.

# Step 1: Install the Toolchains

The toolchains for the TinyFPGA BX require Python. If you don’t already have Python installed, visit python.org and download Python 3.6 and remember to check the *“Add Python 3.6 to PATH”* checkbox during installation. We will be installing two toolchains that will allow us to build and program the TinyFPGA board, namely: [APIO](https://github.com/FPGAwars/apio) and [tinyprog](https://github.com/tinyfpga/TinyFPGA-Bootloader/tree/master/programmer). APIO is a tool that makes it very easy to run open source FPGA toolchains and program designs onto the FPGA board.

To install APIO and tinyprog, open up a terminal and run the following commands.

{% highlight bash %}
pip install apio tinyprog 
apio install system scons icestorm iverilog
apio drivers --serial-enable
{% endhighlight bash %}

These commands install APIO, tinyprog, as well as all of the necessary tools to actually program the TinyFPGA. If you are on a Unix system, you may need to add yourself to the dialout group in order for your user to be able to access serial ports. You can do that by running:

{% highlight bash %}
sudo usermod -a -G dialout $USER
{% endhighlight bash %}

Connect your TinyFPGA BX board and make sure the bootloader is up to date by running the following command:

{% highlight bash %}
tinyprog --update-bootloader
{% endhighlight bash %}

# Step 2: Clone the APIO Template

Create a directory called Blinky and clone the APIO template by running the following command:

{% highlight bash %}
mkdir Blinky
cd Blinky
git clone https://github.com/tinyfpga/TinyFPGA-BX.git
{% endhighlight bash %}

If you open up the TinyFPGA-BX folder inside your working directory (`Blinky`), you can see a folder named `apio_template`. You are free to change the name of this folder, I've decided to name mine `src`. Move the `src` folder to the root of your working directory and delete the TinyFPGA-BX folder because you don't really need it anymore.

You can clean up the `src` folder by deleting the `install_apio` batch and shell scripts. This leaves us with three files: `apio.ini`, `pins.pcf` and `top.v`. The `apio.ini` file tells APIO what board we are using while the `pins.pcf` file is a Physical Constraints File (PCF) that maps the TinyFPGA BX's pin names to the FPGA's pin names. `top.v` is the Verilog Hardware Descriptor Language (VHDL) file that allows us to design the circuit for the FPGA.

# Step 3: Build and Upload the Program

Open the `src` folder in terminal. Run the following commands to build and upload the program to the TinyFPGA.

{% highlight bash %}
apio build
tinyprog -p hardware.bin
{% endhighlight bash %}

Once done, you should see the boot LED blinking an SOS pattern. That's it! You have successfully programmed an FPGA! Go ahead and change the code inside of `top.v` to build anything from drivers to an 8-bit CPU from history, the possibilities are endless!

