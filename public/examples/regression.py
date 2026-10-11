# Python 3, standard library only. Synthetic teaching data, not measurements.
def mse(data, predict):
    return sum((y - predict(x)) ** 2 for x, y in data) / len(data)

def linear_fit(data):
    mx = sum(x for x, _ in data) / len(data)
    my = sum(y for _, y in data) / len(data)
    w = sum((x-mx)*(y-my) for x, y in data) / sum((x-mx)**2 for x, _ in data)
    return w, my - w * mx

train = [(0,1.2),(1,2.8),(2,5.2),(3,6.8),(4,9.2),(5,10.8)]
validation = [(0.5,2.1),(1.5,3.9),(2.5,6.1),(3.5,7.9),(4.5,10.1)]
w, b = linear_fit(train)  # Fit only on training data.
mean = sum(y for _, y in train) / len(train)
print(f"w={w:.4f}, b={b:.4f}")
print(f"training MSE={mse(train, lambda x: w*x+b):.5f}")
print(f"validation MSE={mse(validation, lambda x: w*x+b):.5f}")
print(f"mean baseline validation MSE={mse(validation, lambda x: mean):.5f}")
