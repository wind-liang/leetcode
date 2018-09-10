# 题目描述（简单难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/14_1.jpg)

# 解法一  垂直比较

![](http://windliang.oss-cn-beijing.aliyuncs.com/14_2.jpg)

我们把所有字符串垂直排列，然后一列一列的比较，直到某一个字符串到达结尾或者该列字符不完全相同。

下边看一下我的代码，看起来比较多

```java
//这个函数判断 index 列的字符是否完全相同
public boolean isSameAtIndex(String[] strs, int index) {
    int i = 0;
    while (i < strs.length - 1) {
        if (strs[i].charAt(index) == strs[i + 1].charAt(index)) {
            i++;
        } else {
            return false;
        }
    }
    return true;
}

public String longestCommonPrefix(String[] strs) {
    if (strs.length == 0)
        return "";
    //得到最短的字符串的长度
    int minLength = Integer.MAX_VALUE;
    for (int i = 0; i < strs.length; i++) {
        if (strs[i].length() < minLength) {
            minLength = strs[i].length();
        }
    }
    int j = 0;
    //遍历所有列
    for (; j < minLength; j++) {
        //如果当前列字符不完全相同，则结束循环
        if (!isSameAtIndex(strs, j)) {
            break;
        }
    }
    return strs[0].substring(0, j);

}
```

下边看一下，官方的代码

```java
public String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0) return "";
    //遍历所有列
    for (int i = 0; i < strs[0].length() ; i++){
        char c = strs[0].charAt(i); // 保存 i 列第 0 行的字符便于后续比较
        //比较第 1,2,3... 行的字符和第 0 行是否相等
        for (int j = 1; j < strs.length; j ++) {
            /**
             * i == strs[j].length() 表明当前行已经到达末尾
             * strs[j].charAt(i) != c  当前行和第 0 行字符不相等
             * 上边两种情况返回结果
             */
            if (i == strs[j].length() || strs[j].charAt(i) != c)
                return strs[0].substring(0, i);             
        }
    }
    return strs[0];
}
```

时间复杂度：最坏的情况就是 n 个 长度为 m 的完全一样的字符串，假设 S 是所有字符的和，那么 S = m \* n，时间复杂度就是 O（S）。当然正常情况下并不需要比较所有字符串，最多比较 n \* minLen 个字符就可以了。

空间复杂度：O（1），常数个额外空间。

# 解法二 水平比较

![](http://windliang.oss-cn-beijing.aliyuncs.com/14_3.jpg)

我们将字符串水平排列，第 0 个和第 1 个字符串找最长子串，结果为 leet，再把结果和第 2 个字符串比较，结果为 leet，再把结果和第 3 个字符串比较，结果为 lee，即为最终结果。

```java
public String longestCommonPrefix3(String[] strs) {
		if (strs.length == 0)
			return "";
		String prefix = strs[0]; // 保存结果
		// 遍历每一个字符串
		for (int i = 1; i < strs.length; i++) {
			// 找到上次得到的结果 prefix 和当前字符串的最长子串
			int minLen = Math.min(prefix.length(), strs[i].length());
			int j = 0;
			for (; j < minLen; j++) {
				if (prefix.charAt(j) != strs[i].charAt(j)) {
					break;
				}
			}
			prefix = prefix.substring(0, j);
		}
		return prefix;
	}
```

时间复杂度：最坏情况和解法一是一样，n 个长度为 m 的完全相同的字符，就要比较所有的字符 S，S = n \* m 。但对于正常情况，处于最短字符串前的字符串依旧要比较所有字符，而不是最短字符串个字符，相对于解法一较差。

空间复杂度：O（1）。

# 解法三 递归 

![](http://windliang.oss-cn-beijing.aliyuncs.com/14_4.jpg)

我们把原来的数组分成两部分，求出左半部分的最长公共前缀，求出右半部分的最长公共前缀，然后求出的两个结果再求最长公共前缀，就是最后的结果了。

求左半部分的最长公共前缀，我们可以继续把它分成两部分，按照上边的思路接着求。然后一直分成两部分，递归下去。

直到该部分只有 1 个字符串，那么最长公共子串就是它本身了，直接返回就可以了。

```java
public String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0) return "";    
        return longestCommonPrefix(strs, 0 , strs.length - 1);
}

//递归不断分成两部分
private String longestCommonPrefix(String[] strs, int l, int r) {
    if (l == r) {
        return strs[l];
    }
    else {
        int mid = (l + r)/2;
        String lcpLeft =   longestCommonPrefix(strs, l , mid);
        String lcpRight =  longestCommonPrefix(strs, mid + 1,r);
        return commonPrefix(lcpLeft, lcpRight);
   }
}
//求两个结果的最长公共前缀
String commonPrefix(String left,String right) {
    int min = Math.min(left.length(), right.length());       
    for (int i = 0; i < min; i++) {
        if ( left.charAt(i) != right.charAt(i) )
            return left.substring(0, i);
    }
    return left.substring(0, min);
}
```

时间复杂度：

空间复杂度：

每次遇到递归的情况，总是有些理不清楚，先空着吧。

# 总

进行了垂直比较和水平比较，又用到了递归，[solution](https://leetcode.com/problems/longest-common-prefix/solution/) 里还介绍了二分查找，感觉这里用二分查找有些太僵硬了，反而使得时间复杂度变高了。还介绍了前缀树，这里后边遇到再总结吧。





