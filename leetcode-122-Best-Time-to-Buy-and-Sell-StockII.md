 # 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/122.jpg)

和 [121 题](<https://leetcode.wang/leetcode-121-Best-Time-to-Buy-and-Sell-Stock.html>) 一样，给定一个数组，代表每天的价格。区别在于 `121` 题只能进行一次买入卖出。但是这道题可以不停的买入、卖出，但是只有卖出了才能继续买入。

# 解法一

就用最简单的思想，我们穿越回去了过去，知道了未来每天的股票价格，要怎么操作呢？

跌了的前一天卖出，例如下边的例子

```java
1 2 3 4 天
2 7 8 5

第 4 天下跌，我们可以在前一天卖出，下跌当天再次买入，后边出现下跌，前一天继续卖出
```

需要考虑两种特殊情况

一直上涨，没有下跌

```java
1 3 5 9

那么我们在最后一天卖出就可以
```

第二天下跌

```java
8 7 9 10

下跌的时候我们本应该在前一天卖出，然而第一天只能买入并不能卖出，所以这种情况并不会带来收益
```

考虑了上边的所有情况，就可以写代码了。

```java
public int maxProfit(int[] prices) {
    int profit = 0;
    int buy = 0;
    int sell = 1;

    for (; sell < prices.length; sell++) {
        //出现下跌
        if (prices[sell] < prices[sell - 1]) {
            //不是第 2 天下跌，就前一天卖出，累计收益
            if (sell != 1) {
                profit += prices[sell - 1] - prices[buy];
            }
            //下跌当天再次买入
            buy = sell;
        
        //到最后一天是上涨，那就在最后一天卖出
        } else if (sell == prices.length - 1) {
            profit += prices[sell] - prices[buy];
        }
    }
    return profit;
}
```

还有一种持续下跌的情况

```java
9 8 7 3 2

但是对于我们的代码，持续下跌的话，buy 和 sell - 1 就相等了，所以每次累计就是 0，不影响结果
```

# 解法二

其实不用考虑那么多，再直接点，只要当前天相对于前一天上涨了，我们就前一天买入，当前天卖出。

```java
public int maxProfit(int[] prices) {
    int profit = 0;
    for (int i = 1; i < prices.length; i++) {
        int sub = prices[i] - prices[i - 1];
        if (sub > 0) {
            profit += sub;
        }
    }
    return profit;
}
```

# 总

上边两种解法都是从实际情况出发，来考虑怎么盈利最大。[官方](<https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/solution/>) 给出的理解方式也很好，这里分享一下。

![](https://windliang.oss-cn-beijing.aliyuncs.com/122_2.jpg)

两种解法其实都可以抽象到上边的图中。

解法一，其实每次就是找了波谷和波峰做了差，然后把所有的差进行累计。

解法二，找的是上升的折线段，把所有上升的折线段的高度进行了累计。

所以一些题，可能代码是一样的，但是理解的含义并不相同。