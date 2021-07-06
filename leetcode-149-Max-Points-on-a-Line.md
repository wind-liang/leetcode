# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/149.jpg)

平面上有很多点，找出经过某一条直线最多有多少个点。

# 解法一 暴力破解

两点确定一条直线，最简单的方式考虑任意两点组成一条直线，然后判断其他点在不在这条直线上。

两点确定一条直线，直线方程可以表示成下边的样子。

$$\frac{y_2-y_1}{x_2-x_1}=\frac{y-y_2}{x-x_2}$$

所以当来了一个点 `(x,y)` 的时候，理论上，我们只需要代入到上边的方程进行判断即可。

但是在计算机中，算上边的除法的时候，结果可能是小数，计算机中用浮点数存储，但小数并不能精确表示，可以参考这篇 [浮点数](https://zhuanlan.zhihu.com/p/75581822) 的讲解。所以我们不能直接去判断等式两边是否相等。

第一个想法是，等式两边分子乘分母，转换为乘法的形式。

$$(y_2-y_1)*(x-x_2)=(y-y_2)*(x_2-x_1)$$

所以我们可以写一个 `test` 函数来判断点 `(x,y)` 是否在由点 `(x1,y1)` 和 `(x2,y2)` 组成的直线上。

```java
private boolean test(int x1, int y1, int x2, int y2, int x, int y) {
	return (y2 - y1) * (x - x2) == (y - y2) * (x2 - x1);
}
```

上边看起来没问题，但如果乘积过大的话就可能造成溢出，从而产生问题。

最直接的解决方案就是不用 `int` 存，改用 `long` 存，可以暂时解决上边的问题。

```java
private boolean test(int x1, int y1, int x2, int y2, int x, int y) {
	return (long)(y2 - y1) * (x - x2) == (long)(y - y2) * (x2 - x1);
}
```

但如果数据过大，依旧可能造成溢出，再直接的方法就是用 `java` 提供的 `BigInteger` 类处理。记得 `import java.math.BigInteger;`。

```java
private boolean test(int x1, int y1, int x2, int y2, int x, int y) {        
    BigInteger x11 = BigInteger.valueOf(x1);
    BigInteger x22 = BigInteger.valueOf(x2);
    BigInteger y11 = BigInteger.valueOf(y1);
   	BigInteger y22 = BigInteger.valueOf(y2);
    BigInteger x0 = BigInteger.valueOf(x);
    BigInteger y0 = BigInteger.valueOf(y);
    return y22.subtract(y11).multiply(x0.subtract(x22)).equals(y0.subtract(y22).multiply(x22.subtract(x11)));
}
```

此外，还有一个方案。

对于下边的等式，

$$\frac{y_2-y_1}{x_2-x_1}=\frac{y-y_2}{x-x_2}$$

还可以理解成判断两个分数相等，回到数学上，我们只需要将两个分数约分到最简，然后分别判断分子和分母是否相等即可。

所以，我们需要求分子和分母的最大公约数，直接用辗转相除法即可。

```java
private int gcd(int a, int b) {
    while (b != 0) {
        int temp = a % b;
        a = b;
        b = temp;
    }
    return a;
}
```

然后 `test` 函数就可以写成下边的样子。需要注意的是，我们求了`y - y2` 和 `x - x2` 最大公约数，所以要保证他俩都不是 `0` ，防止除零错误。

```java
private boolean test(int x1, int y1, int x2, int y2, int x, int y) {
    int g1 = gcd(y2 - y1, x2 - x1);
    if(y == y2 && x == x2){
        return true;
    }
    int g2 = gcd(y - y2, x - x2);
    return (y2 - y1) / g1 == (y - y2) / g2 && (x2 - x1) / g1 == (x - x2) / g2;
}
```

有了 `test` 函数，接下来，我们只需要三层遍历。前两层遍历选择两个点的所有组合构成一条直线，第三层遍历其他所有点，来判断当前点在不在之前两个点组成的直线上。

需要注意的是，因为我们两点组成一条直线，必须保证这两个点不重合。所以我们进入第三层循环之前，如果两个点相等就可以直接跳过。

```java
if (points[i][0] == points[j][0] && points[i][1] == points[j][1]) {
    continue;
}
```

此外，我们还需要考虑所有点都相等的情况，这样就可以看做所有点都在一条直线上。

```java
int i = 0;
for (; i < points.length - 1; i++) {
    if (points[i][0] != points[i + 1][0] || points[i][1] != points[i + 1][1]) {
        break;
    }
}
if (i == points.length - 1) {
    return points.length;
}
```

还有就是点的数量只有两个，或者一个，零个的时候，直接返回点的数量即可。

```java
if (points.length < 3) {
    return points.length;
}
```

综上所述，代码就出来了，其中 `test` 函数有三种写法。

```java
public int maxPoints(int[][] points) {
    if (points.length < 3) {
        return points.length;
    }
    int i = 0;
    for (; i < points.length - 1; i++) {
        if (points[i][0] != points[i + 1][0] || points[i][1] != points[i + 1][1]) {
            break;
        }

    }
    if (i == points.length - 1) {
        return points.length;
    }
    int max = 0;
    for (i = 0; i < points.length; i++) {
        for (int j = i + 1; j < points.length; j++) {
            if (points[i][0] == points[j][0] && points[i][1] == points[j][1]) {
                continue;
            }
            int tempMax = 0;
            for (int k = 0; k < points.length; k++) {
                if (k != i && k != j) {
                    if (test(points[i][0], points[i][1], points[j][0], points[j][1], points[k][0], points[k][1])) {
                        tempMax++;
                    }
                }

            }
            if (tempMax > max) {
                max = tempMax;
            }
        }
    }
    //加上直线本身的两个点
    return max + 2;
}
/*private boolean test(int x1, int y1, int x2, int y2, int x, int y) {
	return (long)(y2 - y1) * (x - x2) == (long)(y - y2) * (x2 - x1);
}*/

/*private boolean test(int x1, int y1, int x2, int y2, int x, int y) {        
    BigInteger x11 = BigInteger.valueOf(x1);
    BigInteger x22 = BigInteger.valueOf(x2);
    BigInteger y11 = BigInteger.valueOf(y1);
   	BigInteger y22 = BigInteger.valueOf(y2);
    BigInteger x0 = BigInteger.valueOf(x);
    BigInteger y0 = BigInteger.valueOf(y);
    return y22.subtract(y11).multiply(x0.subtract(x22)).equals(y0.subtract(y22).multiply(x22.subtract(x11)));
}*/

private boolean test(int x1, int y1, int x2, int y2, int x, int y) {
    int g1 = gcd(y2 - y1, x2 - x1);
    if(y == y2 && x == x2){
        return true;
    }
    int g2 = gcd(y - y2, x - x2);
    return (y2 - y1) / g1 == (y - y2) / g2 && (x2 - x1) / g1 == (x - x2) / g2;
}

private int gcd(int a, int b) {
    while (b != 0) {
        int temp = a % b;
        a = b;
        b = temp;
    }
    return a;
}
```

# 解法二

解法一很暴力，我们考虑在其基础上进行优化。

注意到，如果是下边的情况。

![](https://windliang.oss-cn-beijing.aliyuncs.com/149_2.jpg)

对于解法一的算法，我们会经过下边的流程。

我们先考虑 `1,2` 组成的直线，看 `3,4,5,6`在不在 `1,2` 的直线上。

再考虑 `1,3` 组成的直线，看 `2,4,5,6`在不在 `1,3` 的直线上。

再考虑 `1,4` 组成的直线，看 `2,3,5,6`在不在 `1,4` 的直线上。

....

上边的问题很明显了，对于 `1,2`，`1,3 `，`1,4`  ... 组成的直线，其实是同一条，我们只需要判断一次就可以了。

所以我们需要做的是，怎么保证在判断完 `1,2` 构成的直线后，把 `1,3`，`1,4`... 这些在 `1,2` 直线上的点直接跳过。

回到数学上，给定两个点可以唯一的确定一条直线，表达式为 `y = kx + b`。

对于 `1,2`，`1,3 `，`1,4` 这些点求出来的表达式都是唯一确定的。

所以我们当考虑 `1,2` 两个点的时候，我们可以求出 `k` 和 `b` 把它存到 `HashSet` 中，然后当考虑 `1,3` 以及后边的点的时候，先求出 `k` 和 `b`，然后从 `HashSet` 中看是否存在即可。

当然存的时候，我们可以用一个技巧，`key` 存一个  `String` ，也就是 `k + "@" + b` 。

```java
public int maxPoints(int[][] points) {
    if(points.length < 3){
        return points.length;
    }
    int i = 0;
    //判断所有点是否都相同的特殊情况
    for (; i < points.length - 1; i++) {
        if (points[i][0] != points[i + 1][0] || points[i][1] != points[i + 1][1]) {
            break;
        }

    }
    if (i == points.length - 1) {
        return points.length;
    }
    HashSet<String> set = new HashSet<>();
    int max = 0;
    for (i = 0; i < points.length; i++) {
        for (int j = i + 1; j < points.length; j++) {
            if (points[i][0] == points[j][0] && points[i][1] == points[j][1]) {
                continue;
            }
            String key = getK(points[i][0], points[i][1], points[j][0], points[j][1])
                       + "@"
                       + getB(points[i][0], points[i][1], points[j][0], points[j][1]);
            if (set.contains(key)) {
                continue;
            }
            int tempMax = 0;
            for (int k = 0; k < points.length; k++) {
                if (k != i && k != j) {
                    if (test(points[i][0], points[i][1], points[j][0], points[j][1], points[k][0], points[k][1])) {
                        tempMax++;
                    }
                }

            }
            if (tempMax > max) {
                max = tempMax;
            }
            set.add(key);
        }
    }
    return max + 2;
}

private double getB(int x1, int y1, int x2, int y2) {
    if (y2 == y1) {
        return Double.POSITIVE_INFINITY;
    }
    return (double) (x2 - x1) * (-y1) / (y2 - y1) + x1;
}

private double getK(int x1, int y1, int x2, int y2) {
    if (x2 - x1 == 0) {
        return Double.POSITIVE_INFINITY;
    }
    return (double) (y2 - y1) / (x2 - x1);
}

private boolean test(int x1, int y1, int x2, int y2, int x, int y) {
	return (long)(y2 - y1) * (x - x2) == (long)(y - y2) * (x2 - x1);
}
```

上边的算法虽然能 `AC`，但如果严格来说其实是有问题的。还是因为之前说的浮点数的问题，计算机并不能精确表示小数。这就造成不同的直线可能会求出相同的 `k` 和 `b`。

如果要修改的话，我们可以用分数表示小数，同时必须进行约分，使得分数化成最简。

对于上边的算法，有两个变量都需要用小数表示，所以可能会复杂些，可以看一下解法三的思路。

# 解法三

解法二中，我们相当于是对直线的分类，一条直线一条直线的考虑，去求直线上的点。

[这里](https://leetcode.com/problems/max-points-on-a-line/discuss/47113/A-java-solution-with-notes) 看到另一种想法，分享一下。

灵感应该来自于直线方程的另一种表示方式，「点斜式」，换句话，一个点加一个斜率即可唯一的确定一条直线。

所以我们可以对「点」进行分类然后去求，问题转换成，经过某个点的直线，哪条直线上的点最多。

![](https://windliang.oss-cn-beijing.aliyuncs.com/149_3.jpg)

当确定一个点后，平面上的其他点都和这个点可以求出一个斜率，斜率相同的点就意味着在同一条直线上。

所以我们可以用 `HashMap` 去计数，斜率作为 `key`，然后遍历平面上的其他点，相同的 `key` 意味着在同一条直线上。

上边的思想解决了「经过某个点的直线，哪条直线上的点最多」的问题。接下来只需要换一个点，然后用同样的方法考虑完所有的点即可。

当然还有一个问题就是斜率是小数，怎么办。

之前提到过了，我们用分数去表示，求分子分母的最大公约数，然后约分，最后将 「分子 + "@" + "分母"」作为 `key` 即可。

最后还有一个细节就是，当确定某个点的时候，平面内如果有和这个重叠的点，如果按照正常的算法约分的话，会出现除 `0` 的情况，所以我们需要单独用一个变量记录重复点的个数，而重复点一定是过当前点的直线的。

```java
public int maxPoints(int[][] points) {
    if (points.length < 3) {
        return points.length;
    }
    int res = 0;
    //遍历每个点
    for (int i = 0; i < points.length; i++) {
        int duplicate = 0;
        int max = 0;//保存经过当前点的直线中，最多的点
        HashMap<String, Integer> map = new HashMap<>();
        for (int j = i + 1; j < points.length; j++) {
            //求出分子分母
            int x = points[j][0] - points[i][0];
            int y = points[j][1] - points[i][1];
            if (x == 0 && y == 0) {
                duplicate++;
                continue;

            }
            //进行约分
            int gcd = gcd(x, y);
            x = x / gcd;
            y = y / gcd;
            String key = x + "@" + y;
            map.put(key, map.getOrDefault(key, 0) + 1);
            max = Math.max(max, map.get(key));
        }
        //1 代表当前考虑的点，duplicate 代表和当前的点重复的点
        res = Math.max(res, max + duplicate + 1);
    }
    return res;
}

private int gcd(int a, int b) {
    while (b != 0) {
        int temp = a % b;
        a = b;
        b = temp;
    }
    return a;
}
```

# 总

这道题首先还是去想暴力的想法，然后去考虑重复的情况，对情况进行分类从而优化时间复杂度。同样解法三其实也是一种分类的思想，会减少很多不必要情况的讨论。





