# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/148.jpg)

要求时间复杂度为 `O(nlogn)`，最常用的就是归并排序了。

# 解法一

归并排序需要一个辅助方法，也就是对两个有序链表进行合并，在 [21 题](https://leetcode.wang/leetCode-21-Merge-Two-Sorted-Lists.html) 已经讨论过。

至于归并排序的思想，这里就不多讲了，本科的时候用 `Scratch` 做过一个演示视频，感兴趣的可以参考 [这里](https://zhuanlan.zhihu.com/p/71647786)，哈哈。

那就直接放代码了。因为归并排序是一半一半的进行，所以需要找到中点。最常用的方法就是快慢指针去找中点了。

```java
ListNode dummy = new ListNode(0);
dummy.next = head;
ListNode fast = dummy;
ListNode slow = dummy;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
```

上边的代码我加了一个 `dummy` 指针，就是想当节点个数是偶数的时候，让 `slow` 刚好指向前边一半节点的最后一个节点，也就是下边的状态。

```java
1    2    3    4
     ^         ^
    slow      fast
```

如果 `slow` 和 `fast` 都从 `head` 开始走，那么当 `fast` 结束的时候，`slow` 就会走到后边一半节点的开头了。

当然除了上边的方法，在 [这里](https://leetcode.com/problems/sort-list/discuss/46714/Java-merge-sort-solution) 看到，还可以加一个 `pre` 指针，让它一直指向 `slow` 的前一个即可。

```java
// step 1. cut the list to two halves
ListNode prev = null, slow = head, fast = head;

while (fast != null && fast.next != null) {
    prev = slow;
    slow = slow.next;
    fast = fast.next.next;
}
```

他们的目的都是一样的，就是为了方便的把两个链表平均分开。

```java
public ListNode sortList(ListNode head) {
    return mergeSort(head);
}

private ListNode mergeSort(ListNode head) {
    if (head == null || head.next == null) {
        return head;
    }
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy;
    ListNode slow = dummy;
    //快慢指针找中点
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    ListNode head2 = slow.next;
    slow.next = null;
    head = mergeSort(head);
    head2 = mergeSort(head2);
    return merge(head, head2);

}

private ListNode merge(ListNode head1, ListNode head2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (head1 != null && head2 != null) {
        if (head1.val < head2.val) {
            tail.next = head1;
            tail = tail.next;
            head1 = head1.next;
        } else {
            tail.next = head2;
            tail = tail.next;
            head2 = head2.next;
        }

    }
    if (head1 != null) {
        tail.next = head1;
    }

    if (head2 != null) {
        tail.next = head2;
    }

    return dummy.next;

}

```

当然严格的说，上边的解法空间复杂度并不是 `O(1)`，因为递归过程中压栈是需要消耗空间的，每次取一半，所以空间复杂度是 `O(log(n))`。

递归可以去改写成迭代的形式，也就是自底向上的走，就可以省去压栈的空间，空间复杂度从而达到 `O(1)`，详细的可以参考 [这里](https://leetcode.com/problems/sort-list/discuss/46712/Bottom-to-up(not-recurring)-with-o(1)-space-complextity-and-o(nlgn)-time-complextity) 。

# 总

和 [147 题](https://leetcode.wang/leetcode-147-Insertion-Sort-List.html) 一样，主要还是考察对链表的理解和排序算法的实现。