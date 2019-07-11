# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/100.jpg)

判断两个二叉树是否相同。

# 解法一

这道题就很简单了，只要把两个树同时遍历一下，遍历过程中判断数值是否相等或者同时为 null 即可。而遍历的方法，当然可以选择 DFS  里的先序遍历，中序遍历，后序遍历，或者 BFS。

当然实现的话，可以用递归，用栈，或者中序遍历提到的 Morris。也可以参照 [98 题](<https://leetcode.wang/leetCode-98-Validate-Binary-Search-Tree.html>) 、[ 94 题 ](<https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html>)，对二叉树的遍历讨论了很多。

这里的话，由于最近几题对中序遍历用的多，所以就直接用中序遍历了。

```java
public boolean isSameTree(TreeNode p, TreeNode q) {
    return inorderTraversal(p,q);
}
private boolean inorderTraversal(TreeNode p, TreeNode q) {
    if(p==null&&q==null){
        return true;
    }else if(p==null || q==null){
        return false;
    }
    //考虑左子树是否符合
    if(!inorderTraversal(p.left,q.left)){
        return false;
    }
    //考虑当前节点是否符合
    if(p.val!=q.val){
        return false;
    }
    //考虑右子树是否符合
    if(!inorderTraversal(p.right,q.right)){
        return false;
    }
    return true;
}
```

时间复杂度：O（N）。对每个节点进行了访问。

空间复杂度：O（h），h 是树的高度，也就是压栈所耗费的空间。当然 h 最小为 log（N），最大就等于 N。

```java
最好情况例子
      1
    /  \
   2    3
  / \  / \
 4  5 6   7
    
最差情况例子
     1
      \
       2
        \
         3
          \
           4
```

# 总

这道题比较简单，本质上考察的就是二叉树的遍历。