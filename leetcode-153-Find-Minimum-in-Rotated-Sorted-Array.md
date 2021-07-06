# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/153.jpg)

给定一个特殊升序数组，即一个排序好的数组，把前边的若干的个数，一起移动到末尾，找出最小的数字。

# 解法一

其实之前已经在 [33 题](https://leetcode.wang/leetCode-33-Search-in-Rotated-Sorted-Array.html) 解法一中写过这个解法了，这里直接贴过来。

求最小值，遍历一遍当然可以，不过这里提到了有序数组，所以我们可以采取二分的方法去找，二分的方法就要保证每次比较后，去掉一半的元素。

这里我们去比较中点和端点值的情况，那么是根据中点和起点比较，还是中点和终点比较呢？我们来分析下。

- `mid` 和 `start` 比较

  `mid > start` : 最小值在左半部分。

  ![](https://windliang.oss-cn-beijing.aliyuncs.com/33_5.jpg)

  `mid < start`： 最小值在左半部分。

  ![](https://windliang.oss-cn-beijing.aliyuncs.com/33_6.jpg)

  无论大于还是小于，最小值都在左半部分，所以 `mid` 和 `start` 比较是不可取的。

- `mid` 和 `end` 比较

  `mid` < `end`：最小值在左半部分。

  ![](https://windliang.oss-cn-beijing.aliyuncs.com/33_5.jpg)

  ![](https://windliang.oss-cn-beijing.aliyuncs.com/33_6.jpg)

  `mid` > `end`：最小值在右半部分。

  ![](https://windliang.oss-cn-beijing.aliyuncs.com/33_7.jpg)

  所以我们只需要把 `mid` 和 `end` 比较，`mid < end` 丢弃右半部分（更新 `end = mid`），`mid > end` 丢弃左半部分（更新 `start = mid`）。直到 `end` 等于 `start` 时候结束就可以了。

但这样会有一个问题的，对于下边的例子，就会遇到死循环了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/33_8.jpg)

问题出在，当数组剩两个的时候，`mid = （start + end）/ 2`，`mid` 取的就是 `start`。上图的例子， `mid > end`, 更新 `start = mid`，`start` 位置并不会变化。那么下一次 `mid` 的值也不会变，就死循环了。所以，我们要更新 `start = mid + 1`，同时也使得 `start` 指向了最小值。

综上，找最小值的代码就出来了。

```java
public int findMin(int[] nums) {
    int start = 0;
    int end = nums.length - 1;
    while (start < end) {
        int mid = (start + end) >>> 1;
        if (nums[mid] > nums[end]) {
            start = mid + 1;
        } else {
            end = mid;
        }
    }
    return nums[start];
}
```

# 解法二

解法一中我们把 `mid` 和 `end` 进行比较，那么我们能不能把 `mid` 和 `start` 比较解决问题呢？

看一下之前的分析。

`mid` 和 `start` 比较

`mid > start` : 最小值在左半部分或者右半部分。

![](https://windliang.oss-cn-beijing.aliyuncs.com/33_5.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/33_7.jpg)

`mid < start`： 最小值在左半部分。

![](https://windliang.oss-cn-beijing.aliyuncs.com/33_6.jpg)

上边的问题就出在了 `mid > start` 中出现了两种情况，如果数组是有序的最小值出现在了左半部分，和`mid < start` 出现了同样的情况。所以我们其实只需要在更新 `start` 和 `end` 之前，判断数组是否已经有序，把这种情况单独考虑。有序的话，直接返回第一个元素即可。

```java
public int findMin(int[] nums) {
    int start = 0;
    int end = nums.length - 1;
    while (start < end) {
        if (nums[start] < nums[end]) {
            return nums[start];
        }
        int mid = (start + end) >>> 1;
        //必须是大于等于，比如 nums=[9,8],mid 和 start 都指向了 9
        if (nums[mid] >= nums[start]) {
            start = mid + 1;
        } else {
            end = mid;
        }
    }
    return nums[start];
}
```

本质上其实和解法一是一样的。

此外还可以思考一个问题，如果给定的数组经过了一次变化，也就是给定的不是有序的，那么我们是不是就不用在过程中判断当前是不是有序数组了？

答案肯定是否定的了，比如 `nums = [4,5,6,1,2,3]`，经过一次更新，`start` 会指向 `1`，`end` 会指向 `3`，此时就变成有序了，所以在过程中我们必须判断数组是否有序。而解法一的好处就是，即使是有序的，也不影响我们的判断。

# 总

二分的方法，主要就是要确定丢弃哪一半。







