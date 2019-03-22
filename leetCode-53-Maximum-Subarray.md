# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/53.jpg)

给一个数组，找出一个连续的子数组，长度任意，和最大。

# 解法一  动态规划思路一

用一个二维数组 dp\[ i \] \[ len \] 表示从下标 i 开始，长度为 len 的子数组的元素和。

这样长度是 len + 1 的子数组就可以通过长度是 len 的子数组去求，也就是下边的递推式，

dp \[ i  \] \[ len + 1 \] = dp\[ i \] \[ len \] + nums [ i + len - 1 ]。

当然，和[第 5 题](https://leetcode.windliang.cc/leetCode-5-Longest-Palindromic-Substring.html)一样，考虑到求 i + 1 的情况的时候，我们只需要 i 时候的情况，所有我们其实没必要用一个二维数组，直接用一维数组就可以了。

```java
public int maxSubArray(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    int max = Integer.MIN_VALUE;
    for (int len = 1; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            //直接覆盖掉前边对应的情况就行
            dp[i] = dp[i] + nums[i + len - 1];
            //更新 max
            if (dp[i] > max) {
                max = dp[i];
            }
        }
    }
    return max;
}
```

时间复杂度：O（n²）。

空间复杂度：O（n）。

# 解法二 动态规划思路二

参考[这里](https://leetcode.com/problems/maximum-subarray/discuss/20193/DP-solution-and-some-thoughts)。

用一个一维数组 dp [ i ] 表示以下标 i 结尾的子数组的元素的最大的和，也就是这个子数组最后一个元素是下边为 i 的元素，并且这个子数组是所有以 i 结尾的子数组中，和最大的。

这样的话就有两种情况，

* 如果 dp [ i - 1 ] < 0，那么 dp [ i ] = nums [ i ]。
* 如果 dp [ i - 1 ] >= 0，那么 dp [ i ] = dp [ i - 1 ] + nums [ i ]。 

```java
public int maxSubArray(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    int max = nums[0];
    dp[0] = nums[0];
    for (int i = 1; i < n; i++) {
        //两种情况更新 dp[i]
        if (dp[i - 1] < 0) {
            dp[i] = nums[i];
        } else {
            dp[i] = dp[i - 1] + nums[i];
        }
        //更新 max
        max = Math.max(max, dp[i]);
    }
    return max;
}
```

时间复杂度： O（n）。

空间复杂度：O（n）。

当然，和以前一样，我们注意到更新 i 的情况的时候只用到 i - 1 的时候，所以我们不需要数组，只需要两个变量。

```java
public int maxSubArray(int[] nums) {
    int n = nums.length;
    //两个变量即可
    int[] dp = new int[2];
    int max = nums[0];
    dp[0] = nums[0];
    for (int i = 1; i < n; i++) {
        //利用求余，轮换两个变量
        if (dp[(i - 1) % 2] < 0) {
            dp[i % 2] = nums[i];
        } else {
            dp[i % 2] = dp[(i - 1) % 2] + nums[i];
        }
        max = Math.max(max, dp[i % 2]);
    }
    return max;
}
```

时间复杂度： O（n）。

空间复杂度：O（1）。

 再粗暴点，直接用一个变量就可以了。

```java
public int maxSubArray(int[] nums) {
    int n = nums.length;
    int dp = nums[0];
    int max = nums[0]; 
    for (int i = 1; i < n; i++) {
        if (dp < 0) {
            dp = nums[i];
        } else {
            dp= dp + nums[i];
        }
        max = Math.max(max, dp);
    }
    return max;
}
```

而对于 

```java
if (dp < 0) {
    dp = nums[i];
} else {
    dp= dp + nums[i];
}
```

其实也可以这样理解，

```java
dp= Math.max(dp + nums[i],nums[i]);
```

然后就变成了[这里](https://leetcode.com/problems/maximum-subarray/discuss/20211/Accepted-O(n)-solution-in-java)提到的算法。

# 解法三 折半

题目最后说 

> If you have figured out the O(*n*) solution, try coding another solution using the divide and conquer approach, which is more subtle.

[这里](If you have figured out the O(*n*) solution, try coding another solution using the divide and conquer approach, which is more subtle.)找到了种解法，分享下。

假设我们有了一个函数 int getSubMax(int start, int end, int[] nums) ，可以得到 num [ start, end ) （左包右不包)  中子数组最大值。

如果， start == end，那么 getSubMax 直接返回 nums [ start  ] 就可以了。

```java
if (start == end) {
    return nums[start];
}
```

然后对问题进行分解。

先找一个 mid ， mid = ( start + end ) / 2。

然后，对于我们要找的和最大的子数组有两种情况。

* mid 不在我们要找的子数组中

  这样的话，子数组的最大值要么是 mid 左半部分数组的子数组产生，要么是右边的产生，最大值的可以利用 getSubMax 求出来。

  ```java
  int leftMax = getSubMax(start, mid, nums);
  int rightMax = getSubMax(mid + 1, end, nums);
  ```

* mid 在我们要找的子数组中

  这样的话，我们可以分别从 mid 左边扩展，和右边扩展，找出两边和最大的时候，然后加起来就可以了。当然如果，左边或者右边最大的都小于 0 ，我们就不加了。

  ```java
  int containsMidMax = getContainMidMax(start, end, mid, nums);
  private int getContainMidMax(int start, int end, int mid, int[] nums) {
      int containsMidLeftMax = 0; //初始化为 0 ，防止最大的值也小于 0 
      //找左边最大
      if (mid > 0) {
          int sum = 0;
          for (int i = mid - 1; i >= 0; i--) {
              sum += nums[i];
              if (sum > containsMidLeftMax) {
                  containsMidLeftMax = sum;
              }
          }
  
      }
      int containsMidRightMax = 0;
      //找右边最大
      if (mid < end) {
          int sum = 0;
          for (int i = mid + 1; i <= end; i++) {
              sum += nums[i];
              if (sum > containsMidRightMax) {
                  containsMidRightMax = sum;
              }
          }
      }
      return containsMidLeftMax + nums[mid] + containsMidRightMax;
  }
  ```

  最后，我们只需要返回这三个中最大的值就可以了。

综上，递归出口，问题分解就都有了。

```java
public int maxSubArray(int[] nums) {
    return getSubMax(0, nums.length - 1, nums);
}

private int getSubMax(int start, int end, int[] nums) {
    //递归出口
    if (start == end) {
        return nums[start];
    }
    int mid = (start + end) / 2;
    //要找的数组不包含 mid，然后得到左边和右边最大的值
    int leftMax = getSubMax(start, mid, nums);
    int rightMax = getSubMax(mid + 1, end, nums);
    //要找的数组包含 mid
    int containsMidMax = getContainMidMax(start, end, mid, nums);
    //返回它们 3 个中最大的
    return Math.max(containsMidMax, Math.max(leftMax, rightMax));
}

private int getContainMidMax(int start, int end, int mid, int[] nums) {
    int containsMidLeftMax = 0; //初始化为 0 ，防止最大的值也小于 0 
    //找左边最大
    if (mid > 0) {
        int sum = 0;
        for (int i = mid - 1; i >= 0; i--) {
            sum += nums[i];
            if (sum > containsMidLeftMax) {
                containsMidLeftMax = sum;
            }
        }

    }
    int containsMidRightMax = 0;
    //找右边最大
    if (mid < end) {
        int sum = 0;
        for (int i = mid + 1; i <= end; i++) {
            sum += nums[i];
            if (sum > containsMidRightMax) {
                containsMidRightMax = sum;
            }
        }
    }
    return containsMidLeftMax + nums[mid] + containsMidRightMax;
}
```

时间复杂度：O（n log ( n )）。由于 getContainMidMax 这个函数耗费了 O（n）。所以时间复杂度反而相比之前的算法变大了。

空间复杂度：

# 总

解法一和解法二的动态规划，只是在定义的时候一个表示以 i 开头的子数组，一个表示以 i 结尾的子数组，却造成了时间复杂度的差异。问题就是解法一中求出了太多的没必要的和，不如解法二直接，只保存最大的和。解法三，一半一半的求，从而使问题分解，也是经常遇到的思想。