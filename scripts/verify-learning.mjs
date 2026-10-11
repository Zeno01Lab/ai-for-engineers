import assert from 'node:assert/strict';
import { regressionTrain, regressionValidation, linearFit, mse, classificationData, confusion, curveTrain, curveValidation, polynomialFit } from '../public/scripts/lab-models.mjs';
const {w,b}=linearFit(regressionTrain);
const mean=regressionTrain.reduce((sum,[,y])=>sum+y,0)/regressionTrain.length;
assert(mse(regressionValidation,x=>w*x+b)<mse(regressionValidation,()=>mean),'Regression must outperform its displayed baseline for this data');
for(const threshold of [0,.3,.5,.8,1]) {const c=confusion(classificationData,threshold);assert.equal(c.tp+c.fp+c.tn+c.fn,10);assert.equal(c.accuracy,(c.tp+c.tn)/10);}
assert.equal(confusion(classificationData,1).precision,null,'No positive prediction must not display perfect precision');
assert.equal(confusion(classificationData,.5).tp,3);assert.equal(confusion(classificationData,.5).fn,2);
const simple=polynomialFit(curveTrain,1), complex=polynomialFit(curveTrain,8);
assert(mse(curveTrain,complex)<1e-10,'Interpolation demonstration must fit training samples');
assert(mse(curveValidation,complex)>10*mse(curveValidation,simple),'Overfitting example must demonstrate the claimed validation gap');
console.log('PASS: learning demonstrations, displayed baseline, confusion counts, undefined precision and overfitting contrast.');
