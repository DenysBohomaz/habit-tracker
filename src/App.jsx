import React, { useState, useEffect, useRef } from "react";

var SK = "cht_v2"; var DAYS = ["sun","mon","tue","wed","thu","fri","sat"]; var DL = ["Su","Mo","Tu","We","Th","Fr","Sa"]; var TIMES = ["morning","afternoon","evening","anytime"]; var TI = {morning:"🌅",afternoon:"☀️",evening:"🌙",anytime:"⏰"}; var EMJ = ["💪","📚","💧","🧘","📵","🏃","🥗","😴","🎯","🚴","🌿","🎨","💊","🛁","☕","🥤","🧠","❤️"]; var PRESETS = [{id:"daily",label:"Every day",days:["sun","mon","tue","wed","thu","fri","sat"]},{id:"weekdays",label:"Weekdays",days:["mon","tue","wed","thu","fri"]},{id:"weekends",label:"Weekends",days:["sat","sun"]}]; var BLANK = {name:"",emoji:"🎯",freq:["sun","mon","tue","wed","thu","fri","sat"],time:"morning",notes:"",target:1}; var DEF_G = {water:{min:1,norm:3,max:4},sleep:{min:6,norm:8,max:10},calories:{min:1200,norm:2000,max:2800}};

var I18N = {
  en: {
    hello:"Hello",helloDefault:"Champion",profile:"Profile",profileName:"Your name",profilePlaceholder:"Enter your name...",today:"Today",calendar:"Calendar",analytics:"Analytics",settings:"Settings",
    sleep:"Sleep",water:"Water",calories:"Calories",addNote:"Add note",habitTracking:"Habit Tracking",
    done:"done",of:"of",noHabits:"No habits today.",enterHrs:"enter hrs",goal:"Goal",left:"left",norm:"norm",log:"log",
    overall:"Overall",noSched:"No habits scheduled.",dayNote:"How is your day going?",
    editHabits:"Edit Habits",habitsConfigured:"habits configured",adjustGoal:"Adjust goal range",calcNorm:"Calculate your personal norm",
    language:"Language",visualMode:"Visual Mode",morning:"Morning",evening:"Evening",
    general:"General",week:"This Week",month:"This Month",allTime:"General",
    tasks:"Tasks",plan:"Plan",later:"Later",importance:"Importance",urgency:"Urgency",sortByScore:"Sort by score",pinTask:"Pin",addTask:"Add task...",noTasks:"No tasks today.",editTask:"Edit task",allTasks:"All",addTag:"New tag...",tag:"Tag",description:"Description",deadline:"Deadline",reminder:"Reminder",deleteTask:"Delete",
    perfect:"Perfect",partial:"Partial",missed:"Missed",daysTracked:"Days Tracked",habits:"Habits",days:"Days",perfectRate:"Perfect Rate",bestStreak:"Best Streak",
    newHabit:"New Habit",editHabit:"Edit Habit",saveHabit:"Save habit",cancel:"Cancel",save:"Save",delete:"Delete",edit:"Edit",
    frequency:"Frequency",timeOfDay:"Time of day",dailyReps:"Daily repetitions",howMany:"How many times per day",notes:"Notes",optNotes:"Optional notes...",habitName:"Habit name...",
    add:"+ Add",tellAte:"Tell me what you ate",hopeTasty:"Hope it was delicious 😋",removingCal:"Removing calories",removingFrom:"Removing from today's total",addKcal:"Add",removeKcal:"Remove",
    howMuch:"How much did you complete?",howManyDone:"How many times did you complete?",timesOf:"times out of",
    gender:"What is your gender?",step1:"Step 1 of 4",male:"Male",female:"Female",
    measurements:"Your measurements",step2:"Step 2 of 4",weight:"Weight",height:"Height",age:"Age",
    yourGoal:"What is your goal?",step3:"Step 3 of 4",maintain:"Maintain weight",lose:"Lose weight",gain:"Gain mass",
    activity:"Activity level",step4:"Step 4 of 4",
    sedentary:"Sedentary (desk job, no exercise)",light:"Light (1-3 workouts/week)",moderate:"Moderate (3-5 workouts/week)",active:"Active (6-7 workouts/week)",veryActive:"Very active (physical job)",
    calcReady:"Your calorie norm is ready!",tdeeNote:"Your daily calorie norm based on your goal and personal data",applyNorm:"Apply this norm",
    minimum:"Minimum",maximum:"Maximum",saveGoals:"Save Goals",
    back:"Back",continue:"Continue",calculate:"Calculate",
    min:"Min",max:"Max",
    everyDay:"Every day",weekdays:"Weekdays",weekends:"Weekends",
    tracksPerDay:"Tracks {n} completions/day",
    goalReached:"Goal reached",
    great:"🌟 Great!",okay:"😐 Okay",low:"😩 Low",
    goalLabel:"goal",
    habitDetails:"Habit details",
    journal:"Journal",journalSub:"Daily reflections",journalEmpty:"No entries yet",
    jDay:"Day",jWeek:"Week",jMonth:"Month",jAll:"All time",jCustom:"Custom",
  },
  uk: {
    hello:"Привіт",helloDefault:"Чемпіоне",profile:"Профіль",profileName:"Ваше ім'я",profilePlaceholder:"Введіть ваше ім'я...",today:"Сьогодні",calendar:"Календар",analytics:"Аналітика",settings:"Налаштування",
    sleep:"Сон",water:"Вода",calories:"Калорії",addNote:"Рефлексувати",habitTracking:"Трекінг звичок",
    done:"виконано",of:"з",noHabits:"Немає звичок на сьогодні.",enterHrs:"введіть години",goal:"Норма",left:"залишилось",norm:"норма",log:"запис",
    overall:"Загалом",noSched:"Немає запланованих звичок.",dayNote:"Як ваш день?",
    editHabits:"Редагувати звички",habitsConfigured:"звичок налаштовано",adjustGoal:"Налаштувати діапазон",calcNorm:"Розрахувати особисту норму",
    language:"Мова",visualMode:"Візуальний режим",morning:"Ранок",evening:"Вечір",
    general:"Загальне",week:"Цей тиждень",month:"Цей місяць",allTime:"Загальне",
    tasks:"Задачі",plan:"План",later:"Пізніше",importance:"Важливість",urgency:"Терміновість",sortByScore:"Сортувати",pinTask:"Закріпити",addTask:"Додати задачу...",noTasks:"Немає задач сьогодні.",editTask:"Редагувати задачу",allTasks:"Всі",addTag:"Новий тег...",tag:"Тег",description:"Опис",deadline:"Дедлайн",reminder:"Нагадування",deleteTask:"Видалити",
    perfect:"Ідеально",partial:"Частково",missed:"Пропущено",daysTracked:"Днів відстежено",habits:"Звички",days:"Днів",perfectRate:"Відсоток ідеальних",bestStreak:"Найкраща серія",
    newHabit:"Нова звичка",editHabit:"Редагувати звичку",saveHabit:"Зберегти звичку",cancel:"Скасувати",save:"Зберегти",delete:"Видалити",edit:"Редагувати",
    frequency:"Частота",timeOfDay:"Час дня",dailyReps:"Повторення на день",howMany:"Скільки разів на день",notes:"Нотатки",optNotes:"Необов'язкові нотатки...",habitName:"Назва звички...",
    add:"+ Додати",tellAte:"Поскажи, що ти з'їв",hopeTasty:"Сподіваюсь, було смачно 😋",removingCal:"Видалення калорій",removingFrom:"Видаляємо з сьогоднішнього показника",addKcal:"Додати",removeKcal:"Видалити",
    howMuch:"На скільки виконано?",howManyDone:"Скільки разів виконано?",timesOf:"раз з",
    gender:"Ваша стать?",step1:"Крок 1 з 4",male:"Чоловік",female:"Жінка",
    measurements:"Ваші параметри",step2:"Крок 2 з 4",weight:"Вага",height:"Зріст",age:"Вік",
    yourGoal:"Ваша мета?",step3:"Крок 3 з 4",maintain:"Підтримувати вагу",lose:"Схуднути",gain:"Набрати масу",
    activity:"Рівень активності",step4:"Крок 4 з 4",
    sedentary:"Мінімальна (сидяча робота)",light:"Легка (1-3 трен. на тиждень)",moderate:"Середня (3-5 трен.)",active:"Висока (6-7 трен.)",veryActive:"Дуже висока (фіз. робота)",
    calcReady:"Ваша норма калорій готова!",tdeeNote:"Ваша добова норма калорій з урахуванням вашої мети та особистих даних",applyNorm:"Застосувати норму",
    minimum:"Мінімум",maximum:"Максимум",saveGoals:"Зберегти",
    back:"Назад",continue:"Далі",calculate:"Порахувати",
    min:"Мін",max:"Макс",
    everyDay:"Щодня",weekdays:"Будні",weekends:"Вихідні",
    tracksPerDay:"Трекує {n} разів на день",
    goalReached:"Норму виконано",
    great:"🌟 Чудово!",okay:"😐 Нормально",low:"😩 Мало",
    goalLabel:"норма",
    habitDetails:"Деталі звички",
    journal:"Журнал",journalSub:"Рефлексія по днях",journalEmpty:"Записів поки немає",
    jDay:"День",jWeek:"Тиждень",jMonth:"Місяць",jAll:"Весь час",jCustom:"Кастом",
  }
};

function loadLS(){try{var r=localStorage.getItem(SK);return r?JSON.parse(r):null;}catch(e){return null;}}
function saveLS(s){try{localStorage.setItem(SK,JSON.stringify(s));}catch(e){}}
function todayKey(){return new Date().toISOString().slice(0,10);}
function isoD(d){return d.toISOString().slice(0,10);}
function dow(iso){return DAYS[new Date(iso).getDay()];}
function dim(y,m){return new Date(y,m+1,0).getDate();}
function fdm(y,m){return new Date(y,m,1).getDay();}
function dRange(s,e){var ks=[],c=new Date(s);while(c<=e){ks.push(isoD(c));c.setDate(c.getDate()+1);}return ks;}
function wkBounds(){var n=new Date(),d=n.getDay(),s=new Date(n);s.setDate(n.getDate()-d);var e=new Date(s);e.setDate(s.getDate()+6);return[s,e];}
function getPct(h,date,counts){var c=(counts[date]&&counts[date][h.id])||0;return Math.min(Math.round(c/Math.max(1,h.target||1)*100),100);}
function hSt(h,date,counts){var p=getPct(h,date,counts);return p===0?"none":p===100?"full":"partial";}
function dayScore(habits,date,counts){var d=dow(date),sc=habits.filter(function(h){return h.freq.includes(d);});if(!sc.length)return null;return Math.round(sc.reduce(function(s,h){return s+getPct(h,date,counts);},0)/sc.length);}
function daySt(habits,date,counts){var s=dayScore(habits,date,counts);if(s===null)return"empty";if(s===100)return"full";if(s===0)return"none";return"partial";}
function streak(hid,checked){var s=0,t=new Date();for(var i=0;i<365;i++){var d=new Date(t);d.setDate(t.getDate()-i);var k=isoD(d);if((checked[k]||[]).includes(hid))s++;else break;}return s;}
function setK(obj,key,val){var n=Object.assign({},obj);n[key]=val;return n;}

var DEF_H = [
  {id:1,name:"Morning workout",emoji:"💪",freq:["sun","mon","tue","wed","thu","fri","sat"],time:"morning",notes:"",target:1},
  {id:2,name:"Read 20 minutes",emoji:"📚",freq:["sun","mon","tue","wed","thu","fri","sat"],time:"evening",notes:"",target:1},
  {id:3,name:"Drink 2L water",emoji:"💧",freq:["sun","mon","tue","wed","thu","fri","sat"],time:"morning",notes:"",target:1},
  {id:4,name:"Meditate",emoji:"🧘",freq:["sun","mon","tue","wed","thu","fri","sat"],time:"morning",notes:"",target:1},
  {id:5,name:"No social media 9pm+",emoji:"📵",freq:["sun","mon","tue","wed","thu","fri","sat"],time:"evening",notes:"",target:1},
];

function initSt(){
  var s=loadLS();
  return{
    habits:(s&&s.habits)||DEF_H,
    counts:(s&&s.counts)||{},
    checked:(s&&s.checked)||{},
    dayNotes:(s&&s.dayNotes)||{},
    water:(s&&s.water)||{},
    sleep:(s&&s.sleep)||{},
    calories:(s&&s.calories)||{},
    goals:(s&&s.goals)||{water:{min:1,norm:3,max:4},sleep:{min:6,norm:8,max:10},calories:{min:1200,norm:2000,max:2800}},
    lang:(s&&s.lang)||"en",
    theme:(s&&s.theme)||"morning",
    profileName:(s&&s.profileName)||"",
    calWizData:(s&&s.calWizData)||null,
    tasks:(s&&s.tasks)||[],
    laterTasks:(s&&s.laterTasks)||[],
    tags:(s&&s.tags)||[],
  };
}
function initUi(){return{tab:"today",aTab:"general",yr:new Date().getFullYear(),mo:new Date().getMonth(),pDay:null,editH:null,detH:null,detFrom:null,form:Object.assign({},BLANK),thumb:{},confetti:false,hPopup:null,calPop:false,calIn:"",calMode:"+",sPanel:null,gDraft:null,wiz:null,taskInput:"",taskDragIdx:null,taskDragOver:null,taskDragList:null,taskPopup:null,taskEdit:null,activeTag:null,tagInput:"",showTagInput:false,taskDeleteConfirm:null,journalFilter:"week",journalFrom:"",journalTo:""};}

