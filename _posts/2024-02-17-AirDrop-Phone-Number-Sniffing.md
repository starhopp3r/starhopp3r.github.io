---
title: "Sniffing My Neighbour's Phone Number"
date: 2024-02-17 06:40:55 +0800
tags: [AirDrop, Apple, bluetooth, sniffing]
---

> Please exercise caution and respect privacy laws when attempting to obtain personal information through unconventional means; this content is for educational and demonstrative purposes only.
{: .prompt-danger }


In the midst of an otherwise ordinary afternoon, as I strolled towards the university for a much-anticipated lecture, I found a moment of pause in the virtual corridors of X. There, amidst the usual digital chatter, a particular post from LaurieWired emerged, not just as a tweet but as a caveat to the digitally unwary. LaurieWired's expertise in digital security had always been illuminating, but this time, it was a revelation with unsettling undertones. The tweet in question was a stark exposition on the vulnerabilities inherent in AirDrop's protocol – a startling insight into how it forgoes the use of cryptographic salts, making it susceptible to rainbow table attacks that could potentially de-anonymize users.

![img](/assets/img/lw_xtweet.png)
_@LaurieWired's tweet on X (formerly Twitter)_

LaurieWired laid bare the process: AirDrop broadcasts a Bluetooth advertisement without the usual cryptographic safeguards, carrying within it a partial hash of the sender's phone number and email address. This hash, when matched with the recipient's device, facilitates authentication and, subsequently, file sharing. However, the absence of salting means that the SHA256 hashes of phone numbers can be precomputed and stored in a rainbow table, alarmingly compact in size, only a few terabytes. Such tables can then be used to reverse-engineer the hash back to the original phone number and email address, stripping away the veil of anonymity from the sender. LaurieWired's closing note was perhaps the most disconcerting of all – a sobering acknowledgment that, as of now, there is no known method to fully prevent this leakage of personal contact information through AirDrop, with implications that reverberate globally, given that nations like China are already exploiting this weakness.

This digital forewarning by LaurieWired was not just a casual observation but a clarion call for heightened awareness and a prompt for seeking solutions to protect our digital identities. In this blog post, we will dissect this vulnerability, ponder its implications, and navigate the ethics of digital privacy in a world where technology often outpaces security.

## Conducting Further Research on AirDrop Security


After absorbing the unsettling insights shared by LaurieWired, my academic pursuits for the day were capped off with an intense curiosity. Upon returning home, I felt compelled to dig deeper into the mechanics of AirDrop's security. I sought out the most authoritative source I could think of — Apple's official website. There, nestled within their support pages, I found a detailed explanation of AirDrop's security protocol that appeared to make the process seem slightly more complex and secure than what LaurieWired had described.

According to Apple, AirDrop's security infrastructure is built upon iCloud services to authenticate users. A user's relationship with their iCloud account is secured with a 2048-bit RSA identity, which is stored on their device upon signing in. This cryptographic identity becomes the cornerstone when AirDrop is activated, creating what is known as an AirDrop short identity hash, a digital fingerprint of sorts, derived from the user's Apple ID-associated email addresses and phone numbers.

![img](/assets/img/airdropofficial.png)
_Apple's official description of AirDrop's secure file transfer process_

The process unfolds in a seemingly secure exchange of digital signals. When an item is set to be shared via AirDrop, the sender's device broadcasts an encrypted signal over Bluetooth Low Energy (BLE) containing the user's AirDrop short identity hash. Devices within proximity that are alert and have AirDrop enabled detect this beacon and engage in a silent conversation using peer-to-peer Wi-Fi. It's a discreet call-and-response that hinges on recognition; in 'Contacts Only' mode, the receiving device cross-references the incoming hash with the hashes of contacts it holds dear. A match prompts a response with the receiver's identity information, while a mismatch leads to silence.

This process is slightly altered in 'Everyone' mode, where the receiving device responds regardless of a match, a setting that favors connectivity over exclusivity. The initial BLE signal is then followed by an AirDrop connection over peer-to-peer Wi-Fi, during which a long identity hash is transmitted to the receiving device. This final verification step ensures that the receiver is indeed known to the sender, based on the matched long identity hashes in the receiver's Contacts.

Apple's account of AirDrop's security measures paints a picture of layered defenses, from RSA identities to the matching of short and long identity hashes. Yet, despite this seemingly robust security protocol, LaurieWired's disclosure suggests that there may still be vulnerabilities, particularly in the absence of cryptographic salts which could leave users exposed to rainbow table attacks. This dichotomy between the official portrayal of security and the potential for exploitation forms the core of our inquiry.

## Sniffing Bluetooth Traffic

