## 题目描述（中等难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/6_zig.jpg)

就是给定一个字符串，然后按写竖着的 「z」的方式排列字符，就是下边的样子。

![](http://windliang.oss-cn-beijing.aliyuncs.com/6_1.jpg)

然后按行的方式输出每个字符，第 0 行，第 1 行，第 2 行 ....

## 解法一 

按照写 Z 的过程，遍历每个字符，然后将字符存到对应的行中。用 goingDown 保存当前的遍历方向，如果遍历到两端，就改变方向。

```java
 public String convert(String s, int numRows) {

        if (numRows == 1) return s;

        List<StringBuilder> rows = new ArrayList<>();
        for (int i = 0; i < Math.min(numRows, s.length()); i++)
            rows.add(new StringBuilder());

        int curRow = 0;
        boolean goingDown = false;

        for (char c : s.toCharArray()) {
            rows.get(curRow).append(c);
            if (curRow == 0 || curRow == numRows - 1) goingDown = !goingDown; //遍历到两端，改变方向
            curRow += goingDown ? 1 : -1;
        }

        StringBuilder ret = new StringBuilder();
        for (StringBuilder row : rows) ret.append(row);
        return ret.toString();
    }
```

时间复杂度：O（n），n 是字符串的长度。

空间复杂度：O（n），保存每个字符需要的空间。

## 解法二

找出按 Z 形排列后字符的规律，然后直接保存起来。

![](http://windliang.oss-cn-beijing.aliyuncs.com/6_3.jpg)

我们可以看到，图形其实是有周期的，0，1，2 ... 7 总过 8 个，然后就又开始重复相同的路径。周期的计算就是 cycleLen = 2 × numRows - 2 = 2 × 5 - 2 = 8 个。

我们发现第 0 行和最后一行一个周期内有一个字符，所以第一个字符下标是 0 ，第二个字符下标是 0 + cycleLen = 8，第三个字符下标是 8 + cycleLen = 16 。 

其他行都是两个字符。

第 1 个字符和第 0 行的规律是一样的。

第 2 个字符其实就是下一个周期的第 0 行的下标减去当前行。什么意思呢？

我们求一下第 1 行第 1 个周期内的第 2 个字符，下一个周期的第 0 行的下标是 8 ，减去当前行 1 ，就是 7 了。

我们求一下第 1 行第 2 个而周期内的第 2 个字符，下一个周期的第 0 行的下标是 16 ，减去当前行 1 ，就是 15 了。

我们求一下第 2 行第 1 个周期内的第 2 个字符，下一个周期的第 0 行的下标是 8 ，减去当前行 2 ，就是 6 了。

当然期间一定要保证下标小于 n ，防止越界。

可以写代码了。

```java
public String convert(String s, int numRows) {

	if (numRows == 1)
		return s;

	StringBuilder ret = new StringBuilder();
	int n = s.length();
	int cycleLen = 2 * numRows - 2;

	for (int i = 0; i < numRows; i++) {
		for (int j = 0; j + i < n; j += cycleLen) { //每次加一个周期
			ret.append(s.charAt(j + i));
			if (i != 0 && i != numRows - 1 && j + cycleLen - i < n) //除去第 0 行和最后一行
				ret.append(s.charAt(j + cycleLen - i));
		}
	}
	return ret.toString();
}
```

时间复杂度：O（n），虽然是两层循环，但第二次循环每次加的是 cycleLen ，无非是把每个字符遍历了 1 次，所以两层循环内执行的次数肯定是字符串的长度。

空间复杂度：O（n），保存字符串。

## 总结

这次算是总结起来最轻松的了，这道题有些找规律的意思。解法一顺着排列的方式遍历，解法二直接从答案入口找出下标的规律。