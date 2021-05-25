---
layout: post
title: "Humanitarian Assistance and Disaster Relief"
description: "Technology can save lives"
date: 2020-08-02 10:27:55 +0800
categories: technology
---

Last year, my friends and I competed in the annual SSTA-HADR Challenge, which was organized by the Singapore Space and Technology Association in partnership with Airbus Defence and Space and supported by the S. Rajaratnam School of International Studies (RSIS), Singapore Armed Forces and the Singapore Civil Defence Force. My team and I conceived, designed, and built a Long-Range Node Extended Automatic Packet Reporting Mesh System (LRNE-APRMS) to help disaster relief workers communicate with Command & Control (C2) HQ via High-Altitude Pseudo-Satellites (HAPS). We managed to win  2nd place and were given a spot in the Global Space and Technology Convention (GSTC) to pitch our winning solution to industry members and government officials. I'd like to tell you more about this project in this blog post.

# Summary

In the immediate aftermath of a flood disaster, survivors communicate from their mobile phones with friends, family, and emergency services. As a result, telephone networks become congested, making it difficult for people to contact each other. Depending on the severity of the disaster, a majority of the infrastructure that supports mobile communication could also be destroyed, rendering mobile communications ineffective. Our project aimed to create a long-range radio handset that can be used by all survivors as well as relief workers regardless of technical literacy and language. This is to allow for clear communication, easy use, and fast actions that are required in a disaster scenario where every second count.

