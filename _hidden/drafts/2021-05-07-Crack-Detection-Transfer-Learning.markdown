---
layout: post
title: "Crack Detection Using Transfer Learning"
description: "Identify cracks in concrete using image recognition and transfer learning"
date: 2021-05-07 10:27:55 +0800
categories: technology
---

In 2019, I developed and trained a machine learning model to identify cracks in concrete structures using image recognition as part of my Final Year Project. My Final Year Project was part of an industrial project in collaboration with Singapore Polytechnic Graduate Guild (SPGG) and funded by Singapore Polytechnic (SP) Iconic Project Grant to design, develop, and deploy a secured, cloud-based, end to end Internet of Things (IoT) and Machine Learning (ML) service to rejuvenate SPGG to become the Smart Club House (SCH) of the future.

Identifying cracks in concrete walls, pillars, or pavements using surveillance cameras/drones at the clubhouse allowed us to quickly identify the damages without searching for cracks manually on a timely basis, saving time and manpower in the long run. I used a pre-trained MobileNetV2 model and performed transfer learning to train a computer vision classifier to detect cracks on walls. This model is light enough to run on edge computing devices and can be deployed on drones and robotic surveyors, allowing us to map and identify cracks around the SPGG complex.

# Methodology

To identify concrete images as cracked or normal, my deep learning model needed to train on thousands of images containing both positive and negative examples. I obtained a large dataset of cracked concrete images from [Mendeley](https://data.mendeley.com/datasets/5y9wdsg2zt/1). 

{% assign imgs = "../../assets/images/samplecrack.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The dataset is divided into two as negative and positive crack images for image classification." %}<br class="img">

The dataset is divided into two as negative and positive crack images for image classification. Each class has 20,000 images with a total of 40,000 images with 227x227 pixels with RGB channels. The dataset is generated from 458 high-resolution images (4032x3024 pixel) with the method proposed by Zhang et al (2016). High-resolution images have variance in terms of surface finish and illumination conditions. No data augmentation in terms of random rotation or flipping was applied. As usual, I performed a train test split on my dataset with 80% of the dataset being used to train the model and the remaining 20% being used to validate the accuracy of the model.