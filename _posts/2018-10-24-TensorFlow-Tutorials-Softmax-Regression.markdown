---
layout: post
title:  "Softmax Regression with TensorFlow"
description: "Teach a computer to read handwritten numbers"
date:   2018-10-24 13:44:57 +0800
categories: Machine Learning
---

A vast majority of us got initiated into programming through the typical "Hello World." program where you just learn to print the phrase "Hello World." onto the terminal. Like programming, machine learning too has a "Hello World." program and it is called MNIST. The MNIST (Modified National Institute of Standards and Technology) data set contains 70,000 images of hand written digits along with labels which tell us which image corresponds to which number. The numbers range from `0` to `9`. In this tutorial, we are going to train a model to look at images and predict what digits they are. The prediction is going to be a probability rather than a definitive prediction of class and to do that we will be using softmax regression. 

The MNIST data set is hosted on [Yann LeCun's website](http://yann.lecun.com/exdb/mnist/). The dataset contains 70,000 images as mentioned earlier and it's split into 55,000 data points of training data, 10,000 points of test data and 5,000 points of validation data. Every MNIST data point has two parts to it, an image of the handwritten digit and a corresponding label. In our model, the images are going to the "`x`" and the labels, "`y`". Both the training and the testing data set contains images and their corresponding labels. Each image is 28 pixel by 28 pixels and we can interpret the images as a big array of numbers. We can flatten this array into a vector of 784 numbers (28 x 28). You should note that flattening the array will result in the loss of information about the 2D structure of the images. Each number in the vector is a pixel intensity value between `0` and `1` (something like `0.4`, `0.9` and `0.7`). As mentioned earlier, each image in MNIST has a corresponding label between `0` and `9` and we would want our labels to be `one-hot` vectors. A one-hot vector is a vector which is `0` in most dimensions, and `1` in a single dimension. So if the label corresponding to an image is `3`, the one-hot vector is going to be `[0, 0, 0, 1, 0, 0, 0, 0, 0, 0]` and if the label is `0` the one-hot vector is `[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]`. Basically, the value of the label corresponds to the index of `1` in the vector.

As mentioned earlier, we want our model to give us probabilities instead of definitive predictions so we use softmax regression. Softmax gives us a list of probability values between `0` and `1` that adds up to `1`. Our softmax regression model has two steps: first, we add up the evidence of our input being in certain classes, and then we convert that evidence into probabilities. To tally up the evidence that a given image is in a particular class, we do a weighted sum of the pixel intensities. We also add some extra evidence called a bias to the weighted sum of pixel intensities. Biases basically make certain evidence independent of the input, so even if the weighted sum is 0, you still have some evidence that the image belongs/does not belong to a certain class. The result is that the evidence for a class *i* given an input *x* is:

$$
\text { evidence }_{i}=\sum_{j} W_{i, j} x_{j}+b_{i}
$$

where `Wi` is the weights and `bi` is the bias for class `i`, and `j` is an index for summing over the pixels in our input image `x`. We then convert the evidence tallies into our predicted probabilities, `y` using the softmax function:

$$
y=\operatorname{softmax}(\text {evidence})
$$

Here softmax is serving as an activation function, shaping the output of our linear function into the form we want - in this case, a probability distribution over 10 classes and it is defined as:

$$
\operatorname{softmax}(x)=\text {normalize}(\exp (x))
$$

Expanding the equation, we get:

$$
\operatorname{softmax}(x)_{i}=\frac{\exp \left(x_{i}\right)}{\sum_{j} \exp \left(x_{j}\right)}
$$

Our softmax regression model can be pictured as looking something like the following, but with a lot more `x`s.

{% assign imgs = "https://www.tensorflow.org/images/softmax-regression-scalargraph.png," | split: ',' %}
{% include image.html images=imgs maxwidth="581px" %}<br class="img">

In summary, our model can be written as:

$$
y=\operatorname{softmax}(W x+b)
$$

Visualizing the above equation in terms of vectors, we get:

{% assign imgs = "https://www.tensorflow.org/images/softmax-regression-vectorequation.png," | split: ',' %}
{% include image.html images=imgs maxwidth="524px" %}<br class="img">


Now that we have defined our entire model in mathematical terms, let's start coding.

# Implementing the Softmax Regression Model

First we need to import TensorFlow.

{% highlight python %}
import tensorflow as tf
{% endhighlight python %}

Now we need to obtain the MNIST dataset. Thankfully, TensorFlow has an inbuilt function which allows us to get the MNIST data set, extract it and use it, they have even split the dataset for us so we don't have to do it ourselves.

{% highlight python %}
from tensorflow.examples.tutorials.mnist import input_data

# Download and extract the MNIST data set, convert to one-hot
mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)
{% endhighlight python %} 

Here we download our data and convert the labels to a one-hot vector. Now let's reserve a place for our images.

{% highlight python %}
# MNIST images, each flattened into a 784-dimensional vector
x = tf.placeholder(tf.float32, [None, 784])
{% endhighlight python %}

`x` is a `placeholder`, a value that we'll input when we ask TensorFlow to run a computation. We want to be able to input any number of MNIST images, each flattened into a 784-dimensional vector. We represent this as a 2-D `Tensor` of floating-point numbers, with a shape `[None, 784]`. `x` is of shape `[None, 784]` and we will be feeding in images in batches so `None` here is able to support any batch size that we specify. Now we need our weights and biases. Like in the [linear regression model example](https://github.com/starhopp3r/tensorflow-tut/tree/master/linear-regression-model), weights and biases will be like our `m` and `c`, they will be variables whose values will be constantly updated as we train the model. Let's declare weights and biases in our code as variables.

