# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/19.jpg)

给定一个链表，将倒数第 n 个结点删除。

# 解法一

删除一个结点，无非是遍历链表找到那个结点前边的结点，然后改变下指向就好了。但由于它是链表，它的长度我们并不知道，我们得先遍历一遍得到它的长度，之后用长度减去 n 就是要删除的结点的位置，然后遍历到结点的前一个位置就好了。

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    int len = 0;
    ListNode h = head;
    while (h != null) {
        h = h.next;
        len++;
    }
    //长度等于 1 ，再删除一个结点就为 null 了
    if (len == 1) {
        return null;
    }

    int rm_node_index = len - n;

    //如果删除的是头结点
    if (rm_node_index == 0) {
        return head.next;
    }

    //找到被删除结点的前一个结点
    h = head;
    for (int i = 0; i < rm_node_index - 1; i++) {
        h = h.next;
    }

    //改变指向
    h.next = h.next.next;
    return head;
}
```

时间复杂度：假设链表长度是 L ，那么就第一个循环是 L 次，第二个循环是 L - n 次，总共 2L - n 次，所以时间复杂度就是 O（L）。

空间复杂度：O（1）。

我们看到如果长度等于 1 和删除头结点的时候需要单独判断，其实我们只需要在 head 前边加一个空节点，就可以避免单独判断。

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    int length  = 0;
    ListNode first = head;
    while (first != null) {
        length++;
        first = first.next;
    }
    length -= n;
    first = dummy;
    while (length > 0) {
        length--;
        first = first.next;
    }
    first.next = first.next.next;
    return dummy.next;
}
```

# 解法二 遍历一次链表

上边我们遍历链表进行了两次，我们如何只遍历一次呢。

看了 [leetcode](https://leetcode.com/problems/remove-nth-node-from-end-of-list/solution/) 的讲解。

想象一下，两个人进行 100m 赛跑，假设他们的速度相同。开始的时候，第一个人就在第二个人前边 10m ，这样当第一个人跑到终点的时候，第二个人相距第一个人依旧是 10m ，也就是离终点 10m。

对比于链表，我们设定两个指针，先让第一个指针遍历 n 步，然后再让它俩同时开始遍历，这样的话，当第一个指针到头的时候，第二个指针就离第一个指针有 n  的距离，所以第二个指针的位置就刚好是倒数第 n 个结点。

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode first = dummy;
    ListNode second = dummy;
    //第一个指针先移动 n 步
    for (int i = 1; i <= n + 1; i++) {
        first = first.next;
    } 
    //第一个指针到达终点停止遍历
    while (first != null) {
        first = first.next;
        second = second.next;
    }
    second.next = second.next.next;
    return dummy.next;
} 
```

时间复杂度：链表整个只遍历了一遍，第一个指针先到 n ，再从 n 到结束，也就是 L 次，而第二个指针和第一个指针是同时进行的。但其实时间复杂度和上一个没什么差别，本质上其实只是把两个循环合并到了一起而已，时间复杂度没有任何变化。所以是 O（L）。

空间复杂度：O（1）。

# 解法三 

没看讲解前，和室友讨论下，如何只遍历一次链表。室友给出了一个我竟然无法反驳的观点，哈哈哈哈。

第一次遍历链表确定长度的时候，顺便把每个结点存到数组里，这样找结点的时候就不需要再遍历一次了，空间换时间？？？哈哈哈哈哈哈哈哈哈。

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    List<ListNode> l = new ArrayList<ListNode>();
    ListNode h = head;
    int len = 0;
    while (h != null) {
        l.add(h);
        h = h.next;
        len++;
    }
    if (len == 1) {
        return null;
    }
    int remove = len - n;
    if (remove == 0) {
        return head.next;
    }
    //直接得到，不需要再遍历了
    ListNode r = l.get(remove - 1);
    r.next = r.next.next;
    return head;
}
```

时间复杂度：O（L）。

空间复杂度：O（L）。

# 总

利用两个指针先固定间隔，然后同时遍历，真的是很妙！另外室友的想法也很棒，哈哈哈哈哈。