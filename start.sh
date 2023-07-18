#!/bin/bash

java -server -d64  -Xms512m -Xmx2048m -Xmn512m -Xss32m -cp ./target/classes/:./repository/* -Duser.dir=`pwd` env.App
