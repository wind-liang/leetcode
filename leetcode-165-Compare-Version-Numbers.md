# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/165.png)

比较两个版本号，`version1` 大于 `version2` 就返回 `1`，相等返回 `0`，小于就返回 `-1`。比较的时候先比较最左边的数字，相等的话再比较后一个，以此类推。

# 解法一

这道题今年笔试的时候遇到好几次了，没想到竟然是 `leetcode` 的原题。思路很简单，按照「点」对版本号进行切割，然后依次比较每个数字即可。

切割的话涉及到 `java` 语言的一个特性，`.` 在正则里有特殊含义，所以我们需要进行转义。

这里切割出来的是字符串，所以我们需要把字符串转为数字，因为字符串转数字不是这道题的重点，所以直接调用系统提供的 `Integer.parseInt` 即可。 

```java
public int compareVersion(String version1, String version2) {
    String[] nums1 = version1.split("\\.");
    String[] nums2 = version2.split("\\.");
    int i = 0, j = 0;
    while (i < nums1.length || j < nums2.length) {
        //这个技巧经常用到，当一个已经遍历结束的话，我们将其赋值为 0
        String num1 = i < nums1.length ? nums1[i] : "0";
        String num2 = j < nums2.length ? nums2[j] : "0";
        int res = compare(num1, num2);
        if (res == 0) {
            i++;
            j++;
        } else {
            return res;
        }
    }
    return 0;
}

private int compare(String num1, String num2) {
    int n1 = Integer.parseInt(num1);
    int n2 = Integer.parseInt(num2);
    if (n1 > n2) {
        return 1;
    } else if (n1 < n2) {
        return -1;
    } else {
        return 0;
    }
}
```

# 解法二

上边的解法可以成功 `AC`，但是如果数字过大的话，`int` 是无法保存的。所以我们可以不把字符串转为数字，而是直接用字符串比较。

```java
public int compareVersion(String version1, String version2) {
    String[] nums1 = version1.split("\\.");
    String[] nums2 = version2.split("\\.");
    int i = 0, j = 0;
    while (i < nums1.length || j < nums2.length) {
        String num1 = i < nums1.length ? nums1[i] : "0";
        String num2 = j < nums2.length ? nums2[j] : "0";
        int res = compare(num1, num2);
        if (res == 0) {
            i++;
            j++;
        } else {
            return res;
        }
    }
    return 0;
}

private int compare(String num1, String num2) {
    //将高位的 0 去掉
    num1 = removeFrontZero(num1);
    num2 = removeFrontZero(num2);
    //先根据长度进行判断
    if (num1.length() > num2.length()) {
        return 1;
    } else if (num1.length() < num2.length()) {
        return -1;
    } else {
        //长度相等的时候
        for (int i = 0; i < num1.length(); i++) {
            if (num1.charAt(i) - num2.charAt(i) > 0) {
                return 1;
            } else if (num1.charAt(i) - num2.charAt(i) < 0) {
                return -1;
            }
        }
        return 0;
    }
}

private String removeFrontZero(String num) {
    int start = 0;
    for (int i = 0; i < num.length(); i++) {
        if (num.charAt(i) == '0') {
            start++;
        } else {
            break;
        }
    }
    return num.substring(start);
}
```

# 总

题目其实是比较简单的，` String num1 = i < nums1.length ? nums1[i] : "0";` 这个技巧在 [第 2 题](https://leetcode.wang/leetCode-2-Add-Two-Numbers.html)  用到过，会使得代码很清晰，逻辑上也会简单些。解法二直接对字符串进行操作，这也是处理大数运算的时候的方法。

