# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/263.png)

判断是否是丑数，丑数的质数因子中仅含有 `2, 3, 5`。

# 解法一

可以用递归的思想去写，判断能否被 `2, 3, 5` 整除，如果能整除的话，就去递归。

```java
public boolean isUgly(int num) {
    if (num <= 0) {
        return false;
    }
    if (num % 2 == 0) {
        return isUgly(num / 2);
    }

    if (num % 3 == 0) {
        return isUgly(num / 3);
    }

    if (num % 5 == 0) {
        return isUgly(num / 5);
    }

    return num == 1;
}
```

还可以直接用 `while` 循环，分享 [这里](https://leetcode.com/problems/ugly-number/discuss/69342/Simplest-java-solution) 的解法。

```java
public boolean isUgly(int num) {
    if (num <= 0) return false;
    while (num % 2 == 0) num /= 2;
    while (num % 3 == 0) num /= 3;
    while (num % 5 == 0) num /= 5;
    return num == 1;
}
```

# 总

emm，很简单的一道题。