# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/28.jpg)

返回一个字符串 needle 在另一个字符串 haystack 中开始的位置，如果不存在就返回 -1 ，如果 needle 长度是 0 ，就返回 0 。

就是一一比较就好，看下代码吧。

```java
public int strStr(String haystack, String needle) {
    if (needle.length() == 0) {
        return 0;
    }
    int j = 0;
    //遍历每个字符
    for (int i = 0; i < haystack.length(); i++) {
        //相等的话计数加 1 
        if (haystack.charAt(i) == needle.charAt(j)) {
            j++;
            //长度够了就返回
            if (j == needle.length()) {
                return i - j + 1;
            }
            // 不相等的话 j 清零，
            // 并且 i 回到最初的位置，之后就进入 for 循环中的 i++，从下个位置继续判断
        } else {
            i = i - j;
            j = 0;
        }
    }
    return -1;
}
```

时间复杂度：假设 haystack 和 needle 的长度分别是 n 和 k，对于每一个 i ，我们最多执行 k - 1 次，总共会有 n 个 i ，所以时间复杂度是 O（kn）。

空间复杂度：O（1）。

我们再看下别人的[代码](https://leetcode.com/problems/implement-strstr/discuss/12807/Elegant-Java-solution)，用两个 for 循环。但本质其实是一样的，但可能会更好理解些吧。

```java
public int strStr(String haystack, String needle) {
  for (int i = 0; ; i++) {
    for (int j = 0; ; j++) {
      if (j == needle.length()) return i;
      if (i + j == haystack.length()) return -1;
      if (needle.charAt(j) != haystack.charAt(i + j)) break;
    }
  }
}
```

# 总

总的来说，还是比较简单的，就是简单的遍历就实现了。