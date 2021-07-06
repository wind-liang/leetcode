# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/237.png)

删除链表的某个节点。

# 解法一

然后我以为就是一个简单的链表删除节点的题，但看到给的函数懵逼了。

```java
public void deleteNode(ListNode node) {
    
}
```

？？？头结点呢？没有头结点怎么删除，函数给错了吧。

然后看了 [solution](https://leetcode.com/problems/delete-node-in-a-linked-list/solution/)。

```java
public void deleteNode(ListNode node) {
    node.val = node.next.val;
    node.next = node.next.next;
}
```

好吧，我佛了，感觉感情受到了欺骗，这算什么删除节点...

# 总

感觉很无聊的一道题，没有什么意义，可以看一下 [203 题](https://leetcode.wang/leetcode-203-Remove-Linked-List-Elements.html)，纯正的删除节点的题目。

