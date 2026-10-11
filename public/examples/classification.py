# Python 3, standard library only. Fixed synthetic scores, not calibrated probabilities.
data = [(0.05,0),(0.15,0),(0.25,1),(0.35,0),(0.45,1),
        (0.55,0),(0.65,1),(0.75,1),(0.85,0),(0.95,1)]
for threshold in (0.3, 0.5, 0.8, 1.0):
    tp = fp = tn = fn = 0
    for score, actual in data:
        predicted = score >= threshold
        if predicted and actual: tp += 1
        elif predicted: fp += 1
        elif actual: fn += 1
        else: tn += 1
    precision = f"{tp/(tp+fp):.3f}" if tp+fp else "undefined"
    recall = tp/(tp+fn)
    print(f"threshold={threshold:.1f}: TP={tp}, FP={fp}, TN={tn}, FN={fn}, "
          f"precision={precision}, recall={recall:.3f}")
# Select thresholds using validation data and error costs.
# Do not repeatedly choose thresholds using the final test set.
