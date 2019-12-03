# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/179.jpg)

给一个数组，将这些数任意排列，组成一个值最大的数。

# 解法一

直觉上，我们应该先选最高位大的数。有 `9` 开头的数字先选 `9`，然后选 `8` 开头的数，再选 `7` 开头的... 以此类推。所以我们需要一个函数来判断最高位是多少。

```java
private int getHighestPosition(int num) {
    while (num / 10 > 0) {
        num /= 10;
    }
    return num;
}
```

举个例子，比如对于 `5,914,67`，先选 `914`，再选 `67`，再选 `5`，组成 `914675`，因为数字的高位越大越好，每次尽量选高位的大的数从而保证了最后构成的数一定是最大的。

接下来的一个问题，如果最高位的数字一样呢？又分成两种情况。

如果两个数字长度相等，比如 `34` 和 `30` ， 那么很明显，选择较大的即可。

如果两个数字长度不相等，比如 `3` 和 `30`，此时先选择 `3` 还是先选择 `30` 呢？

我们只需要把它两拼接在一起直接去比较，也就是比较 `330` 和 `303`，很明显是 `330` 大，所以我们先选择 `3`。

所以我们可以封装一个比较函数。

```java
private int compare(int n1, int n2) {
    int len1 = (n1 + "").length();
    int len2 = (n2 + "").length();
    //长度相等的情况
    if (len1 == len2) {
        if (n1 > n2) {
            return 1;
        } else if (n1 < n2) {
            return -1;
        } else {
            return 0;
        }
    }
    //长度不等的情况
    int combination1 = (int) (n1 * Math.pow(10, len2)) + n2;
    int combination2 =(int) (n2 * Math.pow(10, len1)) + n1;

    if (combination1 > combination2) {
        return 1;
    } else if (combination1 < combination2) {
        return -1;
    } else {
        return 0;
    }

}
```

通过上边的分析，我们可以利用 `HashMap` 去存每一组数字，`key` 就是 `9,8,7...0` 分别代表开头数字是多少。而 `value` 就去存链表，每个链表的数字根据上边分析的规则将它们「从大到小」排列即可。

所以我们还需要一个插入元素到链表的方法。对于链表，我们的头结点不去存储值，而 `head.next` 才是我们第一个存储的值。

```java
//将 node 通过插入排序的思想，找到第一个比他小的节点然后插入到它的前边
private void insert(MyNode head, MyNode node) {
    while (head != null && head.next != null) {
        int cur = head.next.val;
        int insert = node.val;
        if (compare(cur, insert) == -1) {
            node.next = head.next;
            head.next = node;
            return;
        }
        head = head.next;
    }
    head.next = node;
}
```

然后对于 `3,30,34,5,9`，我们就会有下边的结构。

```java
9: head -> 9
8:
7:
6: 
5: head -> 5
4:
3: head -> 34 -> 3 -> 30
2:
1:
0:
```

然后我们只需要依次遍历这些数字组成一个字符串即可，即`9534330`。

然后把上边所有的代码合起来即可。

```java
class MyNode {
    int val;
    MyNode next;
    MyNode(int val) {
        this.val = val;
    }
}

public String largestNumber(int[] nums) {
    HashMap<Integer, MyNode> map = new HashMap<>();
    for (int i = 9; i >= 0; i--) {
        map.put(i, new MyNode(-1));
    }
    //依次插入每一个数
    for (int i = 0; i < nums.length; i++) {
        int key = getHighestPosition(nums[i]);
        //得到头指针
        MyNode head = map.get(key);
        MyNode MyNode = new MyNode(nums[i]);
        //插入到当前链表的相应位置
        insert(head, MyNode);
    }
    //遍历所有值
    StringBuilder sb = new StringBuilder();
    for (int i = 9; i >= 0; i--) {
        MyNode head = map.get(i).next;
        while (head != null) {
            sb.append(head.val);
            head = head.next;
        }
    }
    String res = sb.toString();
    //考虑 "000" 只有 0 的特殊情况
    return res.charAt(0) == '0' ? "0" : res;
}

private void insert(MyNode head, MyNode node) {
    while (head != null && head.next != null) {
        int cur = head.next.val;
        int insert = node.val;
        if (compare(cur, insert) == -1) {
            node.next = head.next;
            head.next = node;
            return;
        }
        head = head.next;
    }
    head.next = node;
}

private int compare(int n1, int n2) {
    int len1 = (n1 + "").length();
    int len2 = (n2 + "").length();
    if (len1 == len2) {
        if (n1 > n2) {
            return 1;
        } else if (n1 < n2) {
            return -1;
        } else {
            return 0;
        }
    }
    int combination1 = (int) (n1 * Math.pow(10, len2)) + n2;
    int combination2 = (int) (n2 * Math.pow(10, len1)) + n1;

    if (combination1 > combination2) {
        return 1;
    } else if (combination1 < combination2) {
        return -1;
    } else {
        return 0;
    }

}

private int getHighestPosition(int num) {
    while (num / 10 > 0) {
        num /= 10;
    }
    return num;
}
```

