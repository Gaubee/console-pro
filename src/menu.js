'use strict'

var keypress = require('keypress')
var colors = require('colors')

module.exports = function (title, cb, log, opts) {
    var items = []
    var isRaw = process.stdin.isRaw
    var active = true
    var moved = false
    var selected = 0

    if (opts === undefined) {
        opts = {}
    }

    var waiting_msg = opts.waiting_msg || ' (waiting...)'
    var useArrowKeys_msg = opts.useArrowKeys_msg || ' (use arrow keys)'

    keypress(process.stdin)
    process.stdin.on('keypress', onkeypress)
    if (!isRaw) process.stdin.setRawMode(true)
    process.stdin.resume()
    draw()

    function add(item) {
        if (!active) return
        if (typeof item === 'string') item = {
            name: item,
            value: item
        }
        items.push(item)
        draw()
    }

    function onkeypress(ch, key) {
        if (!key) return
        if (key.ctrl && key.name === 'c') process.exit(130)
        if (key.name === 'up') {
            if (selected === 0) return
            selected--
            draw()
        } else if (key.name === 'down') {
            if (selected >= items.length - 1) return
            selected++
            moved = true
            draw()
        } else if (items.length > 0 && key.name === 'return') {
            select()
        }
    }

    function select() {
        active = false
        draw()
        process.stdin.pause()
        if (!isRaw) process.stdin.setRawMode(false)
        process.stdin.removeListener('keypress', onkeypress)
        cb(items[selected])
    }

    function draw() {
        var status = ''
        var q = colors.green('? ') + colors.bold(title)
        if (active) {
            if (items.length === 0) status = waiting_msg
            else if (!moved) status = useArrowKeys_msg

            log(items.reduce(function (s, item, index) {
                return s + (index === selected ? colors.cyan('> ' + item.name) : '  ' + item.name) + '\n'
            }, q + status + '\n'))
        } else {
            log(q + ' ' + colors.cyan(items[selected].name) + '\n')
        }
    }

    return {
        add: add
    }
}