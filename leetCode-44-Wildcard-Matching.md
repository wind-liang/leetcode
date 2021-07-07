# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/44.png)

字符串匹配，? 匹配单个任意字符，* 匹配任意长度字符串，包括空串。和[第 10 题](https://leetcode.windliang.cc/leetCode-10-Regular-Expression-Matching.html)有些类似。

# 解法一 动态规划

直接按照之前[第 10 题](https://leetcode.windliang.cc/leetCode-10-Regular-Expression-Matching.html)，修改一下就可以了。

同样是用 dp\[i\]\[j\] 表示所有的情况，然后一层一层的根据递推关系求出来。

```java
public boolean isMatch(String text, String pattern) {
		// 多一维的空间，因为求 dp[len - 1][j] 的时候需要知道 dp[len][j] 的情况，
		// 多一维的话，就可以把 对 dp[len - 1][j] 也写进循环了
		boolean[][] dp = new boolean[text.length() + 1][pattern.length() + 1];
		// dp[len][len] 代表两个空串是否匹配了，"" 和 "" ，当然是 true 了。
		dp[text.length()][pattern.length()] = true;

		// 从 len 开始减少
		for (int i = text.length(); i >= 0; i--) {
			for (int j = pattern.length(); j >= 0; j--) {
				// dp[text.length()][pattern.length()] 已经进行了初始化
				if (i == text.length() && j == pattern.length())
					continue;
				//相比之前增加了判断是否等于 * 
				boolean first_match = (i < text.length() && j < pattern.length() && (pattern.charAt(j) == text.charAt(i) || pattern.charAt(j) == '?' || pattern.charAt(j) == '*'));
				if (j < pattern.length() && pattern.charAt(j) == '*') {
                    //将 * 跳过 和将字符匹配一个并且 pattern 不变两种情况
					dp[i][j] = dp[i][j + 1] || first_match && dp[i + 1][j];
				} else {
					dp[i][j] = first_match && dp[i + 1][j + 1];
				}
			}
		}
		return dp[0][0];
	}
```

时间复杂度：text 长度是 T，pattern 长度是 P，那么就是 O（TP）。

空间复杂度：O（TP）。

同样的，和[第10题](https://leetcode.windliang.cc/leetCode-10-Regular-Expression-Matching.html)一样，可以优化空间复杂度。

```java
public boolean isMatch(String text, String pattern) {
    // 多一维的空间，因为求 dp[len - 1][j] 的时候需要知道 dp[len][j] 的情况，
    // 多一维的话，就可以把 对 dp[len - 1][j] 也写进循环了
    boolean[][] dp = new boolean[2][pattern.length() + 1];
    dp[text.length() % 2][pattern.length()] = true;

    // 从 len 开始减少
    for (int i = text.length(); i >= 0; i--) {
        for (int j = pattern.length(); j >= 0; j--) {
            if (i == text.length() && j == pattern.length())
                continue;
            boolean first_match = (i < text.length() && j < pattern.length() && (pattern.charAt(j) == text.charAt(i)
                                                                                 || pattern.charAt(j) == '?' || pattern.charAt(j) == '*'));
            if (j < pattern.length() && pattern.charAt(j) == '*') {
                dp[i % 2][j] = dp[i % 2][j + 1] || first_match && dp[(i + 1) % 2][j];
            } else {
                dp[i % 2][j] = first_match && dp[(i + 1) % 2][j + 1];
            }
        }
    }
    return dp[0][0];
}
```

时间复杂度：text 长度是 T，pattern 长度是 P，那么就是 O（TP）。

空间复杂度：O（P）。

# 解法二 迭代

参考[这里](https://leetcode.com/problems/wildcard-matching/discuss/17810/Linear-runtime-and-constant-space-solution?orderBy=most_votes)，也比较好理解，利用两个指针进行遍历。

```java
boolean isMatch(String str, String pattern) {
    int s = 0, p = 0, match = 0, starIdx = -1;     
    //遍历整个字符串
    while (s < str.length()){
        // 一对一匹配，两指针同时后移。
        if (p < pattern.length()  && (pattern.charAt(p) == '?' || str.charAt(s) == pattern.charAt(p))){
            s++;
            p++;
        }
        // 碰到 *，假设它匹配空串，并且用 startIdx 记录 * 的位置，记录当前字符串的位置，p 后移
        else if (p < pattern.length() && pattern.charAt(p) == '*'){
            starIdx = p;
            match = s;
            p++;
        }
        // 当前字符不匹配，并且也没有 *，回退
        // p 回到 * 的下一个位置
        // match 更新到下一个位置
        // s 回到更新后的 match 
        // 这步代表用 * 匹配了一个字符
        else if (starIdx != -1){
            p = starIdx + 1;
            match++;
            s = match;
        }
        //字符不匹配，也没有 *，返回 false
        else return false;
    }
 
    //将末尾多余的 * 直接匹配空串 例如 text = ab, pattern = a*******
    while (p < pattern.length() && pattern.charAt(p) == '*')
        p++;

    return p == pattern.length();
}
```

时间复杂度：如果 str 长度是 T，pattern 长度是 P，虽然只有一个 while 循环，但是 s 并不是每次都加 1，所以最坏的时候时间复杂度会达到 O（TP），例如 str = "bbbbbbbbbb"，pattern = "*bbbb"。每次 pattern 到最后时，又会重新开始到开头。

空间复杂度：O（1）。

# 递归

在[第10题](https://leetcode.windliang.cc/leetCode-10-Regular-Expression-Matching.html)中还有递归的解法，但这题中如果按照第 10 题的递归的思路去解决，会导致超时，目前没想到怎么在第 10 题的基础上去改，有好的想法大家可以和我交流。

如果非要用递归的话，可以按照动态规划那个思路，先压栈，然后出栈过程其实就是动态规划那样了。所以其实不如直接动态规划。

# 更新

`2021.7.7` 日更新。（太久没写 `java` 代码了，由于换了电脑 `eclipes` 也没有，在 `vscode` 里写 `java` 竟然不会写了，习惯了写 `js` ，分号不加，类型不管，写 `java` 有点不适应了，哈哈）

上边说到当时按 [第 10 题](https://leetcode.wang/leetCode-10-Regular-Expression-Matching.html) 的递归思路超时了，代码如下：

```java
class Solution {
  public boolean isMatch(String text, String pattern) {
    if (pattern.isEmpty())
      return text.isEmpty();
    if (text.isEmpty())
      return pattern.isEmpty() || isStars(pattern);

    boolean first_match = (!text.isEmpty() && (pattern.charAt(0) == text.charAt(0) || pattern.charAt(0) == '?'));
    if (pattern.charAt(0) == '*') {
      return (isMatch(text.substring(1), pattern) || (isMatch(text.substring(1), pattern.substring(1))))
        || (isMatch(text, pattern.substring(1)));
    } else {
      return first_match && isMatch(text.substring(1), pattern.substring(1));
    }
  }

  private boolean isStars(String pattern) {
    // TODO Auto-generated method stub
    for (int i = 0; i < pattern.length(); i++) {
      if (pattern.charAt(i) != '*') {
        return false;
      }
    }
    return true;
  }
}
```

代码很好理解，这里就不多说了，可以参考 [第 10 题](https://leetcode.wang/leetCode-10-Regular-Expression-Matching.html)  的分析，但有个问题就是会超时。

![](https://windliang.oss-cn-beijing.aliyuncs.com/leetcode44n1.jpg)

前几天 [@xuyuntian](https://xuyuntian.gitee.io/) 加了微信告诉我他写出了一个递归的写法，[代码](https://gitee.com/xuyuntian/leetcode/blob/master/src/_44.java) 如下：

```java
class Solution {
  public boolean isMatch(String s, String p) {
    return dfs(new Boolean[s.length()][p.length()], s.toCharArray(), p.toCharArray(), 0, 0);
  }
  private boolean dfs(Boolean[][] dp, char[] s, char[] p, int i, int j) {
    if (i == s.length && j == p.length) return true;
    if (i > s.length || (i < s.length && j == p.length)) return false;
    if (i < s.length) {
      if (dp[i][j] != null) return dp[i][j];
      if (p[j] == '?' || p[j] == s[i]) {
        return dp[i][j] = dfs(dp, s, p, i + 1, j + 1);
      }
    }
    boolean res = false;
    if (p[j] == '*') {
      res = dfs(dp, s, p, i + 1, j + 1) || dfs(dp, s, p, i + 1, j) || dfs(dp, s, p, i, j + 1);
    }
    if (i < s.length) dp[i][j] = res;
    return res;
  }
}
```

看完以后突然就悟了，对啊，`memoization` 技术啊，把递归过程中的结果存起来呀！

于是我把自己的递归代码用 `HashMap` 改良了一版，把所有结果都用 `HashMap` 存起来。

```java
class Solution {
  public boolean isMatch(String text, String pattern) {
    HashMap<String,Boolean> map=new HashMap<>();
    return isMatchHelper(text, pattern, map);
  }
  public boolean isMatchHelper(String text, String pattern, HashMap<String,Boolean> map) {
    if (pattern.isEmpty())
      return text.isEmpty();
    if (text.isEmpty())
      return pattern.isEmpty() || isStars(pattern);
    String key = text + '@' + pattern;
    if(map.containsKey(key)) {
      return map.get(key);
    }
    boolean first_match = (!text.isEmpty() && (pattern.charAt(0) == text.charAt(0) || pattern.charAt(0) == '?'));
    if (pattern.charAt(0) == '*') {
      boolean res = (isMatchHelper(text.substring(1), pattern, map) || (isMatchHelper(text.substring(1), pattern.substring(1), map)))
        || (isMatchHelper(text, pattern.substring(1), map));
      map.put(key, res);
      return res;
    } else {
      boolean res = first_match && isMatchHelper(text.substring(1), pattern.substring(1), map);
      map.put(key, res);
      return res;
    }
  }

  private boolean isStars(String pattern) {
    // TODO Auto-generated method stub
    for (int i = 0; i < pattern.length(); i++) {
      if (pattern.charAt(i) != '*') {
        return false;
      }
    }
    return true;
  }
}
```

遗憾的是竟然超内存了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/leetcode44n2.jpg)

又看了下  [@xuyuntian](https://xuyuntian.gitee.io/)  的代码，原因只能是 `HashMap` 太占内存了，于是我也改成了用数组缓存结果。同样的，需要将下标在递归中传递。

```java
class Solution {
  public boolean isMatch(String text, String pattern) {
    boolean res = isMatchHelper(text, 0, pattern, 0, new Boolean[text.length()][pattern.length()]);
    return res;
  }

  public boolean isMatchHelper(String textOrigin, int textStart, String patternOrigin, int patternStart, Boolean[][] map) {
    String text = textOrigin.substring(textStart);
    String pattern = patternOrigin.substring(patternStart);
    if (pattern.isEmpty())
      return text.isEmpty();
    if (text.isEmpty())
      return pattern.isEmpty() || isStars(pattern);
    if(map[textStart][patternStart] != null) {
      return map[textStart][patternStart] ;
    }
    boolean first_match = (!text.isEmpty() && (pattern.charAt(0) == text.charAt(0) || pattern.charAt(0) == '?'));
    if (pattern.charAt(0) == '*') {
      boolean res = (isMatchHelper(textOrigin, textStart + 1,patternOrigin, patternStart, map) || (isMatchHelper(textOrigin, textStart + 1 ,patternOrigin, patternStart + 1, map)))
        || (isMatchHelper(textOrigin, textStart, patternOrigin, patternStart + 1, map));
      map[textStart][patternStart] = res;
      return res;
    } else {
      boolean res = first_match && isMatchHelper(textOrigin, textStart + 1 ,patternOrigin, patternStart + 1,  map);
      map[textStart][patternStart] = res;
      return res;
    }
  }

  private boolean isStars(String pattern) {
    // TODO Auto-generated method stub
    for (int i = 0; i < pattern.length(); i++) {
      if (pattern.charAt(i) != '*') {
        return false;
      }
    }
    return true;
  }
}
```

终于 `AC` 了！

![](https://windliang.oss-cn-beijing.aliyuncs.com/leetcode44n3.jpg)

# 总

动态规划的应用，理清递推的公式就可以。另外迭代的方法，也让人眼前一亮。

