# 题目描述（中等难度）

300、Longest Increasing Subsequence

Given an unsorted array of integers, find the length of longest increasing subsequence.

**Example:**

```
Input: [10,9,2,5,3,7,101,18]
Output: 4 
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4. 
```

**Note:**

- There may be more than one LIS combination, it is only necessary for you to return the length.
- Your algorithm should run in O(*n2*) complexity.

**Follow up:** Could you improve it to O(*n* log *n*) time complexity?

最长上升子序列的长度。

# 解法一

比较经典的一道题，之前笔试也遇到过。最直接的方法就是动态规划了。

`dp[i]`表示以第 `i` 个数字**为结尾**的最长上升子序列的长度。

求 `dp[i]` 的时候，如果前边的某个数 `nums[j] < nums[i]` ，那么我们可以将第 `i` 个数接到第 `j` 个数字的后边作为一个新的上升子序列，此时对应的上升子序列的长度就是 `dp[j] + 1`。

可以从下边情况中选择最大的。

如果 `nums[0] < nums[i]`，`dp[0] + 1` 就是 `dp[i]` 的一个备选解。

如果 `nums[1] < nums[i]`，`dp[1] + 1` 就是 `dp[i]` 的一个备选解。

如果 `nums[2] < nums[i]`，`dp[2] + 1` 就是 `dp[i]` 的一个备选解。

...

如果 `nums[i-1] < nums[i]`，`dp[i-1] + 1` 就是 `dp[i]` 的一个备选解。

从上边的备选解中选择最大的就是 `dp[i]` 的值。

```java
public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    int dp[] = new int[n];
    int max = 1;
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        max = Math.max(max, dp[i]);
    }
    return max;
}
```

时间复杂度：`O(n²)`。

空间复杂度：`O(1)`。

# 解法二

