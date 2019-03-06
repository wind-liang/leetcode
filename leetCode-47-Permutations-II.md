# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/47.jpg)

和[上一道题](https://leetcode.windliang.cc/leetCode-46-Permutations.html)类似，不同之处就是给定的数字中会有重复的，这样的话用之前的算法会产出重复的序列。例如，[ 1 1 ]，用之前的算法，产生的结果肯定是 [ \[ 1 1 \]，  \[ 1 1  \] ]，也就是产生了重复的序列。但我们可以在上一题的解法中进行修改从而解决这道题。

# 解法一 插入

这个没想到怎么在原基础上改，可以直接了当些，在它产生的结果里，对结果去重再返回。对于去重的话，一般的方法肯定就是写两个 for 循环，然后一个一个互相比较，然后找到重复的去掉。这里，我们用 [39题](https://leetcode.windliang.cc/leetCode-39-Combination-Sum.html?h=remove) 解法二中提到的一种去重的方法。

```java
public List<List<Integer>> permuteUnique(int[] nums) {
    List<List<Integer>> all = new ArrayList<>(); 
    List<Integer> temp = new ArrayList<>();
    temp.add(nums[0]);
    all.add(temp); 
    for (int i = 1; i < nums.length; i++) {
        int current_size = all.size();
        for (int j = 0; j < current_size; j++) {
            List<Integer> last = all.get(j);
            for (int k = 0; k <= i; k++) {
                if (k < i && nums[i] == last.get(k)) {
                    continue;
                }
                temp = new ArrayList<>(last);
                temp.add(k, nums[i]);
                all.add(temp);
            }
        }
        for (int j = 0; j < current_size; j++) {
            all.remove(0);
        }
    }
    return removeDuplicate(all);
}

private List<List<Integer>> removeDuplicate(List<List<Integer>> list) {
    Map<String, String> ans = new HashMap<String, String>();
    for (int i = 0; i < list.size(); i++) {
        List<Integer> l = list.get(i);
        String key = "";
        // [ 2 3 4 ] 转为 "2,3,4"
        for (int j = 0; j < l.size() - 1; j++) {
            key = key + l.get(j) + ",";
        }
        key = key + l.get(l.size() - 1);
        ans.put(key, "");
    }
    // 根据逗号还原 List
    List<List<Integer>> ans_list = new ArrayList<List<Integer>>();
    for (String k : ans.keySet()) {
        String[] l = k.split(",");
        List<Integer> temp = new ArrayList<Integer>();
        for (int i = 0; i < l.length; i++) {
            int c = Integer.parseInt(l[i]);
            temp.add(c);
        }
        ans_list.add(temp);
    }
    return ans_list;
}
```

# 解法二 回溯

看下之前的算法

```java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> list = new ArrayList<>(); 
    backtrack(list, new ArrayList<>(), nums);
    return list;
}

private void backtrack(List<List<Integer>> list, List<Integer> tempList, int [] nums){
    if(tempList.size() == nums.length){
        list.add(new ArrayList<>(tempList));
    } else{
        for(int i = 0; i < nums.length; i++){ 
            if(tempList.contains(nums[i])) continue; // 已经存在的元素，跳过
            tempList.add(nums[i]); //将当前元素加入
            backtrack(list, tempList, nums); //向后继续添加
            tempList.remove(tempList.size() - 1); //将 tempList 刚添加的元素，去掉，尝试新的元素
        }
    }
}
```

假如给定的数组是 [ 1 1 3 ]，我们来看一下遍历的这个图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/47_2.jpg)

第一个要解决的就是这句代码

```java
if(tempList.contains(nums[i])) continue; // 已经存在的元素，跳过
```

之前没有重复的元素，所以可以直接在 templist 判断有没有当前元素，有的话就跳过。但这里的话，因为给定的有重复的元素，这个方法明显不可以了。

换个思路，我们可以再用一个 list 保存当前 templist 中已经有的元素的下标，然后添加新元素的时候去判断下标就可以了。

第二个问题就是，可以看到有重复元素的时候，上边第 1 个图和第 2 个图产生的是完全一样的序列。所以第 2 个遍历是没有必要的。

解决的方案就是把数组首先排下顺序，然后判断一下上一个添加的元素和当前元素是不是相等，相等的话就跳过，继续下一个元素。

```java
public List<List<Integer>> permuteUnique(int[] nums) {
    List<List<Integer>> list = new ArrayList<>();
    Arrays.sort(nums);
    List<Integer> old = new ArrayList<>();
    backtrack(list, new ArrayList<>(), nums, old);
    return list;
}

private void backtrack(List<List<Integer>> list, List<Integer> tempList, int[] nums, List<Integer> old) {
    if (tempList.size() == nums.length) {
        list.add(new ArrayList<>(tempList));
    } else {
        for (int i = 0; i < nums.length; i++) { 
            //解决第一个问题
            if (old.contains(i)) {
                continue;
            }
            //解决第二个问题 !old.contains(i - 1) 很关键，下边解释下
            if (i > 0 && !old.contains(i - 1) && nums[i - 1] == nums[i]) {
                continue;
            }
            old.add(i);//添加下标
            tempList.add(nums[i]); // 将当前元素加入
            backtrack(list, tempList, nums, old); // 向后继续添加
            old.remove(old.size() - 1);
            tempList.remove(tempList.size() - 1);
        }
    }
}
```

解决第二个问题 !old.contains(i - 1) 很关键
因为上边 old.contains(i) 代码会使得一些元素跳过没有加到 templist 上，所以我们要判断 nums[ i - 1 ] 是不是被跳过的那个元素，如果  old.contains ( i ) 返回 true ， 即使 nums [ i - 1 ] == nums [ i ] 也不能跳过当前元素。因为上一个元素 nums [ i - 1 ] 并没有被添加到 templist。可能比较绕，但是可以参照上边的图，走一下流程就懂了。如果不加 !old.contains ( i - 1 )，那么图中的第 2 行的第 2 个 1 本来应该加到 tempList，但是会被跳过。因为第 2 行第 1 个元素也是 1。

对于解决第一个问题，我们用了一个 list 来保存下标来解决。需要一个 O ( n ) 的空间。有一种方法，我们可以用 O（1）的空间。不过前提是，我们需要对问题的样例了解，也就是给定的输入所包含的数字。我们需要找到一个样例中一定不包含的数字来解决我们的问题。

首先，我们假设输入的所有的数字中没有 -100 这个数字。

然后，我们就可以递归前将当前数字先保存起来，然后置为 -100 隐藏起来，递归结束后还原即可。

```java
public List<List<Integer>> permuteUnique(int[] nums) {
    List<List<Integer>> list = new ArrayList<>();
    Arrays.sort(nums); 
    backtrack(list, new ArrayList<>(), nums);
    return list;
}

private void backtrack(List<List<Integer>> list, List<Integer> tempList, int[] nums) {
    if (tempList.size() == nums.length) {
        list.add(new ArrayList<>(tempList));
    } else {
        for (int i = 0; i < nums.length; i++) { 
            //解决第一个问题
            if (nums[i] == -100) {
                continue;
            }
            //解决第二个问题 !old.contains(i - 1) 很关键 
            if (i > 0 && nums[i-1] != -100 && nums[i - 1] == nums[i]) {
                continue;
            }
            tempList.add(nums[i]); // 将当前元素加入 
            int temp = nums[i]; //保存
            nums[i] = -100; // 隐藏
            backtrack(list, tempList, nums); // 向后继续添加
            nums[i] = temp; //还原
            tempList.remove(tempList.size() - 1);
        }
    }
}
```



当然这个想法局限性很大，但是如果对解决的问题很熟悉，一般是可以找到这样一个不会输入的数字，然后可以优化空间复杂度。

# 解法三  交换

这个改起来相对容易些，之前的想法就是在每一个位置，让每个数字轮流交换过去一下。这里的话，我们其实只要把当前位置已经有哪些数字来过保存起来，如果有重复的话，我们不让他交换，直接换下一个数字就可以了。

```java
public List<List<Integer>> permuteUnique(int[] nums) {
    List<List<Integer>> all = new ArrayList<>();
    Arrays.sort(nums);
    upset(nums, 0, all);
    return all;
}

private void upset(int[] nums, int begin, List<List<Integer>> all) {
    if (begin == nums.length) {
        ArrayList<Integer> temp = new ArrayList<Integer>();
        for (int i = 0; i < nums.length; i++) {
            temp.add(nums[i]);
        }
        all.add(new ArrayList<Integer>(temp));
        return;
    }
    HashSet<Integer> set = new HashSet<>(); //保存当前要交换的位置已经有过哪些数字了
    for (int i = begin; i < nums.length; i++) {
        if (set.contains(nums[i])) { //如果存在了就跳过，不去交换
            continue;
        }
        set.add(nums[i]);
        swap(nums, i, begin);
        upset(nums, begin + 1, all);
        swap(nums, i, begin);
    }

}

private void swap(int[] nums, int i, int begin) {
    int temp = nums[i];
    nums[i] = nums[begin];
    nums[begin] = temp;
}
```

# 总

基本上都是在上道题的基础上改出来了，一些技巧也是经常遇到，比如先排序，然后判断和前一个是否重复。利用 Hash 去重的功能。利用原来的存储空间隐藏掉数据，然后再想办法还原。