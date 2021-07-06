# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/235.png)

从二叉搜索树中，找出两个节点的最近的共同祖先。

二叉搜索树定义如下。

> 1. 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
> 2. 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
> 3. 任意节点的左、右子树也分别为二叉查找树；
> 4. 没有键值相等的节点。

# 解法一 递归

由于是二叉搜索树，所以找最近的共同祖先比较容易，总共就三种情况。

* 如果给定的两个节点的值都小于根节点的值，那么最近的共同祖先一定在左子树
* 如果给定的两个节点的值都大于根节点的值，那么最近的共同祖先一定在右子树
* 如果一个大于等于、一个小于等于根节点的值，那么当前根节点就是最近的共同祖先了

至于前两种情况用递归继续去解决即可。

代码的话，我们可以通过交换使得 `p.val <= q.val` ，这样就可以简化后边 `if` 语句的判断。

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {

    // 保持 p.val <= q.val
    if (p.val > q.val) {
        return lowestCommonAncestor(root, q, p);
    }
    //如果有一个是根节点就可以提前结束, 当然这个 if 不要也可以
    if (p.val == root.val || q.val == root.val) {
        return root;
    }
    if (q.val < root.val) {
        return lowestCommonAncestor(root.left, p, q);
    } else if (p.val > root.val) {
        return lowestCommonAncestor(root.right, p, q);
    } else {
        return root;
    }

}
```

# 解法二 迭代

上边的递归比较简单，可以直接改写成循环的形式。

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    int pVal = p.val;
    int qVal = q.val;
    if (pVal == root.val || qVal == root.val) {
        return root;
    }
    // 保持 p.val <= q.val
    if (pVal > qVal) {
        int temp = pVal;
        pVal = qVal;
        qVal = temp;
    }
    while (true) {
        if (qVal < root.val) {
            root = root.left;
        } else if (pVal > root.val) {
            root = root.right;
        } else {
            return root;
        }
    }
}
```

# 总

只要知道二叉搜索树的定义，这个题就很好解了。当然之前的题目都是用的二叉搜索树的另一个性质，「中序遍历输出的是一个升序数组」，比如刚做完的 [230 题](https://leetcode.wang/leetcode-230-Kth-Smallest-Element-in-a-BST.html)。

对于二叉树的题，开始可以用递归的思想去思考会比较简单。