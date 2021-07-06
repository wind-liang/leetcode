# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/86.jpg)

题目描述的很难理解，其实回想一下快排就很好理解了。就是快排的分区，将链表分成了两部分，一部分的数字全部小于分区点 x，另一部分全部大于等于分区点 x。最后就是 1 2 2 和 4 3 5 两部分。

# 解法一

回顾下快排的解法，快排中我们分区用了两个指针，一个指针表示该指针前边的数都小于分区点。另一个指针遍历数组。

```  
1 4 3 2 5 2  x = 3
  ^   ^
  i   j
i 表示前边的数都小于分区点 3, j 表示当前遍历正在遍历的点
如果 j 当前指向的数小于分区点，就和 i 指向的点交换位置，i 后移

1 2 3 4 5 2  x = 3
    ^   ^
    i   j
    
然后继续遍历就可以了。
```

这道题无非是换成了链表，而且题目要求不能改变数字的相对位置。所以我们肯定不能用交换的策略了，更何况链表交换也比较麻烦，其实我们直接用插入就可以了。

同样的，用一个指针记录当前小于分区点的链表的末尾，用另一个指针遍历链表，每次遇到小于分区点的数，就把它插入到记录的链表末尾，并且更新末尾指针。dummy 哨兵节点，减少边界情况的判断。

```java
public ListNode partition(ListNode head, int x) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode tail = null; 
    head = dummy;
    //找到第一个大于等于分区点的节点，tail 指向它的前边
    while (head.next != null) {
        if (head.next.val >= x) {
            tail = head; 
            head = head.next;
            break;
        }else {
            head = head.next;
        }
    }
    while (head.next != null) {
        //如果当前节点小于分区点，就把它插入到 tail 的后边
        if (head.next.val < x) {
            //拿出要插入的节点
            ListNode move = head.next;
            //将要插入的结点移除
            head.next = move.next;
            //将 move 插入到 tail 后边
            move.next = tail.next; 
            tail.next = move; 
            //更新 tail
            tail = move;
        }else{
            head = head.next;
        }

    } 
    return dummy.next;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二

[官方](<https://leetcode.com/problems/partition-list/solution/>)给出的 solution 也许更好理解一些。

我们知道，快排中之所以用相对不好理解的双指针，就是为了减少空间复杂度，让我们想一下最直接的方法。new 两个数组，一个数组保存小于分区点的数，另一个数组保存大于等于分区点的数，然后把两个数组结合在一起就可以了。

```java
1 4 3 2 5 2  x = 3
min = {1 2 2}
max = {4 3 5}
接在一起
ans = {1 2 2 4 3 5}
```

数组由于需要多浪费空间，而没有采取这种思路，但是链表就不一样了呀，它并不需要开辟新的空间，而只改变指针就可以了。

```java
public ListNode partition(ListNode head, int x) { 
    //小于分区点的链表
    ListNode min_head = new ListNode(0);
    ListNode min = min_head;
    //大于等于分区点的链表
    ListNode max_head = new ListNode(0);
    ListNode max = max_head;

    //遍历整个链表
    while (head != null) {  
        if (head.val < x) {
            min.next = head;
            min = min.next;
        } else { 
            max.next = head;
            max = max.next;
        }
 
        head = head.next;
    } 
    max.next = null;  //这步不要忘记，不然链表就出现环了
    //两个链表接起来
    min.next = max_head.next;

    return min_head.next;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 总

做完了 84、85 连续两个 hard 后，终于可以做个链表压压惊了。本质上就是快排的分区，而在当时被抛弃的用两个数组分别保存，最 naive 的方法，用到链表这里却显示出了它的简洁。