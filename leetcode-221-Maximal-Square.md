# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/221.jpg)

输出包含 `1` 的最大正方形面积。

# 解法一 暴力

参考 [85 题](https://leetcode.wang/leetCode-85-Maximal-Rectangle.html) 解法一，85 题是求包含 `1` 的最大矩形，这道题明显只是 85 题的一个子问题了，85 题的解法稍加修改就能写出这道题了，下边讲一下 [85 题](https://leetcode.wang/leetCode-85-Maximal-Rectangle.html) 的思路。

参考[这里](<https://leetcode.com/problems/maximal-rectangle/discuss/29172/My-O(n3)-solution-for-your-reference>)，遍历每个点，求以这个点为矩阵右下角的所有矩阵面积。如下图的两个例子，橙色是当前遍历的点，然后虚线框圈出的矩阵是其中一个矩阵。

![](https://windliang.oss-cn-beijing.aliyuncs.com/85_2.jpg)

怎么找出这样的矩阵呢？如下图，如果我们知道了以这个点结尾的连续 1 的个数的话，问题就变得简单了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/85_3.jpg)

1. 首先求出高度是 1 的矩形面积，也就是它自身的数，也就是上图以橙色的 4 结尾的 「1234」的那个矩形，面积就是 4。
2. 然后向上扩展一行，高度增加一，选出当前列最小的数字，作为矩阵的宽，如上图，当前列中有 `2` 和 `4` ，那么就将 `2` 作为矩形的宽，求出面积，对应上图的矩形圈出的部分。
3. 然后继续向上扩展，重复步骤 2。

按照上边的方法，遍历所有的点，以当前点为矩阵的右下角，求出所有的矩阵就可以了。下图是某一个点的过程。

以橙色的点为右下角，高度为 1。

![](https://windliang.oss-cn-beijing.aliyuncs.com/85_4.jpg)

高度为 2。

![](https://windliang.oss-cn-beijing.aliyuncs.com/85_5.jpg)

高度为 3。

![](https://windliang.oss-cn-beijing.aliyuncs.com/85_6.jpg)

代码的话，把求每个点累计的连续 `1` 的个数用 `width` 保存，同时把求最大矩形的面积和求 `width`融合到同一个循环中。

下边是  [85 题](https://leetcode.wang/leetCode-85-Maximal-Rectangle.html)  的代码。

```java
public int maximalRectangle(char[][] matrix) {
    if (matrix.length == 0) {
        return 0;
    }
    //保存以当前数字结尾的连续 1 的个数
    int[][] width = new int[matrix.length][matrix[0].length];
    int maxArea = 0;
    //遍历每一行
    for (int row = 0; row < matrix.length; row++) {
        for (int col = 0; col < matrix[0].length; col++) {
            //更新 width
            if (matrix[row][col] == '1') {
                if (col == 0) {
                    width[row][col] = 1;
                } else {
                    width[row][col] = width[row][col - 1] + 1;
                }
            } else {
                width[row][col] = 0;
            }
            //记录所有行中最小的数
            int minWidth = width[row][col];
            //向上扩展行
            for (int up_row = row; up_row >= 0; up_row--) {
                int height = row - up_row + 1;
                //找最小的数作为矩阵的宽
                minWidth = Math.min(minWidth, width[up_row][col]);
                //更新面积
                maxArea = Math.max(maxArea, height * minWidth);
            }
        }
    }
    return maxArea;
}
```

我们先在上边的代码基础上，把这道题做出来，我把修改的地方标记出来了。下边的代码一定程度上已经做了一些优化，把能提前结束的地方提前结束了。

```java
public int maximalSquare(char[][] matrix) {
    if (matrix.length == 0) {
        return 0;
    }
    //保存以当前数字结尾的连续 1 的个数
    int[][] width = new int[matrix.length][matrix[0].length];
    int maxArea = 0;
    /************修改的地方*****************/
    int maxHeight = 0; //记录当前正方形的最大边长
    /*************************************/
    
    //遍历每一行
    for (int row = 0; row < matrix.length; row++) {
        for (int col = 0; col < matrix[0].length; col++) {
            // 更新 width
            if (matrix[row][col] == '1') {
                if (col == 0) {
                    width[row][col] = 1;
                } else {
                    width[row][col] = width[row][col - 1] + 1;
                }
            } else {
                width[row][col] = 0;
            }
            // 记录所有行中最小的数
            int minWidth = width[row][col];
            
            /************修改的地方*****************/
            if(minWidth <= maxHeight){
                continue;
            }
            /*************************************/
            
            // 向上扩展行
            for (int up_row = row; up_row >= 0; up_row--) {
                int height = row - up_row + 1;
                // 找最小的数作为矩阵的宽
                minWidth = Math.min(minWidth, width[up_row][col]);
                
                /************修改的地方*****************/
                //因为我们找正方形，当前高度大于了最小宽度，可以提前结束
                if(height > minWidth){
                    break;
                }
                // 只有是正方形的时候才更新面积
                if (height == minWidth) {
                    maxArea = Math.max(maxArea, height * minWidth);
                    maxHeight = Math.max(maxHeight, height);
                    break;
                }
                /*************************************/
            }
        }
    }
    return maxArea;
}
```

当然因为我们只考虑正方形，我们可以抛开原来的代码，只参照之前的思路写一个新的代码。

首先因为正方形的面积是边长乘边长，所以上边的 `maxArea` 是没有意义的，我们只记录最大边长即可。然后是其它细节的修改，让代码更简洁，代码如下。

```java
public int maximalSquare(char[][] matrix) {
    if (matrix.length == 0) {
        return 0;
    }
    // 保存以当前数字结尾的连续 1 的个数
    int[][] width = new int[matrix.length][matrix[0].length];
    // 记录最大边长
    int maxSide = 0;
    // 遍历每一行
    for (int row = 0; row < matrix.length; row++) {
        for (int col = 0; col < matrix[0].length; col++) {
            // 更新 width
            if (matrix[row][col] == '1') {
                if (col == 0) {
                    width[row][col] = 1;
                } else {
                    width[row][col] = width[row][col - 1] + 1;
                }
            } else {
                width[row][col] = 0;
            }
            // 当前点作为正方形的右下角进行扩展
            int curWidth = width[row][col];
            // 向上扩展行
            for (int up_row = row; up_row >= 0; up_row--) {
                int height = row - up_row + 1;
                if (width[up_row][col] <= maxSide || height > curWidth) {
                    break;
                }
                maxSide = Math.max(height, maxSide);
            }
        }
    }
    return maxSide * maxSide;
}
```

# 解法二 动态规划

写出解法一，也没有往别的地方想了，参考 [这里](https://leetcode.com/problems/maximal-square/discuss/61803/C%2B%2B-space-optimized-DP)，很典型的动态规划的问题了。

解法一中我们求每个点的最大边长时，没有考虑到之前的解，事实上之前的解完全可以充分利用。

用 `dp[i][j]` 表示以 `matrix[i][j]` 为右下角正方形的最大边长。那么递推式如下。

初始条件，那就是第一行和第一列的 `dp[i][j] = matrix[i][j] - '0'`，也就意味着 `dp[i][j]` 要么是 `0` 要么是 `1`。

然后就是递推式。

`dp[i][j] = Min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]) + 1`。

也就是当前点的左边，上边，左上角的三个点中选一个最小值，然后加 `1`。

首先要明确 `dp[i][j]` 表示以 `matrix[i][j]` 为右下角的正方形的最大边长。 

然后我们从当前点向左和向上扩展，可以参考下边的图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/221_3.jpg)

向左最多能扩展多少呢？`dp[i][j-1]` 和 `dp[i-1][j-1]`，当前点左边和左上角选一个较小的。也就是它左边最大的正方形和它左上角最大的正方形的，边长选较小的。

向上能能扩展多少呢？`dp[i-1][j]` 和 `dp[i-1][j-1]`，当前点上边和左上角选一个较小的。也就是它上边最大的正方形和它左上角最大的正方形，边长选较小的。

然后向左扩展和向上扩展两个最小值中再选一个较小的，最后加上 `1` 就是最终的边长了。

最终其实是从三个正方形中最小的边长。

![](https://windliang.oss-cn-beijing.aliyuncs.com/221_4.jpg)

代码的话，使用个技巧，那就是行和列多申请一行，这样的话第一行和第一列的情况就不需要单独考虑了。

```java
public int maximalSquare(char[][] matrix) {
    int rows = matrix.length;
    if (rows == 0) {
        return 0;
    }
    int cols = matrix[0].length;
    int[][] dp = new int[rows + 1][cols + 1];
    int maxSide = 0;
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= cols; j++) {
            //因为多申请了一行一列，所以这里下标要减 1
            if (matrix[i - 1][j - 1] == '0') {
                dp[i][j] = 0;
            } else {
                dp[i][j] = Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1])) + 1;
                maxSide = Math.max(dp[i][j], maxSide);
            }
        }
    }
    return maxSide * maxSide;
}

```

然后又是动态规划的经典操作了，空间复杂度的优化，之前也遇到很多了，这里不细讲了。因为更新当前行的时候，只用到前一行的信息，之前的行就没有再用到了，所以我们可以用一维数组，不需要二维矩阵。

把图画出来就可以理解出来各个变量的关系了，这里偷懒就不画了。第一次遇到空间复杂度的优化是 [第 5 题](https://leetcode.wang/leetCode-5-Longest-Palindromic-Substring.htm) ，写的比较详细，大家可以看看。后边基本上遇到动态规划，就会考虑空间复杂度的优化，很多很多了。可以在 [https://leetcode.wang/](https://leetcode.wang/) 搜索动态规划做一做。

![](https://windliang.oss-cn-beijing.aliyuncs.com/221_2.jpg)

下边是空间复杂度优化的代码，最关键的是用 `pre` 保存了左上角的值。

```java
public int maximalSquare(char[][] matrix) {
    int rows = matrix.length;
    if (rows == 0) {
        return 0;
    }
    int cols = matrix[0].length;
    int[] dp = new int[cols + 1];
    int maxSide = 0;
    int pre = 0;
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= cols; j++) {
            int temp = dp[j];
            if (matrix[i - 1][j - 1] == '0') {
                dp[j] = 0;
            } else {
                dp[j] = Math.min(dp[j - 1], Math.min(dp[j], pre)) + 1;
                maxSide = Math.max(dp[j], maxSide);
            }
            pre = temp;
        }
    }
    return maxSide * maxSide;
}

```

# 总

解法一的话是受之前解法的启发，解法二的话算是动态规划的经典应用了，通过之前的解更新当前的解。这里的空间复杂度优化需要多加一个变量来辅助，算是比较难的了。