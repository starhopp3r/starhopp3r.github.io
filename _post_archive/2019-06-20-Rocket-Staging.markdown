---
layout: post
title: "Rocket Staging"
description: "Drop 'em if you don't need 'em"
date: 2019-06-20 9:00:55 +0800
categories: Space Exploration
---

In my previous article, we concluded that the ideal rocket equation puts a limit on the fraction of the mass of the rocket we can devote to the structure of the vehicle and the payload. In other words, we want to make rockets as light as possible. An extreme example of an attempt to make a rocket as light as possible would be the SM-65 Atlas rocket. The Atlas boosters would collapse under their own weight if not kept pressurized with nitrogen gas in the tanks when devoid of propellants. The Atlas booster was unusual in its use of "balloon" tanks. The rockets were made from very thin stainless steel that offered minimal or no rigid support. It was pressure in the tanks that gave the rigidity required for space flight. In order to save weight they were not painted and needed a specially designed oil to prevent rust, this was the original use of WD-40 penetrating oil.

{% assign imgs = "../../assets/images/atlas.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The Big Joe 1, ATLAS 10D rocket launched from Pad-LC-14 on September 9, 1959." %}<br class="img">

In order to increase our payload capacity while keeping our rocket structurally sound, we want to have as high an exhaust velocity as possible, which means we want the temperatures and pressures in our combustion chamber to be as high as possible. We don't have metals which will tolerate long exposures to rocket exhaust, so we need to prevent the rocket nozzle from melting.

In a typical modern rocket engine, particularly when we have a cryogenic fuel like liquid hydrogen, which is very cold before it goes into the combustion chamber, we run it through a series of pipes which go up and down outside of the nozzle, and this serves two purposes. First of all, it absorbs a lot of the heat, so it keeps the nozzle cool enough so that it doesn't melt, and it preheats the hydrogen, which gives it that much more energy when it gets into the combustion chamber. 

The Rocketdyne F-1 engine used by the Saturn V rocket, fed cool exhaust gas which powered the engine's turbine into a heat exchanger, and then to a wrap-around exhaust manifold which feeds it into the periphery of the engine bell to cool and protect the nozzle extension from the far hotter exhaust of the main engine itself.

# Multistage Rockets

A multistage rocket is a launch vehicle that uses two or more rocket stages, each of which contains its own engines and propellant. A **serial stage** is mounted on top of another stage; a **parallel stage** is attached alongside another stage. The result is effectively two or more rockets stacked on top of or attached next to each other. Two-stage rockets are quite common, but rockets with as many as five separate stages have been successfully launched.

The diagram below shows a two-stage rocket. We have just one payload at the top which we're trying to get to orbit but we have two separate rocket stages. We have the first stage and the second stage. Now, when we fire the motors of the first stage and it's sitting on the launchpad, we have to get a little bit more complicated in our equation because we're going to keep track of the two stages separately. So the initial mass at stage one ignition is the structure of the first stage, the propellant in the first stage, the structure in the second stage, the propellant in the second stage, and the payload.

After the first stage burns out, we have everything we started with except no more propellant in the first stage. We still have the propellant in the second stage because we had to carry that along with us. Now, when we stage the rocket, we drop the first stage, so we get rid of the structural mass. We're now lighter when the second stage fires. When we finish the second stage burn, we have burned the propellant in the second stage, and we're just left with the structure in the second stage and the payload.

Now, let's derive the ideal rocket equation for a two-stage rocket:

$$ \mathrm{m_{i1} \ = \ m_{struct1} \ + \ m_{prop1} \ + \ m_{struct2} \ + \ m_{prop2} \ + \ m_{PL}} $$

$$ \mathrm{m_{f1} \ = \ m_{struct1} \ + \ m_{struct2} \ + \ m_{prop2} \ + \ m_{PL}} $$

$$ \mathrm{m_{i2} \ = \ m_{struct2} \ + \ m_{prop2} \ + \ m_{PL}} $$

$$ \mathrm{m_{f2} \ = \ m_{struct2} \ + \ m_{PL}} $$

Relationship between staging and $$ \mathrm{\Delta V} $$; $$ \mathrm{\Delta V_{1}} $$ is stage 1's $$ \mathrm{\Delta V} $$ and $$ \mathrm{\Delta V_{2}} $$ is stage 2's $$ \mathrm{\Delta V} $$:

