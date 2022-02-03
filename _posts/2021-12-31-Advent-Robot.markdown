---
layout: post
title: "Advent of Robots"
description: "The Advent calendar of robot construction"
date: 2021-12-31 10:27:55 +0800
categories: Robots
---

It's that time of the year when ardent programmers turn to their Advent calendars of small programming puzzles to challenge each other, prepare for an interview, or just engage in some speed contest of sorts. Yes, I'm talking about the Advent of Code. If you're a hobbyist programmer like me, you might have heard about the Advent of Code and even worked on some of the problems yourself, but I wanted to do something different this year. As a first-year member of a maker space club, Garage@EEE, at my university, I was tasked with leading a group of my fellow club members in an internal makeathon. The themes for this year's makeathon were automation and sustainability. My team and I decided to build a robot to automate a boring process. I will not share the exact details of our robot and what it does because the makeathon is still ongoing.

I decided to work on the navigation stack of the robot because it seemed exciting and challenging. My team was under a relatively small budget, so we could only source sensors that would enable me to build a 2D navigation stack. So what is a 2D navigation stack? A 2D navigation stack takes in information from odometry, sensor streams, and a goal pose and outputs safe velocity commands sent to a mobile base. The navigation stack allows a robot to navigate an environment autonomously, with minimal human intervention. Today, most autonomous robots rely on LiDARs to sense their environment and navigate safely.

{% assign imgs = "../../assets/images/lidar-robot.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The Test Robot"%}<br class="img">

Gone are the days when LiDAR technology was inaccessible to hobbyists like me due to their hefty price tag and bulkiness. Today, it's relatively easy to get your hands on a sub $100 LiDAR module with a decent range and accuracy to satisfy your maker's needs. I decided to purchase the OKdo Direct Time of Flight (DTOF) LD06 LiDAR for my robot. The LiDAR has a 12-meter range and 360-degree coverage. I also bought some additional parts that would enable me to build a small test robot (shown above) to test my 2D navigation stack before integrating it with the main robot that my teammates were prototyping. I spent most of my Advent coding the navigation stack and building the robot with periodic testing in between. In this blog post, I'd like to share my thought process and details of the technical hiccups I had throughout my Advent. It was a fun experience that I think is worth sharing.

# LiDAR & Navigation

The OKdo LD06 LiDAR has a typical scan frequency of 10 Hz, and this is adjusted based on external Pulse Width Modulation (PWM) speed control. The LiDAR uses the Universal Asynchronous Receiver-Transmitter (UART) interface to transmit measurement data without any instruction after it's working stably. I initially wrote a Python script that uses pySerial to read the incoming data stream from the LiDAR. However, it was very tedious and challenging to get the full 360-degree scan. Luckily for me, the LiDAR manufacturer had also developed a ROS driver for the LiDAR. So I subscribed to the LiDAR's ROS topic to obtain the full scan measurements.  

{% assign imgs = "../../assets/images/lidar.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Direct Time of Flight LD06 LiDAR mounted on my Raspberry Pi 3B."%}<br class="img">

I used ROS's rviz software to look at the scan measurements and visualize them in 2D before working on the navigation stack code. The image below shows the LiDAR scan of my room as viewed in rviz. The different colors indicate the confidence value of the individual points. I chose to ignore the confidence value while coding my navigation stack because the driver filters the points and makes sure that the navigation stack uses only points with a high confidence value.

