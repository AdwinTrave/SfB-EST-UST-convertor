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
Here is a sample initialization using the Standard Universal Time by Jan Dvořák IV.
```javascript
var unit1 = 1000; //how many miliseconds does the unit have
var unit2 = unit1 * 100;
var unit3 = unit2 * 100;
var unit4 = unit3 * 10;
var unit5 = unit4 * 500;

var unitArray = [unit5, unit4, unit3, unit2, unit1]; //must be in order from the largest to smallest
var unitSeparator = ["SUT ", ".", " ", ":", ":", ""]; //formating, determines what symbols will be between different
var unitDeclaration = "before"; //options: before, after, both, false - additional option for unitSeparator to show time declaration like SUT xxxx

var timeBegins = moment("2400/01/01 00:00 GMT"); //the moment when time begins in relation to Earth time

//create the object
var sut = new fictionalTime("Standard Universal Time", unitArray, timeBegins.valueOf(), unitSeparator, unitDeclaration);
```

### Available functions
#### toTime()
Calculates the time from milliseconds
```javascript
sut.toTime(10000); //returns SUT 000.000.0:00:10
```
#### toDate()
#### currentTime()
#### toFictionalUnit()
#### unitToMilliseconds()

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
