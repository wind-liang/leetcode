# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/82.jpg)

给一个链表，如果一个数属于重复数字，就把这个数删除，一个都不留。

# 解法一 迭代

只需要两个指针，一个指针 pre 代表重复数字的前边的一个指针，另一个指针 cur 用来遍历链表。d 代表哨兵节点，用来简化边界条件，初始化为 head 指针的前一个节点。p 代表 pre，c 代表 cur。

```java
d 1 2 3 3 3 4 cur 和 cur.next 不相等，pre 移到 cur 的地方，cur后移
^ ^ 
p c 

d 1 2 3 3 3 4 cur 和 cur.next 不相等，pre 移到 cur 的地方，cur后移
  ^ ^
  p c

d 1 2 3 3 3 4 5 cur 和 cur.next 相等, pre 保持不变，cur 后移
    ^ ^
    p c
    
d 1 2 3 3 3 4 5 cur 和 cur.next 相等, pre 保持不变，cur 后移
    ^   ^
    p   c
    
d 1 2 3 3 3 4 5 cur 和 cur.next 不相等, pre.next 直接指向 cur.next， 删除所有 3，cur 后移
    ^     ^
    p     c
    
d 1 2 4 5 cur 和 cur.next 不相等，pre 移到 cur 的地方，cur后移
    ^ ^
    p c
    
d 1 2 4 5 遍历结束
      ^ ^
      p c
```



```java
public ListNode deleteDuplicates(ListNode head) { 
    ListNode pre = new ListNode(0);
    ListNode dummy = pre;
    pre.next = head;
    ListNode cur = head;
    while(cur!=null && cur.next!=null){
        boolean equal = false;
        //cur 和 cur.next 相等，cur 不停后移
        while(cur.next!=null && cur.val == cur.next.val){ 
            cur = cur.next;
            equal = true; 
        }
        //发生了相等的情况
        // pre.next 直接指向 cur.next 删除所有重复数字
        if(equal){
            pre.next = cur.next; 
            equal = false;
        //没有发生相等的情况
        //pre 移到 cur 的地方
        }else{
            pre = cur;
        }
        //cur 后移
        cur = cur.next;
    }
    return dummy.next;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二 递归

[这里](<https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/discuss/28339/My-Recursive-Java-Solution>)看到了一种递归的解法，分享一下。 主要分了两种情况，头结点和后边的节点相等，头结点和后边的节点不相等。

```java
public ListNode deleteDuplicates(ListNode head) {
    if (head == null) return null;
	//如果头结点和后边的节点相等
    if (head.next != null && head.val == head.next.val) {
        //跳过所有重复数字
        while (head.next != null && head.val == head.next.val) {
            head = head.next;
        }
        //将所有重复数字去掉后，进入递归
        return deleteDuplicates(head.next);
    //头结点和后边的节点不相等
    } else {
        //保留头结点，后边的所有节点进入递归
        head.next = deleteDuplicates(head.next);
    }
    //返回头结点
    return head;
}
```

# 总

主要还是对链表的理解，然后就是指来指去就好了。