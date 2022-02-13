---
title: git从入门到放弃
date: 2021-06-06 23:27:33
tags: 
      - 学习
categories: 需求学习
---

## 1、Git简介

> Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。
>
> Git 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。
>
> Git 与常用的版本控制工具 CVS, Subversion 等不同，它采用了分布式版本库的方式，不必服务器端软件支持。

### 1-1、Git 与 SVN 区别

Git 不仅仅是个版本控制系统，它也是个内容管理系统(CMS)，工作管理系统等。

如果你是一个具有使用 SVN 背景的人，你需要做一定的思想转换，来适应 Git 提供的一些概念和特征。

​	**Git 与 SVN 区别点：**

+ **1、Git 是分布式的，SVN 不是**：这是 Git 和其它非分布式的版本控制系统，例如 SVN，CVS 等，最核心的区别。
+ **2、Git 把内容按元数据方式存储，而 SVN 是按文件：**所有的资源控制系统都是把文件的元信息隐藏在一个类似 .svn、.cvs 等的文件夹里。
+ **3、Git 分支和 SVN 的分支不同：**分支在 SVN 中一点都不特别，其实它就是版本库中的另外一个目录。
+ **4、Git 没有一个全局的版本号，而 SVN 有：**目前为止这是跟 SVN 相比 Git 缺少的最大的一个特征。
+ **5、Git 的内容完整性要优于 SVN：**Git 的内容存储使用的是 SHA-1 哈希算法。这能确保代码内容的完整性，确保在遇到磁盘故障和网络问题时降低对版本库的破坏。

