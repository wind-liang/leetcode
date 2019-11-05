# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/152.jpg)

找一个连续的子数组，使得连乘起来最大。

# 解法一 动态规划

开始没有往这方面想，直接想到了解法二，一会儿讲。看到 [这里](https://leetcode.com/problems/maximum-product-subarray/discuss/48230/Possibly-simplest-solution-with-O(n)-time-complexity)，才想起来直接用动态规划解就可以，和 [53 题](https://leetcode.wang/leetCode-53-Maximum-Subarray.html) 子数组最大的和思路差不多。

我们先定义一个数组 `dpMax`，用 `dpMax[i]` 表示以第 `i` 个元素的结尾的子数组，乘积最大的值，也就是这个数组必须包含第 `i` 个元素。

那么 `dpMax[i]` 的话有几种取值。

* 当 `nums[i] >= 0` 并且`dpMax[i-1] > 0`，`dpMax[i] = dpMax[i-1] * nums[i]`
* 当 `nums[i] >= 0` 并且`dpMax[i-1] < 0`，此时如果和前边的数累乘的话，会变成负数，所以`dpMax[i] = nums[i]`
* 当 `nums[i] < 0`，此时如果前边累乘结果是一个很大的负数，和当前负数累乘的话就会变成一个更大的数。所以我们还需要一个数组 `dpMin` 来记录以第 `i` 个元素的结尾的子数组，乘积最小的值。
  * 当`dpMin[i-1] < 0`，`dpMax[i] = dpMin[i-1] * nums[i]`
  * 当`dpMin[i-1] >= 0`，`dpMax[i] =  nums[i]`

当然，上边引入了 `dpMin` 数组，怎么求 `dpMin` 其实和上边求 `dpMax` 的过程其实是一样的。

按上边的分析，我们就需要加很多的 `if else`来判断不同的情况，这里可以用个技巧。

我们注意到上边`dpMax[i]` 的取值无非就是三种，`dpMax[i-1] * nums[i]`、`dpMin[i-1] * nums[i]` 以及 `nums[i]`。

所以我们更新的时候，无需去区分当前是哪种情况，只需要从三个取值中选一个最大的即可。

```java
dpMax[i] = max(dpMax[i-1] * nums[i], dpMin[i-1] * nums[i], nums[i]);
```

求 `dpMin[i]` 同理。

```java
dpMin[i] = min(dpMax[i-1] * nums[i], dpMin[i-1] * nums[i], nums[i]);
```

更新过程中，我们可以用一个变量 `max` 去保存当前得到的最大值。

```java
public int maxProduct(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }

    int[] dpMax = new int[n];
    dpMax[0] = nums[0];
    int[] dpMin = new int[n];
    dpMin[0] = nums[0];
    int max = nums[0];
    for (int i = 1; i < n; i++) {
        dpMax[i] = Math.max(dpMin[i - 1] * nums[i], Math.max(dpMax[i - 1] * nums[i], nums[i]));
        dpMin[i] = Math.min(dpMin[i - 1] * nums[i], Math.min(dpMax[i - 1] * nums[i], nums[i]));
        max = Math.max(max, dpMax[i]);
    }
    return max;
}
```

当然，动态规划的老问题，我们注意到更新 `dp[i]` 的时候，我们只用到 `dp[i-1]` 的信息，再之前的信息就用不到了。所以我们完全不需要一个数组，只需要一个变量去重复覆盖更新即可。

```java
public int maxProduct(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    int dpMax = nums[0];
    int dpMin = nums[0];
    int max = nums[0];
    for (int i = 1; i < n; i++) {
        //更新 dpMin 的时候需要 dpMax 之前的信息，所以先保存起来
        int preMax = dpMax;
        dpMax = Math.max(dpMin * nums[i], Math.max(dpMax * nums[i], nums[i]));
        dpMin = Math.min(dpMin * nums[i], Math.min(preMax * nums[i], nums[i]));
        max = Math.max(max, dpMax);
    }
    return max;
}
```

# 解法二

仔细想一个这个题在考什么，我们先把题目简单化，以方便理清思路。

如果给定的数组全部都是正数，那么子数组最大的乘积是多少呢？很简单，把所有的数字相乘即可。

但如果给定的数组存在负数呢，似乎这就变得麻烦些了。

我们继续简化问题，如果出现了偶数个负数呢？此时最大乘积又变成了，把所有的数字相乘即可。

所以，其实我们需要解决的问题就是，当出现奇数个负数的时候该怎么办。

乘积理论上乘的数越多越好，但前提是必须保证负数是偶数个。

那么对于一个有奇数个负数的数组，基于上边的原则，最大数的取值情况就是两种。

第一种，如下图，不包含最后一个负数的子数组。

![](https://windliang.oss-cn-beijing.aliyuncs.com/152_2.jpg)

第二种，如下图，不包含第一个负数的子数组。

![](https://windliang.oss-cn-beijing.aliyuncs.com/152_3.jpg)

综上所述，最大值要么是全部数字相乘，要么是上边的两种情况。

写代码的话，我们如果考虑当前负数是偶数个还是奇数个，第几次遇到负数，当前是否要累乘，就会变得很复杂很复杂，比如下边的代码（就不要理解下边的代码了）。

```java
public int maxProduct(int[] nums) {
    if (nums.length == 0) {
        return 0;
    }
    if (nums.length == 1) {
        return nums[0];
    }
    int max_even = 1;
    boolean flag = false;
    boolean update = false;
    int max = 0;
    int max_odd = 1;
    for (int i = 0; i < nums.length; i++) {
        max_even *= nums[i];
        max = Math.max(max, max_even);
        if (nums[i] == 0) {

            if (update) {
                max = Math.max(max, max_odd);
            }
            max_even = 1;
            max_odd = 1;
            flag = false;
            update = false;
            continue;
        }
        if (flag) {
            max_odd *= nums[i];
            update = true;
            continue;
        }
        if (nums[i] < 0) {
            flag = true;
        }
    }
    if (update) {

        max = Math.max(max, max_odd);
    }
    flag = false;
    update = false;
    max_odd = 1;
    for (int i = nums.length - 1; i >= 0; i--) {
        if (nums[i] == 0) {
            if (update) {
                max = Math.max(max, max_odd);
            }
            max_odd = 1;
            flag = false;
            update = false;
            continue;
        }
        if (flag) {
            max_odd *= nums[i];
            update = true;
            continue;
        }
        if (nums[i] < 0) {
            flag = true;
        }
    }
    if (update) {
        max = Math.max(max, max_odd);
    }

    return max;
}
```

事实上，和解法一一样，我们只要保证计算过程中包含了上边讨论的三种情况即可。

对于负数是奇数个的情况，我们采用正着遍历，倒着遍历的技巧即可。

```java
public int maxProduct(int[] nums) {
    if (nums.length == 0) {
        return 0;
    }
    int max = 1;
    int res = nums[0];
    //包含了所有数相乘的情况
    //奇数个负数的情况一
    for (int i = 0; i < nums.length; i++) {
        max *= nums[i];
        res = Math.max(res, max);
    }
    max = 1;
    //奇数个负数的情况二
    for (int i = nums.length - 1; i >= 0; i--) {
        max *= nums[i];
        res = Math.max(res, max);
    }

    return res;
}
```

不过代码还没有结束，我们只考虑了负数和正数，没有考虑 `0`。如果有 `0` 存在的话，会使得上边的代码到 `0` 的位置之后 `max` 就一直变成 `0` 了。

修正这个问题可以用一个直接的方式，把数组看成下边的样子。

![](https://windliang.oss-cn-beijing.aliyuncs.com/152_4.jpg)

把数组看成几个都不含有 `0` 的子数组进行解决即可。

代码中，我们只需要在遇到零的时候，把 `max` 再初始化为 `1` 即可。

```java
public int maxProduct(int[] nums) {
    if (nums.length == 0) {
        return 0;
    }

    int max = 1;
    int res = nums[0];
    for (int i = 0; i < nums.length; i++) {
        max *= nums[i];
        res = Math.max(res, max);
        if (max == 0) {
            max = 1;
        }

    }
    max = 1;
    for (int i = nums.length - 1; i >= 0; i--) {
        max *= nums[i];
        res = Math.max(res, max);
        if (max == 0) {
            max = 1;
        }
    }

    return res;
}
```

# 总

解法二其实是对问题本质的深挖，正常情况下，我们其实用动态规划的思想去直接求解即可。