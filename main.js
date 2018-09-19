var fs = require('fs');
var exec = require('child_process').exec;
var _ = require('lodash');


exec("git status", (err, stdout, stderr) => {
    let unrevisedFiles = filterFiles(stdout);
    console.log(unrevisedFiles)

    // console.log(unrevisedFiles);
});



let filterFiles = (input) => {
    let arrayOfLines = _.split(input, '\n');
     let filteredArrayOfLines = arrayOfLines.filter(line => line.startsWith("\t"));

     filteredArrayOfLines.forEach((s,n,a) => {
         let insideVal = s.replace('\t','' );
         a[n] = insideVal
     })    
    return filteredArrayOfLines;
}
