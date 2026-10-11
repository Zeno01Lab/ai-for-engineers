// Deterministic synthetic teaching data. No real equipment measurements.
export const regressionTrain = [[0,1.2],[1,2.8],[2,5.2],[3,6.8],[4,9.2],[5,10.8]];
export const regressionValidation = [[0.5,2.1],[1.5,3.9],[2.5,6.1],[3.5,7.9],[4.5,10.1]];
export const classificationData = [[0.05,0],[0.15,0],[0.25,1],[0.35,0],[0.45,1],[0.55,0],[0.65,1],[0.75,1],[0.85,0],[0.95,1]];
export const curveTrain = [[0,.12],[.125,.31],[.25,.29],[.375,.46],[.5,.5],[.625,.69],[.75,.7],[.875,.94],[1,.83]];
export const curveValidation = Array.from({length:8},(_,i)=>{const x=(i+.5)/8;return [x,.1+.8*x];});
export function mse(data, predict) { return data.reduce((sum,[x,y])=>sum+(y-predict(x))**2,0)/data.length; }
export function linearFit(data) { const n=data.length; const mx=data.reduce((s,[x])=>s+x,0)/n; const my=data.reduce((s,[,y])=>s+y,0)/n; const w=data.reduce((s,[x,y])=>s+(x-mx)*(y-my),0)/data.reduce((s,[x])=>s+(x-mx)**2,0); return {w,b:my-w*mx}; }
export function confusion(data, threshold) {
  const counts={tp:0,fp:0,tn:0,fn:0};
  for(const [score,label] of data) { const predicted=score>=threshold; counts[predicted?(label?'tp':'fp'):(label?'fn':'tn')]++; }
  const {tp,fp,tn,fn}=counts;
  return {...counts,accuracy:(tp+tn)/data.length,precision:tp+fp ? tp/(tp+fp):null,recall:tp+fn ? tp/(tp+fn):null};
}
export function polynomialFit(data,degree) {
  // Shift x to [-1,1] to reduce conditioning problems in this tiny example.
  const n=degree+1;
  const matrix=Array.from({length:n},(_,i)=>Array.from({length:n+1},(_,j)=>data.reduce((s,[x,y])=>s+(j===n?y*(2*x-1)**i:(2*x-1)**(i+j)),0)));
  for(let col=0;col<n;col++) {
    let pivot=col; for(let row=col+1;row<n;row++) if(Math.abs(matrix[row][col])>Math.abs(matrix[pivot][col]))pivot=row;
    [matrix[pivot],matrix[col]]=[matrix[col],matrix[pivot]];
    if(Math.abs(matrix[col][col])<1e-12)throw new Error('Singular model');
    const scale=matrix[col][col];for(let j=col;j<=n;j++)matrix[col][j]/=scale;
    for(let row=0;row<n;row++)if(row!==col){const factor=matrix[row][col];for(let j=col;j<=n;j++)matrix[row][j]-=factor*matrix[col][j];}
  }
  const coefficients=matrix.map(row=>row[n]);
  return x=>coefficients.reduceRight((value,c)=>value*(2*x-1)+c,0);
}
