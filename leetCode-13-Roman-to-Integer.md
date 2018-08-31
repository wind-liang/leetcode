# 题目描述（简单难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/13_1.jpg)

和上一道题相反，将罗马数字转换成阿拉伯数字。

# 解法一

先来一种不优雅的，也就是我开始的想法。就是遍历字符串，然后转换就可以，但同时得考虑 IV，IX 那些特殊情况。

```java
public int getInt(char r) {
		int ans = 0;
		switch (r) {
		case 'I':
			ans = 1;
			break;
		case 'V':
			ans = 5;
			break;
		case 'X':
			ans = 10;
			break;
		case 'L':
			ans = 50;
			break;
		case 'C':
			ans = 100;
			break;
		case 'D':
			ans = 500;
			break;
		case 'M':
			ans = 1000;
		}
		return ans;
	}

	public int getInt(char r, char r_after) {
		int ans = 0;
		switch (r) {
		case 'I':
			ans = 1;
			break;
		case 'V':
			ans = 5;
			break;
		case 'X':
			ans = 10;
			break;
		case 'L':
			ans = 50;
			break;
		case 'C':
			ans = 100;
			break;
		case 'D':
			ans = 500;
			break;
		case 'M':
			ans = 1000;
			break;
		}
		if (r == 'I') {
			switch (r_after) {
			case 'V':
				ans = 4;
				break;
			case 'X':
				ans = 9;
			}
		}
		if (r == 'X') {
			switch (r_after) {
			case 'L':
				ans = 40;
				break;
			case 'C':
				ans = 90;
			}
		}
		if (r == 'C') {
			switch (r_after) {
			case 'D':
				ans = 400;
				break;
			case 'M':
				ans = 900;
			}
		}
		return ans;

	}

	public boolean isGetTwoInt(char r, char r_after) {
		if (r == 'I') {
			switch (r_after) {
			case 'V':
				return true;
			case 'X':
				return true;
			}
		}
		if (r == 'X') {
			switch (r_after) {
			case 'L':
				return true;
			case 'C':
				return true;
			}
		}
		if (r == 'C') {
			switch (r_after) {
			case 'D':
				return true;
			case 'M':
				return true;
			}
		}
		return false;

	}

	public int romanToInt(String s) {
		int ans = 0;
		for (int i = 0; i < s.length() - 1; i++) {
			ans += getInt(s.charAt(i), s.charAt(i + 1));
            //判断是否是两个字符的特殊情况
			if (isGetTwoInt(s.charAt(i), s.charAt(i + 1))) {
				i++;
			}
		}
        //将最后一个字符单独判断，如果放到上边的循环会越界
		if (!(s.length() >= 2 && isGetTwoInt(s.charAt(s.length() - 2), s.charAt(s.length() - 1)))) {
			ans += getInt(s.charAt(s.length() - 1));
		}

		return ans;
	}
```

时间复杂度：O（n），n 是字符串的长度。

空间复杂度：O（1）。

下边分享一些优雅的。

# 解法二

https://leetcode.com/problems/roman-to-integer/description/

```java
public int romanToInt(String s) {
     int sum=0;
    if(s.indexOf("IV")!=-1){sum-=2;}
    if(s.indexOf("IX")!=-1){sum-=2;}
    if(s.indexOf("XL")!=-1){sum-=20;}
    if(s.indexOf("XC")!=-1){sum-=20;}
    if(s.indexOf("CD")!=-1){sum-=200;}
    if(s.indexOf("CM")!=-1){sum-=200;}
    
    char c[]=s.toCharArray();
    int count=0;
    
   for(;count<=s.length()-1;count++){
       if(c[count]=='M') sum+=1000;
       if(c[count]=='D') sum+=500;
       if(c[count]=='C') sum+=100;
       if(c[count]=='L') sum+=50;
       if(c[count]=='X') sum+=10;
       if(c[count]=='V') sum+=5;
       if(c[count]=='I') sum+=1;
       
   }
   
   return sum;
    
}
```

把出现的特殊情况，提前减了就可以。

时间复杂度：O（1）。

空间复杂度：O（1）。

# 解法三

https://leetcode.com/problems/roman-to-integer/discuss/6509/7ms-solution-in-Java.-easy-to-understand

利用到罗马数字的规则，一般情况是表示数字大的字母在前，数字小的字母在后，如果不是这样，就说明出现了特殊情况，此时应该做减法。

```java
 private int getVal(char c){
        switch (c){
            case 'M':
                return 1000;
            case 'D':
                return 500;
            case 'C':
                return 100;
            case 'L':
                return 50;
            case 'X' :
                return 10;
            case 'V':
                return 5;
            case 'I':
                return 1;
        }
        throw new IllegalArgumentException("unsupported character");
    }
    
    public int romanToInt(String s) {
        int res = 0;
        if(s.length() == 0) return res;
        for (int i = 0; i < s.length() - 1; i++) {
            int cur = getVal(s.charAt(i));
            int nex = getVal(s.charAt(i+1));
            if(cur < nex){
                res -= cur;
            }else{
                res += cur;
            }
        }
        return res + getVal(s.charAt(s.length()-1));
    }
```

时间复杂度：O（1）。

空间复杂度：O（1）。

# 总

这道题也不难，自己一开始没有充分利用罗马数字的特点，而是用一些 if，switch 语句判断是否是特殊情况，看起来就很繁琐了。