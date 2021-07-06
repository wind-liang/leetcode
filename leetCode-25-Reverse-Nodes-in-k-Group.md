# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/25.jpg)

将一个链表，每 k 个倒置，最后一组不足 k 个就不倒置。

# 解法一 迭代

关于单链表倒置，我们在[第 2 题](https://leetcode.windliang.cc/leetCode-2-Add-Two-Numbers.html)就讨论过。有了单链表倒置，这道题无非就是用一个循环，每次将 k 个结点取下来，倒置后再接回去，然后再取 k 个，以此循环，到了最后一组如果不足 k 个，不做处理，直接返回头结点就可以了。所以关键就是，指针指来指去，大家不晕掉就好，我做了图示，大家参考一下。

为了将头结点也一般化，我们创建一个 dummy 结点，然后整个过程主要运用三个指针， tail 指针表示已经倒置后的链表的尾部，subhead 指针表示要进行倒置的子链表，toNull 指针为了将子链表从原来链表中取下来。

![](https://windliang.oss-cn-beijing.aliyuncs.com/25_2.jpg)

一个 while 循环，让 toNull 指针走 k - 1 步使其指向子链表的尾部。中间的 if 语句就是判断当前节点数够不够 k 个了，不够的话直接返回结果就可以了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/25_3.jpg)

将子链表指向 null ，脱离出来。并且用 temp 保存下一个结点的位置。



![](https://windliang.oss-cn-beijing.aliyuncs.com/25_4.jpg)

然后调用倒置函数，将子链表倒置。

![](https://windliang.oss-cn-beijing.aliyuncs.com/25_5.jpg)

接下来四步分别是，新链表接到 tail（注意下边的图 tail 是更新后的位置，之前 tail 在 dummy 的位置） 的后边；更新 tail 到新链表的尾部，也就是之前的 subhead （下图 subhead 也是更新后的位置，之前的位置参见上边的图）；sub_head 更新到 temp 的位置；toNull 到 sub_head 的位置；然后将新的尾部 tail 把之前断开的链表连起来，接到 sub_head 上。

![](https://windliang.oss-cn-beijing.aliyuncs.com/25_6.jpg)

整理下其实就是下边的样子

![](https://windliang.oss-cn-beijing.aliyuncs.com/25_7.jpg)

和初始的时候（下边的图）对比一下，发现 tail，subhead 和 toNull 三个指针已经就位，可以愉快的重复上边的步骤了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/25_2.jpg)

看下代码吧。

```java
public ListNode reverseKGroup(ListNode head, int k) {
    if (head == null)
        return null;
    ListNode sub_head = head;
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode tail = dummy;
    ListNode toNull = head;
    while (sub_head != null) {
        int i = k;
        //找到子链表的尾部
        while (i - 1 > 0) {
            toNull = toNull.next;
            if (toNull == null) {
                return dummy.next;
            }
            i--;
        }
        ListNode temp = toNull.next;
        //将子链表断开
        toNull.next = null;
        ListNode new_sub_head = reverse(sub_head); 
        //将倒置后的链表接到 tail 后边
        tail.next = new_sub_head;
        //更新 tail 
        tail = sub_head; //sub_head 由于倒置其实是新链表的尾部
        sub_head = temp;
        toNull = sub_head;
        //将后边断开的链表接回来
        tail.next = sub_head;
    }
    return dummy.next;
}
public ListNode reverse(ListNode head) {
    ListNode current_head = null;
    while (head != null) {
        ListNode next = head.next;
        head.next = current_head;
        current_head = head;
        head = next;
    }
    return current_head;
}
```

时间复杂度：while 循环中本质上我们只是将每个结点访问了一次，加上结点倒置访问的一次，所以总共加起来每个结点其实只访问了 2 次。所以时间复杂度是 O（n）。

空间复杂度：O（1）。

# 解法二递归

有没有被解法一的各种指针绕晕呢，我们有一个更好的选择，递归，这样看起来就会简洁很多。

```java
public ListNode reverseKGroup(ListNode head, int k) {
    if (head == null)
        return null;
    ListNode point = head;
    //找到子链表的尾部
    int i = k;
    while(i - 1 >0){
        point = point.next;
        if (point == null) {
            return head;
        }
        i--;
    }
    ListNode temp = point.next;
     //将子链表断开
    point.next = null;
    
    //倒置子链表，并接受新的头结点
    ListNode new_head = reverse(head);
    
    //head 其实是倒置链表的尾部，然后我们将后边的倒置结果接过来就可以了
    //temp 是链表断开后的头指针，可以参考解法一的图示
    head.next = reverseKGroup(temp,k);
    return new_head;
}
public ListNode reverse(ListNode head) {
    ListNode current_head = null;
    while (head != null) {
        ListNode next = head.next;
        head.next = current_head;
        current_head = head;
        head = next;
    }
    return current_head;
}
```

复杂度：递归留坑。

# 总

还是那句话，涉及到链表的，我们就画下图，把各个指针的移动理清楚，一般没啥问题。



