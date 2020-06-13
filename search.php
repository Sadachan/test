<?php 
  //受け取ったURLを元に記事をスクレイピング
  require 'phpQuery-onefile.php';
  header('Content-type:application/json; charset=utf-8');
  $data = filter_input(INPUT_GET,'data');
  $html=@file_get_contents($data);
  $htmldoc=phpQuery::newDocument($html);

  //Wired用関連記事削除処理（タイトルと関連記事に同じh3タグを使ってるため）
  $htmldoc->find('.article-related')->remove();

  //記事を読むのに不要な確率が高い要素を削除
  $htmldoc->find('.date')->remove();
  $htmldoc->find('header')->remove();
  


  //タイトルを取得
  $title='';
  if(!($htmldoc->find("h1")=='')){
    $title=$htmldoc->find("h1");
    $htagNum=1;
  }else if(!($htmldoc->find("h2")=='')){
    $title=$htmldoc->find("h2");
    $htagNum=2;
  }else if(!($htmldoc->find("h3")=='')){
    $title=$htmldoc->find("h3");
    $htagNum=3;
  }
  $titleAmount=count($title);

  //もしタイトルらしきものが1つ以上あれば一番文字数が長いものをタイトルとする
   if($titleAmount > 1){
    for($i=0; $i < $titleAmount; $i++){
      $title=$htmldoc->find("h$htagNum:eq($i)"); 
      if($i==0){
        $this_is_title=$title;
      }
      if(strlen($this_is_title)<strlen($title)){
        $this_is_title=$title;
      }
    }
   }else{
    $this_is_title=$title;
   }
   
  //取得した記事のタイトルとコンテンツをjsに返す
  $content=$htmldoc->find("p")->text();
  $title=array($this_is_title->text());
  $param=array($title,$content);
  echo json_encode($param);
