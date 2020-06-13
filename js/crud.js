
//firebase設定
var firebaseConfig = {
  apiKey: "AIzaSyCyiyCli8HrNH9jlZbtmQRTUqVjM5M6g8A",
  authDomain: "chatapp15-7e968.firebaseapp.com",
  databaseURL: "https://chatapp15-7e968.firebaseio.com",
  projectId: "chatapp15-7e968",
  storageBucket: "chatapp15-7e968.appspot.com",
  messagingSenderId: "945594861782",
  appId: "1:945594861782:web:8e4a0cd5537593e5256177",
  measurementId: "G-3EF83FKKPV"
};

//firebase初期化
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db=firebase.firestore().collection('LTA')  //●●=コレクション名

// 日時をいい感じの形式にする関数
function convertFromFirestoreTimestampToDatetime(timestamp) {
  const _d = timestamp ? new Date(timestamp * 1000) : new Date();
  const Y = _d.getFullYear();
  const m = (_d.getMonth() + 1).toString().padStart(2, '0');
  const d = _d.getDate().toString().padStart(2, '0');
  const H = _d.getHours().toString().padStart(2, '0');
  const i = _d.getMinutes().toString().padStart(2, '0');
  const s = _d.getSeconds().toString().padStart(2, '0');
  return `${Y}/${m}/${d} ${H}:${i}:${s}`;
}

//記事を保存
function save(titleData,contentData){
  db.add({
    content:contentData,
    title:titleData,
    time:convertFromFirestoreTimestampToDatetime(jQuery . now().seconds)
  })
}

//記事一覧を表示
function show(){
  db.orderBy('time','desc').onSnapshot(function(querySnapshot){
    const dataArray=[]
    $('#article-list').find('li').remove()
    let i=0
    querySnapshot.docs.forEach(function(doc){
      const data=doc.data()
      const id=doc.id
      let title=data.title
      // let titleFront=title.substr(0,21)
      // let titleEnd=title.substr(21,40)
      // let makedTitle=titleFront+'<br>'+titleEnd
      // title=makedTitle
      // title=title.substr(0,10)+'...'
      const content=data.content
      let list=
                `<li id="${id}" class="article-lists">
                  <i class="far fa-play-circle voiceStart"></i>
                  <i class="far fa-pause-circle voicePause"></i>
                  <i class="far fa-play-circle voiceRestart"></i>
                  <input type="hidden" value="${content}">
                  <p class="title">${title}</p>
                  <i class="fas fa-trash"></i></li>`
      dataArray.push(list)
      i=i+1
    })
    $('#article-list').prepend(dataArray)

    //ポーズボタンとリスタートボタンを隠す
    setTimeout(function(){
      $('.voicePause').hide()
      $('.voiceRestart').hide()
      $('#continuous-play-pause').hide()
      $('#continuous-play-restart').hide()
    },10)
  })
  
}