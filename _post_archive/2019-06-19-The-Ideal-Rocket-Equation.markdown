---
layout: post
title: "The Ideal Rocket Equation"
description: "It's rocket science"
date: 2019-06-19 10:27:55 +0800
categories: Space Exploration
---

{% assign imgs = "../../assets/images/fhengine.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="SpaceX's Falcon Heavy exhaust plumes [Arabsat-6A Mission]." %}<br class="img">

The first gunpowder-powered rockets were invented centuries ago, and since then rocket propulsion technology has evolved to the point where we now use electric propulsion to drive our space probes to the edge of our solar system. The ideal rocket equation and Newton's Laws of Motion, among other things (aerodynamics, etc.), dictate the performance of a rocket. The ideal rocket equation or the Tsiolkovsky rocket equation is fundamentally derived from Newton's laws of motion and the conservation of momentum. Before we derive the ideal rocket equation ourselves, let's revisit Newton's Laws of Motion and the law of conservation of momentum.

- **Newton’s 1st Law:** An object at rest will stay at rest, or an object in motion will stay in motion unless acted upon by an external force.

- **Newton’s 2nd Law:** The vector sum of the forces $$ \vec{F} $$  acting on an object is equal to the mass $$ m $$ of the object multiplied by its acceleration vector $$ \vec{a} $$.

- **Newton’s 3rd Law:** For every action there is an equal and opposite reaction.

Momentum is the quantity of motion of a moving body, measured as a product of its mass and velocity. The Conservation of momentum is a general law of physics according to which the quantity called momentum that characterizes motion never changes in an isolated collection of objects; that is, the total momentum of a system remains constant. Momentum is a vector, involving both the direction and the magnitude of motion so the momenta of objects going in opposite directions can cancel to yield an overall sum of zero.

Before launch, the total momentum of a rocket and its fuel is zero. During launch, the downward momentum of the expanding exhaust gases just equals in magnitude the upward momentum of the rising rocket, so that the total momentum of the system remains constant—in this case, at zero value.

The essence of engines that we use, whether flying through the atmosphere or flying through space, is we carry a certain amount of material inside the spacecraft and we push that material out at a certain speed, and that makes us go forward. The fluid that we push to move forward is called the **working fluid** of the engine, and the speed at which we push out material is known as exit velocity or exhaust velocity. Rockets have a limited size. We can only load a certain amount of propellant on board the rocket. So there's a real question of how much performance can we get out of a given amount of propellant. 

# Deriving The Ideal Rocket Equation

For simplicity, assuming we're in free space (where we don't have to worry about atmospheric drag and gravity), there's no force acting on the rocket except the force of the rocket engine itself. The initial mass of a rocket ($$ \mathrm{m}_{\mathrm{i}} $$) is equal to the sum of the mass of the payload ($$ \mathrm{m}_{\mathrm{PL}} $$), the mass of the structure ($$ \mathrm{m}_{\mathrm{struct}} $$) and the mass of the propellant ($$ \mathrm{m}_{\mathrm{prop}} $$).

$$ \mathrm{m}_{\mathrm{i}} \ = \ \mathrm{m}_{\mathrm{PL}} \ + \ \mathrm{m}_{\mathrm{struct}} \ + \ \mathrm{m}_{\mathrm{ prop }} $$

To calculate the thrust of the engine, we multiply the mass flow rate at the exhaust ($$ \mathrm{\dot{m}} $$), and the velocity at the exit or the exhaust velocity ($$ \mathrm{V}_{\mathrm{e}} $$). By conservation of momentum, we'll get the forward motion of the rocket.

$$ \mathrm{F} = \mathrm{\dot{m}} \mathrm{V}_{\mathrm{e}} $$

Where the mass flow rate ($$ \mathrm{\dot{m}} $$), is a time derivative of mass:

$$ \mathrm{\dot{m}} = \frac{\mathrm{dm}}{\mathrm{dt}} $$

