# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/138.jpg)

给一个链表，返回复制后的链表。链表节点相对于普通的多了一个 `random` 指针，会随机指向链表内的任意节点或者指向 `null`。

# 思路分析

这道题其实和 [133 题](https://leetcode.wang/leetcode-133-Clone-Graph.html) 复制一个图很类似，这里的话就是要解决的问题就是，当更新当前节点的 `random` 指针的时候，如果 `random` 指向的是很后边的节点，但此时后边的节点还没有生成，那么我们该如何处理。

和 [133 题](https://leetcode.wang/leetcode-133-Clone-Graph.html)  一样，我们可以利用 `HashMap` 将节点提前生成并且保存起来，第二次遍历到他的时候直接从 `HashMap` 里边拿即可。

这里的话就有两种思路，一种需要遍历两边链表，一种只需要遍历一遍。

> 2020.3.3 更新，leetcode 增加了样例，之前没有重复的数字所以 `key` 存的  `val` ，现在有了重复数字，将 `key` 修改为 `Node`。此外 `Node` 的无参的构造函数也被去掉了，也需要修改。

# 解法一

首先利用 `HashMap` 来一个不用思考的代码。

遍历第一遍链表，我们不考虑链表之间的相互关系，仅仅生成所有节点，然后把它存到 `HashMap` 中，`val` 作为 `key`，`Node` 作为 `value`。

遍历第二遍链表，将之前生成的节点取出来，更新它们的 `next` 和 `random` 指针。

```java
public Node copyRandomList(Node head) {
    if (head == null) {
        return null;
    }
    HashMap<Node, Node> map = new HashMap<>();
    Node h = head;
    while (h != null) {
        Node t = new Node(h.val); 
        map.put(h, t);
        h = h.next;
    }
    h = head;
    while (h != null) {
        if (h.next != null) {
            map.get(h).next = map.get(h.next);
        }
        if (h.random != null) {
            map.get(h).random = map.get(h.random);
        }
        h = h.next;
    }
    return map.get(head);
}
```

# 解法二

解法一虽然简单易懂，但还是有可以优化的地方的。我们可以只遍历一次链表。

核心思想就是延迟更新它的 `next`。

```java
1 -> 2 -> 3

用 cur 指向已经生成的节点的末尾
1 -> 2   
     ^
     c

然后将 3 构造完成

最后将 2 的 next 指向 3
1 -> 2 -> 3  
     ^
     c
     
期间已经生成的节点存到 HashMap 中，第二次遇到的时候直接从 HashMap 中拿
```

看下代码理解一下含义吧

```java
public Node copyRandomList(Node head) {
    if (head == null) {
        return null;
    }
    HashMap<Node, Node> map = new HashMap<>();
    Node h = head;
    Node cur = new Node(-1); //空结点，dummy 节点，为了方便头结点计算
    while (h != null) {
        //判断当前节点是否已经产生过
        if (!map.containsKey(h)) {
            Node t = new Node(h.val);
            map.put(h, t);
        }
        //得到当前节点去更新它的 random 指针
        Node next = map.get(h);
        if (h.random != null) {
            //判断当前节点是否已经产生过
            if (!map.containsKey(h.random)) {
                next.random = new Node(h.random.val);
                map.put(h.random, next.random);
            } else {
                next.random = map.get(h.random);
            }

        }
        //将当前生成的节点接到 cur 的后边
        cur.next = next;
        cur = cur.next;
        h = h.next;
    }
    return map.get(head);
}
```

# 解法三

上边的两种解法都用到了 `HashMap` ，所以额外需要 `O(n)` 的空间复杂度。现在考虑不需要额外空间的方法。

主要参考了[这里](https://leetcode.com/problems/copy-list-with-random-pointer/discuss/43491/A-solution-with-constant-space-complexity-O(1)-and-linear-time-complexity-O(N))。主要解决的问题就是我们生成节点以后，当更新它的 `random` 的时候，怎么找到之前生成的节点，前两种解法用了 `HashMap` 全部存起来，这里的话可以利用原来的链表的指针域。

 主要需要三步。

1. 生成所有的节点，并且分别插入到原有节点的后边
2. 更新插入节点的 `random`
3. 将新旧节点分离开来

一图胜千言，大家看一下下边的图吧。

![](https://windliang.oss-cn-beijing.aliyuncs.com/138_2.jpg)

代码对应如下。

```java
public Node copyRandomList(Node head) {
    if (head == null) {
        return null;
    }
    Node l1 = head;
    Node l2 = null;
    //生成所有的节点，并且分别插入到原有节点的后边
    while (l1 != null) {
        l2 = new Node(l1.val);
        l2.next = l1.next;
        l1.next = l2;
        l1 = l1.next.next;
    }
    //更新插入节点的 random
    l1 = head;
    while (l1 != null) {
        if (l1.random != null) {
            l1.next.random = l1.random.next;
        }
        l1 = l1.next.next;
    }

    l1 = head;
    Node l2_head = l1.next;
    //将新旧节点分离开来
    while (l1 != null) {
        l2 = l1.next;
        l1.next = l2.next;
        if (l2.next != null) {
            l2.next = l2.next.next;
        }
        l1 = l1.next;
    }
    return l2_head;
}
```

# 解法四

不利用额外的空间复杂度还有一种思路，参考 [这里](https://leetcode.com/problems/copy-list-with-random-pointer/discuss/43497/2-clean-C%2B%2B-algorithms-without-using-extra-arrayhash-table.-Algorithms-are-explained-step-by-step.)。

解法三利用原链表的 `next` 域把新生成的节点保存了起来。类似的，我们还可以利用原链表的 `random` 域把新生成的节点保存起来。

主要还是三个步骤。

1. 生成所有的节点，将它们保存到原链表的 `random` 域，同时利用新生成的节点的 `next` 域保存原链表的 `random`。
2. 更新新生成节点的 `random` 指针。
3. 恢复原链表的 `random` 指针，同时更新新生成节点的 `next` 指针。

一图胜千言。

![](https://windliang.oss-cn-beijing.aliyuncs.com/138_3.jpg)

相应的代码如下。

```java
public Node copyRandomList(Node head) {
    if (head == null) {
        return null;
    }
    Node l1 = head;
    Node l2 = null;
    //生成所有的节点，讲它们保存到原链表的 random 域，
    //同时利用新生成的节点的 next 域保存原链表的 random。
    while (l1 != null) {
        l2 = new Node(l1.val);
        l2.next = l1.random;
        l1.random = l2;
        l1 = l1.next;
    }
    l1 = head;
    //更新新生成节点的 random 指针。
    while (l1 != null) {
        l2 = l1.random;
        l2.random = l2.next != null ? l2.next.random : null;
        l1 = l1.next;
    }

    l1 = head;
    Node l2_head = l1.random;
    //恢复原链表的 random 指针，同时更新新生成节点的 next 指针。
    while (l1 != null) {
        l2 = l1.random;
        l1.random = l2.next;
        l2.next = l1.next != null ? l1.next.random : null;
        l1 = l1.next;
    }
    return l2_head;
}
```

# 总

解法一、解法二是比较直接的想法，直接利用 `HashMap` 存储之前的节点。解法三、解法四利用原有链表的指针，通过指来指去完成了赋值。链表操作的核心思想就是，在改变某一个节点的指针域的时候，一定要把该节点的指针指向的节点用另一个指针保存起来，以免造成丢失。

