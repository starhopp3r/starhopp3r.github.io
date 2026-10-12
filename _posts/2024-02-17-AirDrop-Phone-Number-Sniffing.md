---
title: "Sniffing My Neighbour's Phone Number"
category: Privacy & Security
cover: /assets/img/covers/airdrop-1440.webp
cover_small: /assets/img/covers/airdrop-720.webp
cover_alt: Apple's AirDrop interface on an iPhone
dek: How AirDrop broadcasts can expose nearby users' phone numbers.
---

> Please exercise caution and respect privacy laws when attempting to obtain personal information through unconventional means; this content is for educational and demonstrative purposes only.

One afternoon, on my way to a university lecture I was looking forward to, I stopped to browse X. A post from LaurieWired, who is known for expertise in digital security, caught my attention. It warned that AirDrop's protocol omits cryptographic salts, leaving it open to rainbow table attacks that could reveal a user's identity.

![img](/assets/img/lw_xtweet.png)
_@LaurieWired's tweet on X (formerly Twitter)_

LaurieWired explained that AirDrop sends a Bluetooth advertisement without strong cryptographic safeguards. The advertisement includes a partial hash of the sender's phone number and email address so that a receiving device can recognize and authenticate the sender. Because the hash is not salted, an observer can precompute SHA256 hashes of phone numbers and store them in a rainbow table that takes up only a few terabytes. These tables can then help recover the original phone number or email address from the hash. LaurieWired added that there was currently no known way to fully prevent this leak, and that countries such as China might already be exploiting it.

The post made me want to understand how AirDrop handles our data and what we can do to protect our privacy. I decided to examine the weakness, its effects, and the ethics of privacy when technology develops faster than its safeguards.

## Researching AirDrop Security

When I returned home, I looked for authoritative information in Apple's official documentation. Its support pages described an AirDrop security protocol that seemed more complex and secure than LaurieWired's account.

According to Apple, AirDrop uses iCloud services to authenticate users. When a user signs in, the device stores a 2048 bit RSA identity that secures their link to the iCloud account. This identity forms the basis for an AirDrop short identity hash derived from the user's Apple ID email addresses and phone numbers.

![img](/assets/img/airdropofficial.png)
_Apple's official description of AirDrop's secure file transfer process_

When a user starts an AirDrop transfer, the device broadcasts an encrypted Bluetooth Low Energy signal containing the short identity hash. Nearby devices with AirDrop enabled detect the signal and start a private exchange over peer to peer Wi Fi. In Contacts Only mode, the receiving device compares the hash with those of its stored contacts. It responds if it finds a match and stays silent if it does not.

In Everyone mode, the receiving device responds to all broadcasts to make sharing more accessible. After the first exchange, the devices connect over peer to peer Wi Fi, and the sender sends a long identity hash. By matching the long identity hashes, the devices confirm that the receiver is a known contact.

Apple describes several layers of protection, from RSA identities to short and long identity hashes. Yet LaurieWired's findings suggest that the lack of cryptographic salts may still leave AirDrop open to rainbow table attacks. I wanted to understand how this weakness fitted with Apple's account.

## Sniffing Bluetooth Traffic

To observe AirDrop's behavior myself, I used a Nordic Semiconductor nRF52840 Dongle to capture Bluetooth traffic. Together with Wireshark, a widely used protocol analyzer, the dongle let me inspect nearby wireless signals.

![img](/assets/img/ble_sniffer.png)
_The Nordic Semiconductor nRF52840 Dongle_

After I configured the dongle and started Wireshark, I scanned for nearby Bluetooth activity. I soon detected an AirDrop broadcast from an Apple device, with the short identity hash LaurieWired had described inside its BLE packets.

![img](/assets/img/wireshark_airdrop.png)
_AirDrop's broadcast data as seen on Wireshark_

Although the hexadecimal string comes from an Apple user's email and phone number to help devices recognize one another securely, it was visible in the broadcast and easy to capture. Anyone nearby with the equipment and technical skills could get these short identity hashes.

If rainbow table techniques can reverse these hashes, as LaurieWired suggested, they may expose personal information more easily than users expect.

## Decoding the AirDrop Broadcast Data

My capture contained a 30 character hexadecimal string, and I wanted to identify the part that held the partial hash. While searching for information, I found a guide from the team at Hexway that described the weakness in detail.

![img](/assets/img/hexway.png)
_Hexway's guide on the AirDrop broadcast data_

Hexway explained that AirDrop devices send only two bytes of the SHA256 hash of the user's Apple ID, phone number, and email address. But my capture had a different structure from Hexway's examples. It began with the preamble 0512, followed by seventeen zeros and then a sequence that matched Hexway's format. The partial hash also appeared near the end, at characters 26 to 30, rather than positions 11 to 13 as described in the guide.

I wrote a Python script to generate partial SHA256 hashes for all phone numbers in Singapore. The country's standardized numbering system made it practical to compute the full range, which took about thirty five minutes.

![img](/assets/img/redisdb.png)
_The Redis database of partial hashes and phone numbers_

I stored the hash and phone number pairs in Redis, a fast in memory key value data store. Its read and write speed and simple key value structure suited the quick lookups I needed to find possible matches. Redis also supports persistence, so the data would survive restarts.

![img](/assets/img/dropsniffer.png)
_A list of all possible phone numbers_

A two-byte hash fragment will have collisions: many phone numbers share the same truncated hash. When I checked the broadcast data against the Redis database, nearly one hundred phone numbers matched. The fragment did not identify a unique number. As expected, this showed a limit of using truncated hashes for security.

Information about active phone number ranges and targeted OSINT techniques could narrow the list further. Although AirDrop makes file sharing convenient, this experiment shows how parts of its design may expose users to unexpected privacy risks. So users need to understand these risks and use it with care.
