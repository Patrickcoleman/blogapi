import time
import sys

def is_prime(n):
    if n < 2: return False
    if n == 2: return True
    if n % 2 == 0: return False
    i = 3
    while i * i <= n:
        if n % i == 0: return False
        i += 2
    return True

highest = 2
candidate = 3
last = time.time()
sys.stdout.write(f"{highest}\n")
sys.stdout.flush()

while True:
    if is_prime(candidate):
        highest = candidate
    candidate += 2
    now = time.time()
    if now - last >= 1.0:
        sys.stdout.write(f"{highest}\n")
        sys.stdout.flush()
        last = now
