# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/155.jpg)

设计数据结构的题，设计一个栈，除了栈特有的功能，入栈、出栈、查看栈顶元素，还需要增加一个功能，得到当前栈里边最小的元素。

# 解法一

要实现一个 `stack`，那么我们还能用 `java` 自带的 `stack` 吗？也不用纠结，这道题的关键其实是实现「得到最小值这个功能」，所以为了代码简洁些，我们就直接使用系统自带的 `stack` 了。

这道题最直接的解法就是我们可以用两个栈，一个栈去保存正常的入栈出栈的值，另一个栈去存最小值，也就是用栈顶保存当前所有元素的最小值。存最小值的栈的具体操作流程如下：

将第一个元素入栈。

新加入的元素如果大于栈顶元素，那么新加入的元素就不处理。

新加入的元素如果小于等于栈顶元素，那么就将新元素入栈。

出栈元素不等于栈顶元素，不操作。

出栈元素等于栈顶元素，那么就将栈顶元素出栈。

举个例子。

```java
入栈 3 
|   |    |   |
|   |    |   |
|_3_|    |_3_|
stack  minStack

入栈 5 ， 5 大于 minStack 栈顶，不处理
|   |    |   |
| 5 |    |   |
|_3_|    |_3_|
stack  minStack

入栈 2 ，此时右边的 minStack 栈顶就保存了当前最小值 2 
| 2 |    |   |
| 5 |    | 2 |
|_3_|    |_3_|
stack  minStack

出栈 2，此时右边的 minStack 栈顶就保存了当前最小值 3
|   |    |   |
| 5 |    |   |
|_3_|    |_3_|
stack  minStack

出栈 5，右边 minStack 不处理
|   |    |   |
|   |    |   |
|_3_|    |_3_|
stack  minStack

出栈 3
|   |    |   |
|   |    |   |
|_ _|    |_ _|
stack  minStack
```

代码的话就很好写了。

```java
class MinStack {
    /** initialize your data structure here. */
    private Stack<Integer> stack;
    private Stack<Integer> minStack;

    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }

    public void push(int x) {
        stack.push(x);
        if (!minStack.isEmpty()) {
            int top = minStack.peek();
            //小于的时候才入栈
            if (x <= top) {
                minStack.push(x);
            }
        }else{
            minStack.push(x);
        }
    }

    public void pop() {
        int pop = stack.pop();

        int top = minStack.peek();
        //等于的时候再出栈
        if (pop == top) {
            minStack.pop();
        }

    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();
    }
}
```

# 解法二

解法一中用了两个栈去实现，那么我们能不能用一个栈去实现呢？

