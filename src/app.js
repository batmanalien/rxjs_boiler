import $ from 'jquery';
import Rx from 'rxjs/Rx';
import { take } from 'rxjs/operators';

// Snippets of various ways of creating observables

// from event button click
const output = $('#output');
const btn = $('#btn');
const btnStream$=Rx.Observable.fromEvent(btn, 'click');
btnStream$.subscribe(
    (e) => console.log(e.target.innerHTML),
    (err) => console.log(err),
    () => console.log('completed')
);

// from event keyup
const input = $('#input');
const inputStream$=Rx.Observable.fromEvent(input, 'keyup');
inputStream$.subscribe(
    (e) => console.log(e.target.value),
    (err) => console.log(err),
    () => console.log('completed')
);

// from event mousemove
const mousemoveStream$=Rx.Observable.fromEvent(document, 'mousemove');
mousemoveStream$.subscribe(
    (e) => { 
                console.log(`X : ${e.clientX}, Y: ${e.clientY} (,,,)=(^.^)=(,,,) `);
                output.html(`X : ${e.clientX}, Y: ${e.clientY} (,,,)=(^.^)=(,,,) `);
           },
    (err) => console.log(err),
    () => console.log('completed')
);

// from simple array
const numbers = [1,2,3,4,5];
const numbers$ = Rx.Observable.from(numbers);
numbers$.subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
);

// from array of objects
const posts = [
    {title: 'post 1', body: 'body 1'},
    {title: 'post 2', body: 'body 2'},
    {title: 'post 3', body: 'body 3'}
];
const posts$ = Rx.Observable.from(posts);
posts$.subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
);

// from set
const set = new Set(['hello', 123, {title: 'my title'}])
const set$ = Rx.Observable.from(set);
set$.subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
);

// from map
const map = new Map([[1,2],[3,4], [5,6]])
const map$ = Rx.Observable.from(map);
map$.subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
);

//from scratch using the new Rx.Observable
const source$ = new Rx.Observable(observer => {
    console.log("creating observable");

    // new value can be added via next()
    observer.next('hello')
    observer.next('another hello')

    // error can be raised via error()
    observer.error(new Error('error!'))

    setTimeout(() => {
        observer.next('next hello')
        // notify the obserer that the Observable has finised
        observer.complete();
    }, 3000);
});
// catch errors on the Observable by returning a new Observable
source$.catch(err => Rx.Observable.of(err))
    .subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
);

// create prommise
const myPromise = new Promise((resolve, reject) => {
    console.log('creating promise');
    setTimeout(() => {
        resolve('hello from promise');
    }, 3000);
});

// normal utilization of promise
myPromise.then(_ => console.log(_));

// from promise
const myPromiseSource$ = Rx.Observable.fromPromise(myPromise);
myPromiseSource$.subscribe(_ => console.log(_));

// function to get GitHub user which returns a promise
function getUser(username){
    return $.ajax({
        url: `https://api.github.com/users/${username}`,
        dataType: 'jsonp'
    }).promise();
}

// subscribe to user input
const username = $('#username')
const githubStream$ = Rx.Observable.fromEvent(username, 'keyup')
    githubStream$.subscribe(e => {
        // from promise
        Rx.Observable.fromPromise(getUser(e.target.value))
            .subscribe(_ => console.log(_.data.name));
    }
);

// from interval, emits sequential numbers every second and takes only the first 5 values
const intervalSource$ = Rx.Observable.interval(1000).take(5)
intervalSource$.subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
)

//timer, emits first 5 values, with a 2 second inital delay and emits new value every second after that
const timerSource$ = Rx.Observable.timer(2000, 1000).take(5)
timerSource$.subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
)

//range, emits sequence of numbers starting from 25 and emits 100 values
const rangeSource$ = Rx.Observable.range(25, 100)
rangeSource$.subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
)

// project Observable output with map
const mapSource$ = Rx.Observable.interval(1000).take(5)
                    .map(v => v * 100)
mapSource$.subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
)

// chainning maps together
const mapSource$ = Rx.Observable.from(['John', 'Shawn', 'Tom'])
                    .map(v => v.toUpperCase())
                    .map(v => 'i am ' + v)
mapSource$.subscribe(
    v => console.log(v),
    err => console.log(err),
    complete => console.log('complete')
)

function getUser(username){
    return $.ajax({
        url: `https://api.github.com/users/${username}`,
        dataType: 'jsonp'
    }).promise();
}

// map results from promise
Rx.Observable.fromPromise(getUser('batmanalien'))
    .map(user => user.data.name)
    .subscribe(name => console.log(name));

// pluck, extract nested properties
const users = [
                {name:'Shawn', age:44},
                {name:'Ben', age:45},
                {name:'Laurance', age:42}
]
const users$ = Rx.Observable.from(users)
                .pluck('name')
                // .pluck('age')
users$.subscribe(x => console.log(x));

// flattening operators

// merge two Observables
Rx.Observable.of('hello')
.merge(Rx.Observable.of('world'))
.subscribe(x => console.log(x));

Rx.Observable.interval(250)
.merge(Rx.Observable.interval(500))
.take(25)
.subscribe(x => console.log(x));

// better merge
const source1$ = Rx.Observable.interval(250).map(v => 'merge1: ' + v)
const source2$ = Rx.Observable.interval(2000).map(v => 'merge2: ' + v)
Rx.Observable.merge(source1$, source2$)
.take(25)
.subscribe(x => console.log(x));

//concat
const source1$ = Rx.Observable.range(0, 5).map(v => 'source1: ' + v)
const source2$ = Rx.Observable.range(5, 11).map(v => 'source2: ' + v)
Rx.Observable.concat(source1$, source2$)
.subscribe(x => console.log(x));

//mergeMap or flatmap
//not correct way
Rx.Observable.of('hello')
    .subscribe(v => {
        Rx.Observable.of(v + ' everyone')
            .subscribe(v => console.log(v))
    })

//correct way using mergeMap
Rx.Observable.of('hello')
    .mergeMap(v => {
        return Rx.Observable.of(v + ' everyone')
    })
    .subscribe(v => console.log(v))

//switchMap, maintains only one inner subscription at a time
//On each emission the previous inner observable (the result of the function you supplied) is cancelled and the new observable is subscribed. 
function getUser(username){
    return $.ajax({
        url: `https://api.github.com/users/${username}`,
        dataType: 'jsonp'
    }).promise();
}

const username = $('#username')
const githubStream$ = Rx.Observable.fromEvent(username, 'keyup')
    .map(e => e.target.value)
    .switchMap(v => {
        return Rx.Observable.fromPromise(getUser(v))
    })


githubStream$.subscribe(_ => console.log(_.data.name));

