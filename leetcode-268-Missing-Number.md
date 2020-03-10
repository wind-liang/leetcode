# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/268.jpg)

从 `0` 到 `n` 中找到缺失的数字。

# 解法一

最直接的方法，把所有数字存到 `HashSet` 中，然后依次判断哪个数字不存在。

要注意的是数组的长度其实就等于题目中 `0, 1, ..., n` 中的 `n` 。

```java
public int missingNumber(int[] nums) {
    HashSet<Integer> set = new HashSet<>();
    for (int n : nums) {
        set.add(n);
    }
    
    //判断 0 到 n 中哪个数字缺失了
    for (int i = 0; i <= nums.length; i++) {
        if (!set.contains(i)) {
            return i;
        }
    }
    return -1;
}
```

# 解法二

对 [136 题](https://leetcode.wang/leetcode-136-Single-Number.html) 的解法二求和做差的方法记忆深刻，这里的话也可以用求和做差。

求出 `0` 到 `n` 的和，然后再计算原数组的和，做一个差就是缺失的数字了。

```java
public int missingNumber(int[] nums) {
    int sum1 = 0;
    for (int n : nums) {
        sum1 += n;
    }
    // 等差公式计算 1 到 n 的和
    int sum2 = (1 + nums.length) * nums.length / 2;

    return sum2 - sum1;
}
```

# 解法三

又到了神奇的异或的方法了，[这里](https://leetcode.com/problems/missing-number/discuss/69791/4-Line-Simple-Java-Bit-Manipulate-Solution-with-Explaination) 的解法。

[136 题](https://leetcode.wang/leetcode-136-Single-Number.html) 详细的介绍了异或的一个性质，`a ⊕ a = 0`，也就是相同数字异或等于 `0`。

这道题的话，相当于我们有两个序列。

一个完整的序列， `0` 到 `n`。

一个是 `0` 到 `n` 中缺少了一个数字的序列。

把这两个序列合在一起，其实就变成了[136 题](https://leetcode.wang/leetcode-136-Single-Number.html) 的题干——所有数字都出现了两次，只有一个数字出现了一次，找出这个数字。

假如合起来的数字序列是 `a b a b c c d` ，`d` 出现了一次，也就是我们缺失的数字。

如果我们把给定的数字相互异或会发生什么呢？因为异或满足交换律和结合律，所以结果如下。

```java
  a ⊕ b ⊕ a ⊕ b ⊕ c ⊕ c ⊕ d
= ( a ⊕ a ) ⊕ ( b ⊕ b ) ⊕ ( c ⊕ c ) ⊕ d
= 0 ⊕ 0 ⊕ 0 ⊕ d
= d
```

这样我们就找了缺失的数字了。

代码的话，我们可以把下标当成上边所说的完整的序列。因为下标没有 `n`，所以初始化 `result = n`。

然后把两个序列的数字依次异或即可。

```java
public int missingNumber(int[] nums) {
    int result = nums.length;
    for (int i = 0; i < nums.length; i++) {
        result = result ^ nums[i] ^ i;
    }
    return result;
}
```

# 总

解法一和解法二的话都是可以直接想出来，解法三异或的方法其实也不难，但还是没形成惯性，没有往异或思考。