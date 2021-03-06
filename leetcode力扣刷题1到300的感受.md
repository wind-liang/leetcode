# 回顾

自己也不是 `ACMer`，在大一暑假的时候学校组织过 `ACM` 集训，但无奈自己当时底子太差，连栈、队列这些基础的数据结构也不懂，觉得刷这些题很无聊，然后就不了了之了。如果你是大一，接触到了 `ACM` ，可以多试试，如果 `ACM` 拿些奖，找工作基本上是没问题了。

后来有了些编程的基础后，才慢慢体会到刷题的乐趣。第一道题是 `18` 年 `7` 月本科毕业那个暑假总结的，当时写在 [windliang.wang](https://windliang.wang/) 这个博客上。

![](https://windliangblog.oss-cn-beijing.aliyuncs.com/300leetcode1.jpg)

期间边刷题边熟悉一些常用的技巧， `HashMap`、二进制操作、回溯法、分治法、`memoization` 、动态规划等等，逐渐有了刷题的感觉，渐渐的也爱上了刷题。差不多过了一年，有了这篇 [leetcode 100 斩！回顾](https://zhuanlan.zhihu.com/p/73146252)。

在博客总结了几道题以后，为了防止博客文章的刷屏，也为了更好的翻阅题目，自己通过 `gitbook` 这个框架重新整理了题解，使用了自己的二级域名 [leetcode.windliang.cc](http://leetcode.windliang.cc/)，再后来为了方便统计等功能，买了新域名 [leetcode.wang](https://leetcode.wang/)。前段时间因为 `github` 的 `pages` 服务在国内不稳定，将博客迁移到了阿里云上，详细过程可以参考 [这里](https://zhuanlan.zhihu.com/p/108720935)。最终的博客就是下边的样子了。

![](https://windliangblog.oss-cn-beijing.aliyuncs.com/300leetcode2.jpg)



现在差不多快两年了，从本科毕业到了研究生毕业，顺序刷到了 `300` 题，当然其中的付费题和 `SQL` 的题跳过了。每道题先自己写，写完以后会逛 `discuss` 区的第一页，学习别人的思路，然后再自己写一遍代码，最后按照自己的理解进行了详细的总结，这种刷题速度虽然慢，但我觉得有下边的好处。

# 总结的好处

第一个就是总结一遍会加深自己的印象，当用到一个之前用过的思路，结合一些关键词很快就能找到之前是哪道题，然后可以再比对这些题的异同点。同样，也可以方便自己以后的查找，更快的想起当时的思路。

第二个的话，可以对不同的算法之间的联系有更深的体会，从递归，到递归加 `memoization`，再到动态规划，最后进行动态规划空间复杂度的优化，用到的分治、回溯、动态规划会发现它们本质上其实是一样的，现在都对 [115 题](https://leetcode.wang/leetcode-115-Distinct-Subsequences.html) 印象深刻。

一些常见的问题也会帮助自己查漏补缺，比如二叉树的中序遍历，在 [94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html) 我才知道原来还有 `Morris Traversal`，可以使得中序遍历的空间复杂度降为 `O(1)`。还有一些大神们的解法，印象最深刻的就属 [第 5 题](https://leetcode.wang/leetCode-5-Longest-Palindromic-Substring.html) 的马拉车算法了。

第三个的话，因为你想让别人明白你的想法，你会不停的去思考自己的解法，力求每一步都是清晰的，有时候虽然已经是 `AC` 的解法，总结着总结着会发现自己的思路其实是错的，只是 `LeetCode` 的 `test cases` 没有覆盖而已。

第四个的话，就是可以和别人交流，在交流过程中你又会加深一些算法的理解。比如常见的二分，印象最深的就是和 [@为爱卖小菜](https://leetcode-cn.com/u/wei-ai-mai-xiao-cai/) 讨论的一个问题，「在二分查找的时候， `while` 里面的 `low` 和 `high` 的关系，为什么有时候取等号有时候又不取等号」，当时两个人为了这个问题讨论了好久。这个问题看起来好像没什么，但当你真正去思考的话，一定会收获良多。

另外，别人也会指出你解法的问题，和第三点一样，有时候 `AC` 了，但依旧可能存在问题。当然也有可能是 `LeetCode` 改了函数，所以之前的代码无法通过了。

第五个的话，就是成就感了，来源于两处。一个的话就是自己绞尽脑汁，几个小时甚至几天后彻底理解一个解法的那一刻，另一个就是很多人去称赞你、感谢你的时候。在力扣中国站自己的多篇文章都被标为了精选题解，最开始发的 [第 5 题](https://leetcode-cn.com/problems/longest-palindromic-substring/solution/xiang-xi-tong-su-de-si-lu-fen-xi-duo-jie-fa-bao-gu/) 竟然已经有 `132k` 的浏览量了。

![](https://windliangblog.oss-cn-beijing.aliyuncs.com/300leetcode3.jpg)

目前 [github](https://github.com/wind-liang/leetcode) 也有 `1.1k` 的 `stars`，知乎专栏 [LeetCode刷题](https://zhuanlan.zhihu.com/leetcode1024) 也有 `1.5k+ ` 的关注量。之前刷到两百题的时候发到曹大的星球还被曹大赞赏加精选，当时太激动了。曹大的公众号是「caoz的梦呓」，自己的偶像之一，大家可以关注一下。

这些正激励会让自己更有动力坚持下去。

# 开始刷题的疑惑

## 什么样的基础才能刷题？

对于前 `90` 题的话，只需要了解一门语言，知道变量定义、判断语句，循环语句，定义函数，递归。了解基本的数据结构，顺序表、链表、栈、队列、哈希表，就可以开始刷题了。

到了 `94` 题出现了二叉树，需要知道深度优先遍历、广度优先遍历。后边个别题也会用到图，但不多。

期间很多题目也涉及到很多二进制的操作，也需要一些补码的知识，可以参考我之前总结的 [趣谈计算机补码](https://zhuanlan.zhihu.com/p/67227136)。

期间也会遇到很多自己之前不了解的数据结构，比如优先队列，`TreeMap`、线段树、并查集、前缀树等等，这些的话也不用急于了解，遇到的话再开始学习也不迟。

前  `300` 题的话，大致有三种类型。第一种只需要理解题目，然后模拟题目的过程就可以求解。第二种的话，可以用一些通用的思想求解，分治法、回溯法、动态规划等，贪心用的比较少。第三种的话，会涉及到一些数学的公式，能大大提高算法的性能，但如果之前不知道的话一般情况下是想不到的。

## 按照什么顺序刷题？

如果刚接触编程，可以按照题目难度来，先多刷一些 `easy` 难度的，熟悉一下刷题的流程。也有人是通过专题刷的，比如动态规划专题，所有的题目都可以通过动态规划来解决。我觉得这样不是很好，因为这样的话失去了一个自己分析题目、选取方法的过程，遇到新题有时候还是不知道该怎么下手。

所以如果时间充足的话，可以随机刷题，或者像我一样顺序刷，这样对一些常用的思路会慢慢加深然后固化。

## 选哪门语言刷？

不用纠结，不用纠结，不用纠结，随便一门都可以。之前的  [leetcode 100 斩！回顾](https://zhuanlan.zhihu.com/p/73146252) 这里也就讲过。

要想清楚语言和算法之间的关系。

算法就像是从家里到超市该怎么走？出门左拐，直走后右拐....起着指导性的作用。

语言是我们选择的交通工具，骑车？步行？开车？平衡车？每种交通工具都有自己的优点和缺点，语言也是如此。

好的算法可能更像是，我们偶然发现了一条近路，降低了我们的时间复杂度或者是空间复杂度。

所以其实并不需要纠结，选择自己熟悉的一门语言即可。更多关于语言之间的关系可以参考 [到底学哪一门编程语言](https://zhuanlan.zhihu.com/p/90440843)。

我选 `java` 的主要原因是，`java` 属于强类型语言，这样写出来的解法会更易读些。如果有其他语言的基础，`java` 基本不用学也能读懂个大概。

## 刷题和算法岗有关系吗？

据我了解没啥关系，算法岗的话目前主要指的是深度学习，而刷题锻炼的是一种基础能力。可以增强你的逻辑能力和动手能力，当有一个想法的时候，可以快速通过编程实现的一种能力。

还有就是一些基础的数据结构和算法也必须是了解的，二叉树、图、广度优先遍历、深度优先遍历等等，在工程实践中会看到它们的影子。

## 只刷题能找到工作吗？

在美国可能可以，在国内的话有点儿难。国内除了基本的刷题，还需要了解自己岗位（前端、后端、算法等）的相关知识，可以牛客网看看面经了解个大概，还有就是有一些自己做过的项目，面试官会从你做的项目中问一些相关知识点。

## 总结花费的时间

拿我个人来说，花费的时间取决于题目的难度。如果比较简单，`1` 到 `2` 个小时就可以完成一篇总结。如果遇到解法比较多的题目，有时候可能要花费七八个小时了，第一天把所有的解法理通，第二天把解法总结下来。

# 未来的计划

刷题总结已经快两年了，以后还会继续下去，但更新频率会降低了。

一方面自己马上毕业要进入工作了，供自己支配的时间会变少，总结确实需要花费不少时间，有的题目一篇文章下来甚至需要七八个小时，未来更多的精力会放在前端领域上。

另一方面，就是刷题带来的新鲜感没有前 `100` 题的时候那么频繁了，只会偶尔碰到几个新的思路，大部分的思路、技巧在之前的题目已经见过了。

之前都是用 `java` 写的代码，未来会改成 `JavaScript` 了，因为我的工作是前端，想不到吧，哈哈，好多人知道后都发出了疑问，之前也总结过一篇原因，参考 [面完腾讯阿里后对人生的思考](https://zhuanlan.zhihu.com/p/99181212)。`js` 会尽量多用 `ES6` 的语法，之前确实用的比较少。

另外，大家有问题的话可以和我一起探讨，最好是我总结过的题目，不然新题我可能也不会，哈哈。希望是那种你已经经过各种调试，网上各种搜寻还是解决不了的问题，这样一起讨论的话才更有意义些。不然的话，可能只是我帮你调试、谷歌，仅仅锻炼了我的能力。

刷题博客地址是 [leetcode.wang](https://leetcode.wang/)，知乎专栏是 [LeetCode刷题](https://zhuanlan.zhihu.com/leetcode1024)，欢迎 `star`、关注，哈哈。

最后，越努力，越幸运，共勉。