参考了  [这里](https://leetcode.com/problems/min-stack/discuss/49014/Java-accepted-solution-using-one-stack)。

解法一中单独用了一个栈去保存所有最小值，那么我们能不能只用一个变量去保存最小值呢？

再看一下上边的例子。

```java
入栈 3 
|   |   min = 3
|   |     
|_3_|    
stack   

入栈 5 
|   |   min = 3
| 5 |     
|_3_|    
stack  

入栈 2 
| 2 |   min = 2?
| 5 |     
|_3_|    
stack  
```

如果只用一个变量就会遇到一个问题，如果把 `min` 更新为 `2`，那么之前的最小值 `3` 就丢失了。

怎么把 `3` 保存起来呢？把它在 `2` 之前压入栈中即可。

```java
入栈 2 ，同时将之前的 min 值 3 入栈，再把 2 入栈，同时更新 min = 2
| 2 |   min = 2
| 3 |  
| 5 |     
|_3_|    
stack  

入栈 6 
| 6 |  min = 2
| 2 |   
| 3 |  
| 5 |     
|_3_|    
stack  

出栈 6     
| 2 |   min = 2
| 3 |  
| 5 |     
|_3_|    
stack  

出栈 2     
| 2 |   min = 2
| 3 |  
| 5 |     
|_3_|    
stack  
```

上边的最后一个状态，当出栈元素是最小元素我们该如何处理呢？

我们只需要把 `2` 出栈，然后再出栈一次，把 `3` 赋值给 `min` 即可。

```java
出栈 2     
|   |  min = 3   
| 5 |   
|_3_|    
stack  
```

通过上边的方式，我们就只需要一个栈了。当有更小的值来的时候，我们只需要把之前的最小值入栈，当前更小的值再入栈即可。当这个最小值要出栈的时候，下一个值便是之前的最小值了。

```java
class MinStack {
    int min = Integer.MAX_VALUE;
    Stack<Integer> stack = new Stack<Integer>();
    public void push(int x) {
        //当前值更小
        if(x <= min){   
            //将之前的最小值保存
            stack.push(min);
            //更新最小值
            min=x;
        }
        stack.push(x);
    }

    public void pop() {
        //如果弹出的值是最小值，那么将下一个元素更新为最小值
        if(stack.pop() == min) {
            min=stack.pop();
        }
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return min;
    }
}
```

# 解法三

参考 [这里](https://leetcode.com/problems/min-stack/discuss/49031/Share-my-Java-solution-with-ONLY-ONE-stack)，再分享利用一个栈的另一种思路。

通过解法二的分析，我们关键要解决的问题就是当有新的更小值的时候，之前的最小值该怎么办？

解法二中通过把之前的最小值入栈解决问题。

这里的话，用了另一种思路。同样是用一个 `min` 变量保存最小值。只不过栈里边我们不去保存原来的值，而是去存储入栈的值和最小值的差值。然后得到之前的最小值的话，我们就可以通过 `min` 值和栈顶元素得到，举个例子。

```java
入栈 3，存入 3 - 3 = 0
|   |   min = 3
|   |     
|_0_|    
stack   

入栈 5，存入 5 - 3 = 2
|   |   min = 3
| 2 |     
|_0_|    
stack  

入栈 2，因为出现了更小的数，所以我们会存入一个负数，这里很关键
也就是存入  2 - 3 = -1, 并且更新 min = 2 
对于之前的 min 值 3, 我们只需要用更新后的 min - 栈顶元素 -1 就可以得到    
| -1|   min = 2
| 5 |     
|_3_|    
stack  

入栈 6，存入  6 - 2 = 4
| 4 |   min = 2
| -1| 
| 5 |     
|_3_|    
stack  

出栈，返回的值就是栈顶元素 4 加上 min，就是 6
|   |   min = 2
| -1| 
| 5 |     
|_3_|    
stack  

出栈，此时栈顶元素是负数，说明之前对 min 值进行了更新。
入栈元素 - min = 栈顶元素，入栈元素其实就是当前的 min 值 2
所以更新前的 min 就等于入栈元素 2 - 栈顶元素(-1) = 3
|   | min = 3
| 5 |     
|_3_|    
stack     
```

再理一下上边的思路，我们每次存入的是 `原来值 - 当前最小值`。

当原来值大于等于当前最小值的时候，我们存入的肯定就是非负数，所以出栈的时候就是 `栈中的值 + 当前最小值` 。

当原来值小于当前最小值的时候，我们存入的肯定就是负值，此时的值我们不入栈，用 `min` 保存起来，同时将差值入栈。

当后续如果出栈元素是负数的时候，那么要出栈的元素其实就是 `min`。此外之前的 `min` 值，我们可以通过栈顶的值和当前 `min` 值进行还原，就是用 `min` 减去栈顶元素即可。

```java
public class MinStack {
    long min;
	Stack<Long> stack;

	public MinStack(){
        stack=new Stack<>();
    }

	public void push(int x) {
		if (stack.isEmpty()) {
			min = x;
			stack.push(x - min);
		} else {
			stack.push(x - min);
			if (x < min){
				min = x; // 更新最小值
			}
				
		}
	}

	public void pop() {
		if (stack.isEmpty())
			return;

		long pop = stack.pop();
		
		//弹出的是负值，要更新 min
		if (pop < 0) {
			min = min - pop;
		}

	}

	public int top() {
		long top = stack.peek();
		//负数的话，出栈的值保存在 min 中
		if (top < 0) {
			return (int) (min);
        //出栈元素加上最小值即可
		} else {
			return (int) (top + min);
		}
	}

	public int getMin() {
		return (int) min;
	}
}
```

上边的解法的一个缺点就是由于我们保存的是差值，所以可能造成溢出，所以我们用了数据范围更大的 `long` 类型。

此外相对于解法二，最小值需要更新的时候，我们并没有将之前的最小值存起来，我们每次都是通过当前最小值和栈顶元素推出了之前的最小值，所以会省一些空间。

# 解法四

再分享一个有趣的解法，参考 [这里](https://leetcode.com/problems/min-stack/discuss/49217/6ms-Java-Solution-using-Linked-List.-Clean-self-explanatory-and-efficient.) 。

回到最初的疑虑，我们要不要用 `java` 提供的 `stack` 。如果不用的话，可以怎么做的？

直接用一个链表即可实现栈的基本功能，那么最小值该怎么得到呢？我们可以在 `Node` 节点中增加一个 `min` 字段，这样的话每次加入一个节点的时候，我们同时只要确定它的 `min` 值即可。

代码很简洁，我直接把代码贴过来吧。

```java
class MinStack {
    class Node{
        int value;
        int min;
        Node next;

        Node(int x, int min){
            this.value=x;
            this.min=min;
            next = null;
        }
    }
    Node head;
    //每次加入的节点放到头部
    public void push(int x) {
        if(null==head){
            head = new Node(x,x);
        }else{
            //当前值和之前头结点的最小值较小的做为当前的 min
            Node n = new Node(x, Math.min(x,head.min));
            n.next=head;
            head=n;
        }
    }

    public void pop() {
        if(head!=null)
            head =head.next;
    }

    public int top() {
        if(head!=null)
            return head.value;
        return -1;
    }

    public int getMin() {
        if(null!=head)
            return head.min;
        return -1;
    }
}
```

# 总

虽然题目比较简单，但解法二和解法三真的让人耳目一新，一个通过存储，一个通过差值解决了「保存之前值」的问题，思路很值得借鉴。解法四更像降维打击一样，回到改底层数据结构，从而更加简洁的解决了问题。