![img](https://www.runoob.com/wp-content/uploads/2015/02/0D32F290-80B0-4EA4-9836-CA58E22569B3.jpg)

## 2、Git命令初步认识

`Git 是程序员学习和工作都离不开发工具，也是非程序员好用的文档版本管理工具。`

### 2-1、基本用法

![img](https://marklodato.github.io/visual-git-guide/basic-usage.svg)

上面的四条命令在工作目录、暂存目录(也叫做索引)和仓库之间复制文件。

+ git add files 把当前文件放入暂存区域。
+ git commit 给暂存区域生成快照并提交。
+ git reset -- files 用来撤销最后一次git add files，你也可以用git reset 撤销所有暂存区域文件。
+ git checkout -- files 把文件从暂存区域复制到工作目录，用来丢弃本地修改。

你可以用 git reset -p, git checkout -p, or git add -p进入交互模式。

也可以跳过暂存区域直接从仓库取出文件或者直接提交代码。



![img](https://marklodato.github.io/visual-git-guide/basic-usage-2.svg)

+ git commit -a 相当于运行 git add 把所有当前目录下的文件加入暂存区域再运行。git commit.
+ git commit files 进行一次包含最后一次提交加上工作目录中文件快照的提交。并且文件被添加到暂存区域。
+ git checkout HEAD -- files 回滚到复制最后一次提交。

### 2-2、约定

**后文中以下面的形式使用图片。**

![img](https://marklodato.github.io/visual-git-guide/conventions.svg)

> 绿色的5位字符表示提交的ID，分别指向父节点。分支用橘色显示，分别指向特定的提交。当前分支由附在其上的*HEAD*标识。 这张图片里显示最后5次提交，*ed489*是最新提交。 *main*分支指向此次提交，另一个*stable*分支指向祖父提交节点。



## 3、Git命令详解

### 3-1、Diff

有许多种方法查看两次提交之间的变动。下面是一些示例。

![img](https://marklodato.github.io/visual-git-guide/diff.svg)

### 3-2、Commit

提交时，git用暂存区域的文件创建一个新的提交，并把此时的节点设为父节点。然后把当前分支指向新的提交节点。下图中，当前分支是*main*。 在运行命令之前，*main*指向*ed489*，提交后，*main*指向新的节点*f0cec*并以*ed489*作为父节点。

![img](https://marklodato.github.io/visual-git-guide/commit-main.svg)

即便当前分支是某次提交的祖父节点，git会同样操作。下图中，在main分支的祖父节点stable分支进行一次提交，生成了1800b。这样，stable分支就不再是main分支的祖父节点。此时，**合并** (或者 **衍合**) 是必须的。

![img](https://marklodato.github.io/visual-git-guide/commit-stable.svg)

如果想更改一次提交，使用 `git commit --amend`。git会使用与当前提交相同的父节点进行一次新提交，旧的提交会被取消。

![img](https://marklodato.github.io/visual-git-guide/commit-amend.svg)

另一个例子是分离HEAD提交,后文讲。

### 3-3、Checkout

checkout命令用于从历史提交（或者暂存区域）中拷贝文件到工作目录，也可用于切换分支。



> 当给定某个文件名（或者打开-p选项，或者文件名和-p选项同时打开）时，git会从指定的提交中拷贝文件到暂存区域和工作目录。比如，git checkout HEAD~ foo.c会将提交节点HEAD~(即当前提交节点的父节点)中的foo.c复制到工作目录并且加到暂存区域中。（如果命令中没有指定提交节点，则会从暂存区域中拷贝内容。）注意当前分支不会发生变化。

![img](https://marklodato.github.io/visual-git-guide/checkout-files.svg)

当不指定文件名，而是给出一个（本地）分支时，那么*HEAD*标识会移动到那个分支（也就是说，我们“切换”到那个分支了），然后暂存区域和工作目录中的内容会和*HEAD*对应的提交节点一致。新提交节点（下图中的a47c3）中的所有文件都会被复制（到暂存区域和工作目录中）；只存在于老的提交节点（ed489）中的文件会被删除；不属于上述两者的文件会被忽略，不受影响。

![img](https://marklodato.github.io/visual-git-guide/checkout-branch.svg)

如果既没有指定文件名，也没有指定分支名，而是一个标签、远程分支、SHA-1值或者是像main~3类似的东西，就得到一个匿名分支，称作detached HEAD（被分离的HEAD标识）。这样可以很方便地在历史版本之间互相切换。比如说你想要编译1.6.6.1版本的git，你可以运行git checkout v1.6.6.1（这是一个标签，而非分支名），编译，安装，然后切换回另一个分支，比如说git checkout main。然而，当提交操作涉及到“分离的HEAD”时，其行为会略有不同，详情见在下面。

![img](https://marklodato.github.io/visual-git-guide/checkout-detached.svg)

### 3-4、HEAD标识处于分离状态时的提交操作

当*HEAD*处于分离状态（不依附于任一分支）时，提交操作可以正常进行，但是不会更新任何已命名的分支。(你可以认为这是在更新一个匿名分支。)

![img](https://marklodato.github.io/visual-git-guide/commit-detached.svg)

一旦此后你切换到别的分支，比如说*main*，那么这个提交节点（可能）再也不会被引用到，然后就会被丢弃掉了。注意这个命令之后就不会有东西引用*2eecb*。

![img](https://marklodato.github.io/visual-git-guide/checkout-after-detached.svg)

但是，如果你想保存这个状态，可以用命令`git checkout -b *name*`来创建一个新的分支。

![img](https://marklodato.github.io/visual-git-guide/checkout-b-detached.svg)



### 3-5、Reset

reset命令把当前分支指向另一个位置，并且有选择的变动工作目录和索引。也用来在从历史仓库中复制文件到索引，而不动工作目录。

如果不给选项，那么当前分支指向到那个提交。如果用`--hard`选项，那么工作目录也更新，如果用`--soft`选项，那么都不变。

![img](https://marklodato.github.io/visual-git-guide/reset-commit.svg)

如果没有给出提交点的版本号，那么默认用*HEAD*。这样，分支指向不变，但是索引会回滚到最后一次提交，如果用`--hard`选项，工作目录也同样。

![img](https://marklodato.github.io/visual-git-guide/reset.svg)

如果给了文件名(或者 `-p`选项), 那么工作效果和带文件名的**checkout**差不多，除了索引被更新。

![img](https://marklodato.github.io/visual-git-guide/reset-files.svg)

### 3-6、Merge

merge 命令把不同分支合并起来。合并前，索引必须和当前提交相同。如果另一个分支是当前提交的祖父节点，那么合并命令将什么也不做。 另一种情况是如果当前提交是另一个分支的祖父节点，就导致*fast-forward*合并。指向只是简单的移动，并生成一个新的提交。

![img](https://marklodato.github.io/visual-git-guide/merge-ff.svg)

否则就是一次真正的合并。默认把当前提交(*ed489* 如下所示)和另一个提交(*33104*)以及他们的共同祖父节点(*b325c*)进行一次**三方合并**。结果是先保存当前目录和索引，然后和父节点*33104*一起做一次新提交。

![img](https://marklodato.github.io/visual-git-guide/merge.svg)

### 3-7、Cherry Pick

cherry-pick命令"复制"一个提交节点并在当前分支做一次完全一样的新提交。

![img](https://marklodato.github.io/visual-git-guide/cherry-pick.svg)

**cherry-pick方法详解可以看看阮一峰老师的博客**

[git cherry-pick 教程](http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html)

### 3-8、Rebase

衍合是合并命令的另一种选择。合并把两个父分支合并进行一次提交，提交历史不是线性的。衍合在当前分支上重演另一个分支的历史，提交历史是线性的。本质上，这是线性化的自动的 cherry-pick

![img](https://marklodato.github.io/visual-git-guide/rebase.svg)

上面的命令都在*topic*分支中进行，而不是*main*分支，在*main*分支上重演，并且把分支指向新的节点。注意旧提交没有被引用，将被回收。

要限制回滚范围，使用`--onto`选项。下面的命令在*main*分支上重演当前分支从*169a6*以来的最近几个提交，即*2c33a*。

![img](https://marklodato.github.io/visual-git-guide/rebase-onto.svg)

## 4、技术说明

> 文件内容并没有真正存储在索引(.git/index)或者提交对象中，而是以blob的形式分别存储在数据库中(.git/objects)，并用SHA-1值来校验。索引文件用识别码列出相关的blob文件以及别的数据。对于提交来说，以树(tree)的形式存储，同样用对于的哈希值识别。树对应着工作目录中的文件夹，树中包含的 树或者blob对象对应着相应的子目录和文件。每次提交都存储下它的上一级树的识别码。

**如果用detached HEAD提交，那么最后一次提交会被the reflog for HEAD引用。但是过一段时间就失效，最终被回收，与git commit --amend或者git rebase很像。**





参考：

[从原理上搞懂Git，就靠它了](https://mp.weixin.qq.com/s/DRCeDhYiwQQToKukk4RM4g)

