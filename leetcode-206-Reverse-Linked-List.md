# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/206.jpg)

单链表倒置。

之前在  [第 2 题](https://leetcode.wang/leetCode-2-Add-Two-Numbers.html) 大数相加的时候已经分享过了，这里直接贴过来。

# 解法一迭代

首先看一下原链表。

![](http://windliang.oss-cn-beijing.aliyuncs.com/l0.jpg)

总共需要添加两个指针，`pre`  和 `next`。

初始化 `pre` 指向 `NULL` 。

![](http://windliang.oss-cn-beijing.aliyuncs.com/l00.jpg)

然后就是迭代的步骤，总共四步，顺序一步都不能错。

- `next` 指向 `head` 的 `next` ，防止原链表丢失

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/l1.jpg)

- `head` 的 `next` 从原来链表脱离，指向 `pre` 。

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/l2.jpg)

- `pre` 指向 `head`

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/l3.jpg)

- `head` 指向 `next`

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/l4.jpg)

一次迭代就完成了，如果再进行一次迭代就变成下边的样子。

![](http://windliang.oss-cn-beijing.aliyuncs.com/l5.jpg)

可以看到整个过程无非是把旧链表的 `head` 取下来，添加的新链表头部。代码怎么写呢？

```java
next = head -> next; //保存 head 的 next , 以防取下 head 后丢失
head -> next = pre; //将 head 从原链表取下来，添加到新链表上
pre = head;// pre 右移
head = next; // head 右移
```

接下来就是停止条件了，我们再进行一次循环。

![](http://windliang.oss-cn-beijing.aliyuncs.com/l6.jpg)

可以发现当 `head` 或者 `next`  指向 `null` 的时候，我们就可以停止了。此时将 `pre` 返回，便是逆序了的链表了。

```java
public ListNode reverseList(ListNode head) {
    if (head == null)
        return null;
    ListNode pre = null;
    ListNode next;
    while (head != null) {
        next = head.next;
        head.next = pre;
        pre = head;
        head = next;
    }
    return pre;
}
```

# 解法二递归

- 首先假设我们实现了将单链表逆序的函数，`ListNode reverseListRecursion(ListNode head)` ，传入链表头，返回逆序后的链表头。

- 接着我们确定如何把问题一步一步的化小，我们可以这样想。

  把 `head` 结点拿出来，剩下的部分我们调用函数 `reverseListRecursion` ，这样剩下的部分就逆序了，接着我们把 `head` 结点放到新链表的尾部就可以了。这就是整个递归的思想了。

  

  ![](http://windliang.oss-cn-beijing.aliyuncs.com/ll0.jpg)

  - head 结点拿出来

    ![](http://windliang.oss-cn-beijing.aliyuncs.com/ll1.jpg)

  - 剩余部分调用逆序函数 `reverseListRecursion` ，并得到了 `newhead`

    ![](http://windliang.oss-cn-beijing.aliyuncs.com/ll2.jpg)

  - 将 2 指向 1 ，1 指向 `null`，将 `newhead` 返回即可。

    ![](http://windliang.oss-cn-beijing.aliyuncs.com/ll3.jpg)

- 找到递归出口

  当然就是如果结点的个数是一个，那么逆序的话还是它本身，直接 return 就够了。怎么判断结点个数是不是一个呢？它的 `next` 等于 `null` 就说明是一个了。但如果传进来的本身就是 `null`，那么直接找它的 `next` 会报错，所以先判断传进来的是不是 `null` ，如果是，也是直接返回就可以了。

```java
public ListNode reverseList(ListNode head) {
    ListNode newHead;
    if (head == null || head.next == null) {
        return head;
    }
    newHead = reverseList(head.next); // head.next 作为剩余部分的头指针
    // head.next 代表新链表的尾，将它的 next 置为 head，就是将 head 加到末尾了。
    head.next.next = head;
    head.next = null;
    return newHead;
}
```

# 总

关于链表的题，记住更改指向的时候要保存之前的节点，不然会丢失节点。