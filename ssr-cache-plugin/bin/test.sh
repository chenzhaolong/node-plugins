#!/bin/sh

cd ../
file=""
while [ -n "$1" ]
   do
     case "$1" in
        -d)
           file="doubleLink.test.js"
           shift;;
        *) shift;;
   esac
done
if [ "$file" != "" ];then
   mocha --require babel-register ./ssr-cache-plugin/test/$file
fi