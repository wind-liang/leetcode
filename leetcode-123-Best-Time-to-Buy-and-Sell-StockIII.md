# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/123.jpg)

依旧是买卖股票的延伸，但比 [121 题](<https://leetcode.wang/leetcode-121-Best-Time-to-Buy-and-Sell-Stock.html>) ， [122 题](<https://leetcode.wang/leetcode-122-Best-Time-to-Buy-and-Sell-StockII.html>) 难度高了不少。这道题的意思是，给一个数组代表股票每天的价格。你最多可以买入卖出两次，但只有卖出了才可以再次买入，求出最大的收益是多少。

# 解法一

参考 [这里](<https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/discuss/135704/Detail-explanation-of-DP-solution>)。

开始的想法是求出收益第一高和第二高的两次买卖，然后加起来。对于普通的情况是可以解决的，但是对于下边的情况

```java
1 5 2 8 3 10
```

第一天买第二天卖，第三天买第四天卖，第五天买第六天卖，三次收益分别是 `4`，`6`，`7`，最高的两次就是 `6 + 7 = 13` 了，但是我们第二天其实可以不卖出，第四天再卖出，那么收益是 `8 - 1 = 7`，再加上第五天买入第六天卖出的收益就是 `7 + 7 = 14`了。

所以当达到了一个高点时不一定要卖出，所以需要考虑的情况就很多了，不能像  [121 题](<https://leetcode.wang/leetcode-121-Best-Time-to-Buy-and-Sell-Stock.html>) ， [122 题](<https://leetcode.wang/leetcode-122-Best-Time-to-Buy-and-Sell-StockII.html>)  那样简单的考虑了。那只能朝着动态规划思路想了。

动态规划关键就是数组定义和状态转移方程了。

按最简单的动态规划的思路想，用 `dp[i]`表示前`i`天的最高收益，那么 `dp[i+1]` 怎么根据 `dp[i]` 求出来呢？发现并不能求出来。

我们注意到我们题目是求那么多天最多交易两次的最高收益，还有一个**最多交易次数**的变量，我们把它加到数组中再试一试。

用 `dp[i][k]` 表示前`i`天最多交易`k`次的最高收益，那么 `dp[i][k]` 怎么通过之前的解求出来呢？

首先第 `i` 天可以什么都不操作，今天的最高收益就等于昨天的最高收益

`dp[i][k] = dp[i-1][k]`

此外，为了获得更大收益我们第 `i` 天也可以选择卖出，既然选择卖出，那么在`0`到 `i-1` 天就要选择一天买入。多选择了一次买入，那在买入之前已经进行了 `k-1` 次买卖。

在第 `0` 天买入，收益就是 ` prices[i] - prices[0] `

在第 `1` 天买入，收益就是 `prices[i] - prices[1] + dp[0][k-1]`，多加了前一天的最大收益

在第 `2` 天买入，收益就是 `prices[i] - prices[2] + dp[1][k-1]`，多加了前一天的最大收益

...

在第 `j` 天买入，收益就是 `prices[i] - prices[j] + dp[j-1][k-1]`，多加了前一天的最大收益

上边的每一种可能选择一个最大的，然后与第`i`天什么都不操作比较，就是`dp[i][k]`的值了。

当然上边的推导已经可以写代码了，但为了最后的代码更加简洁（写完代码后发现的），我们可以再换一下状态转移方程。真的只是为了简洁，时间复杂度和空间复杂度上不会有影响。

> 为了获得更大收益我们第 `i` 天也可以选择卖出，既然选择卖出，那么在`0`到 `i-1` 天就要选择一天买入。

我们也可以选择`0`到`i`天中选择一天买入，因为第 `i` 天买入，第 `i`天卖出对最后的收益是没有影响的。

>在第 `j` 天买入，收益就是 `prices[i] - prices[j] + dp[j-1][k-1]`，多加了前一天的最大收益

我们多加了前一天的最大收益，我们也可以改成加当前天的最大收益。

在第 `j` 天买入，收益就是 `prices[i] - prices[j] + dp[j][k-1]`

不严谨的想一下，如果第 `j` 天就是最后我们要选择的买入点，它使得最后的收益最高，`dp[j][k-1]` 和 `dp[j-1][k-1]` 一定是相等的。因为第 `j` 天一定是一个低点而第 `j - 1` 天是个高点，第 `j` 天为了得到更高收益肯定选择不操作，所以和第 `j - 1` 天的收益是一样的，所以改了状态转移方程，最后求出的最高解还是一致的。

综上，最后的状态转移方程就是

`dp[i][k] = Max(dp[i-1][k],(prices[i] - prices[0] + dp[0][k-1]),(prices[i] - prices[1] + dp[1][k-1])...(prices[i] - prices[i] + dp[i][k-1]))`

也就是

`dp[i][k] = Max(dp[i-1][k],prices[i] - prices[j] + dp[j][k-1])`，`j` 取 `0 - i`。

而 `prices[i] - prices[j] + dp[j][k-1]` 也可以看做， `prices[i] - (prices[j] - dp[j][k-1])` ，为了求这个表达式的最大值，我们可以找`prices[j] - dp[j][k-1]`的最小值。

而初始条件对于`k` 等于 `0` 的情况，收益就是 `0` 了。

还有前 `0` 天的最大收益也是 0 ，也就是`dp[0][k]`是 0 。由于下标是从`0`开始的，这里的前`0`天其实就是第一天。

因为初始条件的结果都是`0`，数组初始化后就是 `0` ，所以不需要特殊处理。

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) {
        return 0;
    }
    int K = 2;
    int[][] dp = new int[prices.length][K + 1];
    for (int k = 1; k <= K; k++) {
        for (int i = 1; i < prices.length; i++) { 
            int min = Integer.MAX_VALUE;
            //找出第 0 天到第 i 天 prices[buy] - dp[buy][k - 1] 的最小值
            for (int buy = 0; buy <= i; buy++) { 
                min = Math.min(prices[buy] - dp[buy][k - 1], min);
            }
            //比较不操作和选择一天买入的哪个值更大
            dp[i][k] = Math.max(dp[i - 1][k], prices[i] - min);
        }
    }
    return dp[prices.length - 1][K];
}
```

找第 `j` 天`prices[buy] - dp[buy][k - 1] `的最小值的时候，我们考虑了 `prices[0] - dp[0][k - 1] `、 `prices[1] - dp[1][k - 1] `、 `prices[2] - dp[2][k - 1] `...，找第 `j + 1` 天`prices[buy] - dp[buy][k - 1] `的最小值的时候，我们又会从头考虑 `prices[0] - dp[0][k - 1] `、 `prices[1] - dp[1][k - 1] `、 `prices[2] - dp[2][k - 1] `...，所以其实没必要每次从头考虑，我们只需要把之前的结果保存起来，然后再和新加入的 `prices[j+1] - dp[j+1][k - 1] ` 比较就可以了。

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) {
        return 0;
    }
    int K = 2;
    int[][] dp = new int[prices.length][K + 1];
    for (int k = 1; k <= K; k++) {
        int min = prices[0];
        for (int i = 1; i < prices.length; i++) {
            //找出第 1 天到第 i 天 prices[buy] - dp[buy][k - 1] 的最小值 
            min = Math.min(prices[i] - dp[i][k - 1], min); 
            //比较不操作和选择一天买入的哪个值更大
            dp[i][k] = Math.max(dp[i - 1][k], prices[i] - min);
        }
    }
    return dp[prices.length - 1][K];
}
```

