# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/133.jpg)

复制一个图，图的节点定义如下。

```java
class Node {
    public int val;
    public List<Node> neighbors;

    public Node() {}

    public Node(int _val,List<Node> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};
```

`neighbors` 是一个装 `Node` 的 `list` ，因为对象的话，`java`  变量都存储的是引用，所以复制的话要新 `new` 一个 `Node` 放到 `neighbors`。

# 思路分析

这个题其实就是对图进行一个遍历，通过 `BFS`  或者 `DFS`。需要解决的问题就是怎么添加当前节点的 `neighbors`，因为遍历当前节点的时候，它的邻居节点可能还没有生成。

# 解法一 BFS

先来一个简单粗暴的想法。

首先对图进行一个 `BFS`，把所有节点 `new` 出来，不处理 `neighbors` ，并且把所有的节点存到 `map` 中。

然后再对图做一个 `BFS`，因为此时所有的节点已经创建了，只需要更新所有节点的 `neighbors`。

```java
public Node cloneGraph(Node node) {
    if (node == null) {
        return node;
    }
    //第一次 BFS
    Queue<Node> queue = new LinkedList<>();
    Map<Integer, Node> map = new HashMap<>();
    Set<Integer> visited = new HashSet<>();
    queue.offer(node);
    visited.add(node.val);
    while (!queue.isEmpty()) {
        Node cur = queue.poll();
        //生成每一个节点
        Node n = new Node();
        n.val = cur.val;
        n.neighbors = new ArrayList<Node>();
        map.put(n.val, n);
        for (Node temp : cur.neighbors) {
            if (visited.contains(temp.val)) {
                continue;
            }
            queue.offer(temp);
            visited.add(temp.val);
        }
    }

    //第二次 BFS 更新所有节点的 neightbors
    queue = new LinkedList<>();
    queue.offer(node);
    visited = new HashSet<>();
    visited.add(node.val);
    while (!queue.isEmpty()) {
        Node cur = queue.poll();
        for (Node temp : cur.neighbors) {
            map.get(cur.val).neighbors.add(map.get(temp.val));
        }
        for (Node temp : cur.neighbors) {
            if (visited.contains(temp.val)) {
                continue;
            }
            queue.offer(temp);
            visited.add(temp.val);
        }
    }
    return map.get(node.val);
}

```

当然再仔细思考一下，其实我们不需要两次 `BFS`。

我们要解决的问题是遍历当前节点的时候，邻居节点没有生成，那么我们可以一边遍历一边生成邻居节点，就可以同时更新 `neighbors `了。

同样需要一个 `map` 记录已经生成的节点。

```java
public Node cloneGraph(Node node) {
    if (node == null) {
        return node;
    }
    Queue<Node> queue = new LinkedList<>();
    Map<Integer, Node> map = new HashMap<>();
    queue.offer(node);
    //先生成第一个节点
    Node n = new Node();
    n.val = node.val;
    n.neighbors = new ArrayList<Node>();
    map.put(n.val, n);
    while (!queue.isEmpty()) {
        Node cur = queue.poll();
        for (Node temp : cur.neighbors) {
            //没有生成的节点就生成
            if (!map.containsKey(temp.val)) {
                n = new Node();
                n.val = temp.val;
                n.neighbors = new ArrayList<Node>();
                map.put(n.val, n);
                queue.offer(temp);
            }
            map.get(cur.val).neighbors.add(map.get(temp.val));
        }
    }

    return map.get(node.val);
}
```

# 解法二 DFS

`DFS` 的话用递归即可，也用一个 `map` 记录已经生成的节点。

```java
public Node cloneGraph(Node node) {
    if (node == null) {
        return node;
    }
    Map<Integer, Node> map = new HashMap<>();
    return cloneGrapthHelper(node, map);
}

private Node cloneGrapthHelper(Node node, Map<Integer, Node> map) {
    if (map.containsKey(node.val)) {
        return map.get(node.val);
    }
    //生成当前节点
    Node n = new Node();
    n.val = node.val;
    n.neighbors = new ArrayList<Node>();
    map.put(node.val, n);
    //添加它的所有邻居节点
    for (Node temp : node.neighbors) {
        n.neighbors.add(cloneGrapthHelper(temp, map));
    }
    return n;
}
```

# 总

这道题本质上就是对图的遍历，只要想到用 `map` 去存储已经生成的节点，题目基本上就解决了。