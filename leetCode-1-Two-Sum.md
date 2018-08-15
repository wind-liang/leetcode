## 题目描述	（简单难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/1_two_sum.jpg)

给定一个数组和一个目标和，从数组中找两个数字相加等于目标和，输出这两个数字的下标。

## 解法一

简单粗暴些，两重循环，遍历所有情况看相加是否等于目标和，如果符合直接输出。

``` JAVA
public int[] twoSum1(int[] nums, int target) {
		int []ans=new int[2];
		for(int i=0;i<nums.length;i++){
			for(int j=(i+1);j<nums.length;j++){
				if(nums[i]+nums[j]==target){
					ans[0]=i;
					ans[1]=j;
					return ans;
				}
			}
		}
		return ans;
    }
```


时间复杂度：两层 for 循环，O（n²）

空间复杂度：O（1）

## 解法二

在上边的解法中看下第二个 for 循环步骤。

```JAVA
for(int j=(i+1);j<nums.length;j++){
	if(nums[i]+nums[j]==target){
```

我们换个理解方式：

```JAVA
for(int j=(i+1);j<nums.length;j++){ 
	sub=target-nums[i]
 	if(nums[j]==sub){
```

第二层 for 循环无非是遍历所有的元素，看哪个元素等于 sub ，时间复杂度为 O（n）。

有没有一种方法，不用遍历就可以找到元素里有没有等于 sub 的？

hash table ！！！

我们可以把数组的每个元素保存为 hash 的 key，下标保存为 hash 的 value 。

这样只需判断 sub 在不在 hash 的 key 里就可以了，而此时的时间复杂度仅为 O（1）！

需要注意的地方是，还需判断找到的元素不是当前元素，因为题目里讲一个元素只能用一次。

``` JAVA
public int[] twoSum2(int[] nums, int target) {
		Map<Integer,Integer> map=new HashMap<>();
		for(int i=0;i<nums.length;i++){
			map.put(nums[i],i);
		}
		for(int i=0;i<nums.length;i++){
			int sub=target-nums[i];
			if(map.containsKey(sub)&&map.get(sub)!=i){
				return new int[]{i,map.get(sub)};
			}
		}
		throw new IllegalArgumentException("No two sum solution");
	}
```

时间复杂度：比解法一少了一个 for 循环，降为 O（n）

空间复杂度：所谓的空间换时间，这里就能体现出来， 开辟了一个 hash table ，空间复杂度变为 O（n）

## 解法三

看解法二中，两个 for 循环，他们长的一样，我们当然可以把它合起来。复杂度上不会带来什么变化，变化仅仅是不需要判断是不是当前元素了，因为当前元素还没有添加进 hash 里。	

``` JAVA
public int[] twoSum3(int[] nums, int target) {
		Map<Integer,Integer> map=new HashMap<>();
	    for(int i=0;i<nums.length;i++){
		    int sub=target-nums[i];
		    if(map.containsKey(sub)){
			    return new int[]{i,map.get(sub)};
		}
		map.put(nums[i], i);
	}
	throw new IllegalArgumentException("No two sum solution");
}
```

## 总结

题目比较简单，毕竟暴力的方法也可以解决。唯一闪亮的点就是，时间复杂度从 O（n²）降为 O（n） 的时候，对 hash 的应用，有眼前一亮的感觉。