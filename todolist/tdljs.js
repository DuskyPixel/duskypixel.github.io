"use strict";

var tasks = [];
var taskIDCount = 0;

//task class
function Task(name, taskID,level) {
    this._name = name;
    this._taskID = taskID;
    this._description = "";//not used yet
    this._priority = 1;//not used yet
    this._isBug = false;//not used yet
    this._isFinished = false;//not used yet
    this._level = level;

    this.promote = function (){
        this._level+=1;
        if(this._level>=3){
            this._isFinished=true;
        }
    }
    this.getTaskID = function(){
        return this._taskID;
    }
    this.getLevel = function(){
        return this._level;
    }
    this.getStringHTML = function(){
        return "<li id='"+this._taskID+"'><span class='delete'><i class='fa fa-trash'></i></span> <span class='taskName'>"+this._name +"</span><span class='promote'><i class='fa fa-arrow-right'></i></span>";
    }
}

//get task by ID
function getTaskByID(taskID){
    for(var i=0;i<tasks.length;i++){
        if(tasks[i].getTaskID() == taskID){
            return tasks[i];
        }
    }
}

//promote task to next list
$("ul").on("click", ".promote", function(){
    var task = getTaskByID($(this).parent().attr("id"));
    var oldLevel = task.getLevel();
    task.promote();

    if(oldLevel==1){
        $("#mainContainer").children("#listTwo").children('ul').hide().append(task.getStringHTML()).fadeIn(400);
    }
    else if(oldLevel == 2){
        $("#mainContainer").children("#listThree").children('ul').hide().append(task.getStringHTML()).fadeIn(400, function(){
            $(this).children(task.getTaskID()).addClass("completed");
        });
    }
    //remove task from this list to higher level
    if(oldLevel === 1 || oldLevel === 2)
    {
        $(this).parent().fadeOut(400, function(){

            $(this).remove();
        });
    }


});

//remove task completely
$("ul").on("click", ".delete", function(e){
    $(this).parent().fadeOut(500, function(){
        //remove task from array
        console.log("size:"+tasks.length);
        for(var i=tasks.length-1;i>=0;i--){
            if(tasks[i].getTaskID() == $(this).attr("id")){
                tasks.splice(i,1);
            }
        }
        console.log("size:"+tasks.length);
        //remove task html
        $(this).remove();
    });
    e.stopPropagation();
});


//create function that creates complete html setup each time action is performed.
//task to string

//add new task from input box
$("input").keypress(function(e){
    if(e.which===13){
        var name = $(this).val();
        var level = 0;
        $(this).val("");

        if($(this).closest('div').attr("id") === "listOne"){
            level = 1;
        }
        else if($(this).closest('div').attr("id") === "listTwo"){
            level = 2;
        }
        else if($(this).closest('div').attr("id") === "listThree"){
            level = 3;

        }
        var task = new Task(name, taskIDCount, level);

        $(this).closest('div').children('ul').hide().append(task.getStringHTML()).fadeIn(400,function(){
            if(level === 3){
                $(this).children(task.getTaskID()).addClass("completed");
            }
        });
        //$(this).closest('div').children('ul').children(task.getTaskID()).addClass("completed");
        tasks.push(task);
        taskIDCount+=1;
    }

});



//select specific textbox of plus button pressed
$('.plusButton').click(function() {
    $('input[type="text"]').fadeOut();
    $(this).closest('.container1').children('input[type="text"]').fadeToggle(400);
});