[![MIT License][license-image]][license-url][![Code Climate](https://codeclimate.com/github/AdwinTrave/SfB-time-convertor/badges/gpa.svg)](https://codeclimate.com/github/AdwinTrave/SfB-time-convertor)
# Fictional time
Fictional time allows you to create, display and convert units to and from your own (symetric) fictional time. Example at [sfb.freedombase.net](http://sfb.freedombase.net).

## How to use
### Creating time
In order to create a time you need the following values:
* name of your time
* array with the length of each unit in milliseconds
* begging date for your time in milliseconds (use `new Date("your date").valueOf()` or the same with Moment.js)
* unit separators array with time declarator (this means that the first value in the array is for what will be display before the time itself and the same goes for the last value, so a GMT unit separators in American style would look like this: `['Earth Time ', "/", "/", " ", ":", ":", " GMT"]`)
* where is the main unit declaration located at, options are: before, after, both, false

#### Sample initialization


### Available functions

## Included open source
* normalize v3.0.3
* Zurb Foundation v5.5.2
* jQuery v2.1.4
* QUnit v1.18.0
* Moment.js v2.10.3
* Foundation datepicker v1.4 (https://github.com/najlepsiwebdesigner/foundation-datepicker)
* Font Awesome v4.3.0

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
