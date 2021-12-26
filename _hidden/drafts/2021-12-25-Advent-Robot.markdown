---
layout: post
title: "Advent of Robots"
description: "Advent calendar of robot build"
date: 2021-12-25 10:27:55 +0800
categories: Robots
---

It's that time of the year when ardent programmers turn to their Advent calendars of small programming puzzles to challenge each other, prepare for an interview, or just engage in some speed contest of sorts. Yes, I'm talking about the Advent of Code. If you're a hobbyist programmer like me, you might have heard about the Advent of Code and even worked on some of the problems yourself, but I wanted to do something different this year. As a first-year member of a maker space club, Garage@EEE, in my university, I was tasked with leading a group of my fellow club members in an internal makethon. The themes for this year's makeathon were automation and sustainability. My team and I decided to build a robot to automate a boring process. I will not share the exact details of our robot and what it does because the makeathon is still ongoing.

I decided to work on the navigation stack of the robot because it seemed exciting and challenging. My team was under a relatively small budget, so we could only source sensors that would enable me to build a 2D navigation stack. So what is a 2D navigation stack? A 2D navigation stack takes in information from odometry, sensor streams, and a goal pose and outputs safe velocity commands sent to a mobile base. The navigation stack allows a robot to navigate an environment autonomously, with minimal human intervention. Today, most autonomous robots rely on LiDARs to sense their environment and navigate safely.

{% assign imgs = "../../assets/images/lidar-robot.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The Test Robot"%}<br class="img">

Gone are the days when LiDAR technology was inaccessible to hobbyists like me due to their hefty price tag and bulkiness. Today, it's relatively easy to get your hands on a sub $100 LiDAR module with a decent range and accuracy to satisfy your maker's needs. I decided to purchase the OKdo Direct Time of Flight (DTOF) LD06 LiDAR for my robot. The LiDAR has a 12-meter range and 360-degree coverage. I also bought some additional parts that would enable me to build a small test robot (shown above) to test my 2D navigation stack before integrating it with the main robot that my teammates were prototyping. I spent most of my Advent coding the navigation stack and building the robot with periodic testing in between. In this blog post, I'd like to share my thought process and details of the technical hiccups I had throughout my Advent. It was a fun experience that I think is worth sharing.

# LiDAR & Navigation

The OKdo LD06 LiDAR has a typical scan frequency of 10 Hz, and this is adjusted based on external Pulse Width Modulation (PWM) speed control. The LiDAR uses the Universal Asynchronous Receiver-Transmitter (UART) interface to transmit measurement data without any instruction after it's working stably. I initially wrote a Python script that uses pySerial to read the incoming data stream from the LiDAR. However, it was very tedious and challenging to get the full 360-degree scan. Luckily for me, the LiDAR manufacturer had also developed a ROS driver for the LiDAR. So I subscribed to LiDAR's ROS topic to obtain the full scan measurements.  

{% assign imgs = "../../assets/images/lidar.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Direct Time of Flight LD06 LiDAR mounted on my Raspberry Pi 3B"%}<br class="img">

I used ROS's rviz software to look at the scan measurements and visualize them in 2D before working on the navigation stack code. The image below shows the LiDAR scan of my room as viewed in rviz. The different colors indicate the confidence value of the individual points. I chose to ignore the confidence value while coding my navigation stack because the driver filters the points and makes sure that the navigation stack uses only points with a high confidence value.

