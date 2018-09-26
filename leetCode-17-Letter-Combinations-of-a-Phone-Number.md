# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/17.jpg)

给一串数字，每个数可以代表数字键下的几个字母，返回这些数字下的字母的所有组成可能。

# 解法一  定义相乘

自己想了用迭代，用递归，都理不清楚，灵机一动，想出了这个算法。

把字符串 "23" 看成 ["a","b",c] * ["d","e","f"] ，而相乘就用两个 for 循环实现即可，看代码应该就明白了。

```java
public List<String> letterCombinations(String digits) {
    List<String> ans = new ArrayList<String>();
    for (int i = 0; i < digits.length(); i++) {
        ans = mul(ans, getList(digits.charAt(i) - '0'));
    }
    return ans;

}

public List<String> getList(int digit) {
		String digitLetter[] = { "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz" };
		List<String> ans = new ArrayList<String>();
		for (int i = 0; i < digitLetter[digit].length(); i++) {
			ans.add(digitLetter[digit].charAt(i) + "");
		}
  		return ans;
	}
//定义成两个 List 相乘
public List<String> mul(List<String> l1, List<String> l2) {
    if (l1.size() != 0 && l2.size() == 0) {
        return l1;
    }
    if (l1.size() == 0 && l2.size() != 0) {
        return l2;
    }
    List<String> ans = new ArrayList<String>();
    for (int i = 0; i < l1.size(); i++)
        for (int j = 0; j < l2.size(); j++) {
            ans.add(l1.get(i) + l2.get(j));
        }
    return ans;
}
```



# 解法二 队列迭代

参考[这里](https://leetcode.com/problems/letter-combinations-of-a-phone-number/discuss/8064/My-java-solution-with-FIFO-queue)，果然有人用迭代写了出来。主要用到了队列。

```java
public List<String> letterCombinations(String digits) {
		LinkedList<String> ans = new LinkedList<String>();
		if(digits.isEmpty()) return ans;
		String[] mapping = new String[] {"0", "1", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
		ans.add("");
		for(int i =0; i<digits.length();i++){
			int x = Character.getNumericValue(digits.charAt(i));
			while(ans.peek().length()==i){ //查看队首元素
				String t = ans.remove(); //队首元素出队
				for(char s : mapping[x].toCharArray())
					ans.add(t+s);
			}
		}
		return ans;
	}
```

假如是 "23" ，那么

第 1 次 for 循环结束后变为 a, b, c；

第 2 次 for 循环的第 1 次 while 循环 a 出队，分别加上 d e f 然后入队，就变成 b c ad ae af

第 2 次 for 循环的第 2 次 while 循环 b 出队，分别加上 d e f 然后入队，就变成 c ad ae af bd be bf

第 2 次 for 循环的第 3 次 while 循环 c 出队，分别加上 d e f 然后入队，就变成 ad ae af bd be bf cd ce cf

这样的话队列的元素长度再也没有等于 1 的了就出了 while 循环。

# 解法三 递归

参考[这里](https://leetcode.com/problems/letter-combinations-of-a-phone-number/discuss/8097/My-iterative-sollution-very-simple-under-15-lines)

```java
private static final String[] KEYS = { "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz" };

public List<String> letterCombinations(String digits) {
    if(digits.equals("")) {
        return new ArrayList<String>();
    }
    List<String> ret = new LinkedList<String>();
    combination("", digits, 0, ret);
    return ret;
}

private void combination(String prefix, String digits, int offset, List<String> ret) {
    //offset 代表在加哪个数字
    if (offset == digits.length()) {
        ret.add(prefix);
        return;
    }
    String letters = KEYS[(digits.charAt(offset) - '0')];
    for (int i = 0; i < letters.length(); i++) {
        combination(prefix + letters.charAt(i), digits, offset + 1, ret);
    }
}

```

![](https://windliang.oss-cn-beijing.aliyuncs.com/17_2.jpg)

从 a 开始 ，然后递归到 d ，然后 g ，就把 adg 加入，然后再加入 adh，再加入 adi ... 从左到右，递归到底之后就将其加入。

# 总

这种题的时间复杂度和空间复杂度自己理的不太清楚就没有写了。