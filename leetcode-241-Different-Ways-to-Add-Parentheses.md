# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/241.png)

给一个表达式加括号，得到所有不同情况的解。

# 解法一 递归

一看到题就觉得有点复杂，可以考虑一下递归的方式，去寻找子问题和原问题解的关系。

可以通过运算符把整个式子分成两部分，两部分再利用递归解决。

以 `2 * 3 - 4 * 5` 为例。

`2` 和 `3 - 4 * 5` 两部分，中间是 `*` 号相连。

`2 * 3` 和 `4 * 5` 两部分，中间是 `-` 号相连。

`2 * 3 - 4` 和 ` 5` 两部分，中间是 `*` 号相连。

有了两部分的结果，然后再通过中间的符号两两计算加入到最终的结果中即可。

比如第一种情况，`2` 和 `3 - 4 * 5` 两部分，中间是 `*` 号相连。

`2` 的解就是 `[2]`，`3 - 4 * 5` 的解就是 `[-5, -17]`。

把两部分解通过 `*` 号计算，最终结果就是 `[-10, -34]`。

另外两种情况也类似。

然后还需要递归出口。

如果给定的字符串只有数字，没有运算符，那结果就是给定的字符串转为数字。

比如上边的第一种情况，`2` 的解就是 `[2]`。

```java
public List<Integer> diffWaysToCompute(String input) {
    if (input.length() == 0) {
        return new ArrayList<>();
    }
    List<Integer> result = new ArrayList<>();
    int num = 0;
    //考虑是全数字的情况
    int index = 0;
    while (index < input.length() && !isOperation(input.charAt(index))) {
        num = num * 10 + input.charAt(index) - '0';
        index++;
    }
    //将全数字的情况直接返回
    if (index == input.length()) {
        result.add(num);
        return result;
    }
    
    for (int i = 0; i < input.length(); i++) {
        //通过运算符将字符串分成两部分
        if (isOperation(input.charAt(i))) {
            List<Integer> result1 = diffWaysToCompute(input.substring(0, i));
            List<Integer> result2 = diffWaysToCompute(input.substring(i + 1));
            //将两个结果依次运算
            for (int j = 0; j < result1.size(); j++) {
                for (int k = 0; k < result2.size(); k++) {
                    char op = input.charAt(i);
                    result.add(caculate(result1.get(j), op, result2.get(k)));
                }
            }
        }
    }
    return result;
}

private int caculate(int num1, char c, int num2) {
    switch (c) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
    }
    return -1;
}

private boolean isOperation(char c) {
    return c == '+' || c == '-' || c == '*';
}
```

由于递归是两个分支，所以会有一些的解进行了重复计算，我们可以通过 `memoization` 技术，前边很多题都用过了，一种空间换时间的方法。

将递归过程中的解保存起来，如果第二次递归过来，直接返回结果即可，无需重复递归。

将解通过 `map` 存储，其中，`key` 存储函数入口参数的字符串，`value` 存储当前全部解的一个 `List` 。

```java
//添加一个 map
HashMap<String,List<Integer>> map = new HashMap<>();
public List<Integer> diffWaysToCompute(String input) {
    if (input.length() == 0) {
        return new ArrayList<>();
    }
    //如果已经有当前解了，直接返回
    if(map.containsKey(input)){
        return map.get(input);
    }
    List<Integer> result = new ArrayList<>();
    int num = 0;
    int index = 0;
    while (index < input.length() && !isOperation(input.charAt(index))) {
        num = num * 10 + input.charAt(index) - '0';
        index++;
    }
    if (index == input.length()) {
        result.add(num);
        //存到 map
        map.put(input, result);
        return result;
    }
    for (int i = 0; i < input.length(); i++) {
        if (isOperation(input.charAt(i))) {
            List<Integer> result1 = diffWaysToCompute(input.substring(0, i));
            List<Integer> result2 = diffWaysToCompute(input.substring(i + 1));
            for (int j = 0; j < result1.size(); j++) {
                for (int k = 0; k < result2.size(); k++) {
                    char op = input.charAt(i);
                    result.add(caculate(result1.get(j), op, result2.get(k)));
                }
            }
        }
    }
     //存到 map
    map.put(input, result);
    return result;
}

private int caculate(int num1, char c, int num2) {
    switch (c) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
    }
    return -1;
}

private boolean isOperation(char c) {
    return c == '+' || c == '-' || c == '*';
}
```

# 解法二 动态规划

