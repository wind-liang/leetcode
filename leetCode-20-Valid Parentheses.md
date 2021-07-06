# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/20.png)

括号匹配问题。

如果只有一种括号，我们完全可以用一个计数器 count ，遍历整个字符串，遇到左括号加 1 ，遇到右括号减 1，遍历结束后，如果 count 等于 0 ，则表示全部匹配。但如果有多种括号，像  ( [ ) ] 这种情况它依旧会得到 0，所以我们需要用其他的方法。

栈！

遍历整个字符串，遇到左括号就入栈，然后遇到和栈顶对应的右括号就出栈，遍历结束后，如果栈为空，就表示全部匹配。

```java
public boolean isValid(String s) {
    Stack<Character>  brackets  = new Stack<Character>(); 
    for(int i = 0;i < s.length();i++){
        char c = s.charAt(i);
        switch(c){
            case '(':
            case '[':
            case '{':
                brackets.push(c); 
                break;
            case ')':
                if(!brackets.empty()){
                    if(brackets.peek()== '('){
                        brackets.pop();
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                break;
            case ']':
                if(!brackets.empty()){
                    if(brackets.peek()=='['){
                        brackets.pop();
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                break;
            case '}':
                if(!brackets.empty()){
                    if(brackets.peek()=='{'){
                        brackets.pop();
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }

        }
    }

    return brackets.empty();
}
```

时间复杂度：O（n）。

空间复杂度：O（n）。

# 总

如果学过数据结构，一定写过计算器，括号匹配问题一定遇到过的。