## 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/22.jpg)

给一个数字 n ，返回所有合法的括号匹配，刚好和[20题](https://leetcode.wang/leetCode-20-Valid%20Parentheses.html)相反。

自己没想出来，全部参考 LeetCode 给出的 [Solution](https://leetcode.com/problems/generate-parentheses/solution/)。

# 解法一 暴力破解

列举所有的情况，每一位有左括号和右括号两种情况，总共 2n 位，所以总共 $$2^{2n}$$ 种情况。

```java
public List<String> generateParenthesis(int n) {
    List<String> combinations = new ArrayList();
    generateAll(new char[2 * n], 0, combinations);
    return combinations;
}

public void generateAll(char[] current, int pos, List<String> result) {
    if (pos == current.length) {
        if (valid(current))
            result.add(new String(current));
    } else {
        current[pos] = '(';
        generateAll(current, pos+1, result);
        current[pos] = ')';
        generateAll(current, pos+1, result);
    }
}

public boolean valid(char[] current) {
    int balance = 0;
    for (char c: current) {
        if (c == '(') balance++;
        else balance--;
        if (balance < 0) return false;
    }
    return (balance == 0);
}
```

时间复杂度：对每种情况判断是否合法需要 O（n），所以时间复杂度是 $$O(2^{2n}n)$$ 。

空间复杂度：$$O(2^{2n}n)$$，乘以 n 是因为每个串的长度是 2n。此外这是假设所有情况都符合的时候，但其实不可能都符合，后边会给出更精确的情况。

# 解法二

解法一中，我们不停的加左括号，其实如果左括号超过 n 的时候，它肯定不是合法序列了。因为合法序列一定是 n 个左括号和 n 个右括号。

还有一种情况就是如果添加括号的过程中，如果右括号的总数量大于左括号的总数量了，后边不论再添加什么，它都不可能是合法序列了。因为每个右括号必须和之前的某个左括号匹配，如果右括号数量多于左括号，那么一定有一个右括号没有与之匹配的左括号，后边不论加多少左括号都没有用了。例如 n = 3 ，总共会有 6 个括号，我们加到 ( ) ) 3 个括号的情况的时候，有 1 个左括号，2 个右括号，此时后边 3 个括号无论是什么，已经注定它不会是合法序列了。

基于上边的两点，我们只要避免它们，就可以保证我们生成的括号一定是合法的了。

```java
public List<String> generateParenthesis(int n) {
    List<String> ans = new ArrayList();
    backtrack(ans, "", 0, 0, n);
    return ans;
}

public void backtrack(List<String> ans, String cur, int left, int right, int n){
    if (cur.length() == n * 2) {
        ans.add(cur);
        return;
    }
	//左括号不要超过 n
    if (left < n)
        backtrack(ans, cur+"(", left+1, right, n);
    //右括号不要超过左括号
    if (right < left)
        backtrack(ans, cur+")", left, right+1, n);
}
```

时间复杂度：

空间复杂度：

递归的复杂度分析，继续留坑 =.=。

# 解法三

解法二中是用列举的方法，仔细想想，我们每次用递归的时候，都是把大问题换成小问题然后去解决，这道题有没有这个思路呢？

我们想一下之前的列举过程，第 0 个位置一定会是左括号，然后接着添加左括号或右括号，过程中左括号数一定大于或等于右括号数，当第一次出现左括号数等于右括号数的时候，假如此时的位置是 c 。那么位置 1 到 c - 1 之间一定是合法序列，此外 c + 1 到最后的 2n -1 也是合法序列。而假设总共是 n 组括号，1 到 c - 1 是 a 组括号， c + 1 到 2n - 1 之间则是 n - 1 - a 组括号，如下图

![](https://windliang.oss-cn-beijing.aliyuncs.com/22_2.jpg)



最重要的是，每一个合法序列都会有这么一个数 c ，且唯一。所以我们如果要求 n 组括号的所有序列，只需要知道 a 组括号以及 ( n - a - 1) 组括号的所有序列，然后两两组合即可。

以 n = 3 为例，我们把 0 到 c 之间的括号数记为 a 组， c + 1 到最后的括号数记为 b 组，则

a = 0，b = 2 对应 （）（（））以及 （）（）（） 两种情况，此时 c = 1。

![](https://windliang.oss-cn-beijing.aliyuncs.com/22_3.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/22_4.jpg)

a = 1，b = 1，对应 （（））（（）） 一种情况，此时 c = 3。

![](https://windliang.oss-cn-beijing.aliyuncs.com/22_5.jpg)

a = 2，b = 0 对应 （（（）））， （（）（）） 两种情况，此时 c = 5。

![](https://windliang.oss-cn-beijing.aliyuncs.com/22_6.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/22_7.jpg)

所以我们如果要想求 n 组括号，只需要知道 a 组和 b 组的情况，然后组合起来就可以了。

看起来我们在迭代 a ，其实本质上是在迭代 c ，c = 2a + 1，迭代 a 从 0 到 n - 1 ，就是迭代 c 从 1 到 2n - 1。看起来 c 都是奇数，其实是可以理解的，因为 0 到 c 间都是一组组的括号， 所以 c 一定是奇数。为什么可以迭代 c ，因为上边说到每一个合法序列都对应着一个 c ，遍历 c 的话，就能得到所有的情况了，看一下代码吧。

```java
public List<String> generateParenthesis(int n) {
    List<String> ans = new ArrayList();
    if (n == 0) {
        ans.add("");
    } else {
        for (int a = 0; a < n; a++)
            for (String left: generateParenthesis(a))
                for (String right: generateParenthesis(n-1-a))
                    ans.add("(" + left + ")" + right);
    }
    return ans;
}
```

时间复杂度：

空间复杂度：

留坑。

# 扩展 卡塔兰数

如果这道题不是让你列举所有的情况， 而是仅仅让你输出 n 对应下有多少种合法序列，该怎么做呢？

答案就是 $$\frac{1}{n+1}C^n_{2n}$$，也可以写成$$\frac{1}{n+1}\binom{2n}{n}$$。怎么证明呢？我主要参考了[这里](http://lanqi.org/interests/10939/)，说一下。

我们假设不考虑是不是合法序列，那么就一共有$$C^n_{2n}$$种情况，然后我们只需要把里边的非法情况减去就可以了，一共有多少种非法情况呢？

首先我们用$$C^n_{2n}$$就保证了一定是有 n 个左括号，n 个右括号，那么为什么出现了非法序列？

为了方便论述，我们把左括号记为 +1，右括号记为 -1.

ps：下边的 和 都是指两个数的和，不是你和我中的和。

我们假设非法序列的**集合是 M** ，而非法序列就是列举过程中右括号数比左括号数多了，也就是和小于 0 了，变成 -1 了。这种情况一旦出现，后边无论是什么括号都改变不了它是非法序列的命了。我们将第一次和等于 -1 的时候的位置记为 d 。每一个非法序列一定存在这样一个 d 。然后关键的地方到了！

此时我们把 0 到 d 所有的 -1 变成 1，1 变成 -1，我们将每一个非法序列都这样做，就构成了一个**新的集合 N** ，并且这个集合 N 一定和 M 中的元素一一对应（ N -> M，在集合 N 中第一次出现和为 1 的位置也就是 d ，把 0 到 d 中所有的 -1 变成 1，1 变成 -1 就回到了 M），从而集合 M 的数量就等于集合 N 的数量。集合 N 的数量是多少呢？

我们来分析下集合 N 是什么样的，集合 N 对应的集合 M 原来的序列本来是这样的，在 0 到 d 之间和是 -1 ，也就是 -1 比 +1 多一个，d + 1 到最后的和一定是 1（因为 n 个 +1 和 n 个 -1 的和一定是 0 ，由于 0 到 d 和是 -1，后边的和一定是 1），也就意味着 +1 比 -1 多一个。而在集合 N 中，我们把 0 到 d 的 -1 变成了 +1 ，+1 变成了 -1 ，所以也变成了 +1 比  -1 多一个，所以集合 N 总共就是 +1 比 -1 多 2 个的集合，也就是 n + 1 个 +1 和 n - 1 个 -1 。

所以集合 N 就是 2n 个位置中选 n - 1 个位置放 -1，其他位置放 +1，总共就有 $$C^{n - 1}_{2n}$$，所以集合 M 也有 $$C^{n - 1}_{2n}$$种。

所有合法序列就有 $$C^n_{2n}-C^{n-1}_{2n}=\frac{1}{n+1}C^n_{2n}$$ 。

将集合 M 和集合 N 建立了一一映射，从而解决了问题，神奇！！！！！！！！！！其实，这个数列就是卡塔兰数，可以看下[维基百科](https://zh.wikipedia.org/wiki/%E5%8D%A1%E5%A1%94%E5%85%B0%E6%95%B0)的定义。

![](https://windliang.oss-cn-beijing.aliyuncs.com/22_8.jpg)

而这个数列，其实除了括号匹配，还有很多类似的问题，其本质是一样的，例如，

2n 个人排队买票，其中 n 个人持 50 元，n 个人持 100 元。每张票 50 元，且一人只买一张票。初始时售票处没有零钱找零。请问这 2n 个人一共有多少种排队顺序，不至于使售票处找不开钱？

对于一个无限大的栈，一共n个元素，请问有几种合法的入栈出栈形式？

P = a1 * a2 * a3 * ... * an，其中 ai 是矩阵。根据乘法结合律，不改变矩阵的相互顺序，只用括号表示成对的乘积，试问一共有几种括号化方案？

n 个结点可构造多少个不同的二叉树？

... ...

更多例子可以看[维基百科](https://zh.wikipedia.org/wiki/%E5%8D%A1%E5%A1%94%E5%85%B0%E6%95%B0)和[这里](http://www.cnblogs.com/wuyuegb2312/p/3016878.html)。

而 Solutin 给出的时间复杂度，其实就是卡特兰数。

![](https://windliang.oss-cn-beijing.aliyuncs.com/22_9.jpg)

[维基百科](https://zh.wikipedia.org/wiki/%E5%8D%A1%E5%A1%94%E5%85%B0%E6%95%B0)的给出的性质。

![](https://windliang.oss-cn-beijing.aliyuncs.com/22_10.jpg)

# 总

本以为这道题挺常规的，然后自己一直卡在解法三的理解上，查来查去，竟然查出了卡塔兰数，虽然似乎和解法三也没什么关系，但又开阔了很多思路。解法三分析出来的迭代方法，以及用映射证明卡塔兰数的求法，棒！

