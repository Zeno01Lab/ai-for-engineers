# Python 3, standard library only. Synthetic teaching data, not measurements.
def mse(data, predict):
    return sum((y - predict(x)) ** 2 for x, y in data) / len(data)

def linear_fit(data):
    mx = sum(x for x, _ in data) / len(data)
    my = sum(y for _, y in data) / len(data)
    w = sum((x-mx)*(y-my) for x, y in data) / sum((x-mx)**2 for x, _ in data)
    return w, my - w * mx

def polynomial_fit(data, degree):
    # Least squares on a tiny shifted input. Not a general-purpose solver.
    n = degree + 1
    matrix = [[sum(y*(2*x-1)**i if j == n else (2*x-1)**(i+j)
                   for x, y in data) for j in range(n+1)] for i in range(n)]
    for col in range(n):
        pivot = max(range(col, n), key=lambda r: abs(matrix[r][col]))
        matrix[col], matrix[pivot] = matrix[pivot], matrix[col]
        scale = matrix[col][col]
        if abs(scale) < 1e-12: raise ValueError("Singular model")
        for j in range(col, n+1): matrix[col][j] /= scale
        for row in range(n):
            if row == col: continue
            factor = matrix[row][col]
            for j in range(col, n+1): matrix[row][j] -= factor * matrix[col][j]
    coefficients = [row[n] for row in matrix]
    def predict(x):
        value = 0.0
        for c in reversed(coefficients): value = value * (2*x-1) + c
        return value
    return predict

train = [(0,.12),(.125,.31),(.25,.29),(.375,.46),(.5,.5),
         (.625,.69),(.75,.7),(.875,.94),(1,.83)]
# Deliberately clean validation trend to isolate interpolation of training noise.
validation = [((i+.5)/8, .1+.8*(i+.5)/8) for i in range(8)]
for degree in (1, 3, 8):
    predict = polynomial_fit(train, degree)
    print(f"degree={degree}: training MSE={mse(train,predict):.5f}, "
          f"validation MSE={mse(validation,predict):.5f}")
# For this demonstration we inspect validation repeatedly; it is not a final test.