{% highlight python %}
# Weights
W = tf.Variable(tf.zeros([784, 10]))
# Biases
b = tf.Variable(tf.zeros([10]))
{% endhighlight python %}

Our weights, `W` and biases, `b` will be `Tensors` full of `0`s with a shape of `[784, 10]` and `[10]` respectively. Notice that `W` has a shape of `[784, 10]` because we want to matrix multiply the 784-dimensional image vectors with it to produce 10-dimensional vectors of evidence for the different classes of labels. `b` has a shape of `[10]` so we can add it to the result of the matrix multiplication. Now let us define our model.

{% highlight python %}
# Model
y = tf.nn.softmax(tf.add(tf.matmul(x, W), b))
{% endhighlight python %}

The code above is just following the equation of our model that we defined earlier. I prefer to use `tf.add` to add two `Tensors` together, adding them using the regular `+` would also work. Like our linear regression model we also need to define a loss/cost function and for this model, we will be using a very common loss function called cross-entropy. Cross-entropy is defined as:

$$
H_{y^{\prime}}(y)=-\sum_{i} y_{i}^{\prime} \log \left(y_{i}\right)
$$

Where y is our predicted probability distribution, and y′ is the true distribution (the one-hot vector with the digit labels). In some rough sense, the cross-entropy is measuring how inefficient our predictions are for describing the truth. We use cross-entropy to calculate loss because, once we get our inputs, we matrix multiply it with the weights and add the biases to them and obtain logits. We then feed the logits, which are scores into the softmax function to obtain probabilities. To calculate loss we need to compare these probabilities with the one-hot encoded vector labels and to do that we use cross-entropy to convert those probabilities into one-hot encoded vectors. To implement cross-entropy we need to first add a new placeholder to input the correct answers:

{% highlight python %}
# Actual label
y_ = tf.placeholder(tf.float32, [None, 10])
{% endhighlight python %}

Then we can implement the cross-entropy function:

{% highlight python %}
# Cross-entropy
cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y))
{% endhighlight python %}

In the above code, `tf.reduce_mean` computes the mean over all the examples in the batch. `tf.nn.softmax_cross_entropy_with_logits` computes cross-entropy where `y_` is the label and `y` is the logit. Now let's implement the gradient descent optimization algorithm to modify the variables and reduce loss:

{% highlight python %}
train_step = tf.train.GradientDescentOptimizer(0.5).minimize(cross_entropy)
{% endhighlight python %}

In this case, we ask TensorFlow to minimize `cross_entropy` using the gradient descent algorithm with a learning rate of `0.5`. Gradient descent is a simple procedure, where TensorFlow simply shifts each variable a little bit in the direction that reduces the cost. More explanation can be found in the [linear regression tutorial](https://github.com/starhopp3r/tensorflow-tut/tree/master/linear-regression-model). Now let's launch our model in a `Session` and create an operation to initialize the variables we created.

{% highlight python %}
# Launch model in interactive session
sess = tf.Session()
# Initialize variables
sess.run(tf.global_variables_initializer())
{% endhighlight python %}

Now let's train our model, for 1000 epochs.

{% highlight python %}
# Train model for 1000 epochs
for _ in range(1000):
    # Batch of 100 random training data points
    batch_xs, batch_ys = mnist.train.next_batch(100)
    sess.run(train_step, feed_dict={x: batch_xs, y_: batch_ys})
{% endhighlight python %}
Each step of the loop, we get a "batch" of one hundred random data points from our training set. We run `train_step` feeding in the batches data to replace the `placeholder`s. Using small batches of random data is called stochastic training - in this case, stochastic gradient descent. Now that we have trained our model, we need to find out how well our model performs. To do that we first need to find out where we predicted the correct label. Our softmax function gives us a list of probabilities that add up to 1 across 10 classes and our labels are one-hot encoded vectors and equating them together to find accuracy is not going to work. The better way is to get the index of the highest value in both vectors (the output vector of our softmax function and the labels) and see if they are equal. To do this, we use the following code:

{% highlight python %} 
# Check if index of highest values match between the tensors
correct_prediction = tf.equal(tf.argmax(y,1), tf.argmax(y_,1))
{% endhighlight python %}

`tf.argmax` is an extremely useful function which gives us the index of the highest entry in a `Tensor` along some axis. Then we use `tf.equal` to see if the indices match. This would give us a list of booleans. To determine what fraction are correct, we cast to floating point numbers and then take the mean. For example, `[True, False, True, True]` would become `[1,0,1,1]` which would become `0.75`.

{% highlight python %}
# Cast booleans to floats
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
{% endhighlight python %}

Finally, we check the accuracy of our model using our test data, data that we didn't train the model to recognise.

{% highlight python %}
# Check accuracy on test data
result = sess.run(accuracy, feed_dict={x: mnist.test.images, y_: mnist.test.labels})
# Print float as percentage
print("{0:f}%".format(result * 100))
{% endhighlight python %}

Running the above code should give you an accuracy close to about `92.0%`. In our next tutorial, we will be increasing the accuracy of our model close to about `99.0%`.

Using TensorBoard we get the following graph of our model.

{% assign imgs = "https://cldup.com/xLR0_THUyx.png," | split: ',' %}
{% include image.html images=imgs maxmaxwidth="100%" caption="TensorBoard graph of our softmax regression model." %}<br class="img">