# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/162.png)

给一个数组，找出任意一个峰顶。找出的这个峰顶的特点就是，比它的左邻居和右邻居都大。

# 解法一 线性扫描

因为 `nums[-1]` 看做负无穷，所以从第 `0` 个元素开始，它一定是上升的趋势，由于我们要找峰顶，所以当它第一次出现下降，下降前的值就是我们要找的了。

如果它一直上升到最后一个值，又因为 `nums[n]` 看做负无穷，所以最后一个值就可以看做一个峰顶。

````java
public int findPeakElement(int[] nums) {
    for (int i = 0; i < nums.length - 1; i++) {
        //第一次下降
        if (nums[i] > nums[i + 1]) {
            return i;
        }
    }
    //一直上升
    return nums.length - 1;
}
````

# 解法二 二分法

要不是题目下边提示时间复杂度可以达到 `log` 级别，还真不敢往二分的方面想。因为二分法，我们一般用在有序数组上，那么这个题为什么可以用二分呢？

不管什么情况，之所以能用二分，是因为我们可以根据某个条件，直接抛弃一半的元素，从而使得时间复杂度降到 `log` 级别。

至于这道题，因为题目告诉我们可以返回数组中的任意一个峰顶。所以我们只要确定某一半至少存在一个峰顶，那么另一半就可以抛弃掉。

我们只需要把 `nums[mid]` 和 `nums[mid + 1]` 比较。

先考虑第一次二分的时候，`start = 0`，`end = nums.length - 1`。

如果 `nums[mid] < nums[mid + 1]`，此时在上升阶段，因为  `nums[n]` 看做负无穷，也就是最终一定会下降，所以 `mid + 1` 到 `end` 之间至少会存在一个峰顶，可以把左半部分抛弃。

如果 `nums[mid] > nums[mid + 1]`，此时在下降阶段，因为  `nums[0]` 看做负无穷，最初一定是上升阶段，所以 `start` 到 `mid` 之间至少会存在一个峰顶，可以把右半部分抛弃。

通过上边的切割，我们就保证了后续左边界一定是在上升，右边界一定是在下降，所以第二次、第三次... 的二分就和上边一个道理了。

代码的话就可以有两种形式了，一种递归，一种迭代。

递归的代码如下：

```java
public int findPeakElement(int[] nums) {
    return findPeakElementHelper(nums, 0, nums.length - 1);
}

private int findPeakElementHelper(int[] nums, int start, int end) {
    if (start == end) {
        return start;
    }
    int mid = (start + end) >>> 1;
    if (nums[mid] < nums[mid + 1]) {
        return findPeakElementHelper(nums, mid + 1, end);
    } else {
        return findPeakElementHelper(nums, start, mid);
    }
}
```

由于递归形式比较简单，所以我们最好用迭代去实现，因为递归的话需要压栈的空间。虽然上边的递归是尾递归的形式，不需要压栈，但这需要编译器的支持。

```java
public int findPeakElement(int[] nums) {
    int start = 0;
    int end = nums.length - 1;

    while(start!=end) {
        int mid = (start + end) >>> 1;
        if(nums[mid] < nums[mid + 1]) {
            start = mid + 1;
        }else {
            end = mid;
        }
    }
    return start;
}
```

# 总

第一次遇到不需要有序数组也可以二分的题，蛮有意思。