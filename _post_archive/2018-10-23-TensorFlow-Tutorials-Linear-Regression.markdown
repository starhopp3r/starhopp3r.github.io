---
layout: post
title:  "Linear Regression with TensorFlow"
description: "Using TensorFlow to implement a linear regression model"
date:   2018-10-23 12:44:53 +0800
categories: Machine Learning
---

In this tutorial, we will be looking at how we can use TensorFlow to implement a linear regression model on a given data set. In our case, the data set is going to be very, very small compared to real life data sets that we will be looking at later in the series (our data set only has 4 points). Most of us just get hit by the term linear regression (if you have not taken some advanced math classes), linear regression, in layman's terms is all about drawing the best fit line that best describes a given data set. So now that we know what linear regression is, let's get started.

First, make sure you have TensorFlow installed on your computer and import it as follows. 

{% highlight python %}
import tensorflow as tf
{% endhighlight python %}

Our ultimate goal as stated earlier is to derive the best fit line that best describes the given data set. A line, as we all know follows the standard equation, `y = mx + c`. In this equation, we have two variables that are of concern to us, `m` and `c`. In our training data `y` and `x` would be given to us so we don't have to care about them for now. So let's go ahead and declare `m` and `c` as a variable.

{% highlight python %}
m = tf.Variable([0.3], dtype=tf.float32)
c = tf.Variable([-0.3], dtype=tf.float32)
{% endhighlight python %}

Here we the initialize the variables, `m` and `c` using the `tf.Variable()` constructor. We pass two arguments into the constructor, the first argument is the initial value of the variable, a `Tensor` and the second argument is the data type of the variable. Now we need to declare `y` and `x`, although `y` and `x` values are given to us in our data set, we need to reserve a place for them in our code. 

{% highlight python %}
x = tf.placeholder(tf.float32)
y = tf.placeholder(tf.float32)
{% endhighlight python %}

`y` and `x` are what we call `placeholders`. `placeholders` as the name suggests, allows us to insert a placeholder for a `Tensor` that will be fed with a dictionary which contains the training data. Now, let us declare the linear model which is essentially the standard equation of the best fit line.

{% highlight python %}
linear_model = tf.add(tf.multiply(m, x), c)
{% endhighlight python %}

Here we `tf.multiply`, `m` and `x` and `tf.add` them to `c`. This is exactly the same as `y = mx + c`. Now we need to write a loss function. A loss function or a cost function tells us how far apart the current model is from the provided data. We will be using a standard loss model for linear regression, which essentially sums the squares of the deltas between the current model and the provided data. 

{% highlight python %}
loss = tf.reduce_sum(tf.square(tf.subtract(linear_model, y)))
{% endhighlight python %}

`linear_model - y` creates a vector where each element is the corresponding example's error delta. We use `tf.square` to square the deltas and use `tf.reduce_sum` to create a single scalar that abstracts the error of all examples. We originally declared our `m` and `c` variables to have an initial value of `0.3` and `-0.3` respectively and this value is not going to produce the best fit line for every data set that is going to be thrown at our linear regression model, so we need to adjust the `m` and `c` values to get a best fit line that will adapt and describe any data set that is going to be thrown at us. To do that we use an optimizer. The optimizer we are going to use is called a gradient descent optimizer. It essentially modifies each variable according to the magnitude of the derivative of loss with respect to that variable. There are other optimizers such as the `AdamOptimizer` that you can use. Different optimizers will give you different loss values at the end of the training session and the process of selecting the most suitable optimizer for your model is more of a trial and error process. Now let's implement the optimizer.

{% highlight python %}
optimizer = tf.train.GradientDescentOptimizer(0.01)
train = optimizer.minimize(loss)
{% endhighlight python %}

We pass the learning rate, `0.01` into the `tf.train.GradientDescentOptimizer` class. Then we minimize our `loss` using `optimizer.minimize`. Now we need to provide our training data.

{% highlight python %}
x_train = [1, 2, 3, 4]
y_train = [0, -1, -2, -3]
{% endhighlight python %}

The training data that we have here is really, really small and in the real world this is not going to be the case. Now we need to initialize our global variables the TensorFlow way. 

{% highlight python %}
init = tf.global_variables_initializer()
{% endhighlight python %}

Now lets run the session and train it.

{% highlight python %}
sess = tf.Session()
sess.run(init)
for i in range(1000):
    sess.run(train, {x: x_train, y: y_train})
{% endhighlight python %}

`sess.run` runs one "step" of TensorFlow computation, by running the necessary graph fragment to execute every operation and evaluate every `Tensor` in `fetches`, substituting the values in `feed_dict` for the corresponding input values. `fetches` are the first argument of `sess.run` and the dictionary corresponding the `feed_dict` argument is our training data, `{x: x_train, y: y_train}`. Finally, to evaluate the training accuracy,

{% highlight python %}
curr_m, curr_c, curr_loss = sess.run([m, c, loss], {x: x_train, y: y_train})
print("m: %s c: %s loss: %s" % (curr_m, curr_c, curr_loss))
{% endhighlight python %}

Since `m` and `c` are `placeholder` variables, they would have been optimized to give us a best fit line that best describes our data at the end of the training session, so we can get the final values of `m`, `c` and the `loss` using `sess.run` since they are `Tensors`. And that's it, this is our linear regression model. Running the model should give you something close to the following result.

{% highlight bash %}
m: [-0.9999969] c: [ 0.99999082] loss: 5.69997e-11
{% endhighlight bash %}

Using TensorBoard we get the following graph of our model.

{% assign imgs = "https://cldup.com/XT5pcT4YUk.png," | split: ',' %}
{% include image.html images=imgs maxmaxwidth="100%" caption="TensorBoard graph of our linear regression model." %}<br class="img">
