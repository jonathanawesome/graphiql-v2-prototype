import{r as c,j as t,a as l,a5 as i,a6 as n}from"./index.da61d0ae.js";const m=()=>{const[e,d]=c.exports.useState(null),r=({name:a,value:s})=>{d(u=>({...u,[a]:s}))};return t("div",{style:{display:"flex",gap:24,width:"100%"},children:[l(i,{formType:{type:"STATIC",submitHandler:a=>{a.preventDefault(),alert(e?`values: ${JSON.stringify(e,null," ")}`:"you haven't entered any data")}},formControls:[{control:{currentValue:e?e["FormControl FieldInput1"]:"",handleChange:r,name:"FormControl FieldInput1",placeholder:"placeholder value"},label:"variableName",labelAddOn:l(n,{copy:"[String!]!"})},{control:{currentValue:e?e["FormControl FieldInput2"]:"",handleChange:r,name:"FormControl FieldInput2",placeholder:"placeholder value"},label:"variableName",labelAddOn:l(n,{copy:"[String!]!"})},{control:{currentValue:e?e["FormControl FieldSelect"]:"",handleChange:r,name:"FormControl FieldSelect",options:[{value:"true",name:"True"},{value:"false",name:"False"}]},label:"variableName",labelAddOn:l(n,{copy:"[SomeEnum!]!"})}]}),l("div",{children:e&&Object.keys(e).map(a=>t("div",{style:{display:"flex",gap:12},children:[l("span",{children:a}),l("span",{children:e[a]})]},a))})]})};m.storyName="StaticForm";const p=()=>{const[e,d]=c.exports.useState(null),r=({name:o,value:a})=>{d(s=>({...s,[o]:a}))};return c.exports.useEffect(()=>{console.log("do something with your values",{values:e})},[e]),t("section",{children:[l(i,{formType:{type:"DYNAMIC"},formControls:[{control:{currentValue:e?e["FormControl FieldInput1"]:"",handleChange:r,name:"FormControl FieldInput1",placeholder:"placeholder value"},label:"variableName",labelAddOn:l(n,{copy:"[String!]!"})},{control:{currentValue:e?e["FormControl FieldInput2"]:"",handleChange:r,name:"FormControl FieldInput2",placeholder:"placeholder value"},label:"variableName",labelAddOn:l(n,{copy:"[String!]!"})},{control:{currentValue:e?e["FormControl FieldSelect"]:"",handleChange:r,name:"FormControl FieldSelect",options:[{value:"true",name:"True"},{value:"false",name:"False"}]},label:"variableName",labelAddOn:l(n,{copy:"[SomeEnum!]!"})}]}),l("div",{children:e&&Object.keys(e).map(o=>t("div",{style:{display:"flex",gap:12},children:[l("span",{children:o}),l("span",{children:e[o]})]},o))})]})};p.storyName="DynamicForm";export{p as DynamicForm,m as StaticForm};
