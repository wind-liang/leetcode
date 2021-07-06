# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/275.png)

求 `H-Index`，和 [上一道题](https://leetcode.wang/leetcode-274-H-Index.html) 一样，只不过这道题给定的数组是有序的，详细的可以先做一下上一题。

# 解法一

 先看一下之前的其中一个的做法。

![img](https://windliang.oss-cn-beijing.aliyuncs.com/274_3.jpg)

我们从 `0` 开始遍历，依次判断点是否在直线下方，如果出现了点在直线上方（包括在直线上），那么当前点的垂线与直线交点的纵坐标就是 `H-Index` 了。

点的垂线与直线交点的纵坐标的求法是 `n - i`，`n` 是数组长度，`i` 是数组下标。

代码如下。

```java
public int hIndex(int[] citations) {
    Arrays.sort(citations);
    int n = citations.length;
    for (int i = 0; i < n; i++) {
        // 点在直线上方
        if (citations[i] >= n - i) {
            return n - i;
        }
    }
    return 0;
}

```

说白了，我们是要寻找**第一个**在直线上方（包括在直线上）的点，给定数组是有序的，所以我们可以用二分查找。

```java
public int hIndex(int[] citations) {
    int n = citations.length;
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = (low + high) >>> 1;
        //在直线上方
        if (citations[mid] >= n - mid) {
            if (mid == 0) {
                return n;
            }
            //前一个点是否在直线下方
            int before = mid - 1;
            if (citations[before] < n - before) {
                return n - mid;
            }
            
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return 0;
}
```

# 总

主要就是二分查找的应用了。