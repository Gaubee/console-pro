# Console-PRO

use  to Wrap your log.
Use **colors** and **console.group[End]** to wrap your log, making the log more beautiful and easier to analyze.

# Install

```
npm install console-pro --save
```

# Usage

```js
const { ConsolePro } = require("console-pro");
const myconsole = new ConsolePro({ async_log: true, auto_reduce_indent: true });

const g1 = myconsole.group("G1 Start!"); // no color
const g2 = myconsole.group(myconsole.flagHead("G2")); // use flag's color
const g3 = myconsole.group(ConsolePro.COLOR.bgBlueWithWhite, "G3"); // use custom color
const g4 = myconsole.group("G4".green); // use colors api to change string color

myconsole.info("QAQ");
myconsole.warn("QAQ");

myconsole.groupEnd(g3, "G3 IS OVER");
myconsole.groupEnd(g2, "G2 IS OVER");

myconsole.success("QAQ");
myconsole.error("QAQ");

myconsole.groupEnd(g4, "G4 IS OVER");
myconsole.groupEnd(g1, "G1 IS OVER");
```
![image](https://user-images.githubusercontent.com/2151644/29200125-4696eabe-7e85-11e7-93cc-2b27bb7fcd10.png)

# Preview

## TEST1
![image](https://user-images.githubusercontent.com/2151644/29110708-273666d4-7d1a-11e7-9f04-7cc0c29d7011.png)

## TEST2
![image](https://user-images.githubusercontent.com/2151644/29110771-71569aa4-7d1a-11e7-975d-f5c7cf1d5b42.png)

## TEST3
![image](https://user-images.githubusercontent.com/2151644/29200142-779145d8-7e85-11e7-91c7-b695afeb9483.png)

# API

## new(options: ConsoleOptions)
### ConsoleOptions
#### async_log: bool
#### auto_reduce_indent: bool
#### silence: bool

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

## silence(to_be_silence: bool)
if true, All the logs will be hidden to improve performance