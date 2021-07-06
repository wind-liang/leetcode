# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/129.jpg)

从根节点到叶子节点的路径组成一个数字，计算所有的数字和。

# 思路分析

和 [112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>) 有些像，112 题是给出一个 `sum`，然后去找这条路径。但本质上都一样的，只需要对二叉树进行遍历，遍历过程中记录当前路径的和就可以。说到遍历，无非就是 `BFS` 和 `DFS`，如果进行 `BFS`，过程中我们需要维护多条路径的和，所以我们选择 `DFS` 。

说到 `DFS` 的话，可以用递归，也可以用栈去实现，递归会好理解一些，所以这里就只介绍递归吧，栈的话前边也用过很多了，可以看下 [112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>) 。

说到递归，既可以利用回溯的思想，也可以用分治的思想，这里就用这两种方式写一下，关于回溯、分治，可以看一下 [115 题](<https://leetcode.wang/leetcode-115-Distinct-Subsequences.html>)，会有一个深刻的理解。

# 解法一 回溯法

回溯的思想就是一直进行深度遍历，直到得到一个解后，记录当前解。然后再回到之前的状态继续进行深度遍历。

所以我们需要定义一个函数来得到这个解。

```java
void dfs(TreeNode root, int cursum)
```

这个函数表示从根节点走到 	`root` 节点的时候，路径累积的和是 `cursum`。

这里我们用一个全局变量 `sum` 来保存每条路径的和。

所以回溯的出口就是，当我们到达叶子节点，保存当前累计的路径和。

```java
private void dfs(TreeNode root, int cursum) {
    if (root.left == null && root.right == null) {
        sum += cursum;
        return;
    }
```

然后就是分别去尝试左子树和右子树就可以。把所有的代码合起来。

```java
public int sumNumbers(TreeNode root) {
    if (root == null) {
        return 0;
    }
    dfs(root, root.val);
    return sum;
}

int sum = 0;

private void dfs(TreeNode root, int cursum) {
    //到达叶子节点
    if (root.left == null && root.right == null) {
        sum += cursum;
        return;
    }
    //尝试左子树
    if(root.left!=null){
        dfs(root.left,  cursum * 10 + root.left.val);
    }
    //尝试右子树
    if(root.right!=null){
        dfs(root.right, cursum * 10 + root.right.val);

    }

}

```

# 解法二 分治法

分支法的思想就是，解决子问题，通过子问题解决最终问题。

要求一个树所有的路径和，我们只需要知道从根节点出发经过左子树的所有路径和和从根节点出发经过右子树的所有路径和，加起来就可以了。

所以我们需要定义一个函数。

```java
int sumNumbersHelper(TreeNode root, int sum)
```

参数含义是经过当前 `root` 节点之前，已经累计的和是 `sum`，函数返回从最初根节点经过当前 `root` 节点达到叶子节点的和。（明确函数的定义很重要，这样才可以保证正确的写出递归）

所以如果经过当前节点，那么当前已有路径的和就是 

```java
int cursum = sum * 10 + root.val;
```

然后我们需要考虑经过当前 	`root` 节点后，再经过它的左孩子到叶子节点的所有路径和。

```java
int ans1 = sumNumbersHelper(root.left,cursum)
```

再考虑经过当前 `root` 节点后，再经过它的右孩子到叶子节点的路径和。

```java
int ans2 = sumNumbersHelper(root.right,cursum)
```

两个都算出来以后，加起来就是从最初根节点经过当前 `root` 节点到达叶子节点的所有路径和了。

```java
public int sumNumbers(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return sumNumbersHelper(root, 0);
}

private int sumNumbersHelper(TreeNode root, int sum) {
    //已经累计的和
    int cursum = sum * 10 + root.val;
    if (root.left == null && root.right == null) {
        return cursum;
    }
    int ans = 0;
    //从最开始经过当前 root 再经过左孩子到达叶子节点所有的路径和
    if (root.left != null) {
        ans += sumNumbersHelper(root.left, cursum);
    }
    //从最开始经过当前 root 再经过右孩子到达叶子节点所有的路径和
    if (root.right != null) {
        ans += sumNumbersHelper(root.right, cursum);
    }
    //返回从最开始经过当前 root 然后到达叶子节点所有的路径和
    return ans;
}

```

# 总

这道题本质上还是在考二叉树的遍历，回溯和分治的思想的区别也可以对比考虑一下。