# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/141.png)

判断一个链表是否有环。

# 解法一

最直接的方法，遍历链表，并且把遍历过的节点用 `HashSet` 存起来，如果遍历过程中又遇到了之前的节点就说明有环。如果到达了 `null` 就说明没有环。

```java
public boolean hasCycle(ListNode head) {
    HashSet<ListNode> set = new HashSet<>();
    while (head != null) {
        set.add(head);
        head = head.next;
        if (set.contains(head)) {
            return true;
        }
    }
    return false;
}
```

# 解法二

学数据结构课程的时候，应该都用过这个方法，很巧妙，快慢指针。

原理也很好理解，想象一下圆形跑道，两个人跑步，如果一个人跑的快，一个人跑的慢，那么不管两个人从哪个位置出发，跑的过程中两人一定会相遇。

所以这里我们用两个指针 `fast` 和 `slow`。`fast` 每次走两步，`slow` 每次走一步，如果 `fast` 到达了 `null` 就说明没有环。如果 `fast` 和 `slow` 相遇了就说明有环。

```java
public boolean hasCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null) {
        if (fast.next == null) {
            return false;
        }
        slow = slow.next;
        fast = fast.next.next;
        if (fast == slow) {
            return true;
        }
    }
    return false;
}
```

# 总

比较简单的一道题了，快慢指针的思想，也比较常用，很巧妙。