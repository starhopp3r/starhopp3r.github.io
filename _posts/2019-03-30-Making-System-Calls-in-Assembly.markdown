---
layout: post
title:  "Making System Calls in Assembly"
description: "Create a directory using Assembly and syscalls"
date:   2019-03-30 10:27:55 +0800
categories: Operating Systems
---

I was about to go to bed last night, and my brain started to behave like an overclocked Core i9 CPU (relax, it's normal for my brain to do that at night time). I recalled that system calls are made by allocating specific values to a set of registers and then invoking the `syscall` instruction. I've coded an x86 bootloader in NASM before and thought it would be easy to make syscalls in assembly, so I decided to give it a try, "not tonight, I'll do it tomorrow", I said to myself and went to sleep. I woke up, turned on my Mac, booted my Ubuntu VM and looked up the Linux system call table for the x86-64 instruction set. I decided to make a `mkdir` system call in assembly because you can see the effect of the syscall in real time, and also because it's fun to just `mov` some values and create a directory.

# How It Works

Before we start coding, it's helpful to look up the man page for the `mkdir` system call.

{% assign imgs = "../../assets/images/mkdirman.png," | split: ',' %}
{% include image.html images=imgs maxwidth="100%" caption="Man page for the mkdir system call." %}<br class="img">

The man page says the argument `mode` specifies the `mode` for the new directory. "What is mode?", you may ask, it's the base permission of the directory that we will be creating. The effective permisson of the new directory will be determined by the `mode` number and the process's `umask` number. The default `umask` number is `22` (octal) and the default mode of a directory with an effective permission `drwxr-xr-x` (default permission of a directory created when `mkdir` is called) will be `777` (octal). The other obvious argument that we're interested in is the `pathname`.

# What We Need to Do

To create a directory using the `mkdir` syscall we need to:

- Set the `umask` number to `22` (octal).
- Specify the `pathname` for our directory.
- Set the directory `mode` number to `777` (octal).
- Exit.

I've already mentioned we need to `mov` some values to a specific set of registers before we can make a syscall. I've made a small table that you can refer to and code the assembly instructions required to make a syscall in assembly.

| `%rax` | System Call |         `%rdi`         |   `%rsi`   |
|:------:|:-----------:|:----------------------:|:----------:|
|  `60`  |  `sys_exit` |    `int error_code`    |            |
|  `95`  | `sys_umask` |       `int mask`       |            |
|  `83`  | `sys_mkdir` | `const char *pathname` | `int mode` |

To set the `umask` number, we need to `mov` the value `95` to the `rax` register and `mov` the `mask` number `22` to the `rdi` register before invoking the `syscall` instruction.

{% highlight nasm %}
	  global  _start

	  section .text
_start:   mov	  rax, 95	; system call for umask
	  mov	  rdi, 0q22	; set umask (octal)
	  syscall		; invoke the operating system
{% endhighlight nasm %}

Now that we have set the `umask` number to `22` (octal), let's make our `mkdir` syscall. We need to `mov` the value `83` to the `rax` register and `mov` the address of the pathname to the `rdi` register. Finally, we set the `mode` number by `mov`ing `777` (octal) to the `rsi` register.

{% highlight nasm %}
	  mov	  rax, 83	; system call for mkdir
	  mov	  rdi, pathname	; pathname for directory
	  mov	  rsi, 0q777	; set mkdir mode (octal)
	  syscall		; invoke operating system
{% endhighlight nasm %}

Now, let's write some instructions to exit the process and define our `pathname` in the `data` section.

{% highlight nasm %}
	  mov	  rax, 60	; system call for exit
	  mov	  rdi, 0	; exit code 0
	  syscall		; invoke operating system

	  section .data
pathname: db      "testdir"
{% endhighlight nasm %}

The complete program should look this:

{% highlight nasm %}
	  global  _start

	  section .text
_start:   mov	  rax, 95	; system call for umask
	  mov	  rdi, 0q22	; set umask (octal)
	  syscall		; invoke the operating system
	  mov	  rax, 83	; system call for mkdir
	  mov	  rdi, pathname	; pathname for directory
	  mov	  rsi, 0q777	; set mkdir mode (octal)
	  syscall		; invoke operating system
	  mov	  rax, 60	; system call for exit
	  mov	  rdi, 0	; exit code 0
	  syscall		; invoke operating system

	  section .data
pathname: db      "testdir"
{% endhighlight nasm %}

# Testing

Now, let's see if our program works as intended. Let's compile the program and run it.

{% highlight bash %}
nasm -f elf64 mkdir.asm && ld mkdir.o -o ./mkdir && ./mkdir
{% endhighlight bash %}

Now, when we issue the `ls -alh` command we should see a directory named `testdir` with the file permission: `drwxr-xr-x`.

{% highlight bash %}
$ ls -alh
total 24K
drwxr-xr-x 3 nikhil nikhil 4.0K Mar 30 16:02 .
drwxr-xr-x 3 nikhil nikhil 4.0K Mar 30 13:11 ..
-rwxr-xr-x 1 nikhil nikhil  920 Mar 30 16:02 mkdir
-rw-r--r-- 1 nikhil nikhil  491 Mar 30 14:49 mkdir.asm
-rw-r--r-- 1 nikhil nikhil  848 Mar 30 16:02 mkdir.o
drwxr-xr-x 2 nikhil nikhil 4.0K Mar 30 16:02 testdir
{% endhighlight bash %}

It works! If you want to write more assembly code to make some interesting syscalls, lookup the table found on this [webpage](http://blog.rchapman.org/posts/Linux_System_Call_Table_for_x86_64/). Have fun!