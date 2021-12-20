---
layout: post
title:  "Getting Started with D-Wave Leap"
description: "A giant leap for quantum computing"
date:   2018-11-01 17:38:55 +0800
categories: Quantum Computing
---

I recently got access to the D‑Wave Leap™ Quantum Application Environment (QAE). Leap is the first cloud-based QAE providing real-time access to a live quantum computer. The QAE features 2038 qubits and has a typical operating qubit temperature of 14.5±1 mK. D-Wave allows developers to develop software that will run on the D-Wave system using their D-Wave Ocean SDK for Python. D-Wave recommends that we work in a virtual environment when developing software to run on the QAE.

{% assign imgs = "../../assets/images/dwaveqpu.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="D-Wave System's quantum computer." %}<br class="img">

Before we can start coding and submitting our jobs to D-Wave's systems, we need to install and configure D-Wave's Ocean tools. Ocean tools allow us to run our jobs on a D-Wave system (Quantum Processing Unit) or locally (Central Processing Unit/Graphical Processing Unit).

The following operating systems support Ocean software:

- Linux
- Windows (tested on 64-bit Windows 8, 10)
- Mac (tested on macOS 10.13)

Ocean software requires a Python environment. Supported Python versions are:

- 2.7.x
- 3.5 and higher

For reference: I'm using a MacBook Pro running macOS 10.14 and Python 3.6.5.

# Installing the Ocean SDK 

To install and use Ocean, ensure you have the virtualenv tool for creating isolated Python environments on your local machine. For Unix-based systems, installing virtualenv is typically done with the following command:

{% highlight bash %}
sudo pip install virtualenv
{% endhighlight bash %}

Create a virtual environment for your Ocean work. On Unix systems you might do:

{% highlight bash %}
virtualenv ocean
source ocean/bin/activate
{% endhighlight bash %}

On Windows operating system, activating a virtual environment might be done with the `Scripts\activate` command instead. Your machine is now ready to install Ocean software.

The simplest way to start is to install `dwave-ocean-sdk` for the full suite of Ocean tools. We can use pip to install the SDK inside our newly created virtual environment.

{% highlight bash %}
pip install dwave-ocean-sdk
{% endhighlight bash %}

Alternatively, you can clone the `dwave-ocean-sdk` repo and install the SDK to your virtual environment.

{% highlight bash %}
git clone https://github.com/dwavesystems/dwave-ocean-sdk.git
cd dwave-ocean-sdk
python setup.py install
{% endhighlight bash %}

Ocean requires that you configure a solver on your system, which might be a D-Wave system or a classical sampler that runs on your local CPU. We'll configure our system to solve problems on a D-Wave system instead of our local CPU/GPU.

# Using a D-Wave System

To use a D-Wave system as our solver (the compute resource for solving problems), we access it through the D-Wave Solver API (SAPI). SAPI is an application layer built to provide resource discovery, permissions, and scheduling for quantum annealing resources at D-Wave. The requisite information for problem submission through SAPI includes:

1. API endpoint URL - A URL to the remote D-Wave system.
2. API Token - An authentication token the D-Wave system uses to authenticate the client session.
3. Solver - Name of the D-Wave resource to be used to solve your submitted problems.

You can find all the above information when you log in to your [D-Wave account](https://cloud.dwavesys.com/leap/login/?next=/leap/).

You save your SAPI configuration (URL, API token, etc) in a D-Wave Cloud Client configuration file that Ocean tools use unless overridden explicitly or with environment variables. Your configuration file can include one or more solvers.

# Configuring a D-Wave System as a Solver

To configure a D-Wave system as our solver, we use the `dwave-cloud-client` interactive CLI, which is installed as part of the `dwave-ocean-sdk` (or D-Wave Cloud Client tool installation). 

In the virtual environment you created as part of Installing Ocean Tools, run the `dwave config create` command (the output shown below includes the interactive prompts and placeholder replies).

{% highlight bash %}
$ dwave config create
Configuration file not found; the default location is: C:\\Users\\jane\\AppData\\Local\\dwavesystem\\dwave\\dwave.conf
Confirm configuration file path (editable):
Profile (create new): prod
API endpoint URL (editable): https://my.dwavesys.url/
Authentication token (editable): ABC-1234567890abcdef1234567890abcdef
Client class (qpu or sw): qpu
Solver (can be left blank): My_DWAVE_2000Q
Proxy URL (can be left blank):
Configuration saved.
{% endhighlight bash %}

Enter the SAPI information (API URL and token) found when you log in to your D-Wave account. You can accept the command’s defaults and in the future update the file if needed. Alternatively, you can create and edit a D-Wave Cloud Client configuration file manually or set the solver, API token, and URL directly in your code or as local environment variables. For more information, see the examples in this document or D-Wave Cloud Client.

# Verifying Your Solver Configuration

You can test that your solver is configured correctly and that you have access to a D-Wave solver with the same `dwave-cloud-client` interactive CLI installed as part of the SDK or D-Wave Cloud Client tool installation.

In your virtual environment, run the `dwave ping` command.

{% highlight bash %}
dwave ping
{% endhighlight bash %}

The output of the command should look similar to that of the image below.

{% assign imgs = "../../assets/images/dwaveping.jpeg," | split: ',' %}
{% include image.html images=imgs maxwidth="100%"%}<br class="img">

We can run the `dwave sample --random-problem` command to submit a random problem to our configured solver. The output of the command should look similar to the one shown below.

{% highlight bash %}
$ dwave sample --random-problem
Using endpoint: https://cloud.dwavesys.com/sapi
Using solver: DW_2000Q_3
Using qubit biases: {0: -1.8558886426532077, 2: -0.5352020435131566, 3: 0.09948801477928448, 4: 1...
Using qubit couplings: {(1634, 1638): 0.8722361666411962, (587, 590): -0.2883665596049023, (642, ...
Number of samples: 1
Samples: [[1, 0, -1, 1, -1, 1, -1, 1, -1, 0, -1, -1, -1, 1, 1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -...
Occurrences: [1]
Energies: [-2807.4199485686436]
{% endhighlight bash %}

To list the available solvers, their parameters, and properties, we run the dwave solvers command. The output of the command should look similar to the one shown below.

{% highlight bash %}
$ dwave solvers
Solver: DW_2000Q_3
  Parameters:
    anneal_offsets: A list of anneal offsets for each working qubit (NaN if u...
    anneal_schedule: A piecewise linear annealing schedule specified by a list...
    annealing_time: A positive integer that sets the duration (in microsecond...
    <Output snipped for brevity>

  Properties:
    anneal_offset_ranges: [[-0.21442228377304282, 0.03367099924873558], [0.0, 0.0],...
    anneal_offset_step: 0.004634060789104103
    anneal_offset_step_phi0: 0.0002885524799966458
    <Output snipped for brevity>

Solver: DW_2000Q_2_1
  Parameters:
    anneal_offsets: A list of anneal offsets for each working qubit (NaN if u...
    anneal_schedule: A piecewise linear annealing schedule specified by a list...
    annealing_time: A positive integer that sets the duration (in microsecond...
    <Output snipped for brevity>

  Properties:
    anneal_offset_ranges: [[-0.18627387668142237, 0.09542224439071689], [-0.1836548...
    anneal_offset_step: 0.004266738445272551
    anneal_offset_step_phi0: 0.0002716801020270571
    <Output snipped for brevity>
{% endhighlight bash %}

Congratulations! You've learned to use a quantum computer (sort of)!