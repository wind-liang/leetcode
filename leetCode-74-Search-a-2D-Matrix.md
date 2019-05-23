# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/74.jpg)

判断一个矩阵中是否存在某个数，矩阵是有序的。

# 解法一 二分法

看到了有序序列，啥都不用想直接二分，只需要考虑到怎么把二分时候的下标转换为矩阵的行、列下标就可以了，很简单，用除法和求余就够了。

```java
public boolean searchMatrix(int[][] matrix, int target) {
    int rows = matrix.length;
    if (rows == 0) {
        return false;
    }
    int cols = matrix[0].length;
    int left = 0;
    int right = rows * cols - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        int temp = matrix[mid / cols][mid % cols];
        if (temp == target) {
            return true;
        } else if (temp < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return false;
}
```

时间复杂度：O ( log ( n ) )。

空间复杂度：O ( 1 )。

# 总

这道题的二分法，比较简单，大家可以看下[33题](<https://leetcode.windliang.cc/leetCode-33-Search-in-Rotated-Sorted-Array.html>)，相信对二分法会有一个更深刻的理解。