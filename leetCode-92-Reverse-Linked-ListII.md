# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/92.jpg)

给定链表的一个范围，将这个范围内的链表倒置。

# 解法一

首先找到 m 的位置，记录两端的节点 left1 和 left2 。

然后每遍历一个节点，就倒置一个节点。

到 n 的位置后，利用之前的 left1 和 left2 完成连接。

为了完成链表的倒置需要两个指针 pre 和 head。为了少考虑边界条件，例如 m = 1  的倒置。加一个哨兵节点 dummy。

```java
m = 2, n = 4
    
1 2 3 4 5 加入哨兵节点 d，pre 简写 p，head 简写 h

0 1 2 3 4 5 往后遍历
^ ^
d h
p

0 1 2 3 4 5 此时 h 指向 m 的位置，记录 p 和 h 为 l1 和 l2
^ ^ ^
d p h

0  1  2 3 4 5 然后继续遍历
^  ^  ^
d  p  h
  l1  l2
 
0  1  2  3 4 5 开始倒置链表，使得 h 指向 p
^  ^  ^  ^
d  l1 p  h
     l2
```

当前状态用图形描述

![](https://windliang.oss-cn-beijing.aliyuncs.com/92_2.jpg)

倒转链表，将 h 的 next 指向 p，并且后移 p 和 h。

![](https://windliang.oss-cn-beijing.aliyuncs.com/92_3.jpg)

然后上边一步会重复多次，直到 h 到达 n 的位置。当然这道题比较特殊，上图 h 已经到达了 n 的位置。

此时，我们需要将 h 指向 p，同时将 l1 指向 h，l2 指向 h.next，使得链表接起来。

![](https://windliang.oss-cn-beijing.aliyuncs.com/92_4.jpg)

操作完成，将 dummy.next 返回即可。

```java
public ListNode reverseBetween(ListNode head, int m, int n) {
    if (m == n) {
        return head;
    }
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    int count = 0;
    ListNode left1 = null;
    ListNode left2 = null;
    ListNode pre = dummy;
    while (head != null) {
        count++;
        //到达 m，保存 l1 和 l2
        if (count == m) {
            left1 = pre;
            left2 = head;
        }
        // m 和 n 之间，倒转链表
        if (count > m && count < n) {
            ListNode temp = head.next;
            head.next = pre;
            pre = head;
            head = temp;
            continue;
        }
        //到达 n
        if (count == n) {
            left2.next = head.next;
            head.next = pre;
            left1.next = head;
            break;
        }
        //两个指针后移
        head = head.next;
        pre = pre.next;
    }
    return dummy.next;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 总

考察链表知识，如果对链表很熟悉，在纸上画一画，理清楚怎么指向，很快可以写出来。