# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/150.png)

我们平常用的是中缀表达式，也就是上边 Explanation 中解释的。题目中的是逆波兰式，一个好处就是只需要运算符，不需要括号，不会产生歧义。

计算法则就是，每次找到运算符位置的前两个数字，然后进行计算。

# 解法一

学栈的时候，应该就知道这个逆波兰式了，栈的典型应用。

遇到操作数就入栈，遇到操作符就将栈顶的两个元素弹出进行操作，将结果继续入栈即可。

```java
public int evalRPN(String[] tokens) {
    Stack<String> stack = new Stack<>();
    for (String t : tokens) {
        if (isOperation(t)) {
            int a = stringToNumber(stack.pop());
            int b = stringToNumber(stack.pop());
            int ans = eval(b, a, t.charAt(0));
            stack.push(ans + "");
        } else {
            stack.push(t);
        }
    }
    return stringToNumber(stack.pop());
}

private int eval(int a, int b, char op) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
    }
    return 0;
}

private int stringToNumber(String s) {
    int sign = 1;
    int start = 0;
    if (s.charAt(0) == '-') {
        sign = -1;
        start = 1;
    }
    int res = 0;
    for (int i = start; i < s.length(); i++) {
        res = res * 10 + s.charAt(i) - '0';
    }
    return res * sign;
}

private boolean isOperation(String t) {
    return t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/");
}

```

# 总

主要就是栈的应用，比较简单。