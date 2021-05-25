---
layout: post
title:  "Hacking a Live Streaming App"
description: "It's really simple"
date:   2019-07-30 10:27:55 +0800
categories: Fun
---

The ICC Cricket World Cup ended a few weeks ago, and approximately 2.6 billion people around the world watched the tournament, making it the most-watched cricket competition ever as of 2019. With the advent of on-demand mobile media applications such as Netflix and YouTube, people like me are increasingly drawn away from traditional television sets with cable/fiber connections and depend on native/web apps for media content.

Cricket is a "seasonal" sport. Top-class cricket is almost always played outdoors, on uncovered pitches, and rain prevents play. The seasons in each country are geared to coincide with the driest months of the year. The hours of daylight and the temperature are also factors in some countries. For example, in England, the winter days are too short and often too dark, and the temperature is too low for playing cricket to be practical. Normally, cricket is played outdoors but in the UK, cricket is played indoors when the season is finished. When designating cricket seasons, the convention is to use a single year for a northern hemisphere summer season, and a dashed pair of years to indicate a southern hemisphere summer.  In the tropics, cricket can be played all year round. In the United Kingdom, the cricket season starts mid-April and ends in September, whereas in Australia, the cricket season begins in October and ends in February or March.

Most people only follow a few cricket teams and having a cable/fiber TV connection to a sports channel is not economical if you want to make the most out of your TV subscription watching a seasonal sport like cricket. A majority of cricket fans have moved on to live streaming mobile/web apps that are mostly free or monetized with ads or a small subscription fee. 

After digging through the Google Play Store, I found a reliable Android application with good reviews to live stream the ICC Cricket World Cup tournament. I downloaded the app onto my Samsung tablet and started watching the tournament. Watching a tournament that was going to last for hours on a tablet will be painful to my hands and my eyes. I wanted to watch the match live on TV, and here's how I did it.

# Setting Up

I used an online APK downloader to download the app's APK file from the Google Play Store. I won't be recommending any particular online APK downloader because it's a matter of personal preference and it's relatively easy to find good ones online. After I've downloaded the APK file, I fired up Android Studio, opened the AVD manager [go to `Tools > AVD Manager`] and launched a Pixel 2 XL (Android 7.1.1) AVD in the emulator. I installed the app on the AVD by dragging and dropping the APK file onto the emulator.

{% assign imgs = "../../assets/images/hack1.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The Pixel 2 XL Android Virtual Device (AVD) in the emulator." %}<br class="img">

I launched the app by locating and clicking the app on the AVD's app menu. As with all ad-monetized apps, I was bombarded with ads as soon as I launched the app; the app's media player screen was also filled with banner ads. Now, I needed to figure out the URL from which the media player was streaming the live broadcast. I quit my browser, turned off my VPN, and opened Wireshark to sniff some packets.

# Packet Analysis

