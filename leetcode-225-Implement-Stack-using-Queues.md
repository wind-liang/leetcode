# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/225.png)

用队列实现栈的功能，队列我们只能调用  `push to back`, `peek/pop from front`, `size`, and `is empty`  的操作。

# 解法一

来一个简单粗暴的方法，粗暴到我开始怀疑我理解错了题意。

首先肯定是用 `queue` 去保存我们的数据，`push` 的话正常的加到队列。

至于 `pop` 的话，因为队列是先进先出，栈是先进后出，所以此时我们应该将队列最后一个元素出队列。我们只需要将队列中除去最后一个元素，其他元素全部出队列，剩下的最后一个就是我们要弹出的。然后把之前出了队列的元素再保存起来即可。

然后 `top`  的话和 `pop` 同理。

```java
class MyStack {

    Queue<Integer> queue;

    /** Initialize your data structure here. */
    public MyStack() {
        queue = new LinkedList<>();
    }

    /** Push element x onto stack. */
    public void push(int x) {
        queue.offer(x);
    }

    /** Removes the element on top of the stack and returns that element. */
    public int pop() {
        Queue<Integer> temp = new LinkedList<>();
        //只剩下最后一个元素
        while (queue.size() > 1) {
            temp.offer(queue.poll());
        }
        //去除最后一个元素
        int remove = queue.poll();
        //原来的元素还原
        while (!temp.isEmpty()) {
            queue.offer(temp.poll());
        }
        return remove;
    }

    /** Get the top element. */
    public int top() {
        Queue<Integer> temp = new LinkedList<>();
        while (queue.size() > 1) {
            temp.offer(queue.poll());
        }
        int top = queue.poll();
        temp.offer(top);
        while (!temp.isEmpty()) {
            queue.offer(temp.poll());
        }
        return top;
    }

    /** Returns whether the stack is empty. */
    public boolean empty() {
        return queue.isEmpty();
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack obj = new MyStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * boolean param_4 = obj.empty();
 */
```

上边代码的受到 [这里](https://leetcode.com/problems/implement-stack-using-queues/discuss/62621/One-Queue-Java-Solution) 的启发，可以稍微优化一下，去掉 `temp`。我们可以边删除边添加。

```java
class MyStack {

    Queue<Integer> queue;

    /** Initialize your data structure here. */
    public MyStack() {
        queue = new LinkedList<>();
    }

    /** Push element x onto stack. */
    public void push(int x) {
        queue.offer(x);
    }

   /** Removes the element on top of the stack and returns that element. */
	public int pop() {
		int size = queue.size();
		while (size > 1) {
			queue.offer(queue.poll());
			size--;
		}
		return queue.poll();
	}

	/** Get the top element. */
	public int top() {
		int size = queue.size();
		while (size > 1) {
			queue.offer(queue.poll());
			size--;
		}
		int top = queue.poll(); 
		queue.offer(top); 
		return top;
	}

    /** Returns whether the stack is empty. */
    public boolean empty() {
        return queue.isEmpty();
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack obj = new MyStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * boolean param_4 = obj.empty();
 */
```

# 解法二

参考 [这里](https://leetcode.com/problems/implement-stack-using-queues/discuss/62527/A-simple-C%2B%2B-solution)，一个非常巧妙优雅的方法。只针对 `push` 做特殊化处理，其他函数直接返回就可以。

每次 `push` 一个新元素之后，我们把队列中其他的元素重新排到新元素的后边。

```java
class MyStack {

    Queue<Integer> queue;

    /** Initialize your data structure here. */
    public MyStack() {
        queue = new LinkedList<>();
    }

    /** Push element x onto stack. */
    public void push(int x) {
        queue.offer(x);
        int size = queue.size();
        while (size > 1) {
            queue.offer(queue.poll());
            size--;
        }
    }

    /** Removes the element on top of the stack and returns that element. */
    public int pop() {
        return queue.poll();
    }

    /** Get the top element. */
    public int top() {
        return queue.peek();
    }

    /** Returns whether the stack is empty. */
    public boolean empty() {
        return queue.isEmpty();
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack obj = new MyStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * boolean param_4 = obj.empty();
 */
```

# 总

这道题的话最大的作用就是去理解队列和栈的特性吧，实际中没必要用队列去实现栈，何必呢。

 `leetcode`  上还有很多其他的解法，这里也就不介绍了，基本上看了作者的代码就能明白作者的想法了。解法二应该就是相对来说最完美的解法了。