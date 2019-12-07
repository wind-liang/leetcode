# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/188.jpg)

买卖股票续集，前边是 [121 题](<https://leetcode.wang/leetcode-121-Best-Time-to-Buy-and-Sell-Stock.html>)， [122 题](<https://leetcode.wang/leetcode-122-Best-Time-to-Buy-and-Sell-StockII.html>) ，[123 题](https://leetcode.wang/leetcode-123-Best-Time-to-Buy-and-Sell-StockIII.html) ，这道题的意思是，给一个数组代表股票每天的价格。你最多可以买入卖出 `K` 次，但只有卖出了才可以再次买入，求出最大的收益是多少。

# 解法一

直接按照前边题推出来的动态规划的方法做了，大家可以先到 [121 题](<https://leetcode.wang/leetcode-121-Best-Time-to-Buy-and-Sell-Stock.html>)， [122 题](<https://leetcode.wang/leetcode-122-Best-Time-to-Buy-and-Sell-StockII.html>) ，[123 题](https://leetcode.wang/leetcode-123-Best-Time-to-Buy-and-Sell-StockIII.html) 看一下。

[123 题](https://leetcode.wang/leetcode-123-Best-Time-to-Buy-and-Sell-StockIII.html) 要求最多买卖两次，最终优化的出的代码如下。

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

之前我们已经抽象出了一个变量 `K` 代表最多买卖 `K` 次，所以这里的话我们只需要把函数传过来的参数赋值给 `K` 即可。

```java
public int maxProfit(int k, int[] prices) {
    if (prices.length == 0) {
        return 0;
    }
    int K = k;
    int[] dp = new int[K + 1];
    int min[] = new int[K + 1];
    for (int i = 1; i <= K; i++) {
        min[i] = prices[0];
    }
    for (int i = 1; i < prices.length; i++) {
        for (int kk = 1; kk <= K; kk++) {
            min[kk] = Math.min(prices[i] - dp[kk - 1], min[kk]);
            dp[kk] = Math.max(dp[kk], prices[i] - min[kk]);
        }
    }
    return dp[K];
}
```

但事情果然没有这么简单，内存超限了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/188_2.jpg)

分析一下原因，我们申请了两个 `K+1` 大的数组，当 `K` 太大的时候就超出了内存的限制。

第一反应是因为数组需要消耗连续的内存空间，然后我又把数组改成链表进行了尝试，虽然没报超内存的错误，但直接报了超时的错误，原因也很简单，就是因为我们很多的随机存取，链表的话不易操作。现在再想想，有点儿傻，因为这个内存超限应该是 `leetcode` 的限制，而不是物理内存上真的不够了，所以数组改链表不会解决这个问题的。

怎么减小 `K` 的大小呢？为什么 `K` 会那么大那么大。仔细想想，其实 `K` 太大是没有意义的，如果我们数组的大小是 `n`，然后一天买，一天卖，我们最多就是 `n/2` 次交易（买入然后卖出算一次交易）。所以当 `K` 大于 `n/2` 的时候是没有意义的，所以我们可以再给 `K` 赋值的时候和 `n/2` 比较，选择较小的值赋值给 `K`。

```java
public int maxProfit(int k, int[] prices) {
    if (prices.length == 0) {
        return 0;
    }
    int K = Math.min(k, prices.length / 2);
    int[] dp = new int[K + 1];
    int min[] = new int[K + 1];
    for (int i = 1; i <= K; i++) {
        min[i] = prices[0];
    }
    for (int i = 1; i < prices.length; i++) {
        for (int kk = 1; kk <= K; kk++) {
            min[kk] = Math.min(prices[i] - dp[kk - 1], min[kk]);
            dp[kk] = Math.max(dp[kk], prices[i] - min[kk]);
        }
    }
    return dp[K];
}
```

然后去逛 `Discuss` 的时候突然想到，如果我们最多交易 `K` 次，而 `K` 又达到了 `n/2`，也就是最多的交易次数，那不就代表着我们可以交易任意次吗，交易任意次这不就是 [122 题](<https://leetcode.wang/leetcode-122-Best-Time-to-Buy-and-Sell-StockII.html>) 讨论的吗。所以代码可以再优化一下。

```java
public int maxProfit(int k, int[] prices) {
    if (prices.length == 0) {
        return 0;
    }
    //K 看做任意次，转到 122 题
    if (k >= prices.length / 2) {
        return maxProfit(prices);
    }
    int K = k;
    int[] dp = new int[K + 1];
    int min[] = new int[K + 1];
    for (int i = 1; i <= K; i++) {
        min[i] = prices[0];
    }
    for (int i = 1; i < prices.length; i++) {
        for (int kk = 1; kk <= K; kk++) {
            min[kk] = Math.min(prices[i] - dp[kk - 1], min[kk]);
            dp[kk] = Math.max(dp[kk], prices[i] - min[kk]);
        }
    }
    return dp[K];
}

//122 题代码
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

时间复杂度：`O(nk)`。

空间复杂度：`O(k)`。

# 解法二

原本以为这道题也就结束了，但 `Discuss` 区总是人外有人，天外有天，有人提出了崭新的解法，并且时间复杂度上进行了优化。参考 [这里](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/discuss/54145/O(n)-time-8ms-Accepted-Solution-with-Detailed-Explanation-(C%2B%2B)) ，分享一下。

为了得到最高的收益，我们肯定会选择在波谷买入，然后在波峰卖出。第 `v` 天买入，第 `p` 天卖出，我们记做 `(v,p)`。

![](https://windliang.oss-cn-beijing.aliyuncs.com/188_3.jpg)

所以我们所有可能的交易就是选取波谷、波峰，如上图，也就是 `(0,1)`，`(2,4)`，`(5,6)`。然后我们把这些交易所得的收益 `prices[p] - prices[v]` 依次放入数组中。把收益降序排序，选取前 `k` 个加起来，就是题目让我们所求的了，即最多进行 `k` 次交易时的最大收入。

```java
//定义一个结构，存储一次交易的买入卖出时间
class Transaction {
    int valley;
    int peek;

    Transaction(int v, int p) {
        valley = v;
        peek = p;
    }
}

public int maxProfit(int k, int[] prices) {
    if(k == 0){
        return 0;
    }
    Stack<Transaction> stack = new Stack<>();
    List<Integer> profit = new ArrayList<>();
    int v;
    int p = -1;
    int n = prices.length;
    while (true) {
        v = p + 1;
        //寻找波谷
        while (v + 1 < n && prices[v] > prices[v + 1]) {
            v++;
        }
        p = v;
        //寻找波峰
        while (p + 1 < n && prices[p] <= prices[p + 1]) {
            p++;
        }

        //到达最后，结束寻找
        if (p == v) {
            break;
        }

        //将这次的波谷、波峰存入
        stack.push(new Transaction(v, p));
    }

    //遍历所有的买入、卖出，计算其收益
    while (!stack.isEmpty()) {
        Transaction pop = stack.pop();
        profit.add(prices[pop.peek] - prices[pop.valley]);
    }
    int ret = 0;
    //如果能够进行的交易数 K 大于我们存的交易数，就把所有收益累加
    if (k >= profit.size()) {
        for (int i = 0; i < profit.size(); i++) {
            ret += profit.get(i);
        }
    } else {
        //将收益从大到小排序
        Collections.sort(profit, new Comparator<Integer>() {
            @Override
            public int compare(Integer n1, Integer n2) {
                return n2 - n1;
            }
        });

        //选取前 k 个
        for (int i = 0; i < k; i++) {
            ret += profit.get(i);
        }
    }
    return ret;
}
```

当然事情并不会这么简单，上边的情况是最理想的，在每次的波谷买入、波峰卖出，但对于下边的情况就会有些特殊了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/188_4.jpg)

如果按照上边的算法，我们会将 `(0,1)` 和 `(2,3)` 存入。如果进行两次交易，当然也是没有问题的，刚好就是这两次的收益相加。但如果进行一次交易呢？

很明显我们应该在第 `0` 天买入，在第 `3` 天卖出，所以我们应该将 `(0,3)` 存入。也就是当有新的交易 `(2,3)` 来的时候我们要和栈顶的交易 `(0,1)` 的波峰波谷进行比较，如果波谷大于之前的波谷，并且波峰也大于之前的波峰，两次交易就需要合并为 `(0,3)`。

接下来的问题就是我们栈中只存了 `(0,3)` 这一次交易，那么算收益的时候，如果可以进行两次交易，那该怎么办呢？这也是这个解法最巧妙的地方了。

假如两次交易的时间分别是 `(v1,p1)` 和 `(v2,p2)` ，那么

如果最多进行一次交易，那么最大收益就是 `prices[p2] - prices[v1]`

如果最多进行两次交易，那么最大收益就是 `prices[p1] - prices[v1] + prices[p2] - prices[v2]`，进行一下变换 `(prices[p2] - prices[v1]) + (prices[p1] - prices[v2])`，第一个括号括起来的就是进行一次交易的最大收益，所以相对于只进行一次交易，我们的收益增加了第二个括号括起来的 `prices[p1] - prices[v2]`，所以我们只需要在合并两次交易的时候，把 `prices[p1] - prices[v2]` 存到 `profit` 数组中即可。

举个具体的例子，假如股票价格数组是 `1,4,2,6`，然后我们有一个 `stack` 去存每次的交易，`profit` 去存每次交易的收入。

我们会把 `6 - 1 = 5` 和 `4  - 2 = 2`存入`profit` 中。

这样如果最多进行一次交易，从 `profit`  中选取最大的收益，我们刚好得到就是 `5`。

如果最多进行两次交易，从 `profit`  中选取前二名的收益，我们就得到 `5 + 2 = 7`，刚好等价于 `(4 - 1) + (6 - 2) = 7`。

```java
while (!stack.isEmpty() && prices[p] >= prices[stack.peek().peek && prices[v] >= prices[stack.peek().valley]) {
    Transaction pop = stack.pop();
    //加入 prices[p1] - prices[v2] 的收益
    profit.add(prices[pop.peek] - prices[v]);
    //买入点更新为前一次的买入点
    v = pop.valley;
}
```

至于为什么要用 `while` 循环，因为和之前的合并之后，完全可能继续合并，比如下边的例子。

![](https://windliang.oss-cn-beijing.aliyuncs.com/188_5.jpg)

 一开始 `(2,3)` 不能和 `(0,1)` 合并，但当 `(4,5)` 来时候，先和 `(2,3)` 合并为 `(2,5)`，再和 `(0,1)`合并为 `(0,5)`。

还有一种情况，如果新加入的交易的买入点低于栈顶交易的买入点，我们要把栈顶元素出栈。比如下图的例子。

![](https://windliang.oss-cn-beijing.aliyuncs.com/188_6.jpg)

首先是 `(0,1)` 入栈，然后是 `(2,3)` 入栈。接着 `(4,5)` 入栈，此时我们应该将 `(2,3)` 出栈，原因有两点。

第一，因为新来的交易买入点更低，未来如果有交易可以和 `(2,3)` 合并，那么一定可以和 `(4,5)` 合并。并且和 `(4,5)`合并后的收益会更大。

第二，因为栈顶的元素是已经不能合并的交易，而每次我们是和栈顶进行合并，所以新来的交易完全可能会和栈顶之前的元素进行合并交易，因此我们要把旧的栈顶元素出栈。就比如上图的中例子，把 `(2,3)` 出栈以后，我们可以把 `(4,5)`和 `(0,1)` 进行合并。

```java
//当前的买入点比栈顶的低
while (!stack.isEmpty() && prices[v] <= prices[stack.peek().valley]) {
    Transaction pop = stack.pop();
    profit.add(prices[pop.peek] - prices[pop.valley]);
}
```

至于为什么要用 `while` 循环，因为有可能需要连续出栈，比如下图的例子。

![](https://windliang.oss-cn-beijing.aliyuncs.com/188_7.jpg)

`(6,7)`来的时候，要把 `(4,5)`、`(2,3)` 依次出栈。

综上所述，我们要把新的交易的买入点和栈顶的买入点比较，如果当前的买入点更低，要把栈顶的元素出栈。然后再判断，卖出点是否高于栈顶元素的卖出点，如果更高的话，要把当前交易和栈顶的交易合并。

代码的话，整体都不需要变化，只需要在新的交易入栈之前执行一些出栈和合并交易的操作。

```java
class Transaction {
    int valley;
    int peek;

    Transaction(int v, int p) {
        valley = v;
        peek = p;
    }
}

public int maxProfit(int k, int[] prices) {
    if(k == 0){
        return 0;
    }
    Stack<Transaction> stack = new Stack<>();
    List<Integer> profit = new ArrayList<>();
    int v;
    int p = -1;
    int n = prices.length;
    while (true) {
        v = p + 1;
        while (v + 1 < n && prices[v] > prices[v + 1]) {
            v++;
        }
        p = v;
        while (p + 1 < n && prices[p] <= prices[p + 1]) {
            p++;
        }

        if (p == v) {
            break;
        }

        //新的交易的买入点更低，要把栈顶的元素出栈
        while (!stack.isEmpty() && prices[v] <= prices[stack.peek().valley]) {
            Transaction pop = stack.pop();
            profit.add(prices[pop.peek] - prices[pop.valley]);
        }

        //当前交易和栈顶交易是否能合并
        while (!stack.isEmpty() && prices[p] >= prices[stack.peek().peek]) {
            Transaction pop = stack.pop();
            profit.add(prices[pop.peek] - prices[v]);
            v = pop.valley;
        }

        stack.push(new Transaction(v, p));
    }

    while (!stack.isEmpty()) {
        Transaction pop = stack.pop();
        profit.add(prices[pop.peek] - prices[pop.valley]);
    }
    int ret = 0;
    if (k >= profit.size()) {
        for (int i = 0; i < profit.size(); i++) {
            ret += profit.get(i);
        }
    } else {
        Collections.sort(profit, new Comparator<Integer>() {
            @Override
            public int compare(Integer n1, Integer n2) {
                return n2 - n1;
            }
        });

        for (int i = 0; i < k; i++) {
            ret += profit.get(i);
        }
    }
    return ret;
}
```

时间复杂度的话，计算交易的时候需要 `O(n)` ，然后找出前 `k` 笔最大的交易的话用到了排序，如果是快速排序，那么就是 `O(nlog(n))`，所以总的来说就是 `O(nlog(n))`。

时间复杂度上我们还是可以优化的，在求前 `k` 笔最大的交易，我们可以用大小为 `k` 的优先队列存储，优先队列在 [23 题](https://leetcode.wang/leetCode-23-Merge-k-Sorted-Lists.html) 的时候也有用过。

```java
//相当于最小堆，队列头始终队列中是最小的元素
PriorityQueue<Integer> queue = new PriorityQueue<Integer>();

for (int i = 0; i < profit.size(); i++) {
    if (i < k) {
        queue.add(profit.get(i));
    } else {
        int peek = queue.peek();
        //当前收益大于栈顶元素，将栈顶元素弹出，然后将当前元素加入队列
        if (profit.get(i) > peek) {
            queue.poll();
            queue.add(profit.get(i));
        }
    }

}

while (!queue.isEmpty()) {
    ret += queue.poll();
}
```

优先队列的出栈入栈时间复杂度都是 `O(log(k))`，我们遍历了收益数组，这样的话时间复杂度就是 `O(nlog(k))` 了。

# 总

对于解法一，其实就是之前买卖股票的解法。但解法二是真的太强了，不容易想到，但想到的人真是太厉害了。