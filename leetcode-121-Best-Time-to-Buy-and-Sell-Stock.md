# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/121.jpg)

给一个数组，看作每天股票的价格，然后某一天买入，某一天卖出，最大收益可以是多少。可以不操作，收入就是 `0`。

# 解法一 暴力破解

先写个暴力的，看看对题目的理解对不对。用两个循环，外层循环表示买入时候的价格，内层循环表示卖出时候的价格，遍历所有的情况，期间更新最大的收益。

```java
public int maxProfit(int[] prices) {
    int maxProfit = 0;
    for (int i = 0; i < prices.length; i++) {
        for (int j = i + 1; j < prices.length; j++) {
            maxProfit = Math.max(maxProfit, prices[j] - prices[i]);
        }
    }
    return maxProfit;
}
```

# 解法二 双指针

这种数组优化，经常就是考虑双指针的方法，从而使得两层循环变成一层。思考一下怎么定义指针的含义。

```java
用两个指针， buy 表示第几天买入，sell 表示第几天卖出
开始 buy,sell 都指向 0，表示不操作
3 6 7 2 9
^
b
^
s

sell 后移表示这天卖出，计算收益是 6 - 3 = 3
3 6 7 2 9
^ ^
b s


sell 后移表示这天卖出，计算收益是 7 - 3 = 4
3 6 7 2 9
^   ^
b   s

sell 后移表示这天卖出，计算收益是 2 - 3 = -1
3 6 7 2 9 12
^     ^
b     s

此外，如上图，当前 sell 指向的价格小于了我们买入的价格，所以我们要把 buy 指向当前 sell 才会获得更大的收益
原因很简单,收益的价格等于 prices[sell] - prices[buy]，buy 指向 sell 会使得减数更小，
所以肯定要选更小的 buy
3 6 7 2 9 12
      ^
      s
      ^
      b
      

sell 后移表示这天卖出，计算收益是 9 - 2 = 7
这里也可以看出来减数从之前的 3 变成了 2，所以收益会更大
3 6 7 2 9 12
      ^ ^
      b s
      
sell 后移表示这天卖出，计算收益是 12 - 2 = 10
3 6 7 2 9 12
      ^   ^
      b   s
      
然后在这些价格里选最大的就可以了。
```

代码的话就很好写了。

```java
public int maxProfit(int[] prices) {
    int maxProfit = 0;
    int buy = 0;
    int sell = 0;
    for (; sell < prices.length; sell++) {
        //当前价格更小了，更新 buy
        if (prices[sell] < prices[buy]) {
            buy = sell;
        } else {
            maxProfit = Math.max(maxProfit, prices[sell] - prices[buy]);

        }
    }
    return maxProfit;
}
```

# 解法三

参考下边的链接。

https://leetcode.com/problems/best-time-to-buy-and-sell-stock/discuss/39038/Kadane's-Algorithm-Since-no-one-has-mentioned-about-this-so-far-%3A)-(In-case-if-interviewer-twists-the-input)

一个很新的角度，先回忆一下 [53 题](<https://leetcode.wang/leetCode-53-Maximum-Subarray.html>)，求子序列最大的和。

![img](https://windliang.oss-cn-beijing.aliyuncs.com/53.jpg)

当时的解法二，用动态规划，

用一个一维数组 `dp [ i ]` 表示以下标 `i` 结尾的子数组的元素的最大的和，也就是这个子数组最后一个元素是下边为 `i` 的元素，并且这个子数组是所有以 `i `结尾的子数组中，和最大的。

这样的话就有两种情况，

- 如果 `dp [ i - 1 ] < 0`，那么 `dp [ i ] = nums [ i ]`。
- 如果 `dp [ i - 1 ] >= 0`，那么 `dp [ i ] = dp [ i - 1 ] + nums [ i ]`。

直接放一下最后经过优化后的代码，具体的可以过去 [看一下](<https://leetcode.wang/leetCode-53-Maximum-Subarray.html>)。

```java
public int maxSubArray(int[] nums) {
    int n = nums.length;
    int dp = nums[0];
    int max = nums[0]; 
    for (int i = 1; i < n; i++) {
        dp= Math.max(dp + nums[i],nums[i]);
        max = Math.max(max, dp);
    }
    return max;
} 
```

而对于这道题我们可以转换成上边的问题。

对于数组 ` 1 6 2 8`，代表股票每天的价格。

定义一下转换规则，当前天的价格减去前一天的价格，第一天由于没有前一天，规定为 `0`，用来代表不操作。

数组就转换为 `0 6-1 2-6 8-2`，也就是 `0 5 -4 6`。现在的数组的含义就变成了股票相对于前一天的变化了。

现在我们只需要找出连续的和最大是多少就可以了，也就是变成了 `53` 题。

连续的和比如对应第 3 到 第 6 天加起来的和，那对应的买入卖出其实就是第 `2` 天买入，第 `6` 天卖出。

换句话讲，买入卖出和连续的和形成了互相映射，所以问题转换成功。

代码在上边的基础上改一下就可以了。

```java
public int maxProfit(int[] prices) {
    int n = prices.length;
    int dp = 0;
    int max = 0;
    for (int i = 1; i < n; i++) {
        int num = prices[i] - prices[i - 1];
        dp = Math.max(dp + num, num);
        max = Math.max(max, dp);
    }
    return max;
}
```

而这个算法其实叫做 `Kadane` 算法，如果序列中含有负数，并且可以不选择任何一个数，那么最小的和也肯定是 `0`，也就是上边的情况，这也是把我们把第一天的浮动当作是 `0` 的原因。所以 `max `初始化成了 `0`。

更多`Kadane` 算法的介绍可以参考 [维基百科](<https://zh.wikipedia.org/wiki/%E6%9C%80%E5%A4%A7%E5%AD%90%E6%95%B0%E5%88%97%E9%97%AE%E9%A2%98>)。

# 总

这道题虽然是比较简单的，但是双指针的用法还是经常见的。另外解法三对问题的转换是真的佩服了。