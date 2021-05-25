---
layout: post
title: "Escape Velocity"
description: "Escaping earth's gravity"
date: 2019-07-23 10:27:55 +0800
categories: Space Exploration
---

Escape velocity is the minimum speed needed for a free object to escape from the gravitational influence of a massive body like the Earth or the Moon. It is slower the farther away from the body an object is, and slower for less massive bodies. The escape velocity from Earth is about 11.186 km/s at the surface which is about $$ \sqrt{2} $$ times the orbital velocity at Low Earth Orbit. This is an interesting relationship which we'll derive on our own soon.

Escape velocity is the speed at which the sum of an object's kinetic energy and its gravitational potential energy is equal to zero; an object which has achieved escape velocity is neither on the surface nor in a closed orbit (of any radius). With escape velocity in a direction pointing away from the ground of a massive body, the object will move away from the body, slowing forever and approaching, but never reaching, zero speed. Once escape velocity is achieved, no further impulse need to be applied for it to continue in its escape. If given escape velocity, the object will move away from the other body, continually slowing, and will asymptotically approach zero speed as the object's distance approaches infinity, never to come back.

Note that the minimum escape velocity which we will derive assumes that there is no friction (e.g., atmospheric drag), which would increase the required instantaneous velocity to escape the gravitational influence, and that there will be no future acceleration or deceleration (for example from thrust or gravity from other objects), which would change the required instantaneous velocity.

# Calculation

By the law of conservation of energy, the total energy of a rocket (kinetic energy + potential energy) before launch must equal the total energy of the rocket after it has reached escape velocity.

$$ KE_{i} + PE_{i} = KE_{f} + PE_{f} $$

A planetary body’s gravitational field does not influence a rocket when it’s out at infinity. By the time a rocket reaches an infinite distance from the planetary body, all the kinetic energy would have gone to zero because we don’t want any residual velocity when we reach infinity and by definition, when a rocket is at infinity, the gravitational potential energy of a rocket would also be zero.

$$ KE_{i} + PE_{i} = 0 $$

Now, we can derive the escape velocity:

$$ KE_{i} + PE_{i} = 0 $$

$$ \frac{1}{2} m {v_{e}}^{2}-\frac{G M m}{r}=0 $$

$$ \frac{1}{2} {v_{e}}^{2}=\frac{G M}{r} $$

$$ {v_{e}}^{2}=2 \frac{G M}{r} $$

$$ v_{e}=\sqrt{\frac{2GM}{r}} $$

The orbital velocity $$ v_{c} $$ at a distance $$ r $$ from a massive body is:

$$ v_{c}=\sqrt{\frac{GM}{r}} $$

$$ v_{e} $$ in terms of orbital velocity is:

$$ v_{e}=\sqrt{2} \cdot \sqrt{\frac{GM}{r}} = \sqrt{2} \ v_c $$