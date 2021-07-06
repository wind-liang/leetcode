# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/232.png)

使用栈来实现队列。

# 思路分析

[225 题](https://leetcode.wang/leetcode-225-Implement-Stack-using-Queues.html) 是使用队列来实现栈，其中介绍了两种解法，解法一通过一个临时队列来实现 `pop` 和 `peek`。解法二只修改 `push` 。下边的话，我们依旧借助之前的思想来解决这个问题。

# 解法一

通过一个临时栈，每次 `pop` 的时候将原来的元素都保存到临时栈中，只剩下最后一个元素，这个元素是第一个加入栈中的，对于队列就是第一个应该弹出的。然后再把原来的元素还原到栈中即可。

`peek` 的话是同理。

```java
class MyQueue {

    Stack<Integer> stack;

    /** Initialize your data structure here. */
    public MyQueue() {
        stack = new Stack<>();
    }

    /** Push element x to the back of queue. */
    public void push(int x) {
        stack.push(x);
    }

    /** Removes the element from in front of queue and returns that element. */
    public int pop() {
        int size = stack.size();
        //保存到临时栈中
        Stack<Integer> temp = new Stack<>();
        while (size > 0) {
            temp.push(stack.pop());
            size--;
        }
        
        int remove = temp.pop();
		
        //还原
        size = temp.size();
        while (size > 0) {
            stack.push(temp.pop());
            size--;
        }
        return remove;
    }

    /** Get the front element. */
    public int peek() {
        int size = stack.size();
        Stack<Integer> temp = new Stack<>();
        while (size > 0) {
            temp.push(stack.pop());
            size--;
        }
        int top = temp.peek();

        size = temp.size();
        while (size > 0) {
            stack.push(temp.pop());
            size--;
        }
        return top;
    }

    /** Returns whether the queue is empty. */
    public boolean empty() {
        return stack.isEmpty();
    }

}

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue obj = new MyQueue();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.peek();
 * boolean param_4 = obj.empty();
 */
```

# 解法二

我们可以像 [225 题](https://leetcode.wang/leetcode-225-Implement-Stack-using-Queues.html) 一样，只修改 `push` 函数。我们只需要每次将新来的元素放到栈底，然后将其他元素还原。

```java
class MyQueue {

    Stack<Integer> stack;

    /** Initialize your data structure here. */
    public MyQueue() {
        stack = new Stack<>();
    }

    /** Push element x to the back of queue. */
    public void push(int x) {
        Stack<Integer> temp = new Stack<>();
        int size = stack.size();
        //把原来的保存起来
        while (size > 0) {
            temp.push(stack.pop());
            size--;
        }
        //当前元素压到栈底
        stack.push(x);
        size = temp.size();
        //将原来的还原回去
        while (size > 0) {
            stack.push(temp.pop());
            size--;
        }
    }

    /** Removes the element from in front of queue and returns that element. */
    public int pop() {
        return stack.pop();
    }

    /** Get the front element. */
    public int peek() {
        return stack.peek();
    }

    /** Returns whether the queue is empty. */
    public boolean empty() {
        return stack.isEmpty();
    }
}
/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue obj = new MyQueue();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.peek();
 * boolean param_4 = obj.empty();
 */
```

# 解法三

上边两种解法都是使用了临时栈，先弹出再还原，每个元素会遍历两次。

参考 [这里](https://leetcode.com/problems/implement-queue-using-stacks/discuss/64206/Short-O(1)-amortized-C%2B%2B-Java-Ruby) ，我们使用两个栈，一个栈输入，一个栈输出。当需要查看或者出队的时候，我们就将输入栈元素依次放入到输出栈中，此时的输出栈的输出顺序刚好和队列是相符的。

这样的话，每个元素只会遍历一次了。

可以看一下代码。

```java
class MyQueue {

    Stack<Integer> input = new Stack();
    Stack<Integer> output = new Stack();

    public void push(int x) {
        input.push(x);
    }

    public int pop() {
        peek();
        return output.pop();
    }

    public int peek() {
        if (output.empty())
            while (!input.empty())
                output.push(input.pop());
        return output.peek();
    }

    public boolean empty() {
        return input.empty() && output.empty();
    }
}
```

# 总

解法一和解法二的话是完全按照 [225 题](https://leetcode.wang/leetcode-225-Implement-Stack-using-Queues.html)  的思想，解法三的话，相对解法一和解法二相对要好一些。