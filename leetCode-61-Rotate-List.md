# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/61.jpg)

将最后一个链表节点移到最前边，然后重复这个过程 k 次。

# 解法一

很明显我们不需要真的一个一个移，如果链表长度是 len， n =  k % len，我们只需要将末尾  n 个链表节点整体移动到最前边就可以了。可以结合下边的图看一下，我们只需要找到倒数 n + 1 个节点的指针把它指向 null，以及末尾的指针指向头结点就可以了。找倒数 n 个结点，让我想到了 [19题](https://leetcode.windliang.cc/leetCode-19-Remov-Nth-Node-From-End-of-List.html)，利用快慢指针。

![](https://windliang.oss-cn-beijing.aliyuncs.com/61_2.jpg)

```java
public ListNode rotateRight(ListNode head, int k) {
    if (head == null || k == 0) {
        return head;
    }
    int len = 0;
    ListNode h = head;
    ListNode tail = null;
    //求出链表长度，保存尾指针
    while (h != null) {
        h = h.next;
        len++;
        if (h != null) {
            tail = h;
        }
    }
    //求出需要整体移动多少个节点
    int n = k % len;
    if (n == 0) {
        return head;
    }
	
    //利用快慢指针找出倒数 n + 1 个节点的指针，用 slow 保存
    ListNode fast = head;
    while (n >= 0) {
        fast = fast.next;
        n--;
    }
    ListNode slow = head;
    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }
    //尾指针指向头结点
    tail.next = head;
    //头指针更新为倒数第 n 个节点
    head = slow.next;
    //尾指针置为 null
    slow.next = null;
    return head;
}
```

时间复杂度：O ( n ) 。

空间复杂度：O（1）。

这里我们用到的快慢指针其实没有必要，快慢指针的一个优点是，不需要知道链表长度就可以找到倒数第 n 个节点。而这个算法中，我们在之前已经求出了 len ，所以我们其实可以直接找倒数第 n + 1 个节点。

```java
ListNode slow = head;
for (int i = 1; i < len - n; i++) {
    slow = slow.next;
}
```

# 总

这道题也没有什么技巧，只要对链表很熟，把题理解了，很快就解出来了。