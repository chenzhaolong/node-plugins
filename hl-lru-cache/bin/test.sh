#!/bin/sh

cd ../
file=""
while [ -n "$1" ]
   do
     case "$1" in
        -d)
           file="doubleLink.test.js"
           shift;;
        -l)
           file="lru.test.js"
           shift;;
        -c)
           file="cache.test.js"
           shift;;
        -a)
           file="doubleLink.test.js lru.test.js cache.test.js"
           shift;;
        *) shift;;
   esac
done
if [ "$file" != "" ];then
   for f in $file
   do
     mocha --require babel-register ./hl-lru-cache/test/$f
   done
fi