此时按照动态规划的套路，结合代码和下边的图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/123_2.jpg)

根据代码，我们是固定 `k` 然后一列一列更新 `dp`。而更新当前列只需要前一列的信息，所以不需要二维数组，只需要一个一维数组。但是注意到最外层的 `for` 循环是一个常数次，所以我们可以把两层循环内外颠倒下，可以更好的进行空间复杂度的优化。

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) {
        return 0;
    }
    int K = 2;
    int[][] dp = new int[prices.length][K + 1];
    int min[] = new int[K + 1];
    for (int i = 1; i <= K; i++) {
        min[i] = prices[0];
    }
    for (int i = 1; i < prices.length; i++) {
        for (int k = 1; k <= K; k++) {
            min[k] = Math.min(prices[i] - dp[i][k - 1], min[k]);
            dp[i][k] = Math.max(dp[i - 1][k], prices[i] - min[k]);
        }
    }
    return dp[prices.length - 1][K];
}

```

![](https://windliang.oss-cn-beijing.aliyuncs.com/123_2.jpg)

再结合图看，此时我们就是一行一行的更新了，对于每一列都有一个 `min` 所以我们多了 `min` 数组。现在让我们将二维数组 `dp` 改成一维数组。

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) {
        return 0;
    }
    int K = 2;
    int[] dp = new int[K + 1];
    int min[] = new int[K + 1];
    for (int i = 1; i <= K; i++) {
        min[i] = prices[0];
    }
    for (int i = 1; i < prices.length; i++) {
        for (int k = 1; k <= K; k++) {
            min[k] = Math.min(prices[i] - dp[k - 1], min[k]);
            dp[k] = Math.max(dp[k], prices[i] - min[k]);
        }
    }
    return dp[K];
}
```

