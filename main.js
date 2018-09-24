#! /usr/bin/env node
/*jshint esversion: 6*/
var fs = require('fs');
var exec = require('child_process').exec;
var _ = require('lodash');
var program = require('commander');
var clc = require('cli-color');



//ideas for future funtionality
// add an auto delete
// add scan all functionality instead of the default staging area.

program
    .version('0.0.1')
    .option('-v, --verbose', 'Verbose Output')
    .parse(process.argv);




exec("git status", (err, stdout, stderr) => {
    if(program.verbose){
        console.log('GITHUB STANDARD OUTPUT:\n');
        console.log(clc.green(stdout));
        console.log('END OF GITHUB STANDARD OUTPUT')
    }
   

    let lineSplit      =  _.split(_.split(stdout, "Changes to be committed:\n")[1], '\n');
    let stopAdding = false;
    let nArrayOfFiles = lineSplit.filter( (s) => {
        if(_.startsWith(s, "\t") && !stopAdding){
            console.log('Scanning:', clc.yellowBright(s.replace("\t","")));
            
            return s;
        }
        if(_.endsWith(s, ":")){
            stopAdding = true;
        }
    } );

    let newFileList = filterFiles(nArrayOfFiles);

    newFileList.forEach((s)=>{
        openFile(s);
    });

});


let openFile = (fileLocation) => {
    let absolutePath = process.cwd() + '/'+fileLocation;
    fs.readFile(absolutePath, 'utf8', function(err, data){
        if(err){
            return console.log('openFile readFile threw exception \n', err);
        }
        examineText(data, fileLocation);
       
    });
};


let filterFiles = (input) => {
    return input.map( (s)=>{
        let insideVal = s.replace('\t','' );
        insideVal = _.split(insideVal, ':')[1];
        insideVal = _.trimStart(insideVal);
        return insideVal;
     });
};

//TODO: make this configurable somehow not sure what the best way to do this is 
// but custom errors should be easy to provide
let examineText = (fileText, fileLocation) => {
    let lines = _.split(fileText, '\n');
    for(let c = 0 ; c<lines.length; c++){
        if((lines[c].indexOf('System.out') > -1)){
            console.log(clc.red('FILE:\t', fileLocation, ' contains a System.out on line ', c+1));
        }
        if((lines[c].indexOf('console.log')> -1)){
            console.log(clc.red('FILE:\t', fileLocation, ' contains a console.log on line ', c+1));
        }
        if((lines[c].indexOf('debugger')> -1)){
            console.log(clc.redBright('FILE:\t', fileLocation, ' contains a debugger on line ', c+1));
        }
    }    
};
