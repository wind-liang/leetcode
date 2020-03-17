# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/278.jpg)

题目说的比较绕，其实就是在 `false false false true true`  这样的序列中找出第一次出现 `true` 的位置。

可以通过 `isBadVersion` 函数得到当前位置是 `false` 还是 `true`。

# 解法一

最直接的解法，从 `1` 开始遍历，依次判断是否是 `true`。

```java
public int firstBadVersion(int n) {
    for (int i = 1; i < n; i++) {
        if (isBadVersion(i)) {
            return i;
        }
    }
    return -1;
}
```

没想到这个解法竟然会超时。

# 解法二

把 `false false false true true` 可以想成有序数组，`0 0 0 1 1`，寻找第一次出现 `1` 的位置。

自然会想到二分查找了，和 [275 题](https://leetcode.wang/leetcode-275-H-IndexII.html) 解法是一样的，当时是找到第一个出现在直线上方的点。

```java
public int firstBadVersion(int n) {
    int low = 1;
    int high = n;
    while (low <= high) {
        int mid = (low + high) >>> 1;
        if (isBadVersion(mid)) {
            if (mid == 1) {
                return 1;
            }
            //判断前一个是否是 false
            if (!isBadVersion(mid - 1)) {
                return mid;
            }
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return -1;
}
```

和  [275 题](https://leetcode.wang/leetcode-275-H-IndexII.html) 一样，我觉得上边的解法比较好理解也就没写其他的写法了，没想到又碰到这种题了，那顺便再说一下其他的写法吧。

上边是采取提前结束的方法，事实上，因为数组中一定会有一个 `true` ，所以我们确信一定会找到我们要寻找的值。

所以我们可以通过不断的缩小范围，直到数组中只剩下一个位置，那么这个位置就一定是我们要找的。

下边的解法保证每次循环我们要找到解都在 `low` 和 `high` 之间，从而当 `low == high` 的时候，此时剩下的最后一个数就是我们要找的了。

```java
public int firstBadVersion(int n) {
    int low = 1;
    int high = n;
    //这里去除等于，只剩一个值的时候就跳出来
    while (low < high) {
        int mid = (low + high) >>> 1;
        if (isBadVersion(mid)) {
            //这里不再是 mid - 1, 因为 mid 有可能是我们要找的值
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    return low;
}
```

还有一种写法，比较反直觉。

```java
public int firstBadVersion(int n) {
    int low = 1;
    int high = n;=
    while (low <= high) {
        int mid = (low + high) >>> 1;
        if (isBadVersion(mid)) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return low;
}
```

`high = mid - 1` ，看起来会把我们要找的值丢掉。其实是没有关系的，如果 `mid` 值是我们要找的，那么后续 `low` 会不断向 `high` 靠近，当 `low` 和 `high` 相等的时候，`low` 最后更新 `low = mid + 1` ，刚好又回到了我们要找的值。

还有一种情况，如果之前一直没有找到我们要找的值，直到最后一步 `low == high` 的时候才找到。此时会进入 `if` 语句，更新 `high = mid - 1` 错过我们要找的值。但没有关系，我们返回的是 `low` ，依旧是我们要找的值。

# 扩展 求中点

在 [108 题](https://leetcode.wang/leetcode-108-Convert-Sorted-Array-to-Binary-Search-Tree.html) 已经说过这个扩展了，由于经常用到，这里再贴过来，如果不清楚的话可以看一下。

前几天和同学发现个有趣的事情，分享一下。

首先假设我们的变量都是 `int` 值。

二分查找中我们需要根据 `start` 和 `end` 求中点，正常情况下加起来除以 2 即可。

```java
int mid = (start + end) / 2
```

但这样有一个缺点，我们知道`int`的最大值是 `Integer.MAX_VALUE` ，也就是`2147483647`。那么有一个问题，如果 `start = 2147483645`，`end = 2147483645`，虽然 `start` 和 `end`都没有超出最大值，但是如果利用上边的公式，加起来的话就会造成溢出，从而导致`mid`计算错误。

解决的一个方案就是利用数学上的技巧，我们可以加一个 `start` 再减一个 `start` 将公式变形。

```java
(start + end) / 2 = (start + end + start - start) / 2 = start + (end - start) / 2
```

这样的话，就解决了上边的问题。

然后当时和同学看到`jdk`源码中，求`mid`的方法如下

```java
int mid = (start + end) >>> 1
```

它通过移位实现了除以 2，但。。。这样难道不会导致溢出吗？

首先大家可以补一下 [补码](https://mp.weixin.qq.com/s/uvcQHJi6AXhPDJL-6JWUkw) 的知识。

其实问题的关键就是这里了`>>>` ，我们知道还有一种右移是`>>`。区别在于`>>`为有符号右移，右移以后最高位保持原来的最高位。而 `>>>` 这个右移的话最高位补 0。

所以这里其实利用到了整数的补码形式，最高位其实是符号位，所以当 `start + end` 溢出的时候，其实本质上只是符号位收到了进位，而`>>>`这个右移不仅可以把符号位右移，同时最高位只是补零，不会对数字的大小造成影响。

但 `>>` 有符号右移就会出现问题了，事实上 JDK6 之前都用的`>>`，这个 BUG 在 java 里竟然隐藏了十年之久。

# 总

还是典型的二分查找的应用。解法一就不说了，说一下解法二的三种写法。

我觉得第一种写法比较直观，每次判断一下我们是否找到了，可以提前结束。

第二种写法的话也经常用到，比如 [33 题](https://leetcode.wang/leetCode-33-Search-in-Rotated-Sorted-Array.html) 找最小值下标的时候，当时和 [@为爱卖小菜](https://leetcode-cn.com/u/wei-ai-mai-xiao-cai/) 讨论了很多，自己对二分理解也深刻了不少。这种写法用于一定可以找到解的时候，一定要注意的是 `low < high`，不能加等号，不然可能造成死循环。

第三种写法的话，这里就不推荐了。