{% assign imgs = "../../assets/images/rviz-scan.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="LiDAR scan of my room as viewed in rviz."%}<br class="img">

The LiDAR uses a left-hand coordinate system. The front side of the sensor is defined as the x-axis (namely the zero direction), the rotation center is the coordinate origin, and the rotation angle increases along the clockwise direction. This arrangement resembles the familiar unit circle flipped about the x-axis and expanded to a 12-meter radius.  

{% assign imgs = "../../assets/images/robot-coord-sys.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="65%"%}<br class="img">

The LiDAR measures the distance to a certain point in space relative to its origin. If we want to know a point's absolute coordinates in 2D space, we need to perform some simple trigonometry. Unlike the unit circle, the ray from the origin $$(0, \ 0)$$ to the $$(x, \ y)$$ coordinates of a point makes an angle $$\theta$$ from the positive x-axis, where clockwise rotation is positive. Therefore, we modify the equation of the $y$ coordinate by adding a minus sign to accommodate for the change in orientation of the y-axis.

$$x = \text{distance} * \cos \theta$$

$$y = - \ \text{distance} * \sin \theta$$

We can determine the absolute position of any point in 2D space with these equations, given the distance to the point measured by the LiDAR. With this information, we can determine how far away an obstacle is from the robot with high certainty and code a reasonably simple but robust obstacle avoiding avoidance algorithm. I rotated and moved my LiDAR around to see if it affected how the points were represented in 2D space. The graphs below show LiDAR scans of my room in different orientations.

{% assign imgs = "../../assets/images/lidar-scan.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption=" LiDAR scans of my room in different orientations."%}<br class="img">

From there on, coding the obstacle avoidance algorithm was relatively straightforward. The LiDAR scans sent to the Raspberry Pi have 360-degree coverage but not necessarily 360 measurement points. Most of the time, the number of points in a single scan was in the 250-350 range, depending on various physical and environmental factors. My thought process when developing the obstacle avoidance algorithm was simple and can be summarized as follows:

- Divide the 360-degree single scan into four quadrants that align with the robot's sides.
- Narrow each quadrant into a smaller Field of View (FOV) aligned with the robot's sides.
- Derive a truth table to summarize the navigation logic. 
- Obtain Boolean expressions to summarize the navigation logic.
- Use the Boolean expressions to control the movement of the robot given a single scan.

The truth table that I devised followed a simple logic and can be easily understood. A cell is true if there's an obstacle on the corresponding side of the robot and false otherwise.  

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

I derived the following Boolean expressions using the truth table:

$$\text{Forward}=\overline{\mathrm{F}}$$

$$\text{Right}=\mathrm{F} \overline{\mathrm{R}}$$

$$\text{Rear}=\mathrm{F} \mathrm{R} \overline{\mathrm{B}} \mathrm{L}$$

$$\text{Left}=\mathrm{F} \mathrm{R} \overline{\mathrm{L}}$$

The Boolean variables, $$\mathrm{F}$$, $$\mathrm{R}$$, $$\mathrm{B}$$, and $$\mathrm{L}$$, are $$\text{True}$$ if and only if an obstacle is present in the robot's front, right, rear, and left sides, respectively. Based on these Boolean expressions, the robot can only move forward or backward or turn left or right at any given moment. Writing this logic in code was straightforward, and all that was left to do was code a ROS node to control the twin DC gearbox motors.

Controlling the twin DC gearbox motors of the robot was relatively simple because I used PWM control to adjust the RPM of the motors and the heading of the robot. But there was a catch, and I quickly learned that the robot doesn't move straight when moving forward/backward, and the DC gearbox motors were not rotating at the same speed despite having the same PWM control parameters. Turning left and right was also problematic because I had no way of knowing if the robot would turn 90-degrees or overshoot this heading. I tried to manually adjust the PWM control parameters to control the rotation speed of the left and right motors so that the robot would move forward in a perfectly straight line. I also tried to time the time taken for the robot to turn left and right at 90-degrees but manually adjusting the parameters was very troublesome and often yielded inconsistent results.

# IMU & Heading

An Inertial Measurement Unit (IMU) is an electronic device that detects linear acceleration using accelerometers and rotational rate using gyroscopes. I used an IMU to detect the rotational rate of the robot about the z-axis so that appropriate PWM frequencies could be calculated and sent to the motor controller to control the robot's heading.

{% assign imgs = "../../assets/images/imu.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="45%" caption="GY-521 MPU6050 6 DOF IMU"%}<br class="img">

I used a GY-521 MPU6050 6 DOF IMU sensor that communicates with the Raspberry Pi using the I2C interface to gauge the robot's linear acceleration and rotational rate. The linear acceleration is measured in meters per second squared ($\mathrm{m} / \mathrm{s}^{2}$), and the rotational rate, also known as angular frequency ($\omega$), is measured in degrees per second ($^{\circ}/\mathrm{s}$).

{% assign imgs = "../../assets/images/imudata.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%"%}<br class="img">

I programmed the robot to move forward, turn left, turn right, and reverse for 5 seconds, measured the linear acceleration and rotation rate on all three axes, and plotted it to gain intuition about these measurements. I concluded that the relative angle between an initial position at time $t_1$ and a final position at time $t_2$ is 

$$\Delta \theta=\int_{t_{1}}^{t_{2}} \omega \ dt \approx \sum_{k=1}^{N} \frac{\omega_{k-1}+\omega_{k}}{2} \Delta t_{k}$$

Measuring the relative angle between two positions allowed me to use a Proportional–Integral–Derivative (PID) controller to control (I'll write a separate blog post on this) the robot's heading.

# Power

If you were to look at the photo of the test robot, you would realize that two separate battery packs are powering the robot. The battery pack mounted in front uses four AA batteries to power the motor driver and the twin DC gearbox motors, while the battery pack mounted at the rear uses two 18650 lithium-ion batteries to power the Raspberry Pi and the LiDAR module. I decided to use two separate power sources instead of one to eliminate the possibility of having a single point of failure. Under this arrangement, even if the AA batteries were to drain out first, which is highly possible every time we run the robot, we can still safely shut down the Raspberry Pi and the LiDAR module without risking memory corruption and other electro-mechanical failures.

{% assign imgs = "../../assets/images/power-reading.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Raspberry Pi's power consumption under different arrangements."%}<br class="img">

It took me a while to perfect this arrangement because the Raspberry Pi LiDAR interface was initially not performing as I expected. Originally, the 18650s were powering the Raspberry Bi and the LiDAR module via the USB to micro-USB interface, and the publishing frequency of the LiDAR ROS node was about 0.25 Hz. However, when I powered the Raspberry Pi and the LiDAR module using a wall adapter, the publishing frequency of the LiDAR ROS node was about 10 Hz which follows the typical scanning frequency of the LiDAR as mentioned in the datasheet. Therefore, I used a USB multimeter to measure the power consumed by the Raspberry Pi and the LiDAR module under different arrangements.

In the image shown above, the first reading shows the Raspberry Pi's power consumption when powered by a wall adapter and is, in turn, powering the LiDAR module. The arrangement required about 4.3 Watts of power, and the LiDAR ROS node was publishing messages at a frequency of 10 Hz. The second reading shows the Raspberry Pi's power consumption when the two 18650 batteries powered it. This arrangement consumed 3.1 Watts of power, and the LiDAR ROS node was publishing messages at a frequency of 0.25 Hz. The last reading shows the Raspberry Pi's power consumption when powered by a wall adapter, and the two 18650 batteries powered the LiDAR module. This arrangement consumed 3.1 Watts of power, and the LiDAR ROS node was publishing messages at a frequency of 10 Hz. I concluded that the Raspberry Pi was underpowered under the second arrangement and decided to separately power the Raspberry Pi and the LiDAR module.

{% assign imgs = "../../assets/images/li-ion-power.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%"%}<br class="img">

Luckily, the lithium-ion battery module I was using had 3V and 5V ports wired directly to the buck-boost converter. The 5V port allowed me to source power for the LiDAR module separately without affecting the power output at the module's USB port, leaving enough juice to power both the Raspberry Pi and the LiDAR module using the two 18650 batteries. This arrangement worked perfectly, and the LiDAR ROS node could publish messages at a frequency of 10 Hz without any issues. I was happy that the robot worked as I had hoped, and this concludes this year's advent.

Happy new year 🥳 folks!

P.S. I'd like to thank my buddy Bryan, the robot whizz, for helping me out with troubleshooting. Do check out his [blog](https://modelconverge.xyz)!