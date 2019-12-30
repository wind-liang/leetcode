# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/207.jpg)

给定 `n` 组先修课的关系，`[m,n]` 代表在上 `m` 这门课之前必须先上 `n` 这门课。输出能否成功上完所有课。

# 解法一

把所有的关系可以看做图的边，所有的边构成了一个有向图。

对于`[[1,3],[1,4],[2,4],[3,5],[3,6],[4,6]]` 就可以看做下边的图，箭头指向的是需要先上的课。

![](https://windliang.oss-cn-beijing.aliyuncs.com/207_2.jpg)

想法很简单，要想上完所有的课，一定会有一些课没有先修课，比如上图的 `5`、`6`。然后我们可以把 `5` 和 `6` 节点删去。

![](https://windliang.oss-cn-beijing.aliyuncs.com/207_3.jpg)

然后 `3` 和 `4` 就可以上了，同样的道理再把 `3` 和 `4` 删去。

接下来就可以去学 `1` 和 `2` 了。因此可以完成所有的课。

代码的话，用邻接表表示图。此外，我们不需要真的去删除节点，我们可以用 `outNum` 变量记录所有节点的先修课门数。当删除一个节点的时候，就将相应节点的先修课个数减一即可。

最后只需要判断所有的节点的先修课门数是否全部是 `0` 即可。

```java
public boolean canFinish(int numCourses, int[][] prerequisites) {
    //保存每个节点的先修课个数，也就是出度
    HashMap<Integer, Integer> outNum = new HashMap<>();
    //保存以 key 为先修课的列表，也就是入度的节点
    HashMap<Integer, ArrayList<Integer>> inNodes = new HashMap<>();
    //保存所有节点
    HashSet<Integer> set = new HashSet<>();
    int rows = prerequisites.length;
    for (int i = 0; i < rows; i++) {
        int key = prerequisites[i][0];
        int value = prerequisites[i][1];
        set.add(key);
        set.add(value);
        if (!outNum.containsKey(key)) {
            outNum.put(key, 0);
        }
        if (!outNum.containsKey(value)) {
            outNum.put(value, 0);
        }
        //当前节点先修课个数加一
        int num = outNum.get(key);
        outNum.put(key, num + 1);

        if (!inNodes.containsKey(value)) {
            inNodes.put(value, new ArrayList<>());
        }
        //更新以 value 为先修课的列表
        ArrayList<Integer> list = inNodes.get(value);
        list.add(key);
    }

    //将当前先修课个数为 0 的课加入到队列中
    Queue<Integer> queue = new LinkedList<>();
    for (int k : set) {
        if (outNum.get(k) == 0) {
            queue.offer(k);
        }
    }
    while (!queue.isEmpty()) {
        //队列拿出来的课代表要删除的节点
        //要删除的节点的 list 中所有课的先修课个数减一
        int v = queue.poll();
        ArrayList<Integer> list = inNodes.getOrDefault(v, new ArrayList<>());

        for (int k : list) {
            int num = outNum.get(k);
            //当前课的先修课要变成 0, 加入队列
            if (num == 1) {
                queue.offer(k);
            }
            //当前课的先修课个数减一
            outNum.put(k, num - 1);
        }
    }

    //判断所有课的先修课的个数是否为 0 
    for (int k : set) {
        if (outNum.get(k) != 0) {
            return false;
        }
    }
    return true;
}
```

# 解法二 

还有另一种思路，我们只需要一门课一门课的判断。

从某门课开始遍历，我们通过 `DFS` 一条路径一条路径的判断，保证过程中没有遇到环。

![](https://windliang.oss-cn-beijing.aliyuncs.com/207_2.jpg)

深度优先遍历 `1`，相当于 `3` 条路径

`1 -> 3 -> 5`，`1 -> 3 -> 6`，`1 -> 4 -> 6`。

深度优先遍历 `2`，相当于 `1` 条路径

`2 -> 4 -> 6`。

深度优先遍历 `3`，相当于 `2` 条路径

`3 -> 5`，`3 -> 6`。

深度优先遍历 `4`，相当于 `1` 条路径

`4 -> 6`。

深度优先遍历 `5`，相当于 `1` 条路径

`5`。

深度优先遍历 `6`，相当于 `1` 条路径

`6`。

什么情况下不能完成所有课程呢？某条路径出现了环，如下图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/207_4.jpg)

出现了 `1 -> 3 -> 6 -> 3`。所以不能学完所有课程。

代码的话，用邻接表表示图。通过递归实现 `DFS` ，用 `visited` 存储当前路径上的节点。

同时用 `visitedFinish` 表示可以学完的课程，起到优化算法的作用。

```java
public boolean canFinish(int numCourses, int[][] prerequisites) {
    HashMap<Integer, ArrayList<Integer>> outNodes = new HashMap<>();
    HashSet<Integer> set = new HashSet<>();
    int rows = prerequisites.length;
    for (int i = 0; i < rows; i++) {
        int key = prerequisites[i][0];
        int value = prerequisites[i][1];
        set.add(key); 
        if (!outNodes.containsKey(key)) {
            outNodes.put(key, new ArrayList<>());
        } 
        //存储当前节点的所有先修课程
        ArrayList<Integer> list = outNodes.get(key);
        list.add(value);
    }

    HashSet<Integer> visitedFinish = new HashSet<>();
    //判断每一门课
    for (int k : set) {
        if (!dfs(k, outNodes, new HashSet<>(), visitedFinish)) {
            return false;
        }
        visitedFinish.add(k);
    }
    return true;
}

private boolean dfs(int start, HashMap<Integer, ArrayList<Integer>> outNodes, HashSet<Integer> visited,
                    HashSet<Integer> visitedFinish) {
    //已经处理过或者到了叶子节点
    if (visitedFinish.contains(start) || !outNodes.containsKey(start)) {
        return true;
    }
    //出现了环
    if (visited.contains(start)) {
        return false;
    }
    //将当前节点加入路径
    visited.add(start);
    ArrayList<Integer> list = outNodes.get(start);
    for (int k : list) {
        if(!dfs(k, outNodes, visited, visitedFinish)){
            return false;
        }
    }
    visited.remove(start);
    return true;
}
```

# 总

这道题本质上其实就是图的遍历。解法一是 `BFS` ，解法二是 `DFS` 。

解法一其实就是图的拓扑排序，解法二是判断图中是否有环的方法。

另外，图在代码中有两种表示形式，邻接表和邻接矩阵，上边的解法都采用的是邻接表。