# 解法二

仔细想一下上边的想法，我们通过每个数字的最高位人为的把所有数字分成 `10` 类，然后每一类做了一个插入排序。其实我们也可以不进行分类，直接对所有数字进行排序。

我们直接调用系统的排序方法，传一个我们自定义的比较器即可。看一下我们之前的比较函数是否可以用。

```java
private int compare(int n1, int n2) {
    int len1 = (n1 + "").length();
    int len2 = (n2 + "").length();
    if (len1 == len2) {
        if (n1 > n2) {
            return 1;
        } else if (n1 < n2) {
            return -1;
        } else {
            return 0;
        }
    }
    int combination1 = (int) (n1 * Math.pow(10, len2)) + n2;
    int combination2 = (int) (n2 * Math.pow(10, len1)) + n1;

    if (combination1 > combination2) {
        return 1;
    } else if (combination1 < combination2) {
        return -1;
    } else {
        return 0;
    }

}
```

之前我们只考虑了最高位相等的情况，如果最高位不同的话检查一下上边的代码是否还可以用。比如对于 `93,234`，然后根据上边代码我们会比较 `93234` 和 `23493`，然后我们会选择 `93`，发现代码不需要修改。

此外，因为我们要从大到小排列，所以前一个数字大于后一个数字的时候，我们应该返回 `-1`。

```java
public String largestNumber(int[] nums) {
    //自带的比较器不能使用 int 类型，所以我们把它转为 Integer 类型
    Integer[] n = new Integer[nums.length];
    for (int i = 0; i < nums.length; i++) {
        n[i] = nums[i];
    }
    Arrays.sort(n, new Comparator<Integer>() {
        @Override
        public int compare(Integer n1, Integer n2) {
            int len1 = (n1 + "").length();
            int len2 = (n2 + "").length();
            if (len1 == len2) {
                if (n1 > n2) {
                    return -1;
                } else if (n1 < n2) {
                    return 1;
                } else {
                    return 0;
                }
            }
            int combination1 = (int) (n1 * Math.pow(10, len2)) + n2;
            int combination2 = (int) (n2 * Math.pow(10, len1)) + n1;

            if (combination1 > combination2) {
                return -1;
            } else if (combination1 < combination2) {
                return 1;
            } else {
                return 0;
            }
        }
    });
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < nums.length; i++) {
        sb.append(n[i]);
    }
    String res = sb.toString();
    return res.charAt(0) == '0' ? "0" : res;
}

```

分析一下时间复杂度，首先取决于我们使用的排序算法，如果是解法一的插入排序，那么就是 `O(n²)`，如果是快速排序，那么就是 `O（nlog(n)`，此外我们的比较函数因为要求出每个数字的长度，我们需要遍历一遍数字，记做 `O（k）`，所以总的时间复杂度对于快排的话就是 `O(nklon(n))`。

# 解法三

上边的解法严格来说其实还是有些问题的。在比较两个数字大小的时候，当长度不相等的时候，我们把两个数字合并起来。如果数字特别大，强行把它们合并起来是会溢出的。

所以我们可以把数字转为 `String` ，把字符串合并起来，然后对字符串进行比较。

此外，在比较函数中我们单独分别判断了数字长度相等和不相等的情况，其实长度相等的情况也是可以合并到长度不相等的情况中去的。

```java
public String largestNumber(int[] nums) {
    Integer[] n = new Integer[nums.length];
    for (int i = 0; i < nums.length; i++) {
        n[i] = nums[i];
    }
    Arrays.sort(n, new Comparator<Integer>() {
        @Override
        public int compare(Integer n1, Integer n2) {
            String s1 = n1 + "" + n2;
            String s2 = n2 + "" + n1;
            //compareTo 方法
            //如果参数是一个按字典顺序排列等于该字符串的字符串，则返回值为0; 
            //如果参数是按字典顺序大于此字符串的字符串，则返回值小于0; 
            //如果参数是按字典顺序小于此字符串的字符串，则返回值大于0。
            return s2.compareTo(s1);
        }
    });
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < nums.length; i++) {
        sb.append(n[i]);
    }
    String res = sb.toString();
    return res.charAt(0) == '0' ? "0" : res;
}
```

# 总

只要找到了选取数字的原则，这道题也就转换成一道排序题了。