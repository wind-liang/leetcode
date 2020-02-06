# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/164.jpg)

给一个乱序的数组，求出数组排序以后的相邻数字的差最大是多少。

# 解法一

先来个直接的，就按题目的意思，先排序，再搜索。

```java
public int maximumGap(int[] nums) {
    Arrays.sort(nums);
    int max = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        if (nums[i + 1] - nums[i] > max) {
            max = nums[i + 1] - nums[i];
        }
    }
    return max;
}
```

但是正常的排序算法时间复杂度会是 `O(nlog(n))`，题目要求我们在 `O(n)` 的复杂度下去求解。

自己想了各种思路，但想不出怎么降到 `O(n)`，把 [官方](https://leetcode.com/problems/maximum-gap/solution/) 给的题解分享一下吧。

我们一般排序算法多用快速排序，平均时间复杂度是 `O(nlog(n))`，其实还有一种排序算法，时间复杂度是 `O(kn)`，`k` 是最大数字的位数，当 `k` 远小于 `n` 的时候，时间复杂度可以近似看成 `O(n)`。这种排序算法就是基数排序，下边讲一下具体思想。

比如这样一个数列排序： `342 58 576 356`， 我们来看一下怎么排序：

```java
不足的位数看做是 0
342 058 576 356
按照个位将数字依次放到不同的位置
0: 
1: 
2: 342
3: 
4: 
5: 
6: 576, 356
7: 
8: 058
9: 

把上边的数字依次拿出来，组成新的序列 342 576 356 058，然后按十位继续放到不同的位置。
0: 
1: 
2: 
3: 
4: 342
5: 356 058
6: 
7: 576
8: 
9: 

把上边的数字依次拿出来，组成新的序列 342 356 058 576，然后按百位继续装到不同的位置。
0: 058
1: 
2: 
3: 342 356
4: 
5: 576 
6: 
7: 
8: 
9: 

把数字依次拿出来，最终结果就是 58 342 356 576
```

为了代码更好理解， 我们可以直接用 `10` 个 `list` 去存放每一组的数字，官方题解是直接用一维数组实现的。

对于取各个位的的数字，我们通过对数字除以 `1`, `10`, `100`... 然后再对 `10` 取余来实现。

```java
public int maximumGap(int[] nums) {
    if (nums.length <= 1) {
        return 0;
    }
    List<ArrayList<Integer>> lists = new ArrayList<>();
    for (int i = 0; i < 10; i++) {
        lists.add(new ArrayList<>());
    }
    int n = nums.length;
    int max = nums[0];
    //找出最大的数字
    for (int i = 1; i < n; i++) {
        if (max < nums[i]) {
            max = nums[i];
        }
    }
    int m = max;
    int exp = 1;
    //一位一位的进行
    while (max > 0) {
        //将之前的元素清空
        for (int i = 0; i < 10; i++) {
            lists.set(i, new ArrayList<>());
        }
        //将数字放入对应的位置
        for (int i = 0; i < n; i++) {
            lists.get(nums[i] / exp % 10).add(nums[i]);
        }
		
        //将数字依次拿出来
        int index = 0;
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < lists.get(i).size(); j++) {
                nums[index] = lists.get(i).get(j);
                index++;
            }

        }
        max /= 10;
        exp *= 10;
    }

    int maxGap = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        if (nums[i + 1] - nums[i] > maxGap) {
            maxGap = nums[i + 1] - nums[i];
        }
    }
    return maxGap;
}
```

# 解法二

上边的解法还不是真正的 `O(n)`，下边继续介绍另一种解法，参考了 [这里](https://leetcode.com/problems/maximum-gap/discuss/50643/bucket-sort-JAVA-solution-with-explanation-O(N)-time-and-space) ，评论区对自己帮助很多。

我们知道如果是有序数组的话，我们就可以通过计算两两数字之间差即可解决问题。

那么如果是更宏观上的有序呢？

```java
我们把 0 3 4 6 23 28 29 33 38 依次装到三个箱子中
    0            1            2           3
 -------      -------      -------     ------- 
|  3 4  |    |       |    | 29    |   | 33    |
|   6   |    |       |    |  23   |   |       |
|  0    |    |       |    |  28   |   |  38   |
 -------      -------      -------     ------- 
  0 - 9       10 - 19      20 - 29     30 - 39
我们把每个箱子的最大值和最小值表示出来
 min  max     min  max     min  max  min  max 
 0     6      -     -      23   29   33   38
```

我们可以只计算相邻箱子 `min` 和 `max` 的差值来解决问题吗？空箱子直接跳过。

第 `2` 个箱子的 `min` 减第 `0` 个箱子的 `max`， `23 - 6 = 17`

第 `3` 个箱子的 `min` 减第 `2` 个箱子的 `max`， `33 - 29 = 4`

看起来没什么问题，但这样做一定需要一个前提，因为我们只计算了相邻箱子的差值，没有计算箱子内数字的情况，所以我们需要保证每个箱子里边的数字一定不会产生最大 `gap`。

我们把箱子能放的的数字个数记为 `interval`，给定的数字中最小的是 `min`，最大的是 `max`。那么箱子划分的范围就是 `min ~ (min + 1 * interval - 1)`、`(min + 1 * interval） ~ （min + 2 * interval - 1)`、`(min + 2 * interval） ~ （min + 3 * interval - 1)`...，上边举的例子中， `interval` 我们其实取了 `10`。

划定了箱子范围后，我们其实很容易把数字放到箱子中，通过 `(nums[i] - min) / interval` 即可得到当前数字应该放到的箱子编号。那么最主要的问题其实就是怎么去确定 `interval`。

`interval` 过小的话，需要更多的箱子去存储，很费空间，此外箱子增多了，比较的次数也会增多，不划算。

`interval` 过大的话，箱子内部的数字可能产生题目要求的最大 `gap`，所以肯定不行。

所以我们要找到那个保证箱子内部的数字不会产生最大 `gap`，并且尽量大的 `interval`。

继续看上边的例子，`0 3 4 6 23 28 29 33 38`，数组中的最小值 `0` 和最大值 `38` ,并没有参与到 `interval` 的计算中，所以它俩可以不放到箱子中，还剩下 `n - 2` 个数字。

像上边的例子，如果我们保证至少有一个空箱子，那么我们就可以断言，箱子内部一定不会产生最大 `gap`。

因为在我们的某次计算中，会跳过一个空箱子，那么得到的 `gap` 一定会大于 `interval`，而箱子中的数字最大的 `gap` 是 `interval - 1`。

接下来的问题，怎么保证至少有一个空箱子呢？

鸽巢原理的变形，有 `n - 2` 个数字，如果箱子数多于 `n - 2` ，那么一定会出现空箱子。总范围是 `max - min`，那么 `interval = (max - min) / 箱子数`，为了使得 `interval` 尽量大，箱子数取最小即可，也就是 `n - 1`。

所以 `interval = (max - min) / n - 1` 。这里如果除不尽的话，我们 `interval` 可以向上取整。因为我们给定的数字都是整数，这里向上取整的话对于最大 `gap` 是没有影响的。比如原来范围是 `[0,5.5)`，那么内部产生的最大 `gap` 是 `5 - 0 = 5`。现在向上取整，范围变成`[0,6)`，但是内部产生的最大 `gap` 依旧是 `5 - 0 = 5`。

所有问题都解决了，可以安心写代码了。

```java
public int maximumGap(int[] nums) {
    if (nums.length <= 1) {
        return 0;
    }
    int n = nums.length;
    int min = nums[0];
    int max = nums[0];
    //找出最大值、最小值
    for (int i = 1; i < n; i++) {
        min = Math.min(nums[i], min);
        max = Math.max(nums[i], max);
    }
    if(max - min == 0) {
        return 0;
    }
	
    //算出每个箱子的范围
    int interval = (int) Math.ceil((double)(max - min) / (n - 1));
    
    //每个箱子里数字的最小值和最大值
    int[] bucketMin = new int[n - 1];
    int[] bucketMax = new int[n - 1];
    
    //最小值初始为 Integer.MAX_VALUE
    Arrays.fill(bucketMin, Integer.MAX_VALUE);
    //最小值初始化为 -1，因为题目告诉我们所有数字是非负数
    Arrays.fill(bucketMax, -1);

    //考虑每个数字
    for (int i = 0; i < nums.length; i++) {
        //当前数字所在箱子编号
        int index = (nums[i] - min) / interval;
        //最大数和最小数不需要考虑
        if(nums[i] == min || nums[i] == max) {
            continue;
        }
        //更新当前数字所在箱子的最小值和最大值
        bucketMin[index] = Math.min(nums[i], bucketMin[index]);
        bucketMax[index] = Math.max(nums[i], bucketMax[index]);
    }
	 
    int maxGap = 0;
    //min 看做第 -1 个箱子的最大值
    int previousMax = min;
    //从第 0 个箱子开始计算
    for (int i = 0; i < n - 1; i++) {
        //最大值是 -1 说明箱子中没有数字，直接跳过
        if (bucketMax[i] == -1) {
            continue;
        }
        
        //当前箱子的最小值减去前一个箱子的最大值
        maxGap = Math.max(bucketMin[i] - previousMax, maxGap);
        previousMax = bucketMax[i];
    }
    //最大值可能处于边界，不在箱子中，需要单独考虑
    maxGap = Math.max(max - previousMax, maxGap);
    return maxGap;

}
```

# 总

这道题主要是对排序算法的了解，第一次见到了基数排序的应用，解法二其实是桶排序的步骤。