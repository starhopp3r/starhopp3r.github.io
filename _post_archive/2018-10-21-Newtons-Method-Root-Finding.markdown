---
layout: post
title:  "Newton's Method for Finding Roots"
description: "Find your roots Newton style"
date:   2018-10-21 16:12:55 +0800
categories: Machine Learning
---

First order optimization techniques are usually less computationally expensive to compute and less time expensive, converging pretty fast on large datasets. Second order optimization techniques on the other hand are faster when the second derivative is known and easy to compute. But the second derivative is often intractable to compute, requiring lots of computation. For certain problems, gradient descent can get stuck along paths of slow convergence around saddle points, whereas second order methods wont't.

Trying out different optimization techniques for your specific problem is the best way to see what works best. Note: first order optimization uses the first derivative while the second order optimization uses the second derivative. In this blog post, we'll be looking at Newton's method of root finding, a popular second order optimization technique used in machine learning.

# Defining our Functions and Derivatives

{% highlight python %}
from math import pow

def f(x):
    return 6*pow(x, 5)-5*pow(x, 4)-4*pow(x, 3)+3*pow(x, 2)


def df(x):
    return 30*pow(x, 4)-20*pow(x, 3)-12*pow(x, 2)+6*x


def dx(x):
    return abs(0-f(x))

{% endhighlight python %}

Our function is a polynomial equation, $$ f(x) = 6x^5 - 5x^4 - 4x^3 + 3x^2 $$. The derivative of this function is, $$ f'(x) = 30x^4 - 20x^3 - 12x^2 + 6x $$ If we were to plot our $$ f(x) $$ against $$ x $$, we would get the following graph.

{% assign imgs = "../../assets/images/newtongraph.png," | split: ',' %}
{% include image.html images=imgs maxmaxwidth="100%" caption="The graph's x-intercepts and the polynomial equation's roots are the same." %}<br class="img">


Our roots are -0.8, 0, 0.6ish and 1.

# Newton's Method

{% highlight python %}
def newtons_method(df, x0, e, print_res=False):
	delta = dx(x0)
    while delta > e:
        x0 = x0 - f(x0)/df(x0)
        delta = dx(x0)
    if print_res:
        print('Root is at: {}'.format(x0))
        print('f(x) at root is: {}'.format(f(x0)))
    return x0
{% endhighlight python %}

In numerical analysis, Newton's method (also known as the Newton–Raphson method), named after Isaac Newton and Joseph Raphson, is a method for finding successively better approximations to the roots (or zeroes) of a real-valued function. It is one example of a root-finding algorithm, $$ x:f(x) = 0 $$. The Newton–Raphson method in one variable is implemented as follows:

The method starts with a function $$ f $$ defined over the real numbers $$ x $$, the function's derivative, and an initial guess $$ x_0 $$ for a root of the function $$ f $$. If the function satisfies the assumptions made in the derivation of the formula and the initial guess is close, then a better approximation $$ x_1 $$ is $$ x_1 = x_0 - \frac{f(x_0)}{f'(x_0)} $$.

Geometrically, $$ (x_1, 0) $$ is the intersection of the $$ x $$-axis and the tangent of the graph of $$ f $$ at $$ (x_0, f(x_0)) $$. The process is repeated as $$ x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)} $$ until a sufficiently accurate value is reached.

The idea of the method is as follows: one starts with an initial guess which is reasonably close to the true root, then the function is approximated by its tangent line (which can be computed using the tools of calculus), and one computes the $$ x $$-intercept of this tangent line (which is easily done with elementary algebra). This $$ x $$-intercept will typically be a better approximation to the function's root than the original guess, and the method can be iterated.

# Results

Now, let's guess some roots.

{% highlight python %}
if __name__ == '__main__':
    # Run test - guessed roots
    x0s = [-1, 0, 0.5, 2]
    for x0 in x0s:
        newtons_method(df, x0, 1e-10, True)
{% endhighlight python %}

Results:

{% highlight bash %}
Root is at: -0.7953336454431276
f(x) at root is: 2.220446049250313e-16
Root is at: 0
f(x) at root is: 0.0
Root is at: 0.6286669787778999
f(x) at root is: -1.8043344596208044e-12
Root is at: 1.0000000000002292
f(x) at root is: 9.166001291305292e-13
{% endhighlight bash %}

Comparing our results with our graph, visually and computationally, our roots are at -0.7953336454431276, 0, 0.6286669787778999 and 1.0000000000002292.
