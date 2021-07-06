# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/167.jpg)

给一个有序数组和一个目标值，找出两个数使其和为目标值，返回这两个数的位置（数组下标加 1）。

# 解法一

[第 1 题](https://leetcode.wang/leetCode-1-Two-Sum.html) 做过无序数组找两个数，里边的解法当然也可以用到这道题，利用了  `HashMap`，可以过去看一下。

[第 15 题](https://leetcode.wang/leetCode-15-3Sum.html) 找出三个数，使其和为目标值的题目中的解法中，其实我们将问题转换到了现在这道题，也可以过去看一下。具体的话，其实我们只需要首尾两个指针进行遍历即可。

```java
public int[] twoSum(int[] numbers, int target) {
    int i = 0;
    int j = numbers.length - 1;
    while (i < j) {
        if (numbers[i] + numbers[j] == target) {
            return new int[] { i + 1, j + 1 };
        } else if (numbers[i] + numbers[j] < target) {
            i++;
        } else {
            j--;
        }
    }
    //因为题目告诉我们一定有解，所以这里随便返回了
    return new int[] { -1, -1 };
}
```

# 总

这道题没有新东西，双指针的技巧经常用到。这可能是篇幅最少的一个题解了，哈哈。