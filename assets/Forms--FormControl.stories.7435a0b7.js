import{r as t,j as n,a5 as o,a4 as u}from"./index.66b6286a.js";const d=()=>{const[e,a]=t.exports.useState("");return n(o,{control:{currentValue:e,handleChange:({name:s,value:l})=>{a(l)},name:"FormControl FieldInput",placeholder:"placeholder value"},label:"variableName",labelAddOn:n(u,{copy:"[String!]!"})})};d.storyName="FieldInput with labelAddOn";const c=()=>{const[e,a]=t.exports.useState("");return n(o,{control:{currentValue:e,handleChange:({name:s,value:l})=>{a(l)},name:"FormControl FieldInput",placeholder:"placeholder value"},label:"variableName"})};c.storyName="FieldInput without labelAddOn";const m=()=>{const[e,a]=t.exports.useState("");return n(o,{control:{currentValue:e,handleChange:({name:s,value:l})=>{a(l)},name:"FormControl FieldSelect",options:[{value:"true",name:"True"},{value:"false",name:"False"}]},label:"variableName",labelAddOn:n(u,{copy:"[SomeEnum!]!"})})};m.storyName="FieldSelect with labelAddOn";const h=()=>{const[e,a]=t.exports.useState("");return n(o,{control:{currentValue:e,handleChange:({name:s,value:l})=>{a(l)},name:"FormControl FieldSelect",options:[{value:"true",name:"True"},{value:"false",name:"False"}]},label:"variableName"})};h.storyName="FieldSelect without labelAddOn";export{d as A,c as B,m as C,h as D};
