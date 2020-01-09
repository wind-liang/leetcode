# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/209.jpg)

找出最小的连续子数组，使得子数组的和大于等于 `s`。

# 解法一 暴力破解

从第 `0` 个数字开始，依次添加数字，记录当总和大于等于 `s` 时的长度。

从第 `1` 个数字开始，依次添加数字，记录当总和大于等于 `s` 时的长度。

从第 `2` 个数字开始，依次添加数字，记录当总和大于等于 `s` 时的长度。

...

从最后个数字开始，依次添加数字，记录当总和大于等于 `s` 时的长度。

从上边得到的长度中选择最小的即可。

```java
public int minSubArrayLen(int s, int[] nums) {
    int min = Integer.MAX_VALUE;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        int start = i;
        int sum = 0;
        while (start < n) {
            sum += nums[start];
            start++;
            //当前和大于等于 s 的时候结束
            if (sum >= s) {
                min = Math.min(min, start - i);
                break;
            }
        }
    }
    //min 是否更新，如果没有更新说明数组所有的数字和小于 s, 没有满足条件的解, 返回 0
    return min == Integer.MAX_VALUE ? 0 : min;
}
```

时间复杂度：`O(n²)`。

# 解法二 双指针

受到 [76 题](https://leetcode.wang/leetCode-76-Minimum-Window-Substring.html) Minimum Window Substring 的启示，找一个范围使得其值满足某个条件，然后就会想到滑动窗口，也就是用双指针的方法。和这道题本质是一样的。

用双指针 left 和 right 表示一个窗口。

1. right 向右移增大窗口，直到窗口内的数字和大于等于了 `s`。进行第 `2` 步。
2. 记录此时的长度，left 向右移动，开始减少长度，每减少一次，就更新最小长度。直到当前窗口内的数字和小于了 `s`，回到第 1 步。

举个例子，模拟下滑动窗口的过程吧。

```java
s = 7, nums = [2,3,1,2,4,3]

2 3 1 2 4 3
^
l
r
上边的窗口内所有数字的和 2 小于 7, r 右移

2 3 1 2 4 3
^ ^
l r
上边的窗口内所有数字的和 2 + 3 小于 7, r 右移

2 3 1 2 4 3
^   ^
l   r
上边的窗口内所有数字的和 2 + 3 + 1 小于 7, r 右移

2 3 1 2 4 3
^     ^
l     r
上边的窗口内所有数字的和 2 + 3 + 1 + 2 大于等于了 7, 记录此时的长度 min = 4, l 右移

2 3 1 2 4 3
  ^   ^
  l   r
上边的窗口内所有数字的和 3 + 1 + 2  小于 7, r 右移

2 3 1 2 4 3
  ^     ^
  l     r
上边的窗口内所有数字的和 3 + 1 + 2 + 4 大于等于了 7, 更新此时的长度 min = 4, l 右移

2 3 1 2 4 3
    ^   ^
    l   r
上边的窗口内所有数字的和 1 + 2 + 4 大于等于了 7, 更新此时的长度 min = 3, l 右移

2 3 1 2 4 3
      ^ ^
      l r
上边的窗口内所有数字的和 2 + 4 小于 7, r 右移

2 3 1 2 4 3
      ^   ^
      l   r
上边的窗口内所有数字的和 2 + 4 + 3 大于等于了 7, 更新此时的长度 min = 3, l 右移

2 3 1 2 4 3
        ^ ^
        l r
上边的窗口内所有数字的和 4 + 3 大于等于了 7, 更新此时的长度 min = 2, l 右移

2 3 1 2 4 3
          ^
          r
          l
上边的窗口内所有数字的和 3 小于 7, r 右移，结束
```

代码的话，只需要还原上边的过程即可。

```java
public int minSubArrayLen(int s, int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    int left = 0;
    int right = 0;
    int sum = 0;
    int min = Integer.MAX_VALUE;
    while (right < n) {
        sum += nums[right];
        right++;
        while (sum >= s) {
            min = Math.min(min, right - left);
            sum -= nums[left];
            left++;
        }
    }
    return min == Integer.MAX_VALUE ? 0 : min;
}
```

时间复杂度：`O(n)`。

# 解法三 二分查找

正常想的话，到解法二按理说已经结束了，但题目里让提出一个 `O(nlog(n))` 的解法，这里自己也没想出来，分享下 [这里](https://leetcode.com/problems/minimum-size-subarray-sum/discuss/59123/O(N)O(NLogN)-solutions-both-O(1)-space) 的想法。

看到 `log` 就会想到二分查找，接着就会想到有序数组，最后，有序数组在哪里呢？

定义一个新的数组，`sums[i]` ，代表从 `0` 到 `i` 的累积和，这样就得到了一个有序数组。

这样做有个好处，那就是通过 `sums` 数组，如果要求 `i` 到 `j` 的所有子数组的和的话，就等于 `sums[j] - sums[i - 1]`。也就是前 `j` 个数字的和减去前 `i - 1 ` 个数字的和。

然后求解这道题的话，算法和解法一的暴力破解还是一样的，也就是

求出从第 `0` 个数字开始，总和大于等于 `s` 时的长度。

求出从第 `1` 个数字开始，总和大于等于 `s` 时的长度。

求出从第 `2` 个数字开始，总和大于等于 `s` 时的长度。

...

不同之处在于这里求总和时候，可以利用 `sums` 数组，不再需要累加了。

比如求从第 `i` 个数字开始，总和大于等于 `s` 时的长度，我们只需要找从第 `i + 1` 个数字到第几个数字的和大于等于 `s - nums[i]` 即可。求 `i + 1` 到 `j` 的所有数字的和的话，前边已经说明过了，也就是 `sums[j] - sums[i]`。

```java
public int minSubArrayLen(int s, int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    int[] sums = new int[n];
    sums[0] = nums[0];
    for (int i = 1; i < n; i++) {
        sums[i] = nums[i] + sums[i - 1];
    }
    int min = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        int s2 = s - nums[i]; //除去当前数字
        for (int j = i; j < n; j++) {
            //i + 1 到  j 的所有数字和
            if (sums[j] - sums[i] >= s2) {
                min = Math.min(min, j - i + 1);
            }
        }
    }
    return min == Integer.MAX_VALUE ? 0 : min;
}
```

至于二分查找，我们只需要修改内层的 `for` 循环。对于 `sums[j] - sums[i] >= s2`，通过移项，也就是 `sums[j] >= s2 + sums[i] ` ，含义就是寻找一个 `sums[j]`，使得其刚好大于等于 `s2 + sums[i]`。因为 `sums` 是个有序数组，所有找 `sum[j]` 可以采取二分的方法。

```java
public int minSubArrayLen(int s, int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    int[] sums = new int[n];
    sums[0] = nums[0];
    for (int i = 1; i < n; i++) {
        sums[i] = nums[i] + sums[i - 1];
    }
    int min = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        int s2 = s - nums[i];
        //二分查找，目标值是 s2 + sums[i]
        int k = binarySearch(i, n - 1, sums, s2 + sums[i]);
        if (k != -1) {
            min = Math.min(min, k - i + 1);
        }

    }
    return min == Integer.MAX_VALUE ? 0 : min;
}

//寻求刚好大于 target 的 sums 的下标，也就是大于等于 target 所有 sums 中最小的那个
private int binarySearch(int start, int end, int[] sums, int target) {
    int mid = -1;
    while (start <= end) {
        mid = (start + end) >>> 1;
        if (sums[mid] == target) {
            return mid;
        } else if (sums[mid] < target) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    //是否找到，没有找到返回 -1
    return sums[mid] > target ? mid : -1;
}
```

时间复杂度：`O(nlog(n))`。

# 解法四 二分查找

解法三的二分查找的关键在于 `sums` 数组的定义，一般情况下也不会往那方面想。还是在  [这里](https://leetcode.com/problems/minimum-size-subarray-sum/discuss/59123/O(N)O(NLogN)-solutions-both-O(1)-space)  看到的解法，另外一种二分的思路，蛮有意思，分享一下。

题目中，我们要寻找连续的数字和大于等于 `s` 的最小长度。那么，我们可以对这个长度采取二分的方法去寻找吗？

答案是肯定的，原因就是长度为 `1` 的所有连续数字中最大的和、长度为 `2` 的所有连续数字中最大的和、长度为 `3` 的所有连续数字中最大的和 ... 长度为 `n` 的所有连续数字中最大的和，同样是一个升序数组。

算法的话就是对长度进行二分，寻求满足条件的最小长度。

对于长度为 `n` 的数组，我们先去判断长度为 `n/2` 的连续数字中最大的和是否大于等于 `s`。

* 如果大于等于 `s` ，那么我们需要减少长度，继续判断所有长度为 `n/4` 的连续数字
* 如果小于 `s`，我们需要增加长度，我们继续判断所有长度为 `(n/2 + n) / 2`，也就是 `3n/4` 的连续数字。

可以再结合下边的代码看一下。

```java
public int minSubArrayLen(int s, int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    int minLen = 0, maxLen = n;
    int midLen;
    int min = -1;
    while (minLen <= maxLen) {
        //取中间的长度
        midLen = (minLen + maxLen) >>> 1;
        //判断当前长度的最大和是否大于等于 s
        if (getMaxSum(midLen, nums) >= s) {
            maxLen = midLen - 1; //减小长度
            min = midLen; //更新最小值
        } else {
            minLen = midLen + 1; //增大长度
        }
    }
    return min == -1 ? 0 : min;
}

private int getMaxSum(int len, int[] nums) {
    int n = nums.length;
    int sum = 0;
    int maxSum = 0;
    // 达到长度
    for (int i = 0; i < len; i++) {
        sum += nums[i];
    }
    maxSum = sum; // 初始化 maxSum

    for (int i = len; i < n; i++) {
        // 加一个数字减一个数字，保持长度不变
        sum += nums[i];
        sum = sum - nums[i - len];
        // 更新 maxSum
        maxSum = Math.max(maxSum, sum);
    }
    return maxSum;
}
```

时间复杂度：`O(nlog(n))`。

# 总

这道题的话，通过前边刷题的经验，第一反应就想到了解法二中的双指针。如果不知道双指针的话，应该会想到解法一的暴力破解。

但对于二分查找的解法三和解法四，还是比较难想到的。不过回味完，其实二分查找的关键就是那个递增的有序数列，从而可以每次抛弃一半的可选解。

