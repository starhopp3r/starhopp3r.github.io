---
layout: post
title: "Getting Started with 2D Computational Fluid Dynamics"
description: "It's all about fluid movement"
date: 2020-06-06 10:27:55 +0800
categories: aeronautics
---

Computational Fluid Dynamics (CFD) is one of the key analysis methods used in aerospace engineering applications. Whether you are designing an aircraft or a rocket, as long as it travels through the air, we've got to perform CFD analysis on the craft. Gas and liquid flow behavior is quantified by partial differential equations representing conservation laws for mass, momentum, and energy. Computational fluid dynamics is a branch of fluid mechanics that uses numerical analysis and algorithms to solve fluid flows situations. High-performing computers are used to conduct the calculations required to simulate the interaction of liquids and gases with surfaces defined by boundary conditions.

CFD is based on the Navier-Stokes equations. Arising from applying Newton’s second law to fluid motion, together with the assumption that the stress in the fluid is the sum of a diffusing viscous term and a pressure term, these equations describe how the velocity, pressure, temperature, and density of a moving fluid are correlated. The development of CFD has been closely associated with the evolution of high-speed computers.

# Flowsquare

Flowsquare is a 2D CFD software for unsteady, non-reactive/reactive flows. The aim of this software is to provide a handy CFD environment so that more people can get to know what CFD is like and simulate flows for their educational interests. For example, a typical commercial CFD software costs at least several thousands dollars for one license and requires a lot of computational resources and skills. They are untouchable for most of us. Flowsquare is free of charge, and does not require any professional skills, such as programming, CAD, meshing, preprocessing, post-processing; all we need to do is draw a simple illustration of a simulation field using any available paint tool such as Microsoft Paint.

{% assign imgs = "../../assets/images/flowsquare.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Flowsquare start up page." %}<br class="img">

Using Flowsquare, we can simulate non-reacting flows, reacting flows (e.g. combustion; both for premixed and non-premixed mixtures) and subsonic/supersonic flows. Some unique features of Flowsquare include:

- Computational domain is set by one or two Bitmap image(s) and one text file.
- Visualisation is done in real time (in situ) and can be saved as Bitmap files.
- Various visualisation tools (colours, contours, vectors, graphs and Lagrangian particles) are pre-included.
- Simulation data (binary format) is also available for post-processing.
- Very flexible numerical scheme and conditions (inflow, wall, periodic and moving boundaries are part of them).
- Free of charge. 

Various incompressible **non-reacting flows** can be simulated. The simulation can be very accurate (less than 1% difference from the theoretical value for a 2D channel flow simulation with high order scheme) for appropriate numerical settings. Using inflow, wall and/or moving boundaries, practical configuration can also be simulated.

**Reacting flows** (eg. combustion) can be simulated for both premixed and non-premixed configurations under the low-Mach number assumption. For premixed reacting flows, the chemical reaction rate is described using a one-step global reaction based on the Arrhenius law and the parameters can be adjusted appropriately. In this mode, partially-premixed configurations can also be considered. For non-premixed mode, infinite chemistry (mixed is burnt) is assumed. For both configurations, constant thermochemical and transport parameters are used.

Flowsquare can also deal with Euler equations for **subsonic/supersonic (inviscid) flows**. Various supersonic flows are tested to validate the computational accuracy and some of such cases are introduced for Oblique Shock and de Laval Nozzle configurations. The solutions obtained using Flowsquare differ only 1-2% from theoretical values for tested conditions.

# Getting Started

