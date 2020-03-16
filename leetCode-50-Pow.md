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

# 更新

2020.3.16 更新。感谢 [@为爱卖小菜](https://leetcode-cn.com/u/wei-ai-mai-xiao-cai/) 指出，上边的解法虽然都能 `AC`，但是以上全错，少考虑了一种情况。

前边我们分析到 ` -2147483648` 需要单独讨论。

> 但这样的话会出问题，之前在 [29题](https://leetcode.windliang.cc/leetCode-29-Divide-Two-Integers.html) 讨论过，问题出在 n = - n  上，因为最小负数 $$-2^{31}$$取相反数的话，按照计算机的规则，依旧是$$-2^{31}$$，所以这种情况需要单独讨论一下。
>
> ```java
> if (n == -2147483648) {
>     return 0;
> }
> ```

但当 `n = -2147483648` 个时候，并不是所有的 $$x^n$$ 结果都是 `0`。

当 `x` 等于 `-1` 或者 `1` 的时候结果是  `1` 。前边的解法也考虑到了。

下边 `x` 等于 `-1` 的时候我们顺便考虑了 `n` 是其他数的情况，所以没直接返回 `1`。

```java
if (x == -1) {
    if ((n & 1) != 0) {
        return -1;
    } else {
        return 1;
    }
}
if (x == 1.0f)
    return 1;
```

但其实 `x` 是浮点数，我们还少考虑了 `-1` 到 `0` 和 `0` 到 `1` 之间的数，此时的 $$x^n$$ 的结果应该是正无穷。

此外 `x == 0` 的话，数学上是不能算的，这里的话也输出正无穷。

综上，我们的前置条件如下

```java
if (x == -1) {
    if ((n & 1) != 0) {
        return -1;
    } else {
        return 1;
    }
}
if (x == 1.0f){
    return 1;
}

if(n == -2147483648){
    if(x > -1 && x < 1 ){
        return Double.POSITIVE_INFINITY;
    }else{
        return 0;
    }
}
```

上边就是当 `n = -2147483648` 的所有情况了。对于  $$x^n$$，`x` 分成了四种情况。

当 `x == -1` 结果是 `1`，上边的代码我们顺便把 `n` 是其它数的情况也顺便考虑了。

当 `x == 1` 结果是 `1`。

当 `-1 < x < 1` ，结果是正无穷。

当 `x < -1` 或者 `x > 1` ，结果是 `0`。

 [@为爱卖小菜](https://leetcode-cn.com/u/wei-ai-mai-xiao-cai/) 也提供了一个新方法，可以把上边的所有情况统一起来。

因为当 `n = -2147483648` 的时候我们无法正确计算，我们可以把 $$x^{-2147483648}$$  分解成 $$x^{-2147483647} * x^{-1}$$ 。这样的话两部分都可以成功求解了。

对于解法三，可以改写成下边的样子。其他解法也类似。

```java
public double myPow(double x, int n) {
    double mul = 1; 
    if (n > 0) {
        mul = powIteration(x, n);
    } else {
        //单独考虑 n = -2147483648
        if (n == -2147483648) {
            return myPow(x, -2147483647) * (1 / x);
        }
        n = -n;
        mul *= powIteration(x, n);
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



# 总

从一般的方法，到递归，最后的解法，直接从 2 进制考虑，每一个数字，都可以转换成 2 的幂次的和，从而实现了最终的解法。





