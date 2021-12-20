---
layout: post
title:  "Building an Anonymous Facial Recognition System"
description: "Facial recognition that doesn't violate an individual's privacy"
date:   2020-03-30 10:27:55 +0800
categories: AI
---

Amidst the COVID-19 pandemic, tracing the source of a viral spread is one of the keys to containing the disease. However, according to an interview with a contact tracing specialist at the Singapore General Hospital, it is extremely laborious and manual. Even though many techniques have been applied such as using guiding questions to trigger patient’s memories, receipts from taxis and restaurants as proof, even asking the patients’ close relatives, contact tracers still need to rely on the patients’ words as the source of truth, making it possible to lose some information and cause an accidental viral outbreak in a country.

To solve this problem my friends and I developed an end-to-end contact tracing and health declaration automation solution utilizing artificial intelligence, Internet of Things (IoT), machine vision, and cloud computing. We called our project TraceON, and it aims to solve the issue by tagging individuals to checkpoints, and allows the health organizations of countries and communities to collaborate and improve the traceability of contagious diseases. The automatic tagging of individuals automates the need for health declaration forms, as information of the individuals is automatically recorded in the system alongside health screening facilities in public and private sectors alike, eliminating the need to sort through hundreds of digital and hand-written forms, freeing up manpower and time of an organization.

Project TraceON achieves this following a 3-step process. Specific spots in a region can be installed with TraceON camera modules. Whenever a person walks by, the TraceON camera module triggers a TraceON event and sends a sequence of frames for a Machine Learning model to do automatic tagging of an individual. The Machine Learning model runs a pre-trained Convolutional Neural Network in the cloud, designed to recognize human faces, whereby FaceHashes are generated for each unique face identified, maintaining the anonymity of a person while making it possible to trace back to an individual. The results of a TraceON event are saved in a database securely, whereby authorized operators of TraceON can view past event histories that happened near a TraceON camera module for contact tracing and health declaration purposes.

Should a contact trace of an individual be required, TraceON will produce a report for contact tracing specialists and list possibly affected individuals based on the event stride, scientifically defined by a combination of virus airborne survival time and whereabouts of the person within a disease quarantine period.

# FaceHash

My friends and I worked on different features of the project. The project had three main components: FaceHash, the application stack (a web-based frontend and an Amazon Web Services cloud backend), and the TraceON camera module. I worked on FaceHash, a machine learning model designed to anonymously recognize people. 

# Step 1: Finding all the Faces

The first step in our pipeline is face detection. We need to locate the faces in a photograph taken by the TraceON camera modules before we can try to tell them apart. If you’ve used any camera in the last 10 years, you’ve probably seen face detection in action:

{% assign imgs = "../../assets/images/iphoneface.png," | split: ',' %}
{% include image.html images=imgs maxwidth="585px" caption="Face detection in the iPhone's Camera app." %}<br class="img">

Face detection is a great feature for cameras. When the camera can automatically pick out faces, it can make sure that all the faces are in focus before it takes the picture. FaceHash uses face detection for a different purpose — finding the areas of the image we want to pass on to the next step in our pipeline. Face detection went mainstream in the early 2000's when Paul Viola and Michael Jones invented a way to detect faces that was fast enough to run on cheap cameras. However, much more reliable solutions exist now. We’re going to use a method invented in 2005 called Histogram of Oriented Gradients — or just HOG for short.

To find faces in an image, we start by making our image black and white because we don’t need color data to find faces. Then we’ll look at every single pixel in our image one at a time. For every single pixel, we want to look at the pixels that directly surrounding it:

