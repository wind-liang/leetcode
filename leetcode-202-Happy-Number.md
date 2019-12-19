# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/202.jpg)

给一个数字，将这个数字的各个位取平方然后相加，得到新的数字再重复这个过程。如果得到了 `1` 就返回 `true`，如果得不到 `1` 就返回 `false` 。

# 解法一

之前秋招的一道笔试题，当时想法也很简单。如果过程中得到了 `1` 直接返回 `true` 。

什么时候得不到 `1` 呢？产生了循环，也就是出现的数字在之前出现过，那么 `1` 一定不会得到了，此时返回 `false`。

在代码中，我们只需要用 `HashSet` 去记录已经得到的数字即可。

```java
public boolean isHappy(int n) {
    HashSet<Integer> set = new HashSet<>();
    set.add(n);
    while (true) {
        int next = getNext(n);
        if (next == 1) {
            return true;
        }
        if (set.contains(next)) {
            return false;
        } else {
            set.add(next);
            n = next;
        }
    }
}

//计算各个位的平方和
private int getNext(int n) {
    int next = 0;
    while (n > 0) {
        int t = n % 10;
        next += t * t;
        n /= 10;
    }
    return next;
}
```

还有一个问题，代码中我们用了 `while` 循环，那么有没有可能永远不产生 `1` 并且不产生重复的数字，然后使得代码变成死循环呢？

不需要担心，因为根据我们的算法，产生的数字一定是有限的。即使产生的数字不是有限的，因为我们用的是 `int` 来保存数字，`int` 所表示的数字个数是有限的。因此，如果产生的数字是 `n` 个，如果我们循环到第 `n + 1` 次，根据鸽巢原理，此时一定会产生一个重复数字了，从而跳出 `while` 循环。

# 解法二

参考 [这里](https://leetcode.com/problems/happy-number/discuss/56917/My-solution-in-C(-O(1)-space-and-no-magic-math-property-involved-))，优化了空间复杂度到 `O(1)`。

回想一下 [141 题](https://leetcode.wang/leetcode-141-Linked-List-Cycle.html)，判断一个链表是否有环。

![](https://windliang.oss-cn-beijing.aliyuncs.com/141.png)

而这道题，其实本质上就是判断链表是否有环，当出现重复的数字也就是产生了环。

所以我们可以用快慢指针的方法，或者叫 Floyd Cycle detection algorithm。

原理也很好理解，想象一下圆形跑道，两个人跑步，如果一个人跑的快，一个人跑的慢，那么不管两个人从哪个位置出发，跑的过程中两人一定会相遇。

所以这里我们用两个指针 `fast` 和 `slow`。`fast` 每次走两步，`slow` 每次走一步。

如果有重复的数字的话，`fast` 和 `slow` 就一定会相遇。

没有重复数字的话，当 `fast` 经过 `1` 的时候，就会停下来了。然后 `slow` 最终也会走向 `1`，所以也会相遇。

因此，代码的话，当 `fast` 和 `slow` 相遇的时候只需要判断当前是否是 `1` 即可。

```java
public boolean isHappy(int n) {
    int slow = n;
    int fast = n;
    do {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    } while (slow != fast);
    return slow == 1;
}

private int getNext(int n) {
    int next = 0;
    while (n > 0) {
        int t = n % 10;
        next += t * t;
        n /= 10;
    }
    return next;
}
```

# 总

解法一很常规，解法二的话将模型归结到有环链表太厉害了，自愧不如。