按理说写完递归、 写完 `memoization` ，接下来动态规划也能顺理成章的写出来了，比如经典的 [爬楼梯](https://leetcode.wang/leetCode-70-Climbing-Stairs.html) 问题。但这个如果什么都不处理，`dp` 数组的含义比较难定义，分享一下 [这里](https://leetcode.com/problems/different-ways-to-add-parentheses/discuss/66351/C%2B%2B-solution-using-dp-easy-understanding) 的处理吧。

最巧妙的地方就是做一个预处理，把每个数字提前转为 `int` 然后存起来，同时把运算符也都存起来。

这样的话我们就有了两个 `list`，一个保存了所有数字，一个保存了所有运算符。

```java
2 * 3 - 4 * 5
存起来的数字是 numList = [2 3 4 5]，
存起来的运算符是 opList = [*, -, *]。
```

`dp[i][j]` 也比较好定义了，含义是第 `i` 到第 `j` 个数字（从 `0` 开始计数）范围内的表达式的所有解。

```java
举个例子，2 * 3 - 4 * 5 
dp[1][3] 就代表第一个数字 3 到第三个数字 5 范围内的表达式 3 - 4 * 5 的所有解。
```

初始条件的话，也很简单了，就是范围内只有一个数字。

```java
2 * 3 - 4 * 5 
dp[0][0] = [2]，dp[1][1] = [3]，dp[2][2] = [4]，dp[3][3] = [5]。
```

有了一个数字的所有解，然后两个数字的所有解就可以求出来。

有了两个数字的所有解，然后三个数字的所有解就和解法一求法一样。

把三个数字分成两部分，将两部分的解两两组合起来即可。

两部分之间的运算符的话，因为表达式是一个数字一个运算符，所以运算符的下标就是左部分最后一个数字的下标。
看下边的例子。

```java
2 * 3 - 4 * 5
存起来的数字是 numList = [2 3 4 5]，
存起来的运算符是 opList = [*, -, *]。

假设我们求 dp[1][3]
也就是计算 3 - 4 * 5 的解
分成 3 和 4 * 5 两部分，3 对应的下标是 1 ，对应的运算符就是 opList[1] = '-' 。
也就是计算 3 - 20 = -17
    
分成 3 - 4 和 5 两部分，4 的下标是 2 ，对应的运算符就是 opList[2] = '*'。
也就是计算 -1 * 5 = -5
    
所以 dp[1][3] = [-17 -5]

```

四个、五个... 都可以分成两部分，然后通过之前的解求出来。

直到包含了所有数字的解求出来，假设数字总个数是 `n`，`dp[0][n-1]` 就是最后返回的了。

```java
public List<Integer> diffWaysToCompute(String input) {
    List<Integer> numList = new ArrayList<>();
    List<Character> opList = new ArrayList<>();
    char[] array = input.toCharArray();
    int num = 0;
    for (int i = 0; i < array.length; i++) {
        if (isOperation(array[i])) {
            numList.add(num);
            num = 0;
            opList.add(array[i]);
            continue;
        }
        num = num * 10 + array[i] - '0';
    }
    numList.add(num);
    int N = numList.size(); // 数字的个数

    // 一个数字
    ArrayList<Integer>[][] dp = (ArrayList<Integer>[][]) new ArrayList[N][N];
    for (int i = 0; i < N; i++) {
        ArrayList<Integer> result = new ArrayList<>();
        result.add(numList.get(i));
        dp[i][i] = result;
    }
    // 2 个数字到 N 个数字
    for (int n = 2; n <= N; n++) {
        // 开始下标
        for (int i = 0; i < N; i++) {
            // 结束下标
            int j = i + n - 1;
            if (j >= N) {
                break;
            }
            ArrayList<Integer> result = new ArrayList<>();
            // 分成 i ~ s 和 s+1 ~ j 两部分
            for (int s = i; s < j; s++) {
                ArrayList<Integer> result1 = dp[i][s];
                ArrayList<Integer> result2 = dp[s + 1][j];
                for (int x = 0; x < result1.size(); x++) {
                    for (int y = 0; y < result2.size(); y++) {
                        // 第 s 个数字下标对应是第 s 个运算符
                        char op = opList.get(s);
                        result.add(caculate(result1.get(x), op, result2.get(y)));
                    }
                }
            }
            dp[i][j] = result;

        }
    }
    return dp[0][N-1];
}

private int caculate(int num1, char c, int num2) {
    switch (c) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
    }
    return -1;
}

private boolean isOperation(char c) {
    return c == '+' || c == '-' || c == '*';
}
```

# 总

解法一的话是比较直觉的方法，用递归可以将问题简化。

解法二的话，关键就在于字符串的预处理，将数字和运算符分别存起来，很巧妙。然后就能很明确的定义出 `dp` 的含义，代码就比较容易写出来了。

