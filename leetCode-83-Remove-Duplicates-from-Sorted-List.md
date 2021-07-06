# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/83.jpg)

给定一个链表，去重，每个数字只保留一个。

# 解法一 修改

按偷懒的方法，直接在 [82 题](<https://leetcode.wang/leetCode-82-Remove-Duplicates-from-Sorted-ListII.html>)的基础上改，如果没做过可以先去看一下。之前是重复的数字一个都不保留，这道题的话要留一个，所以代码也很好改。

## 迭代法

```java
public ListNode deleteDuplicates(ListNode head) { 
    ListNode pre = new ListNode(0);
    ListNode dummy = pre;
    pre.next = head;
    ListNode cur = head;
    while(cur!=null && cur.next!=null){
        boolean equal = false;
        while(cur.next!=null && cur.val == cur.next.val){ 
            cur = cur.next;
            equal = true; 
        }
      
        if(equal){
         /*************修改的地方*****************/
         //pre.next 指向 cur，不再跳过当前数字
            pre.next = cur;
            pre = cur;
         /**************************************/
            equal = false;
        }else{
            pre = cur;
        }
        cur = cur.next;
    }
    return dummy.next;
}
```

## 递归

```java
public ListNode deleteDuplicates(ListNode head) {
    if (head == null) return null;
    //如果头结点和后边的节点相等
    if (head.next != null && head.val == head.next.val) {
        //跳过所有重复数字
        while (head.next != null && head.val == head.next.val) {
            head = head.next;
        } 
        /*************修改的地方*****************/
        //将 head 也包含，进入递归
        return deleteDuplicates(head);
        /**************************************/
        //头结点和后边的节点不相等
    } else {
        //保留头结点，后边的所有节点进入递归
        head.next = deleteDuplicates(head.next);
    }
    //返回头结点
    return head;
}
```

# 解法二 迭代

 [82 题](<https://leetcode.wang/leetCode-82-Remove-Duplicates-from-Sorted-ListII.html>)由于我们要把所有重复的数字都要删除，所有要有一个 pre 指针，指向所有重复数字的最前边。而这道题，我们最终要保留一个数字，所以完全不需要 pre 指针。还有就是，我们不用一次性找到所有重复的数字，我们只需要找到一个，删除一个就够了。所以代码看起来更加简单了。

```java
public ListNode deleteDuplicates(ListNode head) {  
    ListNode cur = head;
    while(cur!=null && cur.next!=null){ 
        //相等的话就删除下一个节点
        if(cur.val == cur.next.val){ 
            cur.next = cur.next.next; 
        //不相等就后移
        }else{
            cur = cur.next;
        }
    }
    return head;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法三 递归

同样的，递归也会更简单些。

```java
public ListNode deleteDuplicates(ListNode head) { 
    if(head == null || head.next == null){
        return head;
    }
    //头结点和后一个时候相等
    if(head.val == head.next.val){
        //去掉头结点
        return deleteDuplicates(head.next);
    }else{
        //加上头结点
        head.next = deleteDuplicates(head.next);
        return head;
    }
}
```

# 总

如果 [82 题](<https://leetcode.wang/leetCode-82-Remove-Duplicates-from-Sorted-ListII.html>)会做的话，这道题就水到渠成了。

