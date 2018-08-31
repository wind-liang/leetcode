# 题目描述（中等难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/12_1.jpg)

把数字转换成罗马数字，正常情况就是把每个字母相加，并且大字母在前，小字母在后，上边也介绍了像 4 和 9 那些特殊情况。

# 解法一

这个是自己的解法，主要思想就是每次取出一位，然后得到相应的罗马数字，然后合起来就行。

```java
public String getRoman(int num,int count){ //count 表示当前的位数，个位，十位...
    char[]ten={'I','X','C','M'}; //1,10,100,1000
    char[]five={'V','L','D'};//5,50,500
    String r="";
    if(num<=3){
        while(num!=0){
            r+=ten[count];
            num--;
        }
    }
    if(num==4){
        r=(ten[count]+"")+(five[count]+"");
    }
    if(num==5){
        r=five[count]+"";
    }
    if(num>5&&num<9){
        r=five[count]+"";
        num-=5;
        while(num!=0){
            r+=ten[count];
            num--;
        }
    }
    if(num==9){
        r = (ten[count] + "") + (ten[count + 1] + "");
    }
    return r;
}
public String intToRoman(int num) {
    String r="";
    int count=0;
    while(num!=0){
        int pop=num%10;
        r=getRoman(pop,count)+r;
        count++;
        num/=10;
    }
    return r;
}
```

时间复杂度：num 的位数 $$log_{10}(num)+1$$所以时间复杂度是 O（log（n））。

空间复杂度：常数个变量，O（1）。

下边在分享一些 LeetCode 讨论里的一些解法。

# 解法二

https://leetcode.com/problems/integer-to-roman/discuss/6310/My-java-solution-easy-to-understand

```java
public String intToRoman(int num) {
    int[] values = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
    String[] strs = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
    
    StringBuilder sb = new StringBuilder();
    
    for(int i=0;i<values.length;i++) {
        while(num >= values[i]) {
            num -= values[i];
            sb.append(strs[i]);
        }
    }
    return sb.toString();
}
```

相当简洁了，主要就是把所有的组合列出来，因为罗马数字表示的大小就是把所有字母相加，所以每次 append 那个，再把对应的值减去就行了。

时间复杂度：不是很清楚，也许是 O（1）？因为似乎和问题规模没什么关系了。

空间复杂度：O（1）.

# 解法三

https://leetcode.com/problems/integer-to-roman/discuss/6376/Simple-JAVA-solution

```java
public String intToRoman(int num) {
    String M[] = {"", "M", "MM", "MMM"};//0,1000,2000,3000
    String C[] = {"", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"};//0,100,200,300...
    String X[] = {"", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"};//0,10,20,30...
    String I[] = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"};//0,1,2,3...
    return M[num/1000] + C[(num%1000)/100]+ X[(num%100)/10] + I[num%10];
}
```

这就更加暴力了，把每位的情况都列出来然后直接返回，但思路清晰明了呀。

时间复杂度：O（1）或者说是 num 的位数，不是很确定。

空间复杂度：O（1）。

# 总

这道题感觉难度应该是 easy ，没有那么难，就是理清楚题意，然后就可以往出列举就行了。

