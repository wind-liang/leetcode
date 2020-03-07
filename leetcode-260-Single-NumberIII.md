# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/260.jpg)

所有数字都出现了两次，只有两个数字都只出现了 `1` 次，找出这两个数字。

# 解法一

最直接的方法，统计每个数出现的次数。使用 `HashMap` 或者 `HashSet`，由于每个数字最多出现两次，我们可以使用 `HashSet`。

遍历数组，遇到的数如果 `HashSet` 中存在，就把这个数删除。如果不存在，就把它加入到 `HashSet` 中。最后 `HashSet` 中剩下的两个数就是我们要找的了。

```java
public int[] singleNumber(int[] nums) {
    HashSet<Integer> set = new HashSet<>();
    for (int n : nums) {
        if (set.contains(n)) {
            set.remove(n);
        } else {
            set.add(n);
        }
    }
    int[] result = new int[2];
    int i = 0;
    for (int n : set) {
        result[i] = n;
        i++;
    }
    return result;
}
```

# 解法二

我们之前做过 [136 题](https://leetcode.wang/leetcode-136-Single-Number.html) ，当时是所有数字都是成对出现的，只有一个数字是落单的，找出这个落单的数字。其中介绍了异或的方法，把之前的介绍先粘贴过来。

还记得位操作中的异或吗？计算规则如下。

> 0 ⊕ 0 = 0
>
> 1 ⊕ 1 = 0
>
> 0 ⊕ 1 = 1
>
> 1 ⊕ 0 = 1

总结起来就是相同为零，不同为一。

根据上边的规则，可以推导出一些性质

- 0 ⊕ a = a
- a ⊕ a = 0

此外异或满足交换律以及结合律。

所以对于之前的例子 `a b a b c c d` ，如果我们把给定的数字相互异或会发生什么呢？

```java
  a ⊕ b ⊕ a ⊕ b ⊕ c ⊕ c ⊕ d
= ( a ⊕ a ) ⊕ ( b ⊕ b ) ⊕ ( c ⊕ c ) ⊕ d
= 0 ⊕ 0 ⊕ 0 ⊕ d
= d
```

然后我们就找出了只出现了一次的数字。

这道题的话，因为要寻找的是两个数字，全部异或后不是我们所要的结果。介绍一下 [这里](https://leetcode.com/problems/single-number-iii/discuss/68900/Accepted-C%2B%2BJava-O(n)-time-O(1)-space-Easy-Solution-with-Detail-Explanations) 的思路。

如果我们把原数组分成两组，只出现过一次的两个数字分别在两组里边，那么问题就转换成之前的老问题了，只需要这两组里的数字各自异或，答案就出来了。

那么通过什么把数组分成两组呢？

放眼到二进制，我们要找的这两个数字是不同的，所以它俩至少有一位是不同的，所以我们可以根据这一位，把数组分成这一位都是 `1` 的一类和这一位都是 `0` 的一类，这样就把这两个数分到两组里了。

那么怎么知道那两个数字哪一位不同呢？

回到我们异或的结果，如果把数组中的所有数字异或，最后异或的结果，其实就是我们要找的两个数字的异或。而异或结果如果某一位是 `1`，也就意味着当前位两个数字一个是 `1` ，一个是 `0`，也就找到了不同的一位。

思路就是上边的了，然后再考虑代码怎么写。

怎么把数字分类？

我们构造一个数，把我们要找的那两个数字二进制不同的那一位写成 `1`，其它位都写 `0`，也就是 `0...0100...000` 的形式。

然后把构造出来的数和数组中的数字相与，如果结果是 `0`，那就意味着这个数属于当前位为 `0` 的一类。否则的话，就意味着这个数属于当前位为 `1` 的一类。

怎么构造 `0...0100...000` 这样的数。

由于我们异或得到的数可能不只一位是 `1`，可能是这样的 `0100110`，那么怎么只留一位是 `1` 呢？

方法有很多了。

比如，[201 题](https://leetcode.wang/leetcode-201-Bitwise-AND-of-Numbers-Range.html) 解法三介绍的 `Integer.highestOneBit` 方法，它可以保留某个数的最高位的 `1`，其它位全部置 `0`，源码的话当时也介绍了，可以过去看一下。

最后，总结下我们的算法，我们通过要找的两个数字的某一位不同，将原数组分成两组，然后组内分别进行异或，最后要找的数字就是两组分别异或的结果。

然后举个具体的例子，来理解一下算法。

```java
[1,2,1,3,2,5]

1 = 001
2 = 010
1 = 001
3 = 011
2 = 010
5 = 101

把上边所有的数字异或，最后得到的结果就是 3 ^ 5 = 6 (110) 

然后对 110 调用 Integer.highestOneBit 方法就得到 100, 我们通过倒数第三位将原数组分类

倒数第三位为 0 的组
1 = 001
2 = 010
1 = 001
3 = 011
2 = 010

倒数第三位为 1 的组    
5 = 101

最后组内数字依次异或即可。
```

再结合代码，理解一下。

```java
public int[] singleNumber(int[] nums) {
    int diff = 0;
    for (int n : nums) {
        diff ^= n;
    }
    diff = Integer.highestOneBit(diff);
    int[] result = { 0, 0 };
    for (int n : nums) {
        //当前位是 0 的组, 然后组内异或
        if ((diff & n) == 0) {
            result[0] ^= n;
        //当前位是 1 的组
        } else {
            result[1] ^= n;
        }
    }
    return result;
}
```

[这里](https://leetcode.com/problems/single-number-iii/discuss/69007/C-O(n)-time-O(1)-space-7-line-Solution-with-Detail-Explanation) 提出了一个小小的改进。

假如我们要找的数字是 `a` 和 `b`，一开始我们得到 `diff = a ^ b`。然后通过异或我们分别求出了 `a` 和 `b` 。

其实如果我们知道了 `a`，`b` 的话可以通过一次异或就能得到，`b = diff ^ a` 。

```java
public int[] singleNumber(int[] nums) {
    int diff = 0;
    for (int n : nums) {
        diff ^= n;
    }
    int diff2 = Integer.highestOneBit(diff);
    int[] result = { 0, 0 };
    for (int n : nums) {
        //当前位是 0 的组, 然后组内异或
        if ((diff2 & n) == 0) {
            result[0] ^= n;
        } 
    }
    result[1] = diff ^ result[0];
    return result;
}
```

得到只有一位 `1` 的数，除了 `Integer.highestOneBit` 的方法还有其他的做法。

[这里](https://leetcode.com/problems/single-number-iii/discuss/68900/Accepted-C%2B%2BJava-O(n)-time-O(1)-space-Easy-Solution-with-Detail-Explanations) 的做法。

```java
 diff &= -diff;
```

取负号其实就是先取反，再加 `1`，需要 [补码](https://zhuanlan.zhihu.com/p/67227136) 的知识。最后再和原数相与就会保留最低位的 `1`。比如 `1010`，先取反是 `0101`，再加 `1`，就是 `0110`，再和 `1010` 相与，就是 `0010` 了。

还有 [这里](https://leetcode.com/problems/single-number-iii/discuss/68921/C%2B%2B-solution-O(n)-time-and-O(1)-space-easy-understaning-with-simple-explanation) 的做法。

```java
 diff = (diff & (diff - 1)) ^ diff;
```

`n & (n - 1)` 的操作我们在 [191 题](https://leetcode.wang/leetcode-191-Number-of-1-Bits.html) 用过，它可以将最低位的 `1` 置为 `0`。比如 `1110`，先将最低位的 `1` 置为  `0` 就变成 `1100`，然后再和原数 `1110` 异或，就得到了 `0010` 。

还有 [这里](https://leetcode.com/problems/single-number-iii/discuss/68923/Bit-manipulation-beats-99.62) 的做法。

```java
diff = xor & ~(diff - 1);
```

先减 `1`，再取反，再相与。比如 `1010` 减 `1` 就是 `1001`，然后取反 `0110`，然后和原数 `1010` 相与，就是 `0010` 了。

还有 [这里](https://leetcode.com/problems/single-number-iii/discuss/342714/Best-Explanation-C%2B%2B) 的做法。

```java
int mask=1;
while((diff & mask)==0)
{
    mask<<=1;
}
//mask 就是我们要构造的了
```

这个方法比较直接，依次判断哪一位是 `1`。

# 总

解法一的话经常用了，最容易想到的方法。

解法二的话，将问题转换成基本问题，这个思想经常用到，但有时候也比较难想。后边总结的得到只包含一个 `1`  的二进制的各种骚操作比较有意思。