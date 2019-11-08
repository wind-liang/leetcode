# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/154.jpg)

[153 题](https://leetcode.wang/leetcode-153-Find-Minimum-in-Rotated-Sorted-Array.html) 升级版，依旧是旋转过的数组，一个排序好的数组，把前边的若干的个数，一起移动到末尾，找出最小的数字。只不过这道题中的数字可能有重复的。

# 思路分析

想一下 [153 题](https://leetcode.wang/leetcode-153-Find-Minimum-in-Rotated-Sorted-Array.html) 我们怎么做的。

`mid` 和 `end` 比较。

`mid` < `end`：最小值在左半部分。

![](https://windliang.oss-cn-beijing.aliyuncs.com/33_5.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/33_6.jpg)

`mid` > `end`：最小值在右半部分。

![](https://windliang.oss-cn-beijing.aliyuncs.com/33_7.jpg)

所以我们只需要把 `mid` 和 `end` 比较，`mid < end` 丢弃右半部分（更新 `end = mid`），`mid > end` 丢弃左半部分（更新 `start = mid + 1`）。直到 `end` 等于 `start` 时候结束就可以了。

之前没有重复的数字，所以 `mid` 要么大于 `end` ，要么小于 `end`。这里的话，就需要考虑如果 `mid == end` 的话，我们该怎么做。代码框架也就出来了。

```java
public int findMin(int[] nums) {
    int start = 0;
    int end = nums.length - 1;
    while (start < end) {
        int mid = (start + end) >>> 1;
        if (nums[mid] > nums[end]) {
            start = mid + 1;
        } else if (nums[mid] < nums[end]) {
            end = mid;
        } else {
            //添加代码
        }
    }
    return nums[start];
}
```

可以想几个例子考虑下。

```java
3  3  1  2  3  3  3  3  3
            ^           ^
           mid         end 
        
上边的情况， mid == end，此时最小值在 mid 左边

3  3  3  3  3  2  3
         ^        ^
        mid      end 
        
上边的情况， mid == end，此时最小值在 mid 右边

2  3  3  1  1  1  1  1  1
            ^           ^
           mid         end 
        
上边的情况， mid == end，此时最小值在 mid 左边
```

当相等的时候，最小值可能在左边，也可能在右边，问题的关键就是去解决这个问题。

# 想法一

我想到的一种解决方案是如果遇到了相等的情况，将 `mid` 指针不停的向左滑动，直到当前的值不再等于 `end`。然后就会有三种情况。

* 情况一，移动结束的值小于了 `end`，此时最小值一定在 `mid` 的左边

  ```java
  3  3  1  2  3  3  3  3  3
              ^           ^
             mid         end 
  ```

* 情况二，移动结束的值大于了 `end`，此时最小值一定是结束位置的后一个值

  ```java
  2  3  3  1  1  1  1  1  1
              ^           ^
             mid         end 
  ```

* 情况三，移动到头后依旧是等于 `end`，此时最小值一定在 `mid` 的右边

  ```java
  3  3  3  3  3  2  3
           ^        ^
          mid      end 
  ```

大于小于等于也只有上边的三种情况了，所以代码也就出来了。

```java
public int findMin(int[] nums) {
    int start = 0;
    int end = nums.length - 1;
    while (start < end) {
        int mid = (start + end) >>> 1;
        if (nums[mid] > nums[end]) {
            start = mid + 1;
        } else if (nums[mid] < nums[end]) {
            end = mid;
        } else {
            int temp = mid;
            //不停前移
            while (temp >= 0) {
                if (nums[temp] == nums[end]) {
                    temp--;
                //情况一
                } else if (nums[temp] < nums[end]) {
                    end = mid;
                    break;
                //情况二
                } else {
                    return nums[temp + 1];
                }
            }
            //情况三
            if (temp == -1) {
                start = mid + 1;
            }
        }
    }
    return nums[start];
}
```

# 想法二

参考 [这里](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/discuss/48808/My-pretty-simple-code-to-solve-it) ，非常简洁优雅。

主要思想就是把问题转换回 [153 题](https://leetcode.wang/leetcode-153-Find-Minimum-in-Rotated-Sorted-Array.html) ，同样也是解决相等的时候怎么办。

只做一件事，`end--`。因为 `mid` 和 `end` 相等，所以我们直接把 `end` 抛弃一定不会影响结果的。

```java
public int findMin(int[] nums) {
    int start = 0;
    int end = nums.length - 1;
    while (start < end) {
        int mid = (start + end) >>> 1;
        if (nums[mid] > nums[end]) {
            start = mid + 1;
        } else if (nums[mid] < nums[end]) {
            end = mid;
        } else {
           end--;
        }
    }
    return nums[start];
}
```

# 想法三

参考 [这里](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/discuss/48815/Only-two-more-lines-code-on-top-of-the-solution-for-Part-I) 。

首先根据题目的意思，数组是被分成了两段。

当有重复数字的时候，之所以麻烦，就是因为有一个重复数字可能会被切割在两段里，比如下边的例子。

```java
3  3  1  2  3  3  3  3  3
            ^           ^
           mid         end 
        
分成了 3 3 和 1 2 3 3 3 3 两段，3 同时处于两段

3  3  3  3  3  2  3
         ^        ^
        mid      end 
        
分成了 3 3 3 3 和 2 3 两段，3 同时处于两段
```

而如果所有重复的数字只处于一段里，其实并不复杂，比如下边的例子

```java
1  2  3  3  3  3
      ^        ^
     mid      end
      
只有一段 1 2 3 3 3 3
    
7  7  6  6  6
      ^     ^
     mid   end
分成了 7 7 和 6 6 6 两段，没有数字处于两段里
```

对于上边的情况，其实我们可以确定，当 `mid` 和 `end`  相等的时候，最小值一定在 `start` 到 `mid` 之间。也就是和 `mid < end`  的情况一致的。

所以我们可以做一个预处理，保证所有重复数字不在两段里出现即可，再简单化，也就是保证切割的位置不要是重复数字。也就是比较 `start` 和 `end` 是否相同，相同的话 `end--` 即可。

```java
while (nums[end] == nums[start] && end > start) {
    end--;
}
```

最后只要把 [153 题](https://leetcode.wang/leetcode-153-Find-Minimum-in-Rotated-Sorted-Array.html)  的代码拿过来即可。

```java
public int findMin(int[] nums) {
    int start = 0;
    int end = nums.length - 1;
    while (nums[end] == nums[start] && end > start) {
        end--;
    }
    while (start < end) {
        int mid = (start + end) >>> 1;
        if (nums[mid] > nums[end]) {
            start = mid + 1;
        } else{
            end = mid;
        }
    }
    return nums[start];
}
```

# 总

思路一主要是对新出现的情况进行细分来解决问题，思路二和思路三是把问题向原先的问题靠拢，从而尽可能少的变动了代码。不过这道题由于一些情况很特殊，所以虽然用了二分，最坏时间复杂度也降到了 `O(n)`，不再是 `log` 级的。