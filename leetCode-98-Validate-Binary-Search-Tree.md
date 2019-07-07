# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/98.jpg)

输入一个树，判断该树是否是合法二分查找树，[95](<https://leetcode.wang/leetCode-95-Unique-Binary-Search-TreesII.html>)题做过生成二分查找树。二分查找树定义如下：

> 1. 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
> 2. 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
> 3. 任意节点的左、右子树也分别为二叉查找树；
> 4. 没有键值相等的节点。

# 解法一

开始的时候以为可以很简单的用递归写出来。想法是，左子树是合法二分查找树，右子树是合法二分查找树，并且根节点大于左孩子，小于右孩子，那么当前树就是合法二分查找树。代码如下：

```java
public boolean isValidBST(TreeNode root) {
    if (root == null) {
        return true;
    }
    boolean leftVailid = true;
    boolean rightVaild = true;
    if (root.left != null) {
        //大于左孩子并且左子树是合法二分查找树
        leftVailid = root.val > root.left.val && isValidBST(root.left);
    }
    if (!leftVailid) {
        return false;
    }
    if (root.right != null) {
        //小于右孩子并且右子树是合法二分查找树
        rightVaild = root.val < root.right.val && isValidBST(root.right);
    }
    return rightVaild;
}
```

当然，这个解法没有通过。对于下面的解，结果利用上边的解法是错误的。

```java
     10
    /  \
   5   15
      /  \
     6   20
```

虽然满足左子树是合法二分查找树，右子树是合法二分查找树，并且根节点大于左孩子，小于右孩子，但这个树不是合法的二分查找树。因为右子树中的 6 小于当前根节点 10。所以我们不应该判断「根节点大于左孩子，小于右孩子」，而是判断「根节点大于左子树中最大的数，小于右子树中最小的数」。

```java
public boolean isValidBST(TreeNode root) {
    if (root == null || root.left == null && root.right == null) {
        return true;
    }
    //左子树是否合法
    if (isValidBST(root.left)) {
        if (root.left != null) {
            int max = getMaxOfBST(root.left);//得到左子树中最大的数
            if (root.val <= max) { //相等的情况，代表有重复的数字
                return false;
            }
        }

    } else {
        return false;
    }

    //右子树是否合法
    if (isValidBST(root.right)) {
        if (root.right != null) {
            int min = getMinOfBST(root.right);//得到右子树中最小的数
            if (root.val >= min) { //相等的情况，代表有重复的数字
                return false;
            }
        }

    } else {
        return false;
    }
    return true;
}

private int getMinOfBST(TreeNode root) {
    int min = root.val;
    while (root != null) {
        if (root.val <= min) {
            min = root.val;
        }
        root = root.left;
    }
    return min;
}

private int getMaxOfBST(TreeNode root) {
    int max = root.val;
    while (root != null) {
        if (root.val >= max) {
            max = root.val;
        }
        root = root.right;
    }
    return max;
}
```

# 解法二

来利用另一种思路，参考[官方题解](<https://leetcode.com/problems/validate-binary-search-tree/solution/>)。

解法一中，我们是判断根节点是否合法，找到了左子树中最大的数，右子树中最小的数。 由左子树和右子树决定当前根节点是否合法。

但如果正常的来讲，明明先有的根节点，按理说根节点是任何数都行，而不是由左子树和右子树限定。相反，根节点反而决定了左孩子和右孩子的合法取值范围。

所以，我们可以从根节点进行 DFS，然后计算每个节点应该的取值范围，如果当前节点不符合就返回 false。

```java
      10
    /    \
   5     15
  / \    /  
 3   6  7 
    
   考虑 10 的范围
     10(-inf,+inf)
    
   考虑 5 的范围
     10(-inf,+inf)
    /
   5(-inf,10)
   
   考虑 3 的范围
       10(-inf,+inf)
      /
   5(-inf,10)
    /
  3(-inf,5)  
          
   考虑 6 的范围
       10(-inf,+inf)
      /
   5(-inf,10)
    /       \
  3(-inf,5)  6(5,10)
          
   考虑 15 的范围
      10(-inf,+inf)
    /          \
    5(-inf,10) 15(10,+inf）
    /       \
  3(-inf,5)  6(5,10)  
   
   考虑 7 的范围，出现不符合返回 false
       10(-inf,+inf)
     /              \
5(-inf,10)           15(10,+inf）
  /       \             /
3(-inf,5)  6(5,10)   7（10,15）   
               
            
```

可以观察到，左孩子的范围是 （父结点左边界，父节点的值），右孩子的范围是（父节点的值，父节点的右边界）。

还有个问题，java 里边没有提供负无穷和正无穷，用什么数来表示呢？

方案一，假设我们的题目的数值都是 Integer 范围的，那么我们用不在 Integer 范围的数字来表示负无穷和正无穷。用 long 去存储。

```java
public boolean isValidBST(TreeNode root) {
    long maxValue = (long)Integer.MAX_VALUE + 1;
    long minValue = (long)Integer.MIN_VALUE - 1;
    return getAns(root, minValue, maxValue);
}

private boolean getAns(TreeNode node, long minVal, long maxVal) {
    if (node == null) {
        return true;
    }
    if (node.val <= minVal) {
        return false;
    }
    if (node.val >= maxVal) {
        return false;
    }
    return getAns(node.left, minVal, node.val) && getAns(node.right, node.val, maxVal);
}
```



方案二：传入 Integer 对象，然后 null 表示负无穷和正无穷。然后利用 JAVA 的自动装箱拆箱，数值的比较可以直接用不等号。

```java
public boolean isValidBST(TreeNode root) {
    return getAns(root, null, null);
}

private boolean getAns(TreeNode node, Integer minValue, Integer maxValue) { 
    if (node == null) {
        return true;
    }
    if (minValue != null && node.val <= minValue) {
        return false;
    }
    if (maxValue != null && node.val >= maxValue) {
        return false;
    }
    return getAns(node.left, minValue, node.val) && getAns(node.right, node.val, maxValue);
}
```
# 解法三 DFS BFS

解法二其实就是树的 DFS，也就是二叉树的先序遍历，然后在遍历过程中，判断当前的值是是否在区间中。所以我们可以用栈来模拟递归过程。

```java
public boolean isValidBST(TreeNode root) {
    if (root == null || root.left == null && root.right == null) {
        return true;
    }
    //利用三个栈来保存对应的节点和区间
    LinkedList<TreeNode> stack = new LinkedList<>();
    LinkedList<Integer> minValues = new LinkedList<>();
    LinkedList<Integer> maxValues = new LinkedList<>();
    //头结点入栈
    TreeNode pNode = root;
    stack.push(pNode);
    minValues.push(null);
    maxValues.push(null);
    while (pNode != null || !stack.isEmpty()) {
        if (pNode != null) {
            //判断栈顶元素是否符合
            Integer minValue = minValues.peek();
            Integer maxValue = maxValues.peek();
            TreeNode node = stack.peek();
            if (minValue != null && node.val <= minValue) {
                return false;
            }
            if (maxValue != null && node.val >= maxValue) {
                return false;
            }
            //将左孩子加入到栈
            if(pNode.left!=null){
                stack.push(pNode.left);
                minValues.push(minValue);
                maxValues.push(pNode.val);
            }

            pNode = pNode.left;
        } else { // pNode == null && !stack.isEmpty()
            //出栈，将右孩子加入栈中
            TreeNode node = stack.pop();
            minValues.pop();
            Integer maxValue = maxValues.pop();
            if(node.right!=null){
                stack.push(node.right);
                minValues.push(node.val);
                maxValues.push(maxValue);
            }
            pNode = node.right;
        }
    }
    return true;
}
```

上边的 DFS 可以看出来一个缺点，就是我们判断完当前元素后并没有出栈，后续还会回来得到右孩子后才会出栈。所以其实我们可以用 BFS，利用一个队列，一层一层的遍历，遍历完一个就删除一个。

```java
public boolean isValidBST(TreeNode root) {
    if (root == null || root.left == null && root.right == null) {
        return true;
    }
    //利用三个队列来保存对应的节点和区间
    Queue<TreeNode> queue = new LinkedList<>();
    Queue<Integer> minValues = new LinkedList<>();
    Queue<Integer> maxValues = new LinkedList<>();
    //头结点入队列
    TreeNode pNode = root;
    queue.offer(pNode);
    minValues.offer(null);
    maxValues.offer(null);
    while (!queue.isEmpty()) {
        //判断队列的头元素是否符合条件并且出队列
        Integer minValue = minValues.poll();
        Integer maxValue = maxValues.poll();
        pNode = queue.poll();
        if (minValue != null && pNode.val <= minValue) {
            return false;
        }
        if (maxValue != null && pNode.val >= maxValue) {
            return false;
        }
        //左孩子入队列
        if(pNode.left!=null){
            queue.offer(pNode.left);
            minValues.offer(minValue);
            maxValues.offer(pNode.val);
        }
        //右孩子入队列
        if(pNode.right!=null){
            queue.offer(pNode.right);
            minValues.offer(pNode.val);
            maxValues.offer(maxValue);
        } 
    }
    return true;
}
```

# 解法四 中序遍历

参考[这里](<https://leetcode.com/problems/validate-binary-search-tree/discuss/32112/Learn-one-iterative-inorder-traversal-apply-it-to-multiple-tree-questions-(Java-Solution)>)。

解法三中我们用了先序遍历 和 BFS，现在来考虑中序遍历。中序遍历在 [94](<https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html>) 题中已经考虑过了。那么中序遍历在这里有什么好处呢？

中序遍历顺序会是左孩子，根节点，右孩子。二分查找树的性质，左孩子小于根节点，根节点小于右孩子。

是的，如果我们将中序遍历的结果输出，那么将会到的一个从小到大排列的序列。

所以我们只需要进行一次中序遍历，将遍历结果保存，然后判断该数组是否是从小到大排列的即可。

更近一步，由于我们只需要临近的两个数的相对关系，所以我们只需要在遍历过程中，把当前遍历的结果和上一个结果比较即可。

```java
public boolean isValidBST(TreeNode root) {
    if (root == null) return true;
    Stack<TreeNode> stack = new Stack<>();
    TreeNode pre = null;
    while (root != null || !stack.isEmpty()) {
        while (root != null) {
            stack.push(root);
            root = root.left;
        }
        root = stack.pop();
        if(pre != null && root.val <= pre.val) return false;
        pre = root;
        root = root.right;
    }
    return true;
}
```

# 总

这几天都是二叉树的相关题，主要是对前序遍历，中序遍历的理解，以及 DFS，如果再用好递归，利用栈模拟递归，题目就很好解了。