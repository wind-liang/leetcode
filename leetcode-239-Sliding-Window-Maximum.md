# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/239.png)

输出每个窗口内的最大值。

# 解法一 暴力

两层 `for` 循环，每次都从窗口中找最大值即可。

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    if (n == 0) {
        return nums;
    }
    int result[] = new int[n - k + 1];
    for (int i = 0; i < result.length; i++) {
        int max = Integer.MIN_VALUE;
        for (int j = 0; j < k; j++) {
            max = Math.max(max, nums[i + j]);
        }
        result[i] = max;
    }
    return result;
}
```

时间复杂度的话是 `O(nk)`。

# 解法二优先队列

注意到我们每次循环都寻找最大的值，自然的可以想到优先队列，这样得到最大值就是 `O(1)` 了。

当优先队列的数字等于窗口大小的时候，我们只需要将第一个元素删除，然后将新的数字加入。

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    // 建立最大堆
    Queue<Integer> max = new PriorityQueue<Integer>(new Comparator<Integer>() {
        @Override
        public int compare(Integer i1, Integer i2) {
            // TODO Auto-generated method stub
            return i2 - i1;
        }
    });
    int n = nums.length;
    if (n == 0) {
        return nums;
    }
    int result[] = new int[n - k + 1];
    int index = 0;
    for (int i = 0; i < n; i++) {
        //移除第一个元素
        if (max.size() >= k) {
            max.remove(nums[i - k]);
        }
        max.offer(nums[i]);
        //更新 result
        if (i >= k - 1) {
            result[index++] = max.peek();
        }
    }
    return result;
}
```

时间复杂度的话，循环中主要是调用了 `remove` 函数和 `offer` 函数，虽然 `offer` 函数的时间复杂度是 `log` 级的，但是 `remove` 是 `O(k)` ，所以最终的时间复杂度依旧是 `O(nk)`。

和 [218 题](https://leetcode.wang/leetcode-218-The-Skyline-Problem.html) 一样，我们可以用 `TreeMap` 代替优先队列，这样删除的时间复杂度也就是 `log` 级了。

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    TreeMap<Integer, Integer> treeMap = new TreeMap<>(new Comparator<Integer>() {
        @Override
        public int compare(Integer i1, Integer i2) {
            return i2 - i1;
        }
    });
    int n = nums.length;
    if (n == 0) {
        return nums;
    }
    int result[] = new int[n - k + 1];
    int index = 0;
    for (int i = 0; i < n; i++) {
        //此时不能用 treeMap 的大小和 k 比较, 因为 nums 中有相等的元素
        //当 i >= k 的时候每次都需要删除一个元素
        if (i >= k) {
            Integer v = treeMap.get(nums[i - k]);
            if (v == 1) {
                treeMap.remove(nums[i - k]);
            } else {
                treeMap.put(nums[i - k], v - 1);
            }
        }
        //添加元素
        Integer v = treeMap.get(nums[i]);
        if (v == null) {
            treeMap.put(nums[i], 1);
        } else {
            treeMap.put(nums[i], v + 1);
        }
        //更新 result
        if (i >= k - 1) {
            result[index++] = treeMap.firstKey();
        }
    }
    return result;
}
```

此时时间复杂度就是 `O(nlog(k))` 了。

# 解法三 单调队列

参考 [这里](https://leetcode.com/problems/sliding-window-maximum/discuss/65884/Java-O(n)-solution-using-deque-with-explanation)。

我们可以用一个单调递减队列。单调递减队列添加元素的算法如下。

如果当前元素比队列的最后一个元素大，那么就将最后一个元素出队，重复这步直到当前元素小于队列的最后一个元素或者队列为空。进行下一步。

如果当前元素小于等于队列的最后一个元素或者队列为空，那么就直接将当前元素入队。

按照上边的方法添加元素，队列中的元素就刚好是一个单调递减的序列，而最大值就刚好是队头的元素。

当队列的元素等于窗口的大小的时候，由于添加元素的时候我们进行了出队操作，所以我们不能像解法二那样每次都删除第一个元素，需要先判断一下队头元素是否是我们要删除的元素。

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> max = new ArrayDeque<>();
    int n = nums.length;
    if (n == 0) {
        return nums;
    }
    int result[] = new int[n - k + 1];
    int index = 0;
    for (int i = 0; i < n; i++) {
        if (i >= k) {
            if (max.peekFirst() == nums[i - k]) {
                max.removeFirst();
            }
        }
        while (!max.isEmpty() && nums[i] > max.peekLast()) {
            max.removeLast();
        }

        max.addLast(nums[i]);
        if (i >= k - 1) {
            result[index++] = max.peekFirst();
        }
    }
    return result;
}
```

