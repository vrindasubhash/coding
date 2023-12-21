#!/bin/bash

FILE_NAME=${1:-first}

gcc -o "${FILE_NAME}" "./${FILE_NAME}.c"

"./${FILE_NAME}"

echo $?
