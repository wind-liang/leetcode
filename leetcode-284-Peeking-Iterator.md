# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/284.jpg)

给迭代器增加一个 `peek` 功能，也就是查看下一个元素，但是不从迭代器中弹出。

# 解法一

我第一反应是直接把迭代器的元素放到 `list` 中不就实现了吗？

```java
class PeekingIterator implements Iterator<Integer> {
    List<Integer> list;
    int cur = 0;

    public PeekingIterator(Iterator<Integer> iterator) {
        // initialize any member here.
        list = new ArrayList<>();
        while (iterator.hasNext())
            list.add(iterator.next());

    }

    // Returns the next element in the iteration without advancing the iterator.
    public Integer peek() {
        return list.get(cur);
    }

    // hasNext() and next() should behave the same as in the Iterator interface.
    // Override them if needed.
    @Override
    public Integer next() {
        return list.get(cur++);
    }

    @Override
    public boolean hasNext() {
        return cur < list.size();
    }
}
```

# 解法二

解法一还真的通过了，觉得自己没有 get 题目的点，然后去逛 Discuss 了，原来题目想让我们这样做，分享 [这里](https://leetcode.com/problems/peeking-iterator/discuss/72558/Concise-Java-Solution) 的代码。

我们知道构造函数传进来的迭代器已经有了 `next` 和 `haseNext` 函数，我们需要增加 `peek` 函数。我们可以加一个缓冲变量，记录当前要返回的值。

`peek` 的话只需要将缓冲变量直接返回。

`next` 的话我们需要更新缓冲变量，然后将之前的缓冲变量返回即可。

```java
class PeekingIterator implements Iterator<Integer> {  
    private Integer next = null;//缓冲变量
    private Iterator<Integer> iter;

    public PeekingIterator(Iterator<Integer> iterator) {
        // initialize any member here.
        iter = iterator;
        if (iter.hasNext()){
             next = iter.next();
        }
           
    }
    
    // Returns the next element in the iteration without advancing the iterator. 
    public Integer peek() {
        return next; 
    }

    // hasNext() and next() should behave the same as in the Iterator interface.
    // Override them if needed.
    @Override
    public Integer next() {
        Integer res = next;
        next = iter.hasNext() ? iter.next() : null;
        return res; 
    }

    @Override
    public boolean hasNext() {
        return next != null;
    }
}
```

# 总

其实是比较简单的一道题，用到的思想也比较简单，增加了一个缓冲变量来实现 `peek` 的功能。