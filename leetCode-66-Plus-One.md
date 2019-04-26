# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/66.jpg)

数组代表一个数字，[ 1, 2, 3 ] 就代表 123，然后给它加上 1，输出新的数组。数组每个位置只保存 1 位，也就是 0 到 9。

# 解法一 递归

先用递归，好理解一些。

```java
public int[] plusOne(int[] digits) {
    return plusOneAtIndex(digits, digits.length - 1);
}

private int[] plusOneAtIndex(int[] digits, int index) {
    //说明每一位都是 9 
    if (index < 0) {
        //新建一个更大的数组，最高位赋值为 1
        int[] ans = new int[digits.length + 1];
        ans[0] = 1;
        //其他位赋值为 0，因为 java 里默认是 0，所以不需要管了 
        return ans;
    }
    //如果当前位小于 9，直接加 1 返回
    if (digits[index] < 9) {
        digits[index] += 1;
        return digits;
    }
	
    //否则的话当前位置为 0,
    digits[index] = 0;
    //考虑给前一位加 1
    return plusOneAtIndex(digits, index - 1);

}
```

时间复杂度：O（n）。

空间复杂度：

# 解法二 迭代

上边的递归，属于[尾递归](https://www.zhihu.com/question/20761771)，完全没必要压栈，直接改成迭代的形式吧。

```java 
public int[] plusOne(int[] digits) {
    //从最低位遍历
    for (int i = digits.length - 1; i >= 0; i--) {
        //小于 9 的话，直接加 1，结束循环
        if (digits[i] < 9) {
            digits[i] += 1;
            break;
        } 
        //否则的话置为 0
        digits[i] = 0; 
    }
    //最高位如果置为 0 了，说明最高位产生了进位
    if (digits[0] == 0) {
        int[] ans = new int[digits.length + 1];
        ans[0] = 1; 
        digits = ans;
    }
    return digits;
}
```

时间复杂度：O（n）。

空间复杂度：

#  总

很简单的一道题，理解题意就可以了。有的编译器不进行尾递归优化，他遇到这种尾递归还是不停压栈压栈压栈，所以这种简单的我们直接用迭代就行。