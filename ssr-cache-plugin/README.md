# ssr-cache-plugin

### 简介：
这是一个专门针对资源在node环境中进行内存缓存的插件，它是基于LRU-K算法基础上对其进行合理性优化的算法，这里简称为高低频LRU算法HL-LRU.

该插件对外输出两种类型的缓存对象，一种是普通的LRU缓存对象，另一种是HL-LRU缓存对象，使用者可以根据需要使用。


### 特点：
该插件有三个特点：
1. 更高效的内存缓存效率：对于在一定时间内访问频率高的资源，不会轻易的被淘汰，而是会提高它在内存的时效性，从而缩短访问资源的耗时，提升响应的速度；
2. 完善的内存使用率监控：由于V8引擎自身的特点，被分派的可使用内存不多，因此在node中使用内存缓存可能会出现OOM或者内存泄露，因此该插件提供了一个可以监控内存的能力，并具备内存缓存降级方案，因此使用者可以放心使用内存缓存；
3. 完善的对外缓存日志：因为在开发或者日产生产中，会出现意想不到的缓存引发的问题，因此该插件对外提供了完整的日志信息和日志钩子，方面使用者在开发和生产中看日志定位问题；


### 安装：

```
npm install ssr-cache-plugin
```


### 快速上手：

```
import CachePlugin from '../index'
const fs = require('fs')
const cache = new CachePlugin.Cache({
    HFLength: 3,
    HFMaxAge: 1000,
    LFLength: 5,
    LFMaxAge: 1000,
    HFTimes: 2
});

function getResource(pathName) {
    const resource = cache.get(pathName);
    if (resource) {
        return resource
    } else {
        const content = fs.readFileSync(pathName);
        cache.set(pathName, content);
        return content
    }
}

getResource('./demo.txt');
```



### 对外API：

目前对外提供两个对象，一个是基于LRU的缓存对象，另一个是基于HL-LRU的缓存对象。

##### 基于HL-LRU缓存对象：

- Cache实例


```
new Cache(options)
```

其中options的值有：

```
HFLength：高频LRU队列的容量，默认是10000,
LFLength：低频LRU队列的容量，默认是10000,
HFMaxAge：高频LRU队列中每个资源的有效时间，默认是60s,
LFMaxAge：低频LRU队列中每个资源的有效时间，默认是60s,
HFTimes：低频LRU队列中资源访问到达制定次数就升级为高频LRU，默认是10次,
onBeforeDelete：每次缓存内存被淘汰时触发的钩子，(key) => void,
onUpgrade：资源从低频LRU队列升级到高频LRU队列时的钩子， (node) => void,
onDemotion: 资源从高频LRU队列降级到低频LRU队列时的钩子， (node) => void,
clearDataTime：每隔多少秒清洗lru的过期的数据，默认为0，只有大于0才会开启,
onLogger：日志钩子，缓存实例每一步操作都会触发日志钩,
allowMonitor： 是否允许内存被监督，当全局开启内存监控时，该选项能决定是否允许被监控，被监控后会有可能因为node内存使用过高而该实例进制缓存，具体监控操作下面会描述。默认为false不开启
```
日志钩子：

```
({type, data, msg}) => void

type：
    SAVE: 'save', // 保存
    GET: 'get', // 获取
    RESET: 'reset', // 重置
    DELETE: 'delete', // 删除
    UPGRADE: 'upgrade', // 升级
    DEMOTION: 'demotion', // 降级
    OOM: 'outOfMemory', // 快超过内存上限,
    LF: 'LF', // 低频LRU
    HF: 'HF', // 高频LRU
    ERROR: 'error' // 错误
```

- set方法：缓存数据，成功缓存返回true，否则返回false

```
cache.set({
    key: 'demo',
    value: '1',
    expired: 1000
})

// 或者
cache.set('demo', '1', 1000);
```


- get方法：获取数据，如果没有或者过期则返回null

```
const value = cache.get('demo');
```


- delete方法：删除某个key值

```
cache。delete('demo')
```

- getKeys：获取所有队列的key值，可以选取是否按照队列的顺序输出

```
const {LFKeys, HFKeys} = cache.getKeys()

// 按照各自队列中key从上到下排序输出
const {LFKeys, HFKeys} = cache.getKeys(true)
```


- getValues：获取各自队列中储存的内容，可以选取是否按照队列的顺序输出

```
const {LFValue, HFValue} = cache.getValues()

// 按照各自队列中value从上到下排序输出
const {LFValue, HFValue} = cache.getValues(true)
```

- 开去内存监控：

```
Cache.setMonitor({
    openMonitor = false, // 是否开启内存监控
    onNoticeForOOM = () => {}, // 警告函数,如果出现内存监控，则会通过该钩子通知开发者
    memFilePath = path.resolve(process.cwd(), '../memSnapShot/'), // 溢出文件的存储位置，如果内存溢出或者泄露，会生成一个heapsnapshot文件。
    memoryLimit = {
        oneLevel：默认是85，如果内存使用率超过85，则LFLRU只出不进且会生成heapsnapshot文件，触发onNoticeForOOM钩子。
        twoLevel：默认是80，如果内存使用率在80-85之间，则HFLRU清空且不能进，LFLRU正常
        threeLevel：默认是70，如果在70-80之间，HFLRU只出不进, LFLRU正常
    } // 设置LRU内存上限
})
```

##### 基于LRU缓存对象：