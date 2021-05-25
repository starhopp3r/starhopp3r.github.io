---
layout: post
title: "Finding the YellowLeaf"
description: "Identifying the yellow leaf syndrome in banana plants"
date: 2021-02-27 10:27:55 +0800
categories: technology
---

In 2019, my friends and I competed in the annual AWS Hackdays hackathon, organized by Amazon Web Services in partnership with Intel.  We managed to enter the final round of the hackathon and placed among the top three teams. Since the hackathon was part of a much bigger regional hackathon, the organizers could only announce one winner, and sadly we didn't claim that title. However, the judges were impressed with our solution and even suggested we monetize our solution by developing it into a product (should we?). I would like to tell you more about this project in this blog post.

# Summary

The amount of calories packed in a single banana is dense, not to mention the abundance of vitamins and minerals in it. A few bananas in a single meal are able to sustain human activities for a considerable amount of time. Hence some species of banana has since become a staple in a collection of civilizations or act as the primary source of calories when wheat or rice is low in supply. The demand for calorie dense plants for food gave rise to commercial plantations of bananas, where a single high yield and low maintenance variety of banana species is planted at industrial scale. The risk of over-relying on a single species of banana plant to produce calories for human consumption is susceptible to phenomenal failure in food security. When the said species was biologically attacked by yet-to-be-discovered strain of fungus, the food supply diminished. Humankind should learn our historical lesson from the Potato Blight that happened in Ireland.  

