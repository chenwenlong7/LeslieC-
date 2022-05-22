> 因为想在学习的过程中扩展一下自己的思路同时也需要一个好的学习氛围，于是乎加入了一个学习群。但是呆久了发现大家再处理数据的时候总是乱用API，虽然老话说不管白猫黑猫，抓到老鼠就是好猫。可是在时间允许的情况下还是不建议乱用数组API的，并且现阶段的数组API已经可以解决各种场景的问题了。而且合理的使用数组的API也完善了代码的健壮性，看起来也更加优雅了～

## forEach

*什么时候用？*

正如我之前所说，我们不应该过度滥用`forEach`。当然，在某些情况下`forEach`是一个非常好的方法。

如果你需要迭代数组以执行特定操作（例如控制台记录每个项目）。

而每当需要填充新数组时，则不应该使用`forEach`（在此之前，请检查是否可以使用其他方法）

```javascript
const items = [1, 2, 3, 4, 5]

items.forEach(item => console.log(item))
```

`forEach`不返回任何值！！

````javascript
const toto = items.forEach(item => console.log(item))
toto // undefined
````

### filter

*什么时候用？*

顾名思义，它允许我们根据条件过滤数组中的某些值。

例如，如果你想删除奇数

**使用forEach（不建议❌）**

````javascript
const items = [1, 2, 3, 4]
const evenValue = []
items.forEach(item => {
   if (item % 2 == 0) {
      evenValue.push(item)
   }
})
````

**使用filter（正确✅ ）**

````javascript
const items = [1, 2, 3, 4]

const evenValue = items.filter(currentValue => {
   return currentValue % 2 == 0
})
````

当你使用`filter`时，你应该在每次迭代中返回一个布尔值（`filter`的条件）。（否则JS引擎会把返回值强制转换为布尔值！）

### map

*什么时候用？*

当你需要将项目从一个数组转换为另一个数组时！

例如，如果你想将数组中的所有值都乘以2。

**使用forEach（不建议❌）**

````javascript
const items = [1, 2, 3, 4]
const result = []
items.forEach(item => {
   result.push(item * 2)
})
````

**使用map（正确✅ ）**

````javascript
const items = [1, 2, 3, 4]
const result = items.map(item => {
   return item * 2
})
````

当你使用`map`时，你需要在每次迭代中返回一个项目（转换后的项目）。

### reduce

*什么时候用？*

当你需要从数组中获取单个值时。此处的“单个值”可以是一个数组。

例如，如果你想对数组中的所有数字求和。

**使用forEach（不建议❌）**

````javascript
const items = [1, 2, 3, 4]
let accumulator = 0

items.forEach(item => {
   accumulator += item
})
````

**使用reduce（正确✅ ）**

````javascript
const items = [1, 2, 3, 4]

const sum = items.reduce((accumulator, currentValue) => {
   return accumulator += currentValue
}, 0)
````

当你使用`reduce`时，你需要在每次迭代中返回`accumulator`（`reduce`方法返回的值），并且你还应该初始化这个`accumulator`（在上面的例子中我们将累加器初始化为0）！

### find

*什么时候用？*

当你需要找到符合条件的项目并打算之后使用该项目的情况下。

````javascript
const items = [1, 2, 3, 4]

const item = items.find(item => item === 3)

// ...

// Use item afterwards
````

### some

*什么时候用？*

如果你需要检查其中一个项目是否符合条件（类似于`find`），但之后你并不需要使用该项目。

例如，如果你想检查数组是否有数字2。

如果你之后不打算使用这个项，那么使用`find`并不明智，或者你只是使用项目来检查值是否为`undefined`（以了解条件是否匹配）

**使用find（不建议❌）**

````javascript
const items = [1, 2, 3, 4]
const item = items.find(item => item === 2)
if (item !== undefined) {
   // ...
}
````

**使用some（正确✅ ）**

````javascript
const items = [1, 2, 3, 4]
const hasNumber2 = items.some(item => item === 2)
if (hasNumber2) {
   ...
}
````

若是至少有一个项目符合条件的话，`some`将返回布尔值。

### every

*什么时候用？*

`every`类似于`some`，它会检查所有项目是否符合条件。只要有一个项目与条件匹配，`some`就会返回`true`，而`every`只有当所有项目都与条件匹配时，才会返回`true`！

### 总结

如上所见，我们可以根据上下文使用其他的数组方法，从而避免过度滥用`forEach`！

而且，根据当前上下文使用合适的数组方法，也可以使得代码更可读（例如，如果看到`filter`，我就知道这一段代码需要从数组中过滤一个值）。

另外还有一点我在上面没有涉及到的是，你可以组合数组方法（`forEach`除外，因为`forEach`不返回值）。

所以我们可以这样写代码：

如果你需要从数组中过滤奇数并将每个数字乘以2。

````javascript
const items = [1, 2, 3, 4]

const result = items.filter(item => item % 2 == 0 ).map(item => item * 2)
````



**参考：**

[提升 JavaScript 能力，从正确使用数组开始](https://mp.weixin.qq.com/s/sYeL4qUSxqGE9VJMVz7uPw)
