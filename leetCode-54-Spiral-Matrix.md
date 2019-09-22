# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/54.jpg)

从第一个位置开始，螺旋状遍历二维矩阵。

![](https://windliang.oss-cn-beijing.aliyuncs.com/54_2.jpg)

# 解法一

可以理解成贪吃蛇，从第一个位置开始沿着边界走，遇到边界就转换方向接着走，直到走完所有位置。

```java
/*
 * direction 0 代表向右, 1 代表向下, 2 代表向左, 3 代表向上
*/
public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> ans = new ArrayList<>();
    if(matrix.length == 0){
        return ans;
    }
    int start_x = 0, 
    start_y = 0,
    direction = 0, 
    top_border = -1,  //上边界
    right_border = matrix[0].length,  //右边界
    bottom_border = matrix.length, //下边界
    left_border = -1; //左边界
    while(true){
        //全部遍历完结束
        if (ans.size() == matrix.length * matrix[0].length) {
            return ans;
        }
		//注意 y 方向写在前边，x 方向写在后边
        ans.add(matrix[start_y][start_x]);
        switch (direction) {
            //当前向右
            case 0:
                //继续向右是否到达边界
                //到达边界就改变方向，并且更新上边界
                if (start_x + 1 == right_border) {
                    direction = 1;
                    start_y += 1;
                    top_border += 1;
                } else {
                    start_x += 1;
                }
                break;
            //当前向下
            case 1:
                //继续向下是否到达边界
                //到达边界就改变方向，并且更新右边界
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

时间复杂度：O（m * n），m 和 n 是数组的长宽。

空间复杂度：O（1）。

# 总

在 leetcode 的 solution 和 discuss 看了下，基本就是这个思路了，只是实现上有些不同，怎么用来标记是否走过，当前方向，怎么遍历，实现有些不同，但本质上是一样的。就是充分理解题意，然后模仿遍历的过程。