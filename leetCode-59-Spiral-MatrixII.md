#  题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/59.jpg)

和 [54题](https://leetcode.windliang.cc/leetCode-54-Spiral-Matrix.html) 差不多，54 题按照螺旋状遍历，这个是按照螺旋状生成二维数组。

# 解法一

直接按照 [54题](https://leetcode.windliang.cc/leetCode-54-Spiral-Matrix.html)，贪吃蛇的走法来写，如果没做过可以看一下。

```java
/*
	 * direction 0 代表向右, 1 代表向下, 2 代表向左, 3 代表向上
	 */
public int[][] generateMatrix(int n) {
    int[][] ans = new int[n][n];
    int start_x = 0, start_y = 0, direction = 0, top_border = -1, // 上边界
    right_border = n, // 右边界
    bottom_border = n, // 下边界
    left_border = -1; // 左边界
    int count = 1;
    while (true) {
        // 全部遍历完结束
        if (count == n * n + 1) {
            return ans;
        }
        // 注意 y 方向写在前边，x 方向写在后边
        ans[start_y][start_x] = count;
        count++;
        switch (direction) {
                // 当前向右
            case 0:
                // 继续向右是否到达边界
                // 到达边界就改变方向，并且更新上边界
                if (start_x + 1 == right_border) {
                    direction = 1;
                    start_y += 1;
                    top_border += 1;
                } else {
                    start_x += 1;
                }
                break;
                // 当前向下
            case 1:
                // 继续向下是否到达边界
                // 到达边界就改变方向，并且更新右边界
                if (start_y + 1 == bottom_border) {
                    direction = 2;
                    start_x -= 1;
                    right_border -= 1;
                } else {
                    start_y += 1;
                }
                break;
            case 2:
                if (start_x - 1 == left_border) {
                    direction = 3;
                    start_y -= 1;
                    bottom_border -= 1;
                } else {
                    start_x -= 1;
                }
                break;
            case 3:
                if (start_y - 1 == top_border) {
                    direction = 0;
                    start_x += 1;
                    left_border += 1;
                } else {
                    start_y -= 1;
                }
                break;
        }
    }

}
```

时间复杂度：O（n²）。

空间复杂度：O（1）。

# 解法二

[这里](https://leetcode.com/problems/spiral-matrix-ii/discuss/22282/4-9-lines-Python-solutions)看到了一个与众不同的想法，分享一下。

![](https://windliang.oss-cn-beijing.aliyuncs.com/59_2.jpg)

矩阵先添加 1 个元素，然后顺时针旋转矩阵，然后再在矩阵第一行添加元素，再顺时针旋转矩阵，再在第一行添加元素，直到变成 n * n 的矩阵。

之前在 [48题](https://leetcode.windliang.cc/leetCode-48-Rotate-Image.html) 做过旋转矩阵的算法，但是当时是 n \* n，这个 n \* m 就更复杂些了，然后由于 JAVA 的矩阵定义的时候就固定死了，每次添加新的一行又得 new 新的数组，这样整个过程就会很浪费空间，综上，用 JAVA 不适合去实现这个算法，就不实现了，哈哈哈哈哈，看一下[作者](https://leetcode.com/problems/spiral-matrix-ii/discuss/22282/4-9-lines-Python-solutions)的 python 代码吧。

# 总

基本上和 [54题](https://leetcode.windliang.cc/leetCode-54-Spiral-Matrix.html) 差不多，依旧是理解题意，然后模仿遍历过程就可以了。



