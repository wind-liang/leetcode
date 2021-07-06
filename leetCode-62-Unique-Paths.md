# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/62.jpg)

机器人从左上角走到右下角，只能向右或者向下走。输出总共有多少种走法。

# 解法一 递归

求 ( 0 , 0 ) 点到（ m - 1 , n - 1） 点的走法。

（0，0）点到（m - 1 , n - 1） 点的走法等于（0，0）点右边的点 （1，0）到（m - 1 , n - 1）的走法加上（0，0）点下边的点（0，1）到（m - 1 , n - 1）的走法。

而左边的点（1，0）点到（m - 1 , n - 1） 点的走法等于（2，0） 点到（m - 1 , n - 1）的走法加上（1，1）点到（m - 1 , n - 1）的走法。

下边的点（0，1）点到（m - 1 , n - 1） 点的走法等于（1，1）点到（m - 1 , n - 1）的走法加上（0，2）点到（m - 1 , n - 1）的走法。

然后一直递归下去，直到 （m - 1 , n - 1） 点到（m - 1 , n - 1） ，返回 1。

```java
public int uniquePaths(int m, int n) {
    HashMap<String, Integer> visited = new HashMap<>();
    return getAns(0, 0, m - 1, n - 1, 0);

}

private int getAns(int x, int y, int m, int n, int num) {
    if (x == m && y == n) {
        return 1;
    }
    int n1 = 0;
    int n2 = 0;
    //向右探索的所有解
    if (x + 1 <= m) {
        n1 = getAns(x + 1, y, m, n, num);
    }
    //向左探索的所有解
    if (y + 1 <= n) {
        n2 = getAns(x, y + 1, m, n, num);
    }
    //加起来
    return n1 + n2;
}
```

时间复杂度：

空间复杂度：

遗憾的是，这个算法在 LeetCode 上超时了。我们可以优化下，问题出在当我们求点 （x，y）到（m - 1 , n - 1） 点的走法的时候，递归求了点 （x，y）点右边的点 （x + 1，0）到（m - 1 , n - 1）的走法和（x，y）下边的点（x，y + 1）到（m - 1 , n - 1）的走法。而没有考虑到（x + 1，0）到（m - 1 , n - 1）的走法和点（x，y + 1）到（m - 1 , n - 1）的走法是否是之前已经求过了。事实上，很多点求的时候后边的的点已经求过了，所以再进行递归是没有必要的。基于此，我们可以用  visited 保存已经求过的点。

```java
public int uniquePaths(int m, int n) {
    HashMap<String, Integer> visited = new HashMap<>();
    return getAns(0, 0, m - 1, n - 1, 0, visited); 

}
private int getAns(int x, int y, int m, int n, int num, HashMap<String, Integer> visited) {
    if (x == m && y == n) {
        return 1;
    }
    int n1 = 0;
    int n2 = 0;
    String key = x + 1 + "@" + y;
    //判断当前点是否已经求过了
    if (!visited.containsKey(key)) {
        if (x + 1 <= m) {
            n1 = getAns(x + 1, y, m, n, num, visited);
        }
    } else {
        n1 = visited.get(key);
    }
    key = x + "@" + (y + 1);
    if (!visited.containsKey(key)) {
        if (y + 1 <= n) {
            n2 = getAns(x, y + 1, m, n, num, visited);
        }
    } else {
        n2 = visited.get(key);
    }
    //将当前点加入 visited 中
    key = x + "@" + y;
    visited.put(key, n1+n2);
    return n1 + n2;
}
```

时间复杂度：

空间复杂度：

# 解法二 动态规划

解法一是基于递归的，压栈浪费了很多时间。我们来分析一下，压栈的过程，然后我们其实完全可以省略压栈的过程，直接用迭代去实现。

如下图，如果是递归的话，根据上边的代码，从 （0，0）点向右压栈，向右压栈，到最右边后，就向下压栈，向下压栈，到最下边以后，就开始出栈。出栈过程就是橙色部分。

![](https://windliang.oss-cn-beijing.aliyuncs.com/62_2.jpg)

然后根据代码，继续压栈前一列，下图的橙色部分，然后到最下边后，然后开始出栈，根据它的右边的点和下边的点计算当前的点的走法。

![](https://windliang.oss-cn-beijing.aliyuncs.com/62_3.jpg)

接下来两步同理，压栈，出栈。

![](https://windliang.oss-cn-beijing.aliyuncs.com/62_4.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/62_5.jpg)

我们现在要做的就是要省略压栈的过程，直接出栈。很明显可以做到的，只需要初始化最后一列为 1 ，然后 1 列，1 列的向前更新就可以了。有一些动态规划的思想了。

```java
public int uniquePaths(int m, int n) {
    int[] dp = new int[m];
    //初始化最后一列
    for (int i = 0; i < m; i++) {
        dp[i] = 1;
    }
    //从右向左更新所有列
    for (int i = n - 2; i >= 0; i--) {
        //最后一行永远是 1，所以从倒数第 2 行开始
        //从下向上更新所有行
        for (int j = m - 2; j >= 0; j--) {
            //右边的和下边的更新当前元素
            dp[j] = dp[j] + dp[j + 1];
        }
    }
    return dp[0];
}
```

时间复杂度：O（m * n）。

空间复杂度：O（m）。

[这里](https://leetcode.com/problems/unique-paths/discuss/22954/C%2B%2B-DP)也有一个类似的想法。不过他是正向考虑的，和上边的想法刚好相反。如果把 dp \[ i \] [ j \] 表示为从点 （0，0）到点 ( i，j）的走法。

上边解法公式就是 dp \[ i \] [ j \] = dp \[ i + 1 \] [ j \] + dp \[ i \] [ j +1 \]。

[这里](https://leetcode.com/problems/unique-paths/discuss/22954/C%2B%2B-DP)的话就是 dp \[ i \] [ j \] = dp \[ i - 1 \] [ j \] + dp \[ i \] [ j - 1 \]。就是用它左边的和上边的更新，可以结合下图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/62_6.jpg)

这样的话，就是从左向右，从上到下一行一行更新（当前也可以一列一列更新）。

```java
public int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
    }

    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[j] = dp[j] + dp[j - 1];
        }
    }
    return dp[(n - 1)];
}
```

时间复杂度：O（m * n）。

空间复杂度：O（n）。

# 解法三 公式

参考[这里](https://leetcode.com/problems/unique-paths/discuss/22981/My-AC-solution-using-formula)。

![](https://windliang.oss-cn-beijing.aliyuncs.com/62_7.jpg)

我们用 R 表示向右，D 表示向下，然后把所有路线写出来，就会发现神奇的事情了。

R R R D D

R R D D R

R D R D R

……

从左上角，到右下角，总会是 3 个 R，2 个 D，只是出现的顺序不一样。所以求解法，本质上是求了组合数，N = m + n - 2，也就是总共走的步数。 k = m - 1，也就是向下的步数，D 的个数。所以总共的解就是 $$C^k_n = n!/(k!(n-k)!) = (n*(n-1)*(n-2)*...(n-k+1))/k!$$。

```java
public int uniquePaths(int m, int n) {
    int N = n + m - 2; 
    int k = m - 1;  
    long res = 1; 
    for (int i = 1; i <= k; i++)
        res = res * (N - k + i) / i;
    return (int) res; 
}
```

时间复杂度：O（m）。

空间复杂度：O（1）。

# 总

从递归，到递归改迭代，之前的题也都遇到过了，本质上就是省去压栈的过程。解法三的公式法，直接到问题的本质，很厉害。