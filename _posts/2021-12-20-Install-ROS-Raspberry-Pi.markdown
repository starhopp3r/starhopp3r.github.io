---
layout: post
title: "Getting Started with ROS on Raspberry Pi"
description: "Installing Robot Operating System (ROS) Noetic Ninjemys on a Raspberry Pi"
date: 2021-12-20 10:27:55 +0800
categories: Robots
---

The Robot Operating System (ROS) is an open-source robotics middleware suite. ROS is not a traditional operating system like Linux or macOS but a collection of software libraries and tools used to build robotic systems and applications. The current Long Term Service (LTS) version of ROS 1 is Noetic Ninjemys. It was released on May 23, 2020, by Open Robotics, the developer of ROS. It will be supported for five years until May 2025. However, in the future, all the official effort will be put into developing ROS 2, which is a major rewrite of the ROS framework.

ROS Noetic Ninjemys was developed for Ubuntu 20.04, so Ubuntu is the recommended Linux OS for installation. Note that Windows and Arch Linux support is still experimental and might not be fully functional. This tutorial explains how to install ROS Noetic Ninjemys from source on a Raspberry Pi. It’s not hard, but it will take a long time to compile everything, so grab a cup of coffee and a book to read while you wait for your machine to compile everything.

# Step 1: Preparation of Raspberry Pi

ROS Noetic Ninjemys officially supports the Ubuntu Focal and Debian Buster operating systems. Since the Raspberry Pi OS is a Debian-based operating system, we need to ensure that the Raspberry Pi we're using runs on Raspbian Buster. The latest version of Raspbian at the time of writing is Bullseye, so you'll need to downgrade to Raspbian Buster if you're using the latest version of Raspbian. You can download [Raspbian Buster](https://downloads.raspberrypi.org/raspbian/images/raspbian-2020-02-14/2020-02-13-raspbian-buster.zip) from the Raspberry Pi Foundation's official Raspbian image archives.

Once the Raspberry Pi is up and running, we can check whether the latest drivers are installed with the following command.

{% highlight bash %}
sudo apt-get update
{% endhighlight bash %}

This command updates the list of available packages and their versions.

{% highlight bash %}
sudo apt-get upgrade
{% endhighlight bash %}

Once complete, you can reboot your Raspberry Pi by typing the following command.

{% highlight bash %}
sudo reboot
{% endhighlight bash %}

# Step 2: Increasing Raspberry Pi Swap Memory

If you own a Raspberry Pi, you should know that the RAM has a limited capacity. This problem can be solved by simply enlarging the swap memory of the Raspberry Pi. This means that when all of the Raspberry Pi’s RAM is exhausted, it can start using the swap file as memory instead. Raspbian ships with a default swap file size of 100 MB, and in this case, we are simply increasing that to 2 GB.

Run the following command to stop the operating system from using the current swap file.

{% highlight bash %}
sudo dphys-swapfile swapoff
{% endhighlight bash %}

Next, we need to modify the swap file configuration file. We can open this file using nano by using the command below.

{% highlight bash %}
sudo nano /etc/dphys-swapfile
{% endhighlight bash %}

Within this config file, find the following line of text.

{% highlight bash %}
CONF_SWAPSIZE=100
{% endhighlight bash %}

Now, set it to a size of 2 GB; make sure you have the said amount of space available on your SD card.

{% highlight bash %}
CONF_SWAPSIZE=2048
{% endhighlight bash %}

We can now re-initialize the Raspberry Pi’s swap file by running the command below.

{% highlight bash %}
sudo dphys-swapfile setup
{% endhighlight bash %}

To start the operating system with the new swap file, run the following command.

{% highlight bash %}
sudo dphys-swapfile swapon
{% endhighlight bash %}

You can now verify the amount of RAM and swap memory available by issuing the following command:

{% highlight bash %}
free -h
{% endhighlight bash %}

# Step 3: Set Up ROS Repository on Raspberry Pi

We set up our machine to accept software from `packages.ros.org`.

{% highlight bash %}
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
{% endhighlight bash %}

If the command succeeds, you won’t see any output. However, you can double-check if the repo is added using the `cat` command:

{% highlight bash %}
cat /etc/apt/sources.list.d/ros-latest.list
{% endhighlight bash %}

You will see the following output:

{% highlight bash %}
deb http://packages.ros.org/ros/ubuntu buster main
{% endhighlight bash %}

# Step 4: Set Up Official ROS Keys

Next, we will add the official ROS key to download authentic ROS Noetic Ninjemys packages to our Raspbian Buster.

