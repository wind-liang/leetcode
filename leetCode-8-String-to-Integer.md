# 题目描述（中等难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/8_atoi.png)

将一个字符串转为整型。

这道题，难度其实不大，和[上道题](http://windliang.cc/2018/08/13/leetCode-7-Reverse-Integer/)有很多重合的地方。整体的思路就是遍历字符串，然后依次取出一个字符就可以了。无非是考虑一些特殊情况，还有就是理解题目意思。

经过多次试错，题目的意思是这样的。

从左遍历字符串，可以遇到空格，直到遇到 ' + ' 或者数字或者 ' - ' 就表示要转换的数字开始，如果之后遇到除了数字的其他字符（包括空格）就结束遍历，输出结果，不管后边有没有数字了，例如 "   - 32332ada2323" 就输出 "- 32332"。

如果遇到空格或者  ' + ' 或者数字或者 ' - '  之前遇到了其他字符，就直接输出 0 ，例如 "  we1332"。

如果转换的数字超出了 int ，就返回 intMax 或者 intMin。

```java
public int myAtoi(String str) {
		int sign = 1;
		int ans = 0, pop = 0;
		boolean hasSign = false; //代表是否开始转换数字
		for (int i = 0; i < str.length(); i++) {
			if (str.charAt(i) == '-' && !hasSign) {
				sign = -1;
				hasSign = true;
				continue;
			}
			if (str.charAt(i) == '+' && !hasSign) {
				sign = 1;
				hasSign = true;
				continue;
			}
			if (str.charAt(i) == ' ' && !hasSign) {
				continue;
			}

			if (str.charAt(i) >= '0' && str.charAt(i) <= '9') {
				hasSign = true;
				pop = str.charAt(i) - '0';
                 //和上道题判断出界一个意思只不过记得乘上 sign 。
				if (ans * sign > Integer.MAX_VALUE / 10 || (ans * sign == Integer.MAX_VALUE / 10 && pop * sign > 7))
					return 2147483647;
				if (ans * sign < Integer.MIN_VALUE / 10 || (ans * sign == Integer.MIN_VALUE / 10 && pop * sign < -8))
					return -2147483648;
				ans = ans * 10 + pop;
			} else {
				return ans * sign;
			}
		}
		return ans * sign;
	}
```

时间复杂度：O（n），n 是字符串的长度。

空间复杂度：O（1）。

# 总结

这道题让自己有点感到莫名其妙，好像没有 get 到出题人的点？？？

