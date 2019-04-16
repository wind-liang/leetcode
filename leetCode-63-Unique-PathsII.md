# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/63.jpg)

对[62题](https://leetcode.windliang.cc/leetCode-62-Unique-Paths.html)的变体，增加了一些不能走的格子，用 1 表示。还是输出从左上角到右下角总共有多少种走法。

没做过[62题](https://leetcode.windliang.cc/leetCode-62-Unique-Paths.html)的话可以先看一下，62 题总结的很详细了，我直接在 62 题的基础上改了。

# 解法一 递归

```java
public int uniquePathsWithObstacles(int[][] obstacleGrid) {
    int m = obstacleGrid.length;
    int n = obstacleGrid[0].length;
    HashMap<String, Integer> visited = new HashMap<>();
    //起点是障碍，直接返回 0 
    if (obstacleGrid[0][0] == 1)
        return 0;
    return getAns(0, 0, m - 1, n - 1, 0, visited, obstacleGrid);
}

private int getAns(int x, int y, int m, int n, int num, HashMap<String, Integer> visited, int[][] obstacleGrid) {
    // TODO Auto-generated method stub
    if (x == m && y == n) {
        return 1;
    }
    int n1 = 0;
    int n2 = 0;
    String key = x + 1 + "@" + y;
    if (!visited.containsKey(key)) {
        //与 62 题不同的地方，增加了判断是否是障碍
        if (x + 1 <= m && obstacleGrid[x + 1][y] == 0) {
            n1 = getAns(x + 1, y, m, n, num, visited, obstacleGrid);
            visited.put(key, n1);
        }
    } else {
        n1 = visited.get(key);
    }
    key = x + "@" + (y + 1);
    if (!visited.containsKey(key)) {
        //与 62 题不同的地方，增加了判断是否是障碍
        if (y + 1 <= n && obstacleGrid[x][y + 1] == 0) {
            n2 = getAns(x, y + 1, m, n, num, visited, obstacleGrid);
            visited.put(key, n2);
        }
    } else {
        n2 = visited.get(key);
    }
    return n1 + n2;
}
```

时间复杂度：

空间复杂度：

# 解法二 动态规划

在[62题](https://leetcode.windliang.cc/leetCode-62-Unique-Paths.html)解法二最后个想法上改。

```java
public int uniquePathsWithObstacles(int[][] obstacleGrid) {
    int m = obstacleGrid.length;
    int n = obstacleGrid[0].length;
    //起点是障碍，直接返回 0 
    if (obstacleGrid[0][0] == 1)
        return 0;
    int[] dp = new int[n];
    int i = 0;
    //初始化第一行和 62 题不一样了
    //这里的话不是全部初始化 1 了，因为如果有障碍的话当前列和后边的列就都走不过了，初始化为 0
    for (; i < n; i++) {
        if (obstacleGrid[0][i] == 1) {
            dp[i] = 0;
            break;
        } else {
            dp[i] = 1;
        }
    }
    //障碍后边的列全部初始化为 0
    for (; i < n; i++) {
        dp[i] = 0;
    }
    for (i = 1; i < m; i++) {
        //这里改为从 0 列开始了，因为 62 题中从 1 开始是因为第 0 列永远是 1 不需要更新
        //这里的话，如果第 0 列是障碍的话，需要更新为 0
        for (int j = 0; j < n; j++) {
            if (obstacleGrid[i][j] == 1) {
                dp[j] = 0;
            } else {
                //由于从第 0 列开始了，更新公式有 j - 1，所以 j = 0 的时候不更新
                if (j != 0)
                    dp[j] = dp[j] + dp[j - 1];
            }
        }
    }
    return dp[(n - 1)];
}
```

时间复杂度：O（m * n）。

空间复杂度：O（n）。

# 总

和 62 题改动不大，就是在障碍的地方，更新的时候需要注意一下。