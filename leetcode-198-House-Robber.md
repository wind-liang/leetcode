# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/198.jpg)

一个数组，每个元素代表商店的存款，一个小偷晚上去偷商店，问最多能偷多少钱。有一个前提，不能偷相邻的商店，不然警报会响起。

# 思路分析

一道很典型的通过子问题去解决原问题的题目，所以可以通过递归以及动态规划解决。

如果我们需要求前 `n` 家商店最多能偷多少钱，并且知道了前 `n - 1` 家店最多能偷的钱数，前 `n - 2` 家店最多能偷的钱数。

对于第 `n` 家店，我们只能选择偷或者不偷。

如果偷的话，那么前 `n` 家商店最多能偷的钱数就是「前 `n - 2` 家店最多能偷的钱数」加上「第 `n` 家店的钱数」。因为选择偷第 `n` 家商店，第 `n - 1` 家商店就不可以偷了。

如果不偷的话，那么前 `n` 家商店最多能偷的钱数就是「前 `n - 1` 家店最多能偷的钱数」。

最终前 `n` 家商店最多能偷的钱数就是上边两种情况选择较大的值。

接下来就是递归出口或者说初始条件。

当 `n = 0`，也就没有商店，那么能偷的最大钱数当然是 `0` 了。

当 `n = 1`，也就是只有一家店的时候，能偷的最大钱数就是当前店的钱数。

# 解法一 递归

通过上边的分析，代码也就直接出来了。

```java
public int rob(int[] nums) {
    return robHelpler(nums, nums.length);
}

private int robHelpler(int[] nums, int n) {
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return nums[0];
    }
    return Math.max(robHelpler(nums, n - 2) + nums[n - 1], robHelpler(nums, n - 1));
}
```

然后就会意料之中的超时。

![](https://windliang.oss-cn-beijing.aliyuncs.com/198_2.jpg)

原因很简单，因为递归中会计算很多重复的解，解法方案的话我们就是把递归过程中的解存起来，第二次遇到的话直接返回即可。

```java
public int rob(int[] nums) {
    int[] map = new int[nums.length + 1];
    Arrays.fill(map, -1);
    return robHelpler(nums, nums.length, map);
}

private int robHelpler(int[] nums, int n, int[] map) {
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return nums[0];
    }
    if (map[n] != -1) {
        return map[n];
    }
    int res = Math.max(robHelpler(nums, n - 2, map) + nums[n - 1], robHelpler(nums, n - 1, map));
    map[n] = res;
    return res;
}
```

# 解法二 动态规划

有了上边的递归和之前的分析，其实动态规划也可以直接出来了。

用 `dp[n]` 数组表示前 `n` 天能够带来的最大收益。

`dp[n] = Math.max(dp[n - 2] + nums[n - 1], dp[n - 1] )`。

初始条件的话，

`dp[0] = 0` 以及 `dp[1] = nums[0]`。

```java
public int rob(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return nums[0];
    }

    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = nums[0];
    for (int i = 2; i <= n; i++) {
        dp[i] = Math.max(dp[i - 2] + nums[i - 1], dp[i - 1]);
    }
    return dp[n];
}
```

接下来就是动态规划空间复杂度上的优化，比如 [5题](<https://leetcode.windliang.cc/leetCode-5-Longest-Palindromic-Substring.html>)，[10题](<https://leetcode.windliang.cc/leetCode-10-Regular-Expression-Matching.html>)，[53题](<https://leetcode.windliang.cc/leetCode-53-Maximum-Subarray.html?h=%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92>)，[72题 ](<https://leetcode.wang/leetCode-72-Edit-Distance.html>)，[115 题](https://leetcode.wang/leetcode-115-Distinct-Subsequences.html) 等等都已经用过了。

原因就是我们更新 `dp[i]` 的时候，只需要 `dp[i - 1]` 以及 `dp[i - 2]` 的信息，再之前的信息就不需要了，所以我们不需要数组，只需要几个变量就可以了。

```java
public int rob(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return nums[0];
    }

    int pre = 0; //代替上边代码中的 dp[i - 2]
    int cur = nums[0]; //代替上边代码中的 dp[i - 1] 和 dp[i]
    for (int i = 2; i <= n; i++) {
        int temp = cur;
        cur = Math.max(pre + nums[i - 1], cur);
        pre = temp;
    }
    return cur;
}
```

# 总

一道很典型的题，可以体会从递归 -> 递归加缓冲 -> 动态规划 -> 动态规划空间复杂度优化这一系列的过程，如果题目做的多了，最开始就可以直接想到最后的方法了。