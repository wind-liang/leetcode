# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/48.jpg)

将一个矩阵顺时针旋转 90 度，并且不使用额外的空间。大概属于找规律的题，没有什么一般的思路，观察就可以了。

# 解法一

可以先转置，然后把每列对称交换交换一下。

 ![](https://windliang.oss-cn-beijing.aliyuncs.com/48_2.jpg)

```java
public void rotate(int[][] matrix) {
    //以对角线为轴交换
    for (int i = 0; i <  matrix.length; i++) {
        for (int j = 0; j <=i; j++) {
            if (i == j) {
                continue;
            }
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    } 
    //交换列
    for (int i = 0, j = matrix.length - 1; i < matrix.length / 2; i++, j--) {
        for (int k = 0; k < matrix.length; k++) {
            int temp = matrix[k][i];
            matrix[k][i] = matrix[k][j];
            matrix[k][j] = temp;
        }
    }

} 
```

时间复杂度：O（n²）。

空间复杂度：O（1）。

也可以先以横向的中轴线为轴，对称的行进行交换，然后再以对角线交换。

# 解法二

我把这个[链接](https://leetcode.com/problems/rotate-image/discuss/18895/Clear-Java-solution)的思路贴过来，里边评论有张图也都顺道贴过来吧，写的很好。

![](https://windliang.oss-cn-beijing.aliyuncs.com/48_3.jpg)

一圈一圈的循环交换，很妙！



```java
public void rotate(int[][] matrix) {
    int n=matrix.length;
    for (int i=0; i<n/2; i++) 
        for (int j=i; j<n-i-1; j++) {
            int tmp=matrix[i][j];
            matrix[i][j]=matrix[n-j-1][i];
            matrix[n-j-1][i]=matrix[n-i-1][n-j-1];
            matrix[n-i-1][n-j-1]=matrix[j][n-i-1];
            matrix[j][n-i-1]=tmp;
        }
}
```

时间复杂度：O（n²）。

空间复杂度：O（1）。

# 总

这道题就是对题目的特征进行观察就可以了。