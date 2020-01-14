# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/213.jpg)

[198 题](https://leetcode.wang/leetcode-198-House-Robber.html) House Robber 的延续。一个数组，每个元素代表商店的存款，一个小偷晚上去偷商店，问最多能偷多少钱。有一个前提，不能偷相邻的商店，不然警报会响起。这道题的不同之处在于，商店是环形分布，所以第一家和最后一家也算作相邻商店。

# 解法一

这道题和 [198 题](https://leetcode.wang/leetcode-198-House-Robber.html) 的区别在题目描述中也指出来了，即偷了第一家就不能偷最后一家。

所以顺理成章，偷不偷第一家我们单独考虑一下即可。

偷第一家，也就是求出在前 `n - 1` 家中偷的最大收益，也就是不考虑最后一家的最大收益。

不偷第一家，也就是求第 `2` 家到最后一家中偷的最大收益，也就是不考虑第一家的最大收益。

然后只需要返回上边两个最大收益中的较大的即可。

图示的话就是下边的两种范围。

```java
X X X X X X
^       ^

X X X X X X
  ^       ^
```

我们看一下之前求全部商店的最大收益的代码，把最后优化的代码直接贴过来了，大家可以到 [198 题](https://leetcode.wang/leetcode-198-House-Robber.html)  看详细的。

```java
public int rob(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return nums[0];
    }
    int pre = 0; 
    int cur = nums[0]; 
    for (int i = 2; i <= n; i++) {
        int temp = cur;
        cur = Math.max(pre + nums[i - 1], cur);
        pre = temp;
    }
    return cur;
}

```

为了适应这道题的算法，我们可以对上边的代码进行改造。增加所偷的商店的范围的参数。

```java
public int robHelper(int[] nums, int start, int end) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return nums[0];
    }

    int pre = 0;
    int cur = nums[start];
    for (int i = start + 2; i <= end; i++) {
        int temp = cur;
        cur = Math.max(pre + nums[i - 1], cur);
        pre = temp;
    }
    return cur;
}
```

有了上边的代码，这道题就非常好写了。

```java
public int rob(int[] nums) {
    //考虑第一家
    int max1 = robHelper(nums, 0, nums.length - 1);
    //不考虑第一家
    int max2 = robHelper(nums, 1, nums.length);
    return Math.max(max1, max2);
}

public int robHelper(int[] nums, int start, int end) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return nums[0];
    }

    int pre = 0;
    int cur = nums[start];
    for (int i = start + 2; i <= end; i++) {
        int temp = cur;
        cur = Math.max(pre + nums[i - 1], cur);
        pre = temp;
    }
    return cur;
}
```

# 总

这道题通过分类的思想，成功将新问题化解到了已求解问题上，这个思想也经常遇到。