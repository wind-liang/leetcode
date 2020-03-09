# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/264.jpg)

输出第 `n` 个丑数。

# 解法一 暴力

判断每个数字是否是丑数，然后数到第 `n` 个。

```java
public int nthUglyNumber(int n) {
    int count = 0;
    int result = 1;
    while (count < n) {
        if (isUgly(result)) {
            count++;
        }
        result++;
    }
    //result 多加了 1
    return result - 1;
}

public boolean isUgly(int num) {
    if (num <= 0) {
        return false;
    }
    while (num % 2 == 0) {
        num /= 2;
    }
    while (num % 3 == 0) {
        num /= 3;
    }
    while (num % 5 == 0) {
        num /= 5;
    }
    return num == 1;
}
```

不过题目没有那么简单，这样的话会超时。

受到 [204 题](https://leetcode.wang/leetcode-204-Count-Primes.html) 求小于 `n` 的素数个数的启发，我们这里考虑一下筛选法。先把当时的思路粘贴过来。

> 用一个数组表示当前数是否是素数。
>
> 然后从 `2` 开始，将 `2` 的倍数，`4`、`6`、`8`、`10` ...依次标记为非素数。
>
> 下个素数 `3`，将 `3` 的倍数，`6`、`9`、`12`、`15` ...依次标记为非素数。
>
> 下个素数 `7`，将 `7` 的倍数，`14`、`21`、`28`、`35` ...依次标记为非素数。
>
> 在代码中，因为数组默认值是 `false` ，所以用 `false` 代表当前数是素数，用 `true` 代表当前数是非素数。

下边是当时的代码。

```java
public int countPrimes(int n) {
    boolean[] notPrime = new boolean[n];
    int count = 0;
    for (int i = 2; i < n; i++) {
        if (!notPrime[i]) {
            count++;
            //将当前素数的倍数依次标记为非素数
            for (int j = 2; j * i < n; j++) {
                notPrime[j * i] = true;
            }
        }
    }
    return count;
}
```

这里的话，所有丑数都是之前的丑数乘以 `2, 3, 5`  生成的，所以我们也可以提前把后边的丑数标记出来。这样的话，就不用调用 `isUgly` 函数判断当前是否是丑数了。

```java
public int nthUglyNumber(int n) {
    HashSet<Integer> set = new HashSet<>();
    int count = 0;
    set.add(1);
    int result = 1;
    while (count < n) {
        if (set.contains(result)) {
            count++;
            set.add(result * 2);
            set.add(result * 3);
            set.add(result * 5);
        }
        result++;
    }
    return result - 1;
}
```

但尴尬的是，依旧是超时，悲伤。然后就去看题解了，分享一下别人的解法。

# 解法二

参考 [这里](https://leetcode.com/problems/ugly-number-ii/discuss/69372/Java-solution-using-PriorityQueue)。

看一下解法一中 `set` 的方法，我们递增 `result`，然后看 `set` 中是否含有。如果含有的话，就把当前数乘以 `2, 3, 5` 继续加到 `set` 中。

因为 `result` 是递增的，所以我们每次找到的其实是 `set` 中最小的元素。

所以我们不需要一直递增 `result` ，只需要每次找 `set` 中最小的元素。找最小的元素，就可以想到优先队列了。

还需要注意一点，当我们从 `set` 中拿到最小的元素后，要把这个元素以及和它相等的元素都删除。

```java
public int nthUglyNumber(int n) {
    Queue<Long> queue = new PriorityQueue<Long>();
    int count = 0;
    long result = 1;
    queue.add(result);
    while (count < n) {
        result = queue.poll();
        // 删除重复的
        while (!queue.isEmpty() && result == queue.peek()) {
            queue.poll();
        }
        count++;
        queue.offer(result * 2);
        queue.offer(result * 3);
        queue.offer(result * 5);
    }
    return (int) result;
}
```

这里的话要用 `long`，不然的话如果溢出，可能会将一个负数加到队列中，最终结果也就不会准确了。

我们还可以用是 `TreeSet` ，这样就不用考虑重复元素了。

```java
public int nthUglyNumber(int n) {
    TreeSet<Long> set = new TreeSet<Long>();
    int count = 0;
    long result = 1;
    set.add(result);
    while (count < n) {
        result = set.pollFirst();
        count++;
        set.add(result * 2);
        set.add(result * 3);
        set.add(result * 5);
    }
    return (int) result;
}
```

# 解法三

参考 [这里](https://leetcode.com/problems/ugly-number-ii/discuss/69362/O(n)-Java-solution)。

我们知道丑数序列是 `1, 2, 3, 4, 5, 6, 8, 9...`。

我们所有的丑数都是通过之前的丑数乘以 `2, 3, 5` 生成的，所以丑数序列可以看成下边的样子。

 `1, 1×2, 1×3, 2×2, 1×5, 2×3, 2×4, 3×3...`。

我们可以把丑数分成三组，用丑数序列分别乘 `2, 3, 5` 。

```java
乘 2: 1×2, 2×2, 3×2, 4×2, 5×2, 6×2, 8×2,9×2,…
乘 3: 1×3, 2×3, 3×3, 4×3, 5×3, 6×3, 8×3,9×3,…
乘 5: 1×5, 2×5, 3×5, 4×5, 5×5, 6×5, 8×5,9×5,…
```

我们需要做的就是把上边三组按照顺序合并起来。

合并有序数组的话，可以通过归并排序的思想，利用三个指针，每次找到三组中最小的元素，然后指针后移。

当然，最初我们我们并不知道丑数序列，我们可以一边更新丑数序列，一边使用丑数序列。

```java
public int nthUglyNumber(int n) {
    int[] ugly = new int[n];
    ugly[0] = 1; // 丑数序列
    int index2 = 0, index3 = 0, index5 = 0; //三个指针
    for (int i = 1; i < n; i++) {
        // 三个中选择较小的
        int factor2 = 2 * ugly[index2];
        int factor3 = 3 * ugly[index3];
        int factor5 = 5 * ugly[index5];
        int min = Math.min(Math.min(factor2, factor3), factor5);
        ugly[i] = min;//更新丑数序列
        if (factor2 == min)
            index2++;
        if (factor3 == min)
            index3++;
        if (factor5 == min)
            index5++;
    }
    return ugly[n - 1];
}
```

这里需要注意的是，归并排序中我们每次从两个数组中选一个较小的，所以用的是 `if...else...`。

这里的话，用的是并列的 `if` , 这样如果有多组的当前值都是 `min`，指针都需要后移，从而保证 `ugly` 数组中不会加入重复元素。

# 总

解法二的话自己其实差一步就可以想到了。

解法三又是先通过分类，然后有一些动态规划的思想，用之前的解更新当前的解。