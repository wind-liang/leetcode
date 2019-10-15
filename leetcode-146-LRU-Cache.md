# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/146.jpg)

`LRU` 缓存。存储空间有限，当存满的时候的一种淘汰策略。`LRU` 选择删除最远一次操作过的元素，操作包括`get` 或者 `put` 。换句话讲，最开始 `put` 进去的如果没有进行过 `get`，那存满的时候就先删它。

# 思路分析

看到 `O(1)` 的空间复杂度首先想到的就是用 `HashMap` 去存储。

之后的问题就是怎么实现，当存满的时候删除最远一次操作过的元素。

可以用一个链表，每 `put` 一个 元素，就把它加到链表尾部。如果 `get` 某个元素，就把这个元素移动到链表尾部。当存满的时候，就把链表头的元素删除。

接下来还有一个问题就是，移动某个元素的时候，我们可以通过 `HashMap` 直接得到这个元素，但对于链表，如果想移动一个元素，肯定需要知道它的前一个节点才能操作。

而找到前一个元素，最直接的方法就是遍历一遍，但是这就使得算法的时间复杂度就不再是 `O(1)` 了。

另一种思路，就是使用双向链表，这样就可以直接得到它的前一个元素，从而实现移动操作。

综上，`HashMap` 加上双向链表即可解这道题了。

#  解法一

有了上边的思路，接下来就是实现上的细节了，最后的参考图如下。

![](https://windliang.oss-cn-beijing.aliyuncs.com/146_2.jpg)

首先定义节点。

```java
class MyNode {
    Object key;
    Object value;
    MyNode prev = null;
    MyNode next = null;
    MyNode(Object k, Object v) {
        key = k;
        value = v;
    }
}
```

定义双向链表类。

这里用了一个 `dummyHead` ，也就是哨兵节点，不存数据，可以把链表头结点等效于其他的节点，从而简化一些操作。

```java
class DoubleLinkedList {
    private MyNode dummyHead = new MyNode(null, null); // 头节点
    private MyNode tail = dummyHead;
	//添加节点到末尾
    public void add(MyNode myNode) {
        tail.next = myNode;
        myNode.prev = tail;
        tail = myNode;
    }
	
    //得到头结点
    public MyNode getHead() {
        return dummyHead.next;
    }
	
    //移除当前节点
    public void removeMyNode(MyNode myNode) {
        myNode.prev.next = myNode.next;
        //判断删除的是否是尾节点
        if (myNode.next != null) {
            myNode.next.prev = myNode.prev;
        } else {
            tail = myNode.prev;
        }
        //全部指向 null
        myNode.prev = null;
        myNode.next = null;
    }
	
    //移动当前节点到末尾
    public void moveToTail(MyNode myNode) {
        removeMyNode(myNode);
        add(myNode);
    }
}
```

接下来就是我们的 `LRU` 类。

```java
public class LRUCache {
    private int capacity = 0;
    private HashMap<Integer, MyNode> map = new HashMap<>();
    private DoubleLinkedList list = new DoubleLinkedList();

    public LRUCache(int capacity) {
        this.capacity = capacity;
    }
	
    //get 的同时要把当前节点移动到末尾
    public int get(int key) {
        if (map.containsKey(key)) {
            MyNode myNode = map.get(key);
            list.moveToTail(myNode);
            return (int) myNode.value;
        } else {
            return -1;
        }
    }
    
    //对于之前存在的节点单独考虑
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            MyNode myNode = map.get(key);
            myNode.value = value;
            list.moveToTail(myNode);
        } else {
            //判断是否存满
            if (map.size() == capacity) {
                //从 map 和 list 中都删除头结点
                MyNode head = list.getHead();
                map.remove((int) head.key);
                list.removeMyNode(head);
                //插入当前元素
                MyNode myNode = new MyNode(key, value);
                list.add(myNode);
                map.put(key, myNode);
            } else {
                MyNode myNode = new MyNode(key, value);
                list.add(myNode);
                map.put(key, myNode);
            }
        }
    }
}
```

接下来把上边的代码放在一起就可以了。

```java
class MyNode {
    Object key;
    Object value;
    MyNode prev = null;
    MyNode next = null;
    MyNode(Object k, Object v) {
        key = k;
        value = v;
    }
}

class DoubleLinkedList {
    private MyNode dummyHead = new MyNode(null, null); // 头节点
    private MyNode tail = dummyHead;
	//添加节点到末尾
    public void add(MyNode myNode) {
        tail.next = myNode;
        myNode.prev = tail;
        tail = myNode;
    }
	
    //得到头结点
    public MyNode getHead() {
        return dummyHead.next;
    }
	
    //移除当前节点
    public void removeMyNode(MyNode myNode) {
        myNode.prev.next = myNode.next;
        //判断删除的是否是尾节点
        if (myNode.next != null) {
            myNode.next.prev = myNode.prev;
        } else {
            tail = myNode.prev;
        }
        //全部指向 null
        myNode.prev = null;
        myNode.next = null;
    }
	
    //移动当前节点到末尾
    public void moveToTail(MyNode myNode) {
        removeMyNode(myNode);
        add(myNode);
    }
}

public class LRUCache {
    private int capacity = 0;
    private HashMap<Integer, MyNode> map = new HashMap<>();
    private DoubleLinkedList list = new DoubleLinkedList();

    public LRUCache(int capacity) {
        this.capacity = capacity;
    }
	
    //get 的同时要把当前节点移动到末尾
    public int get(int key) {
        if (map.containsKey(key)) {
            MyNode myNode = map.get(key);
            list.moveToTail(myNode);
            return (int) myNode.value;
        } else {
            return -1;
        }
    }
    
    //对于之前存在的节点单独考虑
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            MyNode myNode = map.get(key);
            myNode.value = value;
            list.moveToTail(myNode);
        } else {
            //判断是否存满
            if (map.size() == capacity) {
                //从 map 和 list 中都删除头结点
                MyNode head = list.getHead();
                map.remove((int) head.key);
                list.removeMyNode(head);
                //插入当前元素
                MyNode myNode = new MyNode(key, value);
                list.add(myNode);
                map.put(key, myNode);
            } else {
                MyNode myNode = new MyNode(key, value);
                list.add(myNode);
                map.put(key, myNode);
            }
        }
    }
}
```

# 总

最关键的其实就是双向链表的应用了，想到这个点其他的话就水到渠成了。