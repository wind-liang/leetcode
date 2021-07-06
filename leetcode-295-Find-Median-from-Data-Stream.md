# 题目描述（困难难度）

295、Find Median from Data Stream

Median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value. So the median is the mean of the two middle value.

For example,

```
[2,3,4]`, the median is `3
[2,3]`, the median is `(2 + 3) / 2 = 2.5
```

Design a data structure that supports the following two operations:

- void addNum(int num) - Add a integer number from the data stream to the data structure.
- double findMedian() - Return the median of all elements so far.

 

**Example:**

```
addNum(1)
addNum(2)
findMedian() -> 1.5
addNum(3) 
findMedian() -> 2
```

 

**Follow up:**

1. If all integer numbers from the stream are between 0 and 100, how would you optimize it?
2. If 99% of all integer numbers from the stream are between 0 and 100, how would you optimize it?

设计一个数据结构，提过两个接口，添加数字和返回当前集合内的中位数。

# 解法一

先分享 [官方](https://leetcode.com/problems/find-median-from-data-stream/solution/) 给我们提供的两个最容易的解法。

把添加的数字放到 `list` 中，如果需要返回中位数，把 `list` 排序即可。

```java
class MedianFinder {
    List<Integer> list = new ArrayList<>();

    /** initialize your data structure here. */
    public MedianFinder() {

    }

    public void addNum(int num) {
        list.add(num);
    }

    public double findMedian() {
        Collections.sort(list);
        int n = list.size();
        if ((n & 1) == 1) {
            return list.get(n / 2);
        } else {
            return ((double) list.get(n / 2) + list.get(n / 2 - 1)) / 2;
        }
    }
}
```

简单明了。但是时间复杂度有点儿高，对于 `findMedian` 函数，因为每次都需要排序。如果是快速排序，那时间复杂度也是 `O(nlog(n))`。

这里可以做一个简单的优化。我们不需要每次返回中位数都去排序。我们可以将排序融入到 `addNum` 中，假设之前已经有序了，然后将添加的数字插入到相应的位置即可。也就是插入排序的思想。

```java
class MedianFinder {
	List<Integer> list = new ArrayList<>();

	/** initialize your data structure here. */
	public MedianFinder() {

	}

	public void addNum(int num) {
		int i = 0;
		// 寻找第一个大于 num 的数的下标
		for (; i < list.size(); i++) {
			if (num < list.get(i)) {
				break;
			}
		}
		// 将当前数插入
		list.add(i, num);
	}

	public double findMedian() {
		int n = list.size();
		if ((n & 1) == 1) {
			return list.get(n / 2);
		} else {
			return ((double) list.get(n / 2) + list.get(n / 2 - 1)) / 2;
		}
	}
}
```

上边的话 `findMedian()` 就不需要排序了，时间复杂度就是 `O(1)`了。对于 `addNum()` 函数的话时间复杂度就是 `O(n)` 了。

`addNum()` 还可以做一点优化。因为我们要在有序数组中寻找第一个大于 `num` 的下标，提到有序数组找某个值，可以想到二分的方法。

```java
public void addNum(int num) {
    int insert = -1;
    int low = 0;
    int high = list.size() - 1;
    while (low <= high) {
        int mid = (low + high) >>> 1;
        if (num <= list.get(mid)) {
            //判断 num 是否大于等于前边的数
            int pre = mid > 0 ? list.get(mid - 1) : Integer.MIN_VALUE;
            if (num >= pre) {
                insert = mid;
                break;
            } else {
                high = mid - 1;
            }
        } else {
            low = mid + 1;
        }
    }
    if (insert == -1) {
        insert = list.size();
    }
    // 将当前数插入
    list.add(insert, num);
}
```

虽然我们使用了二分去查找要插入的位置，对应的时间复杂度是 `O(log(n))`，但是 `list.add(insert, num)` 的时间复杂度是 `O(n)`。所以整体上依旧是 `O(n)`。

参考 [这里](https://leetcode.com/problems/find-median-from-data-stream/discuss/74057/Tired-of-TWO-HEAPSET-solutions-See-this-segment-dividing-solution-(c%2B%2B))，还能继续优化，这个思想也比较常见，分享一下。

我们每次添加数字的时候，都需要从所有数字中寻找要插入的位置，如果数字太多的话，速度会很慢。

我们可以将数字分成若干个子序列，类似于下图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/295_2.jpg)

上边每一个长方形内数字都是有序的。添加数字的时候，分成两步。先找到数字应该加入的长方形，然后将数字添加到该长方形内。这样做的好处很明显，我们只需要将数字加入长方形内的有序数列中，长方形内的数字个数相对于整个序列会小很多。

我们可以设置每个长方形内最多存多少数字，如果超过了限制，就将长方形平均分成两个。

举个简单的例子，接着上图，假设每个长方形内最多存 `3` 个数字，现在添加数字 `9`。

我们首先找到 `9` 应该属于第 `2` 个长方形，然后将 `9` 插入。然后发现此时的数量超过了 `3` 个，此时我们就把该长方形平均分成两个，如下图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/295_3.jpg)

至于最多存多少，我们可以根据总共有多少个数字来自己设定。但不是很好控制，太小了的话，寻找长方形的时候比较耗时间，太大的话，加入到长方形里的时候比较耗时间。事先不知道数字有多少的话，就更麻烦了。

[StefanPochmann](https://leetcode.com/stefanpochmann)  大神提出了一个建议。我们可以将大小设置成一个动态的，每个长方形最多存多少根据当前数字的总个数实时改变。假设当前数字总量是 `n`。长方形里数字个数是 `len` ，如果 `len * len > n` ，那么当前长方形就分割为两个。也就是每个长方形最多存 `sqrt(n)` 个数字。

这里我就偷个懒了，直接分享下 [@mission4success](https://leetcode.com/mission4success) 的代码。主要就是找长方形以及找中位数那里判断的情况会多一些。

```java
public class MedianFinder {
    private LinkedList<LinkedList<Integer>> buckets; // store all ranges
    private int total_size;

    MedianFinder() {
        total_size = 0;
        buckets = new LinkedList<>();
        buckets.add(new LinkedList<>());
    }

    void addNum(int num) {
        List<Integer> correctRange = new LinkedList<>();
        int targetIndex = 0;

        // find the correct range to insert given num
        for (int i = 0; i < buckets.size(); i++) {
            if (buckets.size() == 1 ||
                    (i == 0 && num <= buckets.get(i).getLast()) ||
                    (i == buckets.size() - 1 && num >= buckets.get(i).getFirst()) ||
                    (buckets.get(i).getFirst() <= num && num <= buckets.get(i).getLast()) ||
                    (num > buckets.get(i).getLast() && num < buckets.get(i+1).getFirst())) {
                        correctRange = buckets.get(i);
                        targetIndex = i;
                        break;
            }
        }

        // put num at back of correct range, and sort it to keep increasing sequence
        total_size++;
        correctRange.add(num);
        Collections.sort(correctRange);

        // if currentRange's size > threshold, split it into two halves and add them back to buckets
        int len = correctRange.size();
        //if (len > 10) {
        if (len * len > total_size) {
            LinkedList<Integer> half1 = new LinkedList<>(correctRange.subList(0, (len) / 2));
            LinkedList<Integer> half2 = new LinkedList<>(correctRange.subList((len) / 2, len));

            buckets.set(targetIndex, half1); //replaces
            buckets.add(targetIndex + 1, half2); //inserts
        }

    }

    // iterate thru all ranges in buckets to find median value
    double findMedian() {
        if (total_size==0)
            return 0;

        int mid1 = total_size/2;
        int mid2 = mid1 + 1;

        int leftCount=0;
        double first = 0.0, second = 0.0;
        for (List<Integer> bucket : buckets) {
            if (leftCount<mid1 && mid1<=leftCount+bucket.size())
                first = bucket.get(mid1 - leftCount - 1);

            if (leftCount<mid2 && mid2<=leftCount+bucket.size()) {
                second = bucket.get(mid2 - leftCount - 1);
                break;
            }
            leftCount += bucket.size();
        }

        if (total_size % 2 != 0)
            return second;
        else
            return (first + second)/2;
    }
}
```

# 解法二

分享 [这里](https://leetcode.com/problems/find-median-from-data-stream/discuss/74166/Solution-using-Binary-Search-Tree) 的解法。

可以借助二分查找树，二分查找树的性质。

> 1. 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
> 2. 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
> 3. 任意节点的左、右子树也分别为二叉查找树；
> 4. 没有键值相等的节点。

如果我们将数字存到二分查找树中，当找中位数的时候有一个明显的好处。如果我们知道了左子树的数量 `leftNum` ，找假设把数据排序后的第 `k` 个数，`k` 从 `0` 计数。

如果 `leftNum == k` ，那么根节点就是我们要找的。

如果 `leftNum > k`，我们只需要再从左子树中找第 `k` 个数。

如果 `leftNum < k`，我们只需要从右子树中找第 `k - leftNum - 1` 个数。

代码的话，我们首先定义一个二分查找树。和普通的二分查找树不同的地方在于，节点多了一个成员变量，记录以当前节点为根节点的二叉树的总节点数量。

此外实现了 `find` 函数，来返回有序情况下第 `k` 个节点的值。

```java
class BST {
    class Node {
        int val;
        int size;
        Node left, right;

        Node(int v) {
            val = v;
            size = 1;
        };
    };

    private Node root;

    BST() {

    }

    public void add(int val) {
        // 新增节点
        Node newNode = new Node(val);
        // 当前节点
        Node current = root;
        // 上个节点
        Node parent = null;
        // 如果根节点为空
        if (current == null) {
            root = newNode;
            return;
        }
        while (true) {
            parent = current;
            //向左子树添加节点
            if (val < current.val) {
                current = current.left;
                parent.size++;
                if (current == null) {
                    parent.left = newNode;
                    return;
                }
            //向右子树添加节点    
            } else {
                current = current.right;
                parent.size++;
                if (current == null) {
                    parent.right = newNode;
                    return;
                }
            }
        }

    }

    public int find(int k) {
        Node t = root;
        while (true) {
            int leftSize = t.left != null ? t.left.size : 0;
            if (leftSize == k)
                return t.val;
            if (leftSize > k) {
                t = t.left;
            } else {
                k = k - leftSize - 1;
                t = t.right;
            }
        }
    }

    public int size() {
        return root.size;
    }
};

class MedianFinder {
    BST bst;

    MedianFinder() {
        bst = new BST();
    }

    // Adds a number into the data structure.
    public void addNum(int num) {
        bst.add(num);
    }

    public double findMedian() {
        int num = bst.size();
        if (num % 2 == 0) {
            return ((double)bst.find(num / 2) + bst.find(num / 2 - 1)) / 2;
        } else {
            return bst.find(num / 2);
        }

    }
};
```

时间复杂度的话，最好的情况 `addNum` 和 `findMedian` 都是 `O(log(n))`。但如果二叉树分布不均，类似于下边这种，那么时间复杂度就都是 `O(n)` 了。

```java
  1
   \
    2
     \
      3
       \
        4
```

# 解法三

分享一下我最开始的想法。

什么是中位数？如果是偶数个数字，我们把它分成两个集合。左边的集合的所有数字小于右边集合的所有数字。中位数就是左边集合最大数和右边集合最小的数取一个平均数。

想到上边这个点，会发现我们只关心集合的最大数和最小数，立马就会想到优先队列。

添加数字的时候，我们把数字放到两个优先队列中。始终保证两个优先队列的大小相等。如果总数是奇数，我们就让左边集合多一个数。

有了上边的想法可以写代码了，代码大家写出来应该都不一样，分享下我的代码。

```java
class MedianFinder {
    //左边的队列，每次取最大值
    Queue<Integer> leftQueue = new PriorityQueue<>(new Comparator<Integer>() {
        @Override
        public int compare(Integer i1, Integer i2) {
            return i2 - i1;
        }
    });
    //右边的队列，每次取最小值
    Queue<Integer> rightQueue = new PriorityQueue<>();

    double median = 0; //保存当前的中位数

    /** initialize your data structure here. */
    public MedianFinder() {
    }

    public void addNum(int num) {
        int leftSize = leftQueue.size();
        int rightSize = rightQueue.size();
        //如果当前数量相等
        if (leftSize == rightSize) {
            //当前没有数字，将将数字加到左半部分
            if (leftSize == 0) {
                leftQueue.add(num);
                return;
            }
            //当前数字小于等于右半部分最小的数字, num 属于左边
            if (num <= rightQueue.peek()) {
                leftQueue.add(num);
            //当前数字大于右半部分最小的数字, num 应该属于右边    
            } else {
                //维持两边平衡. 将右边拿出一个放到左边
                leftQueue.add(rightQueue.poll());
                //将 num 放到右边
                rightQueue.add(num);
            }
        //如果当前数量不等
        } else {
            //num 大于等于左边最大的数字, num 属于右边
            if (num >= leftQueue.peek()) {
                rightQueue.add(num);
            //num 小于左边最大的数字, num 应该属于左边  
            } else {
                //维持两边平衡, 左边拿出一个放到右边
                rightQueue.add(leftQueue.poll());
                //左边将 num 放入
                leftQueue.add(num);
            }
        }
    }

    public double findMedian() {
        if (leftQueue.size() > rightQueue.size()){
            return leftQueue.peek();
        }else{
            return ((double)leftQueue.peek() + rightQueue.peek()) / 2;
        }
    }
}
```

上边代码由于使用了优先队列，`addNum()` 的时间复杂度就是 `O(log(n))`。`findMedian()`的时间复杂度是 `O(1)`。上边为了保持两边集合的数量关系，写的代码比较多。再看一下 [stefanpochmann 大神](https://leetcode.com/problems/find-median-from-data-stream/discuss/74062/Short-simple-JavaC%2B%2BPython-O(log-n)-%2B-O(1)) 同样思路下的代码。

```java
class MedianFinder {
    private Queue<Long> left = new PriorityQueue(),
    right = new PriorityQueue();

    public void addNum(int num) {
        left.add((long) num);
        right.add(-left.poll());
        if (left.size() < right.size())
            left.add(-right.poll());
    }

    public double findMedian() {
        return left.size() > right.size()
            ? left.peek()
            : (left.peek() - right.peek()) / 2.0;
    }
};
```

简洁而优雅，这大概就是艺术吧。

他首先将数字加入到左边，然后再拿一个数字加到右边。然后判断一下左边数量是否小于右边，如果是的话将从右边拿回一个放到左边。

当加入新的数字之前，不管两边集合数字的数量相等，还是左边比右边多一个。通过上边的代码，依旧可以保证添加完数字以后两边的数量相等或者左边比右边多一个。

还使用了一个技巧，会发现它是用了两个默认的优先队列。对于右边的优先队列添加元素的时候将原来的数字取了相反数。这样做的好处就是，不管默认的优先队列是取最大数，还是取最小数。由于其中一个添加元素使用的是相反数，最终实现的效果就是两个优先队列一定是相反的效果。如果其中一个是取最小数，另外一个就是取最大数。

因为使用了相反数，对于 `-Integer.MIN_VALUE` 会溢出，所以我们添加元素的时候强转成了 `long`。



# 扩展

If all integer numbers from the stream are between 0 and 100, how would you optimize it?

分享 [这里](https://leetcode.com/problems/find-median-from-data-stream/discuss/286238/Java-Simple-Code-Follow-Up) 的思路。

这样的话，我们可以用一个数组，`num[i]`记录数字 `i` 的数量。此外用一个变量 `n` 统计当前数字的总数量。这样求中位数的时候，我们只需要找到第 `n/2+1`个数或者 `n/2,n/2+1`个数即可。注意因为这里计数是从`1` 开始的，所以和解法一看起来找到数字不一样，解法一找的是下标。

```java
class MedianFinder {
    int[] backets = new int[101];
    int n = 0;

    public MedianFinder() {

    }

    public void addNum(int num) {
        backets[num]++;
        n++;
    }

    public double findMedian() {

        int count = 0;
        int right = 0;
        //如果是 5 个数，就寻找第 5 / 2 + 1 = 3 个数
        while (true) {
            count += backets[right];
            if (count >= n / 2 + 1) {
                break;
            }
            right++;
        }
        //奇数的情况直接返回
        if ((n & 1) == 1) {
            return right;
        }
        //如果是 4 个数, 之前找到了第 4/2+1=3 个数, 还需要前一个数
        int left;
        //如果之前找的数只占一个, 向前寻找上一个数
       	if (backets[right] == 1) {
			int temp = right - 1;
			while (backets[temp] == 0) {
				temp--;
			}
			left = temp;
        //如果之前找的数占多个, 前一个数等于当前数
		} else {
			left = right;
		}
        return (left + right) / 2.0;

    }
}
```

If 99% of all integer numbers from the stream are between 0 and 100, how would you optimize it?

这个也没有说清楚，我们假设一种简单的情况。当调用 `findMedian` 的时候，解一定落在 `0 - 100` 之中。那么接着上边的代码，我们只需要增加一个变量 `less`，记录小于 `0` 的个数。原来找第 `n / 2 + 1` 个数，现在找第`n/2 - less + 1`就可以了。

如果调用 `findMedian` 的时候解落在哪里不一定，那么我们就增加两个 `list` 分别来保存小于 `0` 和大于 `100` 的数即可。

# 再扩展

题目说的是从数据流中找到中位数。如果这个数据流很大，很大，无法全部加载到内存呢？

分享 [这里](https://stackoverflow.com/questions/10657503/find-running-median-from-a-stream-of-integers/10693752#10693752) 的想法。

如果数据整体呈某种概率分布，比如正态分布。我们可以通过 `reservoir sampling ` 的方法。我们保存固定数量的数字，当存满的时候，就随机替代掉某个数字。伪代码如下：

```c
int n = 0;  // Running count of elements observed so far  
#define SIZE 10000
int reservoir[SIZE];  

while(streamHasData())
{
  int x = readNumberFromStream();

  if (n < SIZE)
  {
       reservoir[n++] = x;
  }         
  else 
  {
      int p = random(++n); // Choose a random number 0 >= p < n
      if (p < SIZE)
      {
           reservoir[p] = x;
      }
  }
}
```

相当于从一个大的数据集下进行了取样，然后找中位数的时候，把我们保存的数组排个序去找就可以了。

# 总

总结了好多，但 [Solution](https://leetcode.com/problems/find-median-from-data-stream/solution/) 里提到的还有一些没有介绍，主要就是涉及到一些新的数据结构，比如 `Multiset ` 、`Segment Trees ` 和 ` Order Statistic Trees`，之前也没怎么用过，这里先留坑吧。

针对这道题最优的话还是优先队列比较好，既简单，又容易想到。其他的解法可以当扩展思路了，其中用到的一些思想都很有意思。