$$ \mathrm{\Delta V_{1}=V_{e} \ln \frac{m_{i1}}{m_{f1}}} $$

$$ \mathrm{\Delta V_{2}=V_{e} \ln \frac{m_{i2}}{m_{f2}}} $$

**Assuming $$ \mathrm{V_{e}} $$ is the same for engines in both stages, which is not the case in real life.*

$$ \mathrm{\Delta V_{tot}=V_{e}\left[\ln \frac{m_{i1}}{m_{f1}}+\ln \frac{m_{i2}}{m_{f2}}\right]} $$

$$ \mathrm{\therefore \Delta V_{tot}=V_{e}\ln \frac{m_{i1} m_{i2}}{m_{f1} m_{f2}}} $$

Without staging, $$ \mathrm{m_{i2} = m_{f2}} $$, and $$ \mathrm{\Delta V_{tot}=V_{e}\ln \frac{m_{i}}{m_{f}}} $$ as expected. 

The $$ \mathrm{\Delta V} $$ required to reach low Earth orbit (or the required velocity of a sufficiently heavy suborbital payload) requires a wet to dry mass ratio larger than can realistically be achieved in a single rocket stage. The multistage rocket overcomes this limit by splitting the $$ \mathrm{\Delta V} $$ into fractions. As each lower stage drops off and the succeeding stage fires, the rest of the rocket is still traveling near the burnout speed. Each lower stage's dry mass includes the propellant in the upper stages, and each succeeding upper stage has reduced its dry mass by discarding the useless dry mass of the spent lower stages.

A further advantage is that each stage can use a different type of rocket engine, each tuned for its particular operating conditions. Thus the lower-stage engines are designed for use at atmospheric pressure, while the upper stages can use engines suited to near vacuum conditions. Lower stages tend to require more structure than upper as they need to bear their own weight plus that of the stages above them. Optimizing the structure of each stage decreases the weight of the total vehicle and provides further advantage.

# Single stage to orbit

Single Stage To Orbit or SSTO is often considered the holy grail of rocketry. An SSTO vehicle reaches orbit from the surface of a body without jettisoning hardware, expending only propellants and fluids. No Earth-launched SSTO launch vehicles have ever been constructed. To date, orbital launches have been performed by multi-stage rockets, either fully or partially expendable, the Space Shuttle having both attributes. Reusable SSTO vehicles offer the promise of reduced launch expenses by eliminating recurring costs associated with hardware replacement inherent in expendable launch systems. However, the nonrecurring costs associated with design, development, research and engineering of reusable SSTO systems are much higher than expendable systems due to the substantial technical challenges of SSTO.

It is considered to be marginally possible to launch a single-stage-to-orbit chemically-fueled spacecraft from Earth. The principal complicating factors for SSTO from Earth are: high orbital velocity of over 7,400 metres per second (27,000 km/h; 17,000 mph); the need to overcome Earth's gravity, especially in the early stages of flight; and flight within Earth's atmosphere, which limits speed in the early stages of flight and influences engine performance.

Notable single stage to orbit research spacecraft include Skylon, the DC-X, the Lockheed Martin X-33, and the Roton SSTO. However, despite showing some promise, none of them has come close to achieving orbit yet due to problems with finding the most efficient propulsion system.

SSTO is much easier to achieve on extraterrestrial bodies which have weaker gravitational fields and lower atmospheric pressure than Earth, such as the Moon and Mars, and has been achieved from the Moon by both the Apollo program's Lunar Module and several robotic spacecraft of the Soviet Luna program.

{% assign imgs = "../../assets/images/skylon.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The Skylon vehicle is intended to be an aircraft designed to reach orbit." %}<br class="img">

SSTO is practically impossible even with our most advanced liquid rocket propulsion systems. So how does Skylon plan to achieve SSTO? Skylon is hydrogen-oxygen propelled. In this propellant system, the oxygen weighs 8 times as much as the hydrogen (with a chemically balanced mix). By breathing air for the first part of the ascent, it can gain significant velocity and height before it switches to liquid oxygen from the tank. This is how Skylon makes the single stage to orbit concept theoretically possible.
