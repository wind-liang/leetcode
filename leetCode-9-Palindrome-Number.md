# 题目描述（简单难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/9_1.jpg)

判断是不是回文数，负数不是回文数。

# 解法一

把 int 转成字符串，然后判断是否是回文串做就可以了，缺点是需要额外的空间存储字符串，当然题目也告诉了不能这样，所以 pass 。

# 解法二

在[第 7 道题](https://leetcode.windliang.cc/leetCode-7-Reverse-Integer.html)我们写了倒置 int 的算法，这里当然可以用到了，只需要判断倒置前后相不相等就可以了。

记不记得，当倒置后的数字超出 int 的范围时，我们返回的是 0 ，那么它一定不等于原数，此时一定返回 false 了，这正不正确呢？

我们只需证明，如果倒置后超出 int 的范围，那么它一定不是回文数字就好了。

反证法，我们假设存在这么一个数，倒置后是超出 int 范围的，并且它是回文数字。

int 最大为 2147483647 ,

![](http://windliang.oss-cn-beijing.aliyuncs.com/9_2.jpg)

让我们来讨论这个数可能是多少。

有没有可能是最高位大于 2 导致的溢出，比如最高位是 3 ，因为是回文串，所以最低位是 3 ，这就将导致转置前最高位也会是 3 ，所以不可能是这种情况。

有没有可能是第 2 高位大于 1 导致的溢出，此时保持最高位不变，假如第 2 高位是 2，因为是回文串，所以个位是 2，十位是 2 ，同样的会导致倒置前超出了 int 的最大值，所以也不可能是这种情况。

同理，第 3 高位，第 4，第 5，直线左边的都是上述的情况，所以不可能是前边的位数过大。

为了保证这个数是溢出的，前边 5 位必须固定不变了，因为它是回文串，所以直线后的灰色数字就一定是 4 ，而此时不管后边的数字取多少，都不可能是溢出的了。

综上，不存在这样一个数，所以可以安心的写代码了。

```java
public int reverse(int x) {
    int rev = 0;
    while (x != 0) {
        int pop = x % 10;
        x /= 10;
        if (rev > Integer.MAX_VALUE / 10)
            return 0;
        if (rev < Integer.MIN_VALUE / 10)
            return 0;
        rev = rev * 10 + pop;
    }
    return rev;
}

public boolean isPalindrome(int x) {
    if (x < 0) {
        return false;
    }
    int rev = reverse(x);
    return x == rev;
}
```

时间复杂度：和求转置一样，x 有多少位，就循环多少次，所以是 O（log（x）） 。

空间复杂度：O（1）。

# 解法三

其实，我们只需要将右半部分倒置然后和左半部比较就可以了。比如 1221 ，把 21 转置和 12 比较就行了。

```java
public boolean isPalindrome(int x) {
    if (x < 0) {
        return false;
    }
    int digit = (int) (Math.log(x) / Math.log(10) + 1); //总位数
    int revert = 0;
    int pop = 0;
    //倒置右半部分 
    for (int i = 0; i < digit / 2; i++) { 
        pop = x % 10;
        revert = revert * 10 + pop;
        x /= 10;
    }
    if (digit % 2 == 0 && x == revert) {
        return true;
    }
    //奇数情况 x 除以 10 去除 1 位
    if (digit % 2 != 0 && x / 10 == revert) { 
        return true;
    }
    return false;
}
```

时间复杂度：循环 x 的总位数的一半次，所以时间复杂度依旧是 O（log（x））。

空间复杂度：O（1），常数个变量。

# 总结

这几天都比较简单，加油加油加油！。