import time
import sys

def sieve_max_prime(limit):
    s = bytearray([1]) * (limit + 1)
    s[0] = s[1] = 0
    for i in range(2, int(limit ** 0.5) + 1):
        if s[i]:
            s[i * i::i] = bytearray(len(s[i * i::i]))
    for i in range(limit, 1, -1):
        if s[i]:
            return i
    return 2

limit = 50_000
highest = 2
last = time.time()
sys.stdout.write(f"{highest}\n")
sys.stdout.flush()

while True:
    highest = sieve_max_prime(limit)
    now = time.time()
    if now - last >= 1.0:
        sys.stdout.write(f"{highest}\n")
        sys.stdout.flush()
        last = now
    limit = int(limit * 2)