时间复杂度就是 `O(n)`了，因为每个元素最多只会添加到队列和从队列删除两次操作。

# 解法四

参考 [这里](https://leetcode.com/problems/sliding-window-maximum/discuss/65881/O(n)-solution-in-Java-with-two-simple-pass-in-the-array) ，一种神奇的解法，有点 [238 题](https://leetcode.wang/leetcode-238-Product-of-Array-Except-Self.html) 解法二的影子。

我们把数组 `k` 个一组进行分组。

``` java
nums = [1,3,-1,-3,5,3,6,7], and k = 3
    
| 1 3 -1 | -5 4 3 | 5 7 |    
    
如果我们要求 result[1]，也就是下边 i 到 j 范围内的数字的最大值

| 1 3 -1 | -5 4 3 | 5 7 |   
    ^       ^
    i       j
i 到 j 范围内的数字被分割线分成了两部分
```

如果我们知道了左半部的最大值和右半部分的最大值，那么两个选最大的即可。

左半部分的最大值，也就是当前数到它右边界范围内的最大值。

用 `rightMax[i]` 保存 `i` 到它的右边界范围内的最大值，只需要从右到左遍历一遍就可以求出来了。

每次到右边界的时候就开始重新计算 `max` 值。

```java
int rightMax[] = new int[n];
max = Integer.MIN_VALUE;
for (int i = n - 1; i >= 0; i--) {
    if (max < nums[i]) {
        max = nums[i];
    }
    rightMax[i] = Math.max(nums[i], max);
    if (i % k == 0) {
        max = Integer.MIN_VALUE;
    }
}
```

同理，右半部分的最大值，也就是当前数到它左边界范围内的最大值。

用 `leftMax[i]` 保存 `i` 到它的左边界范围内的最大值，只需要从左到右遍历一遍就可以求出来。

每次到左边界的时候就开始重新计算 `max` 值。

```java
int leftMax[] = new int[n];
int max = Integer.MIN_VALUE;
for (int i = 0; i < n; i++) {
    if (i % k == 0) {
        max = Integer.MIN_VALUE;
    }
    if (max < nums[i]) {
        max = nums[i];
    }
    leftMax[i] = Math.max(nums[i], max);
}
```

有了上边的两个数组，当前范围的两个边界 `i` 和 `j`，`rightMax[i]` 存储的就是左半部分（`i` 到右边界）的最大值，`leftMax[j]` 存储的就是右半部分（`j` 到左边界）的最大值。`result[i]` 的结果也就出来了。

```java
result[i] = Math.max(rightMax[i], leftMax[j]);
```

代码的话，把上边的部分结合起来即可。

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    if (n == 0) {
        return nums;
    }
    
    //当前数到自己的左边界的最大值
    int leftMax[] = new int[n];
    int max = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        if (i % k == 0) {
            max = Integer.MIN_VALUE;
        }
        if (max < nums[i]) {
            max = nums[i];
        }
        leftMax[i] = Math.max(nums[i], max);
    }
    
    //当前数到自己的右边界的最大值
    int rightMax[] = new int[n];
    max = Integer.MIN_VALUE;
    for (int i = n - 1; i >= 0; i--) {
        if (max < nums[i]) {
            max = nums[i];
        }
        rightMax[i] = Math.max(nums[i], max);
        if (i % k == 0) {
            max = Integer.MIN_VALUE;
        }
    }
    
    int result[] = new int[n - k + 1];
    for (int i = 0; i < result.length; i++) {
        int j = i + k - 1;
        result[i] = Math.max(rightMax[i], leftMax[j]);
    }
    return result;
}
```

时间复杂度和解法三一样是 `O(n)`。

# 总

解法一和解法二的话是正常的思路，一步一步水到渠成。

解法三的话直觉上其实也能意识到，我开始想到了单调栈，但一开始代码写错了，然后就换思路了，有点可惜，如果单调栈写对的话，应该可以写出解法三。

解法四的话就很厉害了，一般情况下很少往那方面想，不过这种将解分割的思想也是常用的。