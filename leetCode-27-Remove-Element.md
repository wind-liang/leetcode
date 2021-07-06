# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/27.jpg)

和[上一题](https://leetcode.windliang.cc/leetCode-26-Remove-Duplicates-from-Sorted-Array.html)类似，只不过这个是去除给定的值，看起来还更简单些。

例如给了 nums = [ 3, 2, 2, 3 ]，val = 3， 然后我们返回 len = 2，并且 nums 修改为 [ 2, 2 ] 。

# 解法一

和上道题一样，我们利用快慢指针，此外我们还得用下反向的思维。快指针 fast 和慢指针 slow，一直移动 fast ，如果 fast 指向的值不等于给定的 val ，我们就将值赋给 slow 指向的位置，slow 后移一位。如果 fast 指向的值等于 val 了，此时 fast 后移一位就可以了，不做其他操作。

```java
public int removeElement(int[] nums, int val) {
    int fast = 0;
    int slow = 0;
    while (fast < nums.length) {
        if (nums[fast] != val) {
            nums[slow++] = nums[fast];
        }
        fast++;
    }
    return slow;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二

参考给出的[Soloution](https://leetcode.com/problems/remove-element/solution/)。

上边的解法，我们是如果**不等于** val 就赋值。但如果按题目的想法，应该是如果**等于** val 就移除。我们从正方面去想，也就是等于 val 的话，我们怎么体现移除呢？

题目中有个说明我们没利用到，他告诉我们说 the order of those five elements can be arbitrary，就是说数组的顺序可以随便换，我们怎么充分利用呢？

我们可以这样，如果当前元素等于 val 了，我们就把它扔掉，然后将最后一个值赋值到当前位置，并且长度减去 1。什么意思呢？

比如 1 2 2 4 6，如果 val 等于 2 。那么当移动到 2 的时候，等于 val 了。我们就把最后一个位置的 6 赋值过来，长度减去 1 。就变成了 1 6 2 4。完美！达到了移除的效果。然后当又移动到新的 2 的时候，就把最后的 4 拿过来，变成 1 6 4，达到了移除的效果。看下代码吧。

```java
public int removeElement(int[] nums, int val) {
    int i = 0;
    int n = nums.length;
    while (i < n) {
        if (nums[i] == val) {
            nums[i] = nums[n - 1]; 
            n--;
        } else {
            i++;
        }
    }
    return n;
}
```

时间复杂度：同样是 O（n），但如果等于 val 的值比较少，解法二会更有效率些。比如 1 2 3 4，val = 2。解法一 while 循环中将调用 3 次赋值。而解法二中，仅仅当等于 val 的时候赋值 1 次。

空间复杂度：O（1）。

# 总

Solution 给出的想法让人耳目一新，对于移除的值少的情况，优化了不少。