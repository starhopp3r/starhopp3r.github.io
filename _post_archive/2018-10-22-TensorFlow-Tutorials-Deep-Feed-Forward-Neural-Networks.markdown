---
layout: post
title:  "Deep Feed Forward Neural Networks with TensorFlow"
description: "A brief introduction to deep feed forward neural networks in TensorFlow"
date:   2018-10-22 14:00:00 +0800
categories: Machine Learning
---

The deep feed forward neural network is similar to the softmax regression model but is composed of more hidden layers. Deep feed forward networks have the following characteristics:

- Perceptrons are arranged in layers, with the first layer taking in inputs and the last layer producing outputs. The middle layers have no connection with the external world, and hence are called hidden layers.
- Each perceptron in one layer is connected to every perceptron on the next layer. Hence information is constantly "fed forward" from one layer to the next, and this explains why these networks are called feed-forward networks.
- There is no connection among perceptrons in the same layer.

Now that we understand what a deep feed forward neural network is, let's import TensorFlow and our MNIST data set.

{% highlight python %}
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

# Download and extract the MNIST data set, convert to one-hot
mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)
{% endhighlight python %}

Now we need to define the number of layers and the number of hidden nodes within each hidden layer. 

{% highlight python %}
# Hidden layers
n_nodes_hl1 = 800
n_nodes_hl2 = 800
n_nodes_hl3 = 800
{% endhighlight python %}

You can have as many hidden nodes in each layer as you want, and they don't have to be the same. So the first layer could have `800`, the second could have a `1000` and so on. Now we need to define the number of classes we have and the batch size that we want to train our neural network with for every epoch.

{% highlight python %}
# Classes
n_classes = 10
# Batch size
batch_size = 100
{% endhighlight python %}

The number of classes we have is 10 since we have numbers from `0` to `9`. Our batch size is 100, you can change this to your own preference as well. Now we need to reserve a place in our code for the flattened MNIST images and the labels.

{% highlight python %}
# Variables
# Matrix: height x width
x = tf.placeholder(tf.float32, [None, 784])
y = tf.placeholder(tf.float32)
{% endhighlight python %}

`x` is a `placeholder` for the flattened images of height `None` and width `784` since the images are 28 pixels by 28 pixels. `y` is a placeholder for our labels. Now let's define the weights and biases for our hidden layers. 

{% highlight python %}
def neural_network_model(data):
    # (input_data * weights) + biases
    hidden_1_layer = {'weights': tf.Variable(tf.random_normal([784, n_nodes_hl1])),
                      'biases': tf.Variable(tf.random_normal([n_nodes_hl1]))}

    hidden_2_layer = {'weights': tf.Variable(tf.random_normal([n_nodes_hl1, n_nodes_hl2])),
                      'biases': tf.Variable(tf.random_normal([n_nodes_hl2]))}

    hidden_3_layer = {'weights': tf.Variable(tf.random_normal([n_nodes_hl2, n_nodes_hl3])),
                      'biases': tf.Variable(tf.random_normal([n_nodes_hl3]))}

    output_layer = {'weights': tf.Variable(tf.random_normal([n_nodes_hl3, n_classes])),
                    'biases': tf.Variable(tf.random_normal([n_classes]))}
{% endhighlight python %}

The `weights` are `tf.Variable` whose value is a `tf.random_normal` of shape `[input_node_size, output_node_size]`. `biases` are also `tf.Variable` whose value is a `tf.random_normal` of shape `[number_of_nodes_in_hidden_layer]`. Now let us define each of our layers.

{% highlight python %}
    # Model
    l1 = tf.add(tf.matmul(data, hidden_1_layer['weights']), hidden_1_layer['biases'])
    l1 = tf.nn.relu(l1)

    l2 = tf.add(tf.matmul(l1, hidden_2_layer['weights']), hidden_2_layer['biases'])
    l2 = tf.nn.relu(l2)

    l3 = tf.add(tf.matmul(l2, hidden_3_layer['weights']), hidden_3_layer['biases'])
    l3 = tf.nn.relu(l3)

    output = tf.add(tf.matmul(l3, output_layer['weights']), output_layer['biases'])

    return output
{% endhighlight python %}

For each of our layers, we multiply the incoming `Tensor` with the `weights` of the hidden layer and then add the `biases` of the hidden layer to it. Then we pass the output of each hidden layer to a `tf.nn.relu` activation function which calculates the rectified linear for each layer. As with all of our earlier models, we need to train our model and calculate loss. 

{% highlight python %}
def train_neural_network(x):
    # Feed input to model
    prediction = neural_network_model(x)
    # Cross-entropy
    cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=y, logits=prediction))
    # Optimizer (Adam)
    optimizer = tf.train.AdamOptimizer().minimize(cost)
    # Model will train for 10 cycles, feed forward + backprop
    epochs = 10

    # Session
    with tf.Session() as sess:
        # Initialize global variable
        sess.run(tf.global_variables_initializer())
        # Run cycles
        for epoch in range(epochs):
            epoch_loss = 0
            for _ in range(int(mnist.train.num_examples / batch_size)):
                epoch_x, epoch_y = mnist.train.next_batch(batch_size)
                _, c = sess.run([optimizer, cost], feed_dict={x: epoch_x, y: epoch_y})
                epoch_loss += c
            print('Epoch', epoch, 'completed out of', epochs, 'loss', epoch_loss)

        # Check prediction
        correct = tf.equal(tf.argmax(prediction, 1), tf.argmax(y, 1))
        accuracy = tf.reduce_mean(tf.cast(correct, tf.float32))
        result = sess.run(accuracy, feed_dict={x: mnist.test.images, y: mnist.test.labels})
        print("{0:f}%".format(result * 100))


train_neural_network(x)
{% endhighlight python %}

We have already discussed the scope and usage of every single line of the function defined above, so there is no need to go through them individually. Running the above model should give you an accuracy of about 95%, reasonably good but not good enough. 