# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/107.jpg)

树的层次遍历，和 [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>) 的不同之处是，之前输出的数组顺序是从根部一层一层的输出，现在是从底部，一层一层的输出。

# 解法一 DFS

把 [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>) 的`DFS`贴过来看一下。

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> ans = new ArrayList<>(); 
    DFS(root, 0, ans);
    return ans;
}

private void DFS(TreeNode root, int level, List<List<Integer>> ans) {
    if(root == null){
        return;
    }
    //当前层数还没有元素，先 new 一个空的列表
    if(ans.size()<=level){
        ans.add(new ArrayList<>());
    }
    //当前值加入
    ans.get(level).add(root.val);

    DFS(root.left,level+1,ans);
    DFS(root.right,level+1,ans);
} 
```

之前我们根据 level 得到数组的位置，然后添加。

```java
ans.get(level).add(root.val);

ans    [] [] [] [] [].
index  0  1  2  3  4
level  0  1  2  3  4
       ------------>
index = 0 + level

现在 level 是逆过来存的
ans    [] [] [] [] [].
index  0  1  2  3  4
level  4  3  2  1  0
       <------------
index = 4 - level

4 就是 ans 的末尾下标，就是 ans.size() - 1
所以代码变为
ans.get(ans.size() - 1 - level).add(root.val);
```

此外还有句代码要改。

```java
if(ans.size()<=level){
    ans.add(new ArrayList<>());
}
在添加当前 level 的第一个元素的时候，首先添加一个空列表到 ans 中
假设当前 level = 2，ans 中只添加了 level 是 0 和 1 的元素
ans    [3] [9] 
index   0   1  
level   1   0  
因为 level 是从右往左增加的，所以空列表要到 ans 的头部
ans     [] [3] [9] 
index   0   1   2
level   2   1   0  
所以代码改成下边的样子
 ans.add(0，new ArrayList<>());
```

综上，只要改了这两处就可以了。

```java
public List<List<Integer>> levelOrderBottom(TreeNode root) {
    List<List<Integer>> ans = new ArrayList<>();
    DFS(root, 0, ans);
    return ans;
}

private void DFS(TreeNode root, int level, List<List<Integer>> ans) {
    if (root == null) {
        return;
    }
    // 当前层数还没有元素，先 new 一个空的列表
    if (ans.size() <= level) {
        ans.add(0, new ArrayList<>());
    }
    // 当前值加入
    ans.get(ans.size() - 1 - level).add(root.val);

    DFS(root.left, level + 1, ans);
    DFS(root.right, level + 1, ans);
}
```

# 解法二 BFS

 [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>)  从根节点往下走的代码贴过来。

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    List<List<Integer>> ans = new LinkedList<List<Integer>>();
    if (root == null)
        return ans;
    queue.offer(root);
    while (!queue.isEmpty()) {
        int levelNum = queue.size(); // 当前层元素的个数
        List<Integer> subList = new LinkedList<Integer>();
        for (int i = 0; i < levelNum; i++) {
            TreeNode curNode = queue.poll();
            if (curNode != null) {
                subList.add(curNode.val); 
                queue.offer(curNode.left);
                queue.offer(curNode.right);
            }
        }
        if(subList.size()>0){
            ans.add(subList);
        }
    }
    return ans;
} 
```

`BFS`相比于`DFS`要简单些，因为`BFS`是一次性把当前层的元素都添加到`ans`中，所以我们只需要改一句代码。

```java
ans.add(subList);
```

改成添加到头部即可。

```java
ans.add(0,subList);
```

再改个函数名字， 总体代码就是

```java
public List<List<Integer>> levelOrderBottom(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    List<List<Integer>> ans = new LinkedList<List<Integer>>();
    if (root == null)
        return ans;
    queue.offer(root);
    while (!queue.isEmpty()) {
        int levelNum = queue.size(); // 当前层元素的个数
        List<Integer> subList = new LinkedList<Integer>();
        for (int i = 0; i < levelNum; i++) {
            TreeNode curNode = queue.poll();
            if (curNode != null) {
                subList.add(curNode.val);
                queue.offer(curNode.left);
                queue.offer(curNode.right);
            }
        }
        if (subList.size() > 0) {
            ans.add(0, subList);
        }
    }
    return ans;
}
```

# 总

这道题依旧考层次遍历，只需要在  [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>) 的基础上，找到 `level` 和 `index` 的对应关系即可。此外，因为我们在头部添加元素，所以用链表会好一些。如果数组的话，还得整体后移才能添加新的元素。