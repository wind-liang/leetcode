# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/34.jpg)

找到目标值的第一次出现和最后一次出现的位置，同样要求 log ( n ) 下完成。

先分享 [leetcode](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/solution/) 提供的两个解法。

# 解法一 线性扫描

从左向右遍历，一旦出现等于 target 的值就结束，保存当前下标。如果从左到右没有找到 target，那么就直接返回 [ -1 , -1 ] 就可以了，因为从左到右没找到，那么从右到左也一定不会找到的。如果找到了，然后再从右到左遍历，一旦出现等于 target 的值就结束，保存当前下标。

时间复杂度是 O（n）并不满足题意，但可以了解下这个思路，从左到右，从右到左之前也遇到过。

```java
public int[] searchRange(int[] nums, int target) {
    int[] targetRange = {-1, -1};

    // 从左到右扫描
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) {
            targetRange[0] = i;
            break;
        }
    }

    // 如果之前没找到，直接返回 [ -1 , -1 ]
    if (targetRange[0] == -1) {
        return targetRange;
    }

    //从右到左扫描
    for (int j = nums.length-1; j >= 0; j--) {
        if (nums[j] == target) {
            targetRange[1] = j;
            break;
        }
    }

    return targetRange;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二 二分查找

让我们先看下正常的二分查找。

```java
int start = 0;
int end = nums.length - 1;
while (start <= end) {
    int mid = (start + end) / 2;
    if (target == nums[mid]) {
        return mid;
    } else if (target < nums[mid]) {
        end = mid - 1;
    } else {
        start = mid + 1;
    }
}
```

二分查找中，我们找到 target 就结束了，这里我们需要修改下。

我们如果找最左边等于 target 的值，找到 target 时候并不代表我们找到了我们所需要的，例如下边的情况，

![](https://windliang.oss-cn-beijing.aliyuncs.com/34_2.jpg)

此时虽然 mid 指向的值等于 target 了，但是我们要找的其实还在左边，为了达到 log 的时间复杂度，我们依旧是丢弃一半，我们需要更新 end = mid - 1，图示如下。

![](https://windliang.oss-cn-beijing.aliyuncs.com/34_3.jpg)

此时 tartget > nums [ mid ]  ，更新 start = mid + 1。

![](https://windliang.oss-cn-beijing.aliyuncs.com/34_6.jpg)

此时 target == nums [ mid ] ，但由于我们改成了 end = mid - 1，所以继续更新，end 就到了 mid 的左边，此时 start > end 了，就会走出 while 循环， 我们要找的值刚好就是 start 指向的了。那么我们修改的代码如下：

```java
while (start <= end) {
    int mid = (start + end) / 2;
    if (target == nums[mid]) {
        end = mid - 1;
    } else if (target < nums[mid]) {
        end = mid -1 ;
    } else {
        start = mid + 1;
    }
} 
```

找右边的同样的分析思路，就是判断需要丢弃哪一边。

所以最后的代码就出来了。leetcode 中是把找左边和找右边的合并起来了，本质是一样的。

```java
public int[] searchRange(int[] nums, int target) {
    int start = 0;
    int end = nums.length - 1;
    int[] ans = { -1, -1 };
    if (nums.length == 0) {
        return ans;
    }
    while (start <= end) {
        int mid = (start + end) / 2;
        if (target == nums[mid]) {
            end = mid - 1;
        } else if (target < nums[mid]) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    //考虑 tartget 是否存在，判断我们要找的值是否等于 target 并且是否越界
    if (start == nums.length || nums[ start ] != target) {
        return ans;
    } else {
        ans[0] = start;
    }
    ans[0] = start;
    start = 0;
    end = nums.length - 1;
    while (start <= end) {
        int mid = (start + end) / 2;
        if (target == nums[mid]) {
            start = mid + 1;
        } else if (target < nums[mid]) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    ans[1] = end;
    return ans;
}
```

时间复杂度：O（log（n））。

空间复杂度：O（1）。

# 解法三

以上是 leetcode 提供的思路，我觉得不是很好，因为它所有的情况都一定是循环 log（n）次，讲一下我最开始想到的。

相当于在解法二的基础上优化了一下，下边是解法二的代码。

```java
while (start <= end) {
    int mid = (start + end) / 2;
    if (target == nums[mid]) {
        end = mid - 1;
    } else if (target < nums[mid]) {
        end = mid -1 ;
    } else {
        start = mid + 1;
    }
} 
```

考虑下边的一种情况，如果我们找最左边等于 target 的，此时 mid 的位置已经是我们要找的了，而解法二更新成了 end = mid - 1，然后继续循环了，而此时我们其实完全可以终止了。只需要判断 nums[ mid - 1] 是不是小于 nums [ mid ] ，如果小于就刚好是我们要找的了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/34_4.jpg)

当然，找最右边也是同样的思路，看下代码吧。

```java
public int[] searchRange(int[] nums, int target) {
    int start = 0;
    int end = nums.length - 1;
    int[] ans = { -1, -1 };
    if (nums.length == 0) {
        return ans;
    }
    while (start <= end) {
        int mid = (start + end) / 2;
        if (target == nums[mid]) {
            //这里是为了处理 mid - 1 越界的问题，可以仔细想下。
            //如果 mid == 0，那么 mid 一定是我们要找的了，而此时 mid - 1 就会越界了，
            //为了使得下边的 target > n 一定成立，我们把 n 赋成最小值
            //如果 mid > 0，直接吧 nums[mid - 1] 赋给 n 就可以了。
            int n = mid > 0 ? nums[mid - 1] : Integer.MIN_VALUE;
            if (target > n) {
                ans[0] = mid;
                break;
            }
            end = mid - 1;
        } else if (target < nums[mid]) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    start = 0;
    end = nums.length - 1;
    while (start <= end) {
        int mid = (start + end) / 2;
        if (target == nums[mid]) {
            int n = mid < nums.length - 1 ? nums[mid + 1] : Integer.MAX_VALUE;
            if (target < n) {
                ans[1] = mid;
                break;
            }
            start = mid + 1;
        } else if (target < nums[mid]) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    return ans;
}
```

时间复杂度：O（log（n））。

空间复杂度：O（1）。

@JZW 的提醒下，上边的虽然能 AC，但是如果要找的数字刚好就是 Integer.MIN_VALUE 的话，就会出现错误。可以修改一下。

主要是这两句，除了小于 n，还判断了当前是不是在两端。

```java
if (target > n || mid == 0) {
if (target < n || mid == nums.length - 1) {
```

```java
public int[] searchRange(int[] nums, int target) {
    int start = 0;
    int end = nums.length - 1;
    int[] ans = { -1, -1 };
    if (nums.length == 0) {
        return ans;
    }
    while (start <= end) {
        int mid = (start + end) / 2;
        if (target == nums[mid]) {
            int n = mid > 0 ? nums[mid - 1] : Integer.MIN_VALUE;
            if (target > n || mid == 0) {
                ans[0] = mid;
                break;
            }
            end = mid - 1;
        } else if (target < nums[mid]) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    start = 0;
    end = nums.length - 1;
    while (start <= end) {
        int mid = (start + end) / 2;
        if (target == nums[mid]) {
            int n = mid < nums.length - 1 ? nums[mid + 1] : Integer.MAX_VALUE;
            if (target < n || mid == nums.length - 1) {
                ans[1] = mid;
                break;
            }
            start = mid + 1;
        } else if (target < nums[mid]) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    return ans;
}
```



# 总

总体来说，这道题并不难，本质就是对二分查找的修改，以便满足我们的需求。