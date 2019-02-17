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

# 总

动态规划的应用，理清递推的公式就可以。另外迭代的方法，也让人眼前一亮。