{% assign imgs = "../../assets/images/facehog.gif," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Looking at just this one pixel and the pixels touching it, the image is getting darker towards the upper right." %}<br class="img">

Our goal is to figure out how dark the current pixel is compared to the pixels directly surrounding it. Then we want to draw an arrow showing in which direction the image is getting darker. If you repeat that process for every single pixel in the image, you end up with every pixel being replaced by an arrow. These arrows are called gradients and they show the flow from light to dark across the entire image. This might seem like a random thing to do, but there’s a really good reason for replacing the pixels with gradients. If we analyze pixels directly, really dark images and really light images of the same person will have totally different pixel values. But by only considering the direction that brightness changes, both really dark images and really bright images will end up with the same exact representation. That makes the problem a lot easier to solve. 

However, saving the gradient for every single pixel gives us way too much detail. We end up missing the forest for the trees. It would be better if we could just see the basic flow of lightness/darkness at a higher level so we could see the basic pattern of the image. To do this, we’ll break up the image into small squares of 16x16 pixels each. In each square, we’ll count up how many gradients point in each major direction (how many point up, point up-right, point right, etc.). Then we’ll replace that square in the image with the arrow directions that were the strongest. The end result is we turn the original image into a very simple representation that captures the basic structure of a face in a simple way:

{% assign imgs = "../../assets/images/hogtwo.gif," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The image is turned into a HOG representation that captures the major features of the image regardless of image brightnesss." %}<br class="img">

To find faces in this HOG image, all we have to do is find the part of our image that looks the most similar to a known HOG pattern that was extracted from a bunch of other training faces.

# Step 2: Posing and Projecting Faces

Whew, we isolated the faces in our image. Now we have to deal with the problem that faces turned different directions look totally different to a computer. To account for this, we will try to warp each picture so that the eyes and lips are always in the sample place in the image. This will make it a lot easier for us to compare faces in the next steps. To do this, we are going to use an algorithm called face landmark estimation. There are lots of ways to do this, but we are going to use the approach invented in 2014 by Vahid Kazemi and Josephine Sullivan. The basic idea is we will come up with 68 specific points (called landmarks) that exist on every face — the top of the chin, the outside edge of each eye, the inner edge of each eyebrow, etc. Then we will train a machine learning algorithm to be able to find these 68 specific points on any face. 

Once we know where the eyes and mouth are, we’ll simply rotate, scale and shear the image so that the eyes and mouth are centered as best as possible. We won’t do any fancy 3D warps because that would introduce distortions into the image. We are only going to use basic image transformations like rotation and scale that preserve parallel lines (called affine transformations):

{% assign imgs = "../../assets/images/posealign.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="We transform the image so that the eyes and mouth are centered as best as possible." %}<br class="img">

Now, no matter how the face is turned, we are able to center the eyes and mouth in roughly the same position. This will make our next step a lot more accurate. 

# Step 3: Encoding Faces

How do we actually tell faces apart? The simplest approach to face recognition is to directly compare the unknown face we found in Step 2 with all the pictures we have of people that have already been tagged. When we find a previously tagged face that looks very similar to our unknown face, it must be the same person. There’s a big problem with that approach. A site like Facebook with billions of users and a trillion photos can’t possibly loop through every previously-tagged face to compare it to every newly uploaded picture. That would take way too long. They need to be able to recognize faces in milliseconds and not hours. What we need is a way to extract a few basic measurements from each face. Then we could measure our unknown face the same way and find the known face with the closest measurements. For example, we might measure the size of each ear, the spacing between the eyes, the length of the nose, etc. If you’ve ever watched a crime show like *CSI*, you know what I am talking about.

What measurements should we collect from each face to build our known face database? It turns out that the measurements that seem obvious to us humans (like eye color) don’t really make sense to a computer program looking at individual pixels in an image. Researchers have discovered that the most accurate approach is to let the computer figure out the measurements to collect itself. Deep learning does a better job than humans at figuring out which parts of a face are important to measure. The solution is to train a Deep Convolutional Neural Network. However, instead of training the network to recognize picture objects like we did last time, we are going to train it to generate 128 measurements for each face.

The training process works by looking at three face images at a time:

- Load a training face image of a known person.
- Load another picture of the same known person.
- Load a picture of a totally different person.

Then the algorithm looks at the measurements it is currently generating for each of those three images. It then tweaks the neural network slightly so that it makes sure the measurements it generates for #1 and #2 are slightly closer while making sure the measurements for #2 and #3 are slightly further apart. After repeating this step millions of times for millions of images of thousands of different people, the neural network learns to reliably generate 128 measurements for each person. Any ten different pictures of the same person should give roughly the same measurements.

We call this process embedding. The idea of reducing complicated raw data like a picture into a list of computer-generated numbers comes up a lot in machine learning (especially in language translation). The exact approach for faces we are using was invented in 2015 by [researchers at Google](https://www.cv-foundation.org/openaccess/content_cvpr_2015/app/1A_089.pdf) but many similar approaches exist.

This process of training a Convolutional Neural Network to output face embeddings requires a lot of data and computer power. Even with an expensive Nvidia Telsa graphics card, it takes about 24 hours of continuous training to get good accuracy.However, once the network has been trained, it can generate measurements for any face, even ones it has never seen before! So this step only needs to be done once. Lucky for us, the folks at OpenFace already did this and they published several trained networks which we can directly use. So all we need to do is run our face images through their pre-trained network to get the 128 measurements for each face. Here’s the measurements for our test image:

{% assign imgs = "../../assets/images/faceembed.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Embedding generated for a given image of a face." %}<br class="img">

What parts of the face are these 128 numbers measuring exactly? It turns out that we have no idea and it doesn’t really matter to us. All that we care about is that the network generates ***nearly the same numbers*** when looking at two different pictures of the same person.

# Step 4: Hashing

Now that we have generated the embeddings for our faces, we can hash these embeddings to get a unique identifier for each face that we have seen. This process eventually ties a unique identifier to anyone we want to trace. This FaceHash can also be tied to their national identification number. I used a relatively simple hashing algorithm called MD5 for this project. The MD5 message-digest algorithm is a widely used hash function that produces a 128-bit hash value. Although MD5 was initially designed to be used as a cryptographic hash function, it has been found to suffer from extensive vulnerabilities since 1996 when the first hash collisions were detected. You can choose to use a more secure hashing algorithm like SHA256, but you’ll have to compromise on computational speed. The whole process of FaceHashing will look like this: 

{% assign imgs = "../../assets/images/facehash.jpeg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Faces taken from thispersondoesnotexist.com" %}<br class="img">

We tried FaceHashing our faces and I have to admit, it's not 100% accurate. Factors such as lighting, shadows, quality of the image, and even the person's physical appearance can affect how the embeddings are generated, and this eventually affects the FaceHashes generated at the end of the pipeline. As mentioned in the previous section, the "network generates ***nearly the same numbers*** when looking at two different pictures of the same person", this implies that there can be instances where different embeddings are generated for two different pictures of the same person, also affecting the FaceHash generated at the end of the pipeline.

# What's Next

Currently, in the market, there are many tracing and tracking solutions but are too expensive to be implemented in a pandemic situation such as COVID19, as this pandemic disease has proven not only to disrupt the healthcare industry, but also the economy, tourism, and possibly every other industry, causing major disruption and instability to everyone in the world. The said solutions usually use proprietary, closed-source hardware which requires modifying said proprietary systems to achieve a high level of integration with the cloud, deterring the time-to-market of said systems, missing the critical time frame to curb said pandemic diseases. Furthermore, the security of people is a great concern when it comes to implementing such a system. As a form of sincerity, we have [open-sourced TraceON](https://github.com/SudoFoundry/TraceON), from the hardware used, Machine Learning model used, cloud architecture, all the way to the method of creating FaceHashes to maintain the anonymity of individuals in the system. You can learn more about TraceON from our original project submission on [Devpost](https://devpost.com/software/traceon).
