# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/287.jpg)

将 `1` 到 `n`  范围内的某些数，放到大小为 `n + 1` 的数组中，数组要放满，所以一定会有一个重复的数字，找出这个重复的数字。比如 `[2,2,2,1]`。

假设重复的数字只有一个。

解法一和解法二先不考虑题目中 `Note` 的要求。

# 解法一  排序

最简单的，先排序，然后两两判断即可。

```java
public int findDuplicate(int[] nums) {
    Arrays.sort(nums);
    for (int i = 0; i < nums.length - 1; i++) {
        if (nums[i] == nums[i + 1]) {
            return nums[i];
        }
    }
    return -1;
}
```

# 解法二 HashSet

判断重复数字，可以用 `HashSet`，这个方法经常用了。

```java
public int findDuplicate(int[] nums) {
    HashSet<Integer> set = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
        if (set.contains(nums[i])) {
            return nums[i];
        }
        set.add(nums[i]);
    }
    return -1;
}
```

# 解法三 二分查找

参考 [这里](https://leetcode.com/problems/find-the-duplicate-number/discuss/72844/Two-Solutions-(with-explanation)%3A-O(nlog(n)) 。

我们知道二分查找要求有序，但是给定的数组不是有序的，那么怎么用二分查找呢？

原数组不是有序，但是我们知道重复的那个数字肯定是 `1` 到 `n` 中的某一个，而 `1,2...,n` 就是一个有序序列。因此我们可以对  `1,2...,n`  进行二分查找。

 `mid = (1 + n) / 2`，接下来判断最终答案是在 `[1, mid]` 中还是在 `[mid + 1, n]` 中。

我们只需要统计原数组中小于等于 `mid` 的个数，记为 `count`。

如果 `count > mid` ，鸽巢原理，在 `[1,mid]` 范围内的数字个数超过了 `mid` ，所以一定有一个重复数字。

否则的话，既然不在 `[1,mid]` ，那么最终答案一定在 `[mid + 1, n]` 中。

```java
public int findDuplicate(int[] nums) {
    int n = nums.length - 1;
    int low = 1;
    int high = n;
    while (low < high) {
        int mid = (low + high) >>> 1;
        int count = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] <= mid) {
                count++;
            }
        }
        if (count > mid) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    return low;
}

```

# 解法四 二进制

参考 [这里](https://leetcode.com/problems/find-the-duplicate-number/discuss/72872/O(32*N)-solution-using-bit-manipulation-in-10-lines)。[137 题](https://leetcode.wang/leetcode-137-Single-NumberII.html#解法三-位操作) 以及 [169 题](https://leetcode.wang/leetcode-169-Majority-Element.html#解法二-位运算) 其实已经用过这个思想，但还是不容易往这方面想。

主要就是我们要把数字放眼到二进制。

然后依次统计数组中每一位 `1` 的个数，记为 `a[i]`。再依次统计 `1` 到 `n` 中每一位 `1` 的个数，记为 `b[i]`。`i` 代表的是哪一位，因为是 `int`，所以范围是 `0` 到 `32`。

记重复的数字是 `res`。

如果 `a[i] > b[i]` 也就意味着 `res` 当前位是 `1`。

否则的话，`res` 当前位就是 `0`。

举个例子吧，`1 3 4 2 2`。

```java
1 3 4 2 2 写成 2 进制
1 [0 0 1]
3 [0 1 1]
4 [1 0 0]
2 [0 1 0]
2 [0 1 0]

把 1 到 n,也就是 1 2 3 4 也写成 2 进制
1 [0 0 1]
2 [0 1 0]
3 [0 1 1]
4 [1 0 0]

依次统计每一列 1 的个数, res = XXX

原数组最后一列 1 的个数是 2
1 到 4 最后一列 1 的个数是 2
2 不大于 2,所以当前位是 0, res = XX0

原数组倒数第二列 1 的个数是 3
1 到 4 倒数第二列 1 的个数是 2
3 大于 2,所以当前位是 1, res = X10

原数组倒数第三列 1 的个数是 1
1 到 4 倒数第三列 1 的个数是 1
1 不大于 1,所以当前位是 0, res = 010
    
所以 res = 010, 也就是 2
```

上边是重复数字的重复次数是 `2` 的情况，如果重复次数大于 `2` 的话上边的结论依旧成立。

简单的想一下，`1 3 4 2 2` ，因为 `2` 的倒数第二位的二进制位是 `1`，所以原数组在倒数第二列中 `1 ` 的个数会比`1` 到 `4` 这个序列倒数第二列中 `1 ` 的个数多 `1` 个。如果原数组其他的数变成了 `2` 呢？也就`2` 的重复次数大于 `2`。

如果是 `1` 变成了 `2`，数组变成 `2 3 4 2 2` ， 那么倒数第二列中 `1 ` 的个数又会增加 `1`。

如果是 `3` 变成了 `2`，数组变成 `1 2 4 2 2` ， 那么倒数第二列中 `1 ` 的个数不会变化。

所以不管怎么样，如果重复数字的某一列是 `1`，那么当前列 `1` 的个数一定会比 `1` 到 `n` 序列中 `1` 的个数多。

```java
public int findDuplicate(int[] nums) {
    int res = 0;
    int n = nums.length; 
    //统计每一列 1 的个数
    for (int i = 0; i < 32; i++) {
        int a = 0;
        int b = 0;
        int mask = (1 << i);
        for (int j = 0; j < n; j++) {
            //统计原数组当前列 1 的个数
            if ((nums[j] & mask) > 0) {
                a++;
            }
            //统计 1 到 n 序列中当前列 1 的个数
            if ((j & mask) > 0) {
                b++;
            }
        }
        if (a > b) {
            res = res | mask;
        }
    }
    return res;
}
```

# 解法五 

参考 [这里](https://leetcode.com/problems/find-the-duplicate-number/discuss/72846/My-easy-understood-solution-with-O(n)-time-and-O(1)-space-without-modifying-the-array.-With-clear-explanation.) ，一个神奇的解法了。

把数组的值看成 `next` 指针，数组的下标看成节点的索引。因为数组中至少有两个值一样，也说明有两个节点指向同一个位置，所以一定会出现环。

举个例子，`3 1 3 4 2` 可以看成下图的样子。

![](https://windliang.oss-cn-beijing.aliyuncs.com/287_2.jpg)

```java
nums[0] = 3
nums[3] = 4
nums[4] = 2
nums[2] = 3
```

所以我们要做的就是找到上图中有环链表的入口点 `3`，也就是 [142 题](https://leetcode.wang/leetcode-142-Linked-List-CycleII.html) 。

具体证明不说了，只介绍方法，感兴趣的话可以到 [142 题](https://leetcode.wang/leetcode-142-Linked-List-CycleII.html)  看一下。

我们需要快慢指针，同时从起点出发，慢指针一次走一步，快指针一次走两步，然后记录快慢指针相遇的点。

之后再用两个指针，一个指针从起点出发，一个指针从相遇点出发，当他们再次相遇的时候就是入口点了。

```java
public int findDuplicate(int[] nums) {
    int slow = nums[0];
    int fast = nums[nums[0]];
    //寻找相遇点
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    //slow 从起点出发, fast 从相遇点出发, 一次走一步
    slow = 0;
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}
```

# 总

看起来比较简单的一道题，思想用了不少。经典的二分，从二进制思考问题，以及最后将问题转换的思想，都很经典。