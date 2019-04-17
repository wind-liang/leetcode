# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/64.jpg)

依旧是[62题](https://leetcode.windliang.cc/leetCode-62-Unique-Paths.html)的扩展，这个是输出从左上角到右下角，路径的数字加起来和最小是多少。

依旧在[62题](https://leetcode.windliang.cc/leetCode-62-Unique-Paths.html)代码的基础上改，大家可以先看下 62 題。

# 解法一 递归

62 题中我们把递归 getAns 定义为，输出 （x，y）到 （m ，n ） 的路径数，如果记做 dp[x\][y\]。

那么递推式就是 dp[x\][y\] = dp[x\][y+1\] + dp[x+1\][y\]。

这道题的话，把递归 getAns 定义为，输出 （x，y）到 （m，n ） 的路径和最小是多少。同样如果记做 dp[x\][y\]。这样的话， dp[x\][y\] = Min（dp[x\][y+1\] + dp[x+1\][y\]）+ grid[x\][y\]。很好理解，就是当前点的右边和下边取一个和较小的，然后加上当前点的权值。

```java
public int minPathSum(int[][] grid) {
    int m = grid.length;
    int n = grid[0].length;
    HashMap<String, Integer> visited = new HashMap<>();
    return getAns(0, 0, m - 1, n - 1, 0, visited, grid);
}

private int getAns(int x, int y, int m, int n, int num, HashMap<String, Integer> visited, int[][] grid) {
    // 到了终点，返回终点的权值
    if (x == m && y == n) {
        return grid[m][n];
    }
    int n1 = Integer.MAX_VALUE;
    int n2 = Integer.MAX_VALUE;
    String key = x + 1 + "@" + y;
    if (!visited.containsKey(key)) {
        if (x + 1 <= m) {
            n1 = getAns(x + 1, y, m, n, num, visited, grid);
        }
    } else {
        n1 = visited.get(key);
    }
    key = x + "@" + (y + 1);
    if (!visited.containsKey(key)) {
        if (y + 1 <= n) {
            n2 = getAns(x, y + 1, m, n, num, visited, grid);
        }
    } else {
        n2 = visited.get(key);
    }
    // 将当前点加入 visited 中
    key = x + "@" + y;
    visited.put(key, Math.min(n1, n2) + grid[x][y]);
    //返回两个之间较小的，并且加上当前权值
    return Math.min(n1, n2) + grid[x][y];
}
```

时间复杂度：

空间复杂度：

# 解法二

这里我们直接用 grid 覆盖存，不去 new 一个 n 的空间了。

```java
public int minPathSum(int[][] grid) {
    int m = grid.length;
    int n = grid[0].length;
    //由于第一行和第一列不能用我们的递推式，所以单独更新
    //更新第一行的权值
    for (int i = 1; i < n; i++) {
        grid[0][i] = grid[0][i - 1] + grid[0][i];
    }
    //更新第一列的权值
    for (int i = 1; i < m; i++) {
        grid[i][0] = grid[i - 1][0] + grid[i][0];
    }
    //利用递推式更新其它的
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            grid[i][j] = Math.min(grid[i][j - 1], grid[i - 1][j]) + grid[i][j];

        }
    }
    return grid[m - 1][n - 1];
}
```

时间复杂度：O（m * n）。

空间复杂度：O（1）。

# 总

依旧是[62题](https://leetcode.windliang.cc/leetCode-62-Unique-Paths.html)的扩展，理解了 62 题的话，很快就写出来了。