export default function App(){
  var st0=useState(initSt),st=st0[0],setSt=st0[1];
  var ui0=useState(initUi),ui=ui0[0],setUi=ui0[1];
  var TODAY=todayKey();
  var reminderTimers=useRef({});
  useEffect(function(){saveLS(st);},[st]);
  useEffect(function(){
    Object.values(reminderTimers.current).forEach(clearTimeout);
    reminderTimers.current={};
    var all=st.tasks.concat(st.laterTasks);
    all.forEach(function(tk){
      if(!tk.reminder)return;
      var diff=new Date(tk.reminder)-new Date();
      if(diff<=0)return;
      reminderTimers.current[tk.id]=setTimeout(function(){
        if("Notification" in window&&Notification.permission==="granted"){
          new Notification("Task Reminder",{body:tk.text,icon:"/favicon.ico"});
        }
      },diff);
    });
    return function(){Object.values(reminderTimers.current).forEach(clearTimeout);};
  },[st.tasks,st.laterTasks]);
  useEffect(function(){
    if(ui.editH==="new"){setUi(function(u){return setK(u,"form",Object.assign({},BLANK));});}
    else if(ui.editH&&ui.editH!=="new"){var h=ui.editH;setUi(function(u){return setK(u,"form",Object.assign({},h));});}
  },[ui.editH]);

  var t=I18N[st.lang]||I18N.en;
  var isDark=st.theme==="evening";

  var bg=isDark?"#0f1117":"#f3f4f6";
  var card=isDark?"#1e2130":"#ffffff";
  var border=isDark?"#2e3347":"#e5e7eb";
  var textMain=isDark?"#e8eaf6":"#111827";
  var textSub=isDark?"#8892b0":"#6b7280";
  var textLight=isDark?"#606880":"#9ca3af";
  var darkBg=isDark?"#161926":"#f9fafb";
  var green="#16a34a",greenBg=isDark?"#0d2818":"#f0fdf4",greenBo=isDark?"#1a5c35":"#86efac";
  var yellow="#b45309",yellowBg=isDark?"#2d1f00":"#fffbeb",yellowBo=isDark?"#5c3a00":"#fcd34d";
  var red="#dc2626",redBg=isDark?"#2d0b0b":"#fef2f2",redBo=isDark?"#5c1515":"#fca5a5";

  var SC={full:{bg:greenBg,bo:greenBo,tx:green},partial:{bg:yellowBg,bo:yellowBo,tx:yellow},none:{bg:redBg,bo:redBo,tx:red},empty:{bg:darkBg,bo:border,tx:textLight}};

  var todayDow=dow(TODAY);
  var todayH=st.habits.filter(function(h){return h.freq.includes(todayDow);});
  var oPct=todayH.length?Math.round(todayH.reduce(function(s,h){return s+getPct(h,TODAY,st.counts);},0)/todayH.length):0;
  useEffect(function(){if(oPct===100&&!ui.confetti){setUi(function(u){return setK(u,"confetti",true)});setTimeout(function(){setUi(function(u){return setK(u,"confetti",false)});},3500);}});

  var WG=st.goals.water.norm,WX=st.goals.water.max;
  var wl=st.water[TODAY]||0,wPct=Math.min(wl/WG,1);
  var wCol=wPct>=1?"#2563eb":wPct>=0.5?"#3b82f6":"#93c5fd";
  var fy=Math.round(149-119*wPct);
  var SN=st.goals.sleep.norm,SM=st.goals.sleep.min;
  var sh=st.sleep[TODAY]||"",shN=parseFloat(sh);
  var sCol=isNaN(shN)||!sh?border:shN>=SN?green:shN>=SM?yellow:red;
  var sLbl=!sh?t.enterHrs:shN>=SN?t.great:shN>=SM?t.okay:t.low;
  var WM=st.goals.water.min;
  var wStatusCol=!wl?textSub:wl>=WG?green:wl>=WM?yellow:red;
  var CN=st.goals.calories.norm,CX=st.goals.calories.max,CM=st.goals.calories.min;
  var calT=st.calories[TODAY]||0,cPct=Math.min(calT/Math.max(1,CX),1);
  var cCol=calT>=CX?red:calT>=CN?green:textSub;
  var cStatusCol=!calT?textSub:calT>=CN?green:calT>=CM?yellow:red;

  var yr=ui.yr,mo=ui.mo,DIM=dim(yr,mo),FDM=fdm(yr,mo);
  var mName=new Date(yr,mo,1).toLocaleDateString("en-US",{month:"long",year:"numeric"});
  var tObj=new Date(),isCurMo=yr===tObj.getFullYear()&&mo===tObj.getMonth();

  var dLabel=new Date().toLocaleDateString("en-US",{weekday:"long"})+" · "+new Date().toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});

  var tGroups=TIMES.map(function(tm){return{time:tm,habits:todayH.filter(function(h){return h.time===tm;})};}).filter(function(g){return g.habits.length;});
  function cKey(d){return yr+"-"+String(mo+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");}
  var wb=wkBounds(),wkK=dRange(wb[0],wb[1]).filter(function(k){return k<=TODAY;});
  var moK=dRange(new Date(yr,mo,1),new Date(yr,mo,DIM)).filter(function(k){return k<=TODAY;});
  var atK=Object.keys(st.counts).filter(function(k){return Object.values(st.counts[k]||{}).some(function(v){return v>0;});});
  function cSt(ks,s){return ks.filter(function(k){return daySt(st.habits,k,st.counts)===s;}).length;}
  var wkF=cSt(wkK,"full"),wkP=cSt(wkK,"partial"),wkM=cSt(wkK,"none");
  var moF=cSt(moK,"full"),moP=cSt(moK,"partial"),moM=cSt(moK,"none");
  var atF=cSt(atK,"full"),atP=cSt(atK,"partial"),atM=cSt(atK,"none");
  var trk=moK.filter(function(k){var d=dow(k);return st.habits.filter(function(h){return h.freq.includes(d);}).some(function(h){return((st.counts[k]&&st.counts[k][h.id])||0)>0;});}).length;
  var bStr=0;st.habits.forEach(function(h){var s=streak(h.id,st.checked);if(s>bStr)bStr=s;});
  var detH=ui.detH?st.habits.find(function(h){return h.id===ui.detH;}):null;

  function mu(patch){setUi(function(u){return Object.assign({},u,patch);});}
  function mst(patch){setSt(function(s){return Object.assign({},s,patch);});}
  function applyPct(hid,pct,tgt){
    var count=tgt===1?pct/100:Math.round(pct/100*tgt),tod=TODAY;
    setSt(function(s){
      var day=Object.assign({},s.counts[tod]||{});day[hid]=count;
      var counts=Object.assign({},s.counts);counts[tod]=day;
      var cur=s.checked[tod]||[];
      var next=pct>=100?(cur.includes(hid)?cur:[].concat(cur,[hid])):cur.filter(function(x){return x!==hid;});
      var checked=Object.assign({},s.checked);checked[tod]=next;
      return Object.assign({},s,{counts:counts,checked:checked});
    });
    if(pct>0){mu({thumb:setK(ui.thumb,hid,true),hPopup:null});setTimeout(function(){mu({thumb:setK(ui.thumb,hid,false)});},900);}
    else mu({hPopup:null});
  }
  function saveH(h){
    if(!h.name.trim())return;
    var clean=Object.assign({},h,{target:Math.max(1,parseInt(h.target)||1)});
    setSt(function(s){var habits=clean.id?s.habits.map(function(x){return x.id===clean.id?clean:x;}):[].concat(s.habits,[Object.assign({},clean,{id:Date.now()})]);return Object.assign({},s,{habits:habits});});
    mu({editH:null});
  }
  function delH(id){setSt(function(s){return Object.assign({},s,{habits:s.habits.filter(function(h){return h.id!==id;})});});mu({editH:null,detH:null});}
  function addTask(text,tag){if(!text.trim())return;var id=Date.now();var tagVal=tag!==undefined?tag:null;setSt(function(s){return Object.assign({},s,{tasks:[].concat(s.tasks,[{id:id,text:text.trim(),done:false,pinned:false,importance:3,urgency:3,tag:tagVal}])});});mu({taskInput:""});}
  function addTag(name){if(!name.trim())return;var id=Date.now();setSt(function(s){return Object.assign({},s,{tags:[].concat(s.tags,[{id:id,name:name.trim()}])});});mu({tagInput:"",showTagInput:false});}
  function deleteTag(tagId){setSt(function(s){var tasks=s.tasks.map(function(tk){return tk.tag===tagId?Object.assign({},tk,{tag:null}):tk;});var laterTasks=s.laterTasks.map(function(tk){return tk.tag===tagId?Object.assign({},tk,{tag:null}):tk;});return Object.assign({},s,{tags:s.tags.filter(function(tg){return tg.id!==tagId;}),tasks:tasks,laterTasks:laterTasks});});mu(function(u){return Object.assign({},u,{activeTag:u.activeTag===tagId?null:u.activeTag});});}
  function setTaskTag(id,tagId,list){setSt(function(s){var key=list==="later"?"laterTasks":"tasks";var arr=s[key].map(function(tk){return tk.id===id?Object.assign({},tk,{tag:tagId}):tk;});var r=Object.assign({},s);r[key]=arr;return r;});}
  function toggleTaskDone(id,list){setSt(function(s){var key=list==="later"?"laterTasks":"tasks";var arr=s[key].map(function(tk){return tk.id===id?Object.assign({},tk,{done:!tk.done}):tk;});var r=Object.assign({},s);r[key]=arr;return r;});}
  function togglePin(id){setSt(function(s){var pinCount=s.tasks.filter(function(tk){return tk.pinned&&tk.id!==id;}).length;var arr=s.tasks.map(function(tk){if(tk.id!==id)return tk;if(!tk.pinned&&pinCount>=5)return tk;return Object.assign({},tk,{pinned:!tk.pinned});});return Object.assign({},s,{tasks:arr});});}
  function moveToLater(tid){setSt(function(s){var task=s.tasks.find(function(tk){return tk.id===tid;});if(!task)return s;return Object.assign({},s,{tasks:s.tasks.filter(function(tk){return tk.id!==tid;}),laterTasks:[].concat(s.laterTasks,[Object.assign({},task,{pinned:false})])});});}
  function moveToPlan(tid){setSt(function(s){var task=s.laterTasks.find(function(tk){return tk.id===tid;});if(!task)return s;return Object.assign({},s,{laterTasks:s.laterTasks.filter(function(tk){return tk.id!==tid;}),tasks:[].concat(s.tasks,[task])});});}
  function reorderTask(fromIdx,toIdx,list){if(fromIdx===toIdx)return;setSt(function(s){var key=list==="later"?"laterTasks":"tasks";var arr=s[key].slice();var item=arr.splice(fromIdx,1)[0];arr.splice(toIdx,0,item);var r=Object.assign({},s);r[key]=arr;return r;});mu({taskDragIdx:null,taskDragOver:null,taskDragList:null});}
  function setTaskPri(id,imp,urg,list){setSt(function(s){var key=list==="later"?"laterTasks":"tasks";var arr=s[key].map(function(tk){return tk.id===id?Object.assign({},tk,{importance:imp,urgency:urg}):tk;});var r=Object.assign({},s);r[key]=arr;return r;});}
  function sortByScore(){setSt(function(s){var pinned=s.tasks.filter(function(tk){return tk.pinned;});var unpinned=s.tasks.filter(function(tk){return !tk.pinned;}).sort(function(a,b){return(b.importance*0.7+b.urgency*0.3)-(a.importance*0.7+a.urgency*0.3);});return Object.assign({},s,{tasks:pinned.concat(unpinned)});});}
  function sortLaterByScore(){setSt(function(s){var sorted=s.laterTasks.slice().sort(function(a,b){return(b.importance*0.7+b.urgency*0.3)-(a.importance*0.7+a.urgency*0.3);});return Object.assign({},s,{laterTasks:sorted});});}
  function deleteTask(id,list){setSt(function(s){var key=list==="later"?"laterTasks":"tasks";var r=Object.assign({},s);r[key]=s[key].filter(function(tk){return tk.id!==id;});return r;});}
  function updateTaskText(id,text,list){if(!text.trim())return;setSt(function(s){var key=list==="later"?"laterTasks":"tasks";var arr=s[key].map(function(tk){return tk.id===id?Object.assign({},tk,{text:text.trim()}):tk;});var r=Object.assign({},s);r[key]=arr;return r;});}
  function saveTaskEdit(id,updates,list){if(updates.text&&!updates.text.trim())return;var u=Object.assign({},updates);if(u.text)u.text=u.text.trim();setSt(function(s){var key=list==="later"?"laterTasks":"tasks";var arr=s[key].map(function(tk){return tk.id===id?Object.assign({},tk,u):tk;});var r=Object.assign({},s);r[key]=arr;return r;});}
  function requestNotifPermission(){if("Notification" in window&&Notification.permission==="default"){Notification.requestPermission();}}
  function addW(d){var next=Math.max(0,Math.min(WX,Math.round((wl+d)*10)/10)),tod=TODAY;setSt(function(s){var w=Object.assign({},s.water);w[tod]=next;return Object.assign({},s,{water:w});});}
  function addCal(v){var tod=TODAY;setSt(function(s){var c=Object.assign({},s.calories);c[tod]=Math.max(0,(c[tod]||0)+v);return Object.assign({},s,{calories:c});});}
  function setNote(v){var tod=TODAY;setSt(function(s){var d=Object.assign({},s.dayNotes);d[tod]=v;return Object.assign({},s,{dayNotes:d});});}
  function setSleep(v){var raw=parseFloat(v),cap=st.goals.sleep.max,val=isNaN(raw)?"":String(Math.min(cap,raw)),tod=TODAY;setSt(function(s){var sl=Object.assign({},s.sleep);sl[tod]=val;return Object.assign({},s,{sleep:sl});});}
  function saveGoals(key,draft){setSt(function(s){var g=Object.assign({},s.goals);g[key]=Object.assign({},draft);return Object.assign({},s,{goals:g});});mu({sPanel:null,gDraft:null});}
  function applyCal(r){var wz=ui.wiz;setSt(function(s){var g=Object.assign({},s.goals);g.calories={min:r.min,norm:r.norm,max:r.max};var cwd={gender:wz.gender,W:wz.W,H:wz.H,A:wz.A,goal:wz.goal,act:wz.act};return Object.assign({},s,{goals:g,calWizData:cwd});});mu({wiz:null});}

  function Btn(p){
    var vs={def:{background:darkBg,color:textMain,border:"1px solid "+border},pri:{background:"#111827",color:"#fff",border:"none"},dan:{background:redBg,color:red,border:"1px solid "+redBo}};
    var v=vs[p.v||"def"];
    return React.createElement("button",{onClick:p.onClick,style:Object.assign({borderRadius:"8px",padding:"9px 16px",fontSize:14,fontWeight:500,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"inherit"},v,p.s||{})},p.children);
  }
  function IBtn(p){var sz=p.sz||32;return React.createElement("button",{onClick:p.onClick,style:{width:sz,height:sz,borderRadius:"50%",border:"1px solid "+border,background:card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:sz*0.42,color:textMain,fontFamily:"inherit"}},p.children);}
  function Card(p){return React.createElement("div",{style:Object.assign({background:card,borderRadius:"12px",padding:"16px",boxShadow:isDark?"0 1px 3px rgba(0,0,0,0.3)":"0 1px 3px rgba(0,0,0,0.06)"},p.s||{}),onClick:p.onClick},p.children);}
  function PBar(p){return React.createElement("div",{style:{height:p.h||6,background:border,borderRadius:99,overflow:"hidden"}},React.createElement("div",{style:{height:"100%",width:(p.pct||0)+"%",background:p.col||green,borderRadius:99,transition:"width 0.4s"}}));}
  function Tag(p){return React.createElement("div",{onClick:p.onClick,style:{padding:"6px 12px",borderRadius:20,fontSize:13,fontWeight:p.on?600:400,cursor:"pointer",background:p.on?"#111827":darkBg,color:p.on?"#fff":textSub,border:"1px solid "+(p.on?"#111827":border)}},p.label);}
  function Stat(p){return React.createElement("div",{style:{background:p.bg||card,borderRadius:"12px",padding:"14px 8px",textAlign:"center",border:"1px solid "+(p.bo||border)}},React.createElement("p",{style:{fontSize:18,margin:"0 0 2px"}},p.icon),React.createElement("p",{style:{fontSize:24,fontWeight:800,color:p.col||textMain,margin:"0 0 2px",lineHeight:1}},p.val),React.createElement("p",{style:{fontSize:11,color:p.col||textSub,margin:0,opacity:0.8}},p.label));}

  function SleepSVG(p){
    var h=parseFloat(p.hours);
    if(!p.hours||isNaN(h)||h===0) return(<svg viewBox="0 0 100 68" width="90" height="60"><rect x="5" y="40" width="90" height="14" rx="4" fill="#dde6f0"/><rect x="8" y="52" width="8" height="14" rx="3" fill="#b0c4de"/><rect x="84" y="52" width="8" height="14" rx="3" fill="#b0c4de"/><rect x="5" y="22" width="16" height="22" rx="4" fill="#b0c4de"/><rect x="13" y="28" width="22" height="14" rx="5" fill="#edf2ff"/><rect x="24" y="31" width="66" height="14" rx="5" fill="#90caf9"/><circle cx="19" cy="31" r="7" fill="#ffd5b0"/><text x="58" y="24" fontSize="10" fill="#90caf9" fontWeight="700">z</text><text x="68" y="16" fontSize="13" fill="#90caf9" fontWeight="700">z</text><text x="79" y="8" fontSize="16" fill="#90caf9" fontWeight="700">z</text></svg>);
    if(h>=8) return(<svg viewBox="0 0 100 68" width="90" height="60"><rect x="28" y="50" width="68" height="11" rx="3" fill="#dde6f0" opacity="0.6"/><circle cx="24" cy="13" r="10" fill="#ffd5b0"/><circle cx="21" cy="12" r="1.8" fill="#333"/><circle cx="27" cy="12" r="1.8" fill="#333"/><path d="M20 17 Q24 21 28 17" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/><rect x="18" y="23" width="13" height="19" rx="5" fill="#90caf9"/><line x1="18" y1="27" x2="8" y2="19" stroke="#ffd5b0" strokeWidth="3.5" strokeLinecap="round"/><line x1="31" y1="27" x2="41" y2="19" stroke="#ffd5b0" strokeWidth="3.5" strokeLinecap="round"/><line x1="21" y1="42" x2="18" y2="57" stroke="#b0c4de" strokeWidth="3.5" strokeLinecap="round"/><line x1="29" y1="42" x2="32" y2="57" stroke="#b0c4de" strokeWidth="3.5" strokeLinecap="round"/><text x="50" y="20" fontSize="14">⭐</text><text x="68" y="12" fontSize="11">✨</text><text x="42" y="10" fontSize="10">⭐</text></svg>);
    return(<svg viewBox="0 0 100 68" width="90" height="60"><rect x="5" y="44" width="90" height="14" rx="4" fill="#dde6f0"/><rect x="8" y="56" width="8" height="10" rx="2" fill="#b0c4de"/><rect x="84" y="56" width="8" height="10" rx="2" fill="#b0c4de"/><rect x="5" y="26" width="14" height="22" rx="4" fill="#b0c4de"/><rect x="20" y="35" width="65" height="14" rx="5" fill="#90caf9" opacity="0.5"/><circle cx="71" cy="26" r="9" fill="#ffd5b0"/><circle cx="68" cy="25" r="1.4" fill="#333"/><circle cx="74" cy="25" r="1.4" fill="#333"/><line x1="68" y1="30" x2="74" y2="30" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/><rect x="66" y="35" width="11" height="13" rx="4" fill="#aab8d4"/><line x1="68" y1="48" x2="64" y2="60" stroke="#b0c4de" strokeWidth="3.5" strokeLinecap="round"/><line x1="74" y1="48" x2="78" y2="60" stroke="#b0c4de" strokeWidth="3.5" strokeLinecap="round"/><line x1="66" y1="38" x2="58" y2="31" stroke="#ffd5b0" strokeWidth="3" strokeLinecap="round"/><line x1="58" y1="31" x2="62" y2="24" stroke="#ffd5b0" strokeWidth="3" strokeLinecap="round"/></svg>);
  }

  function Sheet(p){return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:p.z||999,padding:"16px"}} onClick={p.onClose}>
      <div style={{background:card,borderRadius:"20px",width:"100%",maxWidth:520,padding:"24px 20px",boxShadow:"0 8px 40px rgba(0,0,0,0.25)",maxHeight:"88vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
        {p.children}
      </div>
    </div>
  );}

  var CSS="@keyframes tP{0%{transform:scale(0);opacity:0}60%{transform:scale(1.3);opacity:1}100%{transform:scale(1);opacity:1}}.ta{animation:tP 0.4s ease forwards;}";
  CSS+="@keyframes cF{0%{opacity:1}100%{opacity:0;transform:translateY(105vh) rotate(720deg)}}.cp{position:fixed;top:0;animation:cF linear forwards;pointer-events:none;z-index:9999;border-radius:3px;}";
  CSS+="input[type=range]{-webkit-appearance:none;width:100%;height:6px;border-radius:99px;outline:none;cursor:pointer;}";
  CSS+="input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#111827;cursor:pointer;}";
  CSS+="input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#111827;cursor:pointer;border:none;}";

  var PRESETS_L=[{id:"daily",label:t.everyDay,days:["sun","mon","tue","wed","thu","fri","sat"]},{id:"weekdays",label:t.weekdays,days:["mon","tue","wed","thu","fri"]},{id:"weekends",label:t.weekends,days:["sat","sun"]}];

  if(ui.detH&&detH) return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{maxWidth:520,margin:"0 auto",padding:"16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <IBtn onClick={function(){mu({detH:null});}} sz={36}>&#8592;</IBtn>
          <p style={{fontSize:16,fontWeight:600,color:textMain,margin:0,flex:1}}>{t.habitDetails}</p>
          {ui.detFrom==="habits"&&<Btn onClick={function(){mu({editH:detH,detH:null});}}>{t.edit}</Btn>}
        </div>
        <Card s={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <span style={{fontSize:36}}>{detH.emoji}</span>
            <div><p style={{fontSize:18,fontWeight:600,margin:"0 0 4px",color:textMain}}>{detH.name}</p>
            <p style={{fontSize:13,color:textSub,margin:0}}>{TI[detH.time]} {detH.time}{detH.target>1?" · 🎯 "+detH.target+"x":""}</p></div>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{DAYS.map(function(d,i){return <div key={d} style={{padding:"4px 8px",borderRadius:6,fontSize:12,fontWeight:detH.freq.includes(d)?600:400,background:detH.freq.includes(d)?"#111827":darkBg,color:detH.freq.includes(d)?"#fff":textSub}}>{DL[i]}</div>;})}</div>
        </Card>
        <Card s={{marginBottom:16}}>
          <p style={{fontSize:12,fontWeight:600,color:textSub,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{t.notes}</p>
          <textarea value={detH.notes} onChange={function(e){var v=e.target.value;setSt(function(s){var h2=s.habits.map(function(h){return h.id===detH.id?Object.assign({},h,{notes:v}):h;});return Object.assign({},s,{habits:h2});});}} placeholder="..." rows={5} style={{width:"100%",resize:"vertical",fontSize:14,background:"transparent",border:"none",outline:"none",color:textMain,lineHeight:1.7,boxSizing:"border-box"}}/>
        </Card>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={function(){mu({detH:null});}} v="pri" s={{flex:1}}>{t.save}</Btn>
          {ui.detFrom==="habits"&&<Btn onClick={function(){delH(detH.id);}} v="dan">{t.delete}</Btn>}
        </div>
      </div>
    </div>
  );

  if(ui.editH&&!ui.detH) return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{maxWidth:520,margin:"0 auto",padding:"16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <IBtn onClick={function(){mu({editH:null});}} sz={36}>&#8592;</IBtn>
          <p style={{fontSize:16,fontWeight:600,color:textMain,margin:0}}>{ui.editH==="new"?t.newHabit:t.editHabit}</p>
        </div>
        <Card s={{marginBottom:12}}>
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            <select value={ui.form.emoji} onChange={function(e){var v=e.target.value;mu({form:setK(ui.form,"emoji",v)});}} style={{width:56,fontSize:22,border:"1px solid "+border,borderRadius:"8px",background:darkBg,padding:"4px",color:textMain}}>
              {EMJ.map(function(em){return <option key={em} value={em}>{em}</option>;})}
            </select>
            <input placeholder={t.habitName} value={ui.form.name} onChange={function(e){var v=e.target.value;mu({form:setK(ui.form,"name",v)});}} style={{flex:1,fontSize:15,fontWeight:500,border:"1px solid "+border,borderRadius:"8px",padding:"8px 12px",outline:"none",background:darkBg,color:textMain}}/>
          </div>
          <p style={{fontSize:12,fontWeight:600,color:textSub,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.04em"}}>{t.frequency}</p>
          <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
            {PRESETS_L.map(function(p){var a=p.days.length===ui.form.freq.length&&p.days.every(function(d){return ui.form.freq.includes(d);});return <Tag key={p.id} label={p.label} on={a} onClick={function(){mu({form:setK(ui.form,"freq",[].concat(p.days))});}}/>;} )}
          </div>
          <div style={{display:"flex",gap:4}}>
            {DAYS.map(function(d,i){var a=ui.form.freq.includes(d);return <div key={d} onClick={function(){var f=ui.form.freq.includes(d)?ui.form.freq.filter(function(x){return x!==d;}):[].concat(ui.form.freq,[d]);mu({form:setK(ui.form,"freq",f)});}} style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:8,background:a?"#111827":darkBg,color:a?"#fff":textSub,fontSize:11,fontWeight:a?700:400,cursor:"pointer",border:"1px solid "+(a?"#111827":border)}}>{DL[i]}</div>;})}
          </div>
        </Card>
        <Card s={{marginBottom:12}}>
          <p style={{fontSize:12,fontWeight:600,color:textSub,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:"0.04em"}}>{t.timeOfDay}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {TIMES.map(function(tm){return <Tag key={tm} label={TI[tm]+" "+tm.charAt(0).toUpperCase()+tm.slice(1)} on={ui.form.time===tm} onClick={function(){mu({form:setK(ui.form,"time",tm)});}}/>;} )}
          </div>
        </Card>
        <Card s={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><p style={{fontSize:14,fontWeight:600,margin:"0 0 2px",color:textMain}}>🎯 {t.dailyReps}</p><p style={{fontSize:12,color:textSub,margin:0}}>{t.howMany}</p></div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <IBtn onClick={function(){mu({form:setK(ui.form,"target",Math.max(1,(ui.form.target||1)-1))});}} sz={34}>&#8722;</IBtn>
              <span style={{fontSize:20,fontWeight:700,color:textMain,minWidth:24,textAlign:"center"}}>{ui.form.target||1}</span>
              <IBtn onClick={function(){mu({form:setK(ui.form,"target",(ui.form.target||1)+1)});}} sz={34}>+</IBtn>
            </div>
          </div>
          {(ui.form.target||1)>1&&<div style={{marginTop:10,padding:"6px 10px",background:greenBg,borderRadius:8,fontSize:12,color:green,fontWeight:500}}>{t.tracksPerDay.replace("{n}",ui.form.target)}</div>}
        </Card>
        <Card s={{marginBottom:16}}>
          <p style={{fontSize:12,fontWeight:600,color:textSub,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.04em"}}>{t.notes}</p>
          <textarea value={ui.form.notes} onChange={function(e){var v=e.target.value;mu({form:setK(ui.form,"notes",v)});}} placeholder={t.optNotes} rows={3} style={{width:"100%",resize:"vertical",fontSize:14,background:"transparent",border:"none",outline:"none",color:textMain,lineHeight:1.6,boxSizing:"border-box"}}/>
        </Card>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={function(){saveH(ui.form.id?ui.form:Object.assign({},ui.form,{id:null}));}} v="pri" s={{flex:1}}>{t.saveHabit}</Btn>
          <Btn onClick={function(){mu({editH:null});}}>{t.cancel}</Btn>
          {ui.form.id&&<Btn onClick={function(){delH(ui.form.id);}} v="dan">{t.delete}</Btn>}
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <style>{CSS}</style>
      {ui.confetti&&Array.from({length:60}).map(function(_,i){var pal=["#16a34a","#f59e0b","#ef4444","#3b82f6","#8b5cf6","#ec4899"],sz=6+Math.random()*8;return <div key={i} className="cp" style={{left:(Math.random()*100)+"%",background:pal[i%pal.length],width:sz,height:sz,animationDuration:(2+Math.random()*1.5)+"s",animationDelay:(Math.random()*1.5)+"s"}}/>;} )}

      <div style={{background:card,borderBottom:"1px solid "+border,padding:"14px 20px 0",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:520,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:10}}>
            <p style={{fontWeight:700,fontSize:18,color:textMain,margin:"0 0 2px"}}>{t.hello}, {st.profileName||t.helloDefault} 👊</p>
            <p style={{fontSize:12,color:textSub,margin:0}}>{dLabel}</p>
          </div>
          <div style={{display:"flex",borderBottom:"1px solid "+border,margin:"0 -20px"}}>
            {["today","tasks","analytics","settings"].map(function(tab,i){
              var lbl=tab==="today"?t.today:tab==="tasks"?t.tasks:tab==="analytics"?t.analytics:t.settings;
              return <button key={tab} onClick={function(){mu({tab:tab});}} style={{flex:i===3?0:1,marginLeft:i===3?"auto":0,background:"transparent",border:"none",borderBottom:ui.tab===tab?"2px solid "+textMain:"2px solid transparent",padding:"10px 12px",fontWeight:ui.tab===tab?600:400,color:ui.tab===tab?textMain:textSub,cursor:"pointer",fontSize:13,marginBottom:-1,whiteSpace:"nowrap",fontFamily:"inherit"}}>{lbl}</button>;
            })}
          </div>
        </div>
      </div>

      <div style={{maxWidth:520,margin:"0 auto",padding:"16px 16px 80px"}}>

        {ui.tab==="today"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
              <Card s={{padding:"12px 8px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <p style={{fontSize:10,fontWeight:700,color:textSub,margin:"0 0 2px",textTransform:"uppercase",letterSpacing:"0.06em"}}>{t.sleep}</p>
                <p style={{fontSize:11,fontWeight:700,color:sCol,margin:"0 0 4px",lineHeight:1}}>{sh||"–"}/{SN} hrs</p>
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end"}}>
                  <SleepSVG hours={sh}/>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginTop:6,width:"100%"}}>
                  <input type="number" min="0" max={st.goals.sleep.max} step="0.5" placeholder="–" value={sh} onChange={function(e){setSleep(e.target.value);}} style={{width:"52px",background:darkBg,border:"1px solid "+sCol,borderRadius:8,fontSize:14,fontWeight:700,color:sCol,textAlign:"center",padding:"4px 4px",fontFamily:"inherit",outline:"none"}}/>
                  <span style={{fontSize:10,color:textSub,fontWeight:500}}>hrs</span>
                </div>
              </Card>

              <Card s={{padding:"12px 8px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <p style={{fontSize:10,fontWeight:700,color:textSub,margin:"0 0 2px",textTransform:"uppercase",letterSpacing:"0.06em"}}>{t.water}</p>
                <p style={{fontSize:11,fontWeight:700,color:wStatusCol,margin:"0 0 4px",lineHeight:1}}>{wl}/{WG} L</p>
                <div style={{flex:1,display:"flex",alignItems:"flex-end",justifyContent:"center",gap:3,paddingBottom:2}}>
                  {Array.from({length:Math.max(1,Math.round(WG))}).map(function(_,i){
                    var bfill=Math.max(0,Math.min(1,wl-i));
                    var bfy=Math.round(149-119*bfill);
                    var bcol=bfill>0?wCol:"transparent";
                    var bw=Math.round(WG)<=3?28:Math.round(WG)<=4?24:20;
                    var bh=bw*2;
                    return(
                      <svg key={i} viewBox="0 0 80 160" width={bw} height={bh}>
                        <defs><clipPath id={"wbc"+i}><path d="M15 30 Q11 40 11 55 L11 138 Q11 149 20 149 L60 149 Q69 149 69 138 L69 55 Q69 40 65 30 Z"/></clipPath></defs>
                        <rect x="28" y="0" width="24" height="18" rx="4" fill="none" stroke="#bfdbfe" strokeWidth="3"/>
                        <path d="M14 30 Q10 40 10 55 L10 138 Q10 150 20 150 L60 150 Q70 150 70 138 L70 55 Q70 40 66 30 L28 18 L52 18 Z" fill="none" stroke="#bfdbfe" strokeWidth="3"/>
                        <rect x="26" y="-2" width="28" height="10" rx="3" fill="#60a5fa"/>
                        {bfill>0&&<rect x="0" y={bfy} width="80" height={149-bfy+10} clipPath={"url(#wbc"+i+")"} fill={bcol} opacity="0.9"/>}
                      </svg>
                    );
                  })}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4,marginTop:6,width:"100%"}}>
                  <IBtn onClick={function(){addW(-0.1);}} sz={26}>&#8722;</IBtn>
                  <div style={{flex:1,fontSize:10,color:wl>=WG?green:textSub,fontWeight:wl>=WG?700:400,textAlign:"center"}}>{wl>=WG?t.goalReached+" ✓":Math.round((WG-wl)*10)/10+"L "+t.left}</div>
                  <IBtn onClick={function(){addW(0.1);}} sz={26}>+</IBtn>
                </div>
              </Card>

              <Card s={{padding:"12px 8px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <p style={{fontSize:10,fontWeight:700,color:textSub,margin:"0 0 2px",textTransform:"uppercase",letterSpacing:"0.06em"}}>{t.calories}</p>
                <p style={{fontSize:11,fontWeight:700,color:cStatusCol,margin:"0 0 4px",lineHeight:1}}>{calT}/{CN} kcal</p>
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end"}}>
                  <svg viewBox="0 0 100 72" width="80" height="60">
                    <defs><clipPath id="bwl"><path d="M13 47 Q16 68 50 68 Q84 68 87 47 Z"/></clipPath></defs>
                    {cPct>0&&<rect x="0" y={68-Math.round(cPct*22)} width="100" height={Math.round(cPct*22)+4} clipPath="url(#bwl)" fill={cPct>=1?"#c0392b":cPct>=0.7?"#e67e22":"#27ae60"} opacity="0.25"/>}
                    <ellipse cx="50" cy="52" rx="38" ry="10" fill="#e8c88a"/>
                    <path d="M12 48 Q15 68 50 68 Q85 68 88 48 Z" fill="#d4a853"/>
                    <ellipse cx="50" cy="48" rx="38" ry="10" fill="#e8c88a"/>
                    {cPct>0.05&&<ellipse cx="50" cy="46" rx={Math.min(33,33*cPct*4)} ry={Math.min(8,8*cPct*4)} fill="#4d8a28"/>}
                    {cPct>0.2&&<ellipse cx="38" cy="44" rx={Math.min(10,10*(cPct-0.15)*6)} ry={Math.min(5,5*(cPct-0.15)*6)} fill="#5ea832" opacity="0.9"/>}
                    {cPct>0.3&&<ellipse cx="54" cy="42" rx={Math.min(12,12*(cPct-0.2)*6)} ry={Math.min(5,5*(cPct-0.2)*6)} fill="#6dc03a" opacity="0.9"/>}
                    {cPct>0.5&&<rect x="42" y="39" width="5" height="4" rx="1" fill="#b8762a"/>}
                    {cPct>0.65&&<circle cx="48" cy="38" r="1.5" fill="#f0d878"/>}
                    <line x1="88" y1="18" x2="85" y2="50" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="85" y1="18" x2="83" y2="30" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="88" y1="18" x2="86" y2="30" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="91" y1="18" x2="89" y2="30" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4,marginTop:6}}>
                  <IBtn onClick={function(){mu({calPop:true,calIn:"",calMode:"-"});}} sz={26}>&#8722;</IBtn>
                  <span style={{flex:1,fontSize:9,color:textSub,textAlign:"center"}}>{t.log}</span>
                  <IBtn onClick={function(){mu({calPop:true,calIn:"",calMode:"+"});}} sz={26}>+</IBtn>
                </div>
              </Card>
            </div>

            <div style={{border:"1px solid "+border,borderRadius:"12px",padding:"10px 14px",marginBottom:16,background:card}}>
              <p style={{fontSize:11,fontWeight:600,color:textLight,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"center"}}>📝 {t.addNote}</p>
              <textarea placeholder={t.dayNote} value={st.dayNotes[TODAY]||""} onChange={function(e){setNote(e.target.value);}} rows={2} style={{width:"100%",resize:"none",fontSize:14,background:"transparent",border:"none",outline:"none",color:textMain,lineHeight:1.6,boxSizing:"border-box",textAlign:"center"}}/>
            </div>

            <p style={{fontSize:15,fontWeight:700,color:textMain,textAlign:"center",margin:"0 0 10px"}}>{t.habitTracking}</p>
            <Card s={{marginBottom:14,padding:"12px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <p style={{fontSize:14,color:textSub,margin:0}}>{todayH.filter(function(h){return getPct(h,TODAY,st.counts)===100;}).length} {t.of} {todayH.length} {t.done}</p>
                <p style={{fontSize:22,fontWeight:800,color:oPct===100?green:textMain,margin:0}}>{oPct}%</p>
              </div>
              <PBar pct={oPct} col={oPct===100?green:oPct>=50?"#3b82f6":yellow} h={8}/>
            </Card>

            {tGroups.length===0&&<Card><p style={{color:textSub,fontSize:14,textAlign:"center",margin:0}}>{t.noHabits}</p></Card>}
            {tGroups.map(function(g){return(
              <div key={g.time} style={{marginBottom:20}}>
                <p style={{fontSize:11,fontWeight:700,color:textSub,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:"0.07em"}}>{TI[g.time]} {g.time}</p>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {g.habits.map(function(h){
                    var pct=getPct(h,TODAY,st.counts),cnt=(st.counts[TODAY]&&st.counts[TODAY][h.id])||0;
                    var isFull=pct===100,isPart=pct>0&&pct<100,showT=ui.thumb[h.id];
                    var sc=isFull?SC.full:isPart?SC.partial:null;
                    return(
                      <div key={h.id} onClick={function(){var tgt=h.target||1;var cnt=(st.counts[TODAY]&&st.counts[TODAY][h.id])||0;mu({hPopup:{id:h.id,pct:getPct(h,TODAY,st.counts),count:tgt>1?cnt:0,target:tgt}});}} style={{display:"flex",alignItems:"center",gap:12,background:sc?sc.bg:card,border:"1px solid "+(sc?sc.bo:border),borderRadius:"12px",padding:"13px 14px",cursor:"pointer",boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}>
                        <div style={{width:22,height:22,borderRadius:6,border:"2px solid "+(sc?sc.tx:border),background:sc?sc.bg:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {isFull&&<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.5 9L10 3" stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span style={{fontSize:18,flexShrink:0}}>{h.emoji}</span>
                        <span style={{flex:1,fontSize:15,fontWeight:500,color:sc?sc.tx:textMain,textDecoration:isFull?"line-through":"none"}}>{h.name}</span>
                        {isPart&&(h.target||1)<=1&&<span style={{fontSize:12,color:sc.tx,fontWeight:600,background:sc.bg,padding:"2px 8px",borderRadius:20,border:"1px solid "+sc.bo}}>{pct}%</span>}
                        {(h.target||1)>1&&(cnt>0||isFull)&&<span style={{fontSize:12,color:sc?sc.tx:textSub,fontWeight:600,background:sc?sc.bg:darkBg,padding:"2px 8px",borderRadius:20,border:"1px solid "+(sc?sc.bo:border)}}>{Math.round(cnt)}/{h.target}</span>}
                        <button onClick={function(e){e.stopPropagation();mu({detH:h.id,detFrom:"today"});}} style={{background:"transparent",border:"none",cursor:"pointer",color:textLight,fontSize:15,padding:"2px",flexShrink:0,fontFamily:"inherit"}}>📝</button>
                        {!isFull&&!isPart&&!showT&&streak(h.id,st.checked)>1&&<span style={{fontSize:11,color:"#f59e0b",fontWeight:700,background:"#fffbeb",padding:"2px 7px",borderRadius:20,border:"1px solid #fcd34d"}}>🔥{streak(h.id,st.checked)}</span>}
                        {showT&&<span className="ta" style={{fontSize:20}}>👍</span>}
                        {isFull&&!showT&&<span style={{fontSize:18}}>👍</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );})}
          </div>
        )}

        {ui.tab==="tasks"&&(function(){
          var visibleTasks=ui.activeTag===null?st.tasks:st.tasks.filter(function(tk){return tk.tag===ui.activeTag;});
          var visibleLater=ui.activeTag===null?st.laterTasks:st.laterTasks.filter(function(tk){return tk.tag===ui.activeTag;});
          var pinnedTasks=visibleTasks.filter(function(tk){return tk.pinned;});
          var planTasks=visibleTasks.filter(function(tk){return !tk.pinned;});
          function score(tk){return Math.round((tk.importance*0.7+tk.urgency*0.3)*10)/10;}
          function ScoreBadge(p){var s=score(p.tk);var col=s>=4?red:s>=2.5?yellow:textSub;return <span style={{fontSize:10,fontWeight:700,color:col,background:col===red?redBg:col===yellow?yellowBg:darkBg,padding:"2px 6px",borderRadius:10,border:"1px solid "+(col===red?redBo:col===yellow?yellowBo:border),flexShrink:0}}>{s}</span>;}
          function TaskRow(p){
            var tk=p.tk,list=p.list||"plan",idx=p.idx;
            return(
              <div
                style={{position:"relative",marginBottom:6,borderRadius:10,overflow:"hidden"}}
                onMouseDown={function(e){
                  if(e.button!==0)return;
                  var inner=e.currentTarget.children[1];
                  var startX=e.clientX,startY=e.clientY,swiping=false,dragging=false;
                  function onMove(ev){
                    if(dragging)return;
                    var dx=ev.clientX-startX,dy=ev.clientY-startY;
                    if(!swiping&&Math.abs(dy)>12){cleanup();return;}
                    if(!swiping&&dx<-8)swiping=true;
                    if(swiping){ev.preventDefault();inner.style.transform="translateX("+Math.max(dx,-80)+"px)";}
                  }
                  function onUp(){
                    cleanup();
                    if(!swiping)return;
                    var dx=parseFloat((inner.style.transform||"").replace(/[^-\d.]/g,""))||0;
                    inner.style.transition="transform 0.2s";
                    if(dx<-50){inner.style.transform="translateX(-80px)";setTimeout(function(){mu({taskDeleteConfirm:{id:tk.id,list:list,text:tk.text}});inner.style.transform="";inner.style.transition="";},150);}
                    else{inner.style.transform="";setTimeout(function(){inner.style.transition="";},200);}
                  }
                  function onDragStart(){dragging=true;cleanup();inner.style.transform="";inner.style.transition="";}
                  function cleanup(){window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);inner.removeEventListener("dragstart",onDragStart);}
                  window.addEventListener("mousemove",onMove);
                  window.addEventListener("mouseup",onUp);
                  inner.addEventListener("dragstart",onDragStart);
                }}
              >
                <div
                  onClick={function(){mu({taskDeleteConfirm:{id:tk.id,list:list,text:tk.text}});}}
                  style={{position:"absolute",right:0,top:0,bottom:0,width:72,background:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:"0 10px 10px 0"}}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              <div
                draggable={true}
                onDragStart={function(e){e.dataTransfer.setData("tid",String(tk.id));e.dataTransfer.setData("tlist",list);e.dataTransfer.setData("tidx",String(idx));e.currentTarget.style.opacity="0.4";}}
                onDragEnd={function(e){e.currentTarget.style.opacity="";e.currentTarget.style.transform="";}}
                onDragOver={function(e){e.preventDefault();e.stopPropagation();e.currentTarget.style.background=darkBg;}}
                onDragLeave={function(e){e.currentTarget.style.background="";}}
                onDrop={function(e){
                  e.preventDefault();e.stopPropagation();
                  e.currentTarget.style.background="";
                  var fromId=parseInt(e.dataTransfer.getData("tid"));
                  var fromList=e.dataTransfer.getData("tlist");
                  var fromIdx=parseInt(e.dataTransfer.getData("tidx"));
                  if(fromList!==list){
                    if(fromList==="plan")moveToLater(fromId);else moveToPlan(fromId);
                  } else {reorderTask(fromIdx,idx,list);}
                }}
                onTouchStart={function(e){e.currentTarget.dataset.sx=e.touches[0].clientX;e.currentTarget.style.transition="none";}}
                onTouchMove={function(e){
                  var dx=e.touches[0].clientX-parseFloat(e.currentTarget.dataset.sx||0);
                  if(dx<0){e.currentTarget.style.transform="translateX("+Math.max(dx,-80)+"px)";}
                }}
                onTouchEnd={function(e){
                  var el=e.currentTarget;
                  var tr=el.style.transform;
                  var dx=tr?parseFloat(tr.replace(/[^-\d.]/g,""))||0:0;
                  el.style.transition="transform 0.2s";
                  if(dx<-50){
                    el.style.transform="translateX(-80px)";
                    setTimeout(function(){mu({taskDeleteConfirm:{id:tk.id,list:list,text:tk.text}});el.style.transform="";el.style.transition="";},150);
                  } else {
                    el.style.transform="";
                    setTimeout(function(){el.style.transition="";},200);
                  }
                }}
                style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:card,borderRadius:10,border:"1px solid "+border,cursor:"grab",transition:"background 0.1s",position:"relative",zIndex:1}}
              >
                <div onClick={function(){toggleTaskDone(tk.id,list);}} style={{width:20,height:20,borderRadius:6,border:"2px solid "+(tk.done?green:border),background:tk.done?greenBg:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                  {tk.done&&<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.5 7.5L8.5 2" stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span onClick={function(){mu({taskPopup:{id:tk.id,list:list,draftText:tk.text,draftDesc:tk.description||"",draftDeadline:tk.deadline||"",draftReminder:tk.reminder||""}});}} style={{flex:1,fontSize:14,color:tk.done?textLight:textMain,textDecoration:tk.done?"line-through":"none",cursor:"pointer",lineHeight:1.4}}>{tk.text}</span>
                {ui.activeTag===null&&tk.tag&&(function(){var tg=st.tags.find(function(x){return x.id===tk.tag;});return tg?<span style={{fontSize:9,fontWeight:600,color:textSub,background:darkBg,border:"1px solid "+border,borderRadius:8,padding:"1px 6px",flexShrink:0,maxWidth:60,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tg.name}</span>:null;})()}
                <ScoreBadge tk={tk}/>
                <button onClick={function(e){e.stopPropagation();mu({taskPopup:{id:tk.id,list:list,draftText:tk.text,draftDesc:tk.description||"",draftDeadline:tk.deadline||"",draftReminder:tk.reminder||""}});}} title={t.editTask} style={{background:"transparent",border:"none",cursor:"pointer",padding:"2px",flexShrink:0,lineHeight:1}}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 1.5l2 2-7 7-2.5.5.5-2.5 7-7z" stroke={textLight} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {list==="plan"&&<button onClick={function(){togglePin(tk.id);}} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:14,padding:"2px",flexShrink:0,position:"relative",lineHeight:1,display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22}}>
                  <span style={{opacity:tk.pinned?0.55:1}}>📌</span>
                  {tk.pinned&&<span style={{position:"absolute",top:"50%",left:"-2px",right:"-2px",height:"3px",background:"#ef4444",transform:"translateY(-50%) rotate(-40deg)",display:"block",borderRadius:2,pointerEvents:"none",boxShadow:"0 0 0 1px rgba(255,255,255,0.8)"}}/>}
                </button>}
                {list==="plan"&&!tk.pinned&&<button onClick={function(){moveToLater(tk.id);}} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:11,color:textLight,padding:"2px 4px",borderRadius:6,flexShrink:0}}>↓</button>}
                {list==="later"&&<button onClick={function(){moveToPlan(tk.id);}} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:11,color:textLight,padding:"2px 4px",borderRadius:6,flexShrink:0}}>↑</button>}
              </div>
              </div>
            );
          }
          return(
            <div>
              <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:2}}>
                <button onClick={function(){mu({activeTag:null});}} style={{flexShrink:0,padding:"5px 14px",borderRadius:20,border:"1.5px solid "+(ui.activeTag===null?textMain:border),background:ui.activeTag===null?textMain:card,color:ui.activeTag===null?card:textMain,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{t.allTasks}</button>
                {st.tags.map(function(tg){var active=ui.activeTag===tg.id;return(
                  <div key={tg.id} style={{display:"flex",alignItems:"center",gap:0,flexShrink:0}}>
                    <button onClick={function(){mu({activeTag:tg.id});}} style={{padding:"5px 10px",borderRadius:"20px 0 0 20px",border:"1.5px solid "+(active?textMain:border),borderRight:"none",background:active?textMain:card,color:active?card:textMain,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{tg.name}</button>
                    <button onClick={function(){deleteTag(tg.id);}} style={{padding:"5px 8px",borderRadius:"0 20px 20px 0",border:"1.5px solid "+(active?textMain:border),borderLeft:"none",background:active?textMain:card,color:active?card:textLight,fontSize:10,cursor:"pointer",fontFamily:"inherit",lineHeight:1}}>✕</button>
                  </div>
                );})}
                {ui.showTagInput
                  ?<div style={{display:"flex",gap:4,flexShrink:0}}>
                    <input autoFocus value={ui.tagInput||""} onChange={function(e){mu({tagInput:e.target.value});}} onKeyDown={function(e){if(e.key==="Enter")addTag(ui.tagInput||"");if(e.key==="Escape")mu({showTagInput:false,tagInput:""}); }} placeholder={t.addTag} style={{padding:"4px 10px",borderRadius:20,border:"1.5px solid "+border,background:card,color:textMain,fontSize:12,fontFamily:"inherit",outline:"none",width:100}}/>
                    <button onClick={function(){addTag(ui.tagInput||"");}} style={{padding:"4px 10px",borderRadius:20,background:textMain,color:card,border:"none",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>+</button>
                  </div>
                  :<button onClick={function(){mu({showTagInput:true});}} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,border:"1.5px dashed "+border,background:"transparent",color:textLight,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>+</button>
                }
              </div>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                <input
                  value={ui.taskInput||""}
                  onChange={function(e){mu({taskInput:e.target.value});}}
                  onKeyDown={function(e){if(e.key==="Enter")addTask(ui.taskInput||"",ui.activeTag);}}
                  placeholder={t.addTask}
                  style={{flex:1,padding:"10px 14px",borderRadius:10,border:"1.5px solid "+border,background:card,color:textMain,fontSize:14,fontFamily:"inherit",outline:"none"}}
                />
                <button onClick={function(){addTask(ui.taskInput||"",ui.activeTag);}} style={{width:42,height:42,borderRadius:10,background:textMain,color:card,border:"none",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>✓</button>
              </div>
              {pinnedTasks.length>0&&(
                <div style={{marginBottom:12}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#f59e0b",margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.06em"}}>📌 Pinned</p>
                  {pinnedTasks.map(function(tk,i){return <TaskRow key={tk.id} tk={tk} list="plan" idx={st.tasks.indexOf(tk)}/>;} )}
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <p style={{fontSize:11,fontWeight:700,color:textSub,margin:0,textTransform:"uppercase",letterSpacing:"0.06em"}}>{t.plan}</p>
                <button onClick={sortByScore} style={{background:darkBg,border:"1px solid "+border,borderRadius:8,padding:"4px 10px",fontSize:11,color:textSub,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>{t.sortByScore} ↓</button>
              </div>
              <div
                onDragOver={function(e){e.preventDefault();}}
                onDrop={function(e){e.preventDefault();var fromList=e.dataTransfer.getData("tlist");if(fromList==="later"){var fromId=parseInt(e.dataTransfer.getData("tid"));moveToPlan(fromId);}}}
              >
                {planTasks.length===0&&<p style={{fontSize:13,color:textLight,textAlign:"center",padding:"16px 0"}}>{t.noTasks}</p>}
                {planTasks.map(function(tk,i){return <TaskRow key={tk.id} tk={tk} list="plan" idx={st.tasks.indexOf(tk)}/>;} )}
              </div>
              <div style={{marginTop:20,marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <p style={{fontSize:11,fontWeight:700,color:textSub,margin:0,textTransform:"uppercase",letterSpacing:"0.06em"}}>{t.later}</p>
                  <button onClick={sortLaterByScore} style={{background:darkBg,border:"1px solid "+border,borderRadius:8,padding:"4px 10px",fontSize:11,color:textSub,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>{t.sortByScore} ↓</button>
                </div>
              </div>
              <div
                onDragOver={function(e){e.preventDefault();}}
                onDrop={function(e){e.preventDefault();var fromList=e.dataTransfer.getData("tlist");if(fromList==="plan"){var fromId=parseInt(e.dataTransfer.getData("tid"));moveToLater(fromId);}}}
              >
                {visibleLater.length===0&&<p style={{fontSize:13,color:textLight,textAlign:"center",padding:"12px 0"}}>–</p>}
                {visibleLater.map(function(tk,i){return <TaskRow key={tk.id} tk={tk} list="later" idx={st.laterTasks.indexOf(tk)}/>;} )}
              </div>
              {ui.taskPopup&&(function(){
                var popList=ui.taskPopup.list;
                var popArr=popList==="later"?st.laterTasks:st.tasks;
                var popTask=popArr.find(function(tk){return tk.id===ui.taskPopup.id;});
                if(!popTask)return null;
                var curImp=popTask.importance||3,curUrg=popTask.urgency||3;
                var draftText=ui.taskPopup.draftText!==undefined?ui.taskPopup.draftText:popTask.text;
                var draftDesc=ui.taskPopup.draftDesc!==undefined?ui.taskPopup.draftDesc:(popTask.description||"");
                var draftDeadline=ui.taskPopup.draftDeadline!==undefined?ui.taskPopup.draftDeadline:(popTask.deadline||"");
                var draftReminder=ui.taskPopup.draftReminder!==undefined?ui.taskPopup.draftReminder:(popTask.reminder||"");
                var dlDiff=draftDeadline?new Date(draftDeadline)-new Date():null;
                var dlCol=dlDiff===null?border:dlDiff<0?red:dlDiff<3600000?red:dlDiff<14400000?yellow:green;
                var fieldStyle={width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid "+border,background:darkBg,color:textMain,fontSize:14,fontFamily:"inherit",outline:"none",marginBottom:14,boxSizing:"border-box"};
                return(
                  <Sheet z={1000} onClose={function(){mu({taskPopup:null});}}>
                    <p style={{fontSize:12,color:textSub,margin:"0 0 6px"}}>{t.editTask}</p>
                    <input value={draftText} onChange={function(e){mu({taskPopup:Object.assign({},ui.taskPopup,{draftText:e.target.value})});}} style={Object.assign({},fieldStyle,{fontSize:15,marginBottom:10})}/>
                    <textarea
                      value={draftDesc}
                      onChange={function(e){mu({taskPopup:Object.assign({},ui.taskPopup,{draftDesc:e.target.value})});}}
                      onInput={function(e){var el=e.target;el.style.height="auto";el.style.height=el.scrollHeight+"px";}}
                      placeholder={t.description+"..."}
                      rows={2}
                      style={Object.assign({},fieldStyle,{resize:"none",lineHeight:1.5,overflow:"hidden"})}
                    />
                    <p style={{fontSize:12,fontWeight:600,color:textMain,margin:"0 0 6px"}}>{t.tag}</p>
                    <select value={popTask.tag||""} onChange={function(e){setTaskTag(popTask.id,e.target.value?parseInt(e.target.value):null,popList);}} style={Object.assign({},fieldStyle,{appearance:"none"})}>
                      <option value="">— {t.allTasks} —</option>
                      {st.tags.map(function(tg){return <option key={tg.id} value={tg.id}>{tg.name}</option>;})}
                    </select>
                    <p style={{fontSize:12,fontWeight:600,color:textMain,margin:"0 0 6px"}}>⏰ {t.deadline}</p>
                    <input type="datetime-local" value={draftDeadline} onChange={function(e){mu({taskPopup:Object.assign({},ui.taskPopup,{draftDeadline:e.target.value})});}} style={Object.assign({},fieldStyle,{border:"1.5px solid "+dlCol,color:dlCol!==border?dlCol:textMain})}/>
                    <p style={{fontSize:12,fontWeight:600,color:textMain,margin:"0 0 6px"}}>🔔 {t.reminder}</p>
                    <input type="datetime-local" value={draftReminder} onChange={function(e){mu({taskPopup:Object.assign({},ui.taskPopup,{draftReminder:e.target.value})});requestNotifPermission();}} style={Object.assign({},fieldStyle,{color:draftReminder?textMain:textLight})}/>
                    <p style={{fontSize:12,color:textSub,margin:"0 0 12px"}}>Score: {Math.round(((popTask.importance||3)*0.7+(popTask.urgency||3)*0.3)*10)/10}</p>
                    <p style={{fontSize:12,fontWeight:600,color:textMain,margin:"0 0 8px"}}>{t.importance}</p>
                    <div style={{display:"flex",gap:6,marginBottom:14}}>
                      {[1,2,3,4,5].map(function(v){var sel=curImp===v;return <div key={v} onClick={function(){setTaskPri(popTask.id,v,curUrg,popList);mu({taskPopup:Object.assign({},ui.taskPopup,{id:popTask.id,list:popList})});}} style={{flex:1,padding:"8px 0",textAlign:"center",borderRadius:10,border:"2px solid "+(sel?textMain:border),background:sel?textMain:card,color:sel?card:textMain,fontWeight:700,fontSize:15,cursor:"pointer"}}>{v}</div>;})}
                    </div>
                    <p style={{fontSize:12,fontWeight:600,color:textMain,margin:"0 0 8px"}}>{t.urgency}</p>
                    <div style={{display:"flex",gap:6,marginBottom:20}}>
                      {[1,2,3,4,5].map(function(v){var sel=curUrg===v;return <div key={v} onClick={function(){setTaskPri(popTask.id,curImp,v,popList);mu({taskPopup:Object.assign({},ui.taskPopup,{id:popTask.id,list:popList})});}} style={{flex:1,padding:"8px 0",textAlign:"center",borderRadius:10,border:"2px solid "+(sel?textMain:border),background:sel?textMain:card,color:sel?card:textMain,fontWeight:700,fontSize:15,cursor:"pointer"}}>{v}</div>;})}
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={function(){mu({taskPopup:null,taskDeleteConfirm:{id:popTask.id,list:popList,text:popTask.text}});}} style={{flex:1,padding:"12px",borderRadius:12,border:"1.5px solid "+red,background:"transparent",color:red,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.deleteTask}</button>
                      <button onClick={function(){saveTaskEdit(popTask.id,{text:draftText,description:draftDesc,deadline:draftDeadline||null,reminder:draftReminder||null},popList);mu({taskPopup:null});}} style={{flex:2,padding:"12px",borderRadius:12,border:"none",background:textMain,color:card,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.save}</button>
                    </div>
                  </Sheet>
                );
              })()}
              {ui.taskDeleteConfirm&&(
                <Sheet z={1001} onClose={function(){mu({taskDeleteConfirm:null});}}>
                  <div style={{textAlign:"center",padding:"8px 0 4px"}}>
                    <div style={{width:48,height:48,borderRadius:"50%",background:"#fee2e2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p style={{fontSize:16,fontWeight:700,color:textMain,margin:"0 0 6px"}}>Delete task?</p>
                    <p style={{fontSize:13,color:textSub,margin:"0 0 24px",wordBreak:"break-word"}}>"{ui.taskDeleteConfirm.text}"</p>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={function(){mu({taskDeleteConfirm:null});}} style={{flex:1,padding:"12px",borderRadius:12,border:"1.5px solid "+border,background:card,color:textMain,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>No</button>
                      <button onClick={function(){deleteTask(ui.taskDeleteConfirm.id,ui.taskDeleteConfirm.list);mu({taskDeleteConfirm:null});}} style={{flex:1,padding:"12px",borderRadius:12,border:"none",background:"#ef4444",color:"white",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Yes</button>
                    </div>
                  </div>
                </Sheet>
              )}
            </div>
          );
        })()}

        {ui.tab==="analytics"&&(function(){
          var aTab=(ui.aTab==="all time")?"general":ui.aTab||"general";
          var aKeys=aTab==="week"?wkK:aTab==="month"?moK:atK.slice().sort();
          var aF=cSt(aKeys,"full"),aP=cSt(aKeys,"partial"),aM=cSt(aKeys,"none");
          var aDT=aKeys.filter(function(k){return Object.values(st.counts[k]||{}).some(function(v){return v>0;});}).length;
          var aBStr=(function(){
            var best=0,cur=0;
            var dates;
            if(aTab==="week") dates=wkK.slice().sort();
            else if(aTab==="month") dates=moK.slice().sort();
            else {
              var sorted=atK.slice().sort();
              if(!sorted.length) return 0;
              dates=[];
              var d2=new Date(sorted[0]);
              while(isoD(d2)<=TODAY){dates.push(isoD(new Date(d2)));d2.setDate(d2.getDate()+1);}
            }
            dates.forEach(function(k){
              var ds=daySt(st.habits,k,st.counts);
              if(ds==="full"||ds==="partial"){cur++;if(cur>best)best=cur;}
              else if(ds==="empty"){/* rest day — don't break streak */}
              else{cur=0;}
            });
            return best;
          })();
          var tIds=new Set();aKeys.forEach(function(k){Object.keys(st.counts[k]||{}).forEach(function(id){if((st.counts[k][id]||0)>0)tIds.add(id);});});
          var top3=st.habits.map(function(h){var sched=aKeys.filter(function(k){return h.freq.includes(dow(k));}).length;var done=aKeys.filter(function(k){return h.freq.includes(dow(k))&&getPct(h,k,st.counts)>0;}).length;return{h:h,done:done,sched:sched};}).filter(function(x){return x.done>0;}).sort(function(a,b){return b.done-a.done;}).slice(0,3);
          var chartK=aKeys.slice().sort().slice(-60);
          var maxH=Math.max(1,st.habits.length);
          var title=aTab==="week"?t.week:aTab==="month"?t.month:t.allTime;
          return(
            <div>
              <div style={{display:"flex",gap:4,marginBottom:16,background:card,borderRadius:"12px",padding:4,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
                {[["general",t.allTime],["week",t.week],["month",t.month]].map(function(pair){var a=aTab===pair[0];return <div key={pair[0]} onClick={function(){mu({aTab:pair[0]});}} style={{flex:1,textAlign:"center",padding:"7px 4px",borderRadius:9,background:a?"#111827":"transparent",color:a?"#fff":textSub,fontSize:12,fontWeight:a?600:400,cursor:"pointer"}}>{pair[1]}</div>;})}
              </div>
              <p style={{fontSize:16,fontWeight:700,color:textMain,margin:"0 0 14px"}}>{title}</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                <Stat icon="✅" val={aF} label={t.perfect} col={green} bg={greenBg} bo={greenBo}/>
                <Stat icon="🌓" val={aP} label={t.partial} col={yellow} bg={yellowBg} bo={yellowBo}/>
                <Stat icon="❌" val={aM} label={t.missed} col={red} bg={redBg} bo={redBo}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                <Stat icon="📅" val={aDT} label={t.daysTracked}/>
                <Stat icon="🔥" val={aBStr+"d"} label={t.bestStreak}/>
                <Stat icon="💪" val={tIds.size} label={t.habits}/>
              </div>
              {top3.length>0&&(
                <Card s={{marginBottom:10,padding:"14px 16px"}}>
                  <p style={{fontSize:12,fontWeight:700,color:textSub,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:"0.05em"}}>🏆 Top habits</p>
                  {top3.map(function(x,i){var pct=x.sched>0?Math.round(x.done/x.sched*100):0;return(
                    <div key={x.h.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:i<top3.length-1?10:0}}>
                      <span style={{fontSize:11,fontWeight:700,color:textLight,width:14,flexShrink:0}}>{i+1}</span>
                      <span style={{fontSize:15,flexShrink:0}}>{x.h.emoji}</span>
                      <span style={{flex:1,fontSize:13,fontWeight:500,color:textMain,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.h.name}</span>
                      <span style={{fontSize:12,fontWeight:700,color:green,flexShrink:0}}>{x.done}/{x.sched} days</span>
                      <div style={{width:36,flexShrink:0}}><PBar pct={pct} col={green} h={4}/></div>
                    </div>
                  );})}
                </Card>
              )}
              {aTab!=="general"&&chartK.length>0&&(function(){
                var N=chartK.length;
                var cH=90,cTop=12,xOff=26;
                var sp=N<=8?Math.max(30,Math.floor(230/Math.max(1,N-1))):18;
                var cw=xOff+(N-1)*sp+24;
                var xEnd=xOff+(N-1)*sp;
                var yMax=maxH;
                var yLabels=yMax<=10?Array.from({length:yMax+1},function(_,i){return i;}):[0,Math.round(yMax*0.25),Math.round(yMax*0.5),Math.round(yMax*0.75),yMax];
                function gy(v){return cTop+cH-Math.round(v/Math.max(1,yMax)*cH);}
                function gx(i){return xOff+(N===1?0:i*sp);}
                var pts=chartK.map(function(d,i){
                  var sched=st.habits.filter(function(h){return h.freq.includes(dow(d));}).length;
                  var done=st.habits.filter(function(h){return h.freq.includes(dow(d))&&getPct(h,d,st.counts)>0;}).length;
                  return{x:gx(i),y:gy(done),done:done,sched:sched,d:d};
                });
                var poly=pts.map(function(p){return p.x+","+p.y;}).join(" ");
                var base=cTop+cH;
                var area="M"+pts[0].x+","+pts[0].y+pts.slice(1).map(function(p){return" L"+p.x+","+p.y;}).join("")+" L"+pts[pts.length-1].x+","+base+" L"+pts[0].x+","+base+" Z";
                var svgH=cTop+cH+46;
                return(
                  <Card s={{padding:"14px 12px"}}>
                    <p style={{fontSize:12,fontWeight:700,color:textSub,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:"0.05em"}}>📈 Daily completions</p>
                    <div style={{overflowX:"auto"}}>
                      <svg width={cw} height={svgH}>
                        {yLabels.map(function(v){var y=gy(v);return(
                          <g key={v}>
                            <line x1={xOff-4} y1={y} x2={xEnd+6} y2={y} stroke={border} strokeWidth={v===0?1:0.6} strokeDasharray={v===0?"":"4,3"}/>
                            <text x={xOff-7} y={y+3} textAnchor="end" fontSize="8" fill={textSub}>{v}</text>
                          </g>
                        );})}
                        <path d={area} fill={green} fillOpacity="0.08"/>
                        <polyline points={poly} fill="none" stroke={green} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
                        {pts.map(function(p){
                          var col=p.done>0&&p.done>=p.sched?green:p.done>0?yellow:border;
                          return(
                            <g key={p.d}>
                              <circle cx={p.x} cy={p.y} r="3.5" fill={p.done>0?col:card} stroke={col} strokeWidth="1.5"/>
                              <text x={p.x} y={base+8} textAnchor="end" fontSize="7" fill={textLight} transform={"rotate(-40,"+p.x+","+(base+8)+")"}>
                                {p.d.slice(5).replace("-",".")}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </Card>
                );
              })()}
              {aTab==="general"&&(
                <Card s={{marginTop:0}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                    <IBtn onClick={function(){var m=ui.mo===0?11:ui.mo-1,y=ui.mo===0?ui.yr-1:ui.yr;mu({mo:m,yr:y,pDay:null});}} sz={34}>&#8592;</IBtn>
                    <p style={{fontSize:15,fontWeight:600,color:textMain,margin:0}}>{mName}</p>
                    <IBtn onClick={function(){var m=ui.mo===11?0:ui.mo+1,y=ui.mo===11?ui.yr+1:ui.yr;mu({mo:m,yr:y,pDay:null});}} sz={34}>&#8594;</IBtn>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
                    {DL.map(function(d){return <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:600,color:textLight,padding:"4px 0"}}>{d}</div>;})}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
                    {Array.from({length:FDM}).map(function(_,i){return <div key={"e"+i}/>;} )}
                    {Array.from({length:DIM},function(_,i){return i+1;}).map(function(d){
                      var key=cKey(d);
                      var hasData=!!(st.counts[key]&&Object.values(st.counts[key]).some(function(v){return v>0;}));
                      var isT=isCurMo&&d===tObj.getDate(),isFut=isCurMo&&d>tObj.getDate();
                      var st2=(!hasData&&!isT&&!isFut)?"empty":daySt(st.habits,key,st.counts);
                      var sc2=hasData?dayScore(st.habits,key,st.counts):null;
                      var face=hasData&&sc2!==null?(sc2>=90?"😊":sc2>=60?"😐":"😢"):null;
                      return(
                        <div key={d} onClick={function(){if(!isFut)mu({pDay:d});}} style={{aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:8,background:isFut?"transparent":SC[st2]?SC[st2].bg:darkBg,border:isT?"2px solid "+textMain:"1.5px solid transparent",cursor:isFut?"default":"pointer",color:isFut?textLight:SC[st2]?SC[st2].tx:textLight}}>
                          <span style={{fontSize:12,fontWeight:isT?700:500}}>{d}</span>
                          {face&&<span style={{fontSize:9,lineHeight:1,marginTop:1}}>{face}</span>}
                        </div>
                      );
                    })}
                  </div>
                  {ui.pDay&&(function(){
                    var key=cKey(ui.pDay),dw=dow(key),sched=st.habits.filter(function(h){return h.freq.includes(dw);});
                    var lbl=new Date(yr,mo,ui.pDay).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
                    var fH=sched.filter(function(h){return hSt(h,key,st.counts)==="full";}),prtH=sched.filter(function(h){return hSt(h,key,st.counts)==="partial";}),mH=sched.filter(function(h){return hSt(h,key,st.counts)==="none";});
                    var ov=sched.length?Math.round(sched.reduce(function(s,h){return s+getPct(h,key,st.counts);},0)/sched.length):0;
                    var dn=st.dayNotes[key]||"";
                    function HR(rp){var p=getPct(rp.h,key,st.counts);return(
                      <div style={{padding:"8px 0",borderBottom:"1px solid "+border}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:16}}>{rp.h.emoji}</span>
                          <span style={{flex:1,fontSize:14,fontWeight:500,color:rp.col,textDecoration:rp.deco||"none"}}>{rp.h.name}</span>
                          {rp.h.target>1?<span style={{fontSize:12,color:rp.col,fontWeight:600}}>{p}%</span>:<span style={{fontSize:13,color:rp.col,fontWeight:600}}>{rp.icon}</span>}
                        </div>
                        {rp.h.notes&&rp.h.notes.trim()&&<p style={{fontSize:12,color:textSub,margin:"5px 0 0 26px",lineHeight:1.5,fontStyle:"italic"}}>{rp.h.notes}</p>}
                      </div>
                    );}
                    return(
                      <Sheet onClose={function(){mu({pDay:null});}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                          <p style={{fontSize:15,fontWeight:700,margin:0,color:textMain}}>{lbl}</p>
                          <IBtn onClick={function(){mu({pDay:null});}} sz={30}>&#x2715;</IBtn>
                        </div>
                        {dn&&<div style={{background:greenBg,borderRadius:10,padding:"10px 14px",marginBottom:14,borderLeft:"3px solid "+green}}><p style={{fontSize:11,color:green,margin:"0 0 4px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em"}}>📝 {t.addNote}</p><p style={{fontSize:13,color:textMain,margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{dn}</p></div>}
                        {sched.length>0&&<div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:textSub}}>{t.overall}</span><span style={{fontSize:15,fontWeight:700,color:ov===100?green:ov===0?red:yellow}}>{ov}%</span></div><PBar pct={ov} col={ov===100?green:ov===0?red:"#f59e0b"}/></div>}
                        {sched.length===0?<p style={{fontSize:14,color:textSub,textAlign:"center",padding:"20px 0"}}>{t.noSched}</p>:(
                          <div>
                            {fH.length>0&&<div><p style={{fontSize:11,fontWeight:700,color:green,margin:"8px 0 6px",textTransform:"uppercase"}}>{t.done} ({fH.length})</p>{fH.map(function(h){return <HR key={h.id} h={h} col={green} deco="line-through" icon="✓"/>;})}</div>}
                            {prtH.length>0&&<div><p style={{fontSize:11,fontWeight:700,color:yellow,margin:"14px 0 6px",textTransform:"uppercase"}}>{t.partial} ({prtH.length})</p>{prtH.map(function(h){return <HR key={h.id} h={h} col={yellow} icon="~"/>;})}</div>}
                            {mH.length>0&&<div><p style={{fontSize:11,fontWeight:700,color:red,margin:"14px 0 6px",textTransform:"uppercase"}}>{t.missed} ({mH.length})</p>{mH.map(function(h){return <HR key={h.id} h={h} col={red} icon="✗"/>;})}</div>}
                          </div>
                        )}
                      </Sheet>
                    );
                  })()}
                </Card>
              )}
            </div>
          );
        })()}

        {ui.tab==="settings"&&(
          <div>
            <p style={{fontSize:16,fontWeight:700,color:textMain,margin:"0 0 16px"}}>{t.settings}</p>

            <Card s={{marginBottom:12,cursor:"pointer",padding:"16px 18px"}} onClick={function(){mu({sPanel:"profile"});}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:42,height:42,borderRadius:12,background:darkBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
                <div style={{flex:1}}><p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:textMain}}>{t.profile}</p><p style={{fontSize:12,color:textSub,margin:0}}>{st.profileName||t.helloDefault}</p></div>
                <span style={{color:textLight,fontSize:18}}>›</span>
              </div>
            </Card>

            <Card s={{marginBottom:12,cursor:"pointer",padding:"16px 18px"}} onClick={function(){mu({sPanel:"habits"});}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:42,height:42,borderRadius:12,background:greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>💪</div>
                <div style={{flex:1}}><p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:textMain}}>{t.editHabits}</p><p style={{fontSize:12,color:textSub,margin:0}}>{st.habits.length} {t.habitsConfigured}</p></div>
                <span style={{color:textLight,fontSize:18}}>›</span>
              </div>
            </Card>

            {[{key:"water",icon:"💧",label:t.water,unit:"L"},{key:"sleep",icon:"🛏",label:t.sleep,unit:"hrs"}].map(function(item){
              var g=st.goals[item.key];
              return(
                <Card key={item.key} s={{marginBottom:12,cursor:"pointer",padding:"16px 18px"}} onClick={function(){mu({sPanel:item.key,gDraft:Object.assign({},g)});}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:42,height:42,borderRadius:12,background:darkBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{item.icon}</div>
                    <div style={{flex:1}}><p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:textMain}}>{item.label}</p><p style={{fontSize:12,color:textSub,margin:0}}>{t.adjustGoal}</p></div>
                    <div style={{textAlign:"right"}}><p style={{fontSize:13,fontWeight:600,color:textMain,margin:0}}>{t.norm}: {g.norm} {item.unit}</p><p style={{fontSize:11,color:textSub,margin:0}}>{g.min}–{g.max} {item.unit}</p></div>
                    <span style={{color:textLight,fontSize:18,marginLeft:6}}>›</span>
                  </div>
                </Card>
              );
            })}

            {(function(){var g=st.goals.calories;return(
              <Card s={{marginBottom:12,cursor:"pointer",padding:"16px 18px"}} onClick={function(){var d=st.calWizData;mu({wiz:d?{step:1,gender:d.gender,W:d.W,H:d.H,A:d.A,goal:d.goal,act:d.act,result:null}:{step:1,gender:null,W:"",H:"",A:"",goal:null,act:null,result:null}});}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:42,height:42,borderRadius:12,background:darkBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🥗</div>
                  <div style={{flex:1}}><p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:textMain}}>{t.calories}</p><p style={{fontSize:12,color:textSub,margin:0}}>{t.calcNorm}</p></div>
                  <div style={{textAlign:"right"}}><p style={{fontSize:13,fontWeight:600,color:textMain,margin:0}}>{t.norm}: {g.norm} kcal</p><p style={{fontSize:11,color:textSub,margin:0}}>{g.min}–{g.max}</p></div>
                  <span style={{color:textLight,fontSize:18,marginLeft:6}}>›</span>
                </div>
              </Card>
            );}())}

            <Card s={{marginBottom:12,cursor:"pointer",padding:"16px 18px"}} onClick={function(){mu({sPanel:"lang"});}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:42,height:42,borderRadius:12,background:darkBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🌐</div>
                <div style={{flex:1}}><p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:textMain}}>{t.language}</p><p style={{fontSize:12,color:textSub,margin:0}}>{st.lang==="en"?"English":"Ukrainian"}</p></div>
                <span style={{color:textLight,fontSize:18}}>›</span>
              </div>
            </Card>

            <Card s={{marginBottom:12,cursor:"pointer",padding:"16px 18px"}} onClick={function(){mu({sPanel:"theme"});}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:42,height:42,borderRadius:12,background:darkBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{isDark?"🌙":"🌅"}</div>
                <div style={{flex:1}}><p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:textMain}}>{t.visualMode}</p><p style={{fontSize:12,color:textSub,margin:0}}>{isDark?t.evening:t.morning}</p></div>
                <span style={{color:textLight,fontSize:18}}>›</span>
              </div>
            </Card>

            <Card s={{marginBottom:12,cursor:"pointer",padding:"16px 18px"}} onClick={function(){mu({sPanel:"journal"});}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:42,height:42,borderRadius:12,background:darkBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📓</div>
                <div style={{flex:1}}><p style={{fontSize:15,fontWeight:600,margin:"0 0 2px",color:textMain}}>{t.journal}</p><p style={{fontSize:12,color:textSub,margin:0}}>{t.journalSub}</p></div>
                <span style={{color:textLight,fontSize:18}}>›</span>
              </div>
            </Card>

            {ui.sPanel==="profile"&&(
              <Sheet onClose={function(){mu({sPanel:null,profileDraft:undefined});}}>
                <p style={{fontSize:16,fontWeight:700,color:textMain,margin:"0 0 16px"}}>{t.profile}</p>
                <p style={{fontSize:13,color:textSub,margin:"0 0 8px"}}>{t.profileName}</p>
                <input
                  autoFocus
                  value={ui.profileDraft!==undefined?ui.profileDraft:(st.profileName||"")}
                  onChange={function(e){mu({profileDraft:e.target.value});}}
                  placeholder={t.profilePlaceholder}
                  style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",borderRadius:12,border:"1px solid "+border,background:darkBg,color:textMain,fontSize:15,fontFamily:"inherit",outline:"none",marginBottom:16}}
                />
                <button onClick={function(){mst({profileName:(ui.profileDraft!==undefined?ui.profileDraft:(st.profileName||"")).trim()});mu({sPanel:null,profileDraft:undefined});}} style={{width:"100%",padding:"13px",borderRadius:12,background:textMain,color:card,border:"none",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.save}</button>
              </Sheet>
            )}

            {ui.sPanel==="lang"&&(
              <Sheet onClose={function(){mu({sPanel:null});}}>
                <p style={{fontSize:16,fontWeight:700,color:textMain,margin:"0 0 16px"}}>{t.language}</p>
                {[{v:"en",l:"English"},{v:"uk",l:"Ukrainian"}].map(function(o){var sel=st.lang===o.v;return(
                  <div key={o.v} onClick={function(){mst({lang:o.v});mu({sPanel:null});}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderRadius:"12px",border:"1px solid "+(sel?textMain:border),background:sel?darkBg:card,cursor:"pointer",marginBottom:10}}>
                    <span style={{fontSize:15,fontWeight:sel?600:400,color:textMain}}>{o.l}</span>
                    {sel&&<span style={{color:green,fontSize:18}}>✓</span>}
                  </div>
                );})}
              </Sheet>
            )}

            {ui.sPanel==="theme"&&(
              <Sheet onClose={function(){mu({sPanel:null});}}>
                <p style={{fontSize:16,fontWeight:700,color:textMain,margin:"0 0 16px"}}>{t.visualMode}</p>
                {[{v:"morning",l:t.morning,icon:"🌅"},{v:"evening",l:t.evening,icon:"🌙"}].map(function(o){var sel=st.theme===o.v;return(
                  <div key={o.v} onClick={function(){mst({theme:o.v});mu({sPanel:null});}} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:"12px",border:"1px solid "+(sel?textMain:border),background:sel?darkBg:card,cursor:"pointer",marginBottom:10}}>
                    <span style={{fontSize:28}}>{o.icon}</span>
                    <span style={{fontSize:15,fontWeight:sel?600:400,color:textMain,flex:1}}>{o.l}</span>
                    {sel&&<span style={{color:green,fontSize:18}}>✓</span>}
                  </div>
                );})}
              </Sheet>
            )}

            {ui.sPanel==="journal"&&(function(){
              var jf=ui.journalFilter||"week";
              var jFrom=ui.journalFrom||"";
              var jTo=ui.journalTo||TODAY;
              var jDates;
              if(jf==="day"){
                jDates=[TODAY];
              } else if(jf==="week"){
                jDates=wkK.slice().sort().reverse();
              } else if(jf==="month"){
                jDates=moK.slice().sort().reverse();
              } else if(jf==="custom"){
                jDates=[];
                if(jFrom){
                  var d2=new Date(jFrom),jTo2=jTo||TODAY;
                  while(isoD(d2)<=jTo2){jDates.push(isoD(new Date(d2)));d2.setDate(d2.getDate()+1);}
                  jDates.reverse();
                }
              } else {
                jDates=Object.keys(st.dayNotes).sort().reverse();
              }
              var jEntries=jDates.filter(function(k){return !!(st.dayNotes[k]&&st.dayNotes[k].trim());});
              var FILTERS=[["day",t.jDay],["week",t.jWeek],["month",t.jMonth],["all",t.jAll],["custom",t.jCustom]];
              return(
                <Sheet onClose={function(){mu({sPanel:null});}}>
                  <p style={{fontSize:16,fontWeight:700,color:textMain,margin:"0 0 14px"}}>📓 {t.journal}</p>
                  <div style={{display:"flex",gap:3,marginBottom:14,background:darkBg,borderRadius:10,padding:3}}>
                    {FILTERS.map(function(pair){
                      var a=jf===pair[0];
                      return(
                        <div key={pair[0]} onClick={function(){mu({journalFilter:pair[0]});}} style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:7,background:a?card:"transparent",color:a?textMain:textSub,fontSize:10,fontWeight:a?600:400,cursor:"pointer",transition:"background 0.15s"}}>
                          {pair[1]}
                        </div>
                      );
                    })}
                  </div>
                  {jf==="custom"&&(
                    <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
                      <input type="date" value={jFrom} max={TODAY} onChange={function(e){mu({journalFrom:e.target.value});}} style={{flex:1,fontSize:12,padding:"8px 10px",borderRadius:8,border:"1px solid "+border,background:darkBg,color:textMain,fontFamily:"inherit",outline:"none"}}/>
                      <span style={{color:textSub,fontSize:12}}>—</span>
                      <input type="date" value={jTo} max={TODAY} onChange={function(e){mu({journalTo:e.target.value});}} style={{flex:1,fontSize:12,padding:"8px 10px",borderRadius:8,border:"1px solid "+border,background:darkBg,color:textMain,fontFamily:"inherit",outline:"none"}}/>
                    </div>
                  )}
                  {jEntries.length===0?(
                    <div style={{textAlign:"center",padding:"48px 0"}}>
                      <p style={{fontSize:36,margin:"0 0 10px"}}>📭</p>
                      <p style={{fontSize:14,color:textSub,margin:0}}>{t.journalEmpty}</p>
                    </div>
                  ):(
                    <div>
                      {jEntries.map(function(k){
                        var d=new Date(k+"T12:00:00");
                        var label=d.toLocaleDateString(st.lang==="uk"?"uk-UA":"en-US",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
                        var isToday=k===TODAY;
                        return(
                          <div key={k} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid "+border}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                              {isToday&&<span style={{fontSize:10,fontWeight:700,color:green,background:greenBg,padding:"2px 8px",borderRadius:10,border:"1px solid "+greenBo}}>Сьогодні</span>}
                              <p style={{fontSize:11,fontWeight:700,color:textLight,textTransform:"uppercase",letterSpacing:"0.04em",margin:0}}>{label}</p>
                            </div>
                            <p style={{fontSize:14,color:textMain,margin:0,lineHeight:1.65,whiteSpace:"pre-wrap"}}>{st.dayNotes[k]}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Sheet>
              );
            })()}

            {ui.sPanel==="habits"&&(
              <Sheet onClose={function(){mu({sPanel:null});}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <p style={{fontSize:16,fontWeight:700,color:textMain,margin:0}}>{t.editHabits}</p>
                  <Btn onClick={function(){mu({sPanel:null,editH:"new"});}} v="pri" s={{fontSize:12,padding:"6px 14px"}}>{t.add}</Btn>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {st.habits.map(function(h){return(
                    <div key={h.id} style={{display:"flex",alignItems:"center",gap:12,background:darkBg,border:"1px solid "+border,borderRadius:"12px",padding:"12px 14px",cursor:"pointer"}} onClick={function(){mu({sPanel:null,editH:h,detFrom:"habits"});}}>
                      <span style={{fontSize:22}}>{h.emoji}</span>
                      <div style={{flex:1,minWidth:0}}><p style={{fontSize:14,fontWeight:600,margin:"0 0 2px",color:textMain,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.name}</p><p style={{fontSize:12,color:textSub,margin:0}}>{TI[h.time]} {h.time} · {h.freq.length===7?t.everyDay:h.freq.map(function(d){return d.slice(0,3);}).join(", ")}</p></div>
                      <span style={{color:textLight,fontSize:16}}>✏️</span>
                    </div>
                  );})}
                </div>
              </Sheet>
            )}

            {["water","sleep"].includes(ui.sPanel)&&ui.gDraft&&(function(){
              var key=ui.sPanel;
              var meta={water:{icon:"💧",label:t.water,unit:"L",step:0.1,min:0,max:10},sleep:{icon:"🛏",label:t.sleep,unit:"hrs",step:0.5,min:0,max:24}};
              var m=meta[key],d=ui.gDraft;
              function GoalRow(rp){
                var frac=Math.round((d[rp.f]-m.min)/Math.max(0.001,m.max-m.min)*100);
                return(
                  <div style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><p style={{fontSize:13,fontWeight:600,color:textMain,margin:0}}>{rp.label}</p><p style={{fontSize:13,fontWeight:700,color:textMain,margin:0}}>{d[rp.f]} {m.unit}</p></div>
                    <input type="range" min={m.min} max={m.max} step={m.step} value={d[rp.f]} onChange={function(e){var v=parseFloat(e.target.value),nd=Object.assign({},d);nd[rp.f]=v;mu({gDraft:nd});}} style={{width:"100%",background:"linear-gradient(to right,#111827 "+frac+"%, "+border+" "+frac+"%)"}}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:10,color:textLight}}>{m.min} {m.unit}</span><span style={{fontSize:10,color:textLight}}>{m.max} {m.unit}</span></div>
                  </div>
                );
              }
              return(
                <Sheet onClose={function(){mu({sPanel:null,gDraft:null});}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                    <span style={{fontSize:28}}>{m.icon}</span>
                    <p style={{fontSize:17,fontWeight:700,color:textMain,margin:0}}>{m.label}</p>
                  </div>
                  <div style={{background:darkBg,borderRadius:12,padding:"16px",marginBottom:16}}>
                    <GoalRow label={t.minimum} f="min"/>
                    <GoalRow label={t.norm+" ("+t.goalLabel+")"} f="norm"/>
                    <GoalRow label={t.maximum} f="max"/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
                    {["min","norm","max"].map(function(f){return(<div key={f} style={{background:f==="norm"?"#111827":darkBg,borderRadius:10,padding:"10px 6px",textAlign:"center",border:"1px solid "+(f==="norm"?"#111827":border)}}><p style={{fontSize:10,color:f==="norm"?"#aaa":textSub,margin:"0 0 2px",textTransform:"uppercase"}}>{f==="min"?t.min:f==="max"?t.max:t.norm}</p><p style={{fontSize:18,fontWeight:800,color:f==="norm"?"#fff":textMain,margin:0}}>{d[f]}</p><p style={{fontSize:10,color:f==="norm"?"#aaa":textSub,margin:0}}>{m.unit}</p></div>);})}
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <Btn onClick={function(){saveGoals(key,d);}} v="pri" s={{flex:1,padding:"12px",fontSize:15}}>{t.saveGoals}</Btn>
                    <Btn onClick={function(){mu({sPanel:null,gDraft:null});}}>{t.cancel}</Btn>
                  </div>
                </Sheet>
              );
            })()}

            {ui.wiz&&(function(){
              var wz=ui.wiz;
              function sw(patch){var w2=Object.assign({},wz);var ks=Object.keys(patch);for(var i=0;i<ks.length;i++){w2[ks[i]]=patch[ks[i]];}mu({wiz:w2});}
              function calcR(){var W=parseFloat(wz.W),H=parseFloat(wz.H),A=parseFloat(wz.A);var bmr=wz.gender==="male"?(10*W+6.25*H-5*A+5):(10*W+6.25*H-5*A-161);var tdee=Math.round(bmr*wz.act);var norm,mn,mx;if(wz.goal==="maintain"){norm=tdee;mn=Math.round(tdee*0.9);mx=Math.round(tdee*1.1);}else if(wz.goal==="lose"){norm=Math.round(tdee*0.85);mn=Math.round(tdee*0.8);mx=Math.round(tdee*0.9);}else{norm=Math.round(tdee*1.15);mn=Math.round(tdee*1.1);mx=Math.round(tdee*1.2);}return{tdee:tdee,norm:norm,min:mn,max:mx};}
              var ACTS=[{l:t.sedentary,v:1.2},{l:t.light,v:1.375},{l:t.moderate,v:1.55},{l:t.active,v:1.725},{l:t.veryActive,v:1.9}];
              var GOALS=[{l:t.maintain,v:"maintain"},{l:t.lose,v:"lose"},{l:t.gain,v:"gain"}];
              var Dots=function(){return(<div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:20}}>{[1,2,3,4].map(function(s){return <div key={s} style={{width:s<=wz.step?8:6,height:s<=wz.step?8:6,borderRadius:"50%",background:s===wz.step?"#111827":s<wz.step?green:border,transition:"all 0.2s"}}/>;})}</div>);};
              if(!wz.result) return(
                <Sheet z={1100} onClose={function(){mu({wiz:null});}}>
                  <Dots/>
                  {wz.step===1&&(
                    <div>
                      <p style={{fontSize:18,fontWeight:700,color:textMain,textAlign:"center",margin:"0 0 6px"}}>{t.gender}</p>
                      <p style={{fontSize:13,color:textSub,textAlign:"center",margin:"0 0 24px"}}>{t.step1}</p>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                        {[{v:"male",l:t.male,i:"👨"},{v:"female",l:t.female,i:"👩"}].map(function(o){var sel=wz.gender===o.v;return(<div key={o.v} onClick={function(){sw({gender:o.v});}} style={{border:"2px solid "+(sel?"#111827":border),borderRadius:"12px",padding:"20px 12px",textAlign:"center",cursor:"pointer",background:sel?"#111827":card}}><p style={{fontSize:32,margin:"0 0 8px"}}>{o.i}</p><p style={{fontSize:15,fontWeight:600,color:sel?"#fff":textMain,margin:0}}>{o.l}</p></div>);})}
                      </div>
                      <Btn onClick={function(){if(wz.gender)sw({step:2});}} v="pri" s={{width:"100%",padding:"13px",fontSize:15,opacity:wz.gender?1:0.4}}>{t.continue} →</Btn>
                    </div>
                  )}
                  {wz.step===2&&(
                    <div>
                      <p style={{fontSize:18,fontWeight:700,color:textMain,textAlign:"center",margin:"0 0 6px"}}>{t.measurements}</p>
                      <p style={{fontSize:13,color:textSub,textAlign:"center",margin:"0 0 24px"}}>{t.step2}</p>
                      {[{f:"W",label:t.weight,unit:"kg",ph:"70"},{f:"H",label:t.height,unit:"cm",ph:"175"},{f:"A",label:t.age,unit:"years",ph:"25"}].map(function(fi){return(
                        <div key={fi.f} style={{marginBottom:16}}>
                          <p style={{fontSize:12,fontWeight:600,color:textSub,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"0.04em"}}>{fi.label}</p>
                          <div style={{display:"flex",alignItems:"center",border:"1.5px solid "+(wz[fi.f]?textMain:border),borderRadius:"8px",overflow:"hidden"}}>
                            <input type="text" inputMode="decimal" placeholder={fi.ph} value={wz[fi.f]} onChange={function(e){var v=e.target.value.replace(/[^0-9.]/g,""),p=Object.assign({},wz);p[fi.f]=v;mu({wiz:p});}} style={{flex:1,fontSize:18,fontWeight:700,padding:"10px 14px",border:"none",outline:"none",color:textMain,background:"transparent",fontFamily:"inherit"}}/>
                            <span style={{padding:"0 14px",fontSize:13,color:textSub,fontWeight:500}}>{fi.unit}</span>
                          </div>
                        </div>
                      );})}
                      <div style={{display:"flex",gap:10,marginTop:8}}>
                        <Btn onClick={function(){sw({step:1});}} s={{flex:1}}>← {t.back}</Btn>
                        <Btn onClick={function(){if(wz.W&&wz.H&&wz.A)sw({step:3});}} v="pri" s={{flex:2,opacity:(wz.W&&wz.H&&wz.A)?1:0.4}}>{t.continue} →</Btn>
                      </div>
                    </div>
                  )}
                  {wz.step===3&&(
                    <div>
                      <p style={{fontSize:18,fontWeight:700,color:textMain,textAlign:"center",margin:"0 0 6px"}}>{t.yourGoal}</p>
                      <p style={{fontSize:13,color:textSub,textAlign:"center",margin:"0 0 24px"}}>{t.step3}</p>
                      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                        {GOALS.map(function(o){var sel=wz.goal===o.v;return(<div key={o.v} onClick={function(){sw({goal:o.v});}} style={{border:"2px solid "+(sel?"#111827":border),borderRadius:"12px",padding:"14px 18px",cursor:"pointer",background:sel?"#111827":card}}><p style={{fontSize:15,fontWeight:600,color:sel?"#fff":textMain,margin:0}}>{o.l}</p></div>);})}
                      </div>
                      <div style={{display:"flex",gap:10}}>
                        <Btn onClick={function(){sw({step:2});}} s={{flex:1}}>← {t.back}</Btn>
                        <Btn onClick={function(){if(wz.goal)sw({step:4});}} v="pri" s={{flex:2,opacity:wz.goal?1:0.4}}>{t.continue} →</Btn>
                      </div>
                    </div>
                  )}
                  {wz.step===4&&(
                    <div>
                      <p style={{fontSize:18,fontWeight:700,color:textMain,textAlign:"center",margin:"0 0 6px"}}>{t.activity}</p>
                      <p style={{fontSize:13,color:textSub,textAlign:"center",margin:"0 0 24px"}}>{t.step4}</p>
                      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                        {ACTS.map(function(o){var sel=wz.act===o.v;return(<div key={o.v} onClick={function(){sw({act:o.v});}} style={{border:"2px solid "+(sel?"#111827":border),borderRadius:"12px",padding:"12px 16px",cursor:"pointer",background:sel?"#111827":card}}><p style={{fontSize:14,fontWeight:sel?600:400,color:sel?"#fff":textMain,margin:0}}>{o.l}</p></div>);})}
                      </div>
                      <div style={{display:"flex",gap:10}}>
                        <Btn onClick={function(){sw({step:3});}} s={{flex:1}}>← {t.back}</Btn>
                        <Btn onClick={function(){if(wz.act)sw({result:calcR()});}} v="pri" s={{flex:2,opacity:wz.act?1:0.4}}>{t.calculate} →</Btn>
                      </div>
                    </div>
                  )}
                </Sheet>
              );
              var r=wz.result,gLbl=wz.goal==="maintain"?t.maintain:wz.goal==="lose"?t.lose:t.gain;
              return(
                <Sheet z={1100} onClose={function(){mu({wiz:null});}}>
                  <div style={{textAlign:"center",marginBottom:20}}>
                    <p style={{fontSize:40,margin:"0 0 8px"}}>🎯</p>
                    <p style={{fontSize:20,fontWeight:800,color:textMain,margin:"0 0 4px"}}>{t.calcReady}</p>
                    <p style={{fontSize:13,color:textSub,margin:0}}>{gLbl}</p>
                  </div>
                  <div style={{background:darkBg,borderRadius:"12px",padding:"20px",textAlign:"center",marginBottom:12,border:"1px solid "+border}}>
                    <p style={{fontSize:42,fontWeight:900,color:green,margin:"0 0 4px",lineHeight:1}}>{r.norm}</p>
                    <p style={{fontSize:13,color:textSub,margin:"0 0 12px"}}>kcal / day</p>
                    <p style={{fontSize:12,color:textSub,margin:"0 0 8px",fontStyle:"italic",lineHeight:1.5}}>{t.tdeeNote}</p>
                    <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:12}}>
                      <div style={{background:redBg,borderRadius:8,padding:"8px 14px",border:"1px solid "+redBo}}><p style={{fontSize:10,color:red,margin:"0 0 2px",textTransform:"uppercase",fontWeight:600}}>{t.min}</p><p style={{fontSize:16,fontWeight:700,color:red,margin:0}}>{r.min}</p></div>
                      <div style={{background:greenBg,borderRadius:8,padding:"8px 14px",border:"1px solid "+greenBo}}><p style={{fontSize:10,color:green,margin:"0 0 2px",textTransform:"uppercase",fontWeight:600}}>{t.norm}</p><p style={{fontSize:16,fontWeight:700,color:green,margin:0}}>{r.norm}</p></div>
                      <div style={{background:"#fff7ed",borderRadius:8,padding:"8px 14px",border:"1px solid #fed7aa"}}><p style={{fontSize:10,color:"#ea580c",margin:"0 0 2px",textTransform:"uppercase",fontWeight:600}}>{t.max}</p><p style={{fontSize:16,fontWeight:700,color:"#ea580c",margin:0}}>{r.max}</p></div>
                    </div>
                  </div>
                  <p style={{fontSize:12,color:textSub,textAlign:"center",margin:"0 0 16px"}}>TDEE: {r.tdee} kcal/day</p>
                  <Btn onClick={function(){applyCal(r);}} v="pri" s={{width:"100%",padding:"13px",fontSize:15,marginBottom:10}}>{t.applyNorm} ✓</Btn>
                  <Btn onClick={function(){mu({wiz:null});}} s={{width:"100%",padding:"11px",fontSize:14}}>{t.cancel}</Btn>
                </Sheet>
              );
            })()}
          </div>
        )}

        {ui.hPopup&&(function(){
          var h=st.habits.find(function(x){return x.id===ui.hPopup.id;});
          if(!h)return null;
          var tgt=ui.hPopup.target||1;
          var isMulti=tgt>1;
          var pct=isMulti?Math.min(Math.round((ui.hPopup.count||0)/tgt*100),100):ui.hPopup.pct;
          var gList=[{max:0,g:"-"},{max:10,g:"F"},{max:20,g:"E"},{max:30,g:"D-"},{max:40,g:"D"},{max:50,g:"C"},{max:60,g:"B-"},{max:70,g:"B"},{max:80,g:"B+"},{max:90,g:"A-"},{max:99,g:"A"},{max:100,g:"A+"}];
          var ge=gList.slice().reverse().find(function(g){return pct>=g.max;})||gList[0];
          var grade=ge?ge.g:"-",gCol=pct>=90?green:pct>=60?yellow:pct>=30?"#f97316":red;
          return(
            <Sheet z={1000} onClose={function(){mu({hPopup:null});}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <span style={{fontSize:28}}>{h.emoji}</span>
                <div style={{flex:1}}><p style={{fontSize:16,fontWeight:700,margin:"0 0 2px",color:textMain}}>{h.name}</p><p style={{fontSize:12,color:textSub,margin:0}}>{isMulti?t.howManyDone:t.howMuch}</p></div>
                <div style={{textAlign:"center",minWidth:56}}><p style={{fontSize:32,fontWeight:900,color:gCol,margin:0,lineHeight:1}}>{grade}</p><p style={{fontSize:11,color:textSub,margin:"2px 0 0"}}>{pct}%</p></div>
              </div>
              {isMulti?(
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,marginBottom:20}}>
                    <IBtn onClick={function(){var c=Math.max(0,(ui.hPopup.count||0)-1);mu({hPopup:Object.assign({},ui.hPopup,{count:c})});}} sz={52} s={{fontSize:28,borderRadius:16}}>&#8722;</IBtn>
                    <div style={{textAlign:"center",minWidth:80}}>
                      <p style={{fontSize:52,fontWeight:900,color:textMain,margin:0,lineHeight:1}}>{ui.hPopup.count||0}</p>
                      <p style={{fontSize:13,color:textSub,margin:"4px 0 0"}}>{t.timesOf} {tgt}</p>
                    </div>
                    <IBtn onClick={function(){var c=Math.min(tgt,(ui.hPopup.count||0)+1);mu({hPopup:Object.assign({},ui.hPopup,{count:c})});}} sz={52} s={{fontSize:28,borderRadius:16}}>+</IBtn>
                  </div>
                  <div style={{display:"flex",gap:3,marginBottom:20,alignItems:"flex-end",height:40}}>
                    {Array.from({length:tgt}).map(function(_,i){var filled=(ui.hPopup.count||0)>i,bc=filled?(pct<=30?red:pct<=60?yellow:green):border;return <div key={i} style={{flex:1,height:"100%",borderRadius:4,background:bc,transition:"background 0.15s"}}/>;} )}
                  </div>
                </div>
              ):(
                <div>
                  <div style={{display:"flex",gap:3,marginBottom:16,alignItems:"flex-end",height:40}}>
                    {[1,2,3,4,5,6,7,8,9,10].map(function(i){var bp=i*10,filled=pct>=bp,bc=bp<=30?red:bp<=60?yellow:green;return <div key={i} style={{flex:1,height:(18+i*2)+"px",borderRadius:4,background:filled?bc:border,transition:"background 0.15s"}}/>;} )}
                  </div>
                  <input type="range" min="0" max="100" step="10" value={pct} onChange={function(e){var v=parseInt(e.target.value),w2=Object.assign({},ui.hPopup);w2.pct=v;mu({hPopup:w2});}} style={{width:"100%",marginBottom:4,background:"linear-gradient(to right,#111827 "+pct+"%, "+border+" "+pct+"%)"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
                    {["0","","","","","50","","","","","100"].map(function(v,i){return <span key={i} style={{fontSize:9,color:textLight,minWidth:10,textAlign:"center"}}>{v}</span>;})}
                  </div>
                </div>
              )}
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={function(){isMulti?applyPct(h.id,(ui.hPopup.count||0)/tgt*100,tgt):applyPct(h.id,pct,tgt);}} v="pri" s={{flex:1,fontSize:15,padding:"12px"}}>{t.save} — {pct}%</Btn>
                <Btn onClick={function(){mu({hPopup:null});}}>{t.cancel}</Btn>
              </div>
            </Sheet>
          );
        })()}

        {ui.calPop&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"20px"}} onClick={function(){mu({calPop:false,calIn:""});}}>
            <div style={{background:card,borderRadius:20,width:"100%",maxWidth:340,padding:"24px",boxShadow:"0 8px 40px rgba(0,0,0,0.2)",textAlign:"center"}} onClick={function(e){e.stopPropagation();}}>
              <p style={{fontSize:32,margin:"0 0 8px"}}>🥗</p>
              <p style={{fontSize:17,fontWeight:700,color:textMain,margin:"0 0 4px"}}>{ui.calMode==="+"?t.tellAte:t.removingCal}</p>
              <p style={{fontSize:13,color:textSub,margin:"0 0 20px"}}>{ui.calMode==="+"?t.hopeTasty:t.removingFrom}</p>
              <input type="number" min="0" placeholder="kcal" value={ui.calIn} onChange={function(e){mu({calIn:e.target.value});}} autoFocus style={{width:"100%",fontSize:32,fontWeight:800,textAlign:"center",border:"2px solid "+border,borderRadius:12,padding:"12px",outline:"none",color:textMain,background:darkBg,boxSizing:"border-box",marginBottom:16,fontFamily:"inherit"}}/>
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={function(){var v=parseInt(ui.calIn)||0;if(v>0)addCal(ui.calMode==="+"?v:-v);mu({calPop:false,calIn:"",calMode:"+"});}} v="pri" s={{flex:1,fontSize:15,padding:"12px"}}>{ui.calMode==="+"?t.addKcal:t.removeKcal} {ui.calIn?ui.calIn+" kcal":"kcal"}</Btn>
                <Btn onClick={function(){mu({calPop:false,calIn:"",calMode:"+"});}}>{t.cancel}</Btn>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
