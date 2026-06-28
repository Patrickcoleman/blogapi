import time
import sys

WITNESSES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]

def is_prime(n):
    if n < 2: return False
    if n < 4: return True
    if n % 2 == 0: return False
    r, d = 0, n - 1
    while d % 2 == 0:
        r += 1
        d //= 2
    for a in WITNESSES:
        if a >= n: continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1: continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1: break
        else:
            return False
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
