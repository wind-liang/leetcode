# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/203.jpg)

给一个链表，删除链表中的给定值。

# 解法一

遍历一遍去找目标值，将找到的所有节点删除即可。

为了方便考虑头结点，我们加一个 `dummy` 指针，`next` 指向头结点，这个技巧在链表中经常用到。在 [19 题](https://leetcode.wang/leetCode-19-Remov-Nth-Node-From-End-of-List.html) 中应该是第一次用到。

```java
public ListNode removeElements(ListNode head, int val) {
    ListNode dummyHead = new ListNode(0);
    dummyHead.next = head;
    ListNode newHead = dummyHead;
    //newHead 始终指向要考虑的节点的前一个位置
    while (newHead.next != null) {
        ListNode next = newHead.next;
        if (next.val == val) {
            newHead.next = next.next;
        } else {
            newHead = newHead.next;
        }

    }
    return dummyHead.next;
}
```

# 解法二 递归

也可以用递归，会更好理解一些。但是递归需要压栈，需要消耗一定的空间。

```java
public ListNode removeElements(ListNode head, int val) {
    if (head == null) {
        return head;
    }
    if (head.val == val) {
        return removeElements(head.next, val);
    } else {
        head.next = removeElements(head.next, val);
        return head;
    }
}
```

# 总

主要就是对链表的删除，还有 `dummy`  指针的使用。