还有一种很巧妙的方法，最开始知道这个方法的时候就觉得很巧妙，但还是把它忘记了，又看了一遍 [这里](https://leetcode.com/problems/longest-increasing-subsequence/discuss/74824/JavaPython-Binary-search-O(nlogn)-time-with-explanation) 才想起来。

不同之处在于 `dp` 数组的定义。

`dp[i]` 表示长度为 `i + 1` 的所有上升子序列的末尾的最小值。

比较绕，举个例子。

```java
nums = [4,5,6,3]
len = 1   :      [4], [5], [6], [3]   => tails[0] = 3
长度为 1 的上升子序列有 4 个，末尾最小的值就是 4
    
len = 2   :      [4, 5], [5, 6]       => tails[1] = 5
长度为 2 的上升子序列有 2 个，末尾最小的值就是 5
    
len = 3   :      [4, 5, 6]            => tails[2] = 6
长度为 3 的上升子序列有 1 个，末尾最小的值就是 6   
```

有了上边的定义，我们可以依次考虑每个数字，举个例子。

```java
nums = [10,9,2,5,3,7,101,18]

开始没有数字
dp = []

1----------------------------
10  9  2  5  3  7  101  18
^   

先考虑 10, 只有 1 个数字, 此时长度为 1 的最长上升子序列末尾的值就是 10
len   1
dp = [10]

2----------------------------
10  9  2  5  3  7  101  18
    ^  
考虑 9, 9 比之前长度为 1 的最长上升子序列末尾的最小值 10 小, 更新长度为 1 的最长上升子序列末尾的值为 9
len   1
dp = [9]    
    
3----------------------------
10  9  2  5  3  7  101  18
       ^  
考虑 2, 2 比之前长度为 1 的最长上升子序列末尾的最小值 9 小, 更新长度为 1 的最长上升子序列末尾的值为 2
len   1
dp = [2]    

4----------------------------
10  9  2  5  3  7  101  18
          ^  
考虑 5, 
5 比之前长度为 1 的最长上升子序列末尾的最小值 2 大, 
此时可以扩展长度, 更新长度为 2 的最长上升子序列末尾的值为 5
len   1  2
dp = [2  5]   

5----------------------------
10  9  2  5  3  7  101  18
             ^  
考虑 3, 
3 比之前长度为 1 的最长上升子序列末尾的最小值 2 大, 向后考虑
3 比之前长度为 2 的最长上升子序列末尾的最小值 5 小, 更新长度为 2 的最长上升子序列末尾的值为 3
len   1  2
dp = [2  3]   

6----------------------------
10  9  2  5  3  7  101  18
                ^  
考虑 7, 
7 比之前长度为 1 的最长上升子序列末尾的最小值 2 大, 向后考虑
7 比之前长度为 2 的最长上升子序列末尾的最小值 3 大, 向后考虑
此时可以扩展长度, 更新长度为 3 的最长上升子序列末尾的值为 7
len   1  2  3
dp = [2  3  7]  

7----------------------------
10  9  2  5  3  7  101  18
                    ^  
考虑 101, 
101 比之前长度为 1 的最长上升子序列末尾的最小值 2 大, 向后考虑
101 比之前长度为 2 的最长上升子序列末尾的最小值 3 大, 向后考虑
101 比之前长度为 3 的最长上升子序列末尾的最小值 7 大, 向后考虑
此时可以扩展长度, 更新长度为 4 的最长上升子序列末尾的值为 101
len   1  2  3   4
dp = [2  3  7  101]  

8----------------------------
10  9  2  5  3  7  101  18
                        ^  
考虑 18, 
18 比之前长度为 1 的最长上升子序列末尾的最小值 2 大, 向后考虑
18 比之前长度为 2 的最长上升子序列末尾的最小值 3 大, 向后考虑
18 比之前长度为 3 的最长上升子序列末尾的最小值 7 大, 向后考虑
3 比之前长度为 4 的最长上升子序列末尾的最小值 101 小, 更新长度为 4 的最长上升子序列末尾的值为 18
len   1  2  3   4
dp = [2  3  7   18] 

遍历完成，所以数字都考虑了，此时 dp 的长度就是最长上升子序列的长度
```

总结上边的规律，新来一个数字以后，我们去寻找 `dp` 中第一个比它大的值，然后将当前值更新为新来的数字。

如果 `dp` 中没有比新来的数字大的数，那么就扩展长度，将新来的值放到最后。

写代码的话，因为 `dp` 是一个动态扩容的过程，我们可以用一个 `list` 。但由于比较简单，我们知道 `dp` 最大的长度也就是 `nums` 的长度，我们可以直接用数组，然后自己记录当前数组的长度即可。

```java
public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    int dp[] = new int[n];
    int len = 0;
    for (int i = 0; i < n; i++) {
        int j = 0;
        // 寻找 dp 中第一个大于等于新来的数的位置
        for (j = 0; j < len; j++) {
            if (nums[i] <= dp[j]) {
                break;
            }
        }
        // 更新当前值
        dp[j] = nums[i];
        // 是否更新长度
        if (j == len) {
            len++;
        }
    }
    return len;
}
```

上边花了一大段话讲这个解法，但是上边的时间复杂度依旧是 `O(n²)`，当然不能满足。

这个解法巧妙的地方在于，通过上边 `dp` 的定义，`dp` 一定是有序的。我们要从一个有序数组中寻找第一个大于等于新来数的位置，此时就可以通过二分查找了。

```java
public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    int dp[] = new int[n];
    int len = 0;
    for (int i = 0; i < n; i++) {
        int start = 0;
        int end = len; 
        while (start < end) {
            int mid = (start + end) >>> 1;
            if (dp[mid] < nums[i]) {
                start = mid + 1;
            } else {
                end = mid;
            }
        }
        dp[start] = nums[i];
        if (start == len) {
            len++;
        }
    }
    return len;
}
```

这样的话时间复杂度就是 `O(nlog(n))` 了。

上边需要注意的一点是，在二分查找中我们将 `end` 初始化为  `len`, 平常我们习惯上初始化为 `len - 1`。

赋值为 `len` 的目的是当 `dp` 中没有数字比当前数字大的时候，最后 `start` 刚好就是 `len`, 方便扩展数组。

# 总

解法一比较常规，比较容易想到。

解法二的话就很巧妙了，关键就是 `dp` 的定义使得 `dp` 是一个有序数组了。这种也不容易记住，半年前笔试做过这道题，但现在还是忘记了，不过还是可以欣赏一下的，哈哈。

