# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/109.jpg)

和 [108 题](<https://leetcode.wang/leetcode-108-Convert-Sorted-Array-to-Binary-Search-Tree.html>) 是一样的，都是给定一个升序序列，然后生成二分平衡查找树。区别在于 108 题给定的是数组，这里给的是链表。

# 解法一

大家先看一下 [108 题](<https://leetcode.wang/leetcode-108-Convert-Sorted-Array-to-Binary-Search-Tree.html>)  吧，算法的关键是取到中间的数据做为根节点。而这里链表的话，由于不支持随机访问，所以会麻烦些。最简单的思路就是我们把链表先用线性表存起来，然后题目就转换成 108 题了。

为了方便，把上一道题的数组参数改为`List` 。

```java
public TreeNode sortedListToBST(ListNode head) {
    ArrayList<Integer> nums = new ArrayList<>();
    while (head != null) {
        nums.add(head.val);
        head = head.next;
    }
    return sortedArrayToBST(nums);
}

public TreeNode sortedArrayToBST(ArrayList<Integer> nums) {
    return sortedArrayToBST(nums, 0, nums.size());
}

private TreeNode sortedArrayToBST(ArrayList<Integer> nums, int start, int end) {
    if (start == end) {
        return null;
    }
    int mid = (start + end) >>> 1;
    TreeNode root = new TreeNode(nums.get(mid));
    root.left = sortedArrayToBST(nums, start, mid);
    root.right = sortedArrayToBST(nums, mid + 1, end);
    return root;
}
```

时间复杂度：`O(n)`。

空间复杂度：数组进行辅助，`O(n)`。

# 解法二

参考 [这里](<https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/discuss/35476/Share-my-JAVA-solution-1ms-very-short-and-concise.>)。

有没有一种方案，不用数组的辅助呢？那么我们需要解决怎么得到 mid 的值的问题。

最直接的思路就是根据 start 和 end，求出 mid，然后从 head 遍历 mid - start 次，就到达了 mid 值。但最开始的 end，我们还得遍历一遍链表才能得到，总体来说就是太复杂了。

这里有一个求中点节点值的技巧，利用快慢指针。

快指针和慢指针同时从头部开始遍历，快指针每次走两步，慢指针每次走一步，当快指针走到链表尾部，此时慢指针就指向了中间位置。

除了求中点节点的值不一样，基本架构和 [108 题](<https://leetcode.wang/leetcode-108-Convert-Sorted-Array-to-Binary-Search-Tree.html>)  是一样的。

```java
public TreeNode sortedListToBST(ListNode head) {
    return sortedArrayToBST(head, null);
}

private TreeNode sortedArrayToBST(ListNode head, ListNode tail) {
    if (head == tail) {
        return null;
    }
    ListNode fast = head;
    ListNode slow = head;
    while (fast != tail && fast.next != tail) {
        slow = slow.next;
        fast = fast.next.next;
    }

    TreeNode root = new TreeNode(slow.val);
    root.left = sortedArrayToBST(head, slow);
    root.right = sortedArrayToBST(slow.next, tail); 
    return root;
}
```

时间复杂度：根据递归式可知，`T(n) = 2 * T（n / 2 ) + n`，`O(nlog(n))`。

空间复杂度：`O(log(n))`。

# 解法三

解法二虽然没有借助数组，优化了空间复杂度，但是时间复杂度增加了，那么有没有一种两全其美的方法，时间复杂度是解法一，空间复杂度是解法二。还真有，参考 [这里](<https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/discuss/35472/Share-my-O(1)-space-and-O(n)-time-Java-code>)。

主要思想是，因为我们知道题目给定的升序数组，其实就是二叉搜索树的中序遍历。那么我们完全可以按照这个顺序去为每个节点赋值。

实现的话，我们套用中序遍历的递归过程，并且将 `start` 和 `end` 作为递归参数，当 `start == end` 的时候，就返回 `null`。

先回想一下中序遍历的算法。

```java
public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> ans = new ArrayList<>();
    getAns(root, ans);
    return ans;
}

private void getAns(TreeNode node, List<Integer> ans) {
    if (node == null) {
        return;
    }
    getAns(node.left, ans); 
    ans.add(node.val);
    getAns(node.right, ans);
}
```

之前是将 `node.val` 进行保存，这里的话我们是给当前节点进行赋值，为了依次赋值，我们需要一个`cur`指针指向给定的数列，每赋一个值就进行后移。

```java
ListNode cur = null;

public TreeNode sortedListToBST(ListNode head) {
    cur = head;
    int end = 0;
    while (head != null) {
        end++;
        head = head.next;
    }
    return sortedArrayToBSTHelper(0, end);
}

private TreeNode sortedArrayToBSTHelper(int start, int end) {
    if (start == end) {
        return null;
    }
    int mid = (start + end) >>> 1;
    //遍历左子树并且将根节点返回
    TreeNode left = sortedArrayToBSTHelper(start, mid);
    //遍历当前根节点并进行赋值
    TreeNode root = new TreeNode(cur.val);
    root.left = left;
    cur = cur.next; //指针后移，进行下一次的赋值
    //遍历右子树并且将根节点返回
    TreeNode right = sortedArrayToBSTHelper(mid + 1, end);
    root.right = right;
    return root;
}
```

时间复杂度：`O(n)`，主要是得到开始的 end，需要遍历一遍链表。

空间复杂度：`O(log(n))`，递归压栈的消耗。

# 总

快慢指针求链表的中间值，这个技巧不错。此外，解法三的模仿中序遍历的过程，然后把给定的数组依次赋值过去，太强了。