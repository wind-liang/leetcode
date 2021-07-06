# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/217.jpg)

判断是否有重复数字。

# 思路分析

这种题目直接就想到利用 `HashMap` 或者 `HashSet`，将数字依次存入其中。这样做的好处就是，判断新加入的数字是否已经存在，时间复杂度可以是 `O(1)`。

[官方题解](https://leetcode.com/problems/contains-duplicate/solution/) 也介绍了另外两种解法，就不细讲了。

一种是纯暴力方法，两层 `for` 循环，两两判断即可。

一种是先将原数组排序，然后判断是否有前后两个数字相同即可。

# 解法一

这里只给出利用 `HashSet` 的方法了，空间换时间，比较常用。

```java
public boolean containsDuplicate(int[] nums) {
    HashSet<Integer> set = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
        if (set.contains(nums[i])) {
            return true;
        }
        set.add(nums[i]);
    }
    return false;
}
```

# 总

一道比较简单的题目，利用 `HashMap` 可以判重以及计数，比如 [30 题](https://leetcode.wang/leetCode-30-Substring-with-Concatenation-of-All-Words.html)、[49 题](https://leetcode.wang/leetCode-49-Group-Anagrams.html)、[136 题](https://leetcode.wang/leetcode-136-Single-Number.html)、[137 题](https://leetcode.wang/leetcode-137-Single-NumberII.html)。