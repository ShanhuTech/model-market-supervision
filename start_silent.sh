#!/bin/bash

nohup ./start.sh > /dev/null 2>&1 &
tail -f ./log/record.log
