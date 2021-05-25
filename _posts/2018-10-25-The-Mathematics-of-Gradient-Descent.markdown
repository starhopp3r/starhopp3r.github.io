---
layout: post
title:  "The Mathematics of Gradient Descent"
description: "The math isn't that hard"
date:   2018-10-25 14:44:55 +0800
categories: Machine Learning
---

In this blog post, I'll be decrypting the mathematics behind the gradient descent optimizer. The equation of a best fit line as you all know is `y = mx + c` and the `y` value is going to change for different values of `x`, so let's write that down as an equation.

$$
y_{i}=m x_{i}+c
$$

Now we need to find the error margin between the actual `y` value and the predicted `y` value. To do that we use the following equation. Where `y` is the actual value and `y hat` is the predicted value.

$$
e_{i}=y_{i}-\hat{y}_{i}
$$

The loss, as stated earlier, is calculated by summing the squares of the error deltas together.

$$
\operatorname{loss}=\sum_{i=0}^{n} e_{i}^{2}
$$

Substituting the standard equation of a best fit line into the loss function, we obtain the following equation.

$$
\operatorname{loss}=\sum_{i=0}^{n}\left(y_{i}-\hat{y}_{i}\right)^{2}
$$

Further substitution gives us the following equation of the loss function.

$$
\operatorname{loss}=\sum_{i=0}^{n}\left[\left(m x_{i}+c\right)-\hat{y}_{i}\right]^{2}
$$

The ultimate goal of gradient descent in our linear regression model is to minimize the loss value obtained from our loss function for different values of `m` and `c` during training. Before we derive our next equation, let us make `m` and `c` equal to `M` independently, so `c = M` and `m = M` this will make our derivation much simpler. From the equation above we can tell that any changes made to `m` or `c` will have a direct impact on the loss, since we generalized and equated `c` and `m` to `M` independently, any changes to `M` will impact the loss value, letting the loss value equal `L`. Since our loss function is essentially the sum of squared error deltas, the graph of `L` against `M` would give us an inverse parabolic curve. The loss is `0` or near `0` at the bottom of the curve so we need to make our way there by adjusting the values of `m` and `c` but using brute force will take a very, very long time, so we use gradient descent.

First, we need to have a derivative of the loss function so that we can see if we need to increase the value of `M` or decrease the value of `M`. The goal is to make the derivative of the loss function equal a value close to `0`. Since we are changing the value of `M` individually as we work, the derivative is a partial derivative.

$$
\frac{\partial L}{\partial M}
$$

From the derivative of our loss function, we can tell if we need to increase or decrease the value of `M`. If the derivative is positive, going uphill, increasing the value of `M` would increase the loss, so we need to decrease it. If the derivative is negative, going downhill, increasing the value of `M` would decrease the loss. Now that we know which way to go we need to make a move. To update the value of `M` we use the following formula.

$$
M=M-\left(\alpha \frac{\partial L}{\partial M}\right)
$$

In the above formula, `alpha` is the learning rate, the argument of the `tf.train.GradientDescentOptimizer` class. This process of updating and calculating the loss happens till the derivative of the loss function is as close to `0` as possible. In our model, `m` and `c` are updated independently and simultaneously. This is how gradient descent works.