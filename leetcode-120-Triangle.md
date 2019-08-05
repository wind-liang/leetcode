# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/120.jpg)

当前层只能选择下一层相邻的两个元素走，比如第 `3` 层的 `5` 只能选择第`4`层的 `1` 和 `8` ，从最上边开始，走一条路径，走到最底层最小的和是多少。

# 题目解析

先看一下 [115 题](<https://leetcode.wang/leetcode-115-Distinct-Subsequences.html>) 吧，和这道题思路方法是完全完全一样的。此外，[119 题](<https://leetcode.wang/leetcode-119-Pascal%27s-TriangleII.html>) 倒着循环优化空间复杂度也可以看一下。

这道题本质上就是动态规划，再本质一些就是更新一张二维表。

 [115 题](<https://leetcode.wang/leetcode-115-Distinct-Subsequences.html>) 已经进行了详细介绍，这里就粗略的记录了。

# 解法一 递归之分支

求第 `0` 层到第 `n` 层的和最小，就是第`0`层的数字加上第`1`层到第`n`层的的最小和。

递归出口就是，第`n`层到第`n`层最小的和，就是该层的数字本身。

```java
public int minimumTotal(List<List<Integer>> triangle) { 
    return minimumTotalHelper(0, 0, triangle);
}

private int minimumTotalHelper(int row, int col, List<List<Integer>> triangle) {
    if (row == triangle.size()) {
        return 0;
    }
    int min = Integer.MAX_VALUE;
    List<Integer> cur = triangle.get(row);
    min = Math.min(min, cur.get(col) + minimumTotalHelper(row + 1, col, triangle));
    if (col + 1 < cur.size()) {
        min = Math.min(min, cur.get(col + 1) + minimumTotalHelper(row + 1, col + 1, triangle));
    }
    return min;
}
```

因为函数里边调用了两次自己，所以导致进行了很多重复的搜索，所以肯定会导致超时。

![](https://windliang.oss-cn-beijing.aliyuncs.com/120_2.jpg)

优化的话，就是 `Memoization`  技术，把每次的结果存起来，进入递归前先判断当前解有没有求出来。我们可以用 `HashMap` 存，也可以用二维数组存。

用 `HashMap` 的话，`key`  存字符串 `row + "@" + col`，中间之所以加一个分隔符，就是防止`row = 1，col = 23` 和 `row = 12， col = 3`，这两种情况的混淆。

```java
public int minimumTotal(List<List<Integer>> triangle) {
    HashMap<String, Integer> map = new HashMap<>();
    return minimumTotalHelper(0, 0, triangle, map);
}

private int minimumTotalHelper(int row, int col, List<List<Integer>> triangle, HashMap<String, Integer> map) {
    if (row == triangle.size()) {
        return 0;
    }
    String key = row + "@" + col;
    if (map.containsKey(key)) {
        return map.get(key);
    }
    int min = Integer.MAX_VALUE;
    List<Integer> cur = triangle.get(row);
    min = Math.min(min, cur.get(col) + minimumTotalHelper(row + 1, col, triangle, map));
    if (col + 1 < cur.size()) {
        min = Math.min(min, cur.get(col + 1) + minimumTotalHelper(row + 1, col + 1, triangle, map));
    }
    map.put(key, min);
    return min;
}
```

# 动态规划

动态规划可以自顶向下，也可以自底向上， [115 题](<https://leetcode.wang/leetcode-115-Distinct-Subsequences.html>) 主要写的是自底向上，这里写个自顶向下吧。

用一个数组 `dp[row][col]` 表示从顶部到当前位置，即第 `row` 行第 `col` 列，的最小和。

状态转移方程也很好写了。

`dp[row][col] = Min(dp[row - 1][col - 1],dp[row-1][col]), triangle[row][col] `

到当前位置有两种选择，选一个较小的，然后加上当前位置的数字即可。

```java
public int minimumTotal(List<List<Integer>> triangle) {
    int rows = triangle.size();
    int cols = triangle.get(rows - 1).size();
    int[][] dp = new int[rows][cols];
    dp[0][0] = triangle.get(0).get(0);
    for (int row = 1; row < rows; row++) {
        List<Integer> curRow = triangle.get(row);
        int col = 0;
        dp[row][col] = dp[row - 1][col] + curRow.get(col);
        col++;
        for (; col < curRow.size() - 1; col++) {
            dp[row][col] = Math.min(dp[row - 1][col - 1], dp[row - 1][col]) + curRow.get(col);
        }
        dp[row][col] = dp[row - 1][col - 1] + curRow.get(col);
    }
    int min = Integer.MAX_VALUE;
    for (int col = 0; col < cols; col++) {
        min = Math.min(min, dp[rows - 1][col]);
    }
    return min;
}
```

注意的地方就是把左边界和右边界的情况单独考虑，因为到达左边界和右边界只有一个位置可选。

接下来，注意到我们是一层一层的更新，更新当前层只需要上一层的信息，所以我们不需要二维数组，只需要一维数组就可以了。

另外，和 [119 题](<https://leetcode.wang/leetcode-119-Pascal%27s-TriangleII.html>)  题一样，更新`col`列的时候，会把之前`col`列的信息覆盖。当更新 `col + 1` 列的时候，旧的 `col` 列的信息已经没有了，所以我们可以采取倒着更新 `col` 的方法。

```java
public int minimumTotal(List<List<Integer>> triangle) {
    int rows = triangle.size();
    int cols = triangle.get(rows - 1).size();
    int[] dp = new int[cols];
    dp[0] = triangle.get(0).get(0);
    for (int row = 1; row < rows; row++) {
        List<Integer> curRow = triangle.get(row);
        int col = curRow.size() - 1;
        dp[col] = dp[col - 1] + curRow.get(col);
        col--;
        for (; col > 0; col--) {
            dp[col] = Math.min(dp[col - 1], dp[col]) + curRow.get(col);
        }

        dp[col] = dp[col] + curRow.get(col);
    }
    int min = Integer.MAX_VALUE;
    for (int col = 0; col < cols; col++) {
        min = Math.min(min, dp[col]);
    }
    return min;
}
```

另外，大家可以试一试自底向上的方法，写起来还相对简单些。

# 总

就是  [115 题](<https://leetcode.wang/leetcode-115-Distinct-Subsequences.html>) 的变形了，没有新东西，如果理解了  [115 题](<https://leetcode.wang/leetcode-115-Distinct-Subsequences.html>) ，那么这道题直接套算法就行，基本不用思考了。