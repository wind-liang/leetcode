# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/70.jpg)

爬楼梯，每次走 1 个或 2 个台阶，n 层的台阶，总共有多少种走法。

# 解法一 暴力解法

用递归的思路想一下，要求 n 层的台阶的走法，由于一次走 1 或 2 个台阶，所以上到第 n 个台阶之前，一定是停留在第 n - 1 个台阶上，或者 n - 2 个台阶上。所以如果用 f ( n ) 代表 n 个台阶的走法。那么，

f ( n ) = f ( n - 1) + f ( n - 2 )。

f ( 1 ) = 1，f ( 2 )  = 2 。

发现个神奇的事情，这就是斐波那契数列（Fibonacci sequence）。

直接暴力一点，利用递归写出来。

```java
public int climbStairs(int n) {
    return climbStairsN(n);
}

private int climbStairsN(int n) {
    if (n == 1) {
        return 1;
    }
    if (n == 2) {
        return 2;
    }
    return climbStairsN(n - 1) + climbStairsN(n - 2);
}

```

时间复杂度：是一个树状图，$$O(2^n)$$。

空间复杂度：

# 解法二 暴力解法优化

解法一很慢，leetcode 上报了超时，原因就是先求 climbStairsN ( n - 1 )，然后求 climbStairsN ( n - 2 ) 的时候，其实很多解已经有了，但是它依旧进入了递归。优化方法就是把求出的解都存起来，后边求的时候直接使用，不用再进入递归了。叫做  memoization 技术。

```java
public int climbStairs(int n) {
    return climbStairsN(n, new HashMap<Integer, Integer>());
}

private int climbStairsN(int n, HashMap<Integer, Integer> hashMap) {
    if (n == 1) {
        return 1;
    }
    if (n == 2) {
        return 2;
    }
    int n1 = 0;
    if (!hashMap.containsKey(n - 1)) {
        n1 = climbStairsN(n - 1, hashMap);
        hashMap.put(n - 1, n1);
    } else {
        n1 = hashMap.get(n - 1);
    }
    int n2 = 0;
    if (!hashMap.containsKey(n - 2)) {
        n2 = climbStairsN(n - 2, hashMap);
        hashMap.put(n - 2, n1);
    } else {
        n2 = hashMap.get(n - 2);
    }
    return n1 + n2;
}
```

时间复杂度：

空间复杂度：

当然由于 key 都是整数，我们完全可以用一个数组去存储，不需要 Hash。

```java
public int climbStairs(int n) {
    int memo[] = new int[n + 1];
    return climbStairsN(n, memo);
}
private int climbStairsN(int n, int[] memo) {
    if (n == 1) {
        return 1;
    }
    if (n == 2) {
        return 2;
    }
    int n1 = 0;
    //数组的默认值是 0
    if (memo[n - 1] == 0) {
        n1 = climbStairsN(n - 1, memo);
        memo[n - 1] = n1;
    } else {
        n1 = memo[n - 1];
    }
    int n2 = 0;
    if (memo[n - 2] == 0) {
        n2 = climbStairsN(n - 2, memo);
        memo[n - 2] = n2;

    } else {
        n2 = memo[n - 2];
    }
    return n1 + n2;
}
```

# 解法三 迭代

当然递归可以解决，我们可以直接迭代，省去递归压栈的过程。初始值 f ( 1 ) 和 f ( 2 )，然后可以求出 f ( 3 )，然后求出 f ( 4 )  ...  直到 f ( n )，一个循环就够了。其实就是动态规划的思想了。

```java
public int climbStairs(int n) {
    int n1 = 1;
    int n2 = 2;
    if (n == 1) {
        return n1;
    }
    if (n == 2) {
        return n2;
    }
    //n1、n2 都后移一个位置
    for (int i = 3; i <= n; i++) {
        int temp = n2;
        n2 = n1 + n2;
        n1 = temp;
    }
    return n2;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

以上都是比较常规的方法，下边分享一下 [Solution](https://leetcode.com/problems/climbing-stairs/solution/) 里给出的其他解法。

# 解法四 矩阵相乘

[Solution5](https://leetcode.com/problems/climbing-stairs/solution/)叫做 Binets Method，它利用数学归纳法证明了一下，这里就直接用了，至于怎么想出来的，我也不清楚了。

定义一个矩阵 $$Q =  \begin{matrix} 1 & 1 \\ 1 & 0 \end{matrix}  $$ ，然后求 f ( n ) 话，我们先让 Q 矩阵求幂，然后取第一行第一列的元素就可以了，也就是 $$f(n)=Q^n[0][0]$$。

至于怎么更快的求幂，可以看 [50 题](<https://leetcode.wang/leetCode-50-Pow.html>)的解法三。

```java
public int climbStairs(int n) {
    int[][] Q = {{1, 1}, {1, 0}};
    int[][] res = pow(Q, n);
    return res[0][0];
}
public int[][] pow(int[][] a, int n) {
    int[][] ret = {{1, 0}, {0, 1}};
    while (n > 0) {
        //最后一位是 1，加到累乘结果里
        if ((n & 1) == 1) {
            ret = multiply(ret, a);
        }
        //n 右移一位
        n >>= 1;
        //更新 a
        a = multiply(a, a);
    }
    return ret;
}
public int[][] multiply(int[][] a, int[][] b) {
    int[][] c = new int[2][2];
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            c[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j];
        }
    }
    return c;
}
```

时间复杂度：O（log （n））。

空间复杂度：O（1）。

# 解法五 公式法

直接套用公式

![](https://windliang.oss-cn-beijing.aliyuncs.com/70_2.jpg)

```java
public int climbStairs(int n) {
    double sqrt5=Math.sqrt(5);
    double fibn=Math.pow((1+sqrt5)/2,n+1)-Math.pow((1-sqrt5)/2,n+1);
    return (int)(fibn/sqrt5);
}
```

时间复杂度：耗在了求幂的时候，O（log（n））。

空间复杂度：O（1）。

# 总

这道题把递归，动态规划的思想都用到了，很经典。此外，矩阵相乘的解法是真的强，直接将时间复杂度优化到 log 层面。

