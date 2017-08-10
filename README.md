# Console-PRO

use  to Wrap your log.
Use **colors** and **console.group[End]** to wrap your log, making the log more beautiful and easier to analyze.

# Install

```
npm install console-pro --save
```

# Usage

```js
const { Console } = require("console-pro");
const myconsole = new Console({ async_log: true, auto_reduce_indent: true });

const g1 = myconsole.group("G1 Start!");

await doSomeThing();

myconsole.groupEnd(g1, "G1 IS OVER");
```

# Preview

## TEST1
![image](https://user-images.githubusercontent.com/2151644/29110708-273666d4-7d1a-11e7-9f04-7cc0c29d7011.png)

## TEST2
![image](https://user-images.githubusercontent.com/2151644/29110771-71569aa4-7d1a-11e7-975d-f5c7cf1d5b42.png)

## TEST3
![image](https://user-images.githubusercontent.com/2151644/29168305-e8877a76-7e00-11e7-9227-3e1ef8c870a6.png)

# API

## .flagHead(headContent :string) :string
Automatically fill the string.

## .flagHead(headContent :string, withBG :bool) :string
Automatically fill the string.

## group(...args): symbol
start an group log.

## groupEnd(symbol, ...args)
end an group.

## time(...args): symbol
start an time log, like group, with an Timestamp.

## timeEnd(symbol, ...args)
end an time, like groupEnd, with an Timestamp and TimeSpan(ms).

## Like native console

### log(...args)

### info(...args)

### debug(...args)

### warn(...args)

### error(...args)

### dir(object[, options])
