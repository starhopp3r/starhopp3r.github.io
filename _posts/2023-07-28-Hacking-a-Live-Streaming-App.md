---
title: Hacking a Live Streaming App
---

> This blog post, originally written in 2019, was migrated from my old blog site.

The ICC Cricket World Cup concluded a few weeks ago, and it was watched by approximately 2.6 billion people worldwide. This staggering viewership makes it the most-watched cricket competition as of 2019. The advent of on-demand mobile media applications such as Netflix and YouTube is increasingly attracting people like me away from traditional television sets with cable or fiber connections, shifting the dependence onto native or web apps for media content.

Cricket is typically a "seasonal" sport. High-level cricket is almost always played outdoors, on uncovered pitches, and play is halted by rain. The seasons in each country are arranged to coincide with the driest months of the year. Factors such as hours of daylight and temperature also influence the scheduling in some countries. For example, in England, the winter days are too short and often too dark, and the temperature too low for cricket to be a viable option. Thus, cricket is typically played outdoors, but in the UK, the sport is played indoors once the season concludes. When referring to cricket seasons, the convention is to use a single year for a northern hemisphere summer season and a dashed pair of years to indicate a southern hemisphere summer. In tropical regions, cricket can be played throughout the year. In the United Kingdom, the cricket season begins in mid-April and ends in September, whereas in Australia, the season kicks off in October and concludes in February or March.

Most people only follow a handful of cricket teams. Consequently, having a cable or fiber TV connection solely for a sports channel might not be cost-effective, particularly for those wishing to maximize their TV subscription by watching a seasonal sport like cricket. As a result, a significant number of cricket fans have migrated to live streaming platforms on mobile or web apps, most of which are either free, ad-supported, or require a small subscription fee. 

After exploring the Google Play Store, I found a reputable Android application with positive reviews to live stream the ICC Cricket World Cup tournament. I downloaded the app onto my Samsung tablet and began watching the tournament. However, watching a game that lasts for hours on a tablet can be strenuous on both my hands and eyes. Therefore, I decided to watch the match live on TV, and here's how I achieved it.

## Setting Up

I utilized an online APK downloader to retrieve the app's APK file from the Google Play Store. I am not going to recommend any specific online APK downloader because that boils down to personal preference, and it's fairly easy to find reputable ones online. After downloading the APK file, I launched Android Studio, opened the AVD manager by navigating to `Tools > AVD Manager`, and started a Pixel 2 XL (Android 7.1.1) AVD in the emulator. I installed the app on the AVD by dragging and dropping the APK file onto the emulator screen.

![img](/assets/img/hack1.png)
_The Pixel 2 XL Android Virtual Device (AVD) in the emulator_

I launched the app by locating and clicking on it in the AVD's app menu. As is common with ad-monetized apps, I was immediately bombarded with advertisements upon launching the app; the app's media player screen was also cluttered with banner ads. I needed to determine the URL from which the media player was streaming the live broadcast. I closed my browser, deactivated my VPN, and launched Wireshark to monitor some packets.

## Packet Analysis

Wireshark is a network analysis tool that captures packets in real time and presents them in a format that is easy to understand. You can download Wireshark for your operating system from the [official Wireshark website](https://www.wireshark.org/#download). I connect to the Internet using my `WiFi: en0` interface, which is also the interface the emulator uses to stream the live broadcast.

![img](/assets/img/hack2.png)
_I aim to capture packets from the WiFi: en0 interface on my Mac_

To start capturing packets from the `WiFi: en0` interface, I clicked the blue-colored shark fin located in the upper left-hand corner of the menu (prior to capturing packets, I ensured that my browser was closed, my VPN was turned off, and any running application was quit). I captured packets from the `WiFi: en0` interface for about 30 seconds, allowing Wireshark to analyze the packets being sent and received by the interface more accurately.

![img](/assets/img/hack3.png)
_The app performs two different GET requests that is of interest to us_

The app appears to perform a GET request to retrieve two distinct files with different extensions: `.ts` and `.m3u8`. The MPEG transport stream (with file extensions such as `.ts`, `.tsv`, `.tsa`) is a standard digital container format used for transmitting and storing audio, video, and Program and System Information Protocol (PSIP) data. It is employed in broadcasting systems such as DVB, ATSC, and IPTV. The app I'm using leverages Internet Protocol Television (IPTV) to transmit television content over Internet Protocol (IP) networks. This differs from traditional terrestrial, satellite, and cable television formats. Unlike downloaded media, IPTV allows for continuous streaming of source media. As a result, a client media player can start playing the content (such as a TV channel) almost instantly. This phenomenon is known as streaming media.

M3U (MP3 URL or Moving Picture Experts Group Audio Layer 3 Uniform Resource Locator in full; file extensions: `.m3u`, `.m3u8`) is a computer file format for a multimedia playlist. A common use of the M3U file format is creating a single-entry playlist file that points to a stream on the Internet. The created file provides easy access to that stream and is often utilized in downloads from a website, in emailing, and in listening to Internet radio.

Although it was initially designed for audio files, like MP3, it's commonly used to point media players to audio and video sources, including online ones. Fraunhofer originally developed M3U for use with their Winplay3 software, but numerous media player and software application developers quickly adopted the standard.

M3U8 is the Unicode version of M3U, which utilizes UTF-8-encoded characters. M3U8 files are the foundation for the HTTP Live Streaming (HLS) format initially developed by Apple to stream video and radio to iOS devices. It is now a popular format for Dynamic Adaptive Streaming over HTTP (DASH) in general.

The app retrieves a `.m3u8` file, the Unicode version of M3U, commonly used to direct media players to audio and video sources, including online sources, to live stream the broadcast. It then retrieves a `.ts` file, a standard digital container format that encapsulates packetized elementary streams, equipped with error correction and synchronization pattern features that maintain transmission integrity when the communication channel for the stream is compromised.

We need to discover the URL from which the `.m3u8` file is retrieved to access the `.m3u8` file via the browser. Luckily, Wireshark has captured and analyzed the packet for us, so we can easily retrieve the URL.

![img](/assets/img/hack4.png)
_The full request URL from which we can stream the live broadcast_

The complete request URL from which the `.m3u8` file is retrieved can be found under the Hypertext Transfer Protocol section. I copied and pasted the URL into Safari's search box, and I was able to view the live broadcast instantly. To AirPlay the live stream to my TV, I clicked on the AirPlay button located in Safari's default video player. Now, I was able to watch the match live on my TV!

![img](/assets/img/hack5.png)

## OSINT

Wanting to understand more about the app's back-end provider, I recognized that it's nearly impossible for an independent developer to construct and manage his own server infrastructure capable of supporting hundreds of thousands of simultaneous live stream views. Therefore, I executed a `whois` lookup on the server's IP address, and here's what I discovered.

```
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
```

The server broadcasting the live stream is owned by iomart Hosting Limited, which trades as RapidSwitch. Their data center is situated in Spectrum House, Maidenhead SL6 7FW, UK, as confirmed by Google Maps.

![img](/assets/img/hack6.png)
_RapidSwitch's data center is located in Spectrum House, United Kingdom_

We can also learn more about the frameworks/technologies that the app uses to stream the live broadcast by disassembling the app's APK file. I'll conclude here for now because I need to watch the rest of the match. Goodbye!
