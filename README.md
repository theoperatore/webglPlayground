WebGL-Playground
========

My first adventure in WebGL Land using [three.js](https://www.npmjs.org/package/three) and [tween.js](https://www.npmjs.org/package/tween.js)

Installation
============

Since this isn't on npm yet, clone this repo and:

```bash
$ npm install
$ npm run test
```

Running `install` via `npm` will install the dependancies `beefy` and `three.js`.

To make sure that everything is installed correctly, run `npm run test` to start the `beefy` server on the default port: `9966`

If all goes well you should see a scene of a rotating star field with an earth and moon object.

Demos
=====

In the repo's directory:

```bash
# Earth, Clouds, Moon, Lighting and Shadows
$ npm run test

# move the mouse and the moon follows
$ npm run ball

# a half sphere...kinda boring
$ npm run shape

# my very first earth and particle system trial
$ npm run earth

# click/touch to start the universe!
# A or D to rotate camera left or right respectively
# W or S to speed up or slow down movement
$ npm run kersplode
```