由于 `K` 是一个常数，所以我们的 `min` 数组和 `dp` 数组都可以分别当成两个变量。

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) {
        return 0;
    } 
    int dp1 = 0;
    int dp2 = 0;
    int min1 = prices[0];
    int min2 = prices[0];
    for (int i = 1; i < prices.length; i++) {
            min1 = Math.min(prices[i] - 0, min1);
            dp1 = Math.max(dp1, prices[i] - min1);

            min2 = Math.min(prices[i] - dp1, min2);
            dp2 = Math.max(dp2, prices[i] - min2);
    }
    return dp2;
}
```

如果结合一步一步的优化，最后这个代码也就很好的能解释通了。

# 解法二

再分享个利用状态机的 [解法](<https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/discuss/149383/Easy-DP-solution-using-state-machine-O(n)-time-complexity-O(1)-space-complexity>)，虽然不容易想到，但真的太强了，上次用状态机还是 [65 题](<https://leetcode.wang/leetCode-65-Valid-Number.html?h=%E7%8A%B6%E6%80%81>)。

每天我们其实是有四个状态，买入当前价格的股票，以当前价格的股票卖出。第二次买入股票，第二次卖出股票。

![](https://windliang.oss-cn-beijing.aliyuncs.com/123_3.jpg)

`s0`代表初始状态，初始时钱是 `0`。`s1`代表第一次买入后当前的钱，`s2`代表第一次卖出后当前的前，`s3`代表第二次买入后当前的钱，`s4`代表第二次卖出后当前的钱。

然后我们只需要更新每天的这四个状态即可。

```java
int maxProfit(vector<int>& prices) {
    if(prices.empty()) return 0;
    //进行初始化，第一天 s1 将股票买入，其他状态全部初始化为最小值
    int s1=-prices[0],s2=INT_MIN,s3=INT_MIN,s4=INT_MIN;

    for(int i=1;i<prices.size();++i) {            
        s1 = max(s1, -prices[i]); //买入价格更低的股
        s2 = max(s2, s1+prices[i]); //卖出当前股，或者不操作
        s3 = max(s3, s2-prices[i]); //第二次买入，或者不操作
        s4 = max(s4, s3+prices[i]); //第二次卖出，或者不操作
    }
    return max(0,s4);
}
```

# 总

解法一比较常规，但是这个动态规划难在了我们考虑了两个变量，相比于之前的动态规划不容易想到。