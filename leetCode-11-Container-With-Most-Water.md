# 题目描述（中等难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/11_1.jpg)

每个数组代表一个高度，选两个任意的柱子往里边倒水，能最多倒多少水。

# 解法一 暴力解法

直接遍历任意两根柱子，求出能存水的大小，用一个变量保存最大的。

```java
public int maxArea(int[] height) {
    int max = 0;
    for (int i = 0; i < height.length; i++) {
        for (int j = i + 1; j < height.length; j++) {
            int h = Math.min(height[i], height[j]);
            if (h * (j - i) > max) {
                max = h * (j - i);
            }
        }
    }
    return max;
}
```

时间复杂度：O（n²）。

空间复杂度：O（1）。

# 解法二



![](http://windliang.oss-cn-beijing.aliyuncs.com/11_2.jpg)

我们理一下思路，大小是由长度和高度决定，如果选 0 到 8 就保证了长度最长，此时大小是 0 号柱子的高度 1 乘以长度 8 。我们如果想面积更大怎么做呢，只能减小长度，增加高度。是左边的柱子向右移动变成 1 号柱子呢？还是右边的柱子向左移动变成 7 号柱子呢？当然是哪边的柱子短就改哪边的！只有这样，高度才有可能增加。

例如我们如果把 8 号柱子变成 7 号柱子，此时长度减少了，然而高度还是 0 号柱子没有变化，所以面积就会减少。把 1 号柱子变成 2 号柱子就很好了，因为此时高度就变成了 8 号柱子的高度，面积就有可能会增加。

如果左右两边柱子相等该怎么办呢？随意！

我们假设 1 号 和 8 号 柱子高度是相等的。如果他们之间的柱子只有 1 根比它俩高或者没有比它俩高的，那么最大面积就一定选取是 1 号和 8 号了，所以 1 号接着变大，或者 8 号接着减小都是无所谓的，因为答案已经确定了。

![](http://windliang.oss-cn-beijing.aliyuncs.com/11_3.jpg)

假设 1 号 和 8 号之间有 2 根或以上的柱子比它俩高，假设是 4 号和 6 号比它俩高。1 号会变到 2 号、3 号，最终为 4 号，8 号会变到 7 号， 6 号，而在这个过程中产生的面积一定不会比 1 号和 8 号产生的面积大，因为过程中的柱子都比 1 号和 8 号低。所以是先变 1 号还是先变 8 号是无所谓的，无非是谁先到达更长的柱子而已。

看一下下边的算法，会更加清楚一些。

```java
public int maxArea2(int[] height) {
    int maxarea = 0, l = 0, r = height.length - 1;
    while (l < r) {
        maxarea = Math.max(maxarea, Math.min(height[l], height[r]) * (r - l));
        if (height[l] < height[r])
            l++;
        else
            r--;
    }
    return maxarea;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 总

为了减少暴力解法的时间复杂度，只能去深层次的理解题意，从而找出突破点。