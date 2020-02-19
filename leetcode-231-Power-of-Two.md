# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/231.jpg)

判断一个数是不是 `2` 的幂次。

# 思路分析

题目比较简单，有很多解法，看了其他人的解法，各种秀操作，哈哈。解法一和解法二是我开始想到的，后边的解法是其他人的也总结到这里。

# 解法一

介绍一种暴力的方法，判断 `1` 和当前数是否相等，再判断 `2` 和当前数是否相等，再判断 `4` 和当前数是否相等...直到所枚举的数超过了当前数，那么就返回 `false`。至于枚举的数 `1 2 4 8 16...`，可以通过移位得到。

```java
public boolean isPowerOfTwo(int n) {
    int power = 1;
    while (power <= n) {
        if (power == n) {
            return true;
        }
        power = power << 1;
        // if (power == Integer.MIN_VALUE)
        if (power == -2147483648) {
            break;
        }
    }
    return false;
}
```

当然有一点需要注意，需要了解一些补码的知识，参考 [趣谈补码](https://zhuanlan.zhihu.com/p/67227136)。

对于 `int` 类型，最大的 `2` 的幂次是 2 的 30 次方，即`1073741824`，二进制形式是 `0100000...00`。

最大的负数是 `-2147483648`，二进制形式是 `1000000...00`。

可以发现前者左移一位刚好变成了后者，这也是代码中判断是否是 `-2147483648` 的原因，不然的话会造成死循环的。

# 解法二

我们把数字放眼到二进制形式，列举一下 `2` 的幂次。

```java
1 1
2 10
4 100
8 1000
16 10000
...
```

可以发现发现都是 `100...` 的形式，如果做过 [201 题](https://leetcode.wang/leetcode-201-Bitwise-AND-of-Numbers-Range.html)，对 `Integer.highestOneBit` 方法可能还记得。可以实现保留最高位的 `1` ，然后将其它位全部置为 `0`。即，把 `0 0 0 1 X X X X` 变成 `0 0 0 1 0 0 0 0` 。

如果我们对给定的数 `n` 调用这个方法，如果 `n` 是 `2` 的幂次，那么它还是它本身。如果是其他数，由于其它位被置 `0` 了，所以它一定不等于它本身了。

```java
public boolean isPowerOfTwo(int n) {
    if (n == 0 || n == -2147483648) {
        return false;
    }
    return Integer.highestOneBit(n) == n;
}
```

 `0` 和 `-2147483648` 不符合上边的规则，单独考虑，我们可以更干脆一些，小于等于 `0` 的数直接不考虑。

```java
public boolean isPowerOfTwo(int n) {
    if (n <= 0) {
        return false;
    }
    return Integer.highestOneBit(n) == n;
}
```

[201 题](https://leetcode.wang/leetcode-201-Bitwise-AND-of-Numbers-Range.html#解法三) 的解法三对 `highestOneBit` 的源码进行了分析，下边把之前的解析贴过来。

我们调用了库函数 `Integer.highestOneBit`，我们去看一下它的实现。

```java
/**
     * Returns an {@code int} value with at most a single one-bit, in the
     * position of the highest-order ("leftmost") one-bit in the specified
     * {@code int} value.  Returns zero if the specified value has no
     * one-bits in its two's complement binary representation, that is, if it
     * is equal to zero.
     *
     * @param i the value whose highest one bit is to be computed
     * @return an {@code int} value with a single one-bit, in the position
     *     of the highest-order one-bit in the specified value, or zero if
     *     the specified value is itself equal to zero.
     * @since 1.5
     */
public static int highestOneBit(int i) {
    // HD, Figure 3-1
    i |= (i >>  1);
    i |= (i >>  2);
    i |= (i >>  4);
    i |= (i >>  8);
    i |= (i >> 16);
    return i - (i >>> 1);
}
```

它做了什么事情呢？我们从 `return` 入手。

对于 `0 0 0 1 X X X X` ，最终会变成 `0 0 0 1 1 1 1 1`，记做 `i` 。把 `i` 再右移一位变成 `0 0 0 0 1 1 1 1`，然后两数做差。

```java
i       0 0 0 1 1 1 1 1
i >>> 1 0 0 0 0 1 1 1 1   
        0 0 0 1 0 0 0 0
```

就得到了这个函数最后返回的结果了。

将 `0 0 0 1 X X X X` 变成 `0 0 0 1 1 1 1 1`，可以通过复制实现。

第一步，将首位的 `1` 赋值给它的旁边。

```java
i |= (i >>  1);
0 0 0 1 X X X X -> 0 0 0 1 1 X X X

现在首位有两个 1 了，所以就将这两个 1 看做一个整体，继续把 1 赋值给它的旁边。
i |= (i >>  2);
0 0 0 1 1 X X X -> 0 0 0 1 1 1 1 X

现在首位有 4 个 1 了，所以就将这 4 个 1 看做一个整体，继续把 1 赋值给它的旁边。
i |= (i >>  4);
0 0 0 1 1 1 1 X -> 0 0 0 1 1 1 1 1

其实到这里已经结束了，但函数中是考虑最坏的情况，类似于这种 1000000...00, 首位是 1, 有 31 个 0
```

我们可以把上边的源码直接放过来。

```java
public boolean isPowerOfTwo(int n) {
    if (n <= 0) {
        return false;
    }
    int i = n;
    i |= (i >> 1);
    i |= (i >> 2);
    i |= (i >> 4);
    i |= (i >> 8);
    i |= (i >> 16);
    i = i - (i >>> 1);
    return i == n;
}
```

上边的解法是我开始想到的，下边的解法全部来自 [这里](https://leetcode.com/problems/power-of-two/discuss/63966/4-different-ways-to-solve-Iterative-Recursive-Bit-operation-Math)，分享一下。

# 解法三

一直进行除以 `2`，直到不是 `2` 的倍数。

```java
public boolean isPowerOfTwo(int n) {
    if (n == 0) return false;
    while (n % 2 == 0) {
        n /= 2;
    }
    return n == 1;
}
```

也可以改写成递归的形式。

```java
public boolean isPowerOfTwo(int n) {
    return n > 0 && (n == 1 || (n%2 == 0 && isPowerOfTwo(n/2)));
}
```

# 解法四

做过 [191 题](https://leetcode.wang/leetcode-191-Number-of-1-Bits.html) 的话，对一个 `trick` 应该有印象。

有一个方法，可以把最右边的 `1` 置为 `0`，举个具体的例子。

比如十进制的 `10`，二进制形式是 `1010`，然后我们只需要把它和 `9` 进行按位与操作，也就是 `10 & 9 = (1010) & (1001) = 1000`，也就是把 `1010` 最右边的 `1` 置为 `0`。

规律就是对于任意一个数 `n`，然后 `n & (n-1)` 的结果就是把 `n` 的最右边的 `1` 置为 `0` 。

也比较好理解，当我们对一个数减 `1` 的话，比如原来的数是 `...1010000`，然后减一就会向前借位，直到遇到最右边的第一个 `1`，变成 `...1001111`，然后我们把它和原数按位与，就会把从原数最右边 `1` 开始的位置全部置零了 `...10000000`。

有了这个知识，我们看一下解法二列举的 `2` 的幂次，只有一个 `1`，如果通过 `n&(n-1)`，那么就会变成 `0` 了。

同样的  `0` 和 `-2147483648` 不符合上边的规则，需要单独考虑。又因为所有负数一定不是 `2` 的幂次，所以代码可以写成下边的样子。

```java
public boolean isPowerOfTwo(int n) {
    if (n <= 0) {
        return false;
    }
    return (n & (n - 1)) == 0;
}
```

# 解法五

`java` 中还有一个方法 `Integer.bitCount(n)`，返回 `n` 的二进制形式的 `1` 的个数。

```java
public boolean isPowerOfTwo(int n) {
    if (n <= 0) {
        return false;
    }
    return Integer.bitCount(n) == 1;
}
```

同样的，我们学习一下 `bitCount` 的源码。

```java
/**
     * Returns the number of one-bits in the two's complement binary
     * representation of the specified {@code int} value.  This function is
     * sometimes referred to as the <i>population count</i>.
     *
     * @param i the value whose bits are to be counted
     * @return the number of one-bits in the two's complement binary
     *     representation of the specified {@code int} value.
     * @since 1.5
     */
public static int bitCount(int i) {
    // HD, Figure 5-2
    i = i - ((i >>> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
    i = (i + (i >>> 4)) & 0x0f0f0f0f;
    i = i + (i >>> 8);
    i = i + (i >>> 16);
    return i & 0x3f;
}
```

[191 题](https://leetcode.wang/leetcode-191-Number-of-1-Bits.html) 题目就是求二进制 `1` 的个数，其中解法三介绍的其实就是上边的解法，我把解释贴过来。

有点类似于 [190 题](https://leetcode.wang/leetcode-190-Reverse-Bits.html) 的解法二，通过整体的位操作解决问题，参考 [这里](https://leetcode.com/problems/number-of-1-bits/discuss/55120/Short-code-of-C%2B%2B-O(m)-by-time-m-is-the-count-of-1's-and-another-several-method-of-O(1)-time) ，也是比较 `trick` 的，不容易想到，但还是很有意思的。

本质思想就是用本身的比特位去记录对应位数的比特位 `1` 的个数，举个具体的例子吧。为了简洁，求一下 `8` 比特的数字中 `1` 的个数。

```java
统计数代表对应括号内 1 的个数
1   1   0   1   0   0   1   1
首先把它看做 8 组，统计每组 1 的个数
原数字：(1)   (1)   (0)   (1)   (0)   (0)   (1)   (1)
统计数：(1)   (1)   (0)   (1)   (0)   (0)   (1)   (1)
每个数字本身，就天然的代表了当前组 1 的个数。

接下来看做 4 组，相邻两组进行合并，统计数其实就是上边相邻组统计数相加即可。
原数字：(1    1)   (0    1)   (0   0)   (1  1)
统计数：(1    0)   (0    1)   (0   0)   (1  0)
十进制：   2           1         0         2        

接下来看做 2 组，相邻两组进行合并，统计数变成上边相邻组统计数的和。
原数字：(1    1     0    1)   (0   0     1  1)
统计数：(0    0     1    1)   (0   0     1  0)
十进制：         3                   2  
    
接下来看做 1 组，相邻两组进行合并，统计数变成上边相邻组统计数的和。
原数字：(1    1     0    1     0   0     1  1)
统计数：(0    0     0    0     0   1     0  1)
十进制：                   5          
```

看一下 「统计数」的变化，也就是统计的 `1` 的个数。

看下二进制形式的变化，两两相加。

![](https://windliang.oss-cn-beijing.aliyuncs.com/191_2.jpg)

看下十进制形式的变化，两两相加。

![](https://windliang.oss-cn-beijing.aliyuncs.com/191_3.jpg)

最后我们就的得到了 `1` 的个数是 `5`。

所以问题的关键就是怎么实现每次合并相邻统计数，我们可以通过位操作实现，举个例子。

比如上边 `4` 组到 `2` 组中的前两组合成一组的变化。要把 `(1  0)   (0  1)` 两组相加，变成 `(0   0   1   1)` 。其实我们只需要把 `1001` 和 `0011` 相与得到低两位，然后把 `1001` 右移两位再和 `0011` 相与得到高两位，最后将两数相加即可。也就是`(1001) & (0011)  + (1001) >>> 2 & (0011)= 0011`。

扩展到任意情况，两组合并成一组，如果合并前每组的个数是 `n`，合并前的数字是 `x`，那么合并后的数字就是 `x & (000...111...) + x >>> n & (000...111...) `，其中 `0` 和 `1` 的个数是 `n`。

```java
public int hammingWeight(int n) {
    n = (n & 0x55555555) + ((n >>> 1) & 0x55555555); // 32 组向 16 组合并，合并前每组 1 个数
    n = (n & 0x33333333) + ((n >>> 2) & 0x33333333); // 16 组向 8 组合并，合并前每组 2 个数
    n = (n & 0x0f0f0f0f) + ((n >>> 4) & 0x0f0f0f0f); // 8 组向 4 组合并，合并前每组 4 个数
    n = (n & 0x00ff00ff)+ ((n >>> 8) & 0x00ff00ff); // 4 组向 2 组合并，合并前每组 8 个数
    n = (n & 0x0000ffff) + ((n >>> 16) & 0x0000ffff); // 2 组向 1 组合并，合并前每组 16 个数
    return n;
}
```

写成 `16` 进制可能不好理解，我们拿16 组向 8 组合并举例，合并前每组 2 个数。也就是上边我们推导的，我们要把  `(1  0)   (0  1)` 两组合并，需要和 `0011` 按位与，写成 `16` 进制就是 `3`，因为合并完是 `8` 组，所以就是 `8` 个 `3`，即 `0x33333333`。

再回到 `java` 的源码。

```java
public static int bitCount(int i) {
    // HD, Figure 5-2
    i = i - ((i >>> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
    i = (i + (i >>> 4)) & 0x0f0f0f0f;
    i = i + (i >>> 8);
    i = i + (i >>> 16);
    return i & 0x3f;
}
```

第一步写法不一样，也很好理解。结合下边的图看，

![](https://windliang.oss-cn-beijing.aliyuncs.com/191_2.jpg)

第一步要做的就是把 `11 -> 10`，`01 - > 01`，`00 -> 00`，`10 -> 01`。

其实就是原来的数减去高位的数，`11 - 1 = 10`, `01 - 0 = 01`，`00 - 0 = 00`，`10 - 1 = 01`。

第二步一致。

第三步，没有与完相加，而是先相加再相与，之所以可以这么做，是因为四位的话最多就是 `4` 个 `1`，也就是 `0100` 和 `0100` 合并，结果最多也就是 `4` 位，所以只需要最后和 `0f` 相与，将高四位置零即可。

第四步和第五步没有相与，是因为最多 `32` 个 `1`，用二进制表示就是 `100000`，所以只需要低 `6` 位的结果，高 `8` 位是什么已经不重要了，也就不需要通过相与置零了，最后只需要和 `0x3f(111111)` 相与取得我们的结果即可。

# 解法六

前边提到对于 `int` 类型，最大的 `2` 的幂次是 2 的 30 次方，即`1073741824`。对于 `n` 分两种情况讨论。

* 如果 `n` 是 `2` 的幂次，那么 $$n=2^k$$

  $$2^{30}=2^k*2^{30-k}$$，所以 $$2^{30} \% 2^k==0$$。

* 如果 `n` 不是 `2` 的幂次，那么 $$n = j * 2^k$$，其中 `j` 是一个奇数，因为 `n` 一直进行除以 `2` 可以得到 `k`，直到不能被 `2` 整除，此时一定是奇数，也就是公式中的 `j`。

  $$2^{30} \% (j * 2^k) = 2^{30-k} \% j!=0$$。

综上所述，通过是否能被 `2` 的 `30` 次方，即`1073741824` 整除，即可解决我们的问题。

 ```java
public boolean isPowerOfTwo(int n) {
    if (n <= 0) {
        return false;
    }
    return 1073741824 % n == 0;
}
 ```

# 解法七

超级暴力打表法，因为 `int` 范围内 `2` 的幂次也只有 `32` 个数。

```java
public boolean isPowerOfTwo(int n) {
    return new HashSet<>(Arrays.asList(1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608,16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824)).contains(n);
}
```

# 总

这道题的话使用了很多二进制的技巧，因为题目本身比较简单，所以就是各种大神秀操作了，哈哈，大概是解法最多的一道题了。