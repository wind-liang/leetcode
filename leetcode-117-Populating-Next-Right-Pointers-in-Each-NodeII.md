# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/117.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/117_2.jpg)

给定一个二叉树，然后每个节点有一个 `next` 指针，将它指向它右边的节点。和  [116 题](<https://leetcode.wang/leetcode-116-Populating-Next-Right-Pointers-in-Each-Node.html>) 基本一样，区别在于之前是满二叉树。

# 解法一 BFS

直接把 [116 题](<https://leetcode.wang/leetcode-116-Populating-Next-Right-Pointers-in-Each-Node.html>) 题的代码复制过来就好，一句也不用改。

利用一个栈将下一层的节点保存。通过`pre`指针把栈里的元素一个一个接起来。

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

# 解法二

当然题目要求了空间复杂度，可以先到 [116 题](<https://leetcode.wang/leetcode-116-Populating-Next-Right-Pointers-in-Each-Node.html>) 看一下思路，这里在上边的基础上改一下。

我们用第二种简洁的代码，相对会好改一些。

```java
Node connect(Node root) {
    if (root == null)
        return root;
    Node pre = root;
    Node cur = null;
    while (pre.left != null) {
        cur = pre;
        while (cur != null) {
            cur.left.next = cur.right;
            if (cur.next != null) {
                cur.right.next = cur.next.left;
            }
            cur = cur.next;
        }
        pre = pre.left;
    }

    return root;
}
```

需要解决的问题还是挺多的。

```java
cur.left.next = cur.right;
cur.right.next = cur.next.left;
```

之前的关键代码就是上边两句，但是在这道题中我们无法保证`cur.left` 或者 `cur.right` 或者  `cur.next.left`或者`cur.next.right` 是否为`null`。所以我们需要用一个`while`循环来保证当前节点至少有一个孩子。

```java
while (cur.left == null && cur.right == null) {
    cur = cur.next; 
}
```

这样的话保证了当前节点至少有一个孩子，然后如果一个孩子为 `null`，那么就可以保证另一个一定不为 `null` 了。

整体的话，就用了上边介绍的技巧，代码比较长，可以结合的看一下。

```java
Node connect(Node root) {
    if (root == null)
        return root;
    Node pre = root;
    Node cur = null;
    while (true) {
        cur = pre;
        while (cur != null) {
            //找到至少有一个孩子的节点
            if (cur.left == null && cur.right == null) {
                cur = cur.next;
                continue;
            }
            //找到当前节点的下一个至少有一个孩子的节点
            Node next = cur.next;
            while (next != null && next.left == null && next.right == null) {
                next = next.next;
                if (next == null) {
                    break;
                }
            }
            //当前节点的左右孩子都不为空，就将 left.next 指向 right
            if (cur.left != null && cur.right != null) {
                cur.left.next = cur.right;
            }
            //要接上 next 的节点的孩子，所以用 temp 处理当前节点 right 为 null 的情况
            Node temp = cur.right == null ? cur.left : cur.right;

            if (next != null) {
                //next 左孩子不为 null，就接上左孩子。
                if (next.left != null) {
                    temp.next = next.left;
                //next 左孩子为 null，就接上右孩子。
                } else {
                    temp.next = next.right;
                }
            }
            
            cur = cur.next;
        }
        //找到拥有孩子的节点
        while (pre.left == null && pre.right == null) {
            pre = pre.next;
            //都没有孩子说明已经是最后一层了
            if (pre == null) {
                return root;
            }
        }
        //进入下一层
        pre = pre.left != null ? pre.left : pre.right;
    } 
}
```

# 解法三

参考 [这里](<https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/discuss/37979/O(1).-Concise.-Fast.-What's-so-hard>)。

利用解法一的思想，我们利用 `pre` 指针，然后一个一个取节点，把它连起来。解法一为什么没有像解法二那样考虑当前节点为 `null` 呢？因为我们没有添加为 `null` 的节点，就是下边的代码的作用。

```java
if (cur.left != null) {
    queue.offer(cur.left);
}
if (cur.right != null) {
    queue.offer(cur.right);
}
```

所以这里是一样的，如果当前节点为`null`不处理就可以了。

第二个问题，怎么得到每次的开头的节点呢？我们用一个`dummy`指针，当连接第一个节点的时候，就将`dummy`指针指向他。此外，之前用的`pre`指针，把它当成`tail`指针可能会更好理解。如下图所示：

![](https://windliang.oss-cn-beijing.aliyuncs.com/117_3.jpg)

`cur` 指针利用 `next` 不停的遍历当前层。

如果 `cur` 的孩子不为 `null` 就将它接到 `tail` 后边，然后更新`tail`。

当 `cur` 为 `null` 的时候，再利用 `dummy` 指针得到新的一层的开始节点。

`dummy` 指针在链表中经常用到，他只是为了处理头结点的情况，它并不属于当前链表。

代码就异常的简单了。

```java
Node connect(Node root) {
    Node cur = root;
    while (cur != null) {
        Node dummy = new Node();
        Node tail = dummy;
        //遍历 cur 的当前层
        while (cur != null) {
            if (cur.left != null) {
                tail.next = cur.left;
                tail = tail.next;
            }
            if (cur.right != null) {
                tail.next = cur.right;
                tail = tail.next;
            }
            cur = cur.next;
        }
        //更新 cur 到下一层
        cur = dummy.next;
    }
    return root;
}
```

# 总

本来为了图方便，在 [116 题](<https://leetcode.wang/leetcode-116-Populating-Next-Right-Pointers-in-Each-Node.html>) 的基础上把解法二改了出来，还搞了蛮久，因为为 `null` 的情况太多了，不停的报空指针异常，最后终于理清了思路。但和解法三比起来实在是相形见绌了，解法三太优雅了，但其实这才是正常的思路，从解法一的做法产生灵感，利用 `tail` 指针将它们连起来。