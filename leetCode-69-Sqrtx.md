# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/69.jpg)

求一个数的平方根，不要求近似解，只需要整数部分。

# 解法一 二分法

本科的时候上计算方法的时候，讲过这个题的几个解法，二分法， 牛顿法，牛顿下山法，不同之处是之前是求近似解，类似误差是 0.0001 这样的。而这道题，只要求整数部分，所以先忘掉之前的解法，重新考虑一下。

求 n 的平方根的整数部分，所以平方根一定是 1，2，3 ... n 中的一个数。从一个有序序列中找一个数，像极了二分查找。先取中点 mid，然后判断 mid * mid 是否等于 n，小于 n 的话取左半部分，大于 n 的话取右半部分，等于 n 的话 mid 就是我们要找的了。

```java
public int mySqrt(int x) {
    int L = 1, R = x;
    while (L <= R) {
        int mid = （L + R) / 2;
        int square = mid * mid;
        if (square == x) {
            return mid;
        } else if (square < x) {
            L = mid + 1;
        } else {
            R = mid - 1;
        }
    }
    return ?;
}
```

正常的 2 分法，如果最后没有找到就返回 -1。但这里肯定是不行的，那应该返回什么呢？

对于平方数 4 9 16... 肯定会进入 square == x 然后结束掉。但是非平方数呢？例如 15。我们知道 15 的根，一定是 3 点几。因为 15 在 9 和 16 之间，9 的根是 3，16 的根是 4。所以对于 15，3 在这里就是我们要找的。 3 * 3 < 15，所以在上边算法中，最后的解是流向 square < x 的，所以我们用一个变量保存它，最后返回就可以了。

```java
public int mySqrt(int x) {
    int L = 1, R = x;
    int ans = 0; //保存最后的解
    while (L <= R) {
        int mid = （L + R) / 2;
        int square = mid * mid;
        if (square == x) {
            return mid;
        } else if (square < x) {
            ans = mid; //存起来以便返回
            L = mid + 1;
        } else {
            R = mid - 1;
        }
    }
    return ans;
}
```

看起来很完美了，但如果 x = Integer.MAX_VALUE 的话，下边两句代码是会溢出的。

```java
int mid = （L + R) / 2;
int square = mid * mid;
```

当然，我们把变量用 long 存就解决了，这里有一个更优雅的解法。利用数学的变形。

```java
int mid = L + (R - L) / 2;
int div = x / mid;
```

当然相应的 if 语句也需要改变。

```java
else if (square < x)
mid * mid < x
mid < x / mid
mid < div
```

全部加进去就可以了。

```java
public int mySqrt(int x) {
    int L = 1, R = x;
    int ans = 0;
    while (L <= R) {
        int mid = L + (R - L) / 2;
        int div = x / mid;
        if (div == mid) {
            return mid;
        } else if (mid < div) {
            ans = mid;
            L = mid + 1;
        } else {
            R = mid - 1;
        }
    }
    return ans;
}
```

时间复杂度：O（log ( x））。

空间复杂度：O（1）。

# 解法二 二分法求精确解

把求根转换为求函数的零点，求 n 的平方根，也就是求函数 f ( x ) = x² - n 的零点。这是一个二次曲线，与 x 轴有两个交点，我们要找的是那个正值。

![](https://windliang.oss-cn-beijing.aliyuncs.com/69_2.jpg)

这里基于零点定理，去写算法。

> 如果函数 y = f ( x ) 在区间 [ a, b ] 上的图像是连续不断的一条曲线，并且有f ( a ) · f ( b ) < 0， 那么，函数y = f ( x ) 在区间 ( a , b ) 内有零点，即存在 c ∈ ( a , b ) , 使得 f ( c ) = 0 ，这个 c 也就是方程 f ( x ) = 0 的根。

简单的说，如果曲线上两点的值正负号相反，其间必定存在一个根。

这样我们就可以用二分法，找出中点，然后保留与中点的函数值符号相反的一段，丢弃另一段，然后继续找中点，直到符合我们的误差。

由于题目要求的是整数部分，所以我们需要想办法把我们的精确解转成整数。

四舍五入？由于我们求的是近似解，利用我们的算法我们求出的 8 的立方根会是 2.8125，直接四舍五入就是 3 了，很明显这里 8 的平方根应该是 2。

直接舍弃小数？由于我们是近似解，所有 9 的平方根可能会是 2.999， 舍弃小数变成 2 ，很明显也是不对的。

这里我想到一个解法。

我们先采取四舍五入变成 ans，然后判断 ans * ans 是否大于 n，如果大于 n 了，ans 减 1。如果小于等于，那么 ans 不变。这样的话，求 8 的平方根的例子就被我们解决了。

```java
int ans = (int) Math.round(mid); //先采取四舍五入
if ((long) ans * ans > n) {
    ans--;
}
// 可以不用 long
if (ans > n / ans) {
    ans--;
}
```

合起来就可以了。

```java
//计算 x² - n
public double fx(double x, double n) {
    return x * x - n;
}

public int mySqrt(int n) {
    double low = 0;
    double high = n;
    double mid = (low + high) / 2;
    //函数值小于 0.1 的时候结束
    while (Math.abs(fx(mid, n)) > 0.1) {
        //左端点的函数值
        double low_f = fx(low, n);
        //中间节点的函数值
        double low_mid = fx(mid, n);
        //判断哪一段的函数值是异号的
        if (low_f * low_mid < 0) {
            high = mid;
        } else {
            low = mid;
        }
        mid = (low + high) / 2;
    }
    //先进行四舍五入
    int ans = (int) Math.round(mid);
    if (ans != 0 && ans > n / ans) {
        ans--;
    }
    return ans;
}
```

时间复杂度：

空间复杂度：O（1）。

# 解法三 牛顿法

具体解释可以参考下[这篇文章](https://matongxue.com/madocs/205.html)，或者搜一下， 有很多讲解的，代码的话根据下边的迭代式进行写。

$$x_{k+1}=x_k- f(x_k)/f^{'}(x_k)$$。

这里的话，$$f(x_n) = x^2-n$$ 

$$x_{k+1}=x_k-(x_k^2-n)/2x_k=(x_k^2+n)/2x_k = (x_k + n /x_k)/2$$。

```java
public int mySqrt(int n) {
    double t = n; // 赋一个初值
    while (Math.abs(t * t - n) > 0.1) {
        t = (n / t + t) / 2.0;
    }
    //先进行四舍五入 
    int ans = (int) Math.round(t); 
    //判断是否超出
    if ((long) ans * ans > n) {
        ans--;
    }
    return ans;
}

```

时间复杂度：

空间复杂度：O（1）。

# 总

首先用了正常的二分法，求出整数解。然后用常规的二分法、牛顿法求近似根，然后利用一个技巧转换为整数解。