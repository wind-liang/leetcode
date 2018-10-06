# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/21.jpg)

合并两个有序链表。

# 解法一 迭代

遍历两个链表。

```java
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode h = new ListNode(0);
    ListNode ans=h;
    while (l1 != null && l2 != null) {
        if (l1.val < l2.val) {
            h.next = l1;
            h = h.next;
            l1 = l1.next;
        } else {
            h.next = l2;
            h = h.next;
            l2 = l2.next;
        }
    }
    if(l1==null){
        while(l2!=null){
            h.next=l2;
            l2=l2.next;
            h=h.next;
        }
    }
    if(l2==null){
        while(l1!=null){
            h.next=l1;
            l1=l1.next;
            h=h.next;
        }
    }
    h.next=null;
    return ans.next;
}
```

时间复杂度：O（m + n）。

空间复杂度：O（1）。

# 解法二 递归

参考[这里](Merge Two Sorted Lists)

```java
ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    if(l1 == null) return l2;
    if(l2 == null) return l1;

    if(l1.val < l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists(l2.next, l1);
        return l2;
    }
}
```

时间复杂度：

空间复杂度：

# 总

递归看起来，两个字，优雅！但是关于递归的时间复杂度，空间复杂度的求法，先留个坑吧。