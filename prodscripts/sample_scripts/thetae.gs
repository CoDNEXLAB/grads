* Script to display Theta-E based on the layer set by the grads command "set lev 850" for example to get theta-e for 850MB
* Done by Michael Maxwell @ kd5giv@yahoo.com Also used Bob Hart's Skew-t script for GrADS to get the equations
'tc=(t-273.16)'
'td=tc-( (14.55+0.114*tc)*(1-0.01*rh) + pow((2.5+0.007*tc)*(1-0.01*rh),3) + (15.9+0.117*tc)*pow((1-0.01*rh),14) )'
'define vapr= 6.112*exp((17.67*td)/(td+243.5))'
'define e= vapr*1.001+(lev-100)/900*0.0034'
'define mixr= 0.62197*(e/(lev-e))*1000'
'define dwpk= td+273.16'
'undefine td'
'define tlcl= 1/(1/(dwpk-56)+log(t/dwpk)/800)+56'
'undefine e'
'define theta=t*pow(1000/lev,0.286)'
'define thte=theta*exp((3.376/Tlcl-0.00254)*mixr*1.0+0.00081*mixr)'
'undefine vapr'
'undefine dwpk'
'display thte'

