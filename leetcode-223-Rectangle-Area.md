# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/223.png)

求出被两个矩形覆盖的面积。

# 解法一

这道题没有特殊的算法，就是对题目的分析，下边是我的思路。

首先将问题简单化，考虑如果没有重叠区域呢？

把两个矩形叫做 A 和 B，不重叠就有四种情况，A  在 B 左边，A 在 B 右边，A 在 B 上边，A 在 B 下边。

判断上边的四种情况也很简单，比如判断 A 是否在 B 左边，只需要判断 A 的最右边的坐标是否小于 B 的最左边的坐标即可。其他情况类似。

此时矩形覆盖的面积就是两个矩形的面积和。

接下来考虑有重叠的情况。

此时我们只要求出重叠形成的矩形的面积，然后用两个矩形的面积减去重叠矩形的面积就是两个矩形覆盖的面积了。

而求重叠矩形的面积也很简单，我们只需要确认重叠矩形的四条边即可，可以结合题目的图想。

左边只需选择两个矩形的两条左边靠右的那条。

上边只需选择两个矩形的两条上边靠下的那条。

右边只需选择两个矩形的两条右边靠左的那条。

下边只需选择两个矩形的两条下边靠上的那条。

确定以后，重叠的矩形的面积也就可以算出来了。

```java
public int computeArea(int A, int B, int C, int D, int E, int F, int G, int H) {
    //求第一个矩形的面积
    int length1 = C - A;
    int width1 = D - B;
    int area1 = length1 * width1;
	
    //求第二个矩形的面积
    int length2 = G - E;
    int width2 = H - F;
    int area2 = length2 * width2;

    // 没有重叠的情况
    if (E >= C || G <= A || F >= D || H <= B) {
        return area1 + area2;
    }
	
    //确定右边
    int x1 = Math.min(C, G);
    //确定左边
    int x2 = Math.max(E, A);
    int length3 = x1 - x2;

    //确定上边
    int y1 = Math.min(D, H);
    //确定下边
    int y2 = Math.max(F, B);
    int width3 = y1 - y2;
    int area3 = length3 * width3;

    return area1 + area2 - area3;
}
```

# 总

这道题没有什么算法，只需要分析题目，适当的分类将题目简单化，然后一一攻破即可。