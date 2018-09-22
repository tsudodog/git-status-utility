#! /usr/bin/env node
var fs = require('fs');
var exec = require('child_process').exec;
var _ = require('lodash');
var program = require('commander');
var clc = require('cli-color');


/*
-- DO NOTHING
Initial commit

Changes to be committed:


*/
program.version('0.0.1')
    .option('-h, -help', 'Load Help')
    .option('--verbose', 'Verbose output')
    .parse(process.argv);

// -d Delete all offending lines
// -a --all go through all files 
// -add 


exec("git status", (err, stdout, stderr) => {
    if(program.verbose){
        console.log(__dirname,'\n\n');
        console.log('currentWorkingDirectory:\t', process.cwd());
        console.log(stdout);
    }

 //TODO: more robust logic

    let modifiedFiles = _.split((_.split(stdout, 'Untracked files:')[0]), "Changes to be committed:")[1];
    // console.log(modifiedFiles);
    let unrevisedFiles = filterFiles(modifiedFiles);
    console.log(unrevisedFiles)

    unrevisedFiles.forEach((s)=>{
        openFile(s);
    });


    // console.log(unrevisedFiles);
});


let openFile = (fileLocation) => {
    let absolutePath = process.cwd() + '/'+fileLocation;
    console.log('ABSOLUTEPATH:\t', absolutePath);
    fs.readFile(absolutePath, 'utf8', function(err, data){
        if(err){
            return console.log('openFile readFile threw exception \n', err);
        }

        examineText(data, fileLocation);
        // console.log(data);
    })
};


let filterFiles = (input) => {
    let arrayOfLines = _.split(input, '\n');
     let filteredArrayOfLines = arrayOfLines.filter(line => line.startsWith("\t"));

     filteredArrayOfLines.forEach((s,n,a) => {
         let insideVal = s.replace('\t','' );
         insideVal = _.split(insideVal, ':')[1]
         insideVal = _.trimStart(insideVal);
         a[n] = insideVal
     });    
    return filteredArrayOfLines;
}

let examineText = (fileText, fileLocation) => {
    let lines = _.split(fileText, '\n');
    for(let c = 0 ; c<lines.length; c++){
        if((lines[c].indexOf('System.out') > -1)){
            console.log(clc.yellow('WARNING file:\t', fileLocation, ' contains a System.out on line ', c+1));
        }
    }    
}