Wireshark is a network analysis tool that captures packets in real-time and displays them in a human-readable format. You can download Wireshark for your operating system from [Wireshark's official website](https://www.wireshark.org/#download). I'm using my `WiFi: en0` interface to connect to the internet, and this is the interface the emulator uses to stream the live broadcast.

{% assign imgs = "../../assets/images/hack2.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="I want to capture packets from the WiFi: en0 interface on my Mac." %}<br class="img">

I clicked the blue colored shark fin located on the upper left-hand corner of the menu to start capturing packets from the `WiFi: en0` interface (I made sure I closed my browser, turned off my VPN and quit any running application before I started capturing packets). I captured packets from the `WiFi: en0` interface for about 30 seconds, this allowed Wireshark to do a more accurate analysis of the packets being sent and received by the interface.

{% assign imgs = "../../assets/images/hack3.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The app performs two different GET requests that we're interested in." %}<br class="img">

The app seems to perform a GET request to get two different files with two different file extensions: `.ts` and `.m3u8`. The MPEG transport stream (file extensions: `.ts`, `.ts`, `.tsv`, `.tsa`) is a standard digital container format for transmission and storage of audio, video, and Program and System Information Protocol (PSIP) data. It is used in broadcast systems such as DVB, ATSC, and IPTV. The app I'm using uses Internet Protocol Television (IPTV) to deliver television content over Internet Protocol (IP) networks. This is in contrast to delivery through traditional terrestrial, satellite, and cable television formats. Unlike downloaded media, IPTV offers the ability to stream the source media continuously. As a result, a client media player can begin playing the content (such as a TV channel) almost immediately. This is known as streaming media.

M3U (MP3 URL or Moving Picture Experts Group Audio Layer 3 Uniform Resource Locator in full; file extensions: `.m3u`, `.m3u8`) is a computer file format for a multimedia playlist. One common use of the M3U file format is creating a single-entry playlist file pointing to a stream on the Internet. The created file provides easy access to that stream and is often used in downloads from a website, for emailing, and for listening to Internet radio.

Although originally designed for audio files, such as MP3, it is commonly used to point media players to audio and video sources, including online sources. M3U was originally developed by Fraunhofer for use with their Winplay3 software, but numerous media players and software applications.

The Unicode version of M3U is M3U8, which uses UTF-8-encoded characters. M3U8 files are the basis for the HTTP Live Streaming (HLS) format originally developed by Apple to stream video and radio to iOS devices, and which is now a popular format for Dynamic Adaptive Streaming over HTTP (DASH) in general.

The app `GET`s a `.m3u8` file, the Unicode version of M3U commonly used to point media players to audio and video sources, including online sources to live stream the broadcast. The app then `GET`s a `.ts` file, a standard digital container format encapsulating packetized elementary streams, with error correction and synchronization pattern features for maintaining transmission integrity when the communication channel carrying the stream is degraded.

We need to find out the URL from which the `.m3u8` file is retrieved to `GET` the `.m3u8` via the browser. Thankfully, Wireshark has already captured and analysed the packet for us and we can retrieve the URL easily.

{% assign imgs = "../../assets/images/hack4.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The full request URL from which we can stream the live broadcast." %}<br class="img">

The full request URL from which the `.m3u8` file is retrieved can be found under the Hypertext Transfer Protocol section. I copy-pasted the URL into Safari's search box, and I could immediately view the live broadcast. To AirPlay the live stream to my TV, I clicked on the AirPlay button found in Safari's default video player. I could now watch the match live on my TV!

{% assign imgs = "../../assets/images/hack5.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Streaming the live broadcast via Safari." %}<br class="img">

I wanted to find out more about the app's backend provider because it's almost impossible for an indie developer to build and operate his own server infrastructure to support potentially hundreds of thousands of live stream views simultaneously. I performed a `whois` look up on the server's IP address and here's what I found.

{% highlight text %}
[TRUNCATED]
inetnum:        109.169.0.0 - 109.169.95.255
netname:        UK-RAPIDSWITCH-20091102
country:        GB
org:            ORG-RL20-RIPE
admin-c:        AR6363-RIPE
tech-c:         AR6363-RIPE
status:         ALLOCATED PA
mnt-by:         RIPE-NCC-HM-MNT
mnt-by:         RAPIDSWITCH-MNT
mnt-routes:     RAPIDSWITCH-MNT
created:        2010-02-11T09:11:40Z
last-modified:  2017-03-24T16:04:24Z
source:         RIPE # Filtered

organisation:   ORG-RL20-RIPE
org-name:       IOMART HOSTING LIMITED
org-type:       LIR
address:        Spectrum House, Clivemont Road
address:        SL6 7FW
address:        Maidenhead
address:        UNITED KINGDOM
phone:          +441753471040
fax-no:         +441753471049
admin-c:        RC6613-RIPE
admin-c:        DB16530-RIPE
admin-c:        RM1358-RIPE
admin-c:        SMC74-RIPE
admin-c:        AR6363-RIPE
mnt-ref:        RAPIDSWITCH-MNT
mnt-ref:        RIPE-NCC-HM-MNT
mnt-by:         RIPE-NCC-HM-MNT
mnt-by:         RAPIDSWITCH-MNT
abuse-c:        AR12896-RIPE
created:        2005-09-26T12:37:33Z
last-modified:  2018-12-11T14:48:04Z
source:         RIPE # Filtered

person:         Abuse Robot
address:        iomart Hosting Ltd t/a RapidSwitch
address:        Spectrum House
address:        Clivemont Road
address:        Maidenhead
address:        SL6 7FW
phone:          +44 (0)1753 471 040
remarks:        ******************************************************
remarks:        * ABUSE REPORTS                                      *
remarks:        * https://myservers.rapidswitch.com/reportabuse.aspx *
remarks:        ******************************************************
nic-hdl:        AR6363-RIPE
mnt-by:         RAPIDSWITCH-MNT
created:        2007-02-11T09:38:19Z
last-modified:  2017-10-30T21:53:52Z
source:         RIPE # Filtered
[TRUNCATED]
{% endhighlight text %}

The server that's broadcasting the live stream is owned by iomart Hosting Limited trading as RapidSwitch. Their data center is located in Spectrum House, Maidenhead SL6 7FW, UK as confirmed by Google Maps.

iomart is a Scottish information technology and cloud computing company specializing in cloud storage, remote backup services, web filtering, business email, and server infrastructure. iomart operates several different brands including Melbourne Server Hosting which serves the SME market, Backup Technology, which provides cloud backup, disaster recovery, and business continuity, as well as Easyspace, RapidSwitch, and Redstation.

{% assign imgs = "../../assets/images/hack6.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="RapidSwitch's data center located in Spectrum House, United Kingdom." %}<br class="img">

RapidSwitch Ltd. is a server hosting company providing servers, managed servers solutions, collocation services, and virtual servers in the United Kingdom. It also provides IP transit and other connectivity services. The company offers server management, including server updates, backup, and restore managed services; and full racks services. It serves service providers, voice over IP businesses, and financial transaction processors.

We can also find out more about the frameworks/technologies the app is using to stream the live broadcast by dissembling the app's APK file. I'll stop here for now because I'm going to continue watching the live stream, brb.    
