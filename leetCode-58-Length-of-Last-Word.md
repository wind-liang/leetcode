# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/58.jpg)

输出最后一个单词的长度。

# 解法一

直接从最后一个字符往前遍历，遇到空格停止就可以了。不过在此之前要过滤到末尾的空格。

```java
public int lengthOfLastWord(String s) {
    int count = 0;
    int index = s.length() - 1;
    //过滤空格
    while (true) {
        if (index < 0 || s.charAt(index) != ' ')
            break;
        index--;
    }
    //计算最后一个单词的长度
    for (int i = index; i >= 0; i--) {
        if (s.charAt(i) == ' ') {
            break;
        }
        count++;
    }
    return count;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 总

时隔多天，又遇到了一个简单的题，没什么好说的，就是遍历一遍，没有 get 到考点。