{% highlight bash %}
curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | 
sudo apt-key add -
{% endhighlight bash %}

# Step 5: Install Build Dependencies on Raspberry Pi

We are finally ready to install ROS Noetic Ninjemys on our Raspberry Pi. First, we make sure our Debian package index is up-to-date:

{% highlight bash %}
sudo apt update
{% endhighlight bash %}

Now pick how much ROS you would like to install.

- **Desktop-Full Install**: Everything in Desktop plus 2D/3D simulators and perception packages.
- **Desktop Install**: Everything in ROS-Base plus tools like rqt and rviz
- **ROS-Base (Bare Bones)**: ROS packaging, build, and communication libraries. No GUI tools.

There are even more packages available in ROS. You can always install a specific package directly. To find available packages, see [ROS Index](https://index.ros.org/packages/page/1/time/#noetic) or use: 

{% highlight bash %}
apt search ros-noetic
{% endhighlight bash %}

We will first install all dependencies:

{% highlight bash %}
sudo apt-get install -y python-rosdep python-rosinstall-generator python-wstool python-rosinstall build-essential cmake
{% endhighlight bash %}

Here, the dependencies include ROS-specific tools (`rosdep`, `rosintall_generator`, and `ws_tool`) and some essential build tools like `make` and `cmake`.

# Step 6: Set up ROS Dependency Sources

First, we initialize `rosdep`, which is a ROS tool for installing dependencies:

{% highlight bash %}
sudo rosdep init
{% endhighlight bash %}

Next, we run `rosdep update` to fetch package information from the repositories that are just initialized.

{% highlight bash %}
rosdep update
{% endhighlight bash %}

# Step 7: Install ROS Dependencies

Before we begin, we will need to create a `catkin` workspace by:

{% highlight bash %}
mkdir ~/ros_catkin_ws
cd ~/ros_catkin_ws
{% endhighlight bash %}

Then we use `rosinstall_generator` to generate a list of ROS Noetic Ninjemys dependencies for different ROS Noetic Ninjemys variants, such as `desktop-full`, `desktop`, and `ros_comm`. I’ll go with installing desktop install here.

{% highlight bash %}
rosinstall_generator desktop --rosdistro noetic --deps --wet-only --tar > noetic-desktop-wet.rosinstall
{% endhighlight bash %}

Next, we will use the `wstool` to fetch all the remote repos:

{% highlight bash %}
wstool init src noetic-desktop-wet.rosinstall
{% endhighlight bash %}

The command will take a few minutes to download the core ROS packages into the `src` folder. If `wstool init` fails or is interrupted, you can resume the download by running:

{% highlight bash %}
wstool update -j8 -t src
{% endhighlight bash %}

Then before compiling the packages in the src folder, we install all system dependencies using `rosdepinstall`:

{% highlight bash %}
rosdep install -y --from-paths src --ignore-src --rosdistro noetic -r --os=debian:buster
{% endhighlight bash %}

# Step 8: Compiling ROS Packages

Once it has completed downloading the packages and resolving the dependencies, you are ready to build the catkin packages.

{% highlight bash %}
sudo src/catkin/bin/catkin_make_isolated --install -DCMAKE_BUILD_TYPE=Release --install-space /opt/ros/noetic -j2 -DPYTHON_EXECUTABLE=/usr/bin/python3
{% endhighlight bash %}

It takes a long time to compile these packages so you can work on something else in the meantime. Once the packages have been compiled, you should see the following output:

{% highlight bash %}
<== Finished processing package [184 of 184]: 'xacro'
{% endhighlight bash %}

# Step 9: Verify ROS Installation on Raspberry Pi

First, let’s source the bash.

{% highlight bash %}
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
{% endhighlight bash %}

Let’s try some ROS commands to ensure the installation has finished successfully. A simple way to check the functionality of ROS is to use the `turtlesim` simulator that is part of the ROS installation.

Open a new terminal and run the following command:

{% highlight bash %}
roscore
{% endhighlight bash %}

Start a new terminal prompt and run the below command in the terminal:

{% highlight bash %}
rosrun turtlesim turtlesim_node
{% endhighlight bash %}

Open up yet another terminal window. Run the following:

{% highlight bash %}
rosrun turtlesim turtle_teleop_key
{% endhighlight bash %}

Click the mouse in the last container window you created so that it has focus. Use the arrow keys to move the turtle around the screen. If everything goes right, you will obtain the following result on current terminal:

{% highlight bash %}
Press Ctrl-C to stop `roscore`, etc.
{% endhighlight bash %}

Congratulations! 🎉 We are done with the ROS installation!
