# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/35.jpg)

给定一个有序数组，依旧是二分查找，不同之处是如果没有找到指定数字，需要返回这个数字应该插入的位置。

这道题比较简单，在二分查找的基础上，只要想清楚返回啥就够了。想的话，就考虑最简单的情况如果数组只剩下  2 5，target 是 1, 3, 6 的时候，此时我们应该返回什么就行。

```java
public int searchInsert(int[] nums, int target) {
    int start = 0;
    int end = nums.length - 1;
    if (nums.length == 0) {
        return 0;
    }
    while (start < end) {
        int mid = (start + end) / 2;
        if (target == nums[mid]) {
            return mid;
        } else if (target < nums[mid]) {
            end = mid;
        } else {
            start = mid + 1;
        }
    }
    //目标值在不在当前停的位置的前边还是后边
    if(target>nums[start]){
        return start + 1;
    }
    //如果小于的话，就返回当前位置，跑步超过第二名还是第二名，所以不用减 1。
    else{
        return start;
    }
}
```

时间复杂度：O（log（n））。

空间复杂度：O（1）。

这道题不难，但是对于二分查找又有了一些新认识。

首先，一定要注意，数组剩下偶数个元素的时候，中点取的是左端点。例如 1 2 3 4，中点取的是 2。正因为如此，我们更新 start 的时候不是直接取 mid ，而是 mid + 1。因为剩下两个元素的时候，mid 和 start 是相同的，如果不进行加 1 会陷入死循环。

然后上边的算法，返回最终值的时候，我们进行了一个 if 的判断，那么能不能避免呢。

* 第一种思路，参考[这里](https://leetcode.com/problems/search-insert-position/discuss/15080/My-8-line-Java-solution)。

  首先为了让 start 在循环的时候多加 1，我们将循环的 start < end 改为 start <= end。

  这样就会出现一个问题，当 start  == end，此时 mid 不仅等于了 start 还会等于 end，所以之前更新 end 是直接赋 mid，现在需要改成 end = mid - 1，防止死循环。这样就达到了目标。

  ```java
  public int searchInsert(int[] nums, int target) {
      int start = 0;
      int end = nums.length - 1;
      if (nums.length == 0) {
          return 0;
      }
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
  
      return start;
  
  }
  ```


* 第二种思路，参考[这里](https://leetcode.com/problems/search-insert-position/discuss/15110/Very-concise-and-efficient-solution-in-Java)。

  我们开始更新 start 的时候，是 mid + 1，如果剩两个元素，例如 2 4，target = 6 的话，此时 mid = 0，start = mid + 1 = 1，我们返回 start + 1 = 2。如果 mid 是右端点，那么 mid = 1，start = mid + 1 = 2，这样就可以直接返回 start 了，不需要在返回的时候加 1 了。

  怎么做到呢？最最开始的时候我们取 end 的时候是 end = nums.length - 1。如果我们改成 end = nums.length，这样每次取元素的时候，如果和之前对比，取到的就是右端点了。这样的话，最后返回的时候就不需要多加 1 了。

  ```java
  public int searchInsert(int[] nums, int target) {
      int start = 0;
      int end = nums.length;
      if (nums.length == 0) {
          return 0;
      }
      while (start < end) {
          int mid = (start + end) / 2;
          if (target == nums[mid]) {
              return mid;
          } else if (target < nums[mid]) {
              end = mid;
          } else {
              start = mid + 1;
          }
      }
  
      return start;
    
  }
  ```

# 总

虽然题很简单，但对二分查找有了更多的理解。