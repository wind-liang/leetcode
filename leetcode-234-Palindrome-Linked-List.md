# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/234.jpg)

判断一个链表存储的数字是否是回文数字。

# 思路分析

这个题就难在链表不能随机读取，不能像数组那样直接首尾首尾的依次判断。如果不考虑额外的空间的话，我们只需要把链表中的数字存储到数组中然后判断即可。

如果不用额外空间的话，我们可以把链表分成两半，把后一半倒置，和前一半依次判断即可。

# 解法一

两个关键点。

* 链表分成两半。

  最直接的方法就是先遍历一遍链表得到链表的长度 `n`，然后再遍历 `n/2` 次就找到了中点。

  还有一个比较 trick 的方法，在 [143 题](https://leetcode.wang/leetcode-143-Reorder-List.html)，[148 题](https://leetcode.wang/leetcode-148-Sort-List.html) 都用过了，也就是快慢指针，快指针一次走两步，慢指针一次走一步，当快指针走到终点的时候，慢指针此时就到了中点。

  ```java
  // 找中点，链表分成两个
  ListNode slow = head;
  ListNode fast = head;
  while (fast != null && fast.next != null) {
      slow = slow.next;
      fast = fast.next.next;
  }
  ```

  需要注意的是，当链表个数为偶数的时候，`slow`  指向第二个链表的开始。当链表个数为奇数的时候是，`slow` 指向最中间的位置。

* 链表倒置

  在 [第 2 题](https://leetcode.wang/leetCode-2-Add-Two-Numbers.html) 的时候已经介绍过链表倒置了。

  ```java
  private ListNode reverseList(ListNode head) {
      if (head == null) {
          return null;
      }
      ListNode tail = null;
      while (head != null) {
          ListNode temp = head.next;
          head.next = tail;
          tail = head;
          head = temp;
      }
  
      return tail;
  }
  ```

然后整体的代码就出来了。

```java
public boolean isPalindrome(ListNode head) {
    if (head == null || head.next == null) {
        return true;
    }
    // 找中点，链表分成两个
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // 第二个链表倒置
    ListNode newHead = reverseList(slow);

    // 前一半和后一半依次比较
    while (newHead != null) {
        if (head.val != newHead.val) {
            return false;
        }
        head = head.next;
        newHead = newHead.next;
    }
    return true;
}

private ListNode reverseList(ListNode head) {
    if (head == null) {
        return null;
    }
    ListNode tail = null;
    while (head != null) {
        ListNode temp = head.next;
        head.next = tail;
        tail = head;
        head = temp;
    }

    return tail;
}
```

# 总

其实还有一个争议的地方，利用输入的数据，算不算空间复杂度是 `O(1)`，上边的解法我们改变了原来链表的结构，即使我们在 `return` 前可以再将链表还原，但如果较真的话，还是可以说它空间复杂度不是 `O(1)`，因为如果输入的数据只是可读的，我们的算法确实需要额外空间。

详见 [discuss](https://leetcode.com/problems/palindrome-linked-list/discuss/64493/Reversing-a-list-is-not-considered-"O(1)-space") 里大神们的讨论，我觉得不用纠结，因为这完全取决于定义，定义的话不也是人定的吗，达成共识即可，具体问题再具体分析。