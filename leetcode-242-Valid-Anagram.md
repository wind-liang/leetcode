# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/242.jpg)

判断两个字符串是否是异构，也就是两个字符串包含的字母是完全相同的，只是顺序不一样。

# 思路分析

[49 题](https://leetcode.wang/leetCode-49-Group-Anagrams.html) 其实已经做过了，当时是给很多字符串，然后把异构的字符串放到一组里。介绍了四种解法，这里就不细讲了，直接写代码了。

# 解法一 HashMap

最通用的解法，通过 `HashMap` 记录其中一个字符串每个字母的数量，然后再来判断和另一个字符串中每个字母的数量是否相同。

```java
public boolean isAnagram(String s, String t) {
    HashMap<Character, Integer> map = new HashMap<>();
    char[] sArray = s.toCharArray();
    for (int i = 0; i < sArray.length; i++) {
        int count = map.getOrDefault(sArray[i], 0);
        map.put(sArray[i], count + 1);
    }

    char[] tArray = t.toCharArray();
    for (int i = 0; i < tArray.length; i++) {
        int count = map.getOrDefault(tArray[i], 0);
        if (count == 0) {
            return false;
        }
        map.put(tArray[i], count - 1);
    }

    for (int value : map.values()) {
        if (value != 0) {
            return false;
        }
    }
    return true;
}
```

我们最后判断了一下所有的 `value` 是否为 `0`，因为要考虑这种情况，`abc` 和 `ab`。

我们也可以在开头判断一下两个字符串长度是否相同，这样的话最后就不用判断所有的 `value` 是否为 `0` 了。

```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) {
        return false;
    }
    HashMap<Character, Integer> map = new HashMap<>();
    char[] sArray = s.toCharArray();
    for (int i = 0; i < sArray.length; i++) {
        int count = map.getOrDefault(sArray[i], 0);
        map.put(sArray[i], count + 1);
    }

    char[] tArray = t.toCharArray();
    for (int i = 0; i < tArray.length; i++) {
        int count = map.getOrDefault(tArray[i], 0);
        if (count == 0) {
            return false;
        }
        map.put(tArray[i], count - 1);
    }

    return true;
}
```



# 解法二 排序

把两个字符串按照字典序进行排序，排序完比较两个字符串是否相等。

```java
public boolean isAnagram(String s, String t) {
    char[] sArray = s.toCharArray();
    Arrays.sort(sArray);
    s = String.valueOf(sArray);

    char[] tArray = t.toCharArray();
    Arrays.sort(tArray);
    t = String.valueOf(tArray);

    return s.equals(t);
}
```

# 解法三 素数相乘

把每个字母映射到一个素数上，然后把相应的素数相乘作为一个 `key` 。

```java
public boolean isAnagram(String s, String t) {
    int[] prime = { 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
                   101 };
    char[] sArray = s.toCharArray();
    int sKey = 1;
    for (int i = 0; i < sArray.length; i++) {
        sKey = sKey * prime[sArray[i] - 'a'];
    }

    char[] tArray = t.toCharArray();
    int tKey = 1;
    for (int i = 0; i < tArray.length; i++) {
        tKey = tKey * prime[tArray[i] - 'a'];
    }

    return sKey == tKey;
}
```

[49 题](https://leetcode.wang/leetCode-49-Group-Anagrams.html)  这样写是可以的，但当时也指出了一个问题，相乘如果数过大的话会造成溢出，最后的 `key` 就不准确了，所以会出现错误。

这里的话用 `int` 就不可以了，改成 `long` 也不行。最后用了 `java` 提供的大数类。

```java
import java.math.BigInteger;
class Solution {
    public boolean isAnagram(String s, String t) {
        int[] prime = { 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
                       101 };
        char[] sArray = s.toCharArray();
        BigInteger sKey = BigInteger.valueOf(1);
        for (int i = 0; i < sArray.length; i++) {
            BigInteger temp = BigInteger.valueOf(prime[sArray[i] - 'a']);
            sKey = sKey.multiply(temp);
        }

        char[] tArray = t.toCharArray();
        BigInteger tKey = BigInteger.valueOf(1);
        for (int i = 0; i < tArray.length; i++) {
            BigInteger temp = BigInteger.valueOf(prime[tArray[i] - 'a']);
            tKey = tKey.multiply(temp);
        }

        return sKey.equals(tKey);
    }
}
```

# 解法四 数组

这个本质上和解法一是一样的，因为字母只有 `26` 个，所以我们可以用一个大小为 `26` 的数组来统计每个字母的个数。

因为有 26 个字母，不好解释，我们假设只有 5 个字母，来看一下怎么完成映射。

首先初始化 `key = "0#0#0#0#0#"`，数字分别代表 `abcde` 出现的次数，`#` 用来分割。

这样的话，`"abb"` 就映射到了 `"1#2#0#0#0"`。

`"cdc"` 就映射到了 `"0#0#2#1#0"`。

`"dcc`" 就映射到了 `"0#0#2#1#0"`。

```java
public boolean isAnagram(String s, String t) {
    int[] sNum = new int[26];
    // 记录每个字符的次数
    char[] sArray = s.toCharArray();
    for (int i = 0; i < sArray.length; i++) {
        sNum[sArray[i] - 'a']++;
    }
    StringBuilder sKey = new StringBuilder();
    for (int i = 0; i < sNum.length; i++) {
        sKey.append(sNum[i] + "#");
    }

    int[] tNum = new int[26];
    // 记录每个字符的次数
    char[] tArray = t.toCharArray();
    for (int i = 0; i < tArray.length; i++) {
        tNum[tArray[i] - 'a']++;
    }
    StringBuilder tKey = new StringBuilder();
    for (int i = 0; i < tNum.length; i++) {
        tKey.append(tNum[i] + "#");
    }

    return sKey.toString().equals(tKey.toString());
}
```

# 总

和 [49 题](https://leetcode.wang/leetCode-49-Group-Anagrams.html) 的解法完全一样，唯一不同的地方在于解法三，这里因为给的字符串比较长，所以素数相乘的方法不是很好了。