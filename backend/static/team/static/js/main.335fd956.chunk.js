(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{23:function(e,t,n){e.exports=n(40)},32:function(e,t,n){},35:function(e,t,n){},36:function(e,t,n){},37:function(e,t,n){},38:function(e,t,n){},39:function(e,t,n){},40:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(20),c=n.n(o),s=n(2);n(32);var i=s.b(function(e){return{activeView:e.views.activeView}})(function(e){return r.a.createElement(e.activeView,null)}),u=n(1),m=n.n(u),l=n(9),f={API_URL:"http://51.75.74.95:3000",WS_URL:"ws://51.75.74.95:3000"},p={MSG_APPROVAL:"The quizmaster needs to approve your team!",MSG_KICKED:"The quizmaster has removed team your team from the game!",MSG_ACCEPTED:"The quizmaster has accepted your team! The game starts soon...",MSG_QUIZMASTERLEFT:"The quizmaster has closed the game!",MSG_SELECTINGCATEGORIES:"The quizmaster is selecting categories for the next round!",MSG_QUESTIONANSWERED:"Waiting for next question...",MSG_ANSWERCORRECT:"Your answer is correct!",MSG_ANSWERINCORRECT:"Your answer is incorrect!",MSG_SUBMITCLOSED:"Waiting for the next question"},E={VIEW_LOGINSCREEN:1,VIEW_MESSAGESCREEN:2,VIEW_QUESTIONSCREEN:3};function h(){return{type:E.VIEW_LOGINSCREEN}}function d(e){return{type:E.VIEW_MESSAGESCREEN,message:e}}function v(){return{type:E.VIEW_QUESTIONSCREEN}}function b(e,t){return function(n){switch(e){case"REGISTER":n(d(t?p.MSG_ACCEPTED:p.MSG_APPROVAL));break;case"CATEGORY_SELECT":n(d(p.MSG_SELECTINGCATEGORIES));break;case"IN_ROUND":n(v());break;case"END_ROUND":n(d("END ROUND!"));break;case"SUBMIT_CLOSED":n(d(p.MSG_SUBMITCLOSED));break;default:n(h())}}}var S=n(22),w=n(10),O=n(3),y=n(14),g=n(4),R=n(5),N=n(7),_=n(6),j=n(8),C=(n(35),function(e){function t(e){var n;return Object(g.a)(this,t),(n=Object(N.a)(this,Object(_.a)(t).call(this,e))).state={roomKey:"",teamName:""},n}return Object(j.a)(t,e),Object(R.a)(t,[{key:"handleInput",value:function(e){var t=e.target,n=t.value,a=t.name;this.setState(Object(y.a)({},a,n))}},{key:"submitForm",value:function(e){e.preventDefault(),""===this.state.roomKey||""===this.state.teamName?console.log("Vul alle velden in!"):this.props.joinRoom(this.state.roomKey,this.state.teamName)}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"Login"},r.a.createElement("header",null,r.a.createElement("h1",null,"Are you ready for Shotz?")),r.a.createElement("main",null,r.a.createElement("div",{className:"inputField"},r.a.createElement("label",{htmlFor:"roomKey"},"Room code:"),r.a.createElement("input",{value:this.state.roomKey,onChange:function(t){return e.handleInput(t)},id:"roomKey",name:"roomKey",placeholder:"Room code",autoComplete:"off"})),r.a.createElement("div",{className:"inputField"},r.a.createElement("label",{htmlFor:"teamName"},"Team name:"),r.a.createElement("input",{value:this.state.teamName,onChange:function(t){return e.handleInput(t)},id:"teamName",name:"teamName",placeholder:"Team name",autoComplete:"off"})),r.a.createElement("div",{className:"inputField"},r.a.createElement("button",{onClick:function(t){return e.submitForm(t)}},"Join quizz"))))}}]),t}(r.a.Component));var k=s.b(function(e){return{}},function(e){return{joinRoom:function(t,n){return e(function(e,t){var n={method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({teamName:t})};return function(t){fetch("".concat(f.API_URL,"/room/").concat(e),n).then(function(){var e=Object(l.a)(m.a.mark(function e(n){var a;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.json();case 2:if(a=e.sent,!n.ok){e.next=9;break}t((r=a.roomKey,o=a.teamName,{type:"team_joinRoom",roomKey:r,teamName:o})),t(d(p.MSG_APPROVAL)),t(V()),e.next=10;break;case 9:throw new Error(a.error);case 10:case"end":return e.stop()}var r,o},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){t(W(e.message))})}}(t,n))}}})(C),T=(n(36),n(37),function(e){function t(){return Object(g.a)(this,t),Object(N.a)(this,Object(_.a)(t).apply(this,arguments))}return Object(j.a)(t,e),Object(R.a)(t,[{key:"leaveRoom",value:function(e){e?this.props.leaveRoom(e):this.props.viewLoginScreenAction()}},{key:"render",value:function(){var e=this;return r.a.createElement("nav",null,r.a.createElement("div",{className:"navInner"},r.a.createElement("div",{className:"navLeft"},r.a.createElement("button",{onClick:function(){return e.leaveRoom(e.props.roomKey)}},"Leave")),null!==this.props.roomKey&&r.a.createElement("div",{className:"navMiddle"},r.a.createElement("h2",null,"Team: ",this.props.teamName)),null!==this.props.roomKey&&r.a.createElement("div",{className:"navRight"},r.a.createElement("span",null,"Room: ",this.props.roomKey))))}}]),t}(r.a.Component));var I=s.b(function(e){return{roomKey:e.game.roomKey,teamName:e.game.teamName}},function(e){return{leaveRoom:function(t){return e(function(e){return function(t){fetch("".concat(f.API_URL,"/room/").concat(e),{method:"DELETE",credentials:"include"}).then(function(){var e=Object(l.a)(m.a.mark(function e(n){var a;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.json();case 2:if(a=e.sent,!n.ok){e.next=8;break}t(h()),t({type:"team_leaveRoom"}),e.next=9;break;case 8:throw new Error(a.error);case 9:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){t(W(e.message))})}}(t))},viewLoginScreenAction:function(){return e(h())}}})(T),A=function(e){function t(){return Object(g.a)(this,t),Object(N.a)(this,Object(_.a)(t).apply(this,arguments))}return Object(j.a)(t,e),Object(R.a)(t,[{key:"leaveRoom",value:function(e){e?this.props.leaveGame(e):this.props.viewLoginScreenAction()}},{key:"render",value:function(){return r.a.createElement("div",{className:"Message Component"},r.a.createElement(I,null),r.a.createElement("main",null,r.a.createElement("div",{className:"messageBox"},r.a.createElement("h2",null,this.props.messageScreenText))))}}]),t}(r.a.Component);var G=s.b(function(e){return{roomKey:e.game.roomKey,messageScreenText:e.views.messageScreenText}},function(e){return{}})(A),x=(n(38),function(e){function t(e){var n;return Object(g.a)(this,t),(n=Object(N.a)(this,Object(_.a)(t).call(this,e))).state={answer:null},n}return Object(j.a)(t,e),Object(R.a)(t,[{key:"handleInput",value:function(e){this.setState({answer:e.target.value})}},{key:"submitAnswer",value:function(e){e.preventDefault(),""===this.state.answer||null===this.state.answer?console.log("Vul alle velden in!"):this.props.submitAnswer(this.props.roomKey,this.props.question.questionId,this.state.answer)}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"Component Question"},r.a.createElement(I,null),r.a.createElement("main",null,r.a.createElement("h1",{className:"question"},this.props.question.question),r.a.createElement("h2",{className:"category"},this.props.question.category),r.a.createElement("div",{className:"inputField"},r.a.createElement("label",{htmlFor:"answer"},"Answer:"),r.a.createElement("input",{onChange:function(t){return e.handleInput(t)},id:"answer",name:"answer",placeholder:"Your answer",autoComplete:"off"})),r.a.createElement("div",{className:"inputField"},r.a.createElement("button",{onClick:function(t){return e.submitAnswer(t)}},"Submit"))))}}]),t}(r.a.Component));var M=s.b(function(e){return{roomKey:e.game.roomKey,question:e.game.question}},function(e){return{submitAnswer:function(t,n,a){return e(function(e,t,n){return function(a){var r={method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({answer:n})};fetch("".concat(f.API_URL,"/room/").concat(e,"/round/question/").concat(t,"/answer"),r).then(function(){var e=Object(l.a)(m.a.mark(function e(t){var n;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.json();case 2:if(n=e.sent,t.ok){e.next=7;break}throw new Error(n.error);case 7:a(d(p.MSG_QUESTIONANSWERED)),a(V());case 9:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){a(W(e.message))})}}(t,n,a))}}})(x),K={activeView:k,messageScreenText:"If you see this, something went wrong!",wsAllowed:!1};var L={roomKey:null,teamName:null,accepted:!1,rejected:!1,question:null,error:""};var q=w.c({views:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:K,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case E.VIEW_LOGINSCREEN:return Object(O.a)({},e,{activeView:k,wsAllowed:!1});case E.VIEW_MESSAGESCREEN:return Object(O.a)({},e,{activeView:G,messageScreenText:t.message,wsAllowed:!0});case E.VIEW_QUESTIONSCREEN:return Object(O.a)({},e,{activeView:M,wsAllowed:!0});default:return e}},game:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:L,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"ADD_ERROR":return Object(O.a)({},e,{error:t.error});case"REMOVE_ERROR":return Object(O.a)({},e,{error:""});case"team_joinRoom":return Object(O.a)({},e,{roomKey:t.roomKey,teamName:t.teamName});case"team_restoreSession":return Object(O.a)({},e,{roomKey:t.roomKey,teamName:t.teamName,accepted:t.accepted,question:t.question});case"team_accepted":return Object(O.a)({},e,{accepted:!0});case"team_rejected":return Object(O.a)({},L,{rejected:!0});case"team_leaveRoom":return Object(O.a)({},L);case"team_setQuestion":return Object(O.a)({},e,{question:t.question});default:return Object(O.a)({},e)}}}),U=Object(w.d)(q,Object(w.a)(S.a)),D=0;function V(){return console.log("Connecting to socket"),function(){var e=Object(l.a)(m.a.mark(function e(t){var n;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new WebSocket("".concat(f.WS_URL,"/ws"));case 2:(n=e.sent).onopen=function(){console.log("Websocket connected"),D=0},n.onmessage=function(e){var n,a=JSON.parse(e.data);t((n=a,function(e){switch(n.type){case"team_accepted":e(d(p.MSG_ACCEPTED)),e({type:"team_accepted"});break;case"team_rejected":e(d(p.MSG_KICKED)),e({type:"team_rejected"});break;case"team_selectingCategories":e(d(p.MSG_SELECTINGCATEGORIES));break;case"team_endRound":e((t=U.getState().game.roomKey,a=U.getState().game.teamName,function(e){fetch("".concat(f.API_URL,"/room/").concat(t,"/teams/scores"),{method:"GET",credentials:"include",headers:{"Content-Type":"application/json"}}).then(function(){var t=Object(l.a)(m.a.mark(function t(n){var r,o,c,s;return m.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.json();case 2:if(r=t.sent,!n.ok){t.next=10;break}o=r.slice().sort(function(e,t){return e.score>t.score?-1:e.score<t.score?1:0}),c=o.find(function(e){return e.teamName===a}),s=o.findIndex(function(e){return e.teamName===a})+1,e(d("End round! Your score is: ".concat(c.score,". Your position is ").concat(s,"."))),t.next=11;break;case 10:throw new Error(r.error);case 11:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()).catch(function(t){e(W(t.message))})}));break;case"team_quizmasterLeft":e(d(p.MSG_QUIZMASTERLEFT)),e((U.getState().game.roomKey,{type:"team_leaveRoom"}));break;case"team_nextQuestion":e(function(e){return function(t){fetch("".concat(f.API_URL,"/room/").concat(e,"/round/question"),{method:"GET",credentials:"include"}).then(function(){var e=Object(l.a)(m.a.mark(function e(n){var a;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.json();case 2:if(a=e.sent,!n.ok){e.next=8;break}t({type:"team_setQuestion",question:a}),t(v()),e.next=9;break;case 8:throw new Error(a.error);case 9:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){t(W(e.message))})}}(U.getState().game.roomKey));break;case"team_answerCorrect":e(d(p.MSG_ANSWERCORRECT));break;case"team_answerIncorrect":e(d(p.MSG_ANSWERINCORRECT));break;case"team_submitClosed":e(d(p.MSG_SUBMITCLOSED));break;default:console.log("Unknown message: ",n)}var t,a}))},n.onclose=function(){D<3&&U.getState().views.wsAllowed?(console.log("Trying to reconnect"),D++,setTimeout(function(){t(V())},5e3)):console.log("Websocket connection could not be restored")};case 6:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()}function W(e){return{type:"ADD_ERROR",error:e}}n(39);var P=function(e){function t(){return Object(g.a)(this,t),Object(N.a)(this,Object(_.a)(t).apply(this,arguments))}return Object(j.a)(t,e),Object(R.a)(t,[{key:"getError",value:function(){var e=this;return""!==this.props.error&&r.a.createElement("div",{className:"Error"},r.a.createElement("h2",null,this.props.error),r.a.createElement("button",{onClick:function(){return e.props.removeError(e.props.error)}},r.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},r.a.createElement("path",{d:"M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"}))))}},{key:"render",value:function(){return this.getError()}}]),t}(r.a.Component);var F=s.b(function(e){return{error:e.game.error}},function(e){return{removeError:function(t){return e(function(e){return{type:"REMOVE_ERROR",error:e}}(t))}}})(P),Q=r.a.createElement(s.a,{store:U},r.a.createElement(i,null),r.a.createElement(F,null));U.dispatch(function(){var e={method:"GET",credentials:"include"};return function(t){fetch("".concat(f.API_URL,"/room/restore/ROLE_TEAM"),e).then(function(){var e=Object(l.a)(m.a.mark(function e(n){var a;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.json();case 2:if(a=e.sent,n.ok){e.next=7;break}throw new Error(a.error);case 7:t((r=a.roomKey,o=a.teamName,c=a.accepted,s=a.question,{type:"team_restoreSession",roomKey:r,teamName:o,accepted:c,question:s})),t(b(a.gameState,a.accepted)),t(V());case 10:case"end":return e.stop()}var r,o,c,s},e)}));return function(t){return e.apply(this,arguments)}}()).catch(function(e){console.log(e.message)})}}()),c.a.render(Q,document.getElementById("root"))}},[[23,1,2]]]);
//# sourceMappingURL=main.335fd956.chunk.js.map