With the contrasting perspectives of LaurieWired and Apple's official stance fresh in my mind, I decided to conduct an experiment of my own to observe AirDrop's security in action. To this end, I employed a Nordic Semiconductor nRF52840 Dongle — a powerful yet compact piece of hardware capable of capturing Bluetooth traffic. This dongle, paired with the analytical prowess of Wireshark, a renowned network protocol analyzer, would serve as my investigative lens into the wireless communications that flit invisibly through the air.

![img](/assets/img/ble_sniffer.png)
_The Nordic Semiconductor nRF52840 Dongle_

Once the nRF52840 Dongle was set up and Wireshark was humming on my system, I initiated the scan, curious to see what secrets the ether around my home might surrender. It wasn't long before I stumbled upon a digital whisper — a broadcast from a nearby Apple device. This was not just any broadcast; it was an AirDrop signal, and contained within its BLE packets was the very thing LaurieWired's post had warned about: an AirDrop short identity hash.

![img](/assets/img/wireshark_airdrop.png)
_AirDrop's broadcast data as seen on Wireshark_

This string of hexadecimal characters derived from an Apple user's email and phone number, was meant to be a secure means of identification among Apple devices. Yet here it was, plainly visible within the broadcast data, captured by my dongle and laid bare on my screen. The realization was striking: any neighbor, with the right tools and a dash of technical acumen, could potentially intercept these broadcasts and, with them, the short identity hashes they contained.

The implications of this discovery were profound. If, as LaurieWired suggested, these hashes could be reverse-engineered back to personal contact information without the safeguard of cryptographic salts, then the privacy concerns were not just theoretical but palpable and immediate.

## Decoding the AirDrop Broadcast Data

Intrigued by the AirDrop broadcast data I had sniffed, which appeared as a 30-character long hexadecimal string, I found myself at a crossroads of cryptography and curiosity. The data in front of me was a puzzle; I knew it held the partial hash of a user's contact information, but the exact whereabouts of this sensitive piece of the string remained a mystery. With determination, I turned to the broader community for insight and soon discovered that the folks at Hexway had already tread this path and had released a guide detailing this very vulnerability.

![img](/assets/img/hexway.png)
_Hexway's guide on the AirDrop broadcast data_

The guide from Hexway was a beacon of understanding in the fog of my research. It indicated that during an AirDrop session, devices send out only 2 bytes of the SHA256 hash comprised of the user's Apple ID, phone number, and email address. This was a critical piece of information, yet something didn't quite match up. The broadcast data I had captured was formatted differently than the examples Hexway had outlined. My data was fronted by what appeared to be a preamble, 0512, followed by an extensive series of 17 zeros, before arriving at a sequence that resonated with Hexway's description. However, in my observation, the actual partial hash data was located towards the end of the string, occupying characters 26 to 30, a stark contrast to the positions 11 to 13 as noted in Hexway's document.

Energized by the challenge before me, I set out to craft a Python script with a singular focus: to generate the partial SHA256 hashes of all phone numbers in Singapore. This nation's numerical framework lent itself to a task that was computationally feasible on a scale that larger countries would not. Within a surprisingly short span of thirty-five minutes, my script had processed and computed the partial SHA256 hashes for the entire range of Singaporean phone numbers.

![img](/assets/img/redisdb.png)
_The Redis database of partial hashes and phone numbers_

For the task of storing these partial hash-number pairs, I chose Redis, a powerful in-memory data structure store, known for its exceptional performance. Redis was the ideal choice for this application due to its ability to handle high write and read speeds, which is essential when dealing with such a large dataset and the possibility of frequent access. Additionally, its support for data persistence meant that once written, the data would not be lost even if the system was restarted, a critical feature for maintaining the integrity of my work. Furthermore, Redis's nature as a key-value store made it perfect for quick lookups, which was necessary for matching the partial hashes to potential phone numbers.

![img](/assets/img/dropsniffer.png)
_A list of all possible phone numbers_

Considering the nature of a partial hash — in this case, just the first two bytes of the SHA256 hash — there was an inherent expectation of collisions, where multiple phone numbers would correspond to the same hash fragment. This is a common occurrence in hash functions, especially when dealing with truncated values. As anticipated, when I inputted the broadcast data hexadecimal string into my Redis-powered database, I was presented with a list of almost 100 possible numbers tied to the partial hash. This result was not only within the realm of expectation but also a practical demonstration of the limitations and considerations when dealing with hash-based security measures.

Armed with the insights from this experiment, it is clear that the list of potential phone numbers could be further narrowed if we had more detailed information on the actual range of active phone numbers, coupled with additional open-source intelligence (OSINT) efforts to refine our data. Such specificity would significantly enhance the precision of matching the partial hashes to their rightful owners. In closing, while AirDrop offers a convenient means of transferring data, its security, as we've seen, is not impervious to scrutiny and warrants a mindful approach when in use.