{% assign imgs = "../../assets/images/rviz-scan.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="LiDAR scan of my room as viewed in rviz."%}<br class="img">

The LiDAR uses a left-hand coordinate system. The front side of the sensor is defined as the x-axis (namely the zero direction), the rotation center is the coordinate origin, and the rotation angle increases along the clockwise direction. This arrangement resembles the familiar unit circle flipped about the x-axis and expanded to a 12-meter radius.  

{% assign imgs = "../../assets/images/robot-coord-sys.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="65%"%}<br class="img">

The LiDAR measures the distance to a certain point in space relative to its origin. If we want to know a point's absolute coordinates in 2D space, we need to perform some simple trigonometry. Unlike the unit circle, the ray from the origin $$(0, \ 0)$$ to the $$(x, \ y)$$ coordinates of a point makes an angle $$\theta$$ from the positive x-axis, where clockwise rotation is positive. Therefore, we modify the equation of the $y$ coordinate by adding a minus sign to accommodate for the change in orientation of the y-axis.

$$x = \text{distance} * \sin \theta$$

$$y = - \ \text{distance} * \cos \theta$$

We can determine the absolute position of any point in 2D space with these equations, given the distance to the point measured by the LiDAR. With this information, we can determine how far away an obstacle is from the robot with high certainty and code a reasonably simple but robust obstacle avoiding avoidance algorithm. I rotated and moved my LiDAR around to see if it affected how the points were represented in 2D space. The graphs below show LiDAR scans of my room in different orientations.

{% assign imgs = "../../assets/images/lidar-scan.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption=" LiDAR scans of my room in different orientations."%}<br class="img">

From there on, coding the obstacle avoidance algorithm was relatively straightforward. The LiDAR scans sent to the Raspberry Pi have 360-degree coverage but not necessarily 360 measurement points. Most of the time, the number of points in a single scan was in the 250-350 range, depending on various physical and environmental factors. My thought process when developing the obstacle avoidance algorithm was simple and can be summarised as follows:

- Divide the 360-degree single scan into four quadrants that align with the robot's sides.
- Narrow each quadrant into a smaller Field of View (FOV) aligned with the robot's sides.
- Derive a truth table of sorts to summarise the navigation logic. 
- Obtain Boolean expressions to summarize the navigation logic.
- Use the Boolean expressions to control the movement of the robot given a single scan.

The truth table that I devised followed a simple logic and can be easily understood. 

| **Front** | **Right** | **Rear** | **Left** | **Action** |
|:---------:|:---------:|:--------:|:--------:|:----------:|
|   False   |   False   |   False  |   False  |   Forward  |
|   False   |   False   |   False  |   True   |   Forward  |
|   False   |   False   |   True   |   False  |   Forward  |
|   False   |   False   |   True   |   True   |   Forward  |
|   False   |    True   |   False  |   False  |   Forward  |
|   False   |    True   |   False  |   True   |   Forward  |
|   False   |    True   |   True   |   False  |   Forward  |
|   False   |    True   |   True   |   True   |   Forward  |
|    True   |   False   |   False  |   False  |    Right   |
|    True   |   False   |   False  |   True   |    Right   |
|    True   |   False   |   True   |   False  |    Right   |
|    True   |   False   |   True   |   True   |    Right   |
|    True   |    True   |   False  |   False  |    Left    |
|    True   |    True   |   False  |   True   |    Rear    |
|    True   |    True   |   True   |   False  |    Left    |
|    True   |    True   |   True   |   True   |    Stop    |

Using this table, I derived the following Boolean expressions that summarize the navigation logic.

$$\mathrm{F}=\overline{\mathrm{A}}$$

$$\mathrm{F}=\mathrm{A} \overline{\mathrm{B}}$$

$$\mathrm{F}=\mathrm{A} \mathrm{B} \overline{\mathrm{C}} \mathrm{D}$$

$$\mathrm{F}=\mathrm{A} \mathrm{B} \overline{\mathrm{D}}$$

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

# IMU & Heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

{% assign imgs = "../../assets/images/imu.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="45%" caption="GY-521 MPU6050 6DOF IMU"%}<br class="img">

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

|   **Power Source**  |       **Type**      | **Voltage (V)** | **Current (A)** | **Power (W)** | **LiDAR Stable** |
|:-------------------:|:-------------------:|:---------------:|:---------------:|:-------------:|:----------------:|
|  SAMSUNG EP-TA20UWE |  USB Power Adapter  |       5.00      |       2.00      |     10.00     |        Yes       |
|  SAMSUNG ETA-U90UWE |  USB Power Adapter  |       5.00      |       2.00      |     10.00     |        No        |
| SAMSUNG GB4943-2001 |  USB Power Adapter  |       5.00      |       2.00      |     10.00     |        No        |
|     APPLE A1357     |  USB Power Adapter  |       5.10      |       2.10      |     10.71     |        No        |
|     OPPO AK779GB    |  USB Power Adapter  |       5.00      |       4.00      |     20.00     |        No        |
|     VALORE PD05     | Portable Power Bank |       5.00      |       3.00      |     15.00     |        No        |
|   PHILIPS DLP1130C  | Portable Power Bank |       5.00      |       2.10      |     10.50     |        No        |

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

{% assign imgs = "../../assets/images/charger-graph.png," | split: ',' %}
{% include image.html images=imgs maxwidth="80%" %}<br class="img">

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
