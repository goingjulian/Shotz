#!/bin/bash

ls

cd '/Users/Julian/stack/Studie/ICT/Jaar\ 2/Blok\ 3\ -\ DWA/Quizzr/feb2019-quizz-julian-wout/'

BACKEND='backend'
QUIZMASTER='frontend/quizmaster'
TEAM= 'frontend/team'
SCOREBOARD='scoreboard'

progs[0]=$BACKEND 
progs[1]=$QUIZMASTER 
progs[2]=$TEAM 
progs[3]=$SCOREBOARD

echo "TEST"
echo progs[1]

echo "Spawning 5 processes"
for i in {1..5}; do  
    echo ${progs[i]}
    cd ${progs[i]}
    osascript -e 'tell application "Terminal" to do script "cd /Users/Julian/stack/Studie/ICT/Jaar\ 2/Blok\ 3\ -\ DWA/Quizzr/feb2019-quizz-julian-wout/'${progs[i]}'"'
done


