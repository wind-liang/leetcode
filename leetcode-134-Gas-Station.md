# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/134.png)

把这个题理解成下边的图就可以。

![](https://windliang.oss-cn-beijing.aliyuncs.com/134_2.jpg)

每个节点表示添加的油量，每条边表示消耗的油量。题目的意思就是问我们从哪个节点出发，还可以回到该节点。只能顺时针方向走。

# 解法一 暴力解法

考虑暴力破解，一方面是验证下自己对题目的理解是否正确，另一方面后续的优化也可以从这里入手。

考虑从第 `0` 个点出发，能否回到第 `0` 个点。

考虑从第 `1` 个点出发，能否回到第 1 个点。

考虑从第 `2` 个点出发，能否回到第 `2` 个点。

... ...

考虑从第 `n` 个点出发，能否回到第 `n` 个点。

由于是个圆，得到下一个点的时候我们需要取余数。

```java
public int canCompleteCircuit(int[] gas, int[] cost) {
    int n = gas.length;
    //考虑从每一个点出发
    for (int i = 0; i < n; i++) {
        int j = i;
        int remain = gas[i];
        //当前剩余的油能否到达下一个点
        while (remain - cost[j] >= 0) {
            //减去花费的加上新的点的补给
            remain = remain - cost[j] + gas[(j + 1) % n];
            j = (j + 1) % n;
            //j 回到了 i
            if (j == i) {
                return i;
            }
        }
    }
    //任何点都不可以
    return -1;
}
```

# 解法二 优化尝试一

暴力破解慢的原因就是会进行很多重复的计算。比如下边的情况：

```java
假设当前在考虑 i,先初始化 j = i
* * * * * *
      ^
      i
      ^
      j
      
随后 j 会进行后移
* * * * * *
      ^ ^
      i j
      
继续后移
* * * * * *
      ^   ^
      i   j
      
继续后移
* * * * * *
^     ^   
j     i   

此时 j 又回到了第 0 个位置，我们在之前已经考虑过了这个位置。
如果之前考虑第 0 个位置的时候，最远到了第 2 个位置。
那么此时 j 就可以直接跳到第 2 个位置，同时加上当时的剩余汽油，继续考虑
* * * * * *
    ^ ^   
    j i  
```

利用上边的思想我们可以进行一个优化，就是每考虑一个点，就将当前点能够到达的最远距离记录下来，同时到达最远距离时候的剩余汽油也要记下来。

```java
public int canCompleteCircuit(int[] gas, int[] cost) {
    int n = gas.length;
    //记录能到的最远距离
    int[] farIndex = new int[n];
    for (int i = 0; i < farIndex.length; i++) {
        farIndex[i] = -1;
    }
    //记录到达最远距离时候剩余的汽油
    int[] farIndexRemain = new int[n];
    for (int i = 0; i < n; i++) {
        int j = i;
        int remain = gas[i];
        while (remain - cost[j] >= 0) {
            //到达下个点后的剩余
            remain = remain - cost[j];
            j = (j + 1) % n;
            //判断之前有没有考虑过这个点
            if (farIndex[j] != -1) {
                //加上当时剩余的汽油
                remain = remain + farIndexRemain[j];
                //j 进行跳跃
                j = farIndex[j];
            } else {
                //加上当前点的补给
                remain = remain + gas[j];
            }
            if (j == i) {
                return i;
            }
        }
        //记录当前点最远到达哪里
        farIndex[i] = j;
        //记录当前点的剩余
        farIndexRemain[i] = remain;
    }
    return -1;

}
```

遗憾的是，这个想法针对 `leetcode` 的测试集速度上没有带来很明显的提升。不过记录已经求出来的解进行优化，这个思想还是经常用的，也就是空间换时间。

让我们换个思路继续优化。

# 解法三 优化尝试二

我们考虑一下下边的情况。

```java
* * * * * *
^     ^
i     j
```

当考虑 `i` 能到达的最远的时候，假设是 `j`。

那么 `i + 1` 到 `j` 之间的节点是不是就都不可能绕一圈了？

假设 `i + 1` 的节点能绕一圈，那么就意味着从 `i + 1` 开始一定能到达 `j + 1`。

又因为从 `i` 能到达 `i + 1`，所以从 ` i ` 也能到达 `j + 1`。

但事实上，`i` 最远到达 `j` 。产生矛盾，所以 `i + 1` 的节点一定不能绕一圈。同理，其他的也是一样的证明。

所以下一次的 `i` 我们不需要从 `i + 1` 开始考虑，直接从 `j + 1` 开始考虑即可。

还有一种情况，就是因为到达末尾的时候，会回到 `0`。

如果对于下边的情况。

```java
* * * * * *
  ^   ^
  j   i
```

如果 `i` 最远能够到达 `j` ，根据上边的结论 `i + 1` 到 `j` 之间的节点都不可能绕一圈了。想象成一个圆，所以 `i` 后边的节点就都不需要考虑了，直接返回 `-1` 即可。

```java
public int canCompleteCircuit(int[] gas, int[] cost) {
    int n = gas.length;
    for (int i = 0; i < n; i++) {
        int j = i;
        int remain = gas[i];
        while (remain - cost[j] >= 0) {
            //减去花费的加上新的点的补给
            remain = remain - cost[j] + gas[(j + 1) % n];
            j = (j + 1) % n;
            //j 回到了 i
            if (j == i) {
                return i;
            }
        }
        //最远距离绕到了之前，所以 i 后边的都不可能绕一圈了
        if (j < i) {
            return -1;
        }
        //i 直接跳到 j，外层 for 循环执行 i++，相当于从 j + 1 开始考虑
        i = j;

    }
    return -1;
}
```

# 总

写题的时候先写出暴力的解法，然后再考虑优化，有时候是一种不错的选择。