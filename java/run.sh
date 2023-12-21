#!/bin/bash

CLASS_NAME=${1:-Main}

javac "${CLASS_NAME}.java"

java "${CLASS_NAME}"