You can download Flowsquare v4 [here](http://flowsquare.com/?download=Flowsquare4.0zip). Once the download is complete, unzip `flowsquare4.0.zip`, and you will find `flowsquare.exe`, `bc.bmp` and `grid.txt` in the directory. These files are already set up for a simulation of a 2D channel flow, so simply double click `flowsquare.exe` to start your first simulation. These files have important roles as follows:

- `flowsquare.exe` — the software.
- `bc.bmp` — the bitmap image that contains boundary condition of the simulation.
- `grid.txt` — the text file that contains all the simulation parameters.

These files are initially set up for a simulation of 2D channel flow, so you don’t need to change them for now. Additionally, we may use the following input files depending on your simulation cases.

- `ic.bmp` — a bitmap image that contains initial condition of the simulation.
- `bg.bmp` — A bitmap image for the background of the simulation domain.

Remember that `bc.bmp`, `grid.txt`, `ic,bmp` (optional) and `bg.bmp` (optional) are the input files for simulations, and every time you start a simulation these files are read from the main directory.

# Boundary Conditions

Boundary conditions are important since it determines the solution on the boundaries which propagate throughout the domain. In Flowsquare, we use `bc.bmp` to define boundary conditions for simulations, and `bc.bmp` needs to be prepared for each simulation. In order to set boundary conditions, we can use a usual paint tool such as Microsoft Paint and save the image as `*.bmp`.

The size of `bc.bmp` should be the same as the domain size (nx x ny pixels, where nx and ny are specified in `grid.txt`), although if the size of `bc.bmp` does not match to the domain size, Flowsquare interpolates the figure for your simulation automatically. Here, you see a blue line on the left side of the domain, and two black lines on the top and bottom of the domain. Each colour has a specific meaning and following colours are used to specify various boundry conditions in Flowsquare.

- Black (0,0,0): Non-slip zero-flux/fixed temperature boundary (wall).
- Blue (0,0,255): Inflow boundary.
- Red (255,0,0): Inflow boundary.
- Green (0,255,0): Moving wall boundary (zero-flux/fixed temperature).
- Pink (255,0,255): Pure air flow (can be used in premixed mode only).
- Yellow (255,255,0): Additional scalar boundary.

Specifically for Blue, Red and Pink boundaries, they can be set only on the edge of the entire computational domain. If these boundaries are used inside the domain, these colours are considered as initial conditions (note initial condition set using `bc.bmp` is prioritised over by `ic.bmp`). For each boundary type, there are several parameters to be set in `grid.txt`. Some parameters are optional so not all of them are to be specified by users. Here is what user will specify for each boundry conditions in `grid.txt`. The names of variables actually used in `grid.txt` are also introduced here. 

**NOTE:** The `cmode` used in the below is mode of simulation which is `0`: non-reactive, `1`: reactive (premixed), `2`: reactive (non-premixed) or `3`: Sub/supersonic set in `grid.txt`.

**Black: Non-slip zero-flux/fixed temperature boundary (wall)**

- `tempew`: Temperature on the wall (optional). If it’s set to be the value other than 0 (zero), the wall temperature is fixed during the entire simulation. If it’s set to be 0 (zero), the wall temperature changes depending on the surrounding fluids (generally zero gradient).

**Blue: Inflow Boundary**

- `uin1`: Velocity component in x (horizontal) direction on the boundary.
- `vin1`: Velocity component in y (vertical) direction on the boundary.
- `rho1`: Density on the boundary (has to be set for cmode=0 and 3, if this boundry conditions is used).
- `temp1`: Temperature on the boundary (has to be set for cmode=1 and 2, if this boundry conditions is used).
- `scalar1`: Mixture fraction (has to be set for cmode=2, if this boundry conditions is used).

**Red: Inflow Boundary**

- `uin2`: Velocity component in x (horizontal) direction on the boundary.
- `vin2`: Velocity component in y (vertical) direction on the boundary.
- `rho2`: Density on the boundary (has to be set for cmode=0 and 3, if this boundry conditions is used).
- `temp2`: Temperature on the boundary (has to be set for cmode=1 and 2, if this boundry conditions is used).
- `scalar2`: Mixture fraction (has to be set for cmode=2, if this boundry conditions is used).

**Green: Moving wall boundary (iso-thermal/fixed temperature)**

- `imb`: If it’s set to be 1, the boundary movement is repeated periodically. Set it to 0 (zero) otherwise.
- `umb`: Wall displacement speed in x (horizontal) direction.
- `vmb`: Wall displacement speed in y (vertical) direction.
- `tempmb`: Temperature of the moving wall. If it’s set to be the value other than 0 (zero), the wall temperature is fixed during the entire simulation. If it’s set to be 0 (zero), the wall temperature changes depending on the surrounding fluids (generally zero gradient).

**Pink: Pure air flow (can be used in premixed mode only)**

- `uin3`: Velocity component in x (horizontal) direction on the boundary.
- `vin3`: Velocity component in y (vertical) direction on the boundary.
- `temp3`: Temperature on the boundary (has to be set if this boundry conditions is used).

**Yellow: Additional scalar boundary**

- `scalarT`: Scalar value on the boundary.

# Running a Simulation

Let's say we built a small rocket that travels at 200 m/s at sea level (density of air is 1.225 kg/m^3) we have to set appropriate values for the following variables in `grid.txt`.

{% assign imgs = "../../assets/images/gridtxt.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Setting appropriate values for variables in grid.txt" %}<br class="img">

We'll simulate a non-reactive, subsonic flow by setting `cmode` to `0`. The inflow boundary and general boundary share the same flow velocity along the x-axis of the boundaries because we're interested in the in-flight dynamics of the rocket. Now, let's run the simulation.

{% assign imgs = "../../assets/images/pressflow.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Computed pressure distribution of the flow along the surface of the rocket after 5 iterations." %}<br class="img">

I'm using the free version of Flowsquare (LOCKED) so the computational speed is restricted to only 50% of the maximimum computational speed possible. You can unlock the software by donating any amount you wish to the authors of the software. Since we set the `latts` to `4000`, we'll have to wait for 4000 iterations before we can view the fully computed CFD results. 

Even though I stopped the CFD computation after just 5 iterations, we can conclude that there are two regions of high pressue flow along the surface of the rocket. 

- In front/along the nose cone of the rocket.
- Near the end of the rocket's fuselage.

This result might not be definitive at say step 1000; a lot of things could change by then, and the regions of high pressure might be redistributed over time. You may realise that the simulation runs a lot faster when the boundary velocities are low because smaller numbers are easier to work with when you have thousands of calculations to perform for every single grid point on the grid. The speed of simulation depends on both the software and the hardware it's running on. Flowsquare will run two times faster if we unlock it via software and any performance gains after that will really depend on your hardware setup. 

Using this knowledge you can simulate anything from flow along airfoils to supersonic flows. Just remember to change the appropriate values in `grid.txt` and use Microsoft Paint.