# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/50.jpg)

就是求幂次方。

# 解法一

求幂次方，用最简单的想法，就是写一个 for 循环累乘。

至于求负幂次方，比如 $$2^{-10}$$，可以先求出 $$2^{10}$$，然后取倒数，$$1/2^{10}$$ ，就可以了。

```java
double mul = 1;
if (n > 0) {
    for (int i = 0; i < n; i++) {
        mul *= x;
    }
} else {
    n = -n;
    for (int i = 0; i < n; i++) {
        mul *= x;
    }
    mul = 1 / mul;
}
```

但这样的话会出问题，之前在[29题](https://leetcode.windliang.cc/leetCode-29-Divide-Two-Integers.html)讨论过，问题出在 n = - n  上，因为最小负数 $$-2^{31}$$取相反数的话，按照计算机的规则，依旧是$$-2^{31}$$，所以这种情况需要单独讨论一下。

```java
if (n == -2147483648) {
    return 0;
}
```

当然，这样做的话 -1 ，和 1 也需要单独讨论下，因为他们的任意次方都是 1 或者 -1 。

```java
if (x == -1) {
    if ((n & 1) != 0) { //按位与不等于 0 ，说明是奇数
        return -1;
    } else {
        return 1;
    }
}
if (x == 1.0)
    return 1;
```

综上，代码就出来了。

```java
public double myPow(double x, int n) {
    if (x == -1) {
        if ((n & 1) != 0) {
            return -1;
        } else {
            return 1;
        }
    }
    if (x == 1.0)
        return 1;

    if (n == -2147483648) {
        return 0;
    }
    double mul = 1;
    if (n > 0) {
        for (int i = 0; i < n; i++) {
            mul *= x;
        }
    } else {
        n = -n;
        for (int i = 0; i < n; i++) {
            mul *= x;
        }
        mul = 1 / mul;
    }
    return mul;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二 递归

对于上边的解法，太慢了。可以优化下，类似于[29题](https://leetcode.windliang.cc/leetCode-29-Divide-Two-Integers.html)的思路。乘法的话，我们不用一次一次的相乘，得到 2 次方后，我们可以直接把 2 次方的结果相乘，就可以得到 4 次方，得到 4 次方的结果再相乘，就是 8 次方了，这样的话就会快很多了。

直接利用递归吧

对于 n 是偶数的情况，$$x^n=x^{n/2}*x^{n/2}$$。

对于 n 是奇数的情况，$$x^n=x^{n/2}*x^{n/2}*x$$。

```java
public double powRecursion(double x, int n) {
    if (n == 0) {
        return 1;
    }
    //偶数的情况
    if ((n & 1) == 0) { 
        double temp = powRecursion(x, n / 2);
        return temp * temp;
    } else { //奇数的情况
        double temp = powRecursion(x, n / 2);
        return temp * temp * x;
    }
}

public double myPow(double x, int n) {
    if (x == -1) {
        if ((n & 1) != 0) {
            return -1;
        } else {
            return 1;
        }
    }
    if (x == 1.0f)
        return 1;

    if (n == -2147483648) {
        return 0;
    }
    double mul = 1;
    if (n > 0) {
        mul = powRecursion(x, n);
    } else {
        n = -n;
        mul = powRecursion(x, n);
        mul = 1 / mul;
    }
    return mul;
}
```

时间复杂度：O（log（n）)。

空间复杂度：

当然对于这种递归的解法的话，还有一些其他的思路，参考[这里](https://leetcode.com/problems/powx-n/discuss/19546/Short-and-easy-to-understand-solution)。

递归思路是下边的样子

$$x^n=(x*x)^{n/2}$$ ， 对于 n 是偶数的情况。 

$$x^n=(x*x)^{n/2}*x$$，对于 n 是奇数的情况，

代码就很好写了。

```java
public double powRecursion(double x, int n) {
    if (n == 0) {
        return 1;
    }
    //偶数的情况
    if ((n & 1) == 0) { 
        return powRecursion(x * x, n / 2);
    } else { //奇数的情况 
        return powRecursion(x * x, n / 2) * x;
    }
}

public double myPow(double x, int n) {
    if (x == -1) {
        if ((n & 1) != 0) {
            return -1;
        } else {
            return 1;
        }
    }
    if (x == 1.0f)
        return 1;

    if (n == -2147483648) {
        return 0;
    }
    double mul = 1;
    if (n > 0) {
        mul = powRecursion(x, n);
    } else {
        n = -n;
        mul = powRecursion(x, n);
        mul = 1 / mul;
    }
    return mul;
}
```

时间复杂度：O（log（n）)。

空间复杂度：

# 解法三 迭代

这里介绍种全新的解法，开始的时候受前边思路的影响，一直没理解。下午问同学，同学立刻想到了自己在《编程之美》看到的解法，这里分享下。

以 x 的 10 次方举例。10 的 2 进制是 1010，然后用 2 进制转 10 进制的方法把它展成 2 的幂次的和。

$$x^{10}=x^{(1010)_2}=x^{1*2^3+0*2^2+1*2^1+0*2^0}=x^{1*2^3}*x^{0*2^2}x^{1*2^1}*x^{0*2^0}$$

这样话，再看一下下边的图，它们之间的对应关系就出来了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/50_2.jpg)

2 进制对应 1 0 1 0，我们把对应 1 的项进行累乘就可以了，而要进行累乘的项也是很有规律，前一项是后一项的自乘。$$x^8=x^4*x^4$$。我们可以从最右边一位，开始迭代。看下代码吧。

```java
public double myPow(double x, int n) {
    if (x == -1) {
        if ((n & 1) != 0) {
            return -1;
        } else {
            return 1;
        }
    }
    if (x == 1.0f)
        return 1;

    if (n == -2147483648) {
        return 0;
    }
    double mul = 1;
    if (n > 0) {
        mul = powIteration(x, n);
    } else {
        n = -n;
        mul = powIteration(x, n);
        mul = 1 / mul;
    }
    return mul;
}

public double powIteration(double x, int n) {
    double ans = 1;
    //遍历每一位
    while (n > 0) {
        //最后一位是 1，加到累乘结果里
        if ((n & 1) == 1) {
            ans = ans * x;
        }
        //更新 x
        x = x * x;
        //n 右移一位
        n = n >> 1;
    }
    return ans;
}
```

时间复杂度：log（n）。

空间复杂度：O（1）。

# 总

从一般的方法，到递归，最后的解法，直接从 2 进制考虑，每一个数字，都可以转换成 2 的幂次的和，从而实现了最终的解法。





