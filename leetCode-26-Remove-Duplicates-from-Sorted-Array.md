# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/26.jpg)

返回非重复数字的个数，并且把 nums 里重复的数字也去掉。

例如，nums = [ 1, 1, 2 ] ，那么就返回 2 ，并且把 nums 变成 [ 1, 2 ]。

这道题，蛮简单的，但是自己写的时候多加了个 while 循环，但和给出的 Solution 本质还是一样的。

# 我写的

for 循环遍历每个数，while 循环判断当前数和它的后一个数是否相等，相等就后移一个数，并且接着判断后移的数和它后边的数是否相等，然后一直循环下去。不相等就将后一个数保存起来，并且长度加 1，然后结束循环。

```java
public int removeDuplicates(int[] nums) {
    int len = 1;
    for (int i = 0; i < nums.length - 1; i++) {
        while (i < nums.length - 1) {
            if (nums[i] == nums[i + 1]) {
                i++;
            } else {
                nums[len] = nums[i + 1];
                len = len + 1;			
                break;
            }
        }
    }
    return len;
}
```

时间复杂度： O（n）。

空间复杂度：O（1）。

# Solution 给出的

利用快慢指针，i 指针从 0 开始，j 指针从 1 开始，如果 i 和 j 所指数字相等，就一直后移 j 。如果不相等，i 指针后移一位用来保存当前 j 所指的值，然后继续回到 j 的后移中去。

```java
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int i = 0;
    for (int j = 1; j < nums.length; j++) {
        if (nums[j] != nums[i]) {
            i++;
            nums[i] = nums[j];
        }
    }
    return i + 1;
}
```

时间复杂度： O（n）。

空间复杂度：O（1）。

# 总

不同的思想，决定了写出来的代码不同，但就时间复杂度来看，它们本质还是一样的。