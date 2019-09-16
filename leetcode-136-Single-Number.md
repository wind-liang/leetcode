# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/136.jpg)

所有数字都是成对出现的，只有一个数字是落单的，找出这个落单的数字。

# 解法一

题目要求线性复杂度内实现，并且要求没有额外空间。首先我们考虑假如没有空间复杂度的限制。

这其实就只需要统计每个数字出现的次数，很容易想到去用 `HashMap` 。

遍历一次数组，第一次遇到就将对应的 `key` 置为 `1`。第二次遇到就拿到 `key` 对应的 `value` 然后进行加 `1` 再存入。最后只需要寻找 `value` 是 `1` 的 `key` 就可以了。

利用 `HashMap` 统计字符个数已经用过很多次了，比如 [30 题](https://leetcode.wang/leetCode-30-Substring-with-Concatenation-of-All-Words.html)、[49 题](https://leetcode.wang/leetCode-49-Group-Anagrams.html) 等等，最重要的好处就是可以在 `O(1)` 下取得之前的元素，从而使得题目的时间复杂度达到 `O(n)`。

当然，注意到这个题目每个数字出现的次数要么是 `1`  次，要么是 `2` 次，所以我们也可以用一个 `HashSet` ，在第一次遇到就加到 `Set` 中，第二次遇到就把当前元素从 `Set` 中移除。这样遍历一遍后，`Set` 中剩下的元素就是我们要找的那个落单的元素了。

```java
public int singleNumber(int[] nums) {
    HashSet<Integer> set = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
        if (!set.contains(nums[i])) {
            set.add(nums[i]);
        } else {
            set.remove(nums[i]);
        }
    }
    return set.iterator().next();
}
```

当然，上边的解法空间复杂度是 `O(n)`，怎么用 `O(1)` 的空间复杂度解决上边的问题呢？

想了很久，双指针，利用已确定元素的空间，等等的思想都考虑了，始终想不到解法，然后看了官方的 [Solution](https://leetcode.com/problems/single-number/solution/) ，下边分享一下。

# 解法二 数学推导

假设我们的数字是 `a b a b c c d`

怎么求出 `d` 呢？

只需要把出现过的数字加起来乘以 `2` ，然后减去之前的数字和就可以了。

什么意思呢？

上边的例子出现过的数字就是 `a b c d` ，加起来乘以二就是 `2 * ( a + b + c + d)`，之前的数字和就是 `a + b + a + b + c + c + d` 。

`2 * ( a + b + c + d) - (a + b + a + b + c + c + d)`，然后结果是不是就是 `d` 了。。。。。。

看完这个解法我只能说 `tql`。。。

找出现过什么数字，我们只需要一个 `Set` 去重就可以了。

```java
public int singleNumber(int[] nums) {
    HashSet<Integer> set = new HashSet<>();
    int sum = 0;//之前的数字和
    for (int i = 0; i < nums.length; i++) {
        set.add(nums[i]);
        sum += nums[i];
    }
    int sumMul = 0;//出现过的数字和
    for (int n : set) {
        sumMul += n;
    }
    sumMul = sumMul * 2;
    return sumMul - sum;
}
```

但上边的解法还是需要 `O(n)` 的空间复杂度，下边的解法让我彻底跪了。

# 解法三 异或

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

* 0 ⊕ a = a
* a ⊕ a = 0

此外异或满足交换律以及结合律。

所以对于之前的例子 `a b a b c c d` ，如果我们把给定的数字相互异或会发生什么呢？

```java
  a ⊕ b ⊕ a ⊕ b ⊕ c ⊕ c ⊕ d
= ( a ⊕ a ) ⊕ ( b ⊕ b ) ⊕ ( c ⊕ c ) ⊕ d
= 0 ⊕ 0 ⊕ 0 ⊕ d
= d
```

是的，答案就这样出来了，我妈妈问我为什么要跪着。。。

`java` 里的异或是 `^` 操作符，初始值可以给一个 `0`。

```java
public int singleNumber(int[] nums) {
    int ans = 0;
    for (int i = 0; i < nums.length; i++) {
        ans ^= nums[i];
    }
    return ans;
}
```

# 总

解法一利用 `HashMap` 计数算是一个很常用的思想了。解法二的数学推导理论上还能想到，解法三的异或操作真的是太神仙操作了，自愧不如。