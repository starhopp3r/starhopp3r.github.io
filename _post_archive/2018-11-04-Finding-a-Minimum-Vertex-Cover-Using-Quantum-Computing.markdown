---
layout: post
title:  "Finding a Minimum Vertex Cover Using Quantum Computing"
description: "Using a quantum computer isn't that hard"
date:   2018-11-04 17:14:55 +0800
categories: Quantum Computing
---

A vertex cover is a set of vertices such that each edge of the graph is incident with at least one vertex in the set.  A minimum vertex cover is the vertex cover of the smallest size. In graph theory; two vertices are adjacent if they are connected by an edge and incident if they share a vertex.

We describe the process of solving problems on the quantum computer in two steps:

- Formulate the problem as a binary quadratic model (BQM).
- Solve the BQM with a D-wave system or classical sampler. 

A binary quadratic model is a collection of binary-valued variables (variables that can be assigned two values, for example -1, 1) with associated linear and quadratic biases. Sometimes referred to in other tools as a problem. In this example, a function in Ocean software handles both steps. Our task is mainly to select the sampler used to solve the problem.

We will be using a D-Wave System to find the minimum vertex cover of a star graph. The real-world application for this example might be a network provider’s routers interconnected by fiber-optic cables or traffic lights in a city’s intersections. It is posed as a graph problem; here, the five-node star graph shown below. Intuitively, the solution to this small example is obvious — the minimum set of vertices that touch all edges is node 0, but the general problem of finding such a set is NP-hard.


First, we run the code snippet below to create a star graph where node 0 is hub to four other nodes. The code uses `NetworkX`, which is part of your `dwave_networkx` or `dwave-ocean-sdk` installation.

{% highlight python %}
import networkx as nx
s5 = nx.star_graph(4)
{% endhighlight python %}
# Solve the Problem by Sampling

For small numbers of variables, even your computer’s CPU can solve minimum vertex covers quickly. In this example, we'll be solving the problem both classically on our CPU and on the quantum computer.

# Solving Classically on a CPU

Before using the D-Wave system, it can sometimes be helpful to test code locally. Here we select one of Ocean software’s test samplers to solve classically on a CPU. Ocean’s `dimod` provides a sampler that simply returns the BQM’s value for every possible assignment of variable values.

{% highlight python %}
from dimod.reference.samplers import ExactSolver
sampler = ExactSolver()
{% endhighlight python %}

The next code lines use Ocean’s `dwave_networkx` to produce a BQM for our `s5` graph and solve it on our selected sampler. In other examples the BQM is explicitly created but the Ocean tool used here abstracts the BQM: given the problem graph it returns a solution to a BQM it creates internally.

{% highlight python %}
import dwave_networkx as dnx
print(dnx.min_vertex_cover(s5, sampler))
{% endhighlight python %}

The solution to the BQM would be `[0]`.

# Solving on a D-Wave System

We now use a sampler from Ocean software’s `dwave-system` to solve on a D-Wave system. In addition to `DWaveSampler()`, we use `EmbeddingComposite()`, which maps unstructured problems to the graph structure of the selected sampler, a process known as minor-embedding: our problem star graph must be mapped to the QPU’s numerically indexed qubits. Note: you can learn more about setting up a default solver and checking for available solvers in my [previous blog post](https://nikhilr.io/quantum/computing/2018/11/01/Getting-Started-with-D-Wave-Leap.html).

{% highlight python %}
from dwave.system.samplers import DWaveSampler
from dwave.system.composites import EmbeddingComposite

sampler = EmbeddingComposite(DWaveSampler(endpoint='https://URL_to_my_D-Wave_system/', token='ABC-123456789012345678901234567890', solver='My_D-Wave_Solver'))
print(dnx.min_vertex_cover(s5, sampler))
{% endhighlight python %}

The solution to the BQM would be `[0]`. Congratulations! You’ve learned to use a quantum computer!

# TL;DR

Just give me the code!

{% highlight python %}
import networkx as nx
import dwave_networkx as dnx
from dwave.system.samplers import DWaveSampler
from dimod.reference.samplers import ExactSolver
from dwave.system.composites import EmbeddingComposite

ENDPOINT = 'https://URL_to_my_D-Wave_system/'
TOKEN = 'ABC-123456789012345678901234567890'
SOLVER = 'My_D-Wave_Solver'

s5 = nx.star_graph(4)
sampler = ExactSolver()
print("Solving classically on CPU: {}".format(dnx.min_vertex_cover(s5, sampler)))
sampler = EmbeddingComposite(DWaveSampler(endpoint=ENDPOINT, token=TOKEN, solver=SOLVER))
print("Solving on QPU: {}".format(dnx.min_vertex_cover(s5, sampler)))
{% endhighlight python %}

You can find the `ENDPOINT` URL and the API `TOKEN` when you log in to your D-Wave account. You can check for available `SOLVER`s using the `dwave solvers` command.