{% assign imgs = "../../assets/images/hoco.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="HOPE & COMPASS" %}<br class="img">

Our solution consisted of a handset (HOPE) that is to be used by survivors/relief workers and a dashboard (COMPASS) that is to be used by HADR teams and Command and Control (C2) operators. In a disaster scenario, HOPE is first packaged into a shock and water-resistant container, attached to Airbus' HAPS, the Zephyr, before being jettisoned above the disaster site, where survivors and rescue workers can pick up the handset and start communicating with the C2 HQ.

# HOPE

HOPE is meant to be used across the globe during flood disasters. As such, both the rescuers and the survivors may speak different languages, which can cause language barriers resulting in miscommunication. Hence, to overcome this issue, HOPE was made with language-agnostic icons to represent resources that are requestable, with strategic button placement to make the whole device human-intuitive, enabling mass deployment without bundled instruction manuals for the survivors to use.

HOPE includes a GPS module that is coupled with the handset and activated upon deployment. This allows rescuers to track survivors and deliver their requests accordingly. Having tracking beacons also allow C2 operators to find a suitable spot to set up base camps close to the survivors, giving them fast access to the disaster zone for immediate action, should that be required.

{% assign imgs = "../../assets/images/hopeone.jpg" | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The innards of the HOPE handset. Designed and built by my friends Bryan and James." %}<br class="img">

HOPE realizes LoRa with LoPy, which allowed us to implement an Automatic Packet Reporting System with the help of the LoRa mesh, which is implemented under the OpenThread specification, allowing up to 32 routers and 512 devices per router for a maximum of 16,384 devices in total. With issue 258 in the OpenThread GitHub repository which discusses the possibility for unlimited hops, this puts the HOPE’s LoRa mesh network at a maximum communication range of 654,120 kilometers in total. Without the issue, the maximum range would be about 20,000 kilometers, which is a magnitude less, but still manages to cover the length of continental Africa, when HOPE devices are lined up in a straight line. The prototype was tested to successfully communicate over a distance of 1.5 kilometers over a densely populated area, specifically between Chinese Garden and Lakeside MRT stations in Singapore.

# COMPASS

Once HOPE is deployed, survivors and relief workers can request ration, shelter, and medical aid through the device. My team and I wanted to present this information together with near-real-time, high-resolution satellite imagery from satellites such as SPOT-6 in the form of a centralized dashboard. I helped my team design and develop this dashboard, which is tightly integrated with a radio terminal that is connected to the operator's computer. This terminal is a lighter version of HOPE's hardware and firmware and allows the operator's computer to be part of the mesh network. 

{% assign imgs = "../../assets/images/compassone.png" | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The Mission Overview section" %}<br class="img">

All requests are labeled as “Pending”, “In Process” or “Complete” by the C2 HQ team to indicate resource and manpower allocations required for each task. This ensures no double deliveries or unnecessary worker allocations are made, ensuring quick and efficient delegation and preventing wastage of manpower and material.

{% assign imgs = "../../assets/images/compassfour.png" | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="A high level Logistics Overview of the HADR operation" %}<br class="img">

Local terrain may change drastically after disasters, however, workers and civilians may be more comfortable giving directions with reference to previously standing buildings or landmarks that are now indistinguishable. The dashboard marks the location of each radio handset on a familiar “Google Maps”-esque simple digitised map and color codes the markers with respect to the requested resource for easy discernment of a user’s location and resource allocation. The dashboard also allows the operators to view ‘Before’ and ‘After’ versions of satellite imagery and indicates changed regions under separate map options. COMPASS computes the changes in the pre & post-event satellite imagery with OpenCV, a computer visions API to facilitate: (i) the deployment of HOPE handsets, (ii) setting up base camps, (iii) locating and quantifying survivors within disaster-hit areas.

{% assign imgs = "../../assets/images/compasstwo.png" | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Pre & Post Event satellite imagery analysis. Satellite images taken by SPOT-6 © Airbus." %}<br class="img">

The C2 Broadcast Information System allows the C2 centre to quickly and efficiently broadcast updates to relief workers and civilians, such as hazardous weather warnings and updates on new telemedicine drone fleet arrivals.

{% assign imgs = "../../assets/images/compassthree.png" | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="A minimalistic information broadcast system" %}<br class="img">

High Altitude Pseudo-Satellites and Earth Observation/Communication Satellites plays a critical part in the project infrastructure by providing both line-of-sight and beyond-line-of-sight communication, high-resolution optical imagery for mapping purposes under all weather conditions, and additional key data metrics from space or airborne sensors. Such data metrics can be used to update the map or warn survivors and relief workers of incoming changes of the weather through the C2 broadcast information system.

# Existing Solution

The most prominent alternative to HOPE and COMPASS would be voice-based communication, with an example being walkie-talkies.

Our system can perform peer-to-peer long-range radio communications of up to a theoretical maximum of forty kilometers, as opposed to the maximum range of up to thirty kilometers a pair of walkie-talkies achieve in the same price range (approximately US $50). Long range voice communications also have other issues such as signal noise, voice swarms, language barriers, hardware-specific requirements for extending voice communication range, and the inefficiencies in acquiring required logistics over audio. These weaknesses are described in more detail below.

Suppose a walkie-talkie to be a two-way communication device, how would a C2 center operator handle help requests from so many survivors at once? With a large influx of voices from the survivors, this generates “voice swarms”, where many survivors are talking over one another, trying to get their most urgent needs across, to the operators. Furthermore, with signal noise in play, it might be impossible for a C2 center operator to perceive any intelligible audio.

Language plays a big part in ensuring the smooth delivery of help from the C2 center to the disaster zone because it is used as the medium of communication between any two parties involved in disaster recovery. However, if there is not a common language between two said parties, then time must be spent to reach an understanding of each other’s intentions based upon body language, or through an interpreter capable of both languages. As voice communications require language as the medium of communication, it becomes an unsuitable option to overcome the problem of language barriers.

To extend the voice communication range, repeaters have to be used. Repeaters are function exclusive; they can act solely as network extenders, and cannot be used as walkie-talkies, increasing the costs per walkie-talkie connected to the network in a wide-area setup during disasters.

Lastly, voice communications require operators to manually track the logistics requested; this takes time and is an inefficient use of manpower.

HOPE and COMPASS solve the above problems, by using data-based communications instead of voice-based communications. HOPE uses language-agnostic icons to make the whole device more intuitive to use, eliminating the problem of language barriers. COMPASS then collates all of these data into a singular, easy to refer interface, with all the logistics perfectly tracked thanks to HOPE’s connectivity to COMPASS via LRNE-APRMS.
