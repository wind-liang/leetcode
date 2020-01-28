# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/215.jpg)

找出第 `k` 大的数。

# 解法一 暴力

使用快排从大到小排序，将第 `k` 个数返回即可。

我们直接使用 `java` 提供的排序算法，又因为默认是从小到大排序，所以将倒数第 `k` 个数返回即可。

```java
public int findKthLargest(int[] nums, int k) {
    Arrays.sort(nums);
    return nums[nums.length - k];
}
```

# 解法二

我们没必要把所有数字正确排序，我们可以借鉴快排中分区的思想，这里不细讲了，大家可以去回顾一下快排。

随机选择一个分区点，左边都是大于分区点的数，右边都是小于分区点的数。左部分的个数记做 `m`。

如果 `k == m + 1`，我们把分区点返回即可。

如果 `k > m + 1`，说明第 `k` 大数在右边，我们在右边去寻找第 `k - m - 1` 大的数即可。

如果 `k < m + 1`，说明第 `k` 大数在左边，我们在左边去寻找第 `k` 大的数即可。

左边和右边寻找在代码中采取递归即可。

分区达到的效果就是下边的样子。

```java
原数组 3 7 6 1 5

如果把 5 作为分区点，那么数组最后就会变成下边的样子, i 指向最终的分区点
7 6 5 1 3
    ^
    i
```

代码的话，分区可以采取双指针，`i` 前边始终存比分区点大的元素。

```java
public int findKthLargest(int[] nums, int k) {
    return findKthLargestHelper(nums, 0, nums.length - 1, k);
}

private int findKthLargestHelper(int[] nums, int start, int end, int k) {
    int i = start;
    int pivot = nums[end];//分区点
    //将 i 的左半部分存比分区点大的数
    //将 i 的右半部分存比分区点小的数
    for (int j = start; j < end; j++) {
        if (nums[j] >= pivot) {
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
            i++;
        }
    }
    //分区点放到 i 的位置
    int temp = nums[i];
    nums[i] = pivot;
    nums[end] = temp;
    //左边的数量加上 1
    int count = i - start + 1;
    if (count == k) {
        return nums[i];
    //从右边去继续寻找
    } else if (count < k) {
        return findKthLargestHelper(nums, i + 1, end, k - count);
    //从左边去继续寻找    
    } else {
        return findKthLargestHelper(nums, start, i - 1, k);
    }
}
```

# 解法三

我们可以使用优先队列，建一个最大堆，然后依次弹出元素，弹出的第 `k` 个元素就是我们要找的。

优先队列的使用也不是第一次了，之前在 [23 题](https://leetcode.wang/leetCode-23-Merge-k-Sorted-Lists.html) 和 [188 题](https://leetcode.wang/leetcode-188-Best-Time-to-Buy-and-Sell-StockIV.html) 也用过，原理可以参考 [这里 ](http://blog.51cto.com/ahalei/1425314?source=dra)和 [这里](http://blog.51cto.com/ahalei/1427156)。

这里我们直接使用 `java` 提供的优先队列了。

```java
public int findKthLargest(int[] nums, int k) {
    Comparator<Integer> cmp;
    cmp = new Comparator<Integer>() {
        @Override
        public int compare(Integer i1, Integer i2) {
            // TODO Auto-generated method stub
            return i2 - i1;
        }
    };

    // 建立最大堆
    Queue<Integer> q = new PriorityQueue<Integer>(cmp);
    for (int i = 0; i < nums.length; i++) {
        q.offer(nums[i]);
    }

    for (int i = 0; i < k - 1; i++) {
        q.poll();
    }
    return q.poll();
}
```

`java` 默认的是建最小堆，所以我们需要一个比较器来改变优先级。

如果使用最小堆也可以解决这个问题，只需要保证队列中一直是 `k` 个元素即可。当队列超出 `k` 个元素后，把队列中最小的去掉即可，这就保证了最后队列中的元素一定是前 `k` 大的元素。

```java
public int findKthLargest(int[] nums, int k) {
    // 建立最小堆
    Queue<Integer> q = new PriorityQueue<Integer>();
    for (int i = 0; i < nums.length; i++) {
        q.offer(nums[i]);
        if (q.size() > k) {
            q.poll();
        }
    }
    return q.poll();
}
```

# 总

这道题不是很难，只要掌握了快排的思想，解法二也能很快写出来。解法三的话，就得事先了解优先队列了。

