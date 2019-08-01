# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/116.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/116_2.jpg)

给定一个满二叉树，每个节点多了一个`next`指针，然后将所有的`next`指针指向它的右边的节点。并且要求空间复杂度是`O(1)`。

# 解法一 BFS

如果没有要求空间复杂度这道题就简单多了，我们只需要用一个队列做`BFS`，`BFS`参见 [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>)。然后按顺序将每个节点连起来就可以了。

```java
public Node connect(Node root) {
    if (root == null) {
        return root;
    }
    Queue<Node> queue = new LinkedList<Node>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        Node pre = null;
        for (int i = 0; i < size; i++) {
            Node cur = queue.poll();
            //从第二个节点开始，将前一个节点的 pre 指向当前节点
            if (i > 0) {
                pre.next = cur;
            }
            pre = cur;
            if (cur.left != null) {
                queue.offer(cur.left);
            }
            if (cur.right != null) {
                queue.offer(cur.right);
            }

        }
    }
    return root;
}
```

# 解法二 迭代

当然既然题目要求了空间复杂度，那么我们来考虑下不用队列该怎么处理。只需要解决三个问题就够了。

* 每一层怎么遍历？

  之前是用队列将下一层的节点保存了起来。

  这里的话，其实只需要提前把下一层的`next`构造完成，到了下一层的时候就可以遍历了。

* 什么时候进入下一层？

  之前是得到当前队列的元素个数，然后遍历那么多次。

  这里的话，注意到最右边的节点的`next`为`null`，所以可以判断当前遍历的节点是不是`null`。

* 怎么得到每层开头节点？

  之前队列把当前层的所以节点存了起来，得到开头节点当然很容易。

  这里的话，我们额外需要一个变量把它存起来。

三个问题都解决了，就可以写代码了。利用三个指针，`start` 指向每层的开始节点，`cur`指向当前遍历的节点，`pre`指向当前遍历的节点的前一个节点。

![](https://windliang.oss-cn-beijing.aliyuncs.com/116_3.jpg)

如上图，我们需要把 `pre` 的左孩子的 `next` 指向右孩子，`pre` 的右孩子的`next`指向`cur`的左孩子。

![](https://windliang.oss-cn-beijing.aliyuncs.com/116_4.jpg)

如上图，当 `cur` 指向 `null` 以后，我们只需要把 `pre` 的左孩子的 `next` 指向右孩子。

```java
public Node connect(Node root) {
    if (root == null) {
        return root;
    }
    Node pre = root;
    Node cur = null;
    Node start = pre;
    while (pre.left != null) {
        //遍历到了最右边的节点，要将 pre 和 cur 更新到下一层，并且用 start 记录
        if (cur == null) {
            //我们只需要把 pre 的左孩子的 next 指向右孩子。
            pre.left.next = pre.right;
            
            pre = start.left;
            cur = start.right;
            start = pre;
        //将下一层的 next 连起来，同时 pre、next 后移
        } else {
            //把 pre 的左孩子的 next 指向右孩子
            pre.left.next = pre.right;
            //pre 的右孩子的 next 指向 cur 的左孩子。
            pre.right.next = cur.left;
            
            pre = pre.next;
            cur = cur.next;
        }
    }
    return root;
}
```

分享下 `leetcode` 的高票回答的代码，看起来更简洁一些，`C++`  写的。

```C++
void connect(TreeLinkNode *root) {
    if (root == NULL) return;
    TreeLinkNode *pre = root;
    TreeLinkNode *cur = NULL;
    while(pre->left) {
        cur = pre;
        while(cur) {
            cur->left->next = cur->right;
            if(cur->next) cur->right->next = cur->next->left;
            cur = cur->next;
        }
        pre = pre->left;
    }
}
```

我的代码里的变量和他的变量对应关系如下。

```java
我的 start    pre    cur
      |       |      |
他的  pre     cur    cur.next
```

除了变量名不一样，算法本质还是一样的。

# 总

题目让我们初始化 `next` 指针，初始化过程中我们又利用到了`next`指针，很巧妙了。