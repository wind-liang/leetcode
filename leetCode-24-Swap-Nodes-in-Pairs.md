# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/24.jpg)



给定一个链表，然后两两交换链表的位置。

# 解法一 迭代

首先为了避免单独讨论头结点的情况，一般先申请一个空结点指向头结点，然后再用一个指针来遍历整个链表。

先来看一下图示：

![](https://windliang.oss-cn-beijing.aliyuncs.com/24_2.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/24_3.jpg)



![](https://windliang.oss-cn-beijing.aliyuncs.com/24_4.jpg)



![](https://windliang.oss-cn-beijing.aliyuncs.com/24_5.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/24_6.jpg)

point 是两个要交换结点前边的一个位置。

```java
public ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode point = dummy;
    while (point.next != null && point.next.next != null) { 
        ListNode swap1 = point.next;
        ListNode swap2 = point.next.next;
        point.next = swap2;
        swap1.next = swap2.next;
        swap2.next = swap1;
        point = swap1;
    }
    return dummy.next;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二 递归

参考[这里](https://leetcode.com/problems/swap-nodes-in-pairs/discuss/11030/My-accepted-java-code.-used-recursion.)。

自己画了个参考图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/24_7.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/24_8.jpg)

```java
public ListNode swapPairs(ListNode head) {
    if ((head == null)||(head.next == null))
        return head;
    ListNode n = head.next;
    head.next = swapPairs(head.next.next);
    n.next = head;
    return n;
}
```

 递归时间复杂度留坑。

# 总

自己开始没有想出递归的算法，每次都会被递归的简洁吸引。另外，感觉链表的一些题，只要画图打打草稿，搞清指向关系，一般不难。