Once the rocket has expended it's propellant, the final mass of the rocket is equal to the initial mass of the rocket minus the mass of the propellant.

$$ \mathrm{m}_{\mathrm{f}} \ = \ \mathrm{m}_{\mathrm{i}} \ - \ \mathrm{m}_{\mathrm{prop}} $$

$$ \mathrm{m}_{\mathrm{f}} \ = \ \mathrm{m}_{\mathrm{PL}} \ + \ \mathrm{m}_{\mathrm{struct}} $$

Now, we can derive the ideal rocket equation.

$$ \mathrm{F} = \mathrm{-V}_{\mathrm{e}} \frac{\mathrm{dm}}{\mathrm{dt}} $$ 

Note: $$ \mathrm{V}_{\mathrm{e}} $$ is negative relative to the the rocket's motion. By conservation of momentum:

$$ \mathrm{F \ = \ ma \ = \ m \frac{dV}{d t} \ = \ -V_{e} \frac{dm}{dt}} $$

$$ \mathrm{m \frac{dV}{dt} \ = \ -V_{e} \frac{dm}{dt}} $$

$$ \mathrm{m \ dV = -V_{e} \ dm} $$ 

$$ \mathrm{dV=-V_{e} \frac{d m}{m}} $$

$$ \int_{\mathrm{V}_{\mathrm{i}}}^{\mathrm{V}_{\mathrm{f}}} \mathrm{dV}=-\mathrm{V}_{\mathrm{e}} \int_{\mathrm{m}_{\mathrm{i}}}^{\mathrm{m}_{\mathrm{f}}} \frac{\mathrm{dm}}{\mathrm{m}} $$

$$ \mathrm{\underbrace{V_{\mathrm{f}}-\mathrm{V}_{\mathrm{i}}}_{\Delta \mathrm{V}} \ = \ -\mathrm{V}_{\mathrm{e}} \ln\frac{\mathrm{m}_{\mathrm{f}}}{\mathrm{m}_{\mathrm{i}}} \ = \ \mathrm{V}_{\mathrm{e}} \ln \frac{\mathrm{m}_{\mathrm{i}}}{\mathrm{m}_{\mathrm{f}}}} $$

Final equation:

$$ \mathrm{\Delta V=V_{e} \ln \frac{m_{i}}{m_{f}}} $$

Exponential form:

$$ \mathrm{\frac{\Delta V}{V_{e}}=\ln \frac{m_{i}}{m_{f}}} $$

$$ \mathrm{\frac{m_{i}}{m_{f}}=e^{\frac{\Delta V}{V_{e}}}} $$

# Implications of the Ideal Rocket Equation

When we change the rocket equation from the logarithmic form to an exponential form, we see that the ratio of the initial to the final mass of the rocket is the exponential of the change in velocity, which we get from burning the propellant, divided by the exhaust velocity.

$$ \mathrm{\frac{m_{i}}{m_{f}}=e^{\frac{\Delta V}{V_{e}}}} $$

The performance of our rocket engine depends on the mass flow rate at the exhaust and the exhaust velocity. But what fraction of the rocket's total mass (**propellant fraction**) has to be propellant in order to get us the velocity ($$ \mathrm{\Delta V} $$) we need?

$$ \mathrm{m}_{\mathrm{prop}} \ = \ \mathrm{m}_{\mathrm{i}} \ - \ \mathrm{m}_{\mathrm{f}} $$

$$ \mathrm{\frac{m_{i}}{m_{f}}=e^{\frac{\Delta V}{V_{e}}}} $$

$$ \mathrm{\frac{m_{f}}{m_{i}}=e^{-\frac{\Delta V}{V_{e}}}} $$

$$ \mathrm{m_{f}=m_{i} e^{-\frac{\Delta V}{V_{e}}}} $$

