# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/29.jpg)

两个数相除，给出商。不能用乘法，除法和模操作。

本来觉得这道题蛮简单的，记录下自己的坎坷历程。

# 尝试1

先确定商的符号，然后把被除数和除数通通转为正数，然后用被除数不停的减除数，直到小于除数的时候，用一个计数遍历记录总共减了多少次，即为商了。

确定商的符号的时候，以及返回最终结果的时候，我们可能需要进行乘 -1 操作，即取相反数。而题目规定不让用乘法，所以我们需要知道计算机是怎么进行存数的。

计算机为了算减法，利用了同余的性质。

同余的定义是  a ≡ b ( mod m ) ，即 a mod m == b mod m ，例如 5 ≡ 17 mod ( 12 )。[百度百科](https://baike.baidu.com/item/%E5%90%8C%E4%BD%99%E5%AE%9A%E7%90%86/1212360?fromtitle=%E5%90%8C%E4%BD%99&fromid=1432545)

同余有两个性质 

反身性：a ≡ a ( mod m )；

同余式相加：若 a ≡ b ( mod m )，c ≡ d ( mod m )，则 a + c ≡ b + d ( mod m )；

现在我们进行模 16 的加法操作，先熟悉下下边的几个式子。

2 + 14 = 0

2 + （-3） = 15

5 + 15 = 4

重点来了！

计算 4 - 2 怎么算呢？

也就是 4 + （- 2）

4 ≡ 4（mod 16）

-2 ≡ 14（mod 16）

所以 4 + （- 2）= 4 + 14 = 2。

我们利用同余的性质，把减法成功转换成了加法，所以我们只需要在计算机里边将 -2 存成 8 就行了。我们这里减去 2 就等价于加上 14。

再比如 13 - 7 ，也就是 13 + （-7）

13  ≡ 13 （mod 16）

-7   ≡ 9（mod 16）

所有 13 + （- 7）= 13 + 9 = 6

我们成功把减 7 转换成了加上 9。

减 2 转换成加 14，减 7 转换成加 9，这几组数有什么联系呢？是的 2 + 14 = 16，7 + 9 = 16，他们相加通通等于 16，也就是我们取的模。有种互补的感觉，所以我们把 14 叫做 - 2 的补数，9 叫做 - 7 的补数。

可以看到，我们用一些正数表示了负数，总共有 16 个数，除去 0，还剩 15 个数，不可避免的是，这 16 个数，正数和负数的个数会相差 1，我们来看看是正数多，还是负数多。

| 补数         | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    |
| ------------ | :--- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 所代表的的数 | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 等下 |
| 补数         |      | 15   | 14   | 13   | 12   | 11   | 10   | 9    |      |
| 所代表的数   |      | -1   | -2   | -3   | -4   | -5   | -6   | -7   |      |

上边的列出的数，应该都没异议吧，那么正数多还是负数多呢？就取决于 8 代表多少了。

8 + 1 = 9 ，9 代表 -7 ，而 - 8 + 1 = - 7，所以 8 其实代表 - 8 。

所以 0 到 15 这 16 个数字可以表示的范围是 -8 ~ 7，-8 没有对称的正数。

我们再来看看计算机里是怎么存的，我们都知道，计算机中是以二进制的方式存储的。假设我们计算机能存储 4 位。范围就是 0000 到 1111，也就是 0 到 15。

| 补数       | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    |      |
| ---------- | :--- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 二进制表示 | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 |      |
| 所代表的数 | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    |      |
| 补数       |      | 15   | 14   | 13   | 12   | 11   | 10   | 9    | 8    |
| 二进制表示 |      | 1111 | 1110 | 1101 | 1100 | 1011 | 1010 | 1001 | 1000 |
| 所代表的数 |      | -1   | -2   | -3   | -4   | -5   | -6   | -7   | -8   |

我们利用这个表格，求几个例子。

2 - 3 = 2 + （-3）= 2 的补数 + - 3 的补数 = 0010 + 1101 = 1111

而看表格， 1111 代表的数就是 -1 ，从而我们用加法计算出了 2 - 3 = - 1。

-3 - 2 = （-3）+（-2）= -3 的补数 + -2 的补数 = 1101 + 1110 = 1011

我们可以看到 1101 + 1110 本来等于 1 1011 ，因为只存储 4 位，所以最高位被丢掉了，其实这就进行了取模的操作，减去了 16 。如果我们看所对应的十进制是怎么操作的， 1101 表示 13，1110 表示 14 ，13 + 14 = 27 ，如果是模 16 操作下，就是 11 ，而 11 就是上边的结果 1011，看表格它代表的数是 - 5，- 3 - 2 = - 5 ，没毛病。

而且我们发现用这种表示方式，所有的正数首位都是 0 ，负数的首位都是 1 ，这一定不是巧合。按我的理解，因为我们要保证正数和他的相反数相加等于 0000 ，如果首位是相同的，那么该位相加一定会是 0 （0 + 0 = 0，1 + 1 = 0，因为高位被丢掉了），假如 0010 的相反数是 0xxx，为了使得后三位相加等于 0 ，一定得产生进位才能实现（不产生进位，我们无法把 0010 中的 1 变成 0），如果产生了进位，那么首位就变成了 1，它的和就变成了 1000 ，不是 0000，产生矛盾。所以正数和负数的首位一定相反，我们可以把它看做符号位。即首位是 0 就是正数，首位是 1 就是负数。

接下来的问题，给出一个数我们总不能查表去看它的补码吧，我们如何得出补码？

对于正数，看表格，我们直接写原码就可以了，例如 7 就是 0111 。

负数呢？

我们之前讨论过，对于模 16 的话，- 2 的补码是 14，也就是 16 - 2。- 7 的补码是 9，也就是 16 - 7 = 9。

我们从二进制的方式看一下。

我们来求 - 2 的补码，用 16 - 2 = 1 0000 - 0010 = ( 1111 + 1 ) - 0010 = ( 1111 - 0010 ) + 1 = 1101 + 1 = 1110 。

为什么转换成 1111 减去一个数，因为用 1111 减去一个数，虽然是减法，但其实只要把这个数按位求反即可。也就是 0010 按位求反变成 1101，再加上 1 就是它的补码了，「按位取反，末位加 1 」这个口诀是不是很熟悉，哈哈，这就是快速求补码的法则。但我们不要忘了它的本质，其实是用模长减去它，但是计算机并不会减法，而是巧妙的转换到了取反再加 1 。

逆过程呢？如果我们知道了计算机存了个数 1110，那么它代表多少呢？首先首位是 1 ，它一定是一个负数，其次它是怎么得来的呢？往上翻，其实是用 16 - 2 =1110 得到的，我们现在是准备求 2 ，用 16 减去它就可以了，也就是 16 - 1110 = 1 0000 - 1110 = （1111 + 1）- 1110 = （1111 - 1110） + 1 = 0010。巧了，依旧是按位取反，末位加 1。而 0010 就是 2，所以 1110 就代表 - 2。

综上，其实我们就是用原来的一部分正数（其实说它是正数也无非是我们自己定义的，想起一句话，数学就像一门宗教，你要么完全相信，要么完全不信，哈哈）表示了负数，而现在为了实现减法，我们把 1xxx 的不当做正数了，把它定义为负数，是的没有负号，但开头是 1 ，我们就说它是负数，再取个名字就叫补数吧（其实就是它代表的负数离它最近的一个和它同余的数，例如 - 3，和它同余的最近的正数就是 13 了，所以 -3 的补数就是 13），再利用余数定理，以及计算机高位溢出等效于求模的性质，巧妙的用取反以及加法实现了减法。

说了这么多，回到开头的部分，怎么不用乘法，来实现求相反数呢？

求 x 的相反数，我们用 0 减去 x 就行。也就是 x 的相反数 = 0 - x = 0 + ( - x ) = -x，-x 在计算机中怎么存的呢，存的是 -x 的补码，-x 的补码怎么求？把 x 按位取反，末位加 1 。Java 中就是 ~x + 1 了，此时所存的就是 x 对应的那个负数，即它的相反数了。

3 的相反数怎么求？这求什么求呀，添个负号就行了，-3 呀！但是计算机可没我们这么智能，它只存储 01，所以我们把 -3 的补码求出来存到计算机里就可以了。  即把 3 （0011） 按位取反，末位加 1，得到 1101 就是它的补码，我们然后把 1101 存到了计算机中，我们以为它是 13 ，但我们给计算机重新定义了规则，它是补码，首位就代表了它是负数，计算机根据规则（按位取反，末位加 1 ，再添个负号）把它又还原成了我们所理解的 - 3。从而我们不进行乘法，根据我们给计算机制定的规则，实现了求相反数。

```java
public int divide(int dividend, int divisor) {
    int ans = 0;
    int sign = 1;
    if (dividend < 0) {
        sign = opposite(sign);
        dividend = opposite(dividend);
    }
    if (divisor < 0) {
        sign = opposite(sign);
        divisor = opposite(divisor);
    }
    while (divisor <= dividend) {
        ans = ans + 1;
        dividend = dividend - divisor;
    }
    return sign > 0 ? ans : opposite(ans);
}

public int opposite(int x) {
    return ~x + 1;
}
```

本来信心满满，结果 Wrong  Answer。

![](https://windliang.oss-cn-beijing.aliyuncs.com/29_2.jpg)

为什么出错了？ -1247483648 这个数有什么特殊之处吗？

我们知道 int 是用 4 个字节存储，也就是 32 位，那它表示的范围是多少呢？有多少个正数呢？除了第 1 位是 0 固定不变，其它位可以取 0 也可以 取 1，所以是 $$2^{31}$$，但这样的话还就包括了 0 ，所以还得减去 1 个数。也就是 $$2^{31}-1=2147483647$$。那负数有多少个呢，同理除了第 1 位是 1 固定不变，其它位可以取 0 也可以取 1，所以是 $$2^{31}=2147483648$$ 个负数，所以所表示的范围就是 -2147483648 到 2147483647。和之前我们讨论的是一致的，负数比正数多 1 个。

算法中，我们首先对被除数 - 2147483648 取相反数，变成了多少呢？这个不好想，那我们看之前的例子，再模 16 的基础上，最小的负数 - 8 ，取相反数变成了多少，8 的原码 1000，按位取反，末位加1，0111 + 1 = 1000，又回到了 1000，所以依旧是 -8。所以题目中的 - 2147483648 取相反数，依旧是 - 2147483648（有没有发现很神奇 - 2147483648 * - 1 依旧是 - 2147483648）。所以上边的算法中，由于被除数依旧是个负数，所以根本没有进 while 循环，所以直接返回了 0 。

# 尝试二

既然  - 2147483648 这么特殊，那我们对它单独判断吧，如果被除数是 - 2147483648，除数是 -1 ，我们就直接返回题目所要求的 2147483647 吧，并且如果除数是 1 就返回  - 2147483648。

```java
public int divide(int dividend, int divisor) {
    int ans = 0;
    int sign = 1;

    if (dividend < 0) {
        sign = opposite(sign);
        dividend = opposite(dividend);
    }
    if (divisor < 0) {
        sign = opposite(sign);
        divisor = opposite(divisor);
    }
    //单独判断一下
    if (dividend == Integer.MIN_VALUE && divisor == 1) {
        return sign > 0 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
    }
    while (divisor <= dividend) {
        ans = ans + 1;
        dividend = dividend - divisor;
    }
    return sign > 0 ? ans : opposite(ans);
}

public int opposite(int x) {
    return ~x + 1;
}
```

接着意外又发生了，这次竟然是 Time Limit Exceeded 了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/29_3.jpg)

# 尝试三

逛了逛 Discuss，由于我们每次只减 1 次除数，循环太多了，找到了[解决方案](https://leetcode.com/problems/divide-two-integers/discuss/13397/Clean-Java-solution-with-some-comment.)。

我们每次减 1 次除数，我们其实可以每次减多次。比如 10 / 1 ，之前是 10 - 1 = 9，计数器加 1 变成 1，然后 9 - 1 = 8，计数器加 1 变成 2，然后 8 - 1= 7，计数器加 1 变成 3，直至减到 0 < 1，我们结束了循环。我们其实可以翻倍减， 减完 1 ，减 2 ，再减 4 ，在减 8，当然计数器也不能只加 1 了，减数是翻倍减的，所以计数器也会一直翻倍的加。这里肯定会遇到一个问题，比如 10 - 1 = 9，9 - 2 = 7，7 - 4 = 3，3 - 8 = -5 < 1，它就走出了 while 循环。但是 3 本来还可以减 3 次 1，所以我们只要再递归就可以了。再看 3 / 1 的商，然后把之前的计数器的值加上 3 / 1 的商就够了。

```java
public int divide(int dividend, int divisor) {
    int ans = 1;
    int sign = 1;
    if (dividend < 0) {
        sign = opposite(sign);
        dividend = opposite(dividend);
    }
    if (divisor < 0) {
        sign = opposite(sign);
        divisor = opposite(divisor);
    }
    if (dividend == Integer.MIN_VALUE && divisor == 1) {
        return sign > 0 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
    }
    int origin_dividend = dividend;
    int origin_divisor = divisor; 
    //由于 ans 初始值是 1 ，所以如果被除数小于除数直接返回 0 
    if (dividend < divisor) {
        return 0;
    } 
    dividend -= divisor;
    while (divisor <= dividend) {
        ans = ans + ans;
        divisor += divisor;
        dividend -= divisor;
    }
    int a = ans + divide(origin_dividend - divisor, origin_divisor);
    return sign > 0 ? a : opposite(a);
}
public int opposite(int x) {
    return ~x + 1;
}
```

不是超时了，神奇的错误又出现了，

![](https://windliang.oss-cn-beijing.aliyuncs.com/29_4.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/29_5.jpg)

我们又看到了，-2147483648 的出现，当除数是它的时候，又出现了神奇的错误，那我们再单独判断一下除数是它，总该可以了吧，继续加上。

```java
if(divisor == Integer.MIN_VALUE){
    return 0;
}
```

其他的错误又出现了

![](https://windliang.oss-cn-beijing.aliyuncs.com/29_6.jpg)

被除数是 -2147483648 ，咦？我们之前不是考虑了吗，不不不，我们只考虑了除数是 1 和 -1 的时候，所以这个问题其实我们一直没有解决。我们必须修改算法了，我们的算法开始的部分是不管三七二十一，通通转换成正数，而出现 -2147483648 的时候，它无法转换成正数，我们怎么该解决呢？

# 解法一

虽然感觉很投机取巧，但也是最直接的方法了，既然 int 存不了，那我通通用 long 存就行了吧，最后返回的时候看看是不是 int 不能表示的 2147483648，是的话按题目要求就返回 2147483647。

```java
public int divide(int dividend, int divisor) {
    long ans = divide((long)dividend,(long)(divisor));
    long m = 2147483648L;
    if(ans == m ){
        return Integer.MAX_VALUE;
    }else{
        return (int)ans;
    }
}
public long divide(long dividend, long divisor) {
    long ans = 1;
    long sign = 1;
    if (dividend < 0) {
        sign = opposite(sign);
        dividend = opposite(dividend);
    }
    if (divisor < 0) {
        sign = opposite(sign);
        divisor = opposite(divisor);
    } 
    long origin_dividend = dividend;
    long origin_divisor = divisor;
    
    if (dividend < divisor) {
        return 0;
    } 
    
    dividend -= divisor;
    while (divisor <= dividend) {
        ans = ans + ans;
        divisor += divisor;
        dividend -= divisor;
    }
    long a = ans + divide(origin_dividend - divisor, origin_divisor);
    return sign > 0 ? a : opposite(a);
}
public long opposite(long x) {
    return ~x + 1;
}
```

时间复杂度：最坏的情况，除数是 1，如果一次一次减除数，那么我们将减 n 次，但由于每次都翻倍了，所以总共减了 log ( n ) 次，所以时间复杂度是 O（log （n））。

空间复杂度： O（1）。

# 解法二

上边的解法总归不够优雅，那么如何不用 long 呢？

负数比正数多一个，我们之前的思路是把负数变成正数，但由于最小的负数无法变成正数，所以出现了上边奇奇怪怪的问题。我们为什么不把思路转过来，把正数通通转为求负数呢？然后很多加法会变成减法，大于号随之也会变成小于号。

```java
public int divide(int dividend, int divisor) {
		int ans = -1;
		int sign = 1;
		if (dividend > 0) {
			sign = opposite(sign);
			dividend = opposite(dividend);
		}
		if (divisor > 0) {
			sign = opposite(sign);
			divisor = opposite(divisor);
		}   
		
		int origin_dividend = dividend;
		int origin_divisor = divisor;
		if (dividend > divisor) {
			return 0;
		} 
		
		dividend -= divisor;
		while (divisor >= dividend) {
			ans = ans + ans;
			divisor += divisor;
			dividend -= divisor;
		}
    	//此时我们传进的是两个负数，正常情况下，它就返回正数，但我们是在用负数累加，所以要取相反数
		int a = ans + opposite(divide(origin_dividend - divisor, origin_divisor));
		if(a == Integer.MIN_VALUE){
			if( sign > 0){
				return Integer.MAX_VALUE;
			}else{
				return Integer.MIN_VALUE;
			}
		}else{
			if(sign > 0){
				return opposite(a);
			}else{
				return a;
			}
		}
	}
	public int opposite(int x) {
		return ~x + 1;
	}
}
```

时间复杂度和空间复杂度没有变化，但是我们优雅的实现了这个算法，没有借用 long 。

# 总

这道题看起来简单，却藏了不少坑。首先，我们用一次一次减造成了超时，然后我们用递归实现了加倍加倍的减，接着由于 int 表示的数的范围不是对称的，最小的负数并不能转换为对应的相反数，所以我们将之前的算法思路完全逆过来，正数边负数，大于变小于，还是蛮有意思的。