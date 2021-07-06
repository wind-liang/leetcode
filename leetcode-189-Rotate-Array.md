# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/189.jpg)

转动数组，将数组的最后一个元素移动到开头，重复操作 `k` 次。

# 解法一 

完全按照题目的意思，每次把末尾的元素移动到开头，当然移动前需要把所有元素后移一位，把第一个位置腾出来。

此外，如果 `k` 大于数组的长度，`k` 是等效于 `k % n` 的。举个例子，`nums = [1 2 3]`，`k = 4`，操作 `4` 次和操作 `4 % 3 = 1` 次是一样的结果。

```java
public void rotate(int[] nums, int k) {
    int n = nums.length;
    k = k % n;
    for (int i = 0; i < k; i++) {
        int temp = nums[n - 1];
        for (int j = n - 1; j > 0; j--) {
            nums[j] = nums[j - 1];
        }
        nums[0] = temp;
    }
}
```

时间复杂度：`O(kn)`。

空间复杂度：`O(1)`。

# 解法二

空间换时间，解法一中每个元素都需要移动 `k` 次，因为最后一个元素移到第一个位置的话，就进行了整体后移。不然的话，第一个位置原来的数就会被覆盖掉。

我们可以申请一个和原数组等大的数组，复制之前所有的值。这样的话，我们就可以随心所欲的在原数组上赋值了，不需要考虑值的丢失。

```java
public void rotate(int[] nums, int k) {
    int n = nums.length;
    k = k % n;
    int[] numsCopy = new int[n];
    for (int i = 0; i < n; i++) {
        numsCopy[i] = nums[i];
    }
    
    //末尾的 k 个数复制过来
    for (int i = 0; i < k; i++) {
        nums[i] = numsCopy[n - k + i];
    }
    
    //剩下的数复制过来
    for (int i = k; i < n; i++) {
        nums[i] = numsCopy[i - k];
    }
}
```

时间复杂度：`O(n)`。

空间复杂度：`O(n)`。

# 解法三

上边的解法都是直接可以想到的，写完之后看了 [官方](https://leetcode.com/problems/rotate-array/solution/) 提供的解法，下边分享一下。

换一种题目的理解方式。

![](https://windliang.oss-cn-beijing.aliyuncs.com/189_2.jpg)

把数组看成一个圆环，而 `k` 的含义其实就是所有数字顺时针移动 `k` 个位置。

如果 `k = 2`，那么含义就是 `1` 放到 `3` 的位置，`3` 放到 `5` 的位置...

当然程序上，如果 `1` 放到 `3` 的位置，`3` 就会被覆盖了，我们应该用一个变量 `pre` 存储当前位置被占用的数字。

思想就是上边的了，代码的话可能会有不同的写法，下边的供参考。

```java
public void rotate(int[] nums, int k) {
    int n = nums.length;
    k = k % n;
    if (k == 0) {
        return;
    }
    int count = 0; //记录搬移了多少个数字
    int start = 0;
    int current = start;
    int pre = nums[current];
    while (true) {
        do {
            //要移动过去的位置
            int next = (current + k) % n;
            //数字做缓存
            int temp = nums[next];
            //将数字搬过来
            nums[next] = pre;
            pre = temp;
            //考虑下一个位置
            current = next;
            count++;
            //全部数字搬移完就结束
            if (count == n) {
                return;
            }
        } while (start != current);
        //这里是防止死循环，因为搬移的位置可能会回到最开始的位置, 所以我们 start++, 继续搬移其他组
        start++;
        current = start;
        pre = nums[current];
    }
}
```

时间复杂度：`O(n)`，每个数字仅搬移一次。

空间复杂度：`O(1)`。

# 解法四

依旧是参考 [官方](https://leetcode.com/problems/rotate-array/solution/) 题解。

看具体的例子，`1 2 3 4 5`，`k = 2`。

转换后最终变成 `  4 5 1 2 3`。

其实可以分三步完成。

整体逆序 `5 4 3 2 1` 。

前 `k` 个再逆序 `4 5 3 2 1`。

后边的再逆序 `4 5 1 2 3`。

```java
public void rotate(int[] nums, int k) {
    int n = nums.length;
    k = k % n;
    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
}

private void reverse(int[] nums, int start, int end) {
    while (start < end) {
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++;
        end--;
    }
}
```

时间复杂度：`O(n)`。

空间复杂度：`O(1)`。

# 总

解法一、解法二就是对题目最简单的理解，解法三和解法四是进一步对题目的剖析，很厉害。