$$ \begin{split}
\therefore \mathrm{m_{prop}} \ & \mathrm{=} \ \mathrm{m_{i}} \mathrm{-} \mathrm{m_{f}} \\ & \mathrm{=}  \ \mathrm{m_{i}-m_{i} e^{-\frac{\Delta V}{V_{e}}}} \\
& \mathrm{=} \ \mathrm{m_{i}}\left[\mathrm{1-e^{-\frac{\Delta V}{V_{e}}}}\right]
\end{split}$$

Propellant Fraction:

$$ \mathrm{\frac{m_{prop}}{m_{i}}=1-e^{-\frac{\Delta V}{V_{e}}}} $$

Inert Fraction:

$$ \mathrm{\frac{m_{f}}{m_{i}}=e^{-\frac{ \Delta V}{V_{e}}}} $$

Exhaust velocity is critical for performance, and chemical rockets (solid and liquid) have an exhaust velocity of about 2000 - 4500 m/s. Propulsion engineers like to talk about **specific impulse** ($$ \mathrm{I_{sp}} $$); it's a measure of how effectively a rocket uses propellant, or a jet engine uses fuel.

By definition, specific impulse is the total impulse (or change in momentum) delivered per unit of propellant consumed and is dimensionally equivalent to the generated thrust divided by the propellant mass flow rate or weight flow rate. If mass (kilogram, pound-mass, or slug) is used as the unit of propellant, then specific impulse has units of velocity. If weight (Newton or pound-force) is used instead, then specific impulse has units of time (seconds).

Multiplying flow rate by the standard gravity ($$ \mathrm{g_{0}} $$) converts specific impulse from the mass basis to the weight basis. We can calculate the specific impulse of a rocket engine given the exhaust velocity and the acceleration of gravity at Earth.

$$ \mathrm{I_{sp}=\frac{V_{e}}{g_{0}}} $$

Chemical rockets have a specific impulse of about 200 - 450 seconds.

# Effect of exhaust velocity on achieving Earth orbit

To get into Low Earth Orbit (LEO): $$ \mathrm{\Delta V} $$  is about 9000 m/s (includes drag and gravity losses; ignores effect of Earth’s rotation).

Using a solid rocket motor, $$ \mathrm{V}_{\mathrm{e}} $$ is about 2000 m/s; $$ \mathrm{\frac{\Delta V}{V_{e}} \approx 4.5} $$. Thus, the rocket's inert fraction will be:

$$ \mathrm{\frac{m_{f}}{m_{i}}=e^{-4.5}=0.011} $$

The rocket's propellant fraction will be:

$$ \mathrm{\frac{m_{prop}}{m_{i}}=1-e^{-4.5}=0.99} $$

Now, if we were to use a high-performance liquid rocket engine with an exhaust velocity ($$ \mathrm{V}_{\mathrm{e}} $$) of about 4000 m/s; $$ \mathrm{\frac{\Delta V}{V_{e}} \approx 2.25} $$. How does this affect the amount propellant and payload we can carry?

The rocket's inert fraction will be:

$$ \mathrm{\frac{m_{f}}{m_{i}}=e^{-2.25}=0.105} $$

The rocket's propellant fraction will be:

$$ \mathrm{\frac{m_{prop}}{m_{i}}=1-e^{-2.25}=0.89} $$

Therefore, the higher the exhaust velocity, the lower the propellant fraction and higher the inert fraction. With a higher inert fraction, we are able to carry a heavier payload into orbit and keep the rocket structurally sound. This is why companies like SpaceX are constantly improving the performance of their rocket engines in order to carry heavier payloads to Low-Earth Orbit, the Moon and eventually to Mars.

{% assign imgs = "../../assets/images/raptor.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="SpaceX’s subscale Raptor engine has completed more than 1200 seconds of testing in less than two years." %}<br class="img">

In conclusion, the ideal rocket equation puts a limit on how much of the fraction of the mass of the rocket can be devoted to the actual structure and payload. In other words, we want to make rockets as light as possible. Splitting a rocket into sections known as stages and discarding them once the propellant has been expended is the best way to overcome the limitations put forth by the ideal rocket equation.
