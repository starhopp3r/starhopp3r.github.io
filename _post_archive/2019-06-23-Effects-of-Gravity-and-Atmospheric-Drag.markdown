---
layout: post
title: "The Effects of Gravity and Atmospheric Drag"
description: "The force is real"
date: 2019-06-23 9:00:55 +0800
categories: Space Exploration
---

When we launch rockets from Earth, we’re not flying in free space; we have to fly through the Earth's atmosphere and gravity field. The Earth's atmosphere and gravity field play a vital role in determining the rocket's performance and the success of the mission. 

# The effect of atmospheric drag on rockets

Most rockets experience max q or maximum aerodynamic pressure about a minute into the flight as they fly through the Earth's atmosphere. This is a significant factor in the design of rockets because the aerodynamic structural load on them is proportional to dynamic pressure. The point of max q is a key milestone during a rocket launch, as it is the point at which the airframe undergoes maximum mechanical stress. During a typical Apollo mission, max q occurred between 13 and 14 km of altitude.

<video controls>
  <source src="../../assets/images/Apollo 11 Launch.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video><br>

The video above was taken during the launch of the Apollo 11 mission. You can hear the commentator announce: "we're through the [inaudible] maximum aerodynamic pressure now" about 2 minutes and 22 seconds into the launch. Dynamic pressure, $$ q $$, is defined mathematically as: 

$$ q =  \frac{1}{2} \rho v^{2} $$

where $$ \rho $$ is the local air density, and $$ v $$ is the vehicle's velocity; the dynamic pressure can be thought of as the kinetic energy density of the air with respect to the vehicle. For a launch of a rocket from the ground into space, dynamic pressure is

- Zero at lift-off, when the air density $$ \rho $$ is high but the vehicle's speed $$ v = 0 $$.
- Zero outside the atmosphere, where the speed $$ v $$ is high, but the air density $$ \rho = 0 $$.
- Always non-negative, given the quantities involved.

Therefore (by Rolle's theorem) there will always be a point where the dynamic pressure is maximum. In calculus, Rolle's theorem or Rolle's lemma essentially states that any real-valued differentiable function (a function whose derivative exists at each point in its domain) that attains equal values at two distinct points must have at least one stationary point somewhere between them—that is, a point where the first derivative is zero.

In other words, before reaching max q, the dynamic pressure change due to increasing velocity is greater than that due to decreasing air density so that the dynamic pressure (opposing kinetic energy) acting on the craft continues to increase. After passing max q, the opposite is true. The dynamic pressure acting against the craft decreases as the air density decreases, ultimately reaching 0 when the air density becomes zero.

{% assign imgs = "../../assets/images/maxq.gif," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" %}<br class="img">

This graph was taken from the Apollo 8 launch, it illustrates the changes in the vehicle's Mach number, and the dynamic pressure the vehicle experiences as it rises through the atmosphere. The Apollo 8 Flight Journal's comment on the graph reads: "... Apollo 8 reaches Mach 1, the speed of sound, and is already at 7.35 km altitude. As the vehicle gains speed, the aerodynamic forces acting upon it also rise. However, as it ascends and encounters thinner air, these forces will decrease and at about this point, 1 minute, 18.9 seconds into the flight and 13,430 meters (44,062 feet) altitude, the stack reaches the point of maximum dynamic pressure, often called Max Q, where the interaction of these two phenomena has the largest effect on the vehicle's structure. It is usually considered the most dangerous part of the whole ascent."

# The effect of gravity on rockets

The exhaust velocity of our rocket engine and the thrust to weight ratio (excess thrust) are two critical things we have to consider when we take off from a gravity field. We can calculate the initial acceleration of a rocket at liftoff given excess thrust and gross weight of the vehicle:

$$ \text{Initial Acceleration}  =  \frac{\text { Excess Thrust }}{\text { Gross Weight }} $$

The units for initial acceleration is $$ g $$. The ratio between the excess thrust and the gross weight determines a rocket's initial acceleration. This ratio varies from rocket to rocket. We can use this ratio to explain why a Space Shuttle goes up so much faster than a Saturn V. 

A Space Shuttle has a gross weight at liftoff of about 2.04M kg. A total thrust at liftoff of about 3.13M kg. Thus the Space Shuttle's engines are capable of producing about 1.09M kg of excess thrust at liftoff.

$$ \text{Initial Acceleration}  = \frac{\text {1.09M kg}}{\text { 2.04M kg }} = \text{0.53g}$$

The Saturn V on the other hand is much heavier and has a gross weight at liftoff of about 2.90M kg. A total thrust at liftoff of about 3.40M kg. Thus the Saturn V's engines are capable of producing about 0.5M kg of excess thrust at liftoff.

$$ \text{Initial Acceleration}  =  \frac{\text {0.5M kg}}{\text { 2.90M kg }} = \text{0.17g}$$

The Space Shuttle had a higher initial acceleration rate compared to the Saturn V rocket. This is why a Space Shuttle goes up so much faster than a Saturn V. 