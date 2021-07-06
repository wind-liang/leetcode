# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/57.jpg)

和[上一道](https://leetcode.windliang.cc/leetCode-56-Merge-Intervals.html)可以说是一个问题，只不过这个是给一个已经合并好的列表，然后给一个新的节点依据规则加入到合并好的列表。

# 解法一

对应 [56 题](https://leetcode.windliang.cc/leetCode-56-Merge-Intervals.html)的解法一，没看的话，可以先过去看一下。这个问题其实就是我们解法中的一个子问题，所以直接加过来就行了。

```java
public List<Interval> insert(List<Interval> intervals, Interval newInterval) { 
			Interval start = null;
			Interval end = null;
			int i_start = newInterval.start;
			int i_end =newInterval.end;
			int size = intervals.size();
			List<Interval> in = new ArrayList<>(); 
            //遍历合并好的列表
			for (int j = 0; j < size; j++) {
				if (i_start >= intervals.get(j).start && i_start <= intervals.get(j).end) {
					start = intervals.get(j);
				}
				if (i_end >= intervals.get(j).start && i_end <= intervals.get(j).end) {
					end = intervals.get(j);
				}
				if (i_start < intervals.get(j).start && i_end >intervals.get(j).end) {
					in.add(intervals.get(j));
				} 

			}
			if (in.size() != 0) { 
				for (int index = 0; index < in.size(); index++) {
					intervals.remove(in.get(index));
				} 
			}
			Interval interval = null;
    		//根据不同的情况，生成新的节点
			if (equals(start, end)) {
				int s = start == null ? i_start : start.start;
				int e = end == null ? i_end : end.end;
				interval = new Interval(s, e); 
			} else if (start!= null && end!=null) {
				interval = new Interval(start.start, end.end); 
			}else if (start == null) {
				interval = new Interval(i_start, i_end); 
			}
			if (start != null) {
				intervals.remove(start);
			}
			if (end != null) {
				intervals.remove(end);
			}
           //不同之处是生成的节点，要遍历原节点，根据 start 插入到对应的位置，虽然题目没说，但这里如果不按顺序插入的话，leetcode 过不了。
			for(int i = 0;i<intervals.size();i++){
				if(intervals.get(i).start>interval.start){
					intervals.add(i,interval);
					return intervals;
				}
			}
			intervals.add(interval);
			return intervals;
	    }
private boolean equals(Interval start, Interval end) { 
    if (start == null && end == null) {
        return false;
    }
    if (start == null || end == null) {
        return true;
    }
    if (start.start == end.start && start.end == end.end) {
        return true;
    }
    return false;
}
```

时间复杂度：O（n）。

空间复杂度： O（n）， 里边的 in 变量用来存储囊括的节点时候耗费的。

我们其实可以利用迭代器，一边遍历，一边删除，这样就不需要 in 变量了。

```java
public List<Interval> insert(List<Interval> intervals, Interval newInterval) {
		Interval start = null;
		Interval end = null;
		int i_start = newInterval.start;
		int i_end = newInterval.end;  
		//利用迭代器遍历
		for (Iterator<Interval> it = intervals.iterator(); it.hasNext();) {
			Interval inter = it.next();
			if (i_start >= inter.start && i_start <= inter.end) {
				start = inter;
			}
			if (i_end >= inter.start && i_end <= inter.end) {
				end = inter;
			}
			if (i_start < inter.start && i_end > inter.end) {

				it.remove();
			}
		}
		Interval interval = null;
		if (equals(start, end)) {
			int s = start == null ? i_start : start.start;
			int e = end == null ? i_end : end.end;
			interval = new Interval(s, e);
		} else if (start != null && end != null) {
			interval = new Interval(start.start, end.end);
		} else if (start == null) {
			interval = new Interval(i_start, i_end);
		}
		if (start != null) {
			intervals.remove(start);
		}
		if (end != null) {
			intervals.remove(end);
		}
		for (int i = 0; i < intervals.size(); i++) {
			if (intervals.get(i).start > interval.start) {
				intervals.add(i, interval);
				return intervals;
			}
		}
		intervals.add(interval);
		return intervals; 
	}
	  
private boolean equals(Interval start, Interval end) { 
    if (start == null && end == null) {
        return false;
    }
    if (start == null || end == null) {
        return true;
    }
    if (start.start == end.start && start.end == end.end) {
        return true;
    }
    return false;
}
```

时间复杂度：O（n）。

空间复杂度： O（1）。 

# 解法二

对应 [56 题](https://leetcode.windliang.cc/leetCode-56-Merge-Intervals.html)的解法二，考虑到它给定的合并的列表是有序的，和解法二是一个思想。只不过这里不能直接从末尾添加，而是根据新节点的 start 来找到它应该在的位置，然后再利用之前的想法就够了。

这里把 leetcode 里的两种写法，贴过来，大家可以参考一下。

[第一种](https://leetcode.com/problems/insert-interval/discuss/21602/Short-and-straight-forward-Java-solution)。

```java
public List<Interval> insert(List<Interval> intervals, Interval newInterval) {
    List<Interval> result = new LinkedList<>();
    int i = 0;
    // 将新节点之前的节点加到结果中
    while (i < intervals.size() && intervals.get(i).end < newInterval.start)
        result.add(intervals.get(i++));
    // 和新节点判断是否重叠，更新新节点
    while (i < intervals.size() && intervals.get(i).start <= newInterval.end) {
        newInterval = new Interval( 
                Math.min(newInterval.start, intervals.get(i).start),
                Math.max(newInterval.end, intervals.get(i).end));
        i++;
    }
    //将新节点加入
    result.add(newInterval); 
    ///剩下的全部加进来
    while (i < intervals.size()) result.add(intervals.get(i++)); 
    return result;
}
```

[第二种](https://leetcode.com/problems/insert-interval/discuss/21600/Short-java-code)。和之前是一样的思想，只不过更加的简洁，可以参考一下。

```java
public List<Interval> insert(List<Interval> intervals, Interval newInterval) {
    List<Interval> result = new ArrayList<Interval>();
    for (Interval i : intervals) {
        //新加的入的节点在当前节点后边
        if (newInterval == null || i.end < newInterval.start)
            result.add(i);
        //新加入的节点在当前节点的前边
        else if (i.start > newInterval.end) {
            result.add(newInterval);
            result.add(i);
            newInterval = null;
        //新加入的节点和当前节点有重合，更新节点
        } else {
            newInterval.start = Math.min(newInterval.start, i.start);
            newInterval.end = Math.max(newInterval.end, i.end);
        }
    }
    if (newInterval != null)
        result.add(newInterval);
    return result;
}
```

总的来说，上边两个写法本质是一样的，就是依据他们是有序的，先把新节点前边的节点加入，然后开始判断是否重合，当前节点加入后，把后边的加入就可以了。

时间复杂度：O（n）。

空间复杂度：O（n），存储最后的结果。

# 总

总的来说，这道题可以看做上道题的一些变形，本质上是一样的。由于用 for 循环不能一边遍历列表，一边删除某个元素，所以利用迭代器实现边遍历，边删除，自己也是第一次用。此外，解法一更加通用些，它不要求给定的列表有序。