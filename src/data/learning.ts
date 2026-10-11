export const lessons = [
  {id:'regression-lab', title:'用一条直线预测能耗', question:'我有数据，如何预测一个数？', duration:'25–40 分钟', output:'拟合一条直线，并比较均值基线和验证误差。', resource:'https://developers.google.com/machine-learning/crash-course/linear-regression', label:'Google · 线性回归', step:'拖动斜率，观察预测线与误差；再运行 Python 示例。', check:'解释输入、输出、斜率和误差分别表示什么。'},
  {id:'classification-lab', title:'故障识别：阈值改变了什么？', question:'如何把一个分数变成类别？', duration:'25–40 分钟', output:'读懂误报、漏报与混淆矩阵。', resource:'https://developers.google.com/machine-learning/crash-course/classification/thresholding', label:'Google · 阈值与混淆矩阵', step:'拖动阈值，观察哪些故障被漏掉，哪些正常样本被误报。', check:'解释为什么准确率相同的两种方案也可能有不同代价。'},
  {id:'overfitting-lab', title:'为什么拟合得更好，预测却更差？', question:'训练结果能代表新数据吗？', duration:'30–45 分钟', output:'比较简单与复杂模型的训练、验证误差。', resource:'https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets', label:'Google · 数据划分', step:'切换多项式次数，检查曲线与两组误差；写下模型选择理由。', check:'解释训练、验证、测试分别用于什么。'},
];
