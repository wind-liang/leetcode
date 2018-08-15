## 题目描述（中等难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/TIM%E6%88%AA%E5%9B%BE20180714105005.jpg)

就是两个链表表示的数相加，这样就可以实现两个很大的数相加了，无需考虑数值 int ，float 的限制了。



由于自己实现的很乱，直接按答案的讲解了。

## 图示

![](http://windliang.oss-cn-beijing.aliyuncs.com/2_pic.jpg)

链表最左边表示个位数，代表 342 + 465 =807 。

## 思路

首先每一位相加肯定会产生进位，我们用 carry 表示。进位最大会是 1 ，因为最大的情况是无非是 9 + 9 + 1 = 19 ，也就是两个最大的数相加，再加进位，这样最大是 19 ，不会产生进位 2 。下边是伪代码。

* 初始化一个节点的头，dummy head ，但是这个头不存储数字。并且将 curr 指向它。
* 初始化进位 carry 为 0 。
* 初始化 p 和 q 分别为给定的两个链表 l1 和 l2 的头，也就是个位。
* 循环，直到 l1 和 l2 全部到达 null 。
  * 设置 x 为 p 节点的值，如果 p 已经到达了 null，设置 x 为 0 。
  * 设置 y 为 q 节点的值，如果 q 已经到达了 null，设置 y 为 0 。
  * 设置 sum = x + y + carry 。
  * 更新 carry = sum / 10 。
  * 创建一个值为 sum mod 10 的节点，并将 curr 的 next 指向它，同时 curr 指向变为当前的新节点。
  * 向前移动 p 和 q 。
* 判断 carry 是否等于 1 ，如果等于 1 ，在链表末尾增加一个为 1 的节点。
* 返回 dummy head 的 next ，也就是个位数开始的地方。

初始化的节点 dummy head 没有存储值，最后返回 dummy head 的 next 。这样的好处是不用单独对 head 进行判断改变值。也就是如果一开始的 head 就是代表个位数，那么开始初始化的时候并不知道它的值是多少，所以还需要在进入循环前单独对它进行值的更正，不能像现在一样只用一个循环简洁。

## 代码

``` JAVA
class ListNode {
	int val;
	ListNode next;
	ListNode(int x) { val = x; }
}
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummyHead = new ListNode(0);
    ListNode p = l1, q = l2, curr = dummyHead;
    int carry = 0;
    while (p != null || q != null) {
        int x = (p != null) ? p.val : 0;
        int y = (q != null) ? q.val : 0;
        int sum = carry + x + y;
        carry = sum / 10;
        curr.next = new ListNode(sum % 10);
        curr = curr.next;
        if (p != null) p = p.next;
        if (q != null) q = q.next;
    }
    if (carry > 0) {
        curr.next = new ListNode(carry);
    }
    return dummyHead.next;
}
```

时间复杂度：O（max（m，n）），m 和 n 代表 l1 和 l2 的长度。

空间复杂度：O（max（m，n）），m 和 n 代表 l1 和 l2 的长度。而其实新的 List 最大长度是 O（max（m，n））+ 1，因为我们的 head 没有存储值。

## 扩展

![](http://windliang.oss-cn-beijing.aliyuncs.com/2_add.jpg)

如果链表存储的顺序反过来怎么办？

我首先想到的是链表先逆序计算，然后将结果再逆序呗，这就转换到我们之前的情况了。不知道还有没有其他的解法。下边分析下单链表逆序的思路。

## 迭代思想

首先看一下原链表。

![](http://windliang.oss-cn-beijing.aliyuncs.com/l0.jpg)

总共需要添加两个指针，pre  和 next。

初始化 pre 指向 NULL 。

![](http://windliang.oss-cn-beijing.aliyuncs.com/l00.jpg)

然后就是迭代的步骤，总共四步，顺序一步都不能错。

* next 指向 head 的 next ，防止原链表丢失

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/l1.jpg)

* head 的 next 从原来链表脱离，指向 pre 。

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/l2.jpg)

* pre 指向 head

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/l3.jpg)

* head 指向 next

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/l4.jpg)

一次迭代就完成了，如果再进行一次迭代就变成下边的样子。

![](http://windliang.oss-cn-beijing.aliyuncs.com/l5.jpg)

可以看到整个过程无非是把旧链表的 head 取下来，添加的新的链表上。代码怎么写呢？

```java
next = head -> next; //保存 head 的 next , 以防取下 head 后丢失
head -> next = pre; //将 head 从原链表取下来，添加到新链表上
pre = head;// pre 右移
head = next; // head 右移
```

接下来就是停止条件了，我们再进行一次循环。

![](http://windliang.oss-cn-beijing.aliyuncs.com/l6.jpg)

可以发现当 head 或者 next  指向 null 的时候，我们就可以停止了。此时将 pre 返回，便是逆序了的链表了。

## 迭代代码

```JAVA
public ListNode reverseList(ListNode head){
    	if(head==null) return null;
    	ListNode pre=null;
    	ListNode next;
    	while(head!=null){
    		next=head.next;
    		head.next=pre;
    		pre=head;
    		head=next;
    	}
    	return pre;
    }
```

## 递归思想

* 首先假设我们实现了将单链表逆序的函数，ListNode reverseListRecursion(ListNode head) ，传入链表头，返回逆序后的链表头。

* 接着我们确定如何把问题一步一步的化小，我们可以这样想。

  把 head 结点拿出来，剩下的部分我们调用函数 reverseListRecursion ，这样剩下的部分就逆序了，接着我们把 head 结点放到新链表的尾部就可以了。这就是整个递归的思想了。

  ​

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/ll0.jpg)

  * head 结点拿出来

    ![](http://windliang.oss-cn-beijing.aliyuncs.com/ll1.jpg)

  * 剩余部分调用逆序函数 reverseListRecursion ，并得到了 newhead

    ![](http://windliang.oss-cn-beijing.aliyuncs.com/ll2.jpg)

  * 将 2 指向 1 ，1 指向 null，将 newhead 返回即可。

    ![](http://windliang.oss-cn-beijing.aliyuncs.com/ll3.jpg)

* 找到递归出口

  当然就是如果结点的个数是一个，那么逆序的话还是它本身，直接 return 就够了。怎么判断结点个数是不是一个呢？它的 next 等于 null 就说明是一个了。但如果传进来的本身就是 null，那么直接找它的 next 会报错，所以先判断传进来的是不是 null ，如果是，也是直接返回就可以了。
## 代码

``` JAVA
public ListNode reverseListRecursion(ListNode head){ 
    	ListNode newHead;
    	if(head==null||head.next==null ){
    		return head;
    	}
    	newHead=reverseListRecursion(head.next); //head.next 作为剩余部分的头指针
    	head.next.next=head; //head.next 代表新链表的尾，将它的 next 置为 head，就是将 head 加到最后了。
    	head.next=null;
    	return newHead;
    }
```

