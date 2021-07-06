# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/113.jpg)

[112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>) 的升级版，给定一个`sum`，输出从根节点开始到叶子节点，和为`sum` 的所有路径可能。

直接在 [112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>)  的基础上改了，解法没有新内容，大家可以过去看一看。

# 解法一 递归

[112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>) 的解法是下边的样子。

```java
public boolean hasPathSum(TreeNode root, int sum) {
    if (root == null) {
        return false;
    }
    return hasPathSumHelper(root, sum);
}

private boolean hasPathSumHelper(TreeNode root, int sum) {
    //到达叶子节点
    if (root.left == null && root.right == null) {
        return root.val == sum;
    }
    //左孩子为 null
    if (root.left == null) {
        return hasPathSumHelper(root.right, sum - root.val);
    }
    //右孩子为 null
    if (root.right == null) {
        return hasPathSumHelper(root.left, sum - root.val);
    }
    return hasPathSumHelper(root.left, sum - root.val) || hasPathSumHelper(root.right, sum - root.val);
}
```

这里的话我们需要一个`ans`变量来保存所有结果。一个`temp`变量来保存遍历的路径。需要注意的地方就是，`java`中的`list`传递的是引用，所以递归结束后，要把之前加入的元素删除，不要影响到其他分支的`temp`。

```java
public List<List<Integer>> pathSum(TreeNode root, int sum) {

    List<List<Integer>> ans = new ArrayList<>();
    if (root == null) {
        return ans;
    }
    hasPathSumHelper(root, sum, new ArrayList<Integer>(), ans);
    return ans;
}

private void hasPathSumHelper(TreeNode root, int sum, ArrayList<Integer> temp, List<List<Integer>> ans) {
    // 到达叶子节点
    if (root.left == null && root.right == null) {
        if (root.val == sum) {
            temp.add(root.val);
            ans.add(new ArrayList<>(temp));
            temp.remove(temp.size() - 1);
        }
        return;
    }
    // 左孩子为 null
    if (root.left == null) {
        temp.add(root.val);
        hasPathSumHelper(root.right, sum - root.val, temp, ans);
        temp.remove(temp.size() - 1);
        return;
    }
    // 右孩子为 null
    if (root.right == null) {
        temp.add(root.val);
        hasPathSumHelper(root.left, sum - root.val, temp, ans);
        temp.remove(temp.size() - 1);
        return;
    }
    temp.add(root.val);
    hasPathSumHelper(root.right, sum - root.val, temp, ans);
    temp.remove(temp.size() - 1);

    temp.add(root.val);
    hasPathSumHelper(root.left, sum - root.val, temp, ans);
    temp.remove(temp.size() - 1);
}
```

# 解法二 DFS 栈

[112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>) 中解法二讲的是`BFS`，但是对于这道题由于我们要保存一条一条的路径，而`BFS`是一层一层的进行的，到最后一层一次性会得到很多条路径。这就导致遍历过程中，我们需要很多`list`来保存不同的路径，对于这道题是不划算的。

所以这里我们看 [112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>) 利用栈实现的`DFS`。

看一下之前用后序遍历实现的代码。

```java
public boolean hasPathSum(TreeNode root, int sum) {
    List<Integer> result = new LinkedList<>();
    Stack<TreeNode> toVisit = new Stack<>();
    TreeNode cur = root;
    TreeNode pre = null;
    int curSum = 0; //记录当前的累计的和
    while (cur != null || !toVisit.isEmpty()) {
        while (cur != null) {
            toVisit.push(cur); // 添加根节点
            curSum += cur.val;
            cur = cur.left; // 递归添加左节点
        }
        cur = toVisit.peek(); // 已经访问到最左的节点了
        //判断是否满足条件
        if (curSum == sum && cur.left == null && cur.right == null) {
            return true;
        }
        // 在不存在右节点或者右节点已经访问过的情况下，访问根节点
        if (cur.right == null || cur.right == pre) {
            TreeNode pop = toVisit.pop();
            curSum -= pop.val; //减去出栈的值
            pre = cur;
            cur = null;
        } else {
            cur = cur.right; // 右节点还没有访问过就先访问右节点
        }
    }
    return false;
}
```

和解法一一样，我们需要`ans`变量和`temp`变量，同样需要注意`temp`是对象，是引用传递。

```java
public List<List<Integer>> pathSum(TreeNode root, int sum) {
    Stack<TreeNode> toVisit = new Stack<>();
    List<List<Integer>> ans = new ArrayList<>();
    List<Integer> temp = new ArrayList<>();
    TreeNode cur = root;
    TreeNode pre = null;
    int curSum = 0; // 记录当前的累计的和
    while (cur != null || !toVisit.isEmpty()) {
        while (cur != null) {
            toVisit.push(cur); // 添加根节点
            curSum += cur.val;
            /************修改的地方******************/
            temp.add(cur.val);
            /**************************************/
            cur = cur.left; // 递归添加左节点
        }
        cur = toVisit.peek(); // 已经访问到最左的节点了
        // 判断是否满足条件
        if (curSum == sum && cur.left == null && cur.right == null) {
            /************修改的地方******************/
            ans.add(new ArrayList<>(temp));
            /**************************************/
        }
        // 在不存在右节点或者右节点已经访问过的情况下，访问根节点
        if (cur.right == null || cur.right == pre) {
            TreeNode pop = toVisit.pop();
            curSum -= pop.val; // 减去出栈的值
            /************修改的地方******************/
            temp.remove(temp.size() - 1);
            /**************************************/
            pre = cur;
            cur = null;
        } else {
            cur = cur.right; // 右节点还没有访问过就先访问右节点
        }
    }
    return ans;
}
```

# 总

和 [112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>)  没什么区别，主要是注意函数传对象的时候，我们传的不是对象的副本，只是传了一个引用。