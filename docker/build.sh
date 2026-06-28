#!/bin/sh
set -e
docker build -t prime-trial-division ./trial-division
docker build -t prime-sieve ./sieve
docker build -t prime-miller-rabin ./miller-rabin
echo "All images built."
