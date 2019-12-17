# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/201.jpg)

给一个闭区间的范围，将这个范围内的所有数字相与，返回结果。例如 `[5, 7]` 就返回 `5 & 6 & 7`。

# 解法一 暴力

写一个 `for` 循环，依次相与即可。

```java
public int rangeBitwiseAnd(int m, int n) {
    int res = m;
    for (int i = m + 1; i <= n; i++) {
        res &= i;
    }
    return res;
}
```

然后会发现时间超时了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/201_2.jpg)

当范围太大的话会造成超时，这里优化的话想法也很很简单。我们只需要在 `res == 0` 的时候提前出 `for` 循环即可。

```java
public int rangeBitwiseAnd(int m, int n) {
    int res = m;
    for (int i = m + 1; i <= n; i++) {
        res &= i;
        if(res == 0){
            return 0;
        }
    }
    return res;
}
```

但接下来遇到了 `wrong answer` 。

![](https://windliang.oss-cn-beijing.aliyuncs.com/201_3.jpg)

把这个样例再根据代码理一遍，就会发现大问题了，根本原因就是补码的原因，可以看一下 [趣谈计算机补码](https://zhuanlan.zhihu.com/p/67227136)。

右边界 `n` 是 `2147483647`，也就是 `Integer` 中最大的正数，二进制形式是 `01111...1`，其中有 `31` 个 `1`。在代码中当 `i` 等于 `n` 的时候依旧会进入循环。出循环执行 `i++`，我们期望它变成 `2147483647 + 1 = 2147483648`，然后跳出 `for` 循环。事实上，对 `2147483647` 加 `1`，也就是 `01111...1` 加 `1`，变成了 `1000..000`，其中有 `31` 个 `1`。而这个二进制在补码中表示的是 `-2147483648`。因此我们依旧会进入 `for` 循环，以此往复，直到结果是 `0` 才出了 `for` 循环。。

知道了这个，我们只需要判断 `i == 2147483647` 的话，就跳出 `for` 循环即可。

```java
public int rangeBitwiseAnd(int m, int n) {
    //m 要赋值给 i，所以提前判断一下
    if(m == Integer.MAX_VALUE){
        return m;
    }
    int res = m;
    for (int i = m + 1; i <= n; i++) {
        res &= i;
        if(res == 0 ||  i == Integer.MAX_VALUE){
            break;
        }
    }
    return res;
}
```

上边的解法就是我能想到的了，然后就去逛 `Discuss` 了，简直大开眼界。下边分享一下，主要是两种思路。

# 解法二

参考 [这里](https://leetcode.com/problems/bitwise-and-of-numbers-range/discuss/56729/Bit-operation-solution(JAVA)) 。

我们只需要一个经常用的一个思想，去考虑子问题。我们现在要做的是把从 `m` 到 `n` 的所有数字的 `32` 个比特位依次相与。直接肯定不能出结果，如果要是只考虑 `31` 个比特位呢，还是不能出结果。然后依次降低规模，`30`、`29` ... `3`，`2` 直到 `1`。如果让你说出从 `m` 到 `n` 的数字全部相与，最低位的结果是多少呢？

最低位会有很多数相与，要么是 `0` ，要么是 `1`，而出现了 `0` 的话相与的结果一定会是 `0`。

只看所有数的最低位变化情况，`m` 到 `n` 的话，要么从 `0` 开始递增，`01010101...`，要么从 `1` 开始递增 `10101010...`。

因此，参与相与的数中最低位要么在第一个数字第一次出现 `0` ，要么在第二个数字出现第一次出现 `0` 。

如果 `m < n`，也就是参与相与的数字的个数至少有两个，所以一定会有 `0` 的出现，所以相与结果一定是 `0`。

看具体的例子，`[5,7]`。

```java
最低位序列从 1 开始递增, 也就是最右边的一列 101
m 5 1 0 1
  6 1 1 0
n 7 1 1 1
        0
```

此时 `m < n`，所以至少会有两个数字，所以最低位相与结果一定是 `0`。

解决了最低位的问题，我们只需要把 `m` 和 `n` 同时右移一位。然后继续按照上边的思路考虑新的最低位的结果即可。

而当 `m == n` 的时候，很明显，结果就是 `m` 了。

代码中，我们需要用一个变量 `zero` 记录我们右移的次数，也就是最低位 `0` 的个数。

```java
public int rangeBitwiseAnd(int m, int n) {
    int zeros = 0;
    while (n > m) {
        zeros++;
        m >>>= 1;
        n >>>= 1;
    }
    //将 0 的个数空出来
    return m << zeros;
}
```

然后还有一个优化的手段，在  [191 题](https://leetcode.wang/leetcode-191-Number-of-1-Bits.html) 介绍过一个把二进制最右边 `1` 置为 `0` 的方法，在这道题中也可以用到。

> 有一个方法，可以把最右边的 `1` 置为 `0`，举个具体的例子。
>
> 比如十进制的 `10`，二进制形式是 `1010`，然后我们只需要把它和 `9` 进行按位与操作，也就是 `10 & 9 = (1010) & (1001) = 1000`，也就是把 `1010` 最右边的 `1` 置为 `0`。
>
> 规律就是对于任意一个数 `n`，然后 `n & (n-1)` 的结果就是把 `n` 的最右边的 `1` 置为 `0` 。
>
> 也比较好理解，当我们对一个数减 `1` 的话，比如原来的数是 `...1010000`，然后减一就会向前借位，直到遇到最右边的第一个 `1`，变成 `...1001111`，然后我们把它和原数按位与，就会把从原数最右边 `1` 开始的位置全部置零了 `...10000000`。

这里的话我们考虑一种可以优化的情况，我们直接用 `n` 这个变量去保存最终的结果，只需要考虑 `n` 的低位的 `1` 是否需要置为 `0`。

```java
m X X X X X X X X
  ...
n X X X X 1 0 0 0

此时 m < n，上边的解法中然后我们会依次进行右移，我们考虑把 n 低位的 0 移光直到 1 移动到最低位

m2 X X X X X
  ...
n2 X X X X 1

此时如果 m2 < n2，那么我们就可以确定最低位相与的结果一定是 0
    
回到开头 , n 的低位都是 0, 所以从 m < n 一定可以推出 m2 < n2, 所以最终结果的当前位一定是 0

因此，如果 m < n ，我们只需要把 n ，也就是 X X X X 1 0 0 0 的最右边的 1 置 0, 然后继续考虑。
```

代码的话，用前边介绍的 `n & (n - 1)`。

```java
public int rangeBitwiseAnd(int m, int n) {
    int zeros = 0;
    while (n > m) {
        n = n & (n - 1);
    }
    return n;
}
```

# 解法三

参考了 [这篇](https://leetcode.com/problems/bitwise-and-of-numbers-range/discuss/56827/Fast-three-line-C%2B%2B-solution-and-explanation-with-no-loops-or-recursion-and-one-extra-variable) 和 [这篇](https://leetcode.com/problems/bitwise-and-of-numbers-range/discuss/56735/Java-8-ms-one-liner-O(log(32))-no-loop-no-explicit-log)。

解法的关键就是去考虑这样一个问题，一个数大于一个数意味着什么？或者说，怎么判断一个数大于一个数？

在十进制中，我们只需要从高位向低位看去，直到某一位不相同，大小也就判断了出来。

比如 `6489...` 和 `6486...`，由于 `9 > 6`，所以不管后边的位是什么 `6489...` 一定会大于 ``6486...`` 。

那么对于二进制呢？

一样的道理，但因为二进制只有两个数 `0` 和 `1`，所以当出现某一位大于另一位的时候，一定是 `1 > 0`。

所以对于 `[m n]`，如果 `m < n`，那么一定是下边的形式。

```java
m S S S 0 X X X X
n S S S 1 X X X X
```

前边的若干位都相同，然后从某一位开始从 `0` 变成 `1`。

所有数字相与的结果，结合解法一的结论，如果 `n > m`，最低位相与后是 `0`。最后一定是 `S S S 0 0 0 0 0` 的形式。

因为高位保证了 `m` 和 `n` 同时右移以后，依旧是 `n > m`。

```java
m S S S 0 X X X X
n S S S 1 X X X X

此时 n > m, 所以最低位结果是 0

然后 m 和 n 同时右移

m S S S 0 X X X
n S S S 1 X X X
依旧是 n > m, 所以最低位结果是 0
```

因此相与结果最低位一直是 `0`，一直到 `S S S` 。所以最终结果就是 `S S S 0 0 0 0 0`。

其实和解法一的第二种思想有些类似，解法一中我们是从右往左依次将 `1` 置为 `0`。而在这里，我们从左往右看，找到第一个 `0` 和 `1`，就保证了移位过程中一定是 `n > m`。

知道了这个结论，我们只需要把 `m` 和 `11..1X0..00` 相与即可。上边例子中，我们只需要把 `S S S 0 X X X` 和 `1 1 1 X 0 0 0` 相与即可。

那么怎么得到 `1 1 1 X 0 0 0` 呢？

再观察一下，`m` 和 `n`。

```java
m S S S 0 X X X X
n S S S 1 X X X X
```

我们如果把 `m` 和 `n` 进行异或操作，结果就是 `0 0 0 1 X X X X`。

对比一下异或后的结果和最后我们需要的结果。

```java
当前结果 0 0 0 1 X X X X
最后结果 1 1 1 X 0 0 0 0   
```

首先我们需要将低位全部变成 `0`。

```java
当前结果 0 0 0 1 0 0 0 0
最后结果 1 1 1 X 0 0 0 0   
```

`java` 中有个方法可以实现，`Integer.highestOneBit`，可以实现保留最高位的 `1` ,然后将其它位全部置为 `0`。即，把 `0 0 0 1 X X X X` 变成 `0 0 0 1 0 0 0 0` 。

继续看上边的对比，接下来我们要把高位的 `0` 变为 `1`，通过取反操作，变成下边的结果。

```java
当前结果 1 1 1 0 1 1 1 1
最后结果 1 1 1 X 0 0 0 0
```

然后再在当前结果加 `1`，就实现了我们的转换。

```java
当前结果 1 1 1 1 0 0 0 0
最后结果 1 1 1 X 0 0 0 0
```

把最终得到的结果和 `m` 相与即可，`m == n` 的情况单独考虑。

```java
public int rangeBitwiseAnd(int m, int n) {
    if (m == n) {
        return m;
    }
    return m & ~Integer.highestOneBit(m ^ n) + 1;
}
```

结合 [补码](https://zhuanlan.zhihu.com/p/67227136) 的知识，「按位取反，末尾加 1」其实相当于取了一个相反数，[29 题](https://leetcode.wang/leetCode-29-Divide-Two-Integers.htmlhttps://leetcode.wang/leetCode-29-Divide-Two-Integers.html) 中我们也运用过这个结论。所以代码可以写的更简洁一些。

```java
public int rangeBitwiseAnd(int m, int n) {
    return m == n ? m : m & -Integer.highestOneBit(m ^ n);
}
```

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

它做了什么事情呢？

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

通过移位变成了 `0 0 0 1 1 1 1 1`，回想一下我们之前分析的，我们需要 `1 1 1 X 0 0 0` 的结果，和当前移位后的结果对比，我们只需要取反就可以得到了，最后和 `m` 相与即可。

```java
public int rangeBitwiseAnd(int m, int n) {
    if (m == n) {
        return m;
    }
    int i = m ^ n;
    i |= (i >>> 1);
    i |= (i >>> 2);
    i |= (i >>> 4);
    i |= (i >>> 8);
    i |= (i >>> 16);
    return m & ~i;
}
```

# 总

解法一只要注意溢出的问题即可。

解法二考虑的时候是从右往左考虑，解法三是从左往右考虑，但是殊途同归，本质上，两种解法都是求了两个数字的最长相同前缀，然后低位补零。

解法二中，我们不停的右移或者将右边的 `1` 置为 `0`，就是把不是相同前缀的部分置为 `0`，直到二者相等，也就是只剩下了相同前缀。

解法三中，通过异或，直接把相同前缀部分置为了 `0`。然后通过某种方法把相同前缀对应部分置为 `1` 来提取相同前缀。

这个题，太神奇了，太妙了！