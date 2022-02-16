Vue.use(VueMaterial.default);
Vue.config.productionTip = false;

let data = {
  screen: 'mainMenu',
  chapter: null,
  chapterJSON: null,
  dialogue: null,
  box: 0,
  currCharacter: null,
  currStance: null,
  currText: null,
  currBG: null,
  currScript: null,
  currChoice: null,
  currInput: null,
  tempInput: "",
  fading: null,
  exitBox: null,
  ingoreNext: false,
}

let methods = {
  loadChapter(chapter){
    data.chapter = chapter;
    $.getJSON(`${chapter}/${chapter}.json`, json => {
      data.chapterJSON = json;
    });
    data.screen = 'game';
    data.dialogue = 'init';
    data.box = 0;
  },
  newClick(){
    methods.loadChapter('chapter1');
  },
  handleClick(force){
    force = force || false;
    if(Object.keys(computed.dJSON()).length > data.box + 1 && ((data.currChoice == null && data.currInput == null) || force)){
      if(data.ignoreNext) data.ignoreNext = false;
      else data.box++;
      if(force) data.ignoreNext = true;
      if(data.exitBox != null) data.exitBox();
      data.exitBox = null;
    }
  },
  eval: eval,
  toBranch(branch){
    data.dialogue = branch;
    data.box = 0;
  },
  inputDone(){
    data[data.currInput] = data.tempInput;
    data.tempInput = '';
    methods.handleClick(true);
  },
  choiceDone(){
    methods.handleClick(true);
  },
  fade(){
    data.fading = 'in';
    setTimeout(() => {
      data.fading = 'out'
    }, 200);
    setTimeout(() => {
      data.fading = null
    }, 600);
  }
}

let computed = {
  dJSON: () =>{return data.chapterJSON['dialogue'][data.dialogue]},
  bJSON: () =>{return computed.dJSON()[data.box]},
  bSCPT: () => {
    _temp = computed.bJSON()['script'] || computed.bJSON()['sc']
    if(_temp) data.currScript = _temp;
    eval(_temp);
    return data.currScript;
  },
  bCHR: () =>{
    _temp = computed.bJSON()['character'] || computed.bJSON()['c']
    if(_temp) data.currCharacter = _temp;
    return data.currCharacter;
  },
  bSTNC: () =>{
    _temp = computed.bJSON()['stance'] || computed.bJSON()['s']
    if(_temp) data.currStance = _temp;
    return data.currStance;
  },
  bIMG: () =>{return data.chapterJSON['characters'][computed.bCHR()][computed.bSTNC()]},
  bTEXT: () =>{
    _temp = computed.bJSON()['text'] || computed.bJSON()['t']
    if(_temp) data.currText = eval('`' + _temp + '`');
    return data.currText;
  },
  bBG: () =>{
    _temp = computed.bJSON()['background'] || computed.bJSON()['bg']
    if(_temp) data.currBG = _temp;
    return data.chapterJSON['backgrounds'][data.currBG];
  },
  bCHC: () => {
    _temp = computed.bJSON()['choice'] || computed.bJSON()['ch']
    if(_temp) data.currChoice = _temp;
    else data.currChoice = null;
    return data.currChoice;
  },
  bIN: () => {
    _temp = computed.bJSON()['input'] || computed.bJSON()['i']
    if(_temp){
      data.currInput = _temp;
      data[_temp] = null;
    }
    else data.currInput = null;
    return data.currInput;
  }

}

const vm = new Vue({
  el: '#app',
  data: data,
  methods: methods,
  computed: computed,
});
