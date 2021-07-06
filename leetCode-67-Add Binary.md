# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/67.jpg)

两个二进制数相加，返回结果，要注意到字符串的最低位代表着数字的最高位。例如 "100" 最高位（十进制中的百位的位置）是 1，但是对应的字符串的下标是 0。

# 解法一

开始的时候以为会有什么特殊的方法，然后想着不管了，先按[第二题](https://leetcode.windliang.cc/leetCode-2-Add-Two-Numbers.html)两个十进制数相加的想法写吧。

```java
public String addBinary(String a, String b) {
    StringBuilder ans = new StringBuilder();
    int i = a.length() - 1;
    int j = b.length() - 1;
    int carry = 0;
    while (i >= 0 || j >= 0) {
        int num1 = i >= 0 ? a.charAt(i) - 48 : 0;
        int num2 = j >= 0 ? b.charAt(j) - 48 : 0;
        int sum = num1 + num2 + carry;
        carry = 0;
        if (sum >= 2) {
            sum = sum % 2;
            carry = 1;
        }
        ans.insert(0, sum);
        i--;
        j--;

    }
    if (carry == 1) {
        ans.insert(0, 1);
    }
    return ans.toString();
}
```

时间复杂度：O（max （m，n））。m 和 n 分别是字符串 a 和 b 的长度。

空间复杂度：O（1）。

然后写完以后，在 Discuss 里逛了逛，找找其他的解法。发现基本都是这个思路，但是奇怪的是我的解法，时间上只超过了 60% 的人。然后，点开了超过 100% 的人的解法。

```java
public String addBinary2(String a, String b) {
    char[] charsA = a.toCharArray(), charsB = b.toCharArray();
    char[] sum = new char[Math.max(a.length(), b.length()) + 1];
    int carry = 0, index = sum.length - 1;
    for (int i = charsA.length - 1, j = charsB.length - 1; i >= 0 || j >= 0; i--, j--) 		{
        int aNum = i < 0 ? 0 : charsA[i] - '0';
        int bNum 	= j < 0 ? 0 : charsB[j] - '0';

        int s = aNum + bNum + carry;
        sum[index--] = (char) (s % 2 + '0');
        carry = s / 2;
    }
    sum[index] = (char) ('0' + carry);
    return carry == 0 ? new String(sum, 1, sum.length - 1) : new String(sum);
}
```

和我的思路是一样的，区别在于它提前申请了 sum 的空间，然后直接 index 从最后向 0 依次赋值。

因为 String .charAt ( 0 ) 代表的是数字的最高位，而我们计算是从最低位开始的，也就是 lenght - 1开始的，所以在之前的算法中每次得到一个结果我们用的是  ans.insert(0, sum) ，在 0 位置插入新的数。我猜测是这里耗费了很多时间，因为插入的话，会导致数组的后移。

我们如果把 insert 换成 append ，然后再最后的结果中再倒置，就会快一些了。

```java
public String3 addBinary(String a, String b) {
    StringBuilder ans = new StringBuilder();
    int i = a.length() - 1;
    int j = b.length() - 1;
    int carry = 0;
    while (i >= 0 || j >= 0) {
        int num1 = i >= 0 ? a.charAt(i) - 48 : 0;
        int num2 = j >= 0 ? b.charAt(j) - 48 : 0;
        int sum = num1 + num2 + carry;
        carry = 0;
        if (sum >= 2) {
            sum = sum % 2;
            carry = 1;
        }
        ans.append(sum);
        i--;
        j--;

    }
    if (carry == 1) {
        ans.append(1);
    }
    return ans.reverse().toString();
}
```

# 总

这里看出来多次 insert 会很耗费时间，不如最后直接 reverse。另外提前申请空间，直接根据下标赋值，省去了倒置的时间，很 cool。