# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/125.jpg)

判断一个字符串是否是回文串，忽略掉除了字母和数字外的字符。

# 解法一

两个指针，一个指针从头进行，一个指针从尾部进行。依次判断两个指针的字符是否相等，同时要跳过非法字符。需要注意的是，两个指针不用从头到尾遍历，当两个指针相遇的时候就意味着这个字符串是回文串了。

还需要注意的是 `'A' == 'a'` ，也就是大写字母和小写字母是相同的。

```java
public boolean isPalindrome(String s) {
    int len = s.length();
    s = s.toLowerCase(); //统一转为小写
    int i = 0, j = len - 1;
    while (i < j) {
        //跳过非法字符
        while (!isAlphanumeric(s.charAt(i))) {
            i++;
            //匹配 "   " 这样的空白字符串防止越界
            if (i == len) {
                return true;
            }
        }
        while (!isAlphanumeric(s.charAt(j))) {
            j--;
        }
        if (s.charAt(i) != s.charAt(j)) {
            return false;
        }
        i++;
        j--;
    }
    return true; 
}

private boolean isAlphanumeric(char c) {
    if ('a' <= c && c <= 'z' || 'A' <= c && c <= 'Z' || '0' <= c && c <= '9') {
        return true;
    }
    return false;
}  
```

# 解法二

上边的是常规的思路，这里分享另一个 [思路](<https://leetcode.com/problems/valid-palindrome/discuss/39993/3ms-java-solution(beat-100-of-java-solution)>) 。

上边为了处理大小写字母的问题，首先全部统一为了小写。为了找出非法字符，每次都需要判断一下该字符是否在合法范围内。

这里用一个技巧，把 `'0'` 到 `'10'` 映射到 `1` 到 `10`，`'a'` 到 `'z'` 映射到 `11` 到 `36` ，`'A'` 到 `'Z'` 也映射到 `11` 到 `36` 。然后把所有数字和字母用一个 `char` 数组存起来，没存的字符就默认映射到 `0` 了。

这样只需要判断字符串中每个字母映射过去的数字是否相等，如果是 `0` 就意味着它是非法字符。

```java
private static final char[] charMap = new char[256];

static {
    // 映射 '0' 到 '9'
    for (int i = 0; i < 10; i++) {
        charMap[i + '0'] = (char) (1 + i); // numeric
    }
    // 映射 'a' 到 'z' 和 映射 'A' 到 'Z'
    for (int i = 0; i < 26; i++) {
        charMap[i + 'a'] = charMap[i + 'A'] = (char) (11 + i);
    }
}

public boolean isPalindrome(String s) {
    char[] pChars = s.toCharArray();
    int start = 0, end = pChars.length - 1;
    char cS, cE;
    while (start < end) {
        // 得到映射后的数字
        cS = charMap[pChars[start]];
        cE = charMap[pChars[end]];
        if (cS != 0 && cE != 0) {
            if (cS != cE)
                return false;
            start++;
            end--;
        } else {
            if (cS == 0)
                start++;
            if (cE == 0)
                end--;
        }
    }
    return true;
}
```

# 总

很简单的一道题了，值得注意的就是解法二将所有字母进行映射，同时将大小写字母映射到同一个数字的想法，省了很多事，速度会提升一些。也可以做一下 [第 5 题](<https://leetcode.wang/leetCode-5-Longest-Palindromic-Substring.html>) ，给定一个字符串，找出最长的回文子串，里边的介绍的马拉车算法是真的太强了。