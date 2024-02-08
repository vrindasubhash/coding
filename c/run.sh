#!/bin/bash

FILE_NAME=${1:-tmp}

gcc -o "${FILE_NAME}" "./${FILE_NAME}.c"

"./${FILE_NAME}"

echo $?