{% assign imgs = "../../assets/images/banana.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="A banana" %}<br class="img">

Tropical Race 4 (TR4) is a soil pathogen that attacks the roots of the plant and blocks its vascular system. It is widespread, and caused banana production in Indonesia, Malaysia, and the Philippines to be severely affected, threatening the livelihoods of producers.

To solve this problem, we proposed a two-part edge-to-edge solution using the AWS Cloud, alongside a combination of machine vision and deep learning at the edge implemented with the Intel® Movidius™ Neural Compute Stick, that could help farmers to pre-emptively combat the TR4 or better known as Panama disease. Our prototype is to be mounted on vectors such as Unmanned Ariel Vechiles (UAV) or Automated Guiding Vehicles (AGV) to help farmers productively and effectively detect, identify, and quarantine TR4 affected banana trees. We hope this method of early intervention is able to save the food crops from annihilation, and prevent history from recurring. 

# The Problem

Plants play a major role in keeping humans alive, producing resources such as oxygen, timber, and food that satiates the basic human needs. With the domestication of plants, humans started to grow their own sustainable food source, allowing the human race to flourish throughout the planet.

{% assign imgs = "../../assets/images/farm.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="A typical banana plantation" %}<br class="img">

One such domesticated plant is the banana plant. With over a thousand varieties, one stands out the most: the Cavendish banana. This cultivar group of bananas accounts for about 47% of all banana production in the world which is equivalent to 50 billion tonnes of bananas per year, achieving high yields per hectare while being resistant to environmental influences. As a matter of fact, countries such as India, China, Brazil, the Philippines and some African countries are the main consumers of the world’s bananas, which constitutes a large percentage of the 7 billion people currently on the planet.

With the Cavendish bananas’ status quo as a heavy lifter in food production worldwide, it is not a stretch to assert that the threats to the Cavendish bananas are therefore inherently a threat to the sustainable food source humankind has worked so hard to achieve. As such, the Panama disease, which affects the Cavendish banana, is a serious threat to the sustainable supply of food.

{% assign imgs = "../../assets/images/panama.jpg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="A banana plant infected with the TR4 pathogen shows the yellowing of the border of the leaves" %}<br class="img">

The Panama disease is caused by the strain Tropical Race 4 (TR4), which affects banana production in Asia. TR4 is a soil pathogen that attacks the roots of the plant and blocks its vascular system. This particular species of the fungus was first discovered in the 1990s in Malaysia and Indonesia and spread quickly to China, where TR4 is now widespread. Production in Indonesia, Malaysia, and the Philippines has also been severely affected by TR4, threatening the livelihoods of local populations and especially income opportunities for smallholder banana farmers.

Two external symptoms help characterize Panama disease of banana:

- **Yellow leaf syndrome**, the yellowing of the border of the leaves which leads to bending the petiole.

- **Green leaf syndrome**, which occurs in certain cultivars, marked by the persistence of the green color of the leaves followed by the bending of petiole as in yellow leaf syndrome.

Once a banana plant is infected, recovery is rare, but if it does occur, any new emerging plant *suckers* will already be infected and can propagate disease if planted. 

As such, to prevent their banana plantations from being fully infected, farmers have to constantly check for any signs of the Panama disease. Should a banana plant be infected with the Panama disease, that area will have to be quarantined to prevent the spread of disease. This therefore requires a lot of manpower, effectively burning up precious time and labour costs, not to mention that it would be difficult to cover every nook and cranny in the acres of land to find an infected plant.

# Our Solution

To solve this problem, our team proposes a two-part edge-to-edge solution using deep learning and machine vision that could help farmers better identify the Panama disease quickly, called YellowLeaf.

<video controls>
  <source src="../../assets/images/yellowleaf.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video><br>

The first part of the solution is the YellowLeaf dashboard. It consists of a grid with each individual cell color-coded based on the probability that the represented plant is infected with the Panama disease. This real-time grid-based dashboard can intuitively represent information regarding the health of the plantation in regards to the disease, such as: the sector of plants affected, the distribution of disease and the spreading velocity of the disease.

{% assign imgs = "../../assets/images/dashboard.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="The YellowLeaf dashboard showing the probability of infection" %}<br class="img">

The sector of plants affected is shown by the edge-detection camera deployed taking close-ups of possible infected banana leaves. The color-coded grid changes color real-time as the camera  adds data to the database, with respect to the confidence level of disease. Next, the distribution of the disease can be observed by having a birds eye view of the entire field, showing intuitive colors as distribution of healthy and unhealthy banana trees sectors. 

Finally, the spreading disease velocity can also be estimated by observing the past data, more effectively predicting an effective quarantine area.

{% assign imgs = "../../assets/images/agv.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Edge detection camera powered by Intel® Movidius™ Neural Compute Stick mounted on an AVG" %}<br class="img">

The second part of the solution is the YellowLeaf edge device. This is an add-on to any existing Unmanned Aerial Vehicles (UAVs) or Automated Guided Vehicles (AGVs) suitable for the situation. With the Intel® Movidius™ Neural Compute Stick, the edge device can perform Machine Vision to identify if a banana plant is infected with the Panama disease. We have trained a model that is also deployed alongside the Intel® Movidius™ Neural Compute Stick, which allows the edge-to-edge detection to happen. These data are then sent to the user, allowing real-time feedback from the edge-detection camera.

# Technical Features

{% assign imgs = "../../assets/images/infected.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Dataset of infected leaf images" %}<br class="img">

We annotated hundreds of banana plant images, identifying and classifying the disease to train a deep learning model using TensorFlow. Once the model was trained to identify the disease, it was deployed to an Intel® Movidius™ Neural Compute Stick interfaced with a Raspberry Pi that streams real-time footage from a camera. This assembly was mounted onto a remote-controlled vehicle which acts as an edge compute platform for acquiring imagery, identifying the disease using deep learning and sending the acquired imagery, the classification result and the position of vehicle to a DynamoDB database via AWS IoT. 

{% assign imgs = "../../assets/images/yelloleaf_arch.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Amazon Web Services cloud architure" %}<br class="img">

The data uploaded to the DynamoDB database triggers an AWS Lambda which disseminates the data to all clients currently connected to the AWS API Gateway. The edge compute platform also uploads the acquired imagery to an S3 Bucket that hosts the static web content of the YellowLeaf web application. Another DynamoDB database is used to store the web socket user session information.

# Conclusion

With YellowLeaf, we hoped to improve the efficiency of surveying farms, decrease reaction time to disease outbreaks, and slow down disease spread in plants and/or crops such as bananas, all while providing real-time updates to the farmers on a grid-based layout overlayed onto a map. 

If we were to develop our solution into a product, we would like to gather more data on a real farm to improve our solution, and eventually deploy it to banana farms in Laos, Indonesia or Vietnam which have high production and consumption of bananas, and eventually the whole of ASEAN and beyond. We hope that this solution will eventually reduce precious manpower and time required by the farmers to find and identify diseases manually.

