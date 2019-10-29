# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/151.png)

将字符串的每个单词反过来，单词内部不需要逆转，注意可能会有多余的空格。

# 解法一

题目很直观，做法也会很直观，哈哈。遍历原字符串，遇到字母就加到一个 `temp` 变量中，遇到空格，如果 `temp` 变量不为空，就把 `temp` 组成的单词加到一个栈中，然后清空 `temp` 继续遍历。

最后，将栈中的每个单词依次拿出来拼接即可。

有一个技巧可以用，就是最后一个单词后边可能没有空格，为了统一，我们可以人为的在字符串后边加入一个空格。

```java
public String reverseWords(String s) {
    Stack<String> stack = new Stack<>();
    StringBuilder temp = new StringBuilder();
    s += " ";
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == ' ') {
            if (temp.length() != 0) {
                stack.push(temp.toString());
                temp = new StringBuilder();
            }
        } else {
            temp.append(s.charAt(i));
        }
    }
    if (stack.isEmpty()) {
        return "";
    }
    StringBuilder res = new StringBuilder();
    res.append(stack.pop());
    while (!stack.isEmpty()) {
        res.append(" ");
        res.append(stack.pop());
    }
    return res.toString();
}
```

# 解法二

可以看下题目中的 `Follow up`。

> For C programmers, try to solve it *in-place* in *O*(1) extra space.

如果用 C 语言，试着不用额外空间解决这个问题。

我们一直用的是 java，而 java 中的 `String` 变量是不可更改的，如果对它修改其实又会去重新创建新的内存空间。

而 C 语言不同，C 语言中的 `string` 本质上其实是 `char` 数组，所以我们可以在给定的 `string` 上直接进行修改而不使用额外空间。

为了曲线救国，继续用 java 实现，我们先将 `String` 转为 `char` 数组，所有的操作都在 `char` 数组上进行。

```java
 char[] a = s.toCharArray();
```

至于算法的话，参考了 [这里](https://leetcode.com/problems/reverse-words-in-a-string/discuss/47720/Clean-Java-two-pointers-solution-(no-trim(-)-no-split(-)-no-StringBuilder)。

主要是三个步骤即可。

1. 原地逆转 `char` 数组，这会导致每个单词内部也被逆转，接下来进行第二步
2. 原地逆转每个单词
3. 去除多余的空格

具体代码的话就直接从 [这里](https://leetcode.com/problems/reverse-words-in-a-string/discuss/47720/Clean-Java-two-pointers-solution-(no-trim(-)-no-split(-)-no-StringBuilder) 粘贴过来了，写的很简洁。几个封装的函数，关键就是去解决怎么原地完成。

```java
public String reverseWords(String s) {
    if (s == null) return null;

    char[] a = s.toCharArray();
    int n = a.length;

    // step 1. reverse the whole string
    reverse(a, 0, n - 1);
    // step 2. reverse each word
    reverseWords(a, n);
    // step 3. clean up spaces
    return cleanSpaces(a, n);
}

void reverseWords(char[] a, int n) {
    int i = 0, j = 0;

    while (i < n) {
        while (i < j || i < n && a[i] == ' ') i++; // skip spaces
        while (j < i || j < n && a[j] != ' ') j++; // skip non spaces
        reverse(a, i, j - 1);                      // reverse the word
    }
}

// trim leading, trailing and multiple spaces
String cleanSpaces(char[] a, int n) {
    int i = 0, j = 0;

    while (j < n) {
        while (j < n && a[j] == ' ') j++;             // skip spaces
        while (j < n && a[j] != ' ') a[i++] = a[j++]; // keep non spaces
        while (j < n && a[j] == ' ') j++;             // skip spaces
        if (j < n) a[i++] = ' ';                      // keep only one space
    }

    return new String(a).substring(0, i);
}

// reverse a[] from a[i] to a[j]
private void reverse(char[] a, int i, int j) {
    while (i < j) {
        char t = a[i];
        a[i++] = a[j];
        a[j--] = t;
    }
}
```

# 总

一开始没有 `get` 到题目要求空间复杂度为 `O(1)` 的想法，后来在 `discuss` 中才突然明白。