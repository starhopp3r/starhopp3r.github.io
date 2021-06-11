---
layout: post
title: "The Vis-viva Equation"
description: "It's all about changing orbits"
date: 2019-07-21 10:27:55 +0800
categories: Space Exploration
---

In orbital mechanics, the Hohmann transfer orbit is an elliptical orbit used to transfer spacecraft between two circular orbits of different radii in the same plane. In general, a Hohmann transfer orbit uses the lowest possible amount of energy in traveling between two objects orbiting at these radii, and so is used to send the maximum amount of mission payload with the fixed amount of energy that can be imparted by a particular rocket. Non-Hohmann transfer paths may have other advantages for a particular mission such as shorter transfer times, but will necessarily require a reduction in payload mass and/or use of a more powerful rocket.

Space missions using a Hohmann transfer must wait for the starting and destination points be at particular locations in their orbits relative to each other before performing a Hohmann transfer, which opens a so-called launch window. For a space mission between Earth and Mars, these launch windows occur every 26 months. A Hohmann transfer orbit also determines a fixed time required to travel between the starting and destination points; for an Earth-Mars journey, this travel time is 9 months.

{% assign imgs = "../../assets/images/hohmann.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="A Hohmann transfer orbit to bring a spacecraft from a lower circular orbit into a higher one."%}<br class="img">

The diagram above shows a Hohmann transfer orbit to bring a spacecraft from a lower circular orbit into a higher one. It is one half of an elliptic orbit that touches both the lower circular orbit the spacecraft wishes to leave (blue and labeled 1 on diagram) and the higher circular orbit that it wishes to reach (green and labeled 3 on diagram). The transfer (yellow and labeled 2 on diagram) is initiated by firing the spacecraft's engine (posigrade burn) at the periapsis to accelerate it so that it will follow the elliptical orbit. This adds energy to the spacecraft's orbit. When the spacecraft has reached its destination orbit at the apoapsis, its orbital speed (and hence its orbital energy) must be increased again to change the elliptic orbit to the larger circular one.

Due to the reversibility of orbits, Hohmann transfer orbits also work to bring a spacecraft from a higher orbit into a lower one; in this case, the spacecraft's engine is fired in the opposite direction (retrograde burn) to its current path at the apoapsis, slowing the spacecraft and causing it to drop into the lower-energy elliptical transfer orbit. The engine is then fired again at the lower distance (retrograde burn at the periapsis) to slow the spacecraft into the lower circular orbit.

The Hohmann transfer orbit is based on two instantaneous velocity changes. Extra fuel is required to compensate for the fact that the bursts take time; this is minimized by using high-thrust engines to minimize the duration of the bursts. For transfers in Earth orbit, the two burns are called the perigee burn and the apogee burn (or "apogee kick"); more generally, they are called periapsis and apoapsis burns. Alternately, the second burn to circularize the orbit may be referred to as a circularization burn.

The vis-viva equation, also referred to as orbital-energy-invariance law, is one of the equations that model the motion of orbiting bodies. It is the direct result of the principle of conservation of mechanical energy which applies when the only force acting on an object is its weight.

Vis viva (Latin for "living force") is a historical term used for the first (known) description of what we now call kinetic energy in an early formulation of the principle of conservation of energy. The vis-viva equation can be used to compute the delta-v required for the Hohmann transfer, under the assumption of instantaneous impulses.

# Calculation

For a small body orbiting another much larger body, such as a satellite orbiting Earth, the total energy of the smaller body, $$ E_{Total} $$, is the sum of its kinetic energy, $$ E_{KE} $$, and potential energy, $$ E_{PE} $$.

$$ E_{Total}=E_{KE}+E_{PE} $$

$$ E_{KE}=\frac{1}{2} m v^{2} $$

$$ E_{PE}=-\frac{G M m}{r} $$

Where $$ M $$ is the mass of the larger body (e.g. Earth, Mars, etc.) and $$ m $$ is the mass of the spacecraft.

$$ E_{Total}=\frac{1}{2} m v^{2}-\frac{G M m}{r} $$

$$ \frac{E_{Total}}{m}=\frac{v^{2}}{2}-\frac{GM}{r} $$

Specific total energy is constant throughout the orbit. Specific energy is energy per unit mass.

$$ \varepsilon=\frac{E_{Total}}{m} $$

$$ \varepsilon=\frac{v^{2}}{2}-\frac{GM}{r} $$

$$ \varepsilon_{1}=\varepsilon_{2} $$

$$ \varepsilon_{1}=\varepsilon_{2} $$ because specific total energy at any one point in the orbit is always equal to any other point in the same orbit.

$$ \frac{v_{1}^{2}}{2}-\frac{GM}{r_{1}}=\frac{v_{2}^{2}}{2}-\frac{GM}{r_{2}} $$

$$ \frac{v_{1}^{2}}{2}-\frac{v_{2}^{2}}{2}=\frac{G M}{r_{1}}-\frac{G M}{r_{2}} $$

Using the standard gravitational parameter, $$ \mu=GM $$:

$$ \frac{v_{1}^{2}}{2}-\frac{v_{2}^{2}}{2}=\frac{\mu}{r_{1}}-\frac{\mu}{r_{2}} $$

$$ \frac{v_{1}^{2}}{2}-\frac{v_{2}^{2}}{2}=\mu\left(\frac{1}{r_{1}}-\frac{1}{r_{2}}\right) $$

Kepler's second law of planetary motion states that a line between the central body and the spacecraft sweeps equal areas in equal times. The speed of the spacecraft increases as it nears the central body and decreases as it recedes from it.

$$ \frac{1}{2} r_{1} v_{1} \Delta t=\frac{1}{2} r_{2} v_{2} \Delta t $$

$$ r_{1} v_{1}=r_{2} v_{2} $$

$$ v_{2}=\frac{r_{1} v_{1}}{r_{2}} $$

$$ \frac{v_{1}^{2}}{2}-\frac{r_{1}^{2} v_{1}^{2}}{2 r_{2}^{2}}=\mu\left(\frac{1}{r_{1}}-\frac{1}{r_{2}}\right) $$

$$ v_{1}^{2}\left(\frac{r_{2}^{2}-r_{1}^{2}}{2 r_{2}^{2}}\right)=\mu\left(\frac{r_{2}-r_{1}}{r_{1} r_{2}}\right) $$

$$ v_{1}^{2}=\mu\left(\frac{r_{2}-r_{1}}{r_{1} r_{2}}\right)\left(\frac{2 r_{2}^{2}}{r_{2}^{2}-r_{1}^{2}}\right) $$

$$ v_{1}^{2}=\mu\left(\frac{r_{2}-r_{1}}{r_{1} r_{2}}\right)\left(\frac{2 r_{2}^{2}}{\left(r_{2}-r_{1}\right)\left(r_{2}+r_{1}\right)}\right) $$

$$ v_{1}^2=\mu\left(\frac{1}{r_{1}}\right)\left(\frac{2 r_{2}}{r_{1}+r_{2}}\right) $$

$$ v_{1}^2=\frac{2 \mu r_{2}}{r_{1}\left(r_{1}+r_{2}\right)} $$

Therefore, the desired velocity for Hohmann transfer (expected final velocity after posigrade burn at the periapsis) is:

$$ v_{1}=\sqrt{\frac{2 \mu r_{2}}{r_{1}\left(r_{1}+r_{2}\right)}} $$

The $$ \mathrm{\Delta v} $$ required for Hohmann transfer is $$ \mathrm{\Delta v}=v_{1}-v_{c} $$, where $$ v_c $$ is the current circular orbital velocity.

$$ v_{c}=\sqrt{\frac{GM}{r}}=\sqrt{\frac{\mu}{r}} $$

The $$ \mathrm{\Delta v} $$ required for the first Hohmann transfer burn at the periapsis is:

$$ \mathrm{\Delta v}=\sqrt{\frac{\mu}{r_{1}}}\left(\sqrt{\frac{2 r_2}{r_{1}+r_{2}}}-1\right) $$

The $$ \mathrm{\Delta v} $$ required for the circularisation of the orbit is $$ \mathrm{\Delta v}=v_{c}-v_{2} $$, where $$ v_c $$ is the cicular orbital velocity at a distance $$ r_{2} $$ from the central body.

$$ \mathrm{\Delta v} = \sqrt{\frac{\mu}{r_{2}}}\left(1-\sqrt{\frac{2 r_{1}}{r_{1}+r_{2}}}\right) $$

# Simulation

Now, let's fire up Kerbal Space Program and put the vis-viva equation to the test. I used one of Kerbal Space Program's stock rockets: Kerbal X to simulate the Hohmann transfer. According to Kerbal Space Program, "The Kerbal X is one of the most successful rockets that can be ordered from a catalog. Despite the original design having been meant for a plastic model, it's proved itself quite dependable as a full-sized craft. The X is capable of achieving orbit around Kerbin and even features a very optimistic set of landing legs on its upper stage."

{% assign imgs = "../../assets/images/kerbalx.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Kerbal X blueprint." %}<br class="img">


Kerbal Space Program's wiki says: "The first stage's central engine and relative fuel tank has 2973 m/s of Δv, not mentioning the radial ring of boosters which has 1063 m/s. This sums up to about 4036 m/s, enough to make orbit (3500 m/s) with some to spare, making the Kerbal X launch vehicle a suitable option for orbiting small-to-medium payloads. The maximum payload to Kerbin low orbit of the unmodified Kerbal X launch vehicle is slightly less than 24 tons.

The second stage has 2392 m/s Δv, and the total Δv is 6428 m/s. This total impulse is sufficient for landing on the Mun with the piloting skill of the average player, but not for returning to Kerbin afterwards. This is probably intentional: the purpose of the Kerbal X is to present a new player with a flyable and somewhat capable rocket design, that nevertheless needs some improvement in order to be fully successful. However, skilled players have demonstrated that the design as-is will conduct a round-trip Mun-landing mission. The Kerbal X is also capable of going into interplanetary orbit, able to land on Eve or Duna (or their moons, in which case landing and returning is also possible with careful planning) or fly by any other body."

Before we perform the Hohmann transfer, we put Kerbal X in orbit around Kerbin with an apoapsis of 1,250,505 m and a periapsis of  1,229,999 m. We want our spacecraft to transfer to the Mun's orbit which is about 11,400,000 m above Kerbin's surface. 

{% assign imgs = "../../assets/images/kspone.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Hohmann transfer in Kerbal Space Program." %}<br class="img">

Now, let's calculate the $$ \mathrm{\Delta v} $$ required to transfer to Mun's orbit, which is about 11,400,000 m from Kerbin's surface. The standard gravitation parameter, $$ \mu $$, of Kerbin is about $$ 3.53 \times 10^{12} \ \mathrm{m}^{3} /\mathrm{s}^{2} $$ and the distance between the spacecraft and Kerbin's center (Kerbin's equatorial radius is 600,000 m) at the periapsis is about $$ 1.83 \times 10^{6} \ \mathrm{m} $$. This will be our $$ r_1 $$ distance. The distance between Mun's center and Kerbin's center is $$ 12 \times 10^{6} \ \mathrm{m} $$. This will be our $$ r_2 $$ distance. Plugging the values into the vis-viva equation:

$$ \mathrm{\Delta v}=\sqrt{\frac{\mu}{r_{1}}}\left(\sqrt{\frac{2 r_2}{r_{1}+r_{2}}}-1\right) $$

we get a $$ \mathrm{\Delta v} = 441 \ \mathrm{m} /\mathrm{s} $$ for the first Hohmann transfer burn at the periapsis, which is pretty close to the value Kerbal Space Program computed for us:  $$ \mathrm{\Delta v} = 437.5 \ \mathrm{m} /\mathrm{s} $$. Once the transfer is complete, we need to perform a circularisation burn at the apoapsis of the elliptical transfer orbit. Our spacecraft is about $$ 11.45 \times 10^{6} \ \mathrm{m} $$ from Kerbin's surface and our $$ r_1 $$ and $$ r_2 $$ distances remain the same for the circularisation burn. Plugging the values into the vis-viva equation:

$$ \mathrm{\Delta v} = \sqrt{\frac{\mu}{r_{2}}}\left(1-\sqrt{\frac{2 r_{1}}{r_{1}+r_{2}}}\right) $$

we get a $$ \mathrm{\Delta v} = 263 \ \mathrm{m} /\mathrm{s} $$ for the circularisation burn at the apoapsis of the transfer orbit, which is very close to the value Kerbal Space Program computed for us:  $$ \mathrm{\Delta v} = 262.3 \ \mathrm{m} /\mathrm{s} $$